import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import UserList from "./UserList";

const People = () => {

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

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Gente</h1>
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

export default People