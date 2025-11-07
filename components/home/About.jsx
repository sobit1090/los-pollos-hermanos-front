import React from 'react';
import { motion } from 'framer-motion';
import {IMAGES} from "../../constants/images"
 import { Helmet } from "react-helmet";
import { 
  FiAward, 
  FiHeart, 
  FiUsers, 
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiStar
} from 'react-icons/fi';
import { IoFastFoodOutline, IoRestaurant } from 'react-icons/io5';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const stats = [
    { icon: FiUsers, value: '10,000+', label: 'Happy Customers' },
    { icon: IoRestaurant, value: '50+', label: 'Burger Varieties' },
    { icon: FiClock, value: '5+', label: 'Years Experience' },
    { icon: FiStar, value: '4.9/5', label: 'Customer Rating' }
  ];

  const values = [
    {
      icon: FiAward,
      title: 'Quality First',
      description: 'We use only the finest ingredients sourced from trusted local suppliers.'
    },
    {
      icon: FiHeart,
      title: 'Made with Love',
      description: 'Every burger is crafted with passion and attention to detail.'
    },
    {
      icon: FiUsers,
      title: 'Community Focused',
      description: 'We believe in building relationships and supporting our local community.'
    }
  ];

  const team = [
    {
     name: 'Gustavo Fring',
      role: 'Founder & Operation Manager',
      image: IMAGES.gus,
      description: 'Passionate about creating the perfect burger experience.'
    },
    {
       name: 'Walter Hartwell White',
      role: 'Chef',
      image:IMAGES.download1,
      description: 'Ensuring everything runs smoothly behind the scenes.'
    },
    {
      name: 'Jesse Pinkman',
      role: 'Customer Experience & Co-Chef',
      image: IMAGES.download,
      description: 'Dedicated to making every customer feel special.'
    }
  ];

  return (
    <section className="about">
      <Helmet>
        <title>About | Los Pollos Hermanos</title>
      </Helmet>
      {/* Hero Section */}
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Story
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Crafting unforgettable burger experiences since 2019
          </motion.p>
        </div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
         <img src={IMAGES.losPollosLogo} alt="Logo" className="lospollos" />

        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="stat-icon" />
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        className="story-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="story-content">
          <motion.div 
            className="story-text"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>From Humble Beginnings</h2>
           <p>
  What started as a small food truck has grown into 
  Los Polos Burger's – a beloved destination for burger enthusiasts. 
  Our journey began with a simple mission: to craft the most 
  delicious, high-quality burgers using fresh, locally-sourced ingredients.
</p>
<p>
  Today, we continue to honor that mission, serving our community 
  with the same passion and dedication that sparked our beginnings. 
  Every burger tells a story of quality, craftsmanship, and love.
</p>

          </motion.div>
          <motion.div 
            className="story-image"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="image-placeholder">
              <img src={IMAGES.all} alt="" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="values-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="section-title"
          variants={itemVariants}
        >
          Our Values
        </motion.h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="value-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <value.icon className="value-icon" />
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="team-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="section-title"
          variants={itemVariants}
        >
          Meet Our Team
        </motion.h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              className="team-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="member-image">
                <img src={member.image} alt={member.name} />
                <div className="image-overlay"></div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Info */}
      <motion.section 
        className="contact-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="contact-content">
          <h2>Visit Us Today</h2>
          <div className="contact-info">
            <div className="contact-item">
              <FiMapPin />
              <div>
                <h4>Location</h4>
                <p>123 Burger Street, Food City, FC 12345</p>
              </div>
            </div>
            <div className="contact-item">
              <FiPhone />
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-BURGER</p>
              </div>
            </div>
            <div className="contact-item">
              <FiMail />
              <div>
                <h4>Email</h4>
                <p>hello@lospolosburger.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </section>
  );
};

export default About;