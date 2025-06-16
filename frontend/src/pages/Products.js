// Üst kısımlar aynı kalır
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Alert, Form, Modal } from 'react-bootstrap'; // ✅ Modal eklendi
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdBorderColor } from "react-icons/md";
import { FaUser, FaUserPlus, FaRegListAlt, FaBoxOpen, FaEnvelope, FaUsers, FaTrashAlt } from "react-icons/fa";
import './AdminPanel.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // ✅
  const [productToDelete, setProductToDelete] = useState(null); // ✅
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${productToDelete}`);
      setProducts(products.filter(p => p._id !== productToDelete));
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ type: 'danger', text: 'Failed to delete product.' });
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowConfirmDelete(true);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

        {/* Products Table */}
        <div className="dashboard">
          <Container>
            <h2 className="text-center mb-4">All Products</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <Form className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search product by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>

            <Row className="justify-content-center">
              <Col md={10}>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.price} ₺</td>
                        <td>{product.stock}</td>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => confirmDelete(product._id)}>
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
          Are you sure you want to delete this product?
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

export default Products;
