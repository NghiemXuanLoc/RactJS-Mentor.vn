import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { context } from "../contexts/ProviderLogin";
import { toast } from "react-toastify";

function AnswerForm({ questionId, setShowReplyForm }) {
    const [answer, setAnswer] = useState("");

    const {isLogin, getQuestionById, setQuestions, questions} = useContext(context);

    console.log(questionId);
    const handleSubmit = async (e) => {
        e.preventDefault();

        var question = getQuestionById(questionId);


        var newAnswer = {
            "userId": isLogin,
            "answer": answer
        }

        question.answers = [...question.answers, newAnswer];


        await updateQuestion(questionId, question);
        
        await fetchQuestions();

        toast.success("you just answered this question");

        setShowReplyForm(false);

        setAnswer("");
    };


    const fetchQuestions = async () => {
        const response = await axios.get('http://localhost:9999/questions');

        console.log(response.data);
        setQuestions(response.data);
    };

    const updateQuestion = async (id, question) => {
        await axios.put(`http://localhost:9999/questions/${id}`, question);
    };
    return (
        <>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group">
                    <label htmlFor="answerTextarea">Reply to Question</label>
                    <textarea
                        id="answerTextarea"
                        className="form-control"
                        rows="3"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter your answer here..."
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success mt-2 mb-3">Submit Answer</button>
            </form>
        </>
    )
}

export default AnswerForm;