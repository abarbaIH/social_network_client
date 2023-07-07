import React from "react";
import avatar from './../../assets/img/user.png'
import { Global } from "../../helpers/Global";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ReactTimeAgo from "react-time-ago";

const PublicationList = ({ publications, getPublications, setPage, page, morePublications, setMorePublications }) => {

    const { auth } = useAuth()

    const deletePublication = async (publicationId) => {
        const request = await fetch(`${Global.url}publication/deletePublication/${publicationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        getPublications(1, true)
        setPage(1)
        setMorePublications(true)
    }

    const nextPage = () => {
        let next = page + 1
        setPage(next)
        getPublications(next) // le pasamos como parámetro la siguiente pagina
    }

    return (
        <>
            <div className="content__posts">

                {publications.map(publication => {
                    return (
                        <article className="posts__post" key={publication._id}>

                            <div className="post__container">

                                <div className="post__image-user">

                                    <Link to={`/social/profile/${publication.user._id}`} className="post__image-link">
                                        {publication.user.avatar != "default.png" && <img src={`${Global.url}user/avatar/${publication.user.avatar}`} className="post__user-image" alt="Foto de perfil" />}
                                        {publication.user.avatar == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={`/social/profile/${publication.user._id}`} className="user-info__name">{publication.user.firstName + " " + publication.user.lastName}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link href="#" className="user-info__create-date"> <ReactTimeAgo date={publication.created_at} locale="es-Es" /> </Link>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                    {publication.file &&
                                        <img src={`${Global.url}publication/showPublicationFile/${publication.file}`} />
                                    }

                                </div>

                            </div>

                            {auth._id == publication.user._id &&

                                <div className="post__buttons">

                                    <button href="#" className="post__button" onClick={() => deletePublication(publication._id)}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>

                                </div>
                            }

                        </article>
                    )
                })}

            </div>

            {morePublications &&

                <div className="content__container-btn">
                    <button className="content__btn-more-post" style={{ marginBottom: "50px" }} onClick={nextPage}>
                        Ver mas publicaciones
                    </button>
                </div>}

        </>
    )
}

export default PublicationList