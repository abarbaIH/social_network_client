import React, { useEffect, useState } from "react";
import avatar from './../../assets/img/user.png'
import { GetProfile } from "../../helpers/GetProfile";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

const Profile = () => {

    const { auth } = useAuth()
    const [user, setUser] = useState({})
    const params = useParams()
    const [iFollow, setIFollow] = useState(false)
    const [counters, setCounters] = useState({})

    useEffect(() => {
        getDataUser()
        getCounters()
    }, [])

    useEffect(() => {
        getDataUser()
        getCounters()
    }, [params])

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser)
        if (dataUser.following && dataUser.following._id) {
            setIFollow(true)
        }
    }

    const getCounters = async () => {

        const request = await fetch(`${Global.url}user/counter/${params.userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        console.log(data)

        if (data) {
            setCounters(data)
        }
    }


    const follow = async (userId) => {

        // Petición al backend
        const followRequest = await fetch(`${Global.url}follow/saveFollow`, {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await followRequest.json()

        if (data.status = "success") {
            // Actualizar el estado de following agreando el nuevo follow
            setIFollow(true)

        }
    }

    const unfollow = async (userId) => {

        // Petición al backend
        const unFollowRequest = await fetch(`${Global.url}follow/deleteFollow/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await unFollowRequest.json()

        if (data.status == "success") {
            setIFollow(false)
        }
    }


    return (
        <>

            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.avatar != "default.png" && <img src={`${Global.url}user/avatar/${user.avatar}`} className="container-avatar__img" alt="Foto de perfil" />}
                        {user.avatar == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{user.firstName} {user.lastName}</h1>

                            {user._id != auth._id &&
                                (iFollow
                                    ?
                                    <button className="content__button content__button--right post__button" onClick={() => unfollow(user._id)}>Dejar de Seguir</button>
                                    :
                                    <button className="content__button content__button--right" onClick={() => follow(user._id)}>Seguir</button>
                                )}

                        </div>
                        <h2 className="container-names__nickname">{user.nickName}</h2>
                        <p>{user.bio}</p>

                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={`/social/following/${user._id}`} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following < 1 ? 0 : counters.following}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={`/social/followers/${user._id}`} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed < 1 ? 0 : counters.followed}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={`/social/profile/${user._id}`} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications < 1 ? 0 : counters.publications}</span>
                        </Link>
                    </div>


                </div>
            </header>



            <div className="content__posts">

                <article className="posts__post">

                    <div className="post__container">

                        <div className="post__image-user">
                            <a href="#" className="post__image-link">
                                <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                            </a>
                        </div>

                        <div className="post__body">

                            <div className="post__user-info">
                                <a href="#" className="user-info__name">Victor Robles</a>
                                <span className="user-info__divider"> | </span>
                                <a href="#" className="user-info__create-date">Hace 1 hora</a>
                            </div>

                            <h4 className="post__content">Hola, buenos dias.</h4>

                        </div>

                    </div>

                    <div className="post__buttons">

                        <a href="#" className="post__button">
                            <i className="fa-solid fa-trash-can"></i>
                        </a>

                    </div>

                </article>



            </div>

            <div className="content__container-btn">
                <button className="content__btn-more-post">
                    Ver mas publicaciones
                </button>
            </div>
        </>

    )
}

export default Profile