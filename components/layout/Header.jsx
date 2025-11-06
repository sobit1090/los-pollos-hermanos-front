import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { IoFastFoodOutline } from "react-icons/io5"
import { FiShoppingCart, FiLogIn } from "react-icons/fi"
import { FaUser } from "react-icons/fa"
import { IMAGES } from '../../constants/images'

const Header = ({ isAuthenticated = false, cartItemsCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/NewMenu", label: "Menu" },
    { path: "/about", label: "About" },
    { path: "/contacts", label: "Contact" }
  ];

  return (
    <motion.nav
      className={`nav ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nav-container">
        {/* Logo */}
        <motion.div 
          className="logo"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
  <img src={IMAGES.remixLogo} alt="Logo" className="logo-icon" />

          <span className="logo-text">Los Pollos</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          className="nav-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Link to={item.path}>
                {item.label}
              </Link>
              {location.pathname === item.path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="navIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Desktop Actions - Cart + Login (Visible only on laptop/desktop) */}
        <motion.div
          className="desktop-actions"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Cart */}
          <motion.div
            className="cart-wrapper"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart" className="action-btn">
              <FiShoppingCart className="action-icon" />
              {cartItemsCount > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {cartItemsCount}
                </motion.span>
              )}
              <span className="action-text">Cart</span>
            </Link>
          </motion.div>

          {/* Login/User */}
          <motion.div
            className="auth-wrapper"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="action-btn"
            >
              {isAuthenticated ? (
                <FaUser className="action-icon" />
              ) : (
                <FiLogIn className="action-icon" />
              )}
              <span className="action-text">
                {isAuthenticated ? 'Profile' : 'Login'}
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile - Only Cart (No Login) */}
        <motion.div
          className="mobile-cart-only"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/cart" className="mobile-cart-link">
            <FiShoppingCart className="cart-icon" />
            {cartItemsCount > 0 && (
              <motion.span
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {cartItemsCount}
              </motion.span>
            )}
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Header;