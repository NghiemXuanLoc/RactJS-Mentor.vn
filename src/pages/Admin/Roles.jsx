import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";

import axios from "axios";
import { toast } from "react-toastify";

function Roles() {
    const { roles, setRoles, questions, setQuestions, userList, setUserList } = useContext(context);

    const [newRoleName, setNewRoleName] = useState("");

    const [updateRoleName, setUpdateRoleName] = useState({});

    const fetchQuestions = async () => {
        const response = await axios.get('http://localhost:9999/questions');
        setQuestions(response.data);
    };

    const updateQuestion = async (question) => {
        await axios.put(`http://localhost:9999/Questions/${question.id}`, question);
    };

    const updateUser = async (user) => {
        await axios.put(`http://localhost:9999/users/${user.id}`, user);
    };

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:9999/users');
        setUserList(response.data);
    };

    const handleDelete = async (role) => {
        await deleteRole(role.id);
        await fetchRoles();

        for (const question of questions) {
            question.RolesAnswer = question.RolesAnswer.filter(roleId => roleId != role.id);
            await updateQuestion(question);
        }

        for (const user of userList) {
            user.roleId = user.roleId == role.id ? null : user.roleId;

            await updateUser(user);
        }

        await fetchQuestions();
        await fetchUsers();

        toast.success("Delete role success");
    }

    const fetchRoles = async () => {
        const response = await axios.get('http://localhost:9999/roles');
        setRoles(response.data);
    };

    const deleteRole = async (id) => {
        await axios.delete(`http://localhost:9999/roles/${id}`);
    };

    const createRole = async (role) => {
        await axios.post('http://localhost:9999/roles', role);
    };

    const updateRole = async (role) => {
        await axios.put(`http://localhost:9999/roles/${role.id}`, role);
    };

    const handleCreateRole = async () => {
        var checkExist = false;
        roles.forEach(role => {
            if (role.name.toLowerCase().trim() == newRoleName.toLowerCase().trim()) {
                checkExist = true;
            }
        })

        if (newRoleName == "") {
            toast.error("Role name not null");
            return;
        }

        if (checkExist) {
            toast.error("Role name exist");
        } else {
            var newRole = {
                "name": newRoleName
            }

            setNewRoleName("");
            await createRole(newRole);
            await fetchRoles();
            toast.success("Create role success");
        }
    }

    const handleUpdate = async () => {
        var checkExist = false;

        roles.forEach(role => {
            if (role.name.toLowerCase() == updateRoleName.name.toLowerCase() && role.id != updateRoleName.id) {
                checkExist = true;
            }
        })

        if (checkExist) {
            toast.error("Role name exist");
        } else {
            await updateRole(updateRoleName);
            await fetchRoles();
            toast.success("Update role name success");
        }
    }

    return (
        <>
            <h2>Roles</h2>

            <button data-bs-toggle="modal"
                data-bs-target="#exampleModal" className="btn btn-success mb-3">Create</button>

            <table className="table table-hover table-striped">
                <thead>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Action</th>
                </thead>

                <tbody>
                    {
                        roles.map((role, index) => {
                            return (<tr>
                                <td>{index + 1}</td>
                                <td>{role.name}</td>
                                <td>
                                    <button data-bs-toggle="modal"
                                        data-bs-target="#exampleModal2"
                                        onClick={() => setUpdateRoleName(role)}
                                        className="btn btn-sm btn-primary me-2">
                                        Update
                                    </button>

                                    <button
                                        onClick={() => handleDelete(role)}
                                        className="btn btn-sm btn-danger">
                                        Delete
                                    </button>
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
                                    Create Role
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <input value={newRoleName} onInput={(e) => setNewRoleName(e.target.value)} type="text" placeholder="Enter role name" className="form-control" />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setNewRoleName("")}
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleCreateRole}>
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
                                    Update Role
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <input value={updateRoleName.name} onInput={(e) => setUpdateRoleName({ ...updateRoleName, "name": e.target.value })} type="text" placeholder="Enter role name" className="form-control" />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdate}>
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

export default Roles;