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
import { MdBorderColor } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

const features = [
  {
    img: "/müşteri.png",
    alt: "campaignsForAllOrder",
    title: "A promotion for every order",
    description: "At Groceryy, you can find a promotion for every order.",
  },
  {
    img: "/kurye.png",
    alt: "onYourDoorInMinutes",
    title: "At your door in minutes",
    description: "Your order is at your door in minutes with Groceryy.",
  },
  {
    img: "/hediye.png",
    alt: "happinessOfThousands",
    title: "Thousands kinds of happiness",
    description: "At Groceryy, you can choose from thousands of varieties.",
  },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

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
        console.log("Parsed user:", parsedUser); // Check structure
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    fetchCategories();
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: "#ebe6a0" }}
      >
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: "2rem", color: "#4CAF50" }}>G</span>roceryy
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
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

            <div className="d-flex gap-3 align-items-center">
              {user ? (
                <>
                  <h5 className="nav-link fw-bold mb-0">
                    Hello, {user?.user?.name || user?.name || "User"}
                  </h5>

                  <Link
                    to=""
                    className="nav-link d-flex align-items-center gap-2 fw-bold"
                    title={`Settings (${user.name})`}
                  >
                    {" "}
                  </Link>

                  <Link to="/myorders" className="text-decoration-none">
                    <button className="btn btn-success d-flex align-items-center gap-2 fw-bold">
                      <MdBorderColor /> My Orders{" "}
                    </button>
                  </Link>
                  <Link to="/login" className="text-decoration-none">
                    <button
                      onClick={handleLogout}
                      className="btn btn-danger d-flex align-items-center gap-2 fw-bold"
                    >
                      <MdLogout /> Logout{" "}
                    </button>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="nav-link d-flex align-items-center gap-2 fw-bold"
                >
                  <FaUser /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="d-flex flex-column flex-md-row align-items-center"
        style={{
          backgroundColor: "#d1d4ff",
          height: "70vh",
          marginTop: "60px",
          padding: "0 5%",
          textAlign: "center",
        }}
      >
        <div className="d-flex flex-column mb-4 mb-md-0 me-md-5">
          <img
            src="/groceryy-logo.png"
            alt="Groceryy Logo"
            style={{ width: "250px", height: "250px", borderRadius: "80px" }}
          />
          <br />
          <span style={{ fontWeight: "bold", fontSize: "25px" }}>
            The address of shopping
          </span>
        </div>

        <div
          className="d-flex flex-column align-items-center"
          style={{ marginLeft: "350px" }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
            Freshness at your doorstep
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginTop: "10px",
              marginBottom: "30px",
              color: "#555",
            }}
          >
            What are you looking for today?
          </p>
          <div className="input-group" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for fruits, veggies, drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/search?query=${encodeURIComponent(
                    searchTerm.trim()
                  )}`;
                }
              }}
              style={{ borderRadius: "20px 0 0 20px", padding: "10px 20px" }}
            />
            <span
              className="input-group-text"
              style={{
                borderRadius: "0 20px 20px 0",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                if (searchTerm.trim()) {
                  window.location.href = `/search?query=${encodeURIComponent(
                    searchTerm.trim()
                  )}`;
                }
              }}
            >
              <FaSearch />
            </span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container my-5">
        <h2 className="fw-bold mb-4" style={{ fontSize: "2.2rem" }}>
          Categories
        </h2>
        <div className="row g-4">
          {categories.length > 0 ? (
            categories
              .filter((cat) => cat.category_name && cat.status === "active")
              .map((cat, index) => (
                <div key={index} className="col-md-2">
                  <Link
                    to={`/category/${cat.category_name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card shadow-sm"
                      style={{
                        borderRadius: "20px",
                        height: "150px",
                        width: "172px",
                      }}
                    >
                      <img
                        src={cat.image}
                        className="card-img-top"
                        alt={cat.category_name}
                        style={{
                          height: "100px",
                          width: "170px",
                          objectFit: "cover",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                        }}
                      />
                      <div className="card-body text-center">
                        <h5
                          className="card-title fw-bold"
                          style={{ color: "#333" }}
                        >
                          {cat.category_name}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row justify-content-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="col-12 col-md-4 mb-4 d-flex justify-content-center"
              >
                <div
                  className="text-center p-4"
                  style={{
                    background: "#fff",
                    borderRadius: "25px",
                    maxWidth: "320px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <figure style={{ marginBottom: "20px" }}>
                    <img
                      src={feature.img}
                      alt={feature.alt}
                      style={{
                        width: "160px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  </figure>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-5" style={{ backgroundColor: "#e9ecef" }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Our Location</h2>
          <p className="mb-4">You can find us at the center of Ankara.</p>
          <div style={{ width: "100%", height: "400px" }}>
            <iframe
              title="Cumhurbaşkanlığı Külliyesi Map"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "20px" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.4153476880037!2d32.797282375726946!3d39.93088329073853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f8f6ccdb7df%3A0xa9ee717727a3fee!2sT.C.%20Cumhurba%C5%9Fkanl%C4%B1%C4%9F%C4%B1%20K%C3%BClliyesi!5e0!3m2!1sen!2str!4v1718572163481!5m2!1sen!2str"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="footer mt-5"
        style={{ backgroundColor: "#f2f2f2", padding: "40px 0" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-4">
              <h5 className="mb-3">Download Our App!</h5>
              <a href="#">
                <img
                  src="/apple.png"
                  alt="App Store"
                  style={{ width: "170px", borderRadius: "10px" }}
                />
              </a>
              <br />
              <br />
              <a href="#">
                <img
                  src="/playstore.png"
                  alt="Google Play"
                  style={{ width: "170px", borderRadius: "10px" }}
                />
              </a>
              <br />
              <br />
              <a href="#">
                <img
                  src="/appgallery.png"
                  alt="App Gallery"
                  style={{ width: "170px", borderRadius: "10px" }}
                />
              </a>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="mb-3">About Grocery</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Social Responsibility</a>
                </li>
                <li>
                  <a href="#">Press Releases</a>
                </li>
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="mb-3">Need Help?</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
                <li>
                  <a href="#">Process Guide</a>
                </li>
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="mb-3">Become Our Partner</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Become a Partner</a>
                </li>
                <li>
                  <a href="#">Rent Your Store</a>
                </li>
                <li>
                  <a href="#">Restaurant Partner</a>
                </li>
              </ul>
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <span>© 2025 Groceryy</span>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank">
                <FaFacebook size={30} />
              </a>
              <a href="https://instagram.com" target="_blank">
                <FaInstagram size={30} />
              </a>
              <a href="https://twitter.com" target="_blank">
                <FaTwitter size={30} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
