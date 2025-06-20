import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaSearch,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { MdBorderColor, MdLogout } from "react-icons/md";
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

const BASE_URL =
  process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
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
        setUser(JSON.parse(storedUser));
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
    navigate("/login");
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

          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
          >
            <MdLogout /> Logout
          </button>
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


      {/* Hero Section */}
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center text-center"
        style={{
          backgroundColor: "#d1d4ff",
          minHeight: window.innerWidth < 768 ? "auto" : "30vh",
          marginTop: "60px",
          padding: "2rem 1rem 3rem",
        }}
      >
        <div className="mb-4 mb-md-0 me-md-5">
          <img
            src="/groceryy-logo.png"
            alt="Groceryy Logo"
            style={{
              width: window.innerWidth < 768 ? "150px" : "200px",
              height: window.innerWidth < 768 ? "150px" : "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <br />
          <span
            style={{
              fontWeight: "bold",
              fontSize: window.innerWidth < 768 ? "18px" : "20px",
            }}
          >
            The address of shopping
          </span>
        </div>
        <div className="d-flex flex-column align-items-center px-3 px-md-5">
          <h1
            className="fw-bold text-dark mb-2"
            style={{ fontSize: window.innerWidth < 768 ? "1.8rem" : "2.5rem" }}
          >
            Freshness at your doorstep
          </h1>
          <p
            className="text-muted mb-3"
            style={{ fontSize: window.innerWidth < 768 ? "1rem" : "1.2rem" }}
          >
            What are you looking for today?
          </p>
          <div className="input-group w-100" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for fruits, veggies, drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(
                    `/search?query=${encodeURIComponent(searchTerm.trim())}`
                  );
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
                  navigate(
                    `/search?query=${encodeURIComponent(searchTerm.trim())}`
                  );
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
        <h2 className="fw-bold mb-4 text-center text-md-start">Categories</h2>
        <div className="row g-4 justify-content-center">
          {categories.length > 0 ? (
            categories
              .filter((cat) => cat.category_name && cat.status === "active")
              .map((cat, index) => (
                <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <Link
                    to={`/category/${cat.category_name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card shadow-sm"
                      style={{ borderRadius: "20px" }}
                    >
                      <img
                        src={cat.image}
                        className="card-img-top"
                        alt={cat.category_name}
                        style={{
                          height: "100px",
                          objectFit: "cover",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                        }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title fw-bold">
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
                  <img
                    src={feature.img}
                    alt={feature.alt}
                    style={{
                      width: "160px",
                      height: "150px",
                      borderRadius: "50%",
                      marginBottom: "20px",
                    }}
                  />
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
          <div className="row text-center text-md-start">
            <div className="col-md-3 mb-4">
              <h5 className="mb-3">Download Our App!</h5>
              {["/apple.png", "/playstore.png", "/appgallery.png"].map(
                (img, i) => (
                  <div key={i} className="mb-2">
                    <a href="#">
                      <img
                        src={img}
                        alt="App Link"
                        style={{ width: "170px", borderRadius: "10px" }}
                      />
                    </a>
                  </div>
                )
              )}
            </div>

            {[
              {
                title: "About Grocery",
                links: [
                  "About Us",
                  "Careers",
                  "Contact Us",
                  "Social Responsibility",
                  "Press Releases",
                ],
              },
              {
                title: "Need Help?",
                links: [
                  "FAQ",
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Cookie Policy",
                  "Process Guide",
                ],
              },
              {
                title: "Become Our Partner",
                links: [
                  "Become a Partner",
                  "Rent Your Store",
                  "Restaurant Partner",
                ],
              },
            ].map((col, index) => (
              <div key={index} className="col-md-3 mb-4">
                <h5 className="mb-3">{col.title}</h5>
                <ul className="list-unstyled">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <span>© 2025 Groceryy</span>
            <div className="d-flex gap-3 mt-3 mt-md-0">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook size={30} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram size={30} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter size={30} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
