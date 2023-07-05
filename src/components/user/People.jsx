import React, { useEffect, useState } from "react";
import avatar from './../../assets/img/user.png'
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

const People = () => {

    const { auth } = useAuth()
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [morePeople, setMorePeople] = useState(true)
    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUsers(1)
    }, [])

    const getUsers = async (nextPage = 1) => { // la pagina por defecto debe ser 1

        // Petición al backend para sacar user
        const request = await fetch(`${Global.url}user/list/${nextPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        // Crear un estadao para poder listarlos
        if (data.usersList && data.status == "success") {

            // Todo esto es para el botón de ver más personas, para que añada a los que ya hay nuevos usuarios
            let newUsers = data.usersList
            if (users.length >= 1) {
                newUsers = [...users, ...data.usersList]
            }

            setUsers(newUsers)
            setFollowing(data.user_following)
            setLoading(false)
        }

        // Para que desaparezca el botón de ver mas personas
        if (users.length >= (data.total - data.usersList.length)) {
            setMorePeople(false)
        }
    }

    // Paginación
    const nextPage = () => {
        let next = page + 1
        setPage(next)
        getUsers(next) // vuelvo a ejecutar el getUsers para que añada los de la pagina siguiente
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
            setFollowing([...following, userId])

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
            const followingsFiltered = following.filter(followingUserId => userId !== followingUserId)
            // Actaulizar el estado de following, filtrando quitando el userId que acabo de dejar de seguir

            setFollowing(followingsFiltered)
        }


    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Gente</h1>
            </header>

            <div className="content__posts">

                {loading ? <h1>Cargando</h1> : ""}

                {users.map(user => {

                    return (
                        <article key={user._id} className="content__posts">

                            <div className="posts__post">

                                <div className="post__container">

                                    <div className="post__image-user">
                                        <a href="#" className="post__image-link">

                                            {user.avatar != "default.png" && <img src={`${Global.url}user/avatar/${user.avatar}`} className="post__user-image" alt="Foto de perfil" />}
                                            {user.avatar == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}

                                        </a>
                                    </div>

                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <a href="#" className="user-info__name">{user.firstName} {user.lastName}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date">{user.created_at}</a>
                                        </div>

                                        <h4 className="post__content">{user.bio}</h4>

                                    </div>

                                </div>

                                {user._id != auth._id &&
                                    <div className="post__buttons">

                                        {

                                            following.includes(user._id)

                                                ?

                                                <button className="post__button" onClick={() => unfollow(user._id)}>
                                                    Dejar de Seguir
                                                </button>
                                                :
                                                <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                                    Seguir
                                                </button>
                                        }

                                    </div>
                                }



                            </div>

                        </article>
                    )


                })}

                {loading ? <h1>Cargando</h1> : ""}


                {/* Quitar o poner el botón dependiendo si hay más o menos */}
                {morePeople &&
                    <div className="content__container-btn">
                        <button className="content__btn-more-post" onClick={nextPage} style={{ marginBottom: "50px" }}>
                            Ver mas Personas
                        </button>
                    </div>
                }
            </div>

        </>
    )
}

export default People