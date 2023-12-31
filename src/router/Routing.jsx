import React from "react";
import { Route, Routes, BrowserRouter, Navigate, Link } from "react-router-dom";
import Login from "../components/user/Login";
import Signup from "../components/user/Signup";
import PublicLayout from "../components/layout/public/PublicLayout";
import PrivateLayout from "../components/layout/private/PrivateLayout";
import Feed from "../components/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import Logout from "../components/user/Logout";
import People from "../components/user/People";
import Config from "../components/user/Config";
import Following from "../components/follow/Following";
import Followers from "../components/follow/Followers";
import Profile from "../components/user/Profile";

const Routing = () => {
    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>

                    <Route path="/social" element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path="feed" element={<Feed />} />
                        <Route path="people" element={<People />} />
                        <Route path="profile/:userId" element={<Profile />} />
                        <Route path="config" element={<Config />} />
                        <Route path="following/:userId" element={<Following />} />
                        <Route path="followers/:userId" element={<Followers />} />
                        <Route path="logout" element={<Logout />} />

                    </Route>

                    <Route path="*" element={
                        <>
                            <p>
                                <h1>Error 404</h1>
                                <Link to="/">Volver al inicio</Link>
                            </p>


                        </>
                    } />

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    )
}

export default Routing