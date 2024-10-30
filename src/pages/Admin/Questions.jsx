import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Questions({ questions, display, setQuestion, setShowQuestionDetail }) {
    const { getUserByUserId, getRoleByRoleId, tags, setQuestions, roles } = useContext(context);

    const [selectedRoles, setSelectedRoles] = useState([]);

    const [questionAddRole, setQuestionAddRole] = useState({});

    const handleDelete = async (question) => {
        await deleteQuestion(question.id);

        await fetchQuestions();
    };

    const handleRoleChange = (roleId) => {
        setSelectedRoles((prevSelected) => {
            if (prevSelected.includes(roleId)) {
                return prevSelected.filter((id) => id !== roleId);
            } else {
                return [...prevSelected, roleId];
            }
        });
    };


    const handleUpdateRole = async () => {
        console.log(selectedRoles);
        console.log(questionAddRole);
        
        await updateQuestion({ ...questionAddRole, "RolesAnswer": selectedRoles });
        await fetchQuestions();
    }

    const updateQuestion = async (question) => {
        await axios.put(`http://localhost:9999/questions/${question.id}`, question);
    };


    const deleteQuestion = async (id) => {
        await axios.delete(`http://localhost:9999/questions/${id}`);
    };

    const fetchQuestions = async () => {
        const response = await axios.get('http://localhost:9999/questions');
        setQuestions(response.data);
    };
    return (
        <>
            <table className="table table-hover table-striped">
                <thead>
                    <th>No.</th>
                    <th>Content</th>
                    <th>Tags</th>
                    <th>Roles</th>
                    <th>Total answer</th>
                    <th>Action</th>
                </thead>

                <tbody>
                    {
                        questions.map((question, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{question.content}</td>
                                    <td>
                                        {
                                            question.tags.map(tag => {
                                                var t = tags.find(x => x.id == tag);
                                                return t?.name + ", ";
                                            })
                                        }
                                    </td>
                                    <td>{question.RolesAnswer.map(roleId => getRoleByRoleId(roleId)?.name + ",")}</td>
                                    <td>{question.answers.length}</td>
                                    <td>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            className="btn btn-sm btn-success me-2"
                                            onClick={(e) => { setSelectedRoles(question.RolesAnswer); setQuestionAddRole(question) }}
                                        >Update Role</button>

                                        <button onClick={() => { setQuestion(question); display(); setShowQuestionDetail(true) }} className="btn btn-sm btn-primary text-white">Detail</button>

                                        <button onClick={() => handleDelete(question)} className="btn btn-sm btn-danger ms-2 text-white">Delete</button>
                                    </td>
                                </tr>
                            )
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
                                    Update roles
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                {roles.map((role) => (
                                    <div className="form-check" key={role.id}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`role-${role.id}`}
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={() => handleRoleChange(role.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button onClick={handleUpdateRole} type="button" className="btn btn-primary">
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

export default Questions;