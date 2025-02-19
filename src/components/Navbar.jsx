import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { context } from '../contexts/ProviderLogin'

const Navbar = () => {
    const state = useSelector(state => state.handleCart)
    const { isLogin, setIsLogin, searchTerm, setSearchTerm } = useContext(context);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn logout không?")) {
            setIsLogin(-1);
            navigate("/");
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate("/questions");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> MentorMe.vn</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/questions">Question</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>

                    <form onSubmit={handleSubmit} className="d-flex me-3">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onInput={handleSearch}
                        />
                        <button className="btn btn-outline-success" type="submit">
                            Search
                        </button>
                    </form>


                    {
                        isLogin != -1
                        &&
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Account
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">


                                <li>
                                    <NavLink to={`/myaccount/${isLogin}`} className="btn btn-outline-dark m-2">My Account</NavLink>
                                </li>

                                <li>
                                    <button onClick={handleLogout} className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Logout</button>
                                </li>

                            </ul>
                        </div>
                    }


                    <div className="buttons text-center">
                        {
                            isLogin == -1
                            &&
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                            </>
                        }
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar