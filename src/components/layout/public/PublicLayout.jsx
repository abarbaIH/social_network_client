import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import useAuth from "../../../hooks/useAuth";

const PublicLayout = () => {

    const { auth } = useAuth()

    return (
        <>
            {/* Definir Layout */}
            <Header />

            {/* Contenido Principal */}
            <section className="layout__content">
                {/* Para que, si no estás logueado que te mande al Outlet que sería lo publicco y si sí, que no te deje entrar en lo publicc(login, signup) */}
                {!auth._id ? <Outlet /> : <Navigate to="social" />}


            </section>

        </>
    )

}

export default PublicLayout