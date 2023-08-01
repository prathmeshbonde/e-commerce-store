import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products?title=${searchTerm}`);
      const data = await response.json();
      setSearchedItems(data);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const handleAddToCart = (item) => {
    setCartItems((prevCartItems) => [...prevCartItems, item]);
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = searchedItems.length > 0 ? searchedItems : items;

  useEffect(() => {
    fetchItemsOnSale();
  }, []); // Fetch the items on sale only when the component mounts

  const fetchItemsOnSale = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=10');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>E-Commerce Website</h1>
          <div className="search-bar">
            <SearchBar onSearch={handleSearch} />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          <Link to="/cart" className="cart-link">
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
            Cart
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>
        </header>

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                items={displayedItems.slice(startIndex, endIndex)}
                totalItems={displayedItems.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onAddToCart={handleAddToCart}
                searchedItems={searchedItems}
              />
            }
          />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
