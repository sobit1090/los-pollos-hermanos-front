import React from "react";
import { motion } from "framer-motion";
import {IMAGES} from "../../constants/images"
import { FiAward, FiHeart, FiUsers } from "react-icons/fi";

function Founder() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="founder">
      <motion.div 
        className="founder-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="founder-profile" variants={itemVariants}>
          <div className="founder-image">
            <img src={IMAGES.gus} alt="Gustavo Fring - Founder" />
            <div className="image-overlay"></div>
          </div>
          
          <div className="founder-info">
            <h1>Gus Fring</h1>
            <p className="founder-role">Founder & Operation Manager</p>
            <p className="founder-quote">
              "Every burger tells a story. Our story is one of passion, quality, 
              and the relentless pursuit of creating the perfect burger experience."
            </p>
          </div>
        </motion.div>

        <motion.div className="founder-values" variants={itemVariants}>
          <div className="value-item">
            <FiAward className="value-icon" />
            <h4>Quality First</h4>
            <p>Only the finest ingredients make it to your plate</p>
          </div>
          <div className="value-item">
            <FiHeart className="value-icon" />
            <h4>Made with Love</h4>
            <p>Every burger is crafted with passion and care</p>
          </div>
          <div className="value-item">
            <FiUsers className="value-icon" />
            <h4>Community Focused</h4>
            <p>Building relationships one burger at a time</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Founder;