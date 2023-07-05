import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Logout = () => {

    const navigate = useNavigate()
    const { setAuth, setUserCounters } = useAuth()

    useEffect(() => {
        logoutMethod()
    })

    const logoutMethod = () => {
        // Vaciar localstorage
        localStorage.clear()

        // Setear estados Globales a vacío
        setAuth({})
        setUserCounters({})

        // Navigate a login
        navigate("/login")
    }

    return (
        <h1>Cerrando sesión...</h1>
    )
}

export default Logout