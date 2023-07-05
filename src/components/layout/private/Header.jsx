import React from "react";
import Navigation from "./Navigation";

const Header = () => {

    return (

        <header className="layout__navbar">
            <div className="navbar__header">
                <a href="#" className="navbar__title">REACTSOCIAL</a>
            </div>

            <Navigation />

        </header>

    )
}

export default Header