import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaUserCog,
  FaSearch,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { MdBorderColor, MdLogout } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL =
  process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

export default function ContactUs() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (
          !storedUser ||
          storedUser === "undefined" ||
          storedUser.trim() === ""
        ) {
          setUser(null);
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData((prev) => ({
          ...prev,
          username: parsedUser?.user?.name || parsedUser?.name || "",
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = {
      ...formData,
      message_created_date: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        setSuccessMsg("Your message has been sent successfully!");
        setFormData({ username: user?.name || "", email: "", message: "" });
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
      <nav
  className="navbar fixed-top"
  style={{ backgroundColor: "#ebe6a0" }}
>
  <div className="container d-flex flex-wrap justify-content-between align-items-center">
    <Link to="/home" className="navbar-brand fw-bold fs-3">
      <span style={{ fontSize: "2rem", color: "#4CAF50" }}>G</span>roceryy
    </Link>

    {/* Menü linkleri her zaman görünür */}
    <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
      <li className="nav-item">
        <Link to="/about" className="nav-link fw-bold">
          About Us
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/contact" className="nav-link fw-bold">
          Contact
        </Link>
      </li>
    </ul>

    {/* Sağdaki butonlar */}
    <div className="d-flex gap-2 align-items-center ms-auto">
      {user ? (
        <>
          <span className="fw-bold d-none d-md-block">
            Hello, {user?.user?.name || user?.name || "User"}
          </span>

          <Link
            to="/myorders"
            className="btn btn-success btn-sm d-flex align-items-center gap-1"
          >
            <MdBorderColor /> My Orders
          </Link>

          <Link to="/login" style={{textDecoration:'none'}}>   <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
          >
         <MdLogout /> Logout
          </button></Link> 
        </>
      ) : (
        <Link
          to="/login"
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
        >
          <FaUser /> Login
        </Link>
      )}
    </div>
  </div>
</nav>


      {/* Contact Form */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="mb-4 text-center fw-bold">Contact Us</h2>
            {successMsg && (
              <div className="alert alert-success">{successMsg}</div>
            )}
            <form
              onSubmit={handleSubmit}
              className="border p-4 rounded shadow-sm bg-light"
            >
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary fw-bold">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
