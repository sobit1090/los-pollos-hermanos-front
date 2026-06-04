import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../../redux/actions/order";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../layout/LoadingSpinner";
import "../../styles/footer.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { order, loading, error } = useSelector((state) => state.orders || {});

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'status-badge processing';
      case 'confirmed':
      case 'preparing':
        return 'status-badge pending';
      case 'out for delivery':
      case 'shipped':
        return 'status-badge shipped';
      case 'delivered':
        return 'status-badge delivered';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (!order) {
    return (
      <section className="orderDetails">
        <main>
          <div className="empty-state">
            <h3>Order Not Found</h3>
            <p>We couldn't retrieve the details for order #{id?.slice(-6)}.</p>
            <button className="btn btn-secondary" onClick={() => navigate("/myorders")}>
              Back to My Orders
            </button>
          </div>
        </main>
      </section>
    );
  }

  const {
    shippingInfo = {},
    orderItems = [],
    orderStatus,
    paymentMethod,
    paymentInfo = {},
    itemsPrice = 0,
    shippingCharges = 0,
    taxPrice = 0,
    totalAmount = 0,
    createdAt,
    deliveredAt,
    paidAt,
  } = order;

  const fullAddress = `${shippingInfo.houseNo || ""}, ${shippingInfo.city || ""}, ${shippingInfo.state || ""}, ${shippingInfo.country || ""} - ${shippingInfo.pinCode || ""}`;

  return (
    <section className="orderDetails">
      <Helmet>
        <title>Order Details | Los Pollos Hermanos</title>
      </Helmet>
      <main>
        <div className="order-header">
          <h1>Order Details</h1>
          <p>Order #{order._id} • Placed on {formatDate(createdAt)}</p>
        </div>

        <div className="order-grid">
          {/* Shipping Information */}
          <div className="info-card">
            <div className="card-header">
              <div className="icon">🚚</div>
              <h2>Shipping Information</h2>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="label">Delivery Address:</span>
                <span className="value">{fullAddress}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="info-card">
            <div className="card-header">
              <div className="icon">👤</div>
              <h2>Contact Details</h2>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="label">Customer Name:</span>
                <span className="value">{shippingInfo.name || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone Number:</span>
                <span className="value">{shippingInfo.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="info-card">
            <div className="card-header">
              <div className="icon">📊</div>
              <h2>Order Status</h2>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="label">Current Status:</span>
                <span className={getStatusBadgeClass(orderStatus)}>
                  {orderStatus}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Order Placed:</span>
                <span className="value">{formatDate(createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Delivered At:</span>
                <span className="value">{deliveredAt ? formatDate(deliveredAt) : "Not Delivered yet"}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="info-card">
            <div className="card-header">
              <div className="icon">💳</div>
              <h2>Payment Details</h2>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="label">Payment Method:</span>
                <span className="value payment-method" style={{ textTransform: "uppercase" }}>{paymentMethod}</span>
              </div>
              <div className="info-item">
                <span className="label">Transaction Reference:</span>
                <span className="value reference-id">{paymentInfo.id ? `#${paymentInfo.id}` : "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Date:</span>
                <span className="value">{paidAt ? formatDate(paidAt) : "COD / Pending"}</span>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="info-card amount-card">
            <div className="card-header">
              <div className="icon">💰</div>
              <h2>Amount Breakdown</h2>
            </div>
            <div className="card-content">
              <div className="amount-item">
                <span className="label">Items Total:</span>
                <span className="value">{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="amount-item">
                <span className="label">Shipping Charges:</span>
                <span className="value">{formatCurrency(shippingCharges)}</span>
              </div>
              <div className="amount-item">
                <span className="label">Tax & Charges (18%):</span>
                <span className="value">{formatCurrency(taxPrice)}</span>
              </div>
              <div className="amount-divider"></div>
              <div className="amount-item total">
                <span className="label">Total Amount:</span>
                <span className="value">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="info-card items-card">
            <div className="card-header">
              <div className="icon">📦</div>
              <h2>Ordered Items</h2>
            </div>
            <div className="card-content">
              <div className="items-list">
                {orderItems.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      <span className="unit-price">{formatCurrency(item.price)} each</span>
                      <span className="total-price">{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="items-divider"></div>
              <div className="item-row subtotal">
                <span className="label">Sub Total</span>
                <span className="value">{formatCurrency(itemsPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn btn-primary" onClick={() => window.print()}>Print Invoice</button>
          <button className="btn btn-secondary" onClick={() => navigate("/myorders")}>Back to Orders</button>
        </div>
      </main>
    </section>
  );
};

export default OrderDetails;