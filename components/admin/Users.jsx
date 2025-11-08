import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { 
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
  MdBlock,
  MdCheckCircle,
  MdRefresh,
  MdEmail,
  MdCalendarToday,
  MdWarning
} from "react-icons/md";
import { 
  FiUser,
  FiUsers,
} from "react-icons/fi";
import "./Users.scss";
import { server } from "../../redux/store";
// Configuration - Update this with your server URL
 // Change this to your actual server URL

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${server}/admin/users`, { 
        withCredentials: true 
      });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to fetch users");
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Simple toast notification function
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();

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
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${server}/admin/users/${userId}`, { 
        withCredentials: true 
      });
      setUsers(users.filter(user => user._id !== userId));
      setDeleteConfirm(null);
      showToast("User deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to delete user", "error");
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
      
      showToast(`User ${data.status === 'Active' ? 'activated' : 'deactivated'} successfully`, "success");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to update user status", "error");
    }
  };

  // Refresh (re-fetch)
  const handleRefresh = () => {
    fetchUsers();
    showToast("Users refreshed", "success");
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(user => user.status.toLowerCase() === 'active').length,
    admins: users.filter(user => user.role.toLowerCase() === 'admin').length,
    inactive: users.filter(user => user.status.toLowerCase() === 'inactive').length
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
      <section className="users-page">
        <main className="users-main">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        </main>
      </section>
    );
  }

  if (error && users.length === 0) {
    return (
      <section className="users-page">
        <main className="users-main">
          <div className="error-state">
            <MdWarning className="error-icon" />
            <h3>Failed to Load Users</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchUsers}>
              <MdRefresh />
              Try Again
            </button>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="users-page">
      <motion.main
        className="users-main"
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
            <button className="btn-primary btn-add-user">
              <MdAdd />
              <span>Add New User</span>
            </button>
          </div>
        </motion.div>

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
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
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

            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            )}

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

        {/* Table Container */}
        <motion.div className="table-container" variants={itemVariants}>
          {/* Table Header */}
          <div className="table-header-row">
            <div>User ID</div>
            <div>User Info</div>
            <div>Role</div>
            <div>Status</div>
            <div>Member Since</div>
            <div>Last Active</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
              <motion.div 
                className="table-row" 
                key={user._id}            
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="cell" data-label="User ID">
                  <div className="user-id">
                    #{user._id.slice(-6).toUpperCase()}
                  </div>
                </div>

                <div className="cell" data-label="User Info">
                  <div className="user-info">
                    <div className="user-photo-wrapper">
                      <img 
                        src={user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                        alt={user.name} 
                        className="user-photo"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
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
                    <span className="status-dot"></span>
                    {user.status}
                  </span>
                </div>

                <div className="cell" data-label="Member Since">
                  <span className="date-info">
                    <MdCalendarToday className="date-icon" />
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                <div className="cell" data-label="Last Active">
                  <span className="date-info">
                    {user.lastActive ? formatDate(user.lastActive) : "—"}
                  </span>
                </div>

                <div className="cell" data-label="Actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-edit"
                      title="Edit User"
                    >
                      <MdEdit />
                    </button>

                    <button 
                      className={`btn-action btn-status ${user.status.toLowerCase() === 'active' ? 'btn-deactivate' : 'btn-activate'}`}
                      title={user.status.toLowerCase() === 'active' ? 'Deactivate User' : 'Activate User'}
                      onClick={() => handleToggleStatus(user._id, user.status)} 
                    >
                      {user.status.toLowerCase() === 'active' ? <MdBlock /> : <MdCheckCircle />}
                    </button>

                    <button 
                      className="btn-action btn-delete"
                      title="Delete User"
                      onClick={() => setDeleteConfirm(user._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredUsers.length === 0 && (
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
              {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                <button className="btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.main>

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
    </section>
  );
};

export default Users;
