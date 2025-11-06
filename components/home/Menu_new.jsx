import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { IMAGES } from "../../constants/images";
console.log(IMAGES)
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiClock,
  FiShoppingCart,
  FiZap,
} from "react-icons/fi";

// ✅ Full menu data (unchanged)
const menuData = {
  categories: [
    { id: "all", name: "All Items", icon: "🍔" },
    { id: "signature", name: "Signature Burgers", icon: "👑" },
    { id: "chicken", name: "Chicken Burgers", icon: "🍗" },
    { id: "veg", name: "Vegetarian", icon: "🥬" },
    { id: "combo", name: "Combos", icon: "🎯" },
    { id: "sides", name: "Sides", icon: "🍟" },
    { id: "beverages", name: "Beverages", icon: "🥤" },
  ],
  items: [
  // Signature Burgers
  {
    id: 1,
    name: "The Classic Supreme",
    description:
      "Our signature beef patty with aged cheddar, crispy bacon, fresh lettuce, tomato, and special sauce",
    price: 399,
    category: "signature",
    image: IMAGES.burger1,
    popular: true,
    spicy: false,
    vegetarian: false,
    preparationTime: 15,
    rating: 4.8,
    calories: 650,
  },
  {
    id: 2,
    name: "Double Trouble Burger",
    description:
      "Double beef patties, double cheese, caramelized onions, and smoky BBQ sauce",
    price: 499,
    category: "signature",
    image: IMAGES.burger1,
    popular: true,
    spicy: false,
    vegetarian: false,
    preparationTime: 18,
    rating: 4.9,
    calories: 850,
  },
  {
    id: 3,
    name: "Spicy Dragon Burger",
    description:
      "Spicy chicken patty with jalapeños, pepper jack cheese, and dragon sauce",
    price: 349,
    category: "chicken",
    image: IMAGES.burger1,
    popular: true,
    spicy: true,
    vegetarian: false,
    preparationTime: 12,
    rating: 4.7,
    calories: 580,
  },
  {
    id: 4,
    name: "Mushroom Swiss Bliss",
    description:
      "Beef patty with sautéed mushrooms, Swiss cheese, and garlic aioli",
    price: 379,
    category: "signature",
    image: IMAGES.burger1,
    popular: false,
    spicy: false,
    vegetarian: false,
    preparationTime: 14,
    rating: 4.6,
    calories: 620,
  },
  // Chicken Burgers
  {
    id: 5,
    name: "Crispy Chicken Deluxe",
    description: "Crispy fried chicken breast with mayo, lettuce, and pickles",
    price: 299,
    category: "chicken",
    image: IMAGES.burger1,
    popular: false,
    spicy: false,
    vegetarian: false,
    preparationTime: 10,
    rating: 4.5,
    calories: 520,
  },
  {
    id: 6,
    name: "Buffalo Chicken Ranch",
    description: "Spicy buffalo chicken with ranch dressing and coleslaw",
    price: 329,
    category: "chicken",
    image: IMAGES.burger2,
    popular: false,
    spicy: true,
    vegetarian: false,
    preparationTime: 12,
    rating: 4.4,
    calories: 560,
  },
  // Vegetarian
  {
    id: 7,
    name: "Garden Fresh Veggie",
    description: "Grilled vegetable patty with avocado, sprouts, and herb mayo",
    price: 279,
    category: "veg",
    image: IMAGES.burger1,
    popular: true,
    spicy: false,
    vegetarian: true,
    preparationTime: 8,
    rating: 4.3,
    calories: 420,
  },
  {
    id: 8,
    name: "Spicy Bean Supreme",
    description: "Spicy black bean patty with chipotle sauce and fresh veggies",
    price: 259,
    category: "veg",
    image: IMAGES.burger1,
    popular: false,
    spicy: true,
    vegetarian: true,
    preparationTime: 9,
    rating: 4.2,
    calories: 380,
  },
  // Combos
  {
    id: 9,
    name: "Classic Combo",
    description: "Classic Supreme + Fries + Soft Drink",
    price: 499,
    category: "combo",
    image: IMAGES.burger1,
    popular: true,
    spicy: false,
    vegetarian: false,
    preparationTime: 15,
    rating: 4.7,
    calories: 950,
  },
  {
    id: 10,
    name: "Family Feast",
    description: "4 Burgers + Large Fries + 4 Drinks + 2 Desserts",
    price: 1599,
    category: "combo",
    image: IMAGES.burger2,
    popular: false,
    spicy: false,
    vegetarian: false,
    preparationTime: 20,
    rating: 4.8,
    calories: 2800,
  },
  // Sides
  {
    id: 11,
    name: "Crispy French Fries",
    description: "Golden crispy fries with sea salt",
    price: 99,
    category: "sides",
    image: IMAGES.burger3,
    popular: true,
    spicy: false,
    vegetarian: true,
    preparationTime: 5,
    rating: 4.5,
    calories: 320,
  },
  {
    id: 12,
    name: "Onion Rings",
    description: "Beer-battered onion rings with dipping sauce",
    price: 129,
    category: "sides",
    image: IMAGES.burger1,
    popular: false,
    spicy: false,
    vegetarian: true,
    preparationTime: 6,
    rating: 4.4,
    calories: 280,
  },
  // Beverages
  {
    id: 13,
    name: "Classic Cola",
    description: "Refreshing cola served chilled",
    price: 79,
    category: "beverages",
    image: IMAGES.burger2,
    popular: true,
    spicy: false,
    vegetarian: true,
    preparationTime: 2,
    rating: 4.3,
    calories: 150,
  },
  {
    id: 14,
    name: "Fresh Lemonade",
    description: "Freshly squeezed lemonade with mint",
    price: 89,
    category: "beverages",
    image: IMAGES.burger1,
    popular: false,
    spicy: false,
    vegetarian: true,
    preparationTime: 3,
    rating: 4.6,
    calories: 120,
  },
]

};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    popular: false,
  });

  const dispatch = useDispatch();
   const { cartItems = [], subTotal = 0, tax = 0, shippingCharges = 0, total = 0 } =
      useSelector((state) => state.cart || {});

  // ✅ Add-to-cart logic (Redux)
