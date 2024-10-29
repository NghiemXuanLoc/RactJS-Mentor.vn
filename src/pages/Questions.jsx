import React, { useState, useEffect, useContext } from "react";
import { Footer, Navbar, Product } from "../components";
import { context } from "../contexts/ProviderLogin";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Questions() {

    const { getRoleIdByRoleName, getQuestionIdMax, isLogin, questions, setQuestions, tags, setTags, getUserByUserId } = useContext(context);


    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);


    console.log(isLogin);

    const handleTagChange = (tagId) => {
        setSelectedTags((prevSelected) => {
            if (prevSelected.includes(tagId)) {
                return prevSelected.filter((id) => id !== tagId);
            } else {
                return [...prevSelected, tagId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin != -1) {
            e.preventDefault();
            const id = getQuestionIdMax();
            const newQuestion = {
                id,
                content,
                RolesAnswer: [getRoleIdByRoleName("Teacher")?.id],
                authorId: isLogin,
                tags: selectedTags,
                createdAt: new Date().toISOString().split('T')[0],
                modifiedAt: new Date().toISOString().split('T')[0],
                answers: []
            };
            await createQuestion(newQuestion);
            setQuestions([...questions, newQuestion]);
            setContent("");
            setSelectedTags([]);
            toast.success("Create question success");
        } else {
            toast.error("Please log in to use this feature!");
        }
    };


    const createQuestion = async (question) => {
        await axios.post('http://localhost:9999/questions', question);
    };

    return (
        <section>
            <Navbar />

            <section className="container">

                <div className="container my-4">
                    <h2>Create a New Question</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="questionContent">Question Content</label>
                            <textarea
                                id="questionContent"
                                className="form-control"
                                rows="3"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your question here..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tags</label>
                            {tags.map((tag) => (
                                <div className="form-check" key={tag.id}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`tag-${tag.id}`}
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={() => handleTagChange(tag.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                                        {tag.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-success mt-2">Create Question</button>
                    </form>
                </div>


                <h3>Questions</h3>

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
                                            <NavLink to={`/questionDetail/${question.id}`} className="btn btn-sm btn-primary text-white">Detail</NavLink>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </section>

            <Footer />
        </section>
    )
}

export default Questions;