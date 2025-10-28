import React from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const Loader = () => {
  const options = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      ease: "linear",
      repeat: Infinity, // ✅ corrected
      repeatType: "reverse",
      duration: 0.8, // optional, controls speed
    },
  };

  return (
    <div className="loader">
      <IoFastFoodOutline size={50} />

      <div>
        <motion.p {...options}>Loading...</motion.p>
      </div>
    </div>
  );
};

export default Loader;
