import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaUserPlus, FaRegListAlt, FaBoxOpen, FaEnvelope, FaUsers } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './AdminPanel.css';

function AddProduct() {
  const [category_name, setCategoryName] = useState('');
  const [image, setImage] = useState('');
  const [name, setProductName] = useState('');
  const [message, setMessage] = useState(null);
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);

  const BASE_URL = "http://localhost:5000";

  // Fetch categories on component mount
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`)
      .then(res => {
        setCategories(res.data);  // Assuming categories are returned as an array
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Handle Add Product Form Submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    if (!name || !category_name || !image || !stock || !price) {
      setMessage({ type: 'danger', text: 'Please fill in all fields.' });
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/products`, {
        name,   // Ensure the field matches what the backend expects (name is correct in this case)
        category_name,
        image,
        stock,
        price,
      });
  
      if (response.status === 201 || response.status === 200) {
        setMessage({ type: 'success', text: 'Product added successfully.' });
        setCategoryName('');
        setImage('');
        setProductName('');
        setStock('');
        setPrice('');
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({ type: 'danger', text: 'Failed to add product.' });
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <h4><li className="nav-item" style={{ marginLeft: '350px' }}><Link to="/products" className="nav-link fw-bold">Products</Link></li></h4>
              <h4><li className="nav-item"><Link to="/categories" className="nav-link fw-bold">Categories</Link></li></h4>
              <h4><li className="nav-item"><Link to="/AdminPanel" className="nav-link fw-bold">Admin Panel</Link></li></h4>
            </ul>
            <div className="d-flex gap-3 align-items-center">
              <Link to="/login" className="nav-link d-flex align-items-center gap-2 fw-bold"><FaUser /> Login</Link>
              <Link to="/register" className="nav-link d-flex align-items-center gap-2 fw-bold"><FaUserPlus /> Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <br /><br /><br />

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

        {/* Product Form */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">Add Product</h2>
            <Row className="justify-content-center">
              <Col md={6}>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleAddProduct}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product name"
                      value={name}
                      onChange={(e) => setProductName(e.target.value)}
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
                    <Form.Label>Category</Form.Label>
                    <Form.Select value={category_name} onChange={(e) => setCategoryName(e.target.value)}>
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter stock quantity"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100">
                    Add Product
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

export default AddProduct;
