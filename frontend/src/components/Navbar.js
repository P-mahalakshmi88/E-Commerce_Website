// import React from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="logo">MyShop</div>
//       <div className="nav-buttons">
//         <Link to="/login">Login</Link>
//         <Link to="/register">Register</Link>
//         <Link to="/cart">Cart</Link>
//         <Link to="/">Logout</Link>
//         <Link to="/admin/add-product">Add Product</Link>

//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Welcome To My Store!</div>
      <div className="nav-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">Cart</Link>
        <button className = "buttons">
        <Link to="/" className="logout">Logout</Link>
      </button>
      </div>
    </nav>
  );
}

export default Navbar;

