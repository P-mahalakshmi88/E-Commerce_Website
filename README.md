# MERN E-Commerce Platform

A full-stack e-commerce web application built with the **MERN** stack (MongoDB, Express, React, Node.js), supporting both **Customers** and **Admins** for online shopping and product management.

---

## 🚀 Project Overview

This platform provides a smooth experience for users to register, browse products, add to cart, and checkout, while allowing admins to manage product listings securely.

---

## 👥 1. User Section

### 1.1. How can users register?
- Users register via `/register` route.
- React frontend sends a request to `/api/auth/register`.
- Backend validates and stores name, email, and hashed password in MongoDB.

### 1.2. How can users log in and log out?
- **Login**: React frontend sends credentials to `/api/auth/login`. On success, a JWT is returned and stored in `localStorage`.
- **Logout**: Removes the JWT token from `localStorage` and resets user state.

### 1.3. How can users view products?
- Products are fetched from `/api/products` and displayed on the homepage.
- Each product includes an image, name, price, and description.

### 1.4. How can users add products to their cart?
- Clicking "Add to Cart" triggers a POST request to `/api/cart/add`.
- The backend saves product ID and quantity to the user's cart in MongoDB.

### 1.5. How can users manage their cart?
- Cart page (`/cart`) fetches items from `/api/cart`.
- Users can update quantity or remove items via PUT or DELETE requests.

---

## 🛠️ 2. Admin Section

### 2.1. How do admins log in and log out?
- Admins use the same login form.
- Backend checks the `role` field to allow admin access.

### 2.2. What is the admin dashboard?
- A protected route (`/admin/dashboard`) accessible only to authenticated admins.
- Displays analytics and product management tools.

### 2.3. How do admins add products?
- Admin fills a form that sends POST data to `/api/products/add`.
- Images are uploaded via **Multer**, and product data is saved in MongoDB.

### 2.4. How do admins manage products?
- Admins can:
  - **Edit**: Send a PUT request to `/api/products/:id`.
  - **Delete**: Send a DELETE request to `/api/products/:id`.

---

## 🗃️ 3. MongoDB Database Structure

### 3.1. `users` collection
- Stores: `name`, `email`, `hashed password`, and `role` ("user" or "admin").

### 3.2. `products` collection
- Stores: `name`, `price`, `description`, `imageURL`, and `category`.

### 3.3. `cart` collection
- Stores: `userId` and `products: [{ productId, quantity }]`.

---

## 🔄 4. Website Flow

### 4.1. User Registration
- Backend validates input, hashes password using **bcrypt**, and stores in `users`.

### 4.2. User Login
- Verifies email/password, generates a **JWT**, and sends it to the frontend.

### 4.3. Adding to Cart
- Backend updates or creates a `cart` document for the user with selected products.

### 4.4. Admin Adding a Product
- Admin sends data and image, which is validated and stored in `products`.

### 4.5. Admin Deleting a Product
- Backend removes the product from the `products` collection.

---

## 🔐 5. Security Measures

### 5.1. Password Security
- All passwords are hashed using **bcryptjs** before storing in MongoDB.

### 5.2. Authentication
- **JWT tokens** are used for login sessions.
- Tokens are verified in protected routes using `verifyToken` middleware.

### 5.3. Admin Access
- Middleware checks the user's `role` before allowing access to admin routes.

---

## 📘 How to Use This Guide

Use this README to understand:

- How the **frontend** and **backend** communicate via API.
- How **users** and **admins** perform key actions.
- How **MongoDB** collections are structured and connected.
- How **authentication and authorization** are secured.

---

## 📁 Project Structure Overview

