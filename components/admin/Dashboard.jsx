import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { Helmet } from "react-helmet";
import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats } from "../../redux/actions/admin";
import LoadingSpinner from "../layout/LoadingSpinner";
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiMessageSquare } from "react-icons/fi";

ChartJS.register(Tooltip, ArcElement, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// ─── Stat Box Component ────────────────────────────────────
const StatBox = ({ title, value, icon, color, prefix = "" }) => (
  <div className={`stat-box ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>
        {prefix}{value?.toLocaleString("en-IN") ?? 0}
      </h3>
      <p>{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, usersCount, ordersCount, totalIncome, stats } = useSelector(
    (state) => state.admin || {}
  );

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);

  // ─── Build Doughnut chart from backend ordersByStatus ────
  const buildDoughnutData = () => {
    if (!stats?.ordersByStatus?.length) {
      return {
        labels: ["No Data"],
        datasets: [{ data: [1], backgroundColor: ["#374151"], borderWidth: 0 }],
      };
    }
    const statusColorMap = {
      Processing: "rgba(255, 159, 64, 0.8)",
      Confirmed: "rgba(99, 102, 241, 0.8)",
      Preparing: "rgba(16, 185, 129, 0.8)",
      "Out for Delivery": "rgba(54, 162, 235, 0.8)",
      Delivered: "rgba(75, 192, 192, 0.8)",
      Cancelled: "rgba(255, 99, 132, 0.8)",
    };
    return {
      labels: stats.ordersByStatus.map((s) => s._id),
      datasets: [
        {
          label: "Orders",
          data: stats.ordersByStatus.map((s) => s.count),
          backgroundColor: stats.ordersByStatus.map(
            (s) => statusColorMap[s._id] || "rgba(156,163,175,0.8)"
          ),
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  };

  // ─── Build Line chart from backend monthlyRevenue ────────
  const buildLineData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!stats?.monthlyRevenue?.length) {
      return {
        labels: months.slice(0, 6),
        datasets: [
          {
            label: "Monthly Revenue",
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "rgb(75,192,192)",
            backgroundColor: "rgba(75,192,192,0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }
    return {
      labels: stats.monthlyRevenue.map((m) => months[m._id.month - 1]),
      datasets: [
        {
          label: "Monthly Revenue (₹)",
          data: stats.monthlyRevenue.map((m) => m.revenue),
          borderColor: "rgb(75,192,192)",
          backgroundColor: "rgba(75,192,192,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, padding: 20 } },
    },
    cutout: "65%",
  };

  const lineChartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => "₹" + v.toLocaleString("en-IN") },
      },
    },
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const statCards = [
    {
      title: "Users",
      value: usersCount ?? 0,
      icon: <FiUsers />,
      color: "primary",
    },
    {
      title: "Total Orders",
      value: ordersCount?.total ?? stats?.totalOrders ?? 0,
      icon: <FiShoppingCart />,
      color: "success",
    },
    {
      title: "Total Income",
      value: totalIncome ?? stats?.totalRevenue ?? 0,
      icon: <FiDollarSign />,
      color: "warning",
      prefix: "₹",
    },
    {
      title: "Delivered",
      value: ordersCount?.delivered ?? stats?.deliveredOrders ?? 0,
      icon: <FiTrendingUp />,
      color: "info",
    },
  ];

  return (
    <section className="dashboard">
      <Helmet>
        <title>Dashboard | Admin</title>
      </Helmet>
      <main>
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Statistics Cards */}
        <article className="stats-grid">
          {statCards.map((stat, index) => (
            <StatBox
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              prefix={stat.prefix || ""}
            />
          ))}
        </article>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Order Distribution</h3>
              <p>Breakdown of orders by status</p>
            </div>
            <div className="chart-container">
              <Doughnut data={buildDoughnutData()} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trend</h3>
              <p>Monthly revenue overview (last 6 months)</p>
            </div>
            <div className="chart-container">
              <Line data={buildLineData()} options={lineChartOptions} />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <div className="actions-card">
            <div className="actions-header">
              <h3>Quick Actions</h3>
              <p>Manage your store efficiently</p>
            </div>
            <div className="actions-grid">
              <Link to="/admin/orders" className="action-btn primary">
                <FiShoppingCart />
                <span>View Orders</span>
                <small>Manage all orders</small>
              </Link>
              <Link to="/admin/users" className="action-btn success">
                <FiUsers />
                <span>View Users</span>
                <small>User management</small>
              </Link>
              <Link to="/NewMenu" className="action-btn warning">
                <FiTrendingUp />
                <span>Menu</span>
                <small>Browse menu items</small>
              </Link>
              <Link to="/admin/complaints" className="action-btn info" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderColor: "#7c3aed" }}>
                <FiMessageSquare />
                <span>Complaints</span>
                <small>User feedback & support</small>
              </Link>
              <div className="action-btn info" style={{ cursor: "default" }}>
                <FiDollarSign />
                <span>Income</span>
                <small>₹{(totalIncome ?? 0).toLocaleString("en-IN")}</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Dashboard;