import React from 'react';
import avatar from './../../assets/img/user.png'
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { Link } from 'react-router-dom';

const UserList = ({ users, getUsers, following, setFollowing, loading, morePeople, page, setPage }) => {


    const { auth } = useAuth()

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
            <div className="content__posts">

                {/* {loading ? <h1>Cargando</h1> : ""} */}

                {users.map(user => {

                    return (
                        <article key={user._id} className="content__posts">

                            <div className="posts__post">

                                <div className="post__container">

                                    <div className="post__image-user">
                                        <Link to={`/social/profile/${user._id}`} className="post__image-link">

                                            {user.avatar != "default.png" && <img src={`${Global.url}user/avatar/${user.avatar}`} className="post__user-image" alt="Foto de perfil" />}
                                            {user.avatar == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}

                                        </Link>
                                    </div>

                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <Link to={`/social/profile/${user._id}`} className="user-info__name">{user.firstName} {user.lastName}</Link>
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
            </div>


            {loading ? <h1>Cargando</h1> : ""}


            {morePeople &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage} style={{ marginBottom: "50px" }}>
                        Ver mas Personas
                    </button>
                </div>
            }
        </>

    )


}

export default UserList