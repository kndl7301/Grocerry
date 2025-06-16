import { useState } from 'react';
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {
  FaCarrot, FaAppleAlt, FaLeaf, FaLemon, FaPepperHot,
  FaLaptop, FaMobileAlt, FaTabletAlt,
  FaWineBottle, FaCookieBite, FaHamburger, FaCartPlus, FaTv, FaSoap, FaFish, FaCheese, FaShoppingBasket, FaStore, FaUtensils,
} from 'react-icons/fa';
import '../index.css';

export default function Register() {
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
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      setMessage({ type: 'success', text: res.data.message || 'You have successfully registered! You can now login to Groceryy.' });
      setForm({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Registration failed.' });
    }
  };

  // Random position generator for the icons
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
      {/* Registration Form */}
      <div className="container d-flex justify-content-center align-items-center vh-100 position-relative" style={{ zIndex: 2 }}>
        <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px' }}>
          <Link to="/home" className="navbar-brand fw-bold fs-3">
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
                placeholder="Enter phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
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

          {message && <div className="mt-3 alert alert-info">{message.text}</div>}

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
          </p>
        </div>

        {/* Animated Icons */}
        {icons.map((Icon, i) => (
          <Icon key={i} style={generateRandomStyles()} />
        ))}
      </div>
    </div>
  );
}
