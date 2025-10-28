import React from "react";
 
 

const SignupForm = () => {
    
  return (
    <div className="form-box_1 register_1">
      <form>
        <h1>Registration</h1>

        <div className="input-box_1">
          <input type="text" placeholder="Username" required />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box_1">
          <input type="email" placeholder="Email" required />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box_1">
          <input type="password" placeholder="Password" required />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <button   type="submit" className="btn_1">
          Register
        </button>

        <p>or register with social platforms</p>

        <div className="social-icons_1">
          <a href="#"><i className="bx bxl-google"></i></a>
          <a href="#"><i className="bx bxl-facebook"></i></a>
          <a href="#"><i className="bx bxl-github"></i></a>
          <a href="#"><i className="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
