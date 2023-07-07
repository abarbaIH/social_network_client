import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import avatar from './../../assets/img/user.png'
import { Global } from "../../helpers/Global";
import { SerializeForm } from "../../helpers/SerializeForm";

const Config = () => {

    const [userSaved, setUserSaved] = useState("not_sended")

    const { auth, setAuth } = useAuth()

    const updateUser = async (e) => {

        e.preventDefault()
        // recoger los datos del formulario y eliminar la propiedad de imagen
        let updateDataUser = (SerializeForm(e.target)) // le pasamos el objeto completo que exporta el helper Serialice form
        delete updateDataUser.file0 // le quitamos la imagen ya que no se actualizará por aquí

        //Actualizar usuario en db con petición ajax
        const request = await fetch(`${Global.url}user/update`, {
            method: "PUT",
            body: JSON.stringify(updateDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        if (data.status == "success" && data.user) {
            delete data.user.password // PARA QUE NO DEVUELVA LA CONTRASEÑA
            setAuth(data.user)
            setUserSaved("saved")

        } else {
            setUserSaved("error")
        }

        // Subida de imagenes
        // seleccionar el campo
        const fileInput = document.querySelector("#file") // seleccionamos el campo de subida de imagen con el id que tiene el input

        if (data.status == "success" && fileInput.files[0]) { // si la request ha ido bien y el campo de imagen tiene una imagen...

            // recoger imagen a subir, creamos un "formulario virtual con new FormData" y le añadimos el fichero de imagen a la propiedad file0
            const formData = new FormData()
            formData.append("file0", fileInput.files[0])

            // hacer peticción ajax para enviar el fichero al backend y que lo guarde
            const uploadRequest = await fetch(`${Global.url}user/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    // "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            const updloadData = await uploadRequest.json()

            if (updloadData.status == "success" && updloadData.user) {
                delete updloadData.user.password
                setAuth(updloadData.user)
                setUserSaved("saved")
            } else {
                setUserSaved("error")
            }

        } else {
            setUserSaved("error")
        }

    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Ajustes de Usuario</h1>
            </header>

            <div className="content__posts">

                {userSaved == "saved" ?
                    <strong className="alert alert-success"> Usuario actualizado correctamente</strong>
                    : ""}
                {userSaved == "error" ?
                    <strong className="alert alert-danger"> Ha habido un error durante la actualización</strong>
                    : ""}

                <form className="config-form" onSubmit={updateUser}>

                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input type="text" name="firstName" defaultValue={auth.firstName} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input type="text" name="lastName" defaultValue={auth.lastName} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nickName">Nick</label>
                        <input type="text" name="nickName" defaultValue={auth.nickName} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Biografía</label>
                        <textarea name="bio" defaultValue={auth.bio} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" defaultValue={auth.email} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="file0">Avatar</label>

                        <div className="general-info__container-avatar">
                            {auth.avatar != "default.png" && <img src={`${Global.url}user/avatar/${auth.avatar}`} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.avatar == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>

                        <input type="file" name="file0" id="file" style={{ marginBottom: "20px", marginTop: "20px" }} />
                    </div>

                    <input type="submit" value="Guardar Cambios" className="btn btn-success" />

                </form>

            </div>
        </>

    )
}

export default Config