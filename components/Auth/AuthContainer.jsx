import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "./login.scss";

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-container_1">
      <div className={`container_1 ${isActive ? "active_1" : ""}`}>
        {/* Forms */}
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
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

      {/* Demo Credentials Card for Desktop */}
      <div className="demo-credentials-card">
        <h3>Demo Accounts</h3>
        
        <div 
          className="credential-section" 
          onClick={() => handleFillCredentials("admin@gmail.com", "admin123")}
        >
          <h4>
            <i className="bx bxs-user-badge"></i> Admin Portal
          </h4>
          <p>Email: <span>admin@gmail.com</span></p>
          <p>Pass: <span>admin123</span></p>
          <div className="click-hint">Click to autofill</div>
        </div>

        <div 
          className="credential-section" 
          onClick={() => handleFillCredentials("user@gmail.com", "user123")}
        >
          <h4>
            <i className="bx bxs-user"></i> User Account
          </h4>
          <p>Email: <span>user@gmail.com</span></p>
          <p>Pass: <span>user123</span></p>
          <div className="click-hint">Click to autofill</div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
