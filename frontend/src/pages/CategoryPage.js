import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaShoppingBasket, FaTrash, FaPlus } from "react-icons/fa";
import { MdLogout, MdBorderColor } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

// STYLES
const styles = {
  categorySidebar: {
    color: "white",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
  },
  basketCard: {
    marginTop: "15px",
  },
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState(null);
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${baseURL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    };

    const fetchProducts = async () => {
      const res = await fetch(
        `${baseURL}/api/products?category=${categoryName}`
      );
      const data = await res.json();
      setProducts(data);
    };

    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined") return;
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    };

    fetchCategories();
    fetchProducts();
    fetchUser();
  }, [categoryName]);

  const handleAddToBasket = (product) => {
    const existing = basketItems.find((item) => item._id === product._id);
    if (existing) {
      setBasketItems(
        basketItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setBasketItems([...basketItems, { ...product, quantity: 1 }]);
    }
    if (showAlert) setShowAlert(false);
  };

  const handleRemoveFromBasket = (id) =>
    setBasketItems(basketItems.filter((item) => item._id !== id));

  const handleDecreaseQuantity = (product) => {
    setBasketItems(
      basketItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const total = basketItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleCompletePayment = async () => {
    if (basketItems.length && user) {
      try {
        const order = {
          orderId: Date.now().toString(),
          userName: user.username || user.name,
          email: user.email,
          phone: user.phone || "000",
          address: user.address || "No address",
          orderAmount: total,
          status: "pending",
          orderDate: new Date().toISOString(),
        };

        const response = await fetch(`${baseURL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        const result = await response.json();

        if (result.success) {
          for (const item of basketItems) {
            await axios.put(`${baseURL}/api/products/${item._id}/stock`, {
              stock: item.stock - item.quantity,
            });
          }
          setShowAlert(true);
          setTimeout(() => setBasketItems([]), 2500);
        }
      } catch (err) {
        console.error("Payment error:", err);
      }
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar fixed-top" style={{ backgroundColor: "#ebe6a0" }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ color: "#4CAF50" }}>G</span>roceryy
          </Link>
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
          <div className="d-flex gap-2 align-items-center">
            {user ? (
              <>
                <span className="fw-bold d-none d-md-block">
                  Hello, {user?.name || "User"}
                </span>
                <Link to="/myorders" className="btn btn-success btn-sm">
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
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <br />
      <br />

      <div
        style={{ fontFamily: "'Poppins', sans-serif" }}
        className="container mt-5 d-flex justify-content-center"
      >
        <div className="row" style={{ maxWidth: 1200, width: "100%" }}>
          {/* Sidebar */}
          <div className="col-12 col-md-3" style={styles.categorySidebar}>
            <h2 className="fw-bold " style={{ color: "black" }}>
              Categories
            </h2>
            <ul className="list-group">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/category/${cat.category_name}`}
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <img
                    src={cat.image}
                    alt={cat.category_name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      marginRight: 10,
                      borderRadius: "50%",
                    }}
                  />
                  {cat.category_name}
                </Link>
              ))}
            </ul>
          </div>

          {/* Product Grid */}
          <div className="col-12 col-md-6">
            <h4 className="fw-bold mb-3">{categoryName}</h4>
            <div className="row">
              {products.length ? (
                products.map((product, index) => (
                  <div key={index} className="col-6 col-md-6 col-lg-3 mb-3">
                    <div
                      className="card shadow-sm d-flex flex-column align-items-center"
                      style={{ borderRadius: 20, width: 150, height: 180 }}
                    >
                      <div
                        style={{
                          width: "95%",
                          height: 110,
                          position: "relative",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="card-img-top"
                          style={{
                            height: "100%",
                            width: "90%",
                            margin: 5,
                            objectFit: "cover",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            opacity: product.stock === 0 ? 0.5 : 1,
                          }}
                        />
                        {product.stock > 0 ? (
                          <button
                            onClick={() => handleAddToBasket(product)}
                            className="btn d-flex flex-row gap-3 mb-0"
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "white",
                              borderRadius: "20%",
                              width: 30,
                              height: 30,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                            }}
                          >
                            <h2>
                              <FaPlus size={20} color="black" />
                            </h2>
                          </button>
                        ) : (
                          <span
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "red",
                              color: "white",
                              fontSize: 11,
                              fontWeight: "bold",
                              padding: "2px 5px",
                              borderRadius: 10,
                            }}
                          >
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="card-body text-center p-2">
                        <h7 className="card-title" style={{ fontSize: 13 }}>
                          {product.name}
                        </h7>
                        <p
                          className="card-text"
                          style={{
                            fontWeight: "bold",
                            color: product.stock > 0 ? "green" : "red",
                            fontSize: 14,
                          }}
                        >
                          {product.stock > 0
                            ? `₺${product.price}`
                            : "Out of Stock"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          </div>

          {/* Basket */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold mb-2">Basket</h5>
            <div
              className="card shadow-sm d-flex flex-column align-items-center justify-content-start p-2"
              style={{
                width: "400px",
                height: 400,
                borderRadius: 20,
                border: "2px solid yellow",
                backgroundColor: "#f8f9fa",
                overflowY: "auto",
              }}
            >
              {basketItems.length === 0 ? (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                  <FaShoppingBasket size={60} color="gray" />
                  <p
                    style={{ marginTop: 20, fontWeight: "bold", color: "gray" }}
                  >
                    Your basket is empty
                  </p>
                </>
              ) : (
                <>
                  {basketItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center justify-content-between w-100 mb-2 px-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ fontSize: 13, flex: 1, marginLeft: 10 }}>
                        {item.name} <br />₺{item.price} x {item.quantity}
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAddToBasket(item)}
                        >
                          <FaPlus />
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveFromBasket(item._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <p className="fw-bold">Total: ₺{total.toFixed(2)}</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleCompletePayment}
                  >
                    Complete the Payment
                  </button>
                  {showAlert && (
                    <div
                      className="alert alert-success alert-dismissible fade show mt-3 w-100"
                      role="alert"
                    >
                      <strong>✔ OK!</strong> Your order has been recorded.
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowAlert(false)}
                      ></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
