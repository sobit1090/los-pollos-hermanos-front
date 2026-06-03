import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";

import { uploadProfilePhoto } from "../../redux/actions/user";
import { server } from "../../redux/store";

import {
  MdDashboard,
  MdShoppingBag,
  MdPerson,
  MdSettings,
  MdEmail,
  MdPeople,
  MdLocalOffer
} from "react-icons/md";

import {
  FiUser,
  FiShoppingCart,
  FiLogOut
} from "react-icons/fi";

const Profile = () => {

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);

  const userDetail =
    authState.user ||
    userState.user ||
    userState.data ||
    {};

  const isAdmin = userDetail?.role === "admin";

  useEffect(() => {
    document.body.classList.add("profile-page");

    return () => {
      document.body.classList.remove("profile-page");
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },

    visible: {
      y: 0,
      opacity: 1,

      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const user = {
    name: userDetail.name || "Name",

    email: userDetail.email || "abc@example.com",

    joinDate: userDetail.createdAt
      ? new Date(userDetail.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          }
        )
      : "March 2026",

    photo: userDetail.photo,

    orders: userDetail.orders || 0,

    role: userDetail.role || "user",
  };

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/logout`, {
        withCredentials: true,
      });

      dispatch({
        type: "logoutSuccess",
        payload: "Logged out successfully",
      });

      dispatch({
        type: "emptyState",
      });

      localStorage.removeItem("cart");

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

      await dispatch(uploadProfilePhoto(file));

      toast.success("Photo updated!");

    } catch (err) {

      console.log("Upload failed:", err);

      toast.error("Photo upload failed");
    }
  };

  return (
    <section className="profile">

      <Helmet>
        <title>
          {isAdmin
            ? "Admin Profile"
            : "User Profile"} | Los Pollos Hermanos
        </title>
      </Helmet>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* HEADER */}

        <motion.div
          className="profile-header"
          variants={itemVariants}
        >

          <div className="profile-left">

            <div className="avatar-container">

              <motion.img
                src={user.photo || "/default-user.png"}
                alt="User"
                className="profile-avatar"
                whileHover={{ scale: 1.05 }}
              />

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

            <motion.div
              className="user-info"
              variants={itemVariants}
            >

              <h1>{user.name}</h1>

              <p className="user-email">
                <MdEmail />
                {user.email}
              </p>

            </motion.div>

          </div>

          <div className="user-stats">

            <div className="stat">
              <strong>{user.orders}</strong>
              <span>Orders</span>
            </div>

            <div className="stat">
              <strong>{user.role}</strong>
              <span>Role</span>
            </div>

            <div className="stat">
              <strong>{user.joinDate}</strong>
              <span>Member Since</span>
            </div>

          </div>

        </motion.div>

        {/* QUICK ACTIONS */}

        <motion.div
          className="quick-actions"
          variants={itemVariants}
        >

          <h2>Quick Actions</h2>

          <div className="actions-grid">

            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="action-card primary"
                >

                  <div className="action-icon">
                    <MdDashboard />
                  </div>

                  <div className="action-content">
                    <h3>Dashboard</h3>
                    <p>Admin analytics panel</p>
                  </div>

                </Link>

                <Link
                  to="/admin/users"
                  className="action-card info"
                >

                  <div className="action-icon">
                    <MdPeople />
                  </div>

                  <div className="action-content">
                    <h3>Users</h3>
                    <p>Manage all users</p>
                  </div>

                </Link>

                <Link
                  to="/admin/orders"
                  className="action-card success"
                >

                  <div className="action-icon">
                    <MdShoppingBag />
                  </div>

                  <div className="action-content">
                    <h3>Orders</h3>
                    <p>Manage all orders</p>
                  </div>

                </Link>

                <Link
                  to="/admin/coupons"
                  className="action-card warning"
                >

                  <div className="action-icon">
                    <MdLocalOffer />
                  </div>

                  <div className="action-content">
                    <h3>Coupons</h3>
                    <p>Manage discount coupons</p>
                  </div>

                </Link>
              </>
            )}

            {!isAdmin && (
              <>
                <Link
                  to="/myorders"
                  className="action-card success"
                >

                  <div className="action-icon">
                    <MdShoppingBag />
                  </div>

                  <div className="action-content">
                    <h3>My Orders</h3>
                    <p>View order history</p>
                  </div>

                </Link>

                <Link
                  to="/profile/settings"
                  className="action-card warning"
                >

                  <div className="action-icon">
                    <MdSettings />
                  </div>

                  <div className="action-content">
                    <h3>Settings</h3>
                    <p>Account preferences</p>
                  </div>

                </Link>

                <Link
                  to="/profile/edit"
                  className="action-card info"
                >

                  <div className="action-icon">
                    <MdPerson />
                  </div>

                  <div className="action-content">
                    <h3>Edit Profile</h3>
                    <p>Update your information</p>
                  </div>

                </Link>
              </>
            )}

          </div>

        </motion.div>

        {/* ACCOUNT */}

        <motion.div
          className="account-section"
          variants={itemVariants}
        >

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

        {/* ACTIVITY */}

        <motion.div
          className="recent-activity"
          variants={itemVariants}
        >

          <h2>Recent Activity</h2>

          <div className="activity-list">

            <div className="activity-item">

              <div className="activity-icon success">
                <FiShoppingCart />
              </div>

              <div className="activity-content">
                <p>Order #ORD12345 delivered</p>
                <span className="activity-time">
                  2 hours ago
                </span>
              </div>

            </div>

            <div className="activity-item">

              <div className="activity-icon primary">
                <FiUser />
              </div>

              <div className="activity-content">
                <p>Profile information updated</p>
                <span className="activity-time">
                  1 day ago
                </span>
              </div>

            </div>

          </div>

        </motion.div>

      </motion.main>
    </section>
  );
};

export default Profile;