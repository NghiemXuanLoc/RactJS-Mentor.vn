import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";
import axios from "axios";

function Users({ userList, setShowDetail, setUser2, display }) {

    const { getRoleByRoleId, setUserList } = useContext(context);

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
    return (
        <>
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
                                <td>{getRoleByRoleId(user.roleId).name}</td>
                                <td>
                                    <button onClick={() => { display(); setShowDetail(true); setUser2(user) }} className="btn btn-sm btn-primary">Detail</button>
                                    <button onClick={() => handleDelete(user)} className="btn btn-sm btn-danger ms-2">Delete</button>
                                </td>
                            </tr>);
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default Users;