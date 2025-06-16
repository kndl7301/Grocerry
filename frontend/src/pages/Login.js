import { useState } from 'react';
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import {
  FaCarrot, FaAppleAlt, FaLeaf, FaLemon, FaPepperHot,
  FaLaptop, FaMobileAlt, FaTabletAlt,
  FaWineBottle, FaCookieBite, FaHamburger, FaCartPlus, FaTv, FaSoap, FaFish, FaCheese, FaShoppingBasket, FaStore, FaUtensils,
} from 'react-icons/fa';
import '../index.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if admin credentials are correct
    if (form.email === 'admin@gmail.com' && form.password === '343') {
      const adminUser = { email: 'admin@gmail.com', name: 'Admin' }; // Mock user for admin login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', 'true');
      
      localStorage.setItem('user', JSON.stringify(adminUser)); // Store the mock admin user
      navigate('/home');
    } else {
      try {
        const res = await axios.post('http://localhost:5000/api/login', form); // Adjust the URL to match your backend
        if (res.data.success) {
          setMessage(res.data.message); // Show success message
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(res.data.user));
     
          navigate('/home'); // Navigate to home page on successful login
        } else {
          setMessage(res.data.message || 'Invalid credentials'); // Show error message
        }
      } catch (err) {
        setMessage(err.response?.data?.message || 'Login failed');
      }
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
      {/* Login Form */}
      <div className="container d-flex justify-content-center align-items-center vh-100 position-relative" style={{ zIndex: 2 }}>
        <div className="card p-4 shadow" style={{ minWidth: '350px', maxWidth: '400px' }}>
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50', marginLeft: '80px' }}>G</span>roceryy
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                style={{ marginTop: '15px', textDecoration: 'none' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>

          {message && <div className="mt-3 alert alert-info">{message}</div>}

          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register" className="text-decoration-none">Register</Link>
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