// ✅ Add-to-cart logic (Redux)
const addToCart = (item) => {
  dispatch({ type: "addToCart", payload: item });
  dispatch({ type: "calculatePrice" });
  toast.success(`${item.name} added to cart`);
};


  // Filter & sort items
  const filteredItems = menuData.items
    .filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVegetarian = !filters.vegetarian || item.vegetarian;
      const matchesSpicy = !filters.spicy || item.spicy;
      const matchesPopular = !filters.popular || item.popular;
      return (
        matchesCategory &&
        matchesSearch &&
        matchesVegetarian &&
        matchesSpicy &&
        matchesPopular
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "calories":
          return a.calories - b.calories;
        case "popular":
        default:
          return b.popular - a.popular || b.rating - a.rating;
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="menu-page">
      <motion.div
        className="menu-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1>Our Delicious Menu</h1>
          <p>Handcrafted burgers made with love and the finest ingredients</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="menu-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for burgers, combos, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="control-buttons">
          <button
            className={`filter-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="calories">Calories: Low to High</option>
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filter-options"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.vegetarian}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      vegetarian: e.target.checked,
                    }))
                  }
                />
                Vegetarian Only
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      spicy: e.target.checked,
                    }))
                  }
                />
                Spicy Items
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.popular}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      popular: e.target.checked,
                    }))
                  }
                />
                Popular Items
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <motion.div
        className="category-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {menuData.categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Menu Items */}
      <motion.div
        className="menu-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${selectedCategory}-${searchQuery}-${sortBy}`}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="menu-item"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              layout
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} />
                <div className="item-badges">
                  {item.popular && (
                    <span className="badge popular">
                      <FiStar />
                      Popular
                    </span>
                  )}
                  {item.spicy && (
                    <span className="badge spicy">
                      <FiZap />
                      Spicy
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="badge vegetarian">🥬 Veg</span>
                  )}
                </div>
              </div>

              <div className="item-content">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="item-price">₹{item.price}</span>
                </div>

                <p className="item-description">{item.description}</p>

                <div className="item-meta">
                  <div className="meta-item">
                    <FiStar className="meta-icon" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="meta-item">
                    <FiClock className="meta-icon" />
                    <span>{item.preparationTime} min</span>
                  </div>
                  <div className="meta-item">
                    <FiZap className="meta-icon" />
                    <span>{item.calories} cal</span>
                  </div>
                </div>
 {/* Check if item is already in cart */}
{cartItems.some((cartItem) => cartItem.id === item.id) ? (
  <div className="quantity-controls">
    <button
      className="qty-btn"
      onClick={() => {dispatch({ type: "removeFromCart", payload: item });
      dispatch({ type: "decrementItem", payload: item });
    dispatch({ type: "calculatePrice" });
    }}
    >
      -
    </button>

    <span className="qty-count">
      {cartItems.find((cartItem) => cartItem.id === item.id)?.quantity}
    </span>

    <button
      className="qty-btn"
      onClick={() => dispatch({ type: "addToCart", payload: item })}
    >
      +
    </button>
  </div>
) : (
  <button
    className="add-to-cart-btn"
    onClick={() => addToCart(item)}
  >
    <FiShoppingCart />
    Add to Cart
  </button>
)}

              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="no-items"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>

      {/* Offers */}
      <motion.div
        className="special-offers"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="offer-card">
          <div className="offer-content">
            <h3>🎉 Weekend Special</h3>
            <p>Get 20% off on all combos this weekend!</p>
            <span className="offer-code">Use code: WEEKEND20</span>
          </div>
        </div>

        <div className="offer-card">
          <div className="offer-content">
            <h3>🚚 Free Delivery</h3>
            <p>Free delivery on orders above ₹500</p>
            <span className="offer-details">Limited time offer</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Menu;
