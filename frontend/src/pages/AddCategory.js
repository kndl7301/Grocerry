import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaUserPlus, FaRegListAlt, FaBoxOpen, FaEnvelope, FaUsers } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './AdminPanel.css';

function AddCategory() {
  const [category_name, setName] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('active'); // New status state
  const [message, setMessage] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";


  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!category_name || !image || !status) {
      setMessage({ type: 'danger', text: 'Please fill in all fields.' });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/categories`, {
        category_name,
        image,
        status // Send status to backend
      });

      if (response.status === 201 || response.status === 200) {
        setMessage({ type: 'success', text: 'Category added successfully.' });
        setName('');
        setImage('');
        setStatus('active');
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage({ type: 'danger', text: 'Failed to add category.' });
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#ebe6a0' }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3" >
              <h4>
                <li className="nav-item" style={{ marginLeft: '350px' }}>
                  <Link to="/products" className="nav-link fw-bold">Products</Link>
                </li>
              </h4>
              <h4>
                <li className="nav-item">
                  <Link to="/categories" className="nav-link fw-bold">Categories</Link>
                </li>
              </h4>

              <h4>
                <li className="nav-item">
                  <Link to="/AdminPanel" className="nav-link fw-bold">Admin Panel</Link>
                </li>
              </h4>
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

      {/* Sidebar and Form Layout */}
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

        {/* Add Category Form */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">Add Category</h2>
            <Row className="justify-content-center">
              <Col md={6}>
                {message && (
                  <Alert variant={message.type}>{message.text}</Alert>
                )}
                <Form onSubmit={handleAddCategory}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter category name"
                      value={category_name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100">
                    Add Category
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
