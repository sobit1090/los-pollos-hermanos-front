import React, { useEffect } from "react";
 
import { motion } from "framer-motion";
import me from "../../assets/founder.webp";
import { Link } from "react-router-dom";
import { 
  MdDashboard, 
  MdShoppingBag, 
  MdLogout, 
  MdPerson,
  MdSettings,
  MdEmail
} from "react-icons/md";
import { FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
 
import {logout} from "../../redux/actions/user"

const Profile = () => {
    
  // Try different Redux state locations
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  
  // Get user from different possible locations
  const userDetail = authState.user || userState.user || userState.data || {};

  
  useEffect(() => {
    document.body.classList.add('profile-page');
    return () => {
      document.body.classList.remove('profile-page');
    };
  }, []);

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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const user = {
    name: userDetail.name|| "Name",
    email: userDetail.email||"abc@example.com",
    joinDate: userDetail.createdAt 
    ? new Date(userDetail.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : "March 2023",
    photo: userDetail.photo,
    orders: userDetail.orders|| 0,
    role: userDetail.role ,
  };
  const dispatch=useDispatch();
 const logoutHandler=()=>{
     window.location.href = "https://los-pollos-hermanos-0ui5.onrender.com/api/v1/logout";
     dispatch({ type: "emptyState" });
localStorage.removeItem("cart");
 }
  return (
    <section className="profile">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div className="profile-header" variants={itemVariants}>
          <div className="avatar-container">
            <motion.img 
              src={user.photo} 
              alt="User" 
              className="profile-avatar"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="online-indicator"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            />
          </div>
          
          <motion.div className="user-info" variants={itemVariants}>
            <h1>{user.name}</h1>
            <p className="user-email">
              <MdEmail /> {user.email}
            </p>
            <div className="user-stats">
              <span className="stat">
                <strong>{user.orders}</strong> Orders
              </span>
              <span className="stat">
                <strong>{user.role}</strong> Role
              </span>
              <span className="stat">
                <strong>Member since</strong> {user.joinDate}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="quick-actions" variants={itemVariants}>
          <h2>Quick Actions</h2>
          <div className="actions-grid">

          {userDetail?.role === "admin" && (
      <Link to="/admin/dashboard" className="action-card primary">
        <div className="action-icon">
          <MdDashboard />
        </div>
        <div className="action-content">
          <h3>Dashboard</h3>
          <p>Admin panel & analytics</p>
        </div>
      </Link>
    )}

            <Link to="/myorders" className="action-card success">
              <div className="action-icon">
                <MdShoppingBag />
              </div>
              <div className="action-content">
                <h3>My Orders</h3>
                <p>View order history</p>
              </div>
            </Link>

            <Link to="/profile/settings" className="action-card warning">
              <div className="action-icon">
                <MdSettings />
              </div>
              <div className="action-content">
                <h3>Settings</h3>
                <p>Account preferences</p>
              </div>
            </Link>

            <Link to="/profile/edit" className="action-card info">
              <div className="action-icon">
                <MdPerson />
              </div>
              <div className="action-content">
                <h3>Edit Profile</h3>
                <p>Update your information</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Account Management */}
        <motion.div className="account-section" variants={itemVariants}>
          <h2>Account Management</h2>
          <div className="account-actions">
            <motion.button 
            onClick={logoutHandler}
              className="btn-logout"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut />
              <span>Sign Out</span>
            </motion.button>
            
            <button className="btn-secondary">
              <MdSettings />
              <span>Account Settings</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity (Optional) */}
        <motion.div className="recent-activity" variants={itemVariants}>
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <FiShoppingCart />
              </div>
              <div className="activity-content">
                <p>Order #ORD12345 delivered</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon primary">
                <FiUser />
              </div>
              <div className="activity-content">
                <p>Profile information updated</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </section>
  );
};

export default Profile;