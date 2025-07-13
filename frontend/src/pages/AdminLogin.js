

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  
const handleAdminLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/admin/login", {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem("adminToken", token);
    console.log("Token sent:", token); // ✅ now it's set and logged

    navigate("/AdminDashboard");
  } catch (err) {
    console.error("Login failed:", err);
    setErrorMsg("Invalid credentials");
  }
};


  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAdminLogin}>Login</button>
      {errorMsg && <p className="error">{errorMsg}</p>}
    </div>
  );
};

export default AdminLogin;
