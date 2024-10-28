import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { context } from "../contexts/ProviderLogin";
import { toast } from "react-toastify";

const Login = () => {
  const { isLogin, setIsLogin, userList, setUserList } = useContext(context);

  const [account, setAccount] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();


  const handleInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (account.email == '' || account.password == '') {
      toast.error("Please complete all information");
    } else {
      let checkAccount = -1;

      userList.forEach(user => {
        if (user.email == account.email && user.password == account.password) {
          checkAccount = user.id;
        }
      });

      if(checkAccount != -1){
        setIsLogin(checkAccount);

        navigate("/");
      }else{
        toast.error("Email or password is incorrect");
      }
    }
  }
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div class="my-3">
                <label for="display-4">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  name="email"
                  onInput={handleInput}
                  placeholder="example@gmail.com"
                />
              </div>
              <div class="my-3">
                <label for="floatingPassword display-4">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  name="password"
                  onInput={handleInput}
                  placeholder="Password"
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button class="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
