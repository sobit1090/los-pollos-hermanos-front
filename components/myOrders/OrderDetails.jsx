import React from "react";
import "../../styles/footer.scss"
 import { Helmet } from "react-helmet";
const OrderDetails = () => {
  const orderData = {
    shipping: {
      address: "123 Main Street, Sector 15, Gurgaon, Haryana - 122001",
    },
    contact: {
      name: "Abhishek Sharma",
      phone: "+91 98765 43210",
    },
    status: {
      orderStatus: "Processing",
      placedAt: "2024-01-15",
      deliveredAt: "2024-01-18",
    },
    payment: {
      method: "Online",
      reference: "PAY123456789",
      paidAt: "2024-01-15",
    },
    amount: {
      itemsTotal: 2132,
      shipping: 200,
      tax: 232,
      total: 2564,
    },
    items: [
      { name: "Cheese Burger", quantity: 12, price: 232 },
      { name: "Veg Cheese Burger", quantity: 10, price: 500 },
      { name: "Burger Fries", quantity: 10, price: 1800 },
    ]
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-badge processing';
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

  return (
    <section className="orderDetails">
        <Helmet>
        <title>OderDetails | Los Pollos Hermanos</title>
      </Helmet>
      <main>
        <div className="order-header">
          <h1>Order Details</h1>
          <p>Order #ORD123456 • {formatDate(orderData.status.placedAt)}</p>
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
                <span className="value">{orderData.shipping.address}</span>
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
                <span className="value">{orderData.contact.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone Number:</span>
                <span className="value">{orderData.contact.phone}</span>
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
                <span className={getStatusBadgeClass(orderData.status.orderStatus)}>
                  {orderData.status.orderStatus}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Order Placed:</span>
                <span className="value">{formatDate(orderData.status.placedAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Expected Delivery:</span>
                <span className="value">{formatDate(orderData.status.deliveredAt)}</span>
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
                <span className="value payment-method">{orderData.payment.method}</span>
              </div>
              <div className="info-item">
                <span className="label">Reference ID:</span>
                <span className="value reference-id">#{orderData.payment.reference}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Date:</span>
                <span className="value">{formatDate(orderData.payment.paidAt)}</span>
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
                <span className="value">{formatCurrency(orderData.amount.itemsTotal)}</span>
              </div>
              <div className="amount-item">
                <span className="label">Shipping Charges:</span>
                <span className="value">{formatCurrency(orderData.amount.shipping)}</span>
              </div>
              <div className="amount-item">
                <span className="label">Tax & Charges:</span>
                <span className="value">{formatCurrency(orderData.amount.tax)}</span>
              </div>
              <div className="amount-divider"></div>
              <div className="amount-item total">
                <span className="label">Total Amount:</span>
                <span className="value">{formatCurrency(orderData.amount.total)}</span>
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
                {orderData.items.map((item, index) => (
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
                <span className="value">{formatCurrency(orderData.amount.itemsTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn btn-primary">Print Invoice</button>
          <button className="btn btn-secondary">Track Order</button>
          
        </div>
      </main>
    </section>
  );
};

export default OrderDetails;