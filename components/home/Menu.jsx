import React from "react";
import MenuCard from "./MenuCard";
import burger1 from "../../assets/burger1.png";
import { motion } from "framer-motion";
import burger2 from "../../assets/burger2.png";
import burger3 from "../../assets/burger3.png";
import { useNavigate } from "react-router-dom";
function Menu() {
  const navigate= useNavigate();
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

  const addToCartHandler = (item) => {
    console.log("Added to cart:", item);
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
            handler={addToCartHandler}
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
        <button onClick={()=>navigate("/NewMenu")} className="cta-secondary">View All Items</button>
      </motion.div>
    </section>
  );
}

export default Menu;