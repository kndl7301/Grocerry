import { useState } from 'react';
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import {
  FaCarrot, FaAppleAlt, FaLeaf, FaLemon, FaPepperHot,
  FaLaptop, FaMobileAlt, FaTabletAlt,
  FaWineBottle, FaCookieBite, FaHamburger, FaCartPlus, FaTv,
  FaSoap, FaFish, FaCheese, FaShoppingBasket, FaStore, FaUtensils,
} from 'react-icons/fa';
import '../index.css';

const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

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

    const numericPhone = form.phone.replace(/\D/g, ''); // Remove spaces etc.
    if (!/^05\d{9}$/.test(numericPhone)) {
      setMessage({ type: 'danger', text: 'Phone number must be 11 digits and start with 05.' });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/register`, { ...form, phone: numericPhone });
      setMessage({ type: 'success', text: res.data.message || 'You have successfully registered! You can now login to Groceryy.' });
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
      let input = e.target.value.replace(/\D/g, ""); // Sadece rakam
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

        {/* Animated Icons */}
        {icons.map((Icon, i) => (
          <Icon key={i} style={generateRandomStyles()} />
        ))}
      </div>
    </div>
  );
}
