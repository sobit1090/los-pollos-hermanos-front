import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { server } from "../../redux/store";
import {
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdEmail,
  MdCalendarToday,
  MdClose,
} from "react-icons/md";
import { FiMessageSquare, FiMail, FiUser } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(`${server}/admin/complaints`, {
        withCredentials: true,
      });
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load complaints/messages");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchComplaints();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredComplaints = complaints.filter((item) => {
    const nameMatch = item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const emailMatch = item.email ? item.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const messageMatch = item.message ? item.message.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const idMatch = item._id ? item._id.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    const matchesSearch = nameMatch || emailMatch || messageMatch || idMatch;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getBadgeClass = (type) => {
    return type === "complaint" ? "badge badge-complaint" : "badge badge-contact";
  };

  if (loading) {
    return (
      <section className="tableClass">
        <main>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading complaints & messages...</p>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="tableClass">
      <Helmet>
        <title>Complaints & Support | Admin</title>
      </Helmet>

      <main className="complaints-admin-main">
        {/* Header Section */}
        <div className="table-header">
          <div className="header-content">
            <div className="title-section">
              <h1>
                <FiMessageSquare className="header-icon" />
                Complaints & Inquiries
              </h1>
              <p>Manage customer complaints and contact messages</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card total-users">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #6c757d, #495057)" }}><FiMessageSquare /></div>
            <div className="stat-content">
              <h3>{complaints.length}</h3>
              <p>Total Entries</p>
            </div>
          </div>
          <div className="stat-card active-users" style={{ borderLeft: "4px solid #dc3545" }}>
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #dc3545, #bd2130)" }}><FiMessageSquare /></div>
            <div className="stat-content">
              <h3>{complaints.filter((c) => c.type === "complaint").length}</h3>
              <p>Complaints</p>
            </div>
          </div>
          <div className="stat-card admin-users" style={{ borderLeft: "4px solid #28a745" }}>
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}><FiMail /></div>
            <div className="stat-content">
              <h3>{complaints.filter((c) => c.type === "contact").length}</h3>
              <p>Contact Inquiries</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, message or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <MdFilterList className="filter-icon" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
                <option value="all">All Types</option>
                <option value="complaint">Complaints</option>
                <option value="contact">Contact Messages</option>
              </select>
            </div>
            <button className="btn-refresh" onClick={handleRefresh}>
              <MdRefresh />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> entries
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="table-container desktop-table">
          <div className="tableHeader complaints-grid-header">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Type</div>
            <div>Message</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {filteredComplaints.map((item) => (
            <div
              className="tableRow clickable-row complaints-grid-row"
              key={item._id}
              onClick={() => setSelectedComplaint(item)}
            >
              <div className="cell" data-label="ID">
                <span className="user-id">#{item._id.slice(-5)}</span>
              </div>
              <div className="cell" data-label="Name">
                <span className="complaint-name">{item.name}</span>
              </div>
              <div className="cell" data-label="Email">
                <span className="complaint-email">{item.email}</span>
              </div>
              <div className="cell" data-label="Type">
                <span className={getBadgeClass(item.type)}>{item.type}</span>
              </div>
              <div className="cell" data-label="Message">
                <span className="complaint-msg-trunc">
                  {item.message && item.message.length > 50
                    ? `${item.message.slice(0, 50)}...`
                    : item.message || ""}
                </span>
              </div>
              <div className="cell" data-label="Date">
                <span className="join-date">
                  <MdCalendarToday className="date-icon" />
                  {formatDate(item.createdAt).split(",")[0]}
                </span>
              </div>
              <div className="cell" data-label="Action">
                <button
                  className="btn-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(item);
                  }}
                >
                  <AiOutlineEye />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="empty-state">
              <FiMessageSquare className="empty-icon" />
              <h3>No Entries Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Mobile View Card Grid */}
        <div className="mobile-cards-grid">
          {filteredComplaints.map((item) => (
            <div
              className="mobile-user-card complaint-card"
              key={item._id}
              onClick={() => setSelectedComplaint(item)}
            >
              <div className="mc-top">
                <div className="mc-identity">
                  <p className="mc-name">{item.name}</p>
                  <p className="mc-id">#{item._id.slice(-5)}</p>
                  <div className="mc-badges">
                    <span className={getBadgeClass(item.type)}>{item.type}</span>
                  </div>
                </div>
              </div>
              <div className="mc-body">
                <div className="mc-info-row">
                  <MdEmail className="mc-icon" />
                  <span>{item.email}</span>
                </div>
                <div className="mc-message-preview">
                  <p className="msg-title">Message Preview:</p>
                  <p className="msg-text">
                    {item.message && item.message.length > 80
                      ? `${item.message.slice(0, 80)}...`
                      : item.message || ""}
                  </p>
                </div>
                <div className="mc-dates">
                  <div className="mc-date-item">
                    <span className="mc-date-label">
                      <MdCalendarToday className="mc-icon" /> Sent
                    </span>
                    <span className="mc-date-value">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="mc-actions">
                <button
                  className="mc-btn mc-btn-edit"
                  style={{ background: "#007bff", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(item);
                  }}
                >
                  <AiOutlineEye />
                  <span>View Full Details</span>
                </button>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="empty-state">
              <FiMessageSquare className="empty-icon" />
              <h3>No Entries Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
            >
              <motion.div
                className="modal-content complaint-detail-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close-btn" onClick={() => setSelectedComplaint(null)}>
                  <MdClose />
                </button>
                <div className="modal-header-section">
                  <span className={getBadgeClass(selectedComplaint.type)}>
                    {selectedComplaint.type}
                  </span>
                  <h3>Entry Details</h3>
                  <span className="modal-entry-id">ID: {selectedComplaint._id}</span>
                </div>

                <div className="modal-detail-body">
                  <div className="detail-item">
                    <span className="detail-label"><FiUser /> Name</span>
                    <span className="detail-value">{selectedComplaint.name}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label"><FiMail /> Email</span>
                    <span className="detail-value">
                      <a href={`mailto:${selectedComplaint.email}`}>{selectedComplaint.email}</a>
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label"><MdCalendarToday /> Submitted At</span>
                    <span className="detail-value">{formatDate(selectedComplaint.createdAt)}</span>
                  </div>

                  <div className="detail-item message-detail">
                    <span className="detail-label">Message Content</span>
                    <div className="message-content-box">
                      {selectedComplaint.message}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setSelectedComplaint(null)}>
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedComplaint.email}?subject=Re: Los Pollos Hermanos Support - ${selectedComplaint.type}`}
                    className="btn-primary"
                    style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </section>
  );
};

export default Complaints;
