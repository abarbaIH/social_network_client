import React from "react";
import Navigation from "./Navigation";
import { NavLink } from "react-router-dom";

const Header = () => {

    return (

        <header className="layout__navbar">
            <div className="navbar__header">
                <NavLink to="/" className="navbar__title">REACTSOCIAL</NavLink>
            </div>

            <Navigation />

        </header>

    )
}

export default Header