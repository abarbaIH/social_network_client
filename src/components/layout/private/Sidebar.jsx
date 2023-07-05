import React from "react";
import avatar from './../../../assets/img/user.png'
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";

const Sidebar = () => {

    const { auth, userCounters } = useAuth() // nos traemos del hook useAuth el objeto auth y userCounters
    // console.log(auth, userCounters)

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
                                {auth.avatar != "default.png" && <img src={`${Global.url}user/avatar/${auth.avatar}`} className="container-avatar__img" alt="Foto de perfil" />}
                                {auth.avatar == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                            </div>

                            <div className="general-info__container-names">
                                <a href="#" className="container-names__name">{auth.firstName} {auth.lastName}</a>
                                <p className="container-names__nickname">{auth.nickName}</p>
                            </div>
                        </div>

                        <div className="profile-info__stats">

                            <div className="stats__following">
                                <a href="#" className="following__link">
                                    <span className="following__title">Siguiendo</span>
                                    <span className="following__number">{userCounters.following}</span>
                                </a>
                            </div>
                            <div className="stats__following">
                                <a href="#" className="following__link">
                                    <span className="following__title">Seguidores</span>
                                    <span className="following__number">{userCounters.followed}</span>
                                </a>
                            </div>


                            <div className="stats__following">
                                <a href="#" className="following__link">
                                    <span className="following__title">Publicaciones</span>
                                    <span className="following__number">{userCounters.publications}</span>
                                </a>
                            </div>


                        </div>
                    </div>


                    <div className="aside__container-form">

                        <form className="container-form__form-post">

                            <div className="form-post__inputs">
                                <label htmlFor="post" className="form-post__label">¿Que estas pesando hoy?</label>
                                <textarea name="post" className="form-post__textarea"></textarea>
                            </div>

                            <div className="form-post__inputs">
                                <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                                <input type="file" name="image" className="form-post__image" />
                            </div>

                            <input type="submit" value="Enviar" className="form-post__btn-submit" disabled />

                        </form>

                    </div>

                </div>

            </aside>
        </>
    )
}

export default Sidebar