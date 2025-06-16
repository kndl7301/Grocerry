import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaUserPlus, FaShoppingBasket, FaTrash, FaPlus } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import { MdBorderColor } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products?category=${categoryName}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
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
        console.log("Parsed user:", parsedUser); // Check structure
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    fetchCategories();
    fetchProducts();
    fetchUser();
  }, [categoryName]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleAddToBasket = (product) => {
    const existingItem = basketItems.find((item) => item._id === product._id);
    if (existingItem) {
      const updatedItems = basketItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setBasketItems(updatedItems);
    } else {
      setBasketItems([...basketItems, { ...product, quantity: 1 }]);
    }

    if (showAlert) {
      setShowAlert(false); // Close any previous alert
    }
  };

  const handleRemoveFromBasket = (productId) => {
    const updatedItems = basketItems.filter((item) => item._id !== productId);
    setBasketItems(updatedItems);
  };

  const handleDecreaseQuantity = (product) => {
    const updatedItems = basketItems.map((item) =>
      item._id === product._id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    setBasketItems(updatedItems);
  };

  const total = basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCompletePayment = async () => {
    if (basketItems.length > 0 && user) {
      try {
        const order = {
          orderId: Date.now().toString(),
          userName: user.username || user.name || "Anonymous",
          phone: user.phone || "0000000000",
          email: user.email,
          orderDate: new Date().toISOString(),
          orderAmount: total,
          address: user.address || "No address provided",
          status: "pending"
        };
  
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });
  
        const data = await response.json();
        if (data.success) {
          // 🔽 Stok güncelle
          for (const item of basketItems) {
            await axios.put(`http://localhost:5000/api/products/${item._id}/stock`, {
              stock: item.stock - item.quantity
            });
          }
  
          setShowAlert(true);
          setTimeout(() => setBasketItems([]), 2500);
        } else {
          console.error('Failed to create order:', data.message);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }
  };
  
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#ebe6a0' }}>
        <div className="container">
          <Link to="/home" className="navbar-brand fw-bold fs-3">
            <span style={{ fontSize: '2rem', color: '#4CAF50' }}>G</span>roceryy
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li className="nav-item">
                <Link to="/about" className="nav-link fw-bold">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link fw-bold">Contact</Link>
              </li>
            </ul>
            <div className="d-flex gap-3 align-items-center">
             
             
            <Link to="/myorders" className="text-decoration-none">
                    <button  className="btn btn-success d-flex align-items-center gap-2 fw-bold"><MdBorderColor /> My Orders </button>
                  </Link>
                  <Link to="/login" className="text-decoration-none">
                    <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center gap-2 fw-bold"><MdLogout /> Logout </button>
                  </Link>
              
            </div>
          </div>
        </div>
      </nav>

      <br /><br /><br />

      <div className="container container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
            <h4 className="fw-bold mb-3">Categories</h4>
            <ul className="list-group">
              {categories.map((cat, idx) => (
                <Link
                  to={`/category/${cat.category_name}`}
                  key={idx}
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <img
                    src={cat.image}
                    alt={cat.category_name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      marginRight: '10px',
                      borderRadius: '50%',
                    }}
                  />
                  {cat.category_name}
                </Link>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h4 className="fw-bold mb-3">{categoryName}</h4>
            <div className="row">
            {products.length > 0 ? (
  products.map((product, index) => (
    <div key={index} className="col-6 col-md-3">
      <div
        className="card shadow-sm d-flex flex-column align-items-center"
        style={{ borderRadius: '20px', width: '150px', height: '180px' }}
      >
        <div style={{ width: '95%', height: '110px', position: 'relative' }}>
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            style={{
              height: '100%',
              width: '90%',
              margin: '5px',
              objectFit: 'cover',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              opacity: product.stock === 0 ? 0.5 : 1, // Gray out if out of stock
            }}
          />

          {product.stock > 0 ? (
            <button
              onClick={() => handleAddToBasket(product)}
              className="btn"
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'white',
                borderRadius: '20%',
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
              }}
            >
              <FaPlus size={20} color="black" />
            </button>
          ) : (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'red',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 5px',
                borderRadius: '10px',
              }}
            >
              Out of Stock
            </span>
          )}
        </div>

        <div className="card-body text-center p-2">
          <h7 className="card-title" style={{ fontSize: '13px' }}>
            {product.name}
          </h7>
          <p
            className="card-text"
            style={{
              fontWeight: 'bold',
              color: product.stock > 0 ? 'green' : 'red',
              fontSize: '14px',
            }}
          >
            {product.stock > 0 ? `₺${product.price}` : 'Out of Stock'}
          </p>
        </div>
      </div>
      <br />
    </div>
  ))
) : (
  <p>No products found</p>
)}

            </div>
          </div>

          <div className="col-md-3 flex-column align-items-center">
            <h5 style={{ fontWeight: 'bold', marginTop: '15px' }}>Basket</h5>
            <div
              className="card shadow-sm d-flex flex-column align-items-center justify-content-start p-2"
              style={{
                width: '300px',
                height: '400px',
                borderRadius: '20px',
                border: '2px solid yellow',
                backgroundColor: '#f8f9fa',
                overflowY: 'auto',
              }}
            >
              {basketItems.length === 0 ? (
                <>
                  <br /><br /><br /><br />
                  <FaShoppingBasket size={60} color="gray" />
                  <p style={{ marginTop: '20px', fontWeight: 'bold', color: 'gray' }}>
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
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                      <div style={{ fontSize: '13px', flex: 1, marginLeft: '10px' }}>
                        {item.name} <br />
                        ₺{item.price} x {item.quantity}
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
                    <div className="alert alert-success alert-dismissible fade show mt-3 w-100" role="alert">
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
    </div>
  );
}
