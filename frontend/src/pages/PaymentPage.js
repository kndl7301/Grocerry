// === 📦 FRONTEND: PaymentPage.jsx ===

import React, { useState, useEffect } from "react";
import { FaCreditCard, FaCheckCircle, FaLock } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const allowOnlyDigits = (value) => value.replace(/\D/g, "");

  const handleCardNumberChange = (e) => {
    const cleaned = allowOnlyDigits(e.target.value).slice(0, 16);
    setForm({ ...form, cardNumber: cleaned });
  };

  const handleCVVChange = (e) => {
    const cleaned = allowOnlyDigits(e.target.value).slice(0, 3);
    setForm({ ...form, cvv: cleaned });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month < 1 || month > 12) return;
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setForm({ ...form, expiry: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cardNumber, cvv, expiry } = form;
    if (cardNumber.length !== 16) return alert("Card number must be exactly 16 digits.");
    if (cvv.length !== 3) return alert("CVV must be exactly 3 digits.");
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return alert("Expiry date must be in MM/YY format.");

    try {
      const email = localStorage.getItem("userEmail");
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const response = await fetch(`${baseURL}/api/sms/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!data.success) throw new Error("SMS failed");

      setShowConfirmModal(true);
      setTimeout(() => {
        setShowConfirmModal(false);
        navigate("/VerificationPage");
      }, 2000);
    } catch (err) {
      alert("Failed to send verification code.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "linear-gradient(to right, red, blue)" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: 400, borderRadius: 20 }}>
        <div className="text-center">
          <div className="text-end">
            <FaLock size={20} color="gray" style={{ marginLeft: "65%" }} /> SSL secured
          </div>
          <div style={{ backgroundColor: "#4CAF50", width: 80, height: 80, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            <FaCreditCard size={36} color="white" />
          </div>
          <h3 className="mt-3 fw-bold">3D Secure Payment</h3>
          <p className="text-muted" style={{ fontSize: 14 }}>Enter your card details below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cardholder Name</label>
            <input type="text" className="form-control" placeholder="John Doe" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Card Number</label>
            <input type="text" className="form-control" placeholder="1234567812345678" inputMode="numeric" required value={form.cardNumber} onChange={handleCardNumberChange} />
            <small className="text-muted">16-digit card number only</small>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Expiry Date</label>
              <input type="text" className="form-control" placeholder="MM/YY" inputMode="numeric" required value={form.expiry} onChange={handleExpiryChange} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">CVV</label>
              <input type="text" className="form-control" placeholder="123" inputMode="numeric" required value={form.cvv} onChange={handleCVVChange} />
            </div>
          </div>
          <button className="btn btn-success w-100 fw-bold" type="submit">💳 Pay Now</button>
        </form>

        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>After Verification Code Your Order Will Be Created</Modal.Title>
          </Modal.Header>
          <div className="d-flex justify-content-center my-3">
            <div style={{ backgroundColor: "#28a745", borderRadius: "50%", width: 80, height: 80, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 0 15px rgba(40,167,69,0.6)" }}>
              <FaCheckCircle size={50} color="white" />
            </div>
          </div>
          <Modal.Body>You can track your order status from the "My Orders" page.</Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
