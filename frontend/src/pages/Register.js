

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErrorMsg('');
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
        isAdmin: false,
      });
      navigate('/login?role=user');
    } catch (err) {
      if (err.response && err.response.data.message === 'User already exists') {
        alert('User already registered. Redirecting to login page...');
        navigate('/login?role=user');
      } else {
        setErrorMsg(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>User Registration</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <p>
        Already have an account? <a href="/login?role=user">Login here</a>
      </p>
    </div>
  );
};

export default Register;
