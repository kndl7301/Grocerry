import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { MdBorderColor, MdLogout } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await axios.get(`http://localhost:5000/api/orders/user/${encodedEmail}`);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchOrders();
    }
  }, [email, user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  if (loading) {
    return <p className="text-center mt-5">Loading your orders...</p>;
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#ebe6a0' }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li className="nav-item">
                <Link to="/about" className="nav-link fw-bold">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link fw-bold">Contact</Link>
              </li>
            </ul>
            <div className="d-flex gap-3 align-items-center">
              {user ? (
                <>
                  <h5 className="nav-link fw-bold mb-0">Hello, {user?.user?.name || user?.name || "User"}</h5>
                  <Link to="/myorders" className="text-decoration-none">
                    <button className="btn btn-success d-flex align-items-center gap-2 fw-bold">
                      <MdBorderColor /> My Orders
                    </button>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center gap-2 fw-bold">
                    <MdLogout /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-link d-flex align-items-center gap-2 fw-bold">
                  <FaUser /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container" style={{ marginTop: '100px' }}>
        <h2 className="mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Amount ($)</th>
                <th>Date</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.orderid}</td>
                  <td>{order.orderamount}</td>
                  <td>{new Date(order.orderdate).toLocaleString()}</td>
                  <td>{order.address}</td>
                  <td className="text-center">
  {order.status === "delivered" || order.status === "Delivered" ? (
      <>
      <FaCheckCircle style={{ color: "green" }} title="Delivered" />{" "}
      <span>Delivered</span>
    </>
  ): (
    <>
            <FaTimesCircle style={{ color: "red" }} title="Not Delivered" />{" "}
            <span>Not Delivered</span>
          </>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
