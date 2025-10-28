import React from "react";

const ContactForm = () => {
  return (
    <div className="form-box_2 contact_2">
      <form>
        <h1>Contact Us</h1>

        <div className="input-box_2">
          <input type="text" placeholder="Full Name" required />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box_2">
          <input type="email" placeholder="Email" required />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box_2">
          <textarea placeholder="Your message..." required></textarea>
          <i className="bx bxs-message"></i>
        </div>

        <button type="submit" className="btn_2">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;
