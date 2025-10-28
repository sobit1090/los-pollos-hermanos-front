import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from "framer-motion"
import { 
  FiHome, 
  FiShoppingCart, 
  FiLogIn, 
  FiUser,
  FiMenu,
  FiInfo,
  FiPhone,
  FiHelpCircle
} from "react-icons/fi"
import { IoFastFoodOutline, IoHelpBuoy } from "react-icons/io5"
import { GiHelp, GiLifeSupport } from 'react-icons/gi'
import { MdSupport } from 'react-icons/md'

const Footer = ({ isAuthenticated = false, cartItemsCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: FiHome,
      active: location.pathname === "/"
    },
    { 
      path: "/NewMenu", 
      label: "Menu", 
      icon: IoFastFoodOutline,
      active: location.pathname === "/menu"
    },
    { 
      path: "/contacts", 
      label: "Contact", 
      icon: FiHelpCircle,
      active: location.pathname === "/cart",
      badge: cartItemsCount
    },
    { 
      path: "/about", 
      label: "About", 
      icon: FiInfo,
      active: location.pathname === "/about"
    },
    { 
      path: isAuthenticated ? "/profile" : "/login", 
      label: isAuthenticated ? "Profile" : "Login", 
      icon: isAuthenticated ? FiUser : FiLogIn,
      active: isAuthenticated ? location.pathname === "/profile" : location.pathname === "/login"
    },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.nav 
      className="footer-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="footer-container">
        <div className="footer-links">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              className={`nav-item ${item.active ? 'active' : ''}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.path} className="nav-link">
                <div className="nav-icon">
                  <item.icon />
                  {item.badge > 0 && (
                    <motion.span 
                      className="nav-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <span className="nav-label">{item.label}</span>
                
                {item.active && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="footerActive"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default Footer