import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Row, Col, Button, Alert } from "react-bootstrap";
import { MdBorderColor } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle, FaUsers, FaUser, FaUserPlus, FaRegListAlt, FaBoxOpen, FaEnvelope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      console.log("Fetched orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    try {
      console.log("Sending PUT to update order ID:", orderId);
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        status: "delivered",
      });
      if (response.data.success) {
        setAlert({ show: true, message: "Order marked as delivered!", variant: "success" });
        fetchOrders();
      } else {
        setAlert({ show: true, message: "Failed to update order!", variant: "danger" });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setAlert({ show: true, message: "Server error occurred!", variant: "danger" });
    } finally {
      setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "#ebe6a0" }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: "2rem", color: "#4CAF50" }}>G</span>roceryy
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <h4><li className="nav-item" style={{ marginLeft: "350px" }}>
                <Link to="/Products" className="nav-link fw-bold">Products</Link>
              </li></h4>
              <h4><li className="nav-item">
                <Link to="/Categories" className="nav-link fw-bold">Categories</Link>
              </li></h4>
              <h4><li className="nav-item">
                <Link to="/AdminPanel" className="nav-link fw-bold">Admin Panel</Link>
              </li></h4>
            </ul>
            <div className="d-flex gap-3 align-items-center">
              <Link to="/login" className="nav-link d-flex align-items-center gap-2 fw-bold">
                <FaUser /> Login
              </Link>
              <Link to="/register" className="nav-link d-flex align-items-center gap-2 fw-bold">
                <FaUserPlus /> Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <br /><br /><br />

      <div className="admin-layout">
      <div className="sidebar">
          <div className="links">
            <Link to="/addcategory" style={{ textDecoration: "none", color: "black" }}>
              <h3><FaRegListAlt color="#6c757d" /> Add Category</h3>
            </Link>
            <Link to="/addproduct" style={{ textDecoration: "none", color: "black" }}>
              <h3><FaBoxOpen color="#007bff" /> Add Product</h3>
            </Link>
            <Link to="/messages" style={{ textDecoration: "none", color: "black" }}>
              <h3><FaEnvelope color="#dc3545" /> Messages</h3>
            </Link>
            <Link to="/users" style={{ textDecoration: "none", color: "black" }}>
              <h3><FaUsers color="#ffc107" /> Users</h3>
            </Link>
            <Link to="/orders" style={{ textDecoration: "none", color: "black" }}>
              <h3><MdBorderColor color="#28a745" /> Orders</h3>
            </Link>
          </div>
        </div>
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">Orders</h2>

            {/* Bootstrap Alert */}
            {alert.show && (
              <Alert variant={alert.variant} className="text-center fw-bold">
                {alert.message}
              </Alert>
            )}

            <Row className="justify-content-center">
              <Col md={12}>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>OrderID</th>
                      <th>UserName</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Total</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map((order, index) => {
                        const isDelivered = (order.status || "").toLowerCase() === "delivered";
                        return (
                          <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.orderid}</td>
                            <td>{order.username}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{order.address}</td>
                            <td>{order.orderamount} ₺</td>
                            <td>{new Date(order.orderdate).toLocaleString()}</td>
                            <td className="text-center">
                              {isDelivered ? (
                                <FaCheckCircle style={{ color: "green" }} />
                              ) : (
                                <FaTimesCircle style={{ color: "red" }} />
                              )}
                            </td>
                            <td className="text-center">
                              {!isDelivered && (
                                <Button variant="success" size="sm" onClick={() => handleMarkDelivered(order._id)}>
                                  Mark as Delivered
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Orders;
