import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

import {
  FaUsers,
  FaUserPlus,
  FaRegListAlt,
  FaExclamationCircle,
  FaBoxOpen,
  FaEnvelope,
  FaShippingFast,
  FaCheckCircle,
  FaDollarSign,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
  ResponsiveContainer,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis as LineXAxis,
  YAxis as LineYAxis,
  Tooltip as LineTooltip,
  Legend as LineLegend,
} from "recharts";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminPanel.css";
import TopSearches from "./TopSearches";

function AdminPanel() {
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    categories: 0,
    messages: 0,
    users: 0,
    orders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [newUserData, setNewUserData] = useState([]);
  const BASE_URL =
    process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

  const COLORS = [
    "#28a745",
    "#fd7e14",
    "#ffc107",
    "#007bff",
    "#dc3545",
    "#6610f2",
    "#17a2b8",
    "#20c997",
    "#6f42c1",
    "#e83e8c",
    "#ff5733",
    "#00b894",
  ];
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const criticalThreshold = 5;

<<<<<<< HEAD
useEffect(() => {
  fetch(`${BASE_URL}/api/products/lowstock`)
    .then((res) => res.json())
    .then((data) => {
      // Stok miktarına göre artan şekilde sırala
      const sortedData = data.sort((a, b) => a.stock - b.stock);
      setLowStockProducts(sortedData);
    })
    .catch((err) => console.error("Error fetching stock data:", err));
}, []);


  useEffect(() => {
    fetch(`${BASE_URL}/api/products/lowstock`)
      .then((res) => res.json())
      .then((data) => {
        // Stok miktarına göre artan şekilde sırala
        const sortedData = data.sort((a, b) => a.stock - b.stock);
        setLowStockProducts(sortedData);
      })
      .catch((err) => console.error("Error fetching stock data:", err));
  }, []);
  


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productResp, catResp, msgResp, userResp, orderResp] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/products`),
            axios.get(`${BASE_URL}/api/categories`),
            axios.get(`${BASE_URL}/api/messages`),
            axios.get(`${BASE_URL}/api/users`),
            axios.get(`${BASE_URL}/api/orders`),
          ]);

        const products = productResp.data.length || 0;
        const categories = catResp.data.length || 0;
        const messages = msgResp.data.length || 0;
        const users = userResp.data.length || 0;

        const allOrders = orderResp.data || [];
        const orders = allOrders.length;
        const pendingOrders = allOrders.filter(
          (o) => (o.status || "").toLowerCase() !== "delivered"
        ).length;
        const deliveredOrders = orders - pendingOrders;
        const totalRevenue = allOrders.reduce(
          (sum, o) => sum + (Number(o.orderamount) || 0),
          0
        );

        setDashboardData({
          products,
          categories,
          messages,
          users,
          orders,
          pendingOrders,
          deliveredOrders,
          totalRevenue,
        });

        const monthlySales = Array(12).fill(0);
        allOrders.forEach((order) => {
          const orderDate = moment(order.orderdate);
          const month = orderDate.month();
          const amount = Number(order.orderamount) || 0;
          monthlySales[month] += amount;
        });

        const formattedSalesData = monthlySales.map((sales, index) => ({
          month: moment().month(index).format("MMMM"),
          sales: sales,
        }));

        setSalesData(formattedSalesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchNewUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        const users = response.data || [];
        const monthlyNewUsers = Array(12).fill(0);
        users.forEach((user) => {
          const createdDate = moment(user.createdDate);
          const month = createdDate.month();
          monthlyNewUsers[month] += 1;
        });

        const formattedNewUserData = monthlyNewUsers.map((users, index) => ({
          month: moment().month(index).format("MMMM"),
          users: users,
        }));

        setNewUserData(formattedNewUserData);
      } catch (error) {
        console.error("Error fetching new user data:", error);
      }
    };

    fetchDashboardData();
    fetchNewUserData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const orderData = [
    { name: "Delivered", value: dashboardData.deliveredOrders },
    { name: "Pending", value: dashboardData.pendingOrders },
  ];

  return (
    <div className="admin-wrapper">
      {/* Navbar */}
      <nav
  className="navbar fixed-top"
  style={{ backgroundColor: "#ebe6a0" }}
>
  <div className="container d-flex flex-wrap justify-content-between align-items-center">
    <Link to="/home" className="navbar-brand fw-bold fs-3">
      <span style={{ fontSize: "2rem", color: "#4CAF50" }}>G</span>roceryy
    </Link>

    <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
      <li className="nav-item">
        <Link to="/Products" className="nav-link fw-bold">
          Products
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Categories" className="nav-link fw-bold">
          Categories
        </Link>
      </li>
    </ul>

    <div className="d-flex gap-3 align-items-center">
      <Link
        to="/login"
        className="nav-link d-flex align-items-center gap-2 fw-bold"
      >
        <FaUsers color="#17a2b8" /> Login
      </Link>
      <Link
        to="/register"
        className="nav-link d-flex align-items-center gap-2 fw-bold"
      >
        <FaUserPlus color="#28a745" /> Register
      </Link>
    </div>
  </div>
</nav>


      <br />
      <br />
      <br />

      {/* Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="links">
            <Link
              to="/addcategory"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>
                <FaRegListAlt color="#6c757d" /> Add Category
              </h3>
            </Link>
            <Link
              to="/addproduct"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>
                <FaBoxOpen color="#007bff" /> Add Product
              </h3>
            </Link>
            <Link
              to="/messages"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>
                <FaEnvelope color="#dc3545" /> Messages
              </h3>
            </Link>
            <Link
              to="/users"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>
                <FaUsers color="#ffc107" /> Users
              </h3>
            </Link>
            <Link
              to="/orders"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>
                <MdBorderColor color="#17a2b8" /> Orders
              </h3>
            </Link>
          </div>
        </div>

        {/* Dashboard */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <Row>
              {/* Info Cards */}
              {[
                {
                  icon: <FaBoxOpen size={40} color="#007bff" />,
                  label: "Products",
                  value: dashboardData.products,
                  to: "/products",
                },
                {
                  icon: <FaRegListAlt size={40} color="#6c757d" />,
                  label: "Categories",
                  value: dashboardData.categories,
                  to: "/categories",
                },
                {
                  icon: <FaEnvelope size={40} color="#dc3545" />,
                  label: "Messages",
                  value: dashboardData.messages,
                  to: "/messages",
                },
                {
                  icon: <FaUsers size={40} color="#ffc107" />,
                  label: "Users",
                  value: dashboardData.users,
                  to: "/users",
                },
                {
                  icon: <MdBorderColor size={40} color="#770ec0" />,
                  label: "Total Orders",
                  value: dashboardData.orders,
                  to: "/orders",
                },
                {
                  icon: <FaShippingFast size={40} color="#fd7e14" />,
                  label: "Pending Orders",
                  value: dashboardData.pendingOrders,
                  to: "/orders",
                },
                {
                  icon: <FaCheckCircle size={40} color="#28a745" />,
                  label: "Delivered Orders",
                  value: dashboardData.deliveredOrders,
                  to: "/orders",
                },
                {
                  icon: <FaDollarSign size={40} color="#0400cc" />,
                  label: "Total Balance",
                  value: `₺${dashboardData.totalRevenue.toFixed(2)}`,
                },
              ].map((item, idx) => (
                <Col md={3} sm={6} xs={12} key={idx}>
                  <Link
                    to={item.to}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {" "}
                    <Card className="text-center mb-4">
                      <Card.Body>
                        {" "}
                        {item.icon} <h3 className="mt-2">{item.label}</h3>
                        <p>{item.value}</p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}

              {/* Pie Chart */}
              <Col md={6} sm={12}>
                <h2 className="text-  center">Order Status Distribution</h2>
                <PieChart width={440} height={300}>
                  <Pie
                    data={orderData}
                    dataKey="value"
                    nameKey="name"
                    cx="53%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => {
                      const total = orderData.reduce(
                        (sum, entry) => sum + entry.value,
                        0
                      );
                      const percent = ((value / total) * 100).toFixed(1);
                      return `${name}: ${percent}%`;
                    }}
                  >
                    {orderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <PieTooltip />
                  <PieLegend />
                </PieChart>
              </Col>

              {/* Bar Chart */}
              <Col md={6} sm={12}>
                <h2 className="text-center">Monthly Sales Statistics</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#333", fontWeight: "bold", fontSize: 13 }}
                      strokeWidth={2}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fill: "blue", fontWeight: "bold", fontSize: 13 }}
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="sales"
                      barSize={25}
                      fill="#28a745"
                      label={({ x, y, width, value }) => {
                        const total = salesData.reduce(
                          (sum, entry) => sum + entry.sales,
                          0
                        );
                        const percent = ((value / total) * 100).toFixed(1);
                        return (
                          <text
                            x={x + width / 2}
                            y={y - 5}
                            textAnchor="middle"
                            fill="#000"
                            fontSize={12}
                          >
                            {percent}%
                          </text>
                        );
                      }}
                    >
                      {salesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                    <BarTooltip />
                    <BarLegend />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col>
                <div className="container mt-4">
                  <h2>Low Stock Products</h2>
                  {lowStockProducts.length === 0 ? (
                    <p>No products with low stock.</p>
                  ) : (
                    <table className="table table-bordered mt-3">
                      <thead className="thead-dark">
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Stock</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map((product, index) => {
                          const stock = product.stock;
                          const isOutOfStock = stock === 0;
                          const isCritical = stock > 0 && stock <= 5;

                          return (
                            <tr key={product._id}>
                              <td>{index + 1}</td>
                              <td>{product.name}</td>
                              <td>{product.stock}</td>
                              <td
                                className={
                                  isOutOfStock
                                    ? "text-danger fw-bold" // Red and bold (Bootstrap danger)
                                    : isCritical
                                    ? "text-warning " // Custom orange and bold
                                    : "text-success " // Custom green and bold
                                }
                              >
                                {isOutOfStock ? (
                                  <>
                                    <FaExclamationCircle className="me-1" />
                                    Out of Stock! Please restock this product
                                  </>
                                ) : isCritical ? (
                                  <>
                                    <FaExclamationTriangle className="me-1" />
                                    Critical Stock
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle className="me-1" />
                                    Low Stock
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                <br />
              </Col>

              <h2 className="text-center">
                Most Searched Products && Words ın the Grocerry
              </h2>
              <TopSearches />
              {/* Line Chart */}
              {/* Line Chart */}
              <Col md={12}>
                <h2 className="text-center">New Users Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={newUserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <LineXAxis
                      dataKey="month"
                      tick={{ fill: "#333", fontWeight: "bold", fontSize: 13 }}
                      strokeWidth={2}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                    />
                    <LineYAxis
                      tick={{ fill: "blue", fontWeight: "bold", fontSize: 13 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#007bff"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <LineTooltip />
                    <LineLegend />
                  </LineChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <br />
      <br />
      <br />
    </div>
  );
}
export default AdminPanel;
