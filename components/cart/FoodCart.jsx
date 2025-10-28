import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import burger1 from "../../assets/burger1.png";
import burger2 from "../../assets/burger2.png";
import burger3 from "../../assets/burger3.png";

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
      <input 
        type="number" 
        readOnly 
        value={value} 
        className="quantity-input"
      />
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

const FoodCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Cheese Burger",
      img: burger1,
      price: 299,
      quantity: 2
    },
    {
      id: 2,
      title: "Veg Cheese Burger",
      img: burger2,
      price: 249,
      quantity: 1
    },
    {
      id: 3,
      title: "Cheese Burger with French Fries",
      img: burger3,
      price: 499,
      quantity: 1
    }
  ]);

  const increment = (itemId) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (itemId) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 200 : 0;
  const total = subtotal + tax + shipping;

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <section className="cart">
      <main>
        <div className="cart-header">
          <h1>Your Food Cart</h1>
          <p>Review your items and proceed to checkout</p>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
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
            <div className="cart-items">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    title={item.title}
                    img={item.img}
                    price={item.price}
                    value={item.quantity}
                    increment={() => increment(item.id)}
                    decrement={() => decrement(item.id)}
                    removeItem={() => removeItem(item.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            <motion.article 
              className="cart-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping Charges</span>
                <span>{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
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