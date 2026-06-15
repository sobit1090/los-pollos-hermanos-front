import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../redux/store";
import { loadUser } from "../../redux/actions/user";
import { 
  FiUser, 
  FiHome, 
  FiMapPin, 
  FiGlobe, 
  FiNavigation, 
  FiPhone,
  FiCheck,
  FiArrowRight,
  FiPlus,
  FiTrash,
  FiArrowLeft
} from "react-icons/fi";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Load user profile information
  const { user } = useSelector((state) => state.auth || {});
  const savedAddresses = user?.addresses || [];

  const [showForm, setShowForm] = useState(savedAddresses.length === 0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    houseNo: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  // Pre-fill user name when loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || ""
      }));
    }
  }, [user]);

  // Sync showForm if saved addresses change
  useEffect(() => {
    if (savedAddresses.length === 0) {
      setShowForm(true);
    }
  }, [savedAddresses.length]);

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

  const handleSelectAddress = (addr) => {
    dispatch({
      type: "addShippingInfo",
      payload: {
        name: user?.name || "Customer",
        houseNo: addr.address1,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        pinCode: addr.pinCode,
        phone: addr.phoneNumber,
      }
    });
    toast.success("Delivery address selected");
    navigate("/confirmOrder");
  };

  const handleDeleteAddress = async (e, indexToDelete) => {
    e.stopPropagation();
    setIsDeleting(indexToDelete);
    const updatedAddresses = savedAddresses.filter((_, idx) => idx !== indexToDelete);
    try {
      await axios.put(
        `${server}/me/addresses`,
        { addresses: updatedAddresses },
        { withCredentials: true }
      );
      await dispatch(loadUser());
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newAddress = {
      addressType: "Home",
      address1: formData.houseNo,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pinCode: formData.pinCode,
      phoneNumber: formData.phone,
      isDefault: savedAddresses.length === 0,
    };

    const updatedAddresses = [...savedAddresses, newAddress];

    try {
      await axios.put(
        `${server}/me/addresses`,
        { addresses: updatedAddresses },
        { withCredentials: true }
      );

      // Save selected address to Redux cart shippingInfo
      dispatch({
        type: "addShippingInfo",
        payload: {
          name: formData.name,
          houseNo: formData.houseNo,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pinCode: formData.pinCode,
          phone: formData.phone,
        }
      });

      // Refresh user info in Redux
      await dispatch(loadUser());

      toast.success("Address saved and selected");
      navigate("/confirmOrder");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
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
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="saved-addresses"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="saved-addresses-view"
            >
              <div className="shipping-header">
                <h1>Select Delivery Address</h1>
                <p>Choose one of your saved addresses or add a new one</p>
              </div>

              <div className="addresses-grid">
                {savedAddresses.map((addr, index) => {
                  const countryObj = Country.getCountryByCode(addr.country);
                  const stateObj = State.getStatesOfCountry(addr.country)?.find(s => s.isoCode === addr.state);
                  const countryName = countryObj ? countryObj.name : addr.country;
                  const stateName = stateObj ? stateObj.name : addr.state;

                  return (
                    <motion.div
                      key={addr._id || index}
                      className="address-card"
                      whileHover={{ y: -5 }}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <button
                        className="delete-btn"
                        disabled={isDeleting === index}
                        onClick={(e) => handleDeleteAddress(e, index)}
                        title="Delete Address"
                      >
                        <FiTrash />
                      </button>
                      
                      <div className="address-details">
                        <div className="card-badge">
                          <FiHome />
                          <span>{addr.addressType || "Delivery Address"}</span>
                        </div>
                        <h3>{user?.name || "Customer"}</h3>
                        <p className="addr-line">{addr.address1}</p>
                        <p className="addr-location">
                          {addr.city}, {stateName ? `${stateName}, ` : ""}{countryName}
                        </p>
                        <p className="addr-pin">PIN: {addr.pinCode}</p>
                        <p className="addr-phone">
                          <FiPhone className="phone-icon" /> {addr.phoneNumber}
                        </p>
                      </div>
                      
                      <button className="select-btn">
                        Deliver to this Address <FiArrowRight />
                      </button>
                    </motion.div>
                  );
                })}

                <motion.div
                  className="add-address-card"
                  whileHover={{ y: -5 }}
                  onClick={() => setShowForm(true)}
                >
                  <FiPlus className="plus-icon" />
                  <span>Add New Address</span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="add-address-form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="shipping-header">
                {savedAddresses.length > 0 && (
                  <button className="back-btn" onClick={() => setShowForm(false)}>
                    <FiArrowLeft /> Back to saved addresses
                  </button>
                )}
                <h1>Shipping Details</h1>
                <p>Enter your delivery address to get your delicious burgers</p>
              </div>

              <motion.form
                onSubmit={handleSubmit}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="form-grid">
                  {formFields.map((field) => (
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
                  <span>Save and Confirm Address</span>
                  <FiArrowRight className="btn-icon" />
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

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