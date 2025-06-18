import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_URL || "https://grocerry-rkt8.onrender.com";


const AdminPanel = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setLowStockProducts(data))
      .catch((err) => console.error("Error fetching stock data:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Low Stock Products</h2>
      {lowStockProducts.length === 0 ? (
        <p>No products with low stock.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product, index) => {
              const stock = product.stock;
              const isCritical = stock <= 5;

              return (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td className={isCritical ? "text-danger" : "text-warning"}>
                    {isCritical ? (
                      <>
                        <FaExclamationCircle className="me-1" />
                        Critical Stock
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="me-1" />
                        Low Stock
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
