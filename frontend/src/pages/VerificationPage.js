import React, { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function VerificationPage({ onVerify, onResend }) {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (!/^\d*$/.test(element.value)) return;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setError("");

    // Call your real verification logic here:
    if (onVerify) onVerify(enteredCode);

    // Show success modal
    setShowSuccessModal(true);
  };

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh", background: "linear-gradient(100deg, red, green)" }}
      >
        <div className="card p-4 shadow" style={{ maxWidth: 420, width: "90%", borderRadius: "15px" }}>
          <h4 className="text-center mb-3 fw-bold">Enter Verification Code</h4>
          <p className="text-center text-muted mb-4">
            Please enter the 6-digit code sent to your phone number.
          </p>

          <form onSubmit={handleSubmit} className="d-flex justify-content-center gap-2 mb-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                className="form-control text-center fs-3 fw-bold"
                style={{ width: "3rem", height: "3.5rem", borderRadius: "10px" }}
                value={digit}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                autoFocus={idx === 0}
              />
            ))}
          </form>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mb-2" onClick={handleSubmit}>
            Verify
          </button>
          <button
            type="button"
            className="btn btn-link text-decoration-none text-center"
            onClick={() => onResend && onResend()}
          >
            Resend code
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verification Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div
            style={{
              backgroundColor: "#28a745",
              borderRadius: "50%",
              width: 80,
              height: 80,
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 15px rgba(40,167,69,0.6)",
              marginBottom: "1rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="white"
              className="bi bi-check2"
              viewBox="0 0 16 16"
            >
              <path d="M13.854 3.146a.5.5 0 0 1 0 .708L6.707 11l-3.5-3.5a.5.5 0 1 1 .708-.708L6.707 9.793l6.439-6.44a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>
          Your code has been verified successfully.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/myorders");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
