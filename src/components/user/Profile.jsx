import React, { useEffect, useState } from "react";
import avatar from './../../assets/img/user.png'
import { GetProfile } from "../../helpers/GetProfile";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import PublicationList from "../publication/PublicationList";

const Profile = () => {

    const { auth } = useAuth()
    const [user, setUser] = useState({})
    const params = useParams()
    const [iFollow, setIFollow] = useState(false)
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [counters, setCounters] = useState({})
    const [morePublications, setMorePublications] = useState(true)

    useEffect(() => {
        getDataUser()
        getCounters()
        getPublications(1, true) // le pasamos el newUser a true, de forma que cuando se carga el componente lo pone en true
    }, [])

    useEffect(() => {
        getDataUser()
        getCounters()
        setMorePublications(true) // cuando se cambie de user, cambiamos este estado para que se muestre el boton
        getPublications(1, true) // le pasamos el newUser a true, de forma que cuando se modifica el perfil, newUser sea true y se renueven las publicaciones
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

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(`${Global.url}publication/userPublicationList/${params.userId}/${nextPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        console.log(data)

        if (data.status == "success") {

            let newPublications = data.publicacionList

            if (!newProfile && publications.length >= 1) { // lo del newProfile es para saber si has entrado a un perfil nuevo o no
                newPublications = [...publications, ...data.publicacionList]
            }

            if (newProfile == true) {
                newPublications = data.publicacionList // si hay un newUser, lo que hacemos es resetear la publicaciones de nuevo
                setMorePublications(true) // para que nos vuelva a mostrar el boton 
                setPage(1) // actualizamos la pagina a 1 cuando haya un nuevo usuario
            }

            setPublications(newPublications)

            if (!newProfile && publications.length >= (data.totalPages - data.publicacionList.length)) { // analizamos también si no es un nuevo perfil
                setMorePublications(false)
            }

            if (data.totalPages <= 1) {
                setMorePublications(false)
            }
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

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                setPage={setPage}
                page={page}
                morePublications={morePublications}
                setMorePublications={setMorePublications} />

        </>

    )
}

export default Profile