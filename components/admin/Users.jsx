  import React, { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { server } from "../../redux/store";
import "../styles/Users.scss";

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
    MdCalendarToday
  } from "react-icons/md";
  import { 
    FiUser,
    FiUsers,
    FiMail,
    FiCalendar
  } from "react-icons/fi";
  import { Helmet } from "react-helmet";

  const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
      const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API call
    // const mockUsers = [
    //   {
    //     id: "USR001",
    //     name: "Abhi Sharma",
    //     photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    //     role: "Admin",
    //     since: "2023-03-24",
    //     email: "abhi@example.com",
    //     status: "Active",
    //     lastActive: "2024-01-15"
    //   },
    //   {
    //     id: "USR002",
    //     name: "Shobhit Kumar",
    //     photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    //     role: "User",
    //     since: "2022-05-12",
    //     email: "shobhit@example.com",
    //     status: "Active",
    //     lastActive: "2024-01-14"
    //   },
    //   {
    //     id: "USR003",
    //     name: "Rahul Verma",
    //     photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    //     role: "Moderator",
    //     since: "2023-01-01",
    //     email: "rahul@example.com",
    //     status: "Inactive",
    //     lastActive: "2023-12-20"
    //   },
    //   {
    //     id: "USR004",
    //     name: "Sneha Patel",
    //     photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    //     role: "Admin",
    //     since: "2023-07-15",
    //     email: "sneha@example.com",
    //     status: "Active",
    //     lastActive: "2024-01-15"
    //   },
    //   {
    //     id: "USR005",
    //     name: "Priya Singh",
    //     photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    //     role: "User",
    //     since: "2023-11-08",
    //     email: "priya@example.com",
    //     status: "Active",
    //     lastActive: "2024-01-13"
    //   },
    //   {
    //     id: "USR006",
    //     name: "Amit Joshi",
    //     photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    //     role: "User",
    //     since: "2023-09-22",
    //     email: "amit@example.com",
    //     status: "Suspended",
    //     lastActive: "2024-01-10"
    //   }
    // ];
    const [showAddUserModal, setShowAddUserModal] = useState(false);

const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  password: "",
  role: "user",
  photo: null,
});

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
      const { data } = await axios.get(`${server}/admin/users`, { withCredentials: true });
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

    // preview image
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
        role: newUser.role
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    toast.success("User added successfully!");
    closeAddUserModal();
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

// Filter users based on search and filters
const filteredUsers = users.filter(user => {
  const matchesSearch =
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.toLowerCase().includes(searchTerm.toLowerCase()); // ✅ use _id

  const matchesRole =
    roleFilter === "all" || user.role.toLowerCase() === roleFilter;

  const matchesStatus =
    statusFilter === "all" || user.status.toLowerCase() === statusFilter;

  return matchesSearch && matchesRole && matchesStatus;
});

// Role badge style helper
const getRoleBadgeClass = (role) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'role-badge admin';
    case 'moderator':
      return 'role-badge moderator';
    case 'user':
      return 'role-badge user';
    default:
      return 'role-badge';
  }
};

// Status badge style helper
const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'status-badge active';
    case 'inactive':
      return 'status-badge inactive';
    case 'suspended':
      return 'status-badge suspended';
    default:
      return 'status-badge';
  }
};

// Format dates cleanly
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Delete user from DB + UI
  const handleDeleteUser = async (userId ) => {
    try {
      await axios.delete(`${server}/admin/users/${userId}`, { 
        withCredentials: true 
      });
      setUsers(users.filter(user => user._id !== userId));
      setDeleteConfirm(null);
      toast.success("User deleted successfully");
    } catch (error ) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

// Suspend / Activate user
const handleToggleStatus = async (userId, currentStatus) => {
  try {
    const { data } = await axios.put(
      `${server}/admin/users/${userId}/toggle`,
      {},
      { withCredentials: true }
    );

    setUsers(users.map(user =>
      user._id === userId ? { ...user, status: data.status } : user
    ));
  } catch (error) {
    console.log(error);
  }
};
 

 
// Refresh (re-fetch)
const handleRefresh = () => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 500);
};

