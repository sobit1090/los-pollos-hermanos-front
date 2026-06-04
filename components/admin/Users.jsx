import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { server } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
  MdWarning,
  MdBlock,
  MdCheckCircle,
  MdRefresh,
  MdEmail,
  MdCalendarToday,
} from "react-icons/md";
import { FiUser, FiUsers, FiMail, FiCalendar } from "react-icons/fi";
import { Helmet } from "react-helmet";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    photo: null,
  });
const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const AddNewUserHandler = () => {
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setPreviewImage(null);
    setErrors({});
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      photo: null,
    });
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/admin/users`, {
        withCredentials: true,
      });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, photo: file });
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    }
  };

  const submitAddUser = async () => {
    if (!validateFields()) return;
    try {
      const { data } = await axios.post(
        `${server}/admin/register/addnewuser`,
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("User added successfully!");
      closeAddUserModal();
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding user");
    }
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!newUser.name.trim()) tempErrors.name = "Name is required";
    if (!newUser.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(newUser.email))
      tempErrors.email = "Invalid email format";
    if (!newUser.password.trim()) tempErrors.password = "Password is required";
    if (newUser.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    if (!newUser.role) tempErrors.role = "Role selection required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "role-badge admin";
      case "moderator":
        return "role-badge moderator";
      case "user":
        return "role-badge user";
      default:
        return "role-badge";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-badge active";
      case "inactive":
        return "status-badge inactive";
      case "suspended":
        return "status-badge suspended";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${server}/admin/users/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
      setDeleteConfirm(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const { data } = await axios.put(
        `${server}/admin/users/${userId}/toggle`,
        {},
        { withCredentials: true }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: data.status } : user
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  const stats = {
    total: users.length,
    active: users.filter((user) => user.status === "Active").length,
    admins: users.filter((user) => user.role === "admin").length,
    inactive: users.filter((user) => user.status === "Inactive").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <section className="tableClass">
        <main>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="tableClass">
      <Helmet>
        <title>Users | Admin</title>
      </Helmet>

      <motion.main variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div className="table-header" variants={itemVariants}>
          <div className="header-content">
            <div className="title-section">
              <h1>
                <FiUsers className="header-icon" />
                User Management
              </h1>
              <p>Manage all system users and their permissions</p>
            </div>
            <button onClick={AddNewUserHandler} className="btn-primary btn-add-user">
              <MdAdd />
              <span>Add New User</span>
            </button>
          </div>
        </motion.div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="modal-overlay">
            <div className="modal-content add-user-modal">
              <button className="modal-close-btn" onClick={closeAddUserModal}>✕</button>
              <h3>Add New User</h3>
              <p>Fill the form to create a new user</p>
              <div className="add-user-body">
                <div className="photo-upload">
                  {previewImage ? (
                    <label htmlFor="userPhoto" className="photo-preview">
                      <img src={previewImage} alt="Preview" />
                    </label>
                  ) : (
                    <label htmlFor="userPhoto" className="photo-label">
                      <span>+</span>
                    </label>
                  )}
                  <input type="file" id="userPhoto" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" type="text" placeholder="Enter full name" value={newUser.name} onChange={handleInputChange} />
                  {errors.name && <small className="error">{errors.name}</small>}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="Enter email" value={newUser.email} onChange={handleInputChange} />
                  {errors.email && <small className="error">{errors.email}</small>}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" value={newUser.password} onChange={handleInputChange} />
                  {errors.password && <small className="error">{errors.password}</small>}
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={newUser.role} onChange={handleInputChange}>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <small className="error">{errors.role}</small>}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeAddUserModal}>Cancel</button>
                <button className="btn-primary" onClick={submitAddUser}>Add User</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                className="modal-content delete-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-icon">
                  <MdWarning />
                </div>
                <h3>Delete User?</h3>
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="btn-danger" onClick={() => handleDeleteUser(deleteConfirm)}>
                    <MdDelete />
                    Delete User
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div className="stats-cards" variants={itemVariants}>
          <div className="stat-card total-users">
            <div className="stat-icon"><FiUsers /></div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card active-users">
            <div className="stat-icon"><MdCheckCircle /></div>
            <div className="stat-content">
              <h3>{stats.active}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card admin-users">
            <div className="stat-icon"><FiUser /></div>
            <div className="stat-content">
              <h3>{stats.admins}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card inactive-users">
            <div className="stat-icon"><MdBlock /></div>
            <div className="stat-content">
              <h3>{stats.inactive}</h3>
              <p>Inactive</p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div className="filters-section" variants={itemVariants}>
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <MdFilterList className="filter-icon" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="filter-group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button className="btn-refresh" onClick={handleRefresh}>
              <MdRefresh />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div className="results-info" variants={itemVariants}>
          <p>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* ─── DESKTOP TABLE ─── */}
        <motion.div className="table-container desktop-table" variants={itemVariants}>
          <div className="tableHeader">
            <div>User ID</div>
            <div>User Info</div>
            <div>Role</div>
            <div>Status</div>
            <div>Member Since</div>
            <div>Last Active</div>
            <div>Actions</div>
          </div>

         {filteredUsers.map((user, index) => (
  <motion.div
    className="tableRow clickable-row"
    key={user._id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}

    onClick={() =>
      navigate(`/admin/users/${user._id}`)
    }
  >

    <div className="cell" data-label="User ID">
      <div className="user-id">
        {user._id.slice(-5)}
      </div>
    </div>

    <div className="cell" data-label="User Info">

      <div className="user-info">

        <img
          src={
            user.photo ||
            "https://via.placeholder.com/150?text=User"
          }
          alt={user.name}
          className="userPhoto"
        />

        <div className="user-details">

          <div className="user-name">
            {user.name}
          </div>

          <div className="user-email">
            <MdEmail className="email-icon" />
            {user.email}
          </div>

        </div>

      </div>

    </div>

    <div className="cell" data-label="Role">

      <span className={getRoleBadgeClass(user.role)}>
        {user.role}
      </span>

    </div>

    <div className="cell" data-label="Status">

      <span className={getStatusBadgeClass(user.status)}>
        {user.status}
      </span>

    </div>

    <div className="cell" data-label="Member Since">

      <span className="join-date">

        <MdCalendarToday className="date-icon" />

        {formatDate(user.createdAt)}

      </span>

    </div>

    <div className="cell" data-label="Last Active">

      <span className="last-active">

        {user.lastActive
          ? formatDate(user.lastActive)
          : "—"}

      </span>

    </div>

    <div className="cell" data-label="Actions">

      <div className="action-buttons">

        {/* EDIT */}

        <button
          className="btn-edit"
          title="Edit User"

          onClick={(e) => {

            e.stopPropagation();

             navigate(`/admin/users/${user._id}`);
          }}
        >
          <MdEdit />
        </button>

        {/* STATUS */}

        <button
          className={`btn-status ${
            user.status === "Active"
              ? "btn-inactive"
              : "btn-active"
          }`}

          title={
            user.status === "Active"
              ? "Deactivate User"
              : "Activate User"
          }

          onClick={(e) => {

            e.stopPropagation();

            handleToggleStatus(
              user._id,
              user.status
            );
          }}
        >

          {user.status === "Active"
            ? <MdBlock />
            : <MdCheckCircle />
          }

        </button>

        {/* DELETE */}

        <button
          className="btn-delete"
          title="Delete User"

          onClick={(e) => {

            e.stopPropagation();

            setDeleteConfirm(user._id);
          }}
        >
          <MdDelete />
        </button>

      </div>

    </div>

  </motion.div>
))}

          {filteredUsers.length === 0 && (
            <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FiUsers className="empty-icon" />
              <h3>No Users Found</h3>
              <p>
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are no users in the system yet."}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ─── MOBILE CARDS ─── */}
        <motion.div className="mobile-cards-grid" variants={itemVariants}>
          {filteredUsers.map((user, index) => (
            <motion.div
              className="mobile-user-card"
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Card Top: Avatar + Name + Badges */}
              <div className="mc-top">
                <img
                  src={user.photo || "https://via.placeholder.com/150?text=User"}
                  alt={user.name}
                  className="mc-avatar"
                />
                <div className="mc-identity">
                  <p className="mc-name">{user.name}</p>
                  <p className="mc-id">#{user._id.slice(-5)}</p>
                  <div className="mc-badges">
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                    <span className={getStatusBadgeClass(user.status)}>{user.status}</span>
                  </div>
                </div>
              </div>

              {/* Card Body: Email + Dates */}
              <div className="mc-body">
                <div className="mc-info-row">
                  <MdEmail className="mc-icon" />
                  <span>{user.email}</span>
                </div>
                <div className="mc-dates">
                  <div className="mc-date-item">
                    <span className="mc-date-label">
                      <MdCalendarToday className="mc-icon" /> Joined
                    </span>
                    <span className="mc-date-value">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="mc-date-item">
                    <span className="mc-date-label">
                      <MdCalendarToday className="mc-icon" /> Last Active
                    </span>
                    <span className="mc-date-value">
                      {user.lastActive ? formatDate(user.lastActive) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="mc-actions">
                <button className="mc-btn mc-btn-edit" title="Edit User">
                  <MdEdit />
                  <span>Edit</span>
                </button>
                <button
                  className={`mc-btn mc-btn-status ${user.status === "Active" ? "deactivate" : "activate"}`}
                  onClick={() => handleToggleStatus(user._id, user.status)}
                >
                  {user.status === "Active" ? <MdBlock /> : <MdCheckCircle />}
                  <span>{user.status === "Active" ? "Suspend" : "Activate"}</span>
                </button>
                <button
                  className="mc-btn mc-btn-delete"
                  title="Delete User"
                  onClick={() => setDeleteConfirm(user._id)}
                >
                  <MdDelete />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredUsers.length === 0 && (
            <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FiUsers className="empty-icon" />
              <h3>No Users Found</h3>
              <p>
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are no users in the system yet."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
    </section>
  );
};

export default Users;
