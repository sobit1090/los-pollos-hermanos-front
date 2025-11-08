import React, { useEffect } from "react";
 import { useState } from "react";
import { motion } from "framer-motion";
  import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { uploadProfilePhoto } from "../../redux/actions/user";

import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../redux/store";
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

const AdminProfile = () => {
    const dispatch = useDispatch();
  // Try different Redux state locations
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  
  // Get user from different possible locations
  const userDetail = authState.user || userState.user || userState.data || {};
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/api/admin/users`, { withCredentials: true });
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);
    const user = {
    name: userDetail.name || "Name",
    email: userDetail.email || "abc@example.com",
    joinDate: userDetail.createdAt 
      ? new Date(userDetail.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      : "March 2023",
    photo: userDetail.photo,
    orders: userDetail.orders || 0,
    role: userDetail.role,
  };
  const totalUsers = users.length;
const activeUsers = users.filter(u => u.status === "Active").length;
const suspendedUsers = users.filter(u => u.status === "Suspended").length;

  const logoutHandler = async () => {
  try {
    await axios.get(`${server}/logout`, { withCredentials: true });

    dispatch({ type: "logoutSuccess", payload: "Logged out successfully" });
    dispatch({ type: "emptyState" });
    localStorage.removeItem("cart");

    // Force refresh user state
    window.location.href = "/login";

  } catch (error) {
    console.error(error);
    toast.error("Logout failed");
  }
};


const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    await dispatch(uploadProfilePhoto(file));  // this was failing

    toast.success("Photo updated!");

    

  } catch (err) {
    console.log("Upload failed:", err);
    toast.error("Photo upload failed");
  }
};

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
  // useEffect(() => {
  //   document.body.classList.add('profile-page');
  //   return () => {
  //     document.body.classList.remove('profile-page');
  //   };
  // }, []);

  




  return (
    <section className="profile">
      <Helmet>
        <title>Admin Profile | Los Pollos Hermanos</title>
      </Helmet>
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div className="profile-header" variants={itemVariants}>
       <div className="avatar-container">
  <motion.img 
    src={user.photo || "/default-user.png"} 
    alt="User" 
    className="profile-avatar"
    whileHover={{ scale: 1.05 }}
  />

  {/* ✅ Upload Button */}
  <label className="upload-photo-btn">
    <input 
      type="file" 
      accept="image/*" 
      onChange={handlePhotoChange}
      style={{ display: "none" }}
    />
    📸
  </label>

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
          <motion.div className="stats-users" variants={itemVariants}>
  <h2>System Overview</h2>
  <div className="stats-grid">

    <div className="stat-card">
      <h3>{totalUsers}</h3>
      <p>Total Users</p>
    </div>

    <div className="stat-card">
      <h3>{activeUsers}</h3>
      <p>Active Users</p>
    </div>

    <div className="stat-card">
      <h3>{suspendedUsers}</h3>
      <p>Suspended Users</p>
    </div>

  </div>
</motion.div>

          <div className="actions-grid">

        
      <Link to="/admin/dashboard" className="action-card primary">
        <div className="action-icon">
          <MdDashboard />
        </div>
        <div className="action-content">
          <h3>Dashboard</h3>
          <p>Admin panel & analytics</p>
        </div>
      </Link>
 

            <Link to="/myorders" className="action-card success">
              <div className="action-icon">
                <MdShoppingBag />
              </div>
              <div className="action-content">
                <h3> Orders</h3>
                <p>View orders history</p>
              </div>
            </Link>

            <Link to="/profile/settings" className="action-card warning">
              <div className="action-icon">
                <MdSettings />
              </div>
              <div className="action-content">
                <h3>Complaints</h3>
                <p>Account preferences</p>
              </div>
            </Link>

            <Link to="/profile/edit" className="action-card info">
              <div className="action-icon">
                <MdPerson />
              </div>
              <div className="action-content">
                <h3>Users</h3>
                <p>See Active Users</p>
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

export default AdminProfile;