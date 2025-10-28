import React, { useState } from "react";
import ComplaintForm from "./ComplaintForm";
import ContactForm from "./ContactForm";
import "./complaintcomplaintContact.scss"
const ComplaintContactContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="complaint-container">
      <div className={`container_2 ${isActive ? "active_2" : ""}`}>
        {/* Forms */}
    <ComplaintForm className="form-box_2 complaint_2" />
<ContactForm className="form-box_2 contact_2" />

        {/* Toggle Panels */}
        <div className="toggle-box_2">
          <div className="toggle-panel_2 toggle-left_2">
            <h1>Want to reach us?</h1>
            <p>Click here to send a contact message</p>
            <button
              type="button"
              className="btn_2"
              onClick={() => setIsActive(true)}
            >
              Contact
            </button>
          </div>

          <div className="toggle-panel_2 toggle-right_2">
            <h1>Have an Issue?</h1>
            <p>Click here to file a complaint</p>
            <button
              type="button"
              className="btn_2"
              onClick={() => setIsActive(false)}
            >
              Complaint
            </button>
          </div>
        </div>
      </div>
      <div className="burger">
        <img src="../../assets/burger1.png" alt="" />
      </div>
    </div>
  );
};

export default ComplaintContactContainer;
