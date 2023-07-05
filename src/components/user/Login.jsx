import React, { useState } from "react";
import useForm from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {

    const { formData, changed } = useForm({})
    const [userLogged, setUserLogged] = useState("not_sended")

    const { setAuth } = useAuth() // para setearme los datos del auth cuando te logueas

    const loginUser = async (e) => {
        e.preventDefault()

        // Ya tenemos aquí lso datos del formulario
        const userToLogin = formData

        // Hacemos la petición al backend
        const request = await fetch(`${Global.url}user/login`, {
            method: 'POST',
            body: JSON.stringify(userToLogin), // convertimos el objeto a JSON para que el backend lo pueda procesar
            headers: {
                "Content-Type": "application/json"
            }
        })

        // metemos en data el resultado de la petición
        const data = await request.json()


        if (data.status == "success") {
            // Persistir los datos en el navegador siempre que sea correcta
            localStorage.setItem("token", data.token) // almacenamos el token en el localstorage en "token"
            localStorage.setItem("user", JSON.stringify(data.user)) // almacenamos también el user en "user". Necesitamos hacer JSON.stringify para que no nos pase un object objetc

            setUserLogged("logged")

            // Setear los datos del usuario en el auth
            setAuth(data.user)

            // Redirección (lo que hacemos es recargar la pagina pasado un segundo y ccomo ya está el auth dentro no redirecciona directamente)
            setTimeout(() => {
                window.location.reload()
            }, 900)

        } else {
            setUserLogged("error")
        }

    }

    return (
        <>


            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                {userLogged == "logged" ?
                    <strong className="alert alert-success"> Usuario identificado correctamente</strong>
                    : ""}
                {userLogged == "error" ?
                    <strong className="alert alert-danger"> Ha habido un error durante el logueo</strong>
                    : ""}

                <form className="form-login" onSubmit={loginUser}>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" onChange={changed} />
                    </div>

                    <input className="btn btn-success" type="submit" value="Login" />

                </form>

            </div>
        </>
    )
}

export default Login