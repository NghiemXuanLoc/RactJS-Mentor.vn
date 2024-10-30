import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";

function QuestionDetail({ question }) {
    const { getUserByUserId, tags } = useContext(context);
    return (
        <>
            <div className="my-4">
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <h4><strong>Content</strong>: {question?.content}</h4>
                            <p><strong>Author:</strong> {getUserByUserId(question?.authorId)?.username}</p>
                            <p><strong>Tags:</strong> {question?.tags.map(tag => {
                                var t = tags.find(x => x.id == tag);
                                return t?.name + ", ";
                            })}</p>
                            <p><strong>Created At:</strong> {question?.createdAt}</p>
                            <p><strong>Modified At:</strong> {question?.modifiedAt}</p>
                        </div>
                        <h3 className="mt-4">Answers</h3>

                        {question?.answers.length > 0 ? (
                            question?.answers.map((answer, index) => (
                                <div key={index} className="alert alert-secondary">
                                    <p><strong>User:</strong> {getUserByUserId(answer?.userId)?.username}</p>
                                    <p>{answer?.answer}</p>
                                </div>
                            ))
                        ) : (
                            <p>No answers yet.</p>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionDetail;