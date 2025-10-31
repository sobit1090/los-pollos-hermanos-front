import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";

// 🔹 Cart Item Component
const CartItem = ({ value, title, img, price, increment, decrement, removeItem }) => (
  <motion.div
    className="cartItem"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -100 }}
    layout
  >
    <div className="item-info">
      <img src={img} alt={title} className="item-image" />
      <div className="item-details">
        <h4>{title}</h4>
        <p className="item-price">₹{price}</p>
      </div>
    </div>

    <div className="quantity-controls">
      <button onClick={decrement} className="quantity-btn">
        {value === 1 ? <FiTrash2 /> : <FiMinus />}
      </button>
      <input type="number" readOnly value={value} className="quantity-input" />
      <button onClick={increment} className="quantity-btn">
        <FiPlus />
      </button>
    </div>

    <div className="item-total">
      <span>₹{price * value}</span>
    </div>

    <button onClick={removeItem} className="remove-btn" title="Remove item">
      <FiTrash2 />
    </button>
  </motion.div>
);

// 🔹 Main FoodCart Component
const FoodCart = () => {
  const dispatch = useDispatch();

  // ✅ Safe Redux selector (with optional chaining)
  const { cartItems = {}, subtotal = 0, tax = 0, shippingCharges = 0, total = 0 } =
    useSelector((state) => state.cart || {});

  // ✅ Create items array safely using optional chaining
  const items = [
    {
      id: 1,
      title: "Cheese Burger",
      img: "/assets/burger1.png",
      price: 299,
      quantity: cartItems?.cheeseBurger?.quantity || 0,
    },
    {
      id: 2,
      title: "Veg Cheese Burger",
      img: "/assets/burger2.png",
      price: 249,
      quantity: cartItems?.vegCheeseBurger?.quantity || 0,
    },
    {
      id: 3,
      title: "Cheese Burger with French Fries",
      img: "/assets/burger3.png",
      price: 499,
      quantity: cartItems?.burgerWithFries?.quantity || 0,
    },
  ].filter((i) => i.quantity > 0);

  // 🔹 Dispatch Handlers
  const increment = (name) => {
    dispatch({ type: `${name}Increment` });
    dispatch({ type: "calculatePrice" });
  };

  const decrement = (name) => {
    dispatch({ type: `${name}Decrement` });
    dispatch({ type: "calculatePrice" });
  };

  const clearCart = () => {
    dispatch({ type: "emptyState" });
    dispatch({ type: "calculatePrice" });
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Render
  return (
    <section className="cart">
      <main>
        <div className="cart-header">
          <h1>Your Food Cart</h1>
          <p>Review your items and proceed to checkout</p>
          {items.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <Link to="/#menu" className="btn-primary">
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-items">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    title={item.title}
                    img={item.img}
                    price={item.price}
                    value={item.quantity}
                    increment={() =>
                      increment(
                        item.title.includes("Fries")
                          ? "burgerWithFries"
                          : item.title.includes("Veg")
                          ? "vegCheeseBurger"
                          : "cheeseBurger"
                      )
                    }
                    decrement={() =>
                      decrement(
                        item.title.includes("Fries")
                          ? "burgerWithFries"
                          : item.title.includes("Veg")
                          ? "vegCheeseBurger"
                          : "cheeseBurger"
                      )
                    }
                    removeItem={() =>
                      dispatch({
                        type: "removeItem",
                        payload: item.title,
                      })
                    }
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.article
              className="cart-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-row">
                <span>Shipping Charges</span>
                <span>{shippingCharges > 0 ? `₹${shippingCharges}` : "Free"}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>

              <div className="cart-actions">
                <Link to="/NewMenu" className="btn-secondary">
                  Continue Shopping
                </Link>
                <Link to="/service" className="btn-primary">
                  Proceed to Checkout
                </Link>
              </div>
            </motion.article>
          </>
        )}
      </main>
    </section>
  );
};

export default FoodCart;
