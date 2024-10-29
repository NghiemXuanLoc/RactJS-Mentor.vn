import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const context = createContext();

function ProviderLogin({ children }) {

    const [isLogin, setIsLogin] = useState(-1);

    const [userList, setUserList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [questions, setQuestions] = useState([]);

    const [tags, setTags] = useState([]);

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchQuestions();
        fetchTags();
        fetchRoles();
    }, [])

    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:9999/users');
        setUserList(response.data);
    };


    const fetchQuestions = async () => {
        const response = await axios.get('http://localhost:9999/questions');
        setQuestions(response.data);
    };

    const fetchTags = async () => {
        const response = await axios.get('http://localhost:9999/tags');
        setTags(response.data);
    };

    const fetchRoles = async () => {
        const response = await axios.get('http://localhost:9999/roles');
        setRoles(response.data);
    };

    const getUserByUserId = (id) => {
        return userList.find(user => {
            if (user.id == id) {
                return true;
            }
        })
    }

    const getQuestionById = (id) => {
        return questions.find(question => {
            if (question.id == id) {
                return true;
            }
        })
    }

    const getRoleIdByRoleName = (name) => {
        return roles.find(role => {
            if (role.name.toLowerCase() == name.toLowerCase()) {
                return true;
            }
        })
    }

    const getRoleByRoleId = (id) => {
        return roles.find(role => {
            if (role.id == id) {
                return true;
            }
        })
    }
    const getQuestionIdMax = () => {
        var idMax = -1;
        questions.forEach(q => {
            if (idMax < q.id) {
                idMax = q.id;
            }
        });

        return idMax + 1;
    }

    let value = {
        isLogin, setIsLogin,
        userList, setUserList,
        getUserByUserId,
        searchTerm, setSearchTerm,
        questions, setQuestions,
        tags, setTags,
        getQuestionById,
        getQuestionIdMax,
        roles, setRoles,
        getRoleIdByRoleName, getRoleByRoleId
    }
    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default ProviderLogin;