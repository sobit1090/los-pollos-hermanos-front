import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom"; // React Router v5
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

import { server } from "../../redux/store";

import {
  MdArrowBack, MdEdit, MdDelete, MdBlock, MdCheckCircle,
  MdEmail, MdCalendarToday, MdLocationOn, MdShoppingBag,
  MdWarning, MdPerson, MdSave, MdClose, MdLock,
  MdPhotoCamera, MdAccessTime, MdAttachMoney,
  MdLocalShipping, MdPhone,
} from "react-icons/md";
import { FiUser, FiPackage, FiMapPin, FiActivity } from "react-icons/fi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    })
    : "—";

const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
    : "—";

const statusColor = {
  Active: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Inactive: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Suspended: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const roleColor = {
  admin: { bg: "#fee2e2", color: "#991b1b" },
  moderator: { bg: "#ede9fe", color: "#6d28d9" },
  user: { bg: "#dbeafe", color: "#1e40af" },
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    role: user.role || "user",
    password: "",
    confirmPassword: "",
    photo: null,
  });
  const [preview, setPreview] = useState(user.photo || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.password && form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      if (form.password) formData.append("password", form.password);
      if (form.photo) formData.append("photo", form.photo);

      const { data } = await axios.put(
        `${server}/admin/users/${user._id}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("User updated successfully!");
      onSave(data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="ud-modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="ud-modal edit-user-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="emodal-header">
          <div className="emodal-title">
            <MdPerson className="emodal-title-icon" />
            <div><h3>Edit User</h3><p>#{user._id?.slice(-6)}</p></div>
          </div>
          <button className="emodal-close" onClick={onClose}><MdClose /></button>
        </div>

        <div className="emodal-photo-section">
          <div className="emodal-photo-wrap">
            <img
              src={preview || "https://via.placeholder.com/150?text=User"}
              alt="avatar"
              className="emodal-avatar"
            />
            <label htmlFor="editPhotoUD" className="emodal-photo-btn"><MdPhotoCamera /></label>
            <input type="file" id="editPhotoUD" accept="image/*" onChange={handlePhoto} hidden />
          </div>
          <span className="emodal-photo-hint">Click camera to change photo</span>
        </div>

        <div className="emodal-body">
          <div className="eform-group">
            <label><MdPerson /> Full Name</label>
            <input
              name="name" type="text" placeholder="Enter full name"
              value={form.name} onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <small className="ferror">{errors.name}</small>}
          </div>

          <div className="eform-group">
            <label><FiUser /> Role</label>
            <div className="role-selector">
              {["user", "moderator", "admin"].map((r) => (
                <button
                  key={r} type="button"
                  className={`role-option ${r} ${form.role === r ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="eform-divider"><span><MdLock /> Password Reset (optional)</span></div>

          <div className="eform-group">
            <label>New Password</label>
            <input
              name="password" type="password" placeholder="Leave blank to keep current"
              value={form.password} onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <small className="ferror">{errors.password}</small>}
          </div>
          <div className="eform-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword" type="password" placeholder="Repeat new password"
              value={form.confirmPassword} onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && <small className="ferror">{errors.confirmPassword}</small>}
          </div>
        </div>

        <div className="emodal-footer">
          <button className="ebtn-cancel" onClick={onClose}>Cancel</button>
          <button className="ebtn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? <span className="btn-spinner" /> : <><MdSave /> Save Changes</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main UserDetail Component ────────────────────────────────────────────────
const UserDetail = () => {
  const { id } = useParams();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // ── Fetch user detail + orders in parallel ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          axios.get(`${server}/admin/users/${id}`, { withCredentials: true }),
          axios.get(`${server}/admin/users/${id}/orders`, { withCredentials: true }),
        ]);
        setUser(userRes.data.user);
        setOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Toggle status ──────────────────────────────────────────────────────────
  const handleToggleStatus = async () => {
    try {
      const { data } = await axios.put(
        `${server}/admin/users/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      setUser((prev) => ({ ...prev, status: data.status }));
      toast.success(`User ${data.status === "Active" ? "activated" : "suspended"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await axios.delete(`${server}/admin/users/${id}`, { withCredentials: true });
      toast.success("User deleted");
      history.push("/admin/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // ── Stats derived from orders ──────────────────────────────────────────────
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0),
    delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    pending: orders.filter((o) => o.orderStatus === "Processing").length,
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: <FiUser /> },
    { key: "orders", label: "Orders", icon: <FiPackage /> },
    { key: "addresses", label: "Addresses", icon: <FiMapPin /> },
    { key: "activity", label: "Activity", icon: <FiActivity /> },
  ];

  const orderBadge = (status) => {
    const map = {
      Processing: { bg: "#fef3c7", color: "#92400e" },
      Confirmed: { bg: "#dbeafe", color: "#1e3a8a" },
      Preparing: { bg: "#ede9fe", color: "#5b21b6" },
      "Out for Delivery": { bg: "#e0f2fe", color: "#0c4a6e" },
      Delivered: { bg: "#d1fae5", color: "#065f46" },
      Cancelled: { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status] || { bg: "#f1f5f9", color: "#475569" };
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: "0.25rem 0.65rem", borderRadius: "20px",
        fontSize: "0.72rem", fontWeight: 700,
      }}>
        {status}
      </span>
    );
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="ud-page">
        <div className="ud-loading">
          <div className="ud-spinner" />
          <p>Loading user details…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="ud-page">
        <div className="ud-not-found">
          <MdWarning className="ud-nf-icon" />
          <h2>User Not Found</h2>
          <button className="ud-back-btn" onClick={() => history.push("/admin/users")}>
            <MdArrowBack /> Back to Users
          </button>
        </div>
      </section>
    );
  }

  const sc = statusColor[user.status] || statusColor.Inactive;
  const rc = roleColor[user.role] || roleColor.user;

  return (
    <section className="ud-page">
      <Helmet><title>{user.name} | Admin</title></Helmet>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <EditUserModal
            user={user}
            onClose={() => setShowEdit(false)}
            onSave={(updated) => setUser(updated)}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            className="ud-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteModal(false)}
          >
            <motion.div
              className="ud-modal delete-confirm-modal"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dcm-icon"><MdWarning /></div>
              <h3>Delete this user?</h3>
              <p>This action is permanent and cannot be undone. All associated data will be removed.</p>
              <div className="dcm-actions">
                <button className="dcm-cancel" onClick={() => setDeleteModal(false)}>Cancel</button>
                <button className="dcm-delete" onClick={handleDelete}>
                  <MdDelete /> Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="ud-inner"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top bar */}
        <div className="ud-topbar">
          <button className="ud-back-btn" onClick={() => history.push("/admin/users")}>
            <MdArrowBack /> Back to Users
          </button>
          <div className="ud-topbar-actions">
            <button className="ud-btn ud-btn-edit" onClick={() => setShowEdit(true)}>
              <MdEdit /> Edit User
            </button>
            <button
              className={`ud-btn ud-btn-status ${user.status === "Active" ? "suspend" : "activate"}`}
              onClick={handleToggleStatus}
            >
              {user.status === "Active" ? <><MdBlock /> Suspend</> : <><MdCheckCircle /> Activate</>}
            </button>
            <button className="ud-btn ud-btn-delete" onClick={() => setDeleteModal(true)}>
              <MdDelete /> Delete
            </button>
          </div>
        </div>

        {/* Profile hero */}
        <motion.div className="ud-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="ud-hero-left">
            <div className="ud-avatar-wrap">
              <img
                src={user.photo || "https://via.placeholder.com/150?text=User"}
                alt={user.name}
                className="ud-avatar"
              />
              <span className="ud-status-dot" style={{ background: sc.dot }} title={user.status} />
            </div>
            <div className="ud-hero-info">
              <h1 className="ud-user-name">{user.name}</h1>
              <p className="ud-user-id">ID: {user._id}</p>
              <div className="ud-hero-badges">
                <span className="ud-badge" style={{ background: rc.bg, color: rc.color }}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
                <span className="ud-badge" style={{ background: sc.bg, color: sc.color }}>
                  <span className="ud-badge-dot" style={{ background: sc.dot }} />
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          <div className="ud-hero-right">
            <div className="ud-contact-item"><MdEmail className="ud-ci-icon" /><span>{user.email}</span></div>
            {user.phone && <div className="ud-contact-item"><MdPhone className="ud-ci-icon" /><span>{user.phone}</span></div>}
            <div className="ud-contact-item"><MdCalendarToday className="ud-ci-icon" /><span>Joined {fmt(user.createdAt)}</span></div>
            <div className="ud-contact-item"><MdAccessTime className="ud-ci-icon" /><span>Last active: {fmtTime(user.lastActive || user.lastLogin)}</span></div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div className="ud-stats-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <div className="ud-stat-card">
            <div className="ud-stat-icon orders"><FiPackage /></div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{stats.totalOrders}</span>
              <span className="ud-stat-label">Total Orders</span>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon spent"><MdAttachMoney /></div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">₹{stats.totalSpent.toLocaleString("en-IN")}</span>
              <span className="ud-stat-label">Total Spent</span>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon delivered"><MdLocalShipping /></div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{stats.delivered}</span>
              <span className="ud-stat-label">Delivered</span>
            </div>
          </div>
          <div className="ud-stat-card">
            <div className="ud-stat-icon pending"><MdShoppingBag /></div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{stats.pending}</span>
              <span className="ud-stat-label">Pending</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="ud-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`ud-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="ud-tab-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="ud-overview">
                <div className="ud-section-card">
                  <h4 className="ud-section-title"><FiUser /> Account Information</h4>
                  <div className="ud-info-grid">
                    {[
                      ["Full Name", user.name],
                      ["Email Address", user.email],
                      ["Phone", user.phone || "Not provided"],
                      ["Role", <span style={{ textTransform: "capitalize" }}>{user.role}</span>],
                      ["Account Status", <span style={{ color: sc.color }}>{user.status}</span>],
                      ["Member Since", fmt(user.createdAt)],
                      ["Last Login", fmtTime(user.lastActive || user.lastLogin)],
                      ["User ID", <span className="ud-mono">{user._id}</span>],
                    ].map(([label, value]) => (
                      <div key={label} className="ud-info-item">
                        <span className="ud-info-label">{label}</span>
                        <span className="ud-info-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ud-section-card">
                  <div className="ud-section-header">
                    <h4 className="ud-section-title"><FiPackage /> Recent Orders</h4>
                    <button className="ud-see-all" onClick={() => setActiveTab("orders")}>See all →</button>
                  </div>
                  {orders.slice(0, 3).length === 0 ? (
                    <p className="ud-empty-text">No orders yet.</p>
                  ) : (
                    <div className="ud-recent-orders">
                      {orders.slice(0, 3).map((o) => (
                        <div key={o._id} className="ud-order-row">
                          <div className="ud-or-left">
                            <span className="ud-or-id">#{o._id?.slice(-6)}</span>
                            <span className="ud-or-date">{fmt(o.createdAt)}</span>
                          </div>
                          <div className="ud-or-right">
                            <span className="ud-or-price">₹{(o.totalPrice || o.totalAmount || 0).toLocaleString("en-IN")}</span>
                            {orderBadge(o.orderStatus)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="ud-section-card">
                <h4 className="ud-section-title"><FiPackage /> All Orders ({orders.length})</h4>
                {orders.length === 0 ? (
                  <div className="ud-empty-block">
                    <FiPackage className="ud-empty-icon" />
                    <p>This user has no orders yet.</p>
                  </div>
                ) : (
                  <div className="ud-orders-table">
                    <div className="ud-ot-header">
                      <span>Order ID</span>
                      <span>Date</span>
                      <span>Items</span>
                      <span>Total</span>
                      <span>Payment</span>
                      <span>Status</span>
                    </div>
                    {orders.map((o) => (
                      <div key={o._id} className="ud-ot-row">
                        <span className="ud-mono ud-ot-id">#{o._id?.slice(-6)}</span>
                        <span>{fmt(o.createdAt)}</span>
                        <span>{o.orderItems?.length || 0} item{o.orderItems?.length !== 1 ? "s" : ""}</span>
                        <span className="ud-ot-price">₹{(o.totalPrice || o.totalAmount || 0).toLocaleString("en-IN")}</span>
                        <span>
                          <span className={`ud-pay-badge ${o.paymentInfo?.status === "succeeded" || o.isPaid ? "paid" : "pending"}`}>
                            {o.paymentInfo?.status === "succeeded" || o.isPaid ? "Paid" : "Pending"}
                          </span>
                        </span>
                        <span>{orderBadge(o.orderStatus)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="ud-section-card">
                <h4 className="ud-section-title"><FiMapPin /> Saved Addresses</h4>
                {(!user.addresses || user.addresses.length === 0) ? (
                  <div className="ud-empty-block">
                    <FiMapPin className="ud-empty-icon" />
                    <p>No saved addresses found.</p>
                  </div>
                ) : (
                  <div className="ud-address-grid">
                    {user.addresses.map((addr, i) => (
                      <div key={i} className="ud-address-card">
                        <div className="ud-addr-top">
                          <MdLocationOn className="ud-addr-pin" />
                          <span className="ud-addr-type">{addr.addressType || `Address ${i + 1}`}</span>
                          {addr.isDefault && <span className="ud-addr-default">Default</span>}
                        </div>
                        <p className="ud-addr-line">{addr.address1}</p>
                        {addr.address2 && <p className="ud-addr-line">{addr.address2}</p>}
                        <p className="ud-addr-line">
                          {addr.city}{addr.state ? `, ${addr.state}` : ""} — {addr.pinCode}
                        </p>
                        <p className="ud-addr-line">{addr.country}</p>
                        {addr.phoneNumber && (
                          <p className="ud-addr-phone"><MdPhone /> {addr.phoneNumber}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACTIVITY */}
            {activeTab === "activity" && (
              <div className="ud-activity-wrap">
                <div className="ud-section-card">
                  <h4 className="ud-section-title"><FiActivity /> Account Activity</h4>
                  <div className="ud-timeline">
                    <div className="ud-tl-item">
                      <div className="ud-tl-dot joined" />
                      <div className="ud-tl-body">
                        <p className="ud-tl-event">Account Created</p>
                        <p className="ud-tl-time">{fmtTime(user.createdAt)}</p>
                      </div>
                    </div>
                    {(user.lastActive || user.lastLogin) && (
                      <div className="ud-tl-item">
                        <div className="ud-tl-dot active" />
                        <div className="ud-tl-body">
                          <p className="ud-tl-event">Last Login</p>
                          <p className="ud-tl-time">{fmtTime(user.lastActive || user.lastLogin)}</p>
                        </div>
                      </div>
                    )}
                    {orders.slice(0, 8).map((o) => (
                      <div key={o._id} className="ud-tl-item">
                        <div className="ud-tl-dot order" />
                        <div className="ud-tl-body">
                          <p className="ud-tl-event">
                            Placed order <span className="ud-mono">#{o._id?.slice(-6)}</span>
                            {" — "}₹{(o.totalPrice || o.totalAmount || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="ud-tl-time">{fmtTime(o.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="ud-section-card ud-danger-zone">
                  <h4 className="ud-section-title danger"><MdWarning /> Danger Zone</h4>
                  <div className="ud-danger-actions">
                    <div className="ud-danger-row">
                      <div>
                        <p className="ud-danger-label">
                          {user.status === "Active" ? "Suspend Account" : "Activate Account"}
                        </p>
                        <p className="ud-danger-desc">
                          {user.status === "Active"
                            ? "Prevent this user from logging in and using the platform."
                            : "Restore access for this user to log in and use the platform."}
                        </p>
                      </div>
                      <button
                        className={`ud-danger-btn ${user.status === "Active" ? "suspend" : "activate"}`}
                        onClick={handleToggleStatus}
                      >
                        {user.status === "Active" ? <><MdBlock /> Suspend</> : <><MdCheckCircle /> Activate</>}
                      </button>
                    </div>

                    <div className="ud-danger-divider" />

                    <div className="ud-danger-row">
                      <div>
                        <p className="ud-danger-label delete">Delete Account</p>
                        <p className="ud-danger-desc">
                          Permanently delete this user and all associated data. This cannot be undone.
                        </p>
                      </div>
                      <button className="ud-danger-btn delete" onClick={() => setDeleteModal(true)}>
                        <MdDelete /> Delete User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </motion.div>
    </section>
  );
};

export default UserDetail;
