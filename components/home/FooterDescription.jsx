import React from "react";
import { motion } from "framer-motion";
import { AiFillInstagram, AiFillYoutube, AiFillLinkedin, AiFillHeart } from "react-icons/ai";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

function FooterDescription() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer>
      <motion.div 
        className="footer-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="footer-brand" variants={itemVariants}>
          <h2>Los Pollos Hermanos Burger</h2>
          <p className="brand-tagline">
            Crafting unforgettable burger experiences since 2023
          </p>
          <p className="brand-mission">
            We're committed to serving you the best burgers made from locally-sourced, 
            fresh ingredients. Your satisfaction is our ultimate goal.
          </p>
          
          <div className="contact-info">
            <div className="contact-item">
              <FiMapPin />
              <span>123 Burger Street, Food City</span>
            </div>
            <div className="contact-item">
              <FiPhone />
              <span>+1 234 567 890</span>
            </div>
            <div className="contact-item">
              <FiMail />
              <span>hello@lospollosburger.com</span>
            </div>
          </div>
        </motion.div>

        <motion.aside className="footer-social" variants={itemVariants}>
          <div className="social-header">
            <h4>Join Our Community</h4>
            <p>Follow us for updates and special offers</p>
          </div>
          
          <div className="social-links">
            <motion.a 
              href="https://youtube.com/vigyanrecharge"
              whileHover={{ scale: 1.1, color: "#FF0000" }}
              whileTap={{ scale: 0.9 }}
            >
              <AiFillYoutube />
            </motion.a>
            <motion.a 
              href="https://instagram.com"
              whileHover={{ scale: 1.1, color: "#E4405F" }}
              whileTap={{ scale: 0.9 }}
            >
              <AiFillInstagram />
            </motion.a>
            <motion.a 
              href="https://linkedin.com"
              whileHover={{ scale: 1.1, color: "#0A66C2" }}
              whileTap={{ scale: 0.9 }}
            >
              <AiFillLinkedin />
            </motion.a>
          </div>

          <div className="business-info">
            <h5>Owner: Gustavo Fring</h5>
            <p className="feedback-note">
              <AiFillHeart className="heart-icon" />
              We value your genuine feedback and strive for excellence
            </p>
          </div>
        </motion.aside>
      </motion.div>

      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>&copy; 2024 Los Pollos Hermanos Burger. All rights reserved.</p>
        <p>Made with ❤️ for burger lovers</p>
      </motion.div>
    </footer>
    
  );
}

export default FooterDescription;