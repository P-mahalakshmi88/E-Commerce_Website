


// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminManageProducts from "./pages/AdminManageProducts";
import Cart from "./pages/Cart";
import axios from "axios";
import "./App.css";


function App() {
  const [cartItems, setCartItems] = useState([]);

  const userToken = localStorage.getItem("userToken");

  // Load cart from backend on first load
  useEffect(() => {
    if (userToken) {
      axios
        .get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [userToken]);

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);
    if (userToken) {
      axios
        .post(
          "http://localhost:5000/api/cart",
          { cartItems: updatedCart },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .catch((err) => console.error("Error saving cart:", err));
    }
  };

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item._id === product._id);
    const updatedCart = existing
      ? cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { ...product, quantity: 1 }];

    saveCart(updatedCart);
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    saveCart(updatedCart);
  };

  return (
    <Router>
      <AppContent
        cartItems={cartItems}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    </Router>
  );
}

function AppContent({ cartItems, addToCart, updateQuantity, removeFromCart }) {
  const location = useLocation();
  const isUserLoggedIn = localStorage.getItem("userToken");
  const isAdminLoggedIn = localStorage.getItem("adminToken");

  const noNavbarRoutes = ["/", "/select", "/login", "/register", "/admin/login"];
  const hideNavbar = noNavbarRoutes.includes(location.pathname);
  const showNavbar = !hideNavbar && (isUserLoggedIn || isAdminLoggedIn);

  return (
    <>
      {showNavbar && (
        <Navbar
          isUser={!!isUserLoggedIn}
          isAdmin={!!isAdminLoggedIn}
          cartItems={cartItems}
        />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/select" />} />
        <Route path="/select" element={<SelectUserAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login isAdmin={false} />} />
        <Route
          path="/home"
          element={
            isUserLoggedIn ? <Home addToCart={addToCart} /> : <Navigate to="/login" />
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/Admindashboard"
          element={
            isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/AdminAddProduct"
          element={
            isAdminLoggedIn ? <AdminAddProduct /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/AdminManageProducts"
          element={
            isAdminLoggedIn ? (
              <AdminManageProducts />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isUserLoggedIn ? (
              <Cart
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

function SelectUserAdmin() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Select User Type</h2>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/register")}
      >
        User Register
      </button>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/login")}
      >
        User Login
      </button>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/admin/login")}
      >
        Admin Login
      </button>
    </div>
  );
}

export default App;
