import React, { useState, useEffect, useContext } from "react";

import { Navbar, Footer } from "../components";
import { useParams } from "react-router-dom";
import { context } from "../contexts/ProviderLogin";
import '../css/StyleMyAccount.css'
import { toast } from "react-toastify";
import axios from "axios";

function MyAccount() {

    const { id } = useParams();

    const { getUserByUserId, userList, setUserList, roles } = useContext(context);

    const [changePassword, setChangepassword] = useState(false);
    const [changeProfile, setChangeProfile] = useState(false);

    const [user, setUser] = useState({});

    const [changePass, setChangePass] = useState({
        old: "",
        new: "",
        confirm: ""
    })

    useEffect(() => {
        setUser(getUserByUserId(id));
    }, [])


    const handleChangepassword = () => {
        setChangepassword(true);
        setChangeProfile(false);

    }

    const handleChangeProfile = () => {
        setChangepassword(false);
        setChangeProfile(true);
    }

    const handleInput = (e) => {
        setChangePass({
            ...changePass,
            [e.target.name]: e.target.value
        })
    }


    const handleClose = () => {
        setChangePass({
            old: "",
            new: "",
            confirm: ""
        })
    }
    const updateUser = async (user) => {
        await axios.put(`http://localhost:9999/users/${user.id}`, user);
    };


    const handleSaveChange = () => {
        if (changePassword) {
            if (user.password != changePass.old) {
                toast.error("Old passwords do not match");
            } else {
                if (changePass.new != changePass.confirm) {
                    toast.error("New password and confirm do not match");
                } else {
                    setUser({
                        ...user,
                        password: changePass.new
                    })

                    updateUser({
                        ...user,
                        password: changePass.new
                    });

                    toast.success("Change password success");
                }

                const userListAffter = userList.map((user) => {
                    if (user.id != id) {
                        return user;
                    } else {
                        return {
                            ...user,
                            password: changePass.new
                        }
                    }
                })

                setUserList(userListAffter);
            }
        } else {
            updateUser(user);

            const userListAffter = userList.map((u) => {
                if (u.id != id) {
                    return u;
                } else {
                    return user;
                }
            })

            setUserList(userListAffter);

            toast.success("Update profile success");
        }
    }

    const handleUpdate = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Navbar />

            <div className="profile-container">
                <div className="profile-header">
                    <img
                        src={user.image}
                        alt="User Avatar"
                        className="profile-avatar img-fluid"
                    />
                    <h1 className="profile-name">{user.username}</h1>
                    <p className="profile-bio">{roles.find(x => x.id == user.roleId)?.name}</p>
                </div>
                <div className="profile-details">
                    <h2>About Me</h2>
                    <p>
                        {user.description != '' ? user.description : 'undefined'}
                    </p>
                    <h2>Contact Information</h2>
                    <ul className="profile-contact list-unstyled">
                        <li>Email: {user.email}</li>
                        <li>Phone: {user.phoneNumber != '' ? user.phoneNumber : 'undefined'}</li>
                        <li>Address: {user.address != '' ? user.address : 'undefined'}</li>
                    </ul>
                    <h2>Action</h2>
                    <div className="profile-social">
                        <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={handleChangepassword}
                        >
                            Change password
                        </button>
                        <button
                            type="button"
                            className="btn btn-info btn-sm ms-3"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={handleChangeProfile}
                        >
                            Update profile
                        </button>


                        <>
                            <div
                                className="modal fade"
                                id="exampleModal"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                                {changePassword ? "Change password" : "Update profile"}
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            {
                                                changePassword
                                                    ?
                                                    <div>
                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Old Password</label>
                                                            <input name="old" onInput={handleInput}  value={changePass.old} type="text" className="form-control" />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">New Password</label>
                                                            <input name="new" onInput={handleInput} value={changePass.new} type="text" className="form-control" />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Confirm Password</label>
                                                            <input name="confirm" onInput={handleInput} value={changePass.confirm} type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">UserID</label>
                                                            <input name="useId" type="text" readOnly className="form-control" value={user.id} />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">UserName</label>
                                                            <input name="username" type="text" readOnly className="form-control" value={user.username} />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Email</label>
                                                            <input name="email" type="text" readOnly className="form-control" value={user.email} />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Phone number</label>
                                                            <input name="phoneNumber" type="text" onInput={handleUpdate} className="form-control" value={user.phoneNumber} />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Address</label>
                                                            <input name="address" type="text" onInput={handleUpdate} className="form-control" value={user.address} />
                                                        </div>

                                                        <div className="form-group mb-2">
                                                            <label className="form-lable">Description</label>
                                                            <input name="description" type="text" onInput={handleUpdate} className="form-control" value={user.description} />
                                                        </div>

                                                    </div>
                                            }

                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                                onClick={handleClose}
                                            >
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={handleSaveChange}>
                                                Save changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>

                    </div>
                </div>
            </div>




            <Footer />
        </>
    )
}

export default MyAccount;