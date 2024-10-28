import React, { useContext, useState } from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';
import { context } from '../contexts/ProviderLogin';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {

    const { userList, setUserList } = useContext(context);

    const getUserIdMax = () => {
        let idMax = 0;
        userList.forEach(element => {

            if (idMax < element.id) {
                idMax = element.id;
            }
        });

        return idMax;
    }


    const [add, setAdd] = useState({
        "id": getUserIdMax() + 1,
        "image": '/images/users/Default_avatar_profile.jpg',
        "username": "",
        "email": "",
        "password": "",
        "roleId": 1,
        "phoneNumber": '',
        "address": "",
        "description": ""
    });


    const checkExitEmail = () => {
        let isExit = false;

        userList.forEach(user => {
            if (add.email.toLowerCase() == user.email.toLowerCase()) {
                isExit = true;
            }
        })

        return isExit;
    }


    const checkExitUserName = () => {

        let isExit = false;
        userList.forEach(user => {
            if (add.username.toLowerCase() == user.username.toLowerCase()) {
                isExit = true;
            }
        })

        return isExit;
    }


    const handleAdd = (e) => {
        setAdd({
            ...add,
            [e.target.name]: e.target.value.trim()
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (add.username == '' || add.email == '' || add.password == '') {
            toast.error("Please fill out all information fields completely");
        } else {
            if (checkExitEmail() == true) {
                toast.error("Email already exists");
            } else if (checkExitUserName() == true) {
                toast.error("UserName already exists")
            } else {
                // thuc hien viec add
                createUser(add);

                toast.success("Register successfully");
                setUserList([
                    ...userList,
                    add
                ])
            }
        }
    }
    console.log(userList);
    

    const createUser = async (newUser) => {
        await axios.post('http://localhost:9999/users', newUser);
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div class="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div class="form my-3">
                                <label for="Name">UserName</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="fullName"
                                    name='username'
                                    onInput={handleAdd}
                                    placeholder="Enter Your Name"
                                />
                            </div>
                            <div class="form my-3">
                                <label for="Email">Email address</label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="Email"
                                    name='email'
                                    onInput={handleAdd}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div class="form  my-3">
                                <label for="Password">Password</label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="Password"
                                    name='password'
                                    onInput={handleAdd}
                                    placeholder="Password"
                                />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button class="my-2 mx-auto btn btn-dark" type="submit">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register