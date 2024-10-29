import React, { useState, useEffect, useContext } from "react";
import '../../css/StyleSideBar.css'
import { context } from "../../contexts/ProviderLogin";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyAccount from "./MyAccount";
import Users from "./Users";
import Questions from "./Questions";
import Roles from "./Roles";
import Tags from "./Tags";
import UserDetail from "./UserDetail";

function Dashboard() {
    const { getUserByUserId, isLogin, setIsLogin, userList, setUserList } = useContext(context);

    const [user, setUser] = useState({});

    const [showProfile, setShowProfile] = useState(false);

    const [showUsers, setShowUsers] = useState(true);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [user2, setUser2] = useState({});

    const [showQuestions, setShowQuestions] = useState(false);

    const [showRoles, setShowRoles] = useState(false);

    const [showTags, setShowTags] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin == -1) {
            toast.error("Please login to access the admin page!");
            navigate("/");
        } else {
            setUser(getUserByUserId(isLogin));
        }
    }, [isLogin])

    const display = (name) => {
        setShowProfile(false);
        setShowUsers(false);
        setShowQuestions(false);
        setShowRoles(false);
        setShowTags(false);
        setShowUserDetail(false);

        if (name == 'profile') {
            setShowProfile(true);
        } else if (name == 'users') {
            setShowUsers(true);
        } else if (name == 'questions') {
            setShowQuestions(true);
        } else if (name == 'roles') {
            setShowRoles(true);
        } else if(name == 'tags') {
            setShowTags(true);
        }
    }

    return (
        <main>
            <div
                className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
                style={{ width: 280 }}
            >
                <a
                    href="/"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                    <span className="fs-4">MentorMe.vn</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <button onClick={() => display("users")} className="nav-link" aria-current="page">
                            Users
                        </button>
                    </li>
                    <li>
                        <Link onClick={() => display("questions")} className="nav-link text-white">
                            Questions
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => display("roles")} className="nav-link text-white">
                            Roles
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => display("tags")} className="nav-link text-white">
                            Tags
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a
                        href="#"
                        className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        id="dropdownUser1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src="https://github.com/mdo.png"
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-circle me-2"
                        />
                        <strong>{user.username}</strong>
                    </a>
                    <ul
                        className="dropdown-menu dropdown-menu-dark text-small shadow"
                        aria-labelledby="dropdownUser1"
                    >
                        <li>
                            <button className="dropdown-item" onClick={() => display("profile")}>
                                Profile
                            </button>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => setIsLogin(-1)}>
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="b-example-divider" />
            <div style={{ width: "100%" }}>
                {showProfile && <MyAccount id={isLogin} />}

                {showUsers && <Users display = {display} userList = {userList.filter(user => user.isDeleted == false)} setUser2 = {setUser2} setShowDetail = {setShowUserDetail} />}
                {showUserDetail && <UserDetail user = {user2}/>}

                {showQuestions && <Questions/>}

                {showRoles && <Roles/>}
                {showTags && <Tags/>}
            </div>
        </main>
    )
}

export default Dashboard;