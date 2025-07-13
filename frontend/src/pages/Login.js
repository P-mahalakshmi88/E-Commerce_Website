

// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role') || 'user';
  const isAdmin = role === 'admin';

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
        isAdmin,
      });

      if (isAdmin) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('userToken', res.data.token);
        navigate('/home');
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Login failed');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <p>
        Don't have an account? <a href={`/register?role=${role}`}>Register here</a>
      </p>
    </div>
  );
};

export default Login;
