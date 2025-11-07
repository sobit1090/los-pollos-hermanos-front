import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { server } from "../../redux/store";
import { useDispatch } from "react-redux";
import {loadUser} from "../../redux/actions/user.js"
const LoginForm = () => {
  const dispatch=useDispatch();
  //const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post(
      `${server}/login`,
      { email, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast.success("Login successful!");

    // ✅ Load user into Redux to update isAuthenticated
    await dispatch(loadUser());

    window.href("/profile");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  const loginHandler = () => {
    window.open(`${server}/googlelogin`, "_self");
  };

  return (
    <div className="form-box_1 login_1">
       <Helmet>
        <title>Login | Los Pollos Hermanos</title>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-box_1">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box_1">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="forgot-link_1">
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" className="btn_1">Login</button>

        <p>or login with social platforms</p>

        <div className="social-icons_1">
          <a className="googlepointer" onClick={loginHandler}><i className="bx bxl-google"></i></a>
          <a href="#"><i className="bx bxl-github"></i></a>
          <a href="#"><i className="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
