import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiCheck, 
  FiArrowRight,
  FiShield,
  FiClock,
  FiTruck
} from "react-icons/fi";

function ConfirmOrder() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderSummary = {
    items: [
      { name: "Cheese Burger", quantity: 2, price: 299 },
      { name: "Veg Supreme", quantity: 1, price: 249 },
      { name: "French Fries", quantity: 1, price: 99 }
    ],
    subtotal: 846,
    tax: 152,
    shipping: 40,
    total: 1038
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash On Delivery",
      description: "Pay when you receive your order",
      icon: FiDollarSign,
      benefits: ["No online payment required", "Pay with cash", "Secure delivery"],
      deliveryTime: "30-45 mins"
    },
    {
      id: "online",
      name: "Online Payment",
      description: "Pay securely with your card or UPI",
      icon: FiCreditCard,
      benefits: ["Instant confirmation", "Secure encryption", "Multiple options"],
      deliveryTime: "25-40 mins"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (selectedPayment === "cod") {
      navigate("/CashOnDelivery");
    } else {
      navigate("/payment");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="confirmOrder">
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="order-header">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Confirm Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Review your order and choose payment method
          </motion.p>
        </div>

        <div className="content-grid">
          {/* Order Summary */}
          <motion.div 
            className="summary-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="card-header">
              <FiCheck className="icon" />
              <h2>Order Summary</h2>
            </div>
            
            <div className="order-items">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="amount-breakdown">
              <div className="amount-row">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal}</span>
              </div>
              <div className="amount-row">
                <span>Tax (18%)</span>
                <span>₹{orderSummary.tax}</span>
              </div>
              <div className="amount-row">
                <span>Delivery</span>
                <span>₹{orderSummary.shipping}</span>
              </div>
              <div className="amount-divider"></div>
              <div className="amount-row total">
                <span>Total Amount</span>
                <span>₹{orderSummary.total}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.form 
            onSubmit={handleSubmit}
            className="payment-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3 variants={itemVariants}>Select Payment Method</motion.h3>
            
            <div className="payment-options">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  className={`payment-option ${selectedPayment === method.id ? 'selected' : ''}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="option-header">
                    <div className="option-icon">
                      <method.icon />
                    </div>
                    <div className="option-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                    <div className="radio-wrapper">
                      <div className="custom-radio">
                        {selectedPayment === method.id && (
                          <motion.div 
                            className="radio-dot"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="option-details">
                    <div className="benefits">
                      {method.benefits.map((benefit, index) => (
                        <span key={index} className="benefit-tag">
                          <FiShield />
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <div className="delivery-time">
                      <FiClock />
                      <span>Estimated delivery: {method.deliveryTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              type="submit"
              className={`submit-btn ${!selectedPayment ? 'disabled' : ''}`}
              disabled={!selectedPayment || isSubmitting}
              whileHover={selectedPayment ? { scale: 1.02 } : {}}
              whileTap={selectedPayment ? { scale: 0.98 } : {}}
              variants={itemVariants}
            >
              {isSubmitting ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Place Order</span>
                  <FiArrowRight className="btn-icon" />
                </>
              )}
            </motion.button>

            <motion.div 
              className="security-note"
              variants={itemVariants}
            >
              <FiShield />
              <span>Your payment information is secure and encrypted</span>
            </motion.div>
          </motion.form>
        </div>
      </motion.main>
    </section>
  );
}

export default ConfirmOrder;