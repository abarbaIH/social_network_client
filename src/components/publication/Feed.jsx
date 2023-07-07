import React, { useEffect, useState } from "react";
import avatar from './../../assets/img/user.png'
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import PublicationList from "./PublicationList";


const Feed = () => {

    const { auth } = useAuth()
    const params = useParams()
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [morePublications, setMorePublications] = useState(true)

    useEffect(() => {
        getPublications(1, false)
    }, [])

    const getPublications = async (nextPage = 1, showNews = false) => {

        if (showNews) {
            setPublications([])
            setPage(1)
            nextPage = 1
        }

        const request = await fetch(`${Global.url}publication/followingPublicationList/${nextPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()
        console.log(data)

        if (data.status == "success") {

            let newPublications = data.publications

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications]
            }

            setPublications(newPublications)

            if (!showNews && publications.length >= (data.totalPages - data.publications.length)) {
                setMorePublications(false)
            }

            if (data.totalPages <= 1) {
                setMorePublications(false)
            }
        }
    }


    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
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

export default Feed