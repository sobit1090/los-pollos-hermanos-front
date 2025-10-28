import React from "react";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
 const navigate = useNavigate();
  return (
    <div className="form-box_1 login_1">
      <form>
        <h1>Login</h1>

        <div className="input-box_1">
          <input type="text" placeholder="Username" required />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box_1">
          <input type="password" placeholder="Password" required />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="forgot-link_1">
          <a href="#">Forgot Password?</a>
        </div>

        <button onClick={()=>navigate("/profile")} type="submit" className="btn_1">
          Login
        </button>

        <p>or login with social platforms</p>

        <div className="social-icons_1">
          <a href="http://localhost:8080/api/v1/login/"><i className="bx bxl-google"></i></a>
          <a href="#"> <i className="bx bx-phone"></i></a>
          <a href="#"><i className="bx bxl-github"></i></a>
          <a href="#"><i className="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
