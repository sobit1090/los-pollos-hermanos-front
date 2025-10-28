import React from "react";

const ComplaintForm = () => {
  return (
    <div className="form-box_2 complaint_2">
      <form>
        <h1>Complaint</h1>

        <div className="input-box_2">
          <input type="text" placeholder="Full Name" required />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box_2">
          <input type="email" placeholder="Email" required />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box_2">
          <textarea placeholder="Write your complaint..." required></textarea>
          <i className="bx bxs-message-dots"></i>
        </div>

        <button type="submit" className="btn_2">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
