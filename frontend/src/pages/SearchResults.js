import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { MdBorderColor, MdLogout } from 'react-icons/md';
import "bootstrap/dist/css/bootstrap.min.css";


const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";
export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("query");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined" || storedUser.trim() === "") {
          setUser(null);
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    fetchUser();
    fetchResults();
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
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

      {/* Search Results */}
      <div className="container mt-5 pt-5">
        <h2 className="mb-4">Search results for: <strong>{query}</strong></h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="row g-4">
            {results.map((product, index) => (
              <div key={index} className="col-md-3">
                <div className="card h-100 shadow-sm">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text fw-bold text-success">₺{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-warning text-center">No products found for <strong>{query}</strong>.</div>
        )}
      </div>
    </div>
  );
}
