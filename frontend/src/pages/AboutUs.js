import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdBorderColor, MdLogout } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AboutUs() {
  const [user, setUser] = useState(null);

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

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar fixed-top" style={{ backgroundColor: "#ebe6a0" }}>
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
                <Link to="/login" style={{ textDecoration: "none" }}>
                  {" "}
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  >
                    <MdLogout /> Logout
                  </button>
                </Link>
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

      {/* About Content */}
      <div className="container mt-5 pt-5 pb-5">
        <h2 className="text-center fw-bold mb-4">About Groceryy</h2>
        <p className="text-center lead">
          Welcome to <strong>Groceryy</strong> – your trusted partner for
          everyday essentials. We make online grocery shopping easy, fast, and
          affordable. At <strong>Groceryy</strong>, we believe that grocery
          shopping should be simple, fast, and enjoyable. We started our journey
          with a single goal in mind — to make daily essentials accessible from
          the comfort of your home. Whether you're shopping for fresh fruits,
          vegetables, or pantry staples, we've got you covered. Our platform is
          designed to provide a seamless experience for every customer. With a
          user-friendly interface, secure checkout, and reliable delivery,
          Groceryy ensures your groceries arrive at your doorstep fresh and on
          time. We’re constantly improving based on your feedback to meet the
          needs of modern lifestyles. What sets us apart is our commitment to
          quality and customer satisfaction. We partner with trusted local
          suppliers to bring you the best products at competitive prices. From
          everyday items to specialty goods, our catalog grows with your needs
          and tastes. Thank you for choosing Groceryy — your one-stop shop for
          all things grocery. We’re more than just an online store; we’re your
          reliable shopping companion. Explore our features, enjoy exclusive
          deals, and experience the convenience of smart grocery shopping.
        </p>

        <div className="row mt-5">
          <div className="col-md-6 mb-4">
            <h4 className="fw-bold">Our Vision</h4>
            <p>
              To become the leading online grocery platform that delivers
              convenience, quality, and trust to every doorstep.
            </p>
          </div>
          <div className="col-md-6 mb-4">
            <h4 className="fw-bold">Our mission</h4>
            <p>
              To revolutionize grocery shopping through a seamless digital
              experience, ensuring fresh and affordable products reach our
              customers on time.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="fw-bold mb-3">Key Features</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              🛒 Wide range of fresh produce, dairy, and packaged goods
            </li>
            <li className="list-group-item">
              🚚 Fast and reliable doorstep delivery
            </li>
            <li className="list-group-item">
              💳 Secure online payment options
            </li>
            <li className="list-group-item">
              📦 Easy order tracking and return policy
            </li>
            <li className="list-group-item">💬 Friendly customer support</li>
          </ul>
        </div>

        <div className="text-center mt-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046849.png"
            alt="Grocery illustration"
            style={{ width: "120px" }}
          />
        </div>
      </div>
    </div>
  );
}
