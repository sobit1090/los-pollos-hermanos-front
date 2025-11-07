import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

function MenuCard({ item, index }) {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);

  const addToCart = () => {
    dispatch({
      type: "addToCart",
      payload: {
        id: item.id,
        name: item.title,
        price: item.price,
        image: item.image,
      },
    });
    dispatch({ type: "calculatePrice" });
  };

  const increment = () => {
    dispatch({ type: "addToCart", payload: item });
    dispatch({ type: "calculatePrice" });
  };

  const decrement = () => {
    dispatch({ type: "decrementItem", payload: item.id });
    dispatch({ type: "calculatePrice" });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1 }
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

          {/* ✅ If item is already in cart show + / - */}
          {cartItem ? (
            <div className="quantity-controls">
              <button className="qty-btn" onClick={decrement}>-</button>
              <span className="qty-count">{cartItem.quantity}</span>
              <button className="qty-btn" onClick={increment}>+</button>
            </div>
          ) : (
            <motion.button 
              onClick={addToCart}
              className="add-to-cart-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MenuCard;
