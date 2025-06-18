import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { FaUser, FaUserPlus, FaRegListAlt, FaBoxOpen, FaEnvelope, FaUsers, FaTrashAlt } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './AdminPanel.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage({ type: 'danger', text: 'Failed to load categories.' });
      }
    };

    fetchCategories();
  }, []);

  const toggleStatus = async (categoryId, currentStatus) => {
    try {
      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.put(`${BASE_URL}/api/categories/${categoryId}`, { status: updatedStatus });
      setCategories(categories.map(category => category._id === categoryId ? { ...category, status: updatedStatus } : category));
    } catch (error) {
      console.error("Error updating category status:", error);
      setMessage({ type: 'danger', text: 'Failed to update category status.' });
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${categoryToDelete}`);
      setCategories(categories.filter(category => category._id !== categoryToDelete));
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage({ type: 'danger', text: 'Failed to delete category.' });
    }
  };

  const confirmDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowConfirmDelete(true);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="admin-wrapper">
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#ebe6a0' }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
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
              <h3><MdBorderColor color="#17a2b8" /> Orders</h3>
            </Link>
          </div>
        </div>

        {/* Categories Table */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">Categories List</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Row className="justify-content-center">
              <Col md={8}>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.category_name}</td>
                        <td>
                          <img src={category.image} alt={category.category_name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        </td>
                        <td>
                          <Button variant={category.status === 'active' ? 'success' : 'secondary'} onClick={() => toggleStatus(category._id, category.status)}>
                            {category.status === 'active' ? 'Active' : 'Inactive'}
                          </Button>
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => confirmDelete(category._id)}>
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmDelete} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Categories;
