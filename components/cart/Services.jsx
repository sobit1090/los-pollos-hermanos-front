import React from "react";
import { useDispatch } from "react-redux";
import { setServiceType } from "../../redux/reducers/cartReducer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiCoffee, 
  FiShoppingBag, 
  FiTruck,
  FiArrowRight 
} from "react-icons/fi";

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Dine In",
      description: "Experience our cozy ambiance and enjoy freshly prepared meals in our restaurant",
      icon: FiCoffee,
      type: "dinein",
      path: "/confirmOrder",
      color: "#DC2626",
      gradient: "linear-gradient(135deg, #DC2626, #EF4444)",
      features: ["Comfortable Seating", "Fast Service", "Ambient Music"]
    },
    {
      id: 2,
      title: "Take Away",
      description: "Grab your favorite meals on the go with our quick packaging system",
      icon: FiShoppingBag,
      type: "takeaway",
      path: "/confirmOrder",
      color: "#2563EB",
      gradient: "linear-gradient(135deg, #2563EB, #3B82F6)",
      features: ["Quick Packaging", "Easy Ordering", "Hot & Fresh"]
    },
    {
      id: 3,
      title: "Delivery",
      description: "Get your favorite burgers delivered hot and fresh right to your doorstep",
      icon: FiTruck,
      type: "delivery",
      path: "/shipping",
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #10B981)",
      features: ["Fast Delivery", "Live Tracking", "Contactless"]
    }
  ];

  const handleSelect = (type, path) => {
    dispatch(setServiceType(type)); // save type (dinein/takeaway/delivery)
    navigate(path); // go next
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -15,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="services-page">
      {/* Header */}
      <motion.div 
        className="services-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Choose Your Experience</h1>
        <p>Select how you'd like to enjoy our delicious burgers</p>
      </motion.div>

      {/* Services Grid */}
      <motion.div 
        className="services-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="service-card"
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(service.type, service.path)}
          >
            {/* Icon Circle */}
            <motion.div 
              className="service-icon"
              style={{ background: service.gradient }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <service.icon />
            </motion.div>

            {/* Content */}
            <div className="service-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              
              {/* Features List */}
              <div className="service-features">
                {service.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.div 
              className="service-cta"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span>Order Now</span>
              <FiArrowRight />
            </motion.div>

            {/* Hover Effect Overlay */}
            <div className="service-overlay" style={{ background: service.gradient }} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Info */}
      <motion.div 
        className="services-info"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p>All services include our quality guarantee and fresh ingredients promise</p>
      </motion.div>
    </section>
  );
};

export default Services;