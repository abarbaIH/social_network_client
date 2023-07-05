import React, { useState } from "react";
import useForm from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

const Signup = () => {

    // Hook hecho por nosotros para generar el objeto con los cambios que se realizan en cada cambio (ver hooks/useForm)
    const { formData, changed } = useForm({})
    const [userSaved, setUserSaved] = useState("not_sended")

    // Método para guardar el user con el objeto que nos devuelve el hook useForm
    const saveUser = async (e) => {
        e.preventDefault()

        // metemos en una variable los datos del formulario
        const newUser = formData
        // console.log(newUser)

        // guardar usuario con petición al backend
        // creamos una petición a la api y la guardamos en la constante
        const request = await fetch(`${Global.url}user/signup`, {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        })
        // 
        const data = await request.json()

        if (data.status == "success") {
            setUserSaved("saved")
        } else {
            setUserSaved("error")
        }


    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Signup</h1>
            </header>

            <div className="content__posts">
                {userSaved == "saved" ?
                    <strong className="alert alert-success"> Usuario registrado correctamente</strong>
                    : ""}
                {userSaved == "error" ?
                    <strong className="alert alert-danger"> Ha habido un error durante el registro</strong>
                    : ""}

                <form className="register-form" onSubmit={saveUser}>

                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input type="text" name="firstName" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input type="text" name="lastName" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nickName">Nick</label>
                        <input type="text" name="nickName" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" onChange={changed} />
                    </div>

                    <input type="submit" value="Registro" className="btn btn-success" />


                </form>

            </div>
        </>
    )
}

export default Signup