import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { GiArmoredBoomerang } from "react-icons/gi";
import { Helmet } from "react-helmet";
const Orders = () => {
  const orders = [
    {
      id: "SDKF12345",
      status: "Processing",
      qty: 23,
      amount: 21312,
      payment: "COD",
      user: "Abhi",
      date: "2024-01-15"
    },
    {
      id: "SDKF67890", 
      status: "Delivered",
      qty: 12,
      amount: 15000,
      payment: "UPI",
      user: "Rahul",
      date: "2024-01-14"
    },
    {
      id: "SDKF11223",
      status: "Pending",
      qty: 5,
      amount: 5200,
      payment: "COD",
      user: "Shobhit",
      date: "2024-01-16"
    },
    {
      id: "SDKF44556",
      status: "Shipped",
      qty: 8,
      amount: 18999,
      payment: "Card",
      user: "Priya",
      date: "2024-01-13"
    }
  ];

  useEffect(() => {
    document.body.classList.add('orders-page');
    return () => {
      document.body.classList.remove('orders-page');
    };
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-badge processing';
      case 'delivered':
        return 'status-badge delivered';
      case 'shipped':
        return 'status-badge shipped';
      case 'pending':
        return 'status-badge pending';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="tableClass">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <main>
        <div className="table-header">
          <h1>Order Management</h1>
          <p>Manage and track all your orders</p>
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
            {orders.map((order, index) => (
              <tr key={order.id} className="order-row">
                <td data-label="Order ID">
                  <div className="order-id">
                    #{order.id}
                  </div>
                </td>
                <td data-label="Status">
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td data-label="Items">
                  <span className="item-count">
                    {order.qty} {order.qty === 1 ? 'item' : 'items'}
                  </span>
                </td>
                <td data-label="Amount">
                  <span className="amount">
                    {formatAmount(order.amount)}
                  </span>
                </td>
                <td data-label="Payment">
                  <span className="payment-method">
                    {order.payment}
                  </span>
                </td>
                <td data-label="Customer">
                  <div className="customer-info">
                    <span className="customer-name">{order.user}</span>
                  </div>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <Link 
                      to={`/order/${order.id}`} 
                      className="btn-view"
                      title="View Order Details"
                    >
                      <AiOutlineEye />
                      <span>View</span>
                    </Link>
                    <button 
                      className="btn-update"
                      title="Update Order Status"
                      onClick={() => console.log('Update order:', order.id)}
                    >
                      <GiArmoredBoomerang />
                      <span>Update</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="empty-state">
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default Orders;