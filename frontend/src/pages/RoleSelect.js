

// src/pages/RoleSelect.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelect.css';

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="role-select-container">
      <h2>Select Your Role</h2>
      <button onClick={() => navigate('/login?role=user')}>User Login</button>
      <button onClick={() => navigate('/register?role=user')}>User Register</button>
      <button onClick={() => navigate('/login?role=admin')}>Admin Login</button>
    </div>
  );
};

export default RoleSelect;


