import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

function MenuCard({ item, index, handler }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
    }
  };

  return (
    <motion.div 
      className="menu-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {item.popular && (
        <div className="popular-badge">
          <FiStar />
          <span>Popular</span>
        </div>
      )}
      
      <div className="card-image">
        <img src={item.image} alt={item.title} />
      </div>

      <div className="card-content">
        <h3>{item.title}</h3>
        <p className="card-description">{item.description}</p>
        
        <div className="card-footer">
          <span className="price">₹{item.price}</span>
          <motion.button 
            onClick={() => handler(item)}
            className="add-to-cart-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default MenuCard;