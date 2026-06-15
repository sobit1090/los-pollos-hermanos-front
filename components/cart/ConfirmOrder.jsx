import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../redux/store";
import {
  FiCreditCard,
  FiDollarSign,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiClock,
} from "react-icons/fi";

function ConfirmOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Get cart data + serviceType + shipping from Redux
  const {
    cartItems = [],
    subTotal = 0,
    tax = 0,
    shippingCharges = 0,
    total = 0,
    serviceType = "",
    shippingInfo = {},
  } = useSelector((state) => state.cart || {});

  const orderItems = cartItems.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || "",
  }));

  // ─── Razorpay Script Loader ─────────────────────────────
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.getElementById("razorpay-sdk");
      if (existing) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ─── Handle Payment Submit ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayment) return;
    setIsSubmitting(true);

    try {
      // ----- COD / Pay At Counter / Online Payment -----
      if (selectedPayment === "cod" || selectedPayment === "pac" || selectedPayment === "online") {
        const { data } = await axios.post(
          `${server}/createorder`,
          {
            shippingInfo:
              serviceType === "delivery"
                ? shippingInfo
                : {
                    name: "Dine-in / Takeaway",
                    houseNo: "N/A",
                    city: "N/A",
                    state: "N/A",
                    country: "IN",
                    pinCode: "000000",
                    phone: "N/A",
                  },
            orderItems,
            paymentMethod: selectedPayment,
            serviceType: serviceType || "dinein",
            itemsPrice: subTotal,
            taxPrice: tax,
            shippingCharges,
            totalAmount: total,
          },
          { withCredentials: true }
        );

        // Empty cart after order placed
        dispatch({ type: "emptyState" });
        toast.success("Order placed successfully! 🎉");
        navigate("/CashOnDelivery");
        return;
      }

      // ----- Razorpay Online Payment -----
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Step 1 – Create Razorpay order on backend
      const { data: orderData } = await axios.post(
        `${server}/createorderonline`,
        { amount: total },
        { withCredentials: true }
      );

      const razorpayOrderId = orderData.razorpayOrder.id;

      // Step 2 – Get Razorpay Key from backend (via public env)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "", // can be set in .env
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Los Pollos Hermanos",
        description: "Food Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Step 3 – Verify payment on backend
            const orderOptions = {
              shippingInfo:
                serviceType === "delivery"
                  ? shippingInfo
                  : {
                      name: "Dine-in / Takeaway",
                      houseNo: "N/A",
                      city: "N/A",
                      state: "N/A",
                      country: "IN",
                      pinCode: "000000",
                      phone: "N/A",
                    },
              orderItems,
              serviceType: serviceType || "dinein",
              itemsPrice: subTotal,
              taxPrice: tax,
              shippingCharges,
              totalAmount: total,
            };

            const { data: verifyData } = await axios.post(
              `${server}/paymentverification`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderOptions,
              },
              { withCredentials: true }
            );

            dispatch({ type: "emptyState" });
            toast.success("Payment successful! 🎉");
            navigate("/CashOnDelivery");
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: shippingInfo?.name || "",
          contact: shippingInfo?.phone || "",
        },
        theme: { color: "#dc2626" },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled. You can try again.", { icon: "ℹ️" });
            setIsSubmitting(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsSubmitting(false);
      return;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Payment Methods ────────────────────────────────────
  const baseMethods = [
    {
      id: "online",
      name: "Online Payment",
      description: "Pay securely with your card or UPI via Razorpay",
      icon: FiCreditCard,
      benefits: ["Instant confirmation", "Secure encryption", "Multiple options"],
      deliveryTime: "25-40 mins",
    },
  ];

  let paymentMethods = [...baseMethods];

  if (serviceType === "dinein" || serviceType === "takeaway") {
    paymentMethods.unshift({
      id: "pac",
      name: "Pay At Counter",
      description: "Pay directly at the counter",
      icon: FiDollarSign,
      benefits: ["No online payment required", "Instant confirmation at counter"],
      deliveryTime: "Served immediately",
    });
  } else if (serviceType === "delivery") {
    paymentMethods.unshift({
      id: "cod",
      name: "Cash On Delivery",
      description: "Pay when you receive your order",
      icon: FiDollarSign,
      benefits: ["No online payment required", "Pay with cash at delivery", "Secure doorstep service"],
      deliveryTime: "30-45 mins",
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="confirmOrder">
      <Helmet>
        <title>Confirm Order | Los Pollos Hermanos</title>
      </Helmet>
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="order-header">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Confirm Your Order
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Review your order and choose a payment method
          </motion.p>
        </div>

        <div className="content-grid">
          {/* 🧾 Order Summary */}
          <motion.div className="summary-card" variants={itemVariants} initial="hidden" animate="visible">
            <div className="card-header">
              <FiCheck className="icon" />
              <h2>Order Summary</h2>
            </div>

            <div className="order-items">
              {cartItems.map((item, index) => (
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
                <span>₹{subTotal}</span>
              </div>
              <div className="amount-row">
                <span>Tax (18%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="amount-row">
                <span>Delivery</span>
                <span>₹{shippingCharges}</span>
              </div>
              <div className="amount-divider"></div>
              <div className="amount-row total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </motion.div>

          {/* 💳 Payment Methods */}
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
                  className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
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
                      <span>Estimated time: {method.deliveryTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              type="submit"
              className={`submit-btn ${!selectedPayment ? "disabled" : ""}`}
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

            <motion.div className="security-note" variants={itemVariants}>
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
