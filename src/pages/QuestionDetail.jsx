import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from './../components/Navbar';
import { Footer } from "../components";
import { context } from "../contexts/ProviderLogin";
import AnswerForm from "./AnswerForm";
import { toast } from 'react-toastify';

function QuestionDetail() {
    const { id } = useParams();

    const { getQuestionById, getUserByUserId, tags, isLogin, roles } = useContext(context);

    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplyClick = () => {
        if (isLogin != -1) {
            var user = getUserByUserId(isLogin);

            var question = getQuestionById(id);

            var checkRole = false;
            question.RolesAnswer.forEach(x => {
                if (x == user.roleId) {
                    checkRole = true;
                }
            });
            if (checkRole) {
                setShowReplyForm(!showReplyForm);
            } else {
                toast.error("You are not authorized to answer this question.");
            }

        } else {
            toast.error("Please log in to use this feature!");
        }
    };

    return (
        <>
            <Navbar />
            <section className="container">

                <div className="my-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <h4><strong>Content</strong>: {getQuestionById(id)?.content}</h4>
                                <p><strong>Author:</strong> {getUserByUserId(id)?.username}</p>
                                <p><strong>Tags:</strong> {getQuestionById(id)?.tags.map(tag => {
                                    var t = tags.find(x => x.id == tag);
                                    return t?.name + ", ";
                                })}</p>
                                <p><strong>Created At:</strong> {getQuestionById(id)?.createdAt}</p>
                                <p><strong>Modified At:</strong> {getQuestionById(id)?.modifiedAt}</p>
                            </div>
                            <h3 className="mt-4">Answers</h3>

                            <button className="btn btn-primary mt-3 mb-3" onClick={handleReplyClick}>
                                {showReplyForm ? "Cancel" : "Reply"}
                            </button>
                            {showReplyForm && <AnswerForm questionId = {id} setShowReplyForm={setShowReplyForm} />}

                            {getQuestionById(id)?.answers.length > 0 ? (
                                getQuestionById(id)?.answers.map((answer, index) => (
                                    <div key={index} className="alert alert-secondary">
                                        <p><strong>User:</strong> {getUserByUserId(answer.userId)?.username}</p>
                                        <p>{answer.answer}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No answers yet.</p>
                            )}

                        </div>
                    </div>
                </div>


            </section>
            <Footer />
        </>
    )
}

export default QuestionDetail;