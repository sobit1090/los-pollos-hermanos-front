import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "./login.scss";

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="auth-container_1">
      <div className={`container_1 ${isActive ? "active_1" : ""}`}>
        {/* Forms */}
        <LoginForm />
        <SignupForm />

        {/* Toggle Panels */}
        <div className="toggle-box_1">
          <div className="toggle-panel_1 toggle-left_1">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              type="button"
              className="btn_1 register-btn_1"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>

          <div className="toggle-panel_1 toggle-right_1">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              type="button"
              className="btn_1 login-btn_1"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
