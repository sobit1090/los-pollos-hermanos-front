import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiUser, 
  FiHome, 
  FiMapPin, 
  FiGlobe, 
  FiNavigation, 
  FiPhone,
  FiCheck,
  FiArrowRight
} from "react-icons/fi";

const Shipping = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    houseNo: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'country') {
      setSelectedCountry(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation here
    navigate("/confirmOrder");
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

  const formFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      icon: FiUser,
      required: true
    },
    {
      name: "houseNo",
      label: "House/Building No.",
      type: "text",
      placeholder: "Enter house/building number",
      icon: FiHome,
      required: true
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      icon: FiMapPin,
      required: true
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: Country.getAllCountries(),
      icon: FiGlobe,
      required: true
    },
    {
      name: "state",
      label: "State",
      type: "select",
      options: selectedCountry ? State.getStatesOfCountry(selectedCountry) : [],
      icon: FiNavigation,
      required: true
    },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN code",
      icon: FiMapPin,
      required: true
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
      icon: FiPhone,
      required: true
    }
  ];

  return (
    <section className="shipping">
      <Helmet>
        <title>Shipping | Los Pollos Hermanos</title>
      </Helmet>
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="shipping-header">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Shipping Details
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Enter your delivery address to get your delicious burgers
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="form-grid">
            {formFields.map((field, index) => (
              <motion.div
                key={field.name}
                className="form-group"
                variants={itemVariants}
              >
                <label htmlFor={field.name}>
                  <field.icon className="label-icon" />
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                
                <div className="input-wrapper">
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      className={formData[field.name] ? "has-value" : ""}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.isoCode} value={option.isoCode}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={formData[field.name] ? "has-value" : ""}
                    />
                  )}
                  {formData[field.name] && (
                    <motion.div
                      className="check-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <FiCheck />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>Confirm Address</span>
            <FiArrowRight className="btn-icon" />
          </motion.button>
        </motion.form>

        <motion.div 
          className="shipping-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>🚚 Free delivery on orders above ₹500</p>
        </motion.div>
      </motion.main>
    </section>
  );
};

export default Shipping;