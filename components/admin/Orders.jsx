import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { GiArmoredBoomerang } from "react-icons/gi";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, processOrder } from "../../redux/actions/admin";
import toast from "react-hot-toast";
import LoadingSpinner from "../layout/LoadingSpinner";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, message, error } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  // Show feedback toasts
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      dispatch(getAdminOrders()); // refresh list after processing
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":   return "status-badge processing";
      case "confirmed":    return "status-badge pending";
      case "preparing":    return "status-badge pending";
      case "out for delivery": return "status-badge shipped";
      case "delivered":    return "status-badge delivered";
      case "cancelled":    return "status-badge cancelled";
      default:             return "status-badge";
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleProcess = (id) => {
    dispatch(processOrder(id));
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <section className="tableClass">
      <Helmet>
        <title>Orders | Los Pollos Hermanos</title>
      </Helmet>
      <main>
        <div className="table-header">
          <h1>Order Management</h1>
          <p>Manage and track all customer orders</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const qty = order.orderItems?.reduce((acc, i) => acc + i.quantity, 0) || 0;
              return (
                <tr key={order._id} className="order-row">
                  <td data-label="Order ID">
                    <div className="order-id">#{order._id.slice(-6)}</div>
                  </td>
                  <td data-label="Status">
                    <span className={getStatusBadgeClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td data-label="Items">
                    <span className="item-count">
                      {qty} {qty === 1 ? "item" : "items"}
                    </span>
                  </td>
                  <td data-label="Amount">
                    <span className="amount">{formatAmount(order.totalAmount)}</span>
                  </td>
                  <td data-label="Payment">
                    <span className="payment-method" style={{ textTransform: "uppercase" }}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td data-label="Customer">
                    <div className="customer-info">
                      <span className="customer-name">
                        {order.user?.name || "Unknown"}
                      </span>
                      <small>{order.user?.email || ""}</small>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <Link
                        to={`/order/${order._id}`}
                        className="btn-view"
                        title="View Order Details"
                      >
                        <AiOutlineEye />
                        <span>View</span>
                      </Link>
                      {order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
                        <button
                          className="btn-update"
                          title="Advance Order Status"
                          onClick={() => handleProcess(order._id)}
                        >
                          <GiArmoredBoomerang />
                          <span>Process</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="empty-state">
            <h3>No Orders Found</h3>
            <p>No orders have been placed yet.</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default Orders;