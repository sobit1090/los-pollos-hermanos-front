  import React, { useEffect, useState } from "react";
  import { motion } from "framer-motion";
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
    MdCalendarToday
  } from "react-icons/md";
  import { 
    FiUser,
    FiUsers,
    FiMail,
    FiCalendar
  } from "react-icons/fi";

  const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API call
    const mockUsers = [
      {
        id: "USR001",
        name: "Abhi Sharma",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Admin",
        since: "2023-03-24",
        email: "abhi@example.com",
        status: "Active",
        lastActive: "2024-01-15"
      },
      {
        id: "USR002",
        name: "Shobhit Kumar",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "User",
        since: "2022-05-12",
        email: "shobhit@example.com",
        status: "Active",
        lastActive: "2024-01-14"
      },
      {
        id: "USR003",
        name: "Rahul Verma",
        photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
        role: "Moderator",
        since: "2023-01-01",
        email: "rahul@example.com",
        status: "Inactive",
        lastActive: "2023-12-20"
      },
      {
        id: "USR004",
        name: "Sneha Patel",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        role: "Admin",
        since: "2023-07-15",
        email: "sneha@example.com",
        status: "Active",
        lastActive: "2024-01-15"
      },
      {
        id: "USR005",
        name: "Priya Singh",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        role: "User",
        since: "2023-11-08",
        email: "priya@example.com",
        status: "Active",
        lastActive: "2024-01-13"
      },
      {
        id: "USR006",
        name: "Amit Joshi",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        role: "User",
        since: "2023-09-22",
        email: "amit@example.com",
        status: "Suspended",
        lastActive: "2024-01-10"
      }
    ];

    useEffect(() => {
      document.body.classList.add('users-page');
      
      // Simulate API call
      const fetchUsers = async () => {
        setLoading(true);
        try {
          // Replace with actual API call
          // const response = await axios.get('/api/v1/admin/users');
          // setUsers(response.data.users);
          
          setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false);
        }
      };

      fetchUsers();

      return () => {
        document.body.classList.remove('users-page');
      };
    }, []);

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

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

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const handleEditUser = (userId) => {
      console.log('Edit user:', userId);
      // Implement edit functionality
    };

    const handleDeleteUser = (userId) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        console.log('Delete user:', userId);
        // Implement delete functionality
        setUsers(users.filter(user => user.id !== userId));
      }
    };

    const handleToggleStatus = (userId, currentStatus) => {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      console.log(`Toggle user ${userId} status to:`, newStatus);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    };

    const handleRefresh = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    const stats = {
      total: users.length,
      active: users.filter(user => user.status === 'Active').length,
      admins: users.filter(user => user.role === 'Admin').length,
      inactive: users.filter(user => user.status === 'Inactive').length
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

          {/* Table Container */}
          <motion.div className="table-container" variants={itemVariants}>
            {/* Table Header */}
            <div className="tableHeader">
              <div>User ID</div>
              <div>User Info</div>
              <div>Role</div>
              <div>Status</div>
              <div>Member Since</div>
              <div>Last Active</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {filteredUsers.map((user, index) => (
              <motion.div 
                className="tableRow" 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="cell" data-label="User ID">
                  <div className="user-id">
                    {user.id}
                  </div>
                </div>
                <div className="cell" data-label="User Info">
                  <div className="user-info">
                    <img 
                      src={user.photo} 
                      alt={user.name} 
                      className="userPhoto"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=User';
                      }}
                    />
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
                    {user.status}
                  </span>
                </div>
                <div className="cell" data-label="Member Since">
                  <span className="join-date">
                    <MdCalendarToday className="date-icon" />
                    {formatDate(user.since)}
                  </span>
                </div>
                <div className="cell" data-label="Last Active">
                  <span className="last-active">
                    {formatDate(user.lastActive)}
                  </span>
                </div>
                <div className="cell" data-label="Actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      title="Edit User"
                      onClick={() => handleEditUser(user.id)}
                    >
                      <MdEdit />
                    </button>
                    <button 
                      className={`btn-status ${user.status === 'Active' ? 'btn-inactive' : 'btn-active'}`}
                      title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === 'Active' ? <MdBlock /> : <MdCheckCircle />}
                    </button>
                    <button 
                      className="btn-delete"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

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
              </motion.div>
            )}
          </motion.div>
        </motion.main>
      </section>
    );
  };

  export default Users;