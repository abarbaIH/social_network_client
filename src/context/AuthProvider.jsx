import React, { useState, useEffect, createContext } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [userCounters, setUserCounters] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        authUser()
    }, [])

    const authUser = async () => {
        // Sacar datos del usuario identificado del localstorage
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")

        // Comprobar si tengo el token y el user y si no que detenga la ejecución del metodo
        if (!token || !user) {
            setLoading(false)
            return false
        }

        // Transformar los datos a un objeto de javascript
        const userObj = JSON.parse(user)
        const userId = userObj.id

        // Hacer petición ajax al backend para comprobar el token
        const request = await fetch(`${Global.url}user/profile/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        // Devolver todos los datos del usuario
        const data = await request.json()

        // Petición ajax para los contadores
        const counterRequest = await fetch(`${Global.url}user/counter/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        // Devolver todos los datos de los counters

        const dataCounters = await counterRequest.json()
        // console.log(dataCounters)

        // Setear el auth
        setAuth(data.user)

        // Setear los counters
        setUserCounters(dataCounters)

        // Setear el loading
        setLoading(false)

    }

    return (
        <AuthContext.Provider
            // Le pasamos los datos que queremos que estén presentes en sus componentes hijos, en este caso el auth y el metodo setAuth y los userCounters y loading
            value={{
                auth,
                setAuth,
                userCounters,
                setUserCounters,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext