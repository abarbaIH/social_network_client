import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { useParams } from "react-router-dom";
import UserList from "../user/UserList";
import useAuth from "../../hooks/useAuth";

const Following = () => {

    const { auth } = useAuth()
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [morePeople, setMorePeople] = useState(true)
    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(true)
    const params = useParams()


    useEffect(() => {
        getUsers(1)
    }, [])

    const getUsers = async (nextPage = 1) => { // la pagina por defecto debe ser 1

        // Sacar userId de la URL
        const userId = params.userId

        // Petición al backend para sacar user
        const request = await fetch(`${Global.url}follow/followingList/${userId}/${nextPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()

        // Recorrer y limpiar data.usersFollowingList para quedarme con la propiedad followed
        let cleanUsers = []
        data.usersFollowingList.forEach(follow => {
            cleanUsers = [...cleanUsers, follow.followed]
        })

        data.users = cleanUsers

        // Crear un estadao para poder listarlos
        if (data.users && data.status == "success") {

            // Todo esto es para el botón de ver más personas, para que añada a los que ya hay nuevos usuarios
            let newUsers = data.users
            if (users.length >= 1) {
                newUsers = [...users, ...data.users]
            }

            setUsers(newUsers)
            setFollowing(data.user_following)
            setLoading(false)

            // Para que desaparezca el botón de ver mas personas
            if (users.length >= (data.totalPages - data.users.length)) {
                setMorePeople(false)
            }

        }


    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Usuarios seguidos por {auth.nickName}</h1>
            </header>


            <UserList
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                loading={loading}
                morePeople={morePeople}
                page={page}
                setPage={setPage}
            />

        </>
    )
}

export default Following