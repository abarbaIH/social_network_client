import React, { useState } from "react";
import avatar from './../../../assets/img/user.png'
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";
import { Link } from "react-router-dom";
import useForm from "../../../hooks/useForm";

const Sidebar = () => {

    const { auth, userCounters } = useAuth() // nos traemos del hook useAuth el objeto auth y userCounters
    const { formData, changed } = useForm({}) // revisar el hook personalizado useForm
    const [publicationSaved, setPublicationSaved] = useState("not_sended")

    const savePublication = async (e) => {
        e.preventDefault()

        // Recoger los datos del formulario
        const newPublication = formData
        newPublication.user = auth._id

        // Hacer la peticion al backend
        const request = await fetch(`${Global.url}publication/savePublication`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()


        // Mostrar mensaje de exito o erro
        if (data.status == "success") {
            setPublicationSaved("saved")
        } else {
            setPublicationSaved("error")
        }

        // Subir imagen

        // Conseguir el campo de file del form
        const fileInput = document.querySelector("#file")

        // Comprobar si ha ido bien la consulta y si hay imagen
        if (data.status == "success" && fileInput.files[0]) {

            // Me creo un "formulario virtual" para añadirle la file que está en .files[0]
            const formData = new FormData
            formData.append("file0", fileInput.files[0])

            // hacemos la llamara a la api

            const fileRequest = await fetch(`${Global.url}publication/uploadPublicationFile/${data.publicationStored._id}`, {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })

            const fileData = await fileRequest.json()

            if (fileData.status == "success") {
                setPublicationSaved("saved")

            } else {
                setPublicationSaved("error")

            }
            if (data.status == "success" && fileData.status == "success") {
                document.querySelector("#publication-form").reset()
            }
        }

    }


    return (
        <>
            <aside className="layout__aside">

                <header className="aside__header">
                    <h1 className="aside__title">Hola, {auth.firstName} {auth.lastName}</h1>
                </header>

                <div className="aside__container">

                    <div className="aside__profile-info">

                        <div className="profile-info__general-info">
                            <div className="general-info__container-avatar">
                                <Link to={`profile/${auth._id}`}>
                                    {auth.avatar != "default.png" && <img src={`${Global.url}user/avatar/${auth.avatar}`} className="container-avatar__img" alt="Foto de perfil" />}
                                    {auth.avatar == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                                </Link>

                            </div>

                            <div className="general-info__container-names">
                                <Link to={`/social/profile/${auth._id}`} className="container-names__name">{auth.firstName} {auth.lastName}</Link>
                                <p className="container-names__nickname">{auth.nickName}</p>
                            </div>
                        </div>

                        <div className="profile-info__stats">

                            <div className="stats__following">
                                <Link to={`following/${auth._id}`} className="following__link">
                                    <span className="following__title">Siguiendo</span>
                                    <span className="following__number">{userCounters.following}</span>
                                </Link>
                            </div>
                            <div className="stats__following">
                                <Link to={`followers/${auth._id}`} className="following__link">
                                    <span className="following__title">Seguidores</span>
                                    <span className="following__number">{userCounters.followed}</span>
                                </Link>
                            </div>


                            <div className="stats__following">
                                <Link to={`profile/${auth._id}`} className="following__link">
                                    <span className="following__title">Publicaciones</span>
                                    <span className="following__number">{userCounters.publications}</span>
                                </Link>
                            </div>


                        </div>
                    </div>


                    <div className="aside__container-form">

                        {publicationSaved == "saved" ?
                            <strong className="alert alert-success"> Publicada correctamente!!</strong>
                            : ""}
                        {publicationSaved == "error" ?
                            <strong className="alert alert-danger"> No se ha podido subir la publicación</strong>
                            : ""}

                        <form id="publication-form" className="container-form__form-post" onSubmit={savePublication}>

                            <div className="form-post__inputs">
                                <label htmlFor="text" className="form-post__label">¿Que estas pesando hoy?</label>
                                <textarea name="text" className="form-post__textarea" onChange={changed} />
                            </div>

                            <div className="form-post__inputs">
                                <label htmlFor="file" className="form-post__label">Sube tu foto</label>
                                <input type="file" name="file0" id="file" className="form-post__image" />
                            </div>

                            <input type="submit" value="Enviar" className="form-post__btn-submit" />

                        </form>

                    </div>

                </div>

            </aside>
        </>
    )
}

export default Sidebar