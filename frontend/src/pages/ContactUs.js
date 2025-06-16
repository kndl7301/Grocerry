import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserCog, FaSearch, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { MdBorderColor, MdLogout } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ContactUs() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined" || storedUser.trim() === "") {
          setUser(null);
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData(prev => ({
          ...prev,
          username: parsedUser?.user?.name || parsedUser?.name || ""
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = {
      ...formData,
      message_created_date: new Date().toISOString()
    };

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (res.ok) {
        setSuccessMsg("Your message has been sent successfully!");
        setFormData({ username: user?.name || '', email: '', message: '' });
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error submitting message:", err);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#ebe6a0' }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                  <Link to="/login" className="text-decoration-none">
                    <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center gap-2 fw-bold">
                      <MdLogout /> Logout
                    </button>
                  </Link>
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

      {/* Contact Form */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="mb-4 text-center fw-bold">Contact Us</h2>
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Message</label>
                <textarea className="form-control" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary fw-bold">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