// Stats
const stats = {
  total: users.length,
  active: users.filter(user => user.status === 'Active').length,
  admins: users.filter(user => user.role === 'admin').length,
  inactive: users.filter(user => user.status === 'Inactive').length
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
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
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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



 {showAddUserModal && (
  <div className="modal-overlay">
    <div className="modal-content add-user-modal">

      <button className="modal-close-btn" onClick={closeAddUserModal}>✕</button>

      <h3>Add New User</h3>
      <p>Fill the form to create a new user</p>

      <div className="add-user-body">

        {/* IMAGE UPLOAD */}
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

          <input
            type="file"
            id="userPhoto"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter full name"
            value={newUser.name}
            onChange={handleInputChange}
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={handleInputChange}
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={handleInputChange}
          />
          {errors.password && <small className="error">{errors.password}</small>}
        </div>

        {/* ROLE DROPDOWN */}
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






          {/* Stats Cards */}
          <motion.div className="stats-cards" variants={itemVariants}>
            <div className="stat-card total-users">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.total}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card active-users">
              <div className="stat-icon">
                <MdCheckCircle />
              </div>
              <div className="stat-content">
                <h3>{stats.active}</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="stat-card admin-users">
              <div className="stat-icon">
                <FiUser />
              </div>
              <div className="stat-content">
                <h3>{stats.admins}</h3>
                <p>Admins</p>
              </div>
            </div>
            <div className="stat-card inactive-users">
              <div className="stat-icon">
                <MdBlock />
              </div>
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
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
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

          {/* Cards Grid Container */}
          <motion.div className="cards-container" variants={itemVariants}>
            {filteredUsers.length > 0 ? (
              <div className="cards-grid">
                {filteredUsers.map((user, index) => (
                  <motion.div 
                    className="user-card"
                    key={user._id}            
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Card Header with Avatar */}
                    <div className="card-header">
                      <img 
                        src={user.photo || "https://via.placeholder.com/150?text=User"} 
                        alt={user.name} 
                        className="card-avatar"
                      />
                      <div className="card-title-section">
                        <h3 className="card-name">{user.name}</h3>
                        <p className="card-id">ID: {user._id.slice(-5)}</p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="card-content">
                      {/* Email */}
                      <div className="info-item">
                        <span className="info-label">
                          <MdEmail className="info-icon" />
                          Email
                        </span>
                        <p className="info-value">{user.email}</p>
                      </div>

                      {/* Role and Status Badges */}
                      <div className="badges-row">
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                        <span className={getStatusBadgeClass(user.status)}>
                          {user.status}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="dates-row">
                        <div className="date-item">
                          <span className="date-label">
                            <MdCalendarToday className="date-icon" />
                            Joined
                          </span>
                          <p className="date-value">{formatDate(user.createdAt)}</p>
                        </div>
                        <div className="date-item">
                          <span className="date-label">
                            <MdRefresh className="date-icon" />
                            Last Active
                          </span>
                          <p className="date-value">{user.lastActive ? formatDate(user.lastActive) : "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions">
                      <button 
                        className="btn-edit card-btn"
                        title="Edit User"
                      >
                        <MdEdit /> Edit
                      </button>

                      <button 
                        className={`btn-status card-btn ${user.status === 'Active' ? 'btn-inactive' : 'btn-active'}`}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        onClick={() => handleToggleStatus(user._id, user.status)} 
                      >
                        {user.status === 'Active' ? <MdBlock /> : <MdCheckCircle />}
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>

                      <button 
                        className="btn-delete card-btn"
                        title="Delete User"
                        onClick={() => setDeleteConfirm(user._id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FiUsers className="empty-icon" />
                <h3>No Users Found</h3>
                <p>
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'There are no users in the system yet.'
                  }
                </p>
              </motion.div>
            )}

            {/* Delete Confirmation Modal */}
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
                    <p>
                      Are you sure you want to delete this user? 
                      This action cannot be undone.
                    </p>
                    <div className="modal-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDeleteUser(deleteConfirm)}
                      >
                        <MdDelete />
                        Delete User
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </section>
    );
  };

  export default Users;
