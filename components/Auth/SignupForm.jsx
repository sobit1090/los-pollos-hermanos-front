import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import { server } from "../../redux/store";
const SignupForm = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🟢 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://los-pollos-hermanos-0ui5.onrender.com/api/v1/register",
        { name, email, password },
        { withCredentials: true }
      );

      toast.success("Registration successful!");
      toast.success(" Now You Can Login!")

      // ✅ Redirect to login page (or home)
      navigate("/login"); // 👈 redirect after success

      // Optionally reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  const loginHandler = () => {
    window.open(`${server}/googlelogin`, "_self");
  };
  return (
    <div className="form-box_1 register_1">
       <Helmet>
        <title>Login | Los Pollos Hermanos</title>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <h1>Registration</h1>

        <div className="input-box_1">
          <input
            type="text"
            placeholder="Username"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <i className="bx bxs-user"></i>
        </div>

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

        <button type="submit" className="btn_1">
          Register
        </button>

        <p>or register with social platforms</p>

        <div className="social-icons_1">
       <a className="googlepointer" onClick={loginHandler}><i className="bx bxl-google"></i></a>
          <a href="#"><i className="bx bxl-facebook"></i></a>
          <a href="#"><i className="bx bxl-github"></i></a>
          <a href="#"><i className="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
