
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminManageProducts.css";

function AdminManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [editedImage, setEditedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProductId(product._id);
    setEditedProduct({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setEditedImage(null);
  };

  const handleCancel = () => {
    setEditProductId(null);
    setEditedProduct({});
    setEditedImage(null);
  };

  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditedImage(e.target.files[0]);
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedProduct.name);
      formData.append("price", editedProduct.price);
      formData.append("description", editedProduct.description);

      if (editedImage) {
        formData.append("image", editedImage);
      }

      const res = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts(products.map((p) => (p._id === id ? res.data : p)));
      setEditProductId(null);
      setEditedProduct({});
      setEditedImage(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="manage-container">
      <h2>Manage Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProduct.name}
                      onChange={handleChange}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editedProduct.price}
                      onChange={handleChange}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editedProduct.description}
                      onChange={handleChange}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td>
                  {editProductId === product._id ? (
                    <>
                      <input type="file" onChange={handleImageChange} />
                      {product.image && (
                        <div>
                          <small>Old Image:</small>
                          <br />
                          <img
                            src={`http://localhost:5000${product.image}`}
                            alt="Product"
                            className="product-image"
                          />
                        </div>
                      )}
                    </>
                  ) : product.image ? (
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt="Product"
                      className="product-image"
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  {editProductId === product._id ? (
                    <div className="button-group">
                      <button className="edit-btn" onClick={() => handleSave(product._id)}>Save</button>
                      <button className="delete-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <div className="button-group">
                      <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="back-btn" onClick={() => navigate("/AdminDashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AdminManageProducts;
