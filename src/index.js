import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import store from "./redux/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import {
  AboutPage,
  ContactPage,
  Login,
  Register,
  PageNotFound,
} from "./pages";
import ProviderLogin from "./contexts/ProviderLogin";
import MyAccount from "./pages/MyAccount";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />

    <ProviderLogin>
    <Provider store={store}>
        <Routes>
          <Route path="/" element={<Questions />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questionDetail/:id" element={<QuestionDetail/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myaccount/:id" element={<MyAccount />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </Provider>
    </ProviderLogin>
  </BrowserRouter>
);
