import React from "react";
import MenuCard from "./MenuCard";
import burger1 from "../../assets/burger1.png";
import burger2 from "../../assets/burger2.png";
import burger3 from "../../assets/burger3.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Optional: Access cart to prevent duplicates (if needed)
  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const menuItems = [
    {
      id: 1,
      title: "Classic Cheese Burger",
      description: "Juicy beef patty with melted cheese and fresh veggies",
      price: 299,
      image: burger1,
      popular: true
    },
    {
      id: 2,
      title: "Veg Supreme Burger",
      description: "Fresh vegetable patty with special sauce and lettuce",
      price: 249,
      image: burger2,
      popular: false
    },
    {
      id: 3,
      title: "Premium Combo Burger",
      description: "Signature burger with french fries and special sauce",
      price: 499,
      image: burger3,
      popular: true
    }
  ];

  // ✅ Redux-based Add to Cart Handler
  const addToCartHandler = (item) => {
    // Check if item already in cart (optional)
    const exists = cartItems.find((i) => i.id === item.id);

    if (exists) {
      dispatch({ type: "addToCart", payload: { ...item } });
    } else {
      dispatch({
        type: "addToCart",
        payload: {
          id: item.id,
          name: item.title,
          price: item.price,
          image: item.image,
          quantity: 1
        }
      });
    }

    dispatch({ type: "calculatePrice" });
  };

  return (
    <section id="menu" className="menu">
      <motion.div 
        className="menu-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Our Delicious Menu</h1>
        <p>Handcrafted burgers made with love and the finest ingredients</p>
      </motion.div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <MenuCard 
            key={item.id}
            item={item}
            index={index}
            handler={() => addToCartHandler(item)} // ✅ Connect Redux logic
          />
        ))}
      </div>

      <motion.div 
        className="menu-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Can't decide? Try our <strong>Burger Sampler Platter</strong></p>
        <button onClick={() => navigate("/NewMenu")} className="cta-secondary">
          View All Items
        </button>
      </motion.div>
    </section>
  );
}

export default Menu;
