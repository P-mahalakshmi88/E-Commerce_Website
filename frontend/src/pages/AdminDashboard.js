// src/pages/AdminDashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Admin Dashboard</h1>
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/AdminAddProduct")}
          style={{ margin: "0 10px" }}
        >
          Add Product
        </button>
        <button
          onClick={() => navigate("/AdminManageProducts")}
          style={{ margin: "0 10px" }}
        >
          Manage Products
        </button>
        <button onClick={handleLogout} style={{ margin: "0 10px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

