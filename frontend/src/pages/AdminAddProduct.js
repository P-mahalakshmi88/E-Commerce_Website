
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAddProduct.css";

function AdminAddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("No admin token found. Please login as admin.");
      navigate("/Login");
      return;
    }

    console.log("Submitting:", {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      token,
    });

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("image", product.image);

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product added successfully!");
      navigate("/AdminDashboard");
    } catch (error) {
      console.error("Failed to add product", error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login as admin.");
        navigate("/Login");
      } else if (error.response?.status === 400) {
        alert("Invalid product data. Check inputs.");
      } else {
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {product.image && (
          <img
            src={URL.createObjectURL(product.image)}
            alt="Preview"
            className="preview-image"
          />
        )}

        <button type="submit">Add Product</button>
        <button type="button" onClick={() => navigate("/AdminDashboard")}>
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;
