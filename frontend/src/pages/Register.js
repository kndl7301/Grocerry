import { useState } from 'react';
import axios from '../api/axios';
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCarrot, FaAppleAlt, FaLeaf, FaLemon, FaPepperHot,
  FaLaptop, FaMobileAlt, FaTabletAlt,
  FaWineBottle, FaCookieBite, FaHamburger, FaCartPlus, FaTv,
  FaSoap, FaFish, FaCheese, FaShoppingBasket, FaStore, FaUtensils,
} from 'react-icons/fa';
import '../index.css';

const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

export default function Register() {
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericPhone = form.phone.replace(/\D/g, '');
    if (!/^05\d{9}$/.test(numericPhone)) {
      setMessage({ type: 'danger', text: 'Phone number must be 11 digits and start with 05.' });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/register`, { ...form, phone: numericPhone });
      setShowSuccessModal(true);
      setForm({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Registration failed.' });
    }
  };

  const generateRandomStyles = () => ({
    position: 'absolute',
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 90)}%`,
    fontSize: '2rem',
    color: 'rgba(0, 0, 0, 0.15)',
    animation: 'floatAnim 12s infinite ease-in-out',
  });

  const icons = [
    FaCarrot, FaAppleAlt, FaLeaf, FaLemon, FaPepperHot,
    FaLaptop, FaMobileAlt, FaTabletAlt, FaWineBottle, FaCookieBite,
    FaHamburger, FaCartPlus, FaTv, FaSoap, FaFish, FaCheese, FaShoppingBasket,
    FaStore, FaUtensils
  ];

  return (
    <div className="animated-bg position-relative">
      <div className="container d-flex justify-content-center align-items-center vh-100 position-relative" style={{ zIndex: 2 }}>
        <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px' }}>
          <Link to="/home" className="navbar-brand fw-bold fs-3 mb-3 d-block text-center">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy Register Page
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                maxLength={14}
                placeholder="05xx xxx xx xx"
                value={form.phone}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");
                  if (!input.startsWith("05")) {
                    input = "05" + input.replace(/^0*/, "").replace(/^5*/, "");
                  }
                  if (input.length > 11) input = input.slice(0, 11);
                  const formatted = input
                    .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{2})?$/, (_, a, b, c, d) =>
                      [a, b, c, d].filter(Boolean).join(" ")
                    );
                  setForm({ ...form, phone: formatted });
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                style={{ marginTop: "15px", textDecoration: "none" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>

          {message && (
            <div className={`mt-3 alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
          </p>
        </div>

        {/* Background icons */}
        {icons.map((Icon, i) => (
          <Icon key={i} style={generateRandomStyles()} />
        ))}
      </div>

      {/* ✅ Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div
            style={{
              backgroundColor: "#28a745",
              borderRadius: "50%",
              width: 80,
              height: 80,
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 15px rgba(40,167,69,0.6)",
              marginBottom: "1rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              className="bi bi-check2"
              viewBox="0 0 16 16"
            >
              <path d="M13.854 3.146a.5.5 0 0 1 0 .708L6.707 11l-3.5-3.5a.5.5 0 1 1 .708-.708L6.707 9.793l6.439-6.44a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>
          <h5>Your registration has been successfully completed!</h5>
          <p>You can now log in to your account.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
