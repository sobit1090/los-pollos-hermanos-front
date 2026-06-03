import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

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

import {
  FiUser,
  FiUsers,
} from "react-icons/fi";

import server from "../../redux/store";

/* =========================================
    USERS COMPONENT
========================================= */

const Users = () => {

  /* =========================================
      STATES
  ========================================= */

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showAddUserModal, setShowAddUserModal] =
    useState(false);

  const [previewImage, setPreviewImage] =
    useState(null);

  const [errors, setErrors] = useState({});

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    photo: null,
  });

  /* =========================================
      FETCH USERS
  ========================================= */

  const fetchUsers = async () => {

    try {

      const { data } = await axios.get(
        `${server}/admin/users`,
        {
          withCredentials: true,
        }
      );

      setUsers(data.users);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch users"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  /* =========================================
      INPUT HANDLERS
  ========================================= */

  const handleInputChange = (e) => {

    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setNewUser({
      ...newUser,
      photo: file,
    });

    const imageURL =
      URL.createObjectURL(file);

    setPreviewImage(imageURL);
  };

  /* =========================================
      MODAL
  ========================================= */

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

  /* =========================================
      VALIDATION
  ========================================= */

  const validateFields = () => {

    let tempErrors = {};

    if (!newUser.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!newUser.email.trim()) {
      tempErrors.email = "Email is required";
    }

    else if (
      !/\S+@\S+\.\S+/.test(newUser.email)
    ) {
      tempErrors.email =
        "Invalid email format";
    }

    if (!newUser.password.trim()) {
      tempErrors.password =
        "Password is required";
    }

    else if (
      newUser.password.length < 6
    ) {
      tempErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(tempErrors);

    return (
      Object.keys(tempErrors).length === 0
    );
  };

  /* =========================================
      ADD USER
  ========================================= */

  const submitAddUser = async () => {

    if (!validateFields()) return;

    try {

      await axios.post(
        `${server}/admin/register/addnewuser`,
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      toast.success(
        "User added successfully!"
      );

      closeAddUserModal();

      fetchUsers();

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Error adding user"
      );
    }
  };

  /* =========================================
      DELETE USER
  ========================================= */

  const handleDeleteUser = async (
    userId
  ) => {

    try {

      await axios.delete(
        `${server}/admin/users/${userId}`,
        {
          withCredentials: true,
        }
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== userId
        )
      );

      setDeleteConfirm(null);

      toast.success(
        "User deleted successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };

  /* =========================================
      TOGGLE STATUS
  ========================================= */

  const handleToggleStatus = async (
    userId
  ) => {

    try {

      const { data } = await axios.put(
        `${server}/admin/users/${userId}/toggle`,
        {},
        {
          withCredentials: true,
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: data.status,
              }
            : user
        )
      );

      toast.success(
        `User ${data.status}`
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update user"
      );
    }
  };

  /* =========================================
      REFRESH
  ========================================= */

  const handleRefresh = async () => {

    setLoading(true);

    await fetchUsers();

    toast.success("Users refreshed");
  };

  /* =========================================
      FILTER USERS
  ========================================= */

 const filteredUsers = (users || []).filter((user) => {

  const userName =
    String(user?.name || "").toLowerCase();

  const userEmail =
    String(user?.email || "").toLowerCase();

  const userId =
    String(user?._id || "").toLowerCase();

  const userRole =
    String(user?.role || "user").toLowerCase();

  const userStatus =
    String(user?.status || "active").toLowerCase();

  const search =
    searchTerm.toLowerCase();

  const matchesSearch =
    userName.includes(search) ||
    userEmail.includes(search) ||
    userId.includes(search);

  const matchesRole =
    roleFilter === "all" ||
    userRole === roleFilter.toLowerCase();

  const matchesStatus =
    statusFilter === "all" ||
    userStatus === statusFilter.toLowerCase();

  return (
    matchesSearch &&
    matchesRole &&
    matchesStatus
  );
});

  /* =========================================
      STATS
  ========================================= */

 const stats = {

  total:
    (users || []).length,

  active:
    (users || []).filter(
      (user) =>
        String(user?.status || "")
          .toLowerCase() === "active"
    ).length,

  admins:
    (users || []).filter(
      (user) =>
        String(user?.role || "")
          .toLowerCase() === "admin"
    ).length,

  inactive:
    (users || []).filter(
      (user) =>
        String(user?.status || "")
          .toLowerCase() === "inactive"
    ).length,
};

  /* =========================================
      HELPERS
  ========================================= */

  const getRoleBadgeClass = (role) => {

   switch (String(role || "").toLowerCase()){

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

  const getStatusBadgeClass = (
    status
  ) => {

    switch (
      (status || "")
        .toLowerCase()
    ) {

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

  const formatDate = (
    dateString
  ) => {

    if (!dateString) return "—";

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================
      ANIMATIONS
  ========================================= */

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

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

  /* =========================================
      LOADING
  ========================================= */

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

  /* =========================================
      UI
  ========================================= */

  return (

    <section className="tableClass">

      <Helmet>
        <title>
          Users | Admin
        </title>
      </Helmet>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* HEADER */}

        <motion.div
          className="table-header"
          variants={itemVariants}
        >

          <div className="header-content">

            <div className="title-section">

              <h1>

                <FiUsers className="header-icon" />

                User Management

              </h1>

              <p>
                Manage all system users
              </p>

            </div>

            <button
              onClick={
                AddNewUserHandler
              }
              className="btn-primary btn-add-user"
            >

              <MdAdd />

              <span>
                Add New User
              </span>

            </button>

          </div>

        </motion.div>

      </motion.main>

    </section>
  );
};

export default Users;