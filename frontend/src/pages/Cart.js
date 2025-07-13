

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Cart.css";
// import { useNavigate } from "react-router-dom";

// function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const navigate = useNavigate();
//   const userToken = localStorage.getItem("userToken");

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/cart", {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//         });
//         setCartItems(res.data.cartItems);
//       } catch (err) {
//         console.error("Failed to fetch cart", err);
//       }
//     };

//     fetchCart();
//   }, [userToken]);

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       await axios.put(
//         "http://localhost:5000/api/cart/update",
//         { productId, quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//         }
//       );

//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.productId._id === productId
//             ? { ...item, quantity }
//             : item
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update quantity", err);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       });

//       setCartItems((prev) =>
//         prev.filter((item) => item.productId._id !== productId)
//       );
//     } catch (err) {
//       console.error("Failed to remove from cart", err);
//     }
//   };

//   const totalPrice = cartItems.reduce((sum, item) => {
//     const price = item.productId?.price || 0;
//     return sum + price * item.quantity;
//   }, 0);

//   return (
//     <div className="cart-container">
//       <h2 className="cart-title">Your Cart</h2>

//       {cartItems.length === 0 ? (
//         <p className="cart-empty">Your cart is empty.</p>
//       ) : (
//         <>
//           {cartItems.map((item) => (
//             <div className="cart-item" key={item.productId._id}>
//               <div className="cart-item-left">
//                 <img
//                   src={`http://localhost:5000${item.productId.image}`}
//                   alt={item.productId.name}
//                   className="cart-item-img"
//                 />
//                 <div>
//                   <p className="cart-item-name">{item.productId.name}</p>
//                   <p className="cart-item-price">
//                     ₹{item.productId.price.toFixed(2)} × {item.quantity}
//                   </p>
//                 </div>
//               </div>
//               <div className="cart-item-right">
//                 <input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     updateQuantity(item.productId._id, parseInt(e.target.value))
//                   }
//                   className="cart-qty-input"
//                 />
             
//                 <button
//                   className="cart-btn cart-btn-remove"
//                   onClick={() => removeFromCart(item.productId._id)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}

//           <div className="cart-total">
//             <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
//           </div>
//         </>
//       )}

//       <button className="back-home-btn" onClick={() => navigate("/home")}>
//         Back to Home
//       </button>
//     </div>
//   );
// }

// export default Cart;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        // Filter out invalid items
        const validItems = res.data.cartItems.filter(
          (item) => item && item.productId
        );
        setCartItems(validItems);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    fetchCart();
  }, [userToken]);

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCartItems((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item?.productId?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) =>
            item?.productId ? (
              <div className="cart-item" key={item.productId._id || index}>
                <div className="cart-item-left">
                  <img
                    src={`http://localhost:5000${item.productId.image}`}
                    alt={item.productId.name}
                    className="cart-item-img"
                  />
                  <div>
                    <p className="cart-item-name">{item.productId.name}</p>
                    <p className="cart-item-price">
                      ₹{item.productId.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="cart-item-right">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId._id,
                        parseInt(e.target.value)
                      )
                    }
                    className="cart-qty-input"
                  />
                  <button
                    className="cart-btn cart-btn-remove"
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null
          )}

          <div className="cart-total">
            <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
          </div>
        </>
      )}

      <button className="back-home-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div>
  );
}

export default Cart;
