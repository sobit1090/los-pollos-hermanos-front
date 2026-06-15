import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../redux/store";

const ComplaintForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${server}/complaint/new`,
        { name, email, message, type: "complaint" },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Complaint submitted successfully! 🎉");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-box_2 complaint_2">
      <Helmet>
        <title>Contact | Los Pollos Hermanos</title>
      </Helmet>
      <form onSubmit={submitHandler}>
        <h1>Complaint</h1>

        <div className="input-box_2">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box_2">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box_2">
          <textarea 
            placeholder="Write your complaint..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <i className="bx bxs-message-dots"></i>
        </div>

        <button type="submit" className="btn_2" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
