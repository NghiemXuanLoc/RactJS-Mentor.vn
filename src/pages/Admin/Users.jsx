import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";
import axios from "axios";
import { toast } from "react-toastify";

function Users({ userList, setShowDetail, setUser2, display }) {

    const { getRoleByRoleId, setUserList, roles } = useContext(context);

    const [newUser, setNewUser] = useState({
        "image": "/images/users/Default_avatar_profile.jpg",
        "username": "",
        "email": "",
        "password": "",
        "roleId": 1,
        "phoneNumber": "",
        "address": "",
        "description": "",
        "isDeleted": false
    });

    const [addRoleUser, setAddRoleUser] = useState({});

    const handleDelete = async (user) => {

        var userUpdate = {
            ...user,
            "isDeleted": true
        }

        await updateUser(user.id, userUpdate);

        await fetchUsers();
    }

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:9999/users/${id}`);
    };

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:9999/users');
        setUserList(response.data);
    };

    const updateUser = async (id, user) => {
        await axios.put(`http://localhost:9999/users/${id}`, user);
    };


    const handleCreate = async () => {
        if (newUser.username == '' || newUser.email == '' || newUser.password == '') {
            toast.error("Please enter username, email, password");
        } else {
            newUser.roleId = parseInt(newUser.roleId);
            await createUser(newUser);
            await fetchUsers();
            setNewUser({
                "image": "/images/users/Default_avatar_profile.jpg",
                "username": "",
                "email": "",
                "password": "",
                "roleId": 1,
                "phoneNumber": "",
                "address": "",
                "description": "",
                "isDeleted": false
            });
            toast.success("Create user success");
        }
    }

    const createUser = async (user) => {
        await axios.post('http://localhost:9999/users', user);
    };

    const handleAddRole = async () => {
        if (addRoleUser.roleId == null) {
            addRoleUser.roleId = 1;
        }
        setAddRoleUser({ ...addRoleUser, "roleId": parseInt(addRoleUser.roleId) })
        await updateUser(addRoleUser.id, addRoleUser);
        await fetchUsers();
    }

    return (
        <>
            <h3>Users</h3>
            <button data-bs-toggle="modal"
                data-bs-target="#exampleModal" className="btn btn-success mb-3">Create User</button>
            <table className="table table-hover table-striped">
                <thead>
                    <th>UserName</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Action</th>
                </thead>

                <tbody>
                    {
                        userList.map(user => {
                            return (<tr>
                                <td>{user?.username}</td>
                                <td>{user?.email}</td>
                                <td>{getRoleByRoleId(user?.roleId)?.name}</td>
                                <td>
                                    <button
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal2"
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => setAddRoleUser(user)}
                                    >Update role</button>
                                    <button onClick={() => { display(); setShowDetail(true); setUser2(user) }} className="btn btn-sm btn-primary">Detail</button>
                                    <button onClick={() => handleDelete(user)} className="btn btn-sm btn-danger ms-2">Delete</button>
                                </td>
                            </tr>);
                        })
                    }
                </tbody>
            </table>

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
                                    Create User
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <input
                                        value={newUser.username}
                                        onInput={(e) => setNewUser({ ...newUser, "username": e.target.value })}
                                        type="text" placeholder="Enter username" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <input
                                        value={newUser.email}
                                        onInput={(e) => setNewUser({ ...newUser, "email": e.target.value })}
                                        type="text" placeholder="Enter email" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <input
                                        value={newUser.password}
                                        onInput={(e) => setNewUser({ ...newUser, "password": e.target.value })}
                                        type="text" placeholder="Enter Password" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <input
                                        value={newUser.phoneNumber}
                                        onInput={(e) => setNewUser({ ...newUser, "phoneNumber": e.target.value })}
                                        type="text" placeholder="Enter PhoneNumber" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <input
                                        value={newUser.address}
                                        onInput={(e) => setNewUser({ ...newUser, "address": e.target.value })}
                                        type="text" placeholder="Enter Address" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <input
                                        value={newUser.description}
                                        onInput={(e) => setNewUser({ ...newUser, "description": e.target.value })}
                                        type="text" placeholder="Enter description" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <select onChange={(e) => setNewUser({ ...newUser, "roleId": e.target.value })} type="text" placeholder="Enter description" className="form-control">
                                        {
                                            roles.map(role => {
                                                return (
                                                    <option selected={role.id == newUser.roleId ? true : false} value={role.id}>{role.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button onClick={handleCreate} type="button" className="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            <>

                <div
                    className="modal fade"
                    id="exampleModal2"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add roles
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <select className="form-control" onChange={(e) => setAddRoleUser({ ...addRoleUser, "roleId": e.target.value })}>
                                    {

                                        roles.map(role => {
                                            return (
                                                <option selected={role.id == addRoleUser.roleId ? true : false} value={role.id}>{role.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button onClick={handleAddRole} type="button" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        </>
    )
}

export default Users;