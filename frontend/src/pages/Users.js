import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Row, Col } from "react-bootstrap";
import { MdBorderColor } from "react-icons/md";
import {
  FaUsers,
  FaUser,
  FaUserPlus,
  FaRegListAlt,
  FaBoxOpen,
  FaEnvelope,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";


const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

function Users() {
  const [users, setUsers] = useState([]); // ✅ correctly named state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        console.log("Fetched messages:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error); // ✅ corrected label
      }
    };

    fetchUsers();
  }, []);

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
              <h4>
                <li className="nav-item" style={{ marginLeft: "350px" }}>
                  <Link to="/Products" className="nav-link fw-bold">Products</Link>
                </li>
              </h4>
              <h4>
                <li className="nav-item">
                  <Link to="/Categories" className="nav-link fw-bold">Categories</Link>
                </li>
              </h4>
              <h4><li className="nav-item"><Link to="/AdminPanel" className="nav-link fw-bold">Admin Panel</Link></li></h4>
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

      {/* Sidebar and Dashboard Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
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

        {/* Dashboard */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">All Register Users </h2>
            <Row className="justify-content-center">
              <Col md={10}>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>UserName</th>
                      <th>Email</th>
                      <th>Phone</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                  
                      </tr>
                    ))}
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

export default Users;
