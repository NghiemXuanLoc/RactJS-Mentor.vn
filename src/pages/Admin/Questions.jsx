import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Questions({ questions, display, setQuestion, setShowQuestionDetail }) {
    const { getUserByUserId, tags, setQuestions } = useContext(context);


    const handleDelete = async (question) => {
        await deleteQuestion(question.id);

        await fetchQuestions();
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
                    <th>CreatedAt</th>
                    <th>Total answer</th>
                    <th>Author</th>
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
                                    <td>{question.createdAt}</td>
                                    <td>{question.answers.length}</td>
                                    <td>{getUserByUserId(question.authorId)?.username}</td>
                                    <td>
                                        <button onClick={() => { setQuestion(question); display(); setShowQuestionDetail(true) }} className="btn btn-sm btn-primary text-white">Detail</button>

                                        <button onClick={() => handleDelete(question)} className="btn btn-sm btn-danger ms-2 text-white">Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default Questions;