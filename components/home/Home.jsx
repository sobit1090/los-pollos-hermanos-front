import React from "react";
import { motion } from "framer-motion";
import Founder from "./Founder";
import Menu from "./Menu";
import FooterDescription from "./FooterDescription";


function Home() {

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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <section className="home">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="hero-title">
            Los Pollos Burger's
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle">
            Crafted with passion, served with perfection
          </motion.p>
          <motion.p variants={itemVariants} className="hero-description">
            Experience the finest burgers made from premium ingredients, 
            fresh daily in our kitchen. Your satisfaction is our recipe!
          </motion.p>
        </motion.div>

        <motion.a
          className="cta-button"
          variants={itemVariants}
          href="#menu"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(220, 53, 69, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Explore Our Menu</span>
          <motion.div 
            className="arrow"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.a>

        <div className="hero-stats">
          <motion.div 
            className="stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3>500+</h3>
            <p>Happy Customers</p>
          </motion.div>
          <motion.div 
            className="stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3>50+</h3>
            <p>Burger Varieties</p>
          </motion.div>
          <motion.div 
            className="stat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h3>5★</h3>
            <p>Customer Rating</p>
          </motion.div>
        </div>
      </section>

      <Menu />
      <Founder />
      <FooterDescription />
    </>
  );
}

export default Home;