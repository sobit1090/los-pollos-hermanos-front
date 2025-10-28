import React, { useEffect } from "react";
import me from "../../assets/founder.webp";

const Users = () => {
  const users = [
    {
      id: "USR001",
      name: "Abhi",
      photo: me,
      role: "Admin",
      since: "24-03-2023",
      email: "abhi@example.com",
      status: "Active"
    },
    {
      id: "USR002",
      name: "Shobhit",
      photo: me,
      role: "User",
      since: "12-05-2022",
      email: "shobhit@example.com",
      status: "Active"
    },
    {
      id: "USR003",
      name: "Rahul",
      photo: me,
      role: "Moderator",
      since: "01-01-2023",
      email: "rahul@example.com",
      status: "Inactive"
    },
    {
      id: "USR004",
      name: "Sneha",
      photo: me,
      role: "Admin",
      since: "15-07-2023",
      email: "sneha@example.com",
      status: "Active"
    },
  ];

  useEffect(() => {
    document.body.classList.add('users-page');
    return () => {
      document.body.classList.remove('users-page');
    };
  }, []);

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

  return (
    <section className="tableClass">
      <main>
        <div className="table-header">
          <h1>User Management</h1>
          <p>Manage all system users and their permissions</p>
        </div>
        
        {/* Table Header */}
        <div className="tableHeader">
          <div>User ID</div>
          <div>User Info</div>
          <div>Role</div>
          <div>Status</div>
          <div>Member Since</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {users.map((user) => (
          <div className="tableRow" key={user.id}>
            <div className="cell" data-label="User ID">
              <div className="user-id">
                {user.id}
              </div>
            </div>
            <div className="cell" data-label="User Info">
              <div className="user-info">
                <img src={user.photo} alt={user.name} className="userPhoto" />
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
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
                {formatDate(user.since)}
              </span>
            </div>
            <div className="cell" data-label="Actions">
              <div className="action-buttons">
                <button 
                  className="btn-edit"
                  title="Edit User"
                  onClick={() => console.log('Edit user:', user.id)}
                >
                  <span>Edit</span>
                </button>
                <button 
                  className="btn-delete"
                  title="Delete User"
                  onClick={() => console.log('Delete user:', user.id)}
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="empty-state">
            <h3>No Users Found</h3>
            <p>There are no users in the system yet.</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default Users;