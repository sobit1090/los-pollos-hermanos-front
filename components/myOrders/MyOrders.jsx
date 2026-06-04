import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../../redux/actions/order";
import LoadingSpinner from "../layout/LoadingSpinner";
import "../../styles/footer.scss";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders || {});

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner message="Fetching your orders..." />;
  }

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

  return (
    <section className="tableClass">
      <Helmet>
        <title>My Orders | Los Pollos Hermanos</title>
      </Helmet>
      <main>
        <div className="table-header">
          <h1>My Orders</h1>
          <p>Track and manage your order history</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Status</th>
              <th>Item Qty</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.map((order) => {
              const qty = order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
              return (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{qty}</td>
                  <td>₹{order.totalAmount}</td>
                  <td style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <AiOutlineEye /> View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!orders || orders.length === 0) && (
          <div className="empty-state">
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet. Go explore our menu!</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default MyOrders;