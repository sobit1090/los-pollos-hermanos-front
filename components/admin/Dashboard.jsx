import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  Tooltip, 
  ArcElement, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from "chart.js";
import Loader from "../layout/Loader";
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from "react-icons/fi";

ChartJS.register(
  Tooltip, 
  ArcElement, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const loading = false;

const StatBox = ({ title, value, icon, color, trend }) => (
  <div className={`stat-box ${color}`}>
    <div className="stat-icon">
      {icon}
    </div>
    <div className="stat-content">
      <h3>
        {title === "Income" && "₹"}
        {value?.toLocaleString()}
      </h3>
      <p>{title}</p>
      {trend && (
        <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
          <FiTrendingUp /> {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  const orderStatusData = {
    labels: ["Preparing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Orders",
        data: [12, 8, 25, 3],
        backgroundColor: [
          "rgba(255, 159, 64, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(54, 162, 235)",
          "rgb(75, 192, 192)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [65000, 79000, 90000, 82000, 93000, 120000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    cutout: '65%',
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
  };

  const stats = [
    {
      title: "Users",
      value: 1247,
      icon: <FiUsers />,
      color: "primary",
      trend: 12.5
    },
    {
      title: "Orders",
      value: 89,
      icon: <FiShoppingCart />,
      color: "success",
      trend: 8.3
    },
    {
      title: "Income",
      value: 324560,
      icon: <FiDollarSign />,
      color: "warning",
      trend: 15.2
    },
    {
      title: "Growth",
      value: 28,
      icon: <FiTrendingUp />,
      color: "info",
      trend: 5.7
    }
  ];

  return (
    <section className="dashboard">
      {loading ? (
        <Loader />
      ) : (
        <main>
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Statistics Cards */}
          <article className="stats-grid">
            {stats.map((stat, index) => (
              <StatBox
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
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
                <Doughnut data={orderStatusData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Revenue Trend</h3>
                <p>Monthly revenue overview</p>
              </div>
              <div className="chart-container">
                <Line data={revenueData} options={lineChartOptions} />
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
                <Link to="/admin/products" className="action-btn warning">
                  <FiTrendingUp />
                  <span>Products</span>
                  <small>Inventory management</small>
                </Link>
                <Link to="/admin/analytics" className="action-btn info">
                  <FiDollarSign />
                  <span>Analytics</span>
                  <small>Detailed reports</small>
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}
    </section>
  );
};

export default Dashboard;