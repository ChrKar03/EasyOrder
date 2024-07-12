import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Coffee from './pages/Coffee';
import Drinks from './pages/Drinks';
import Cart from './components/Cart';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  pic: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  comment: string;
}

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, comment: string) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.comment = comment;
      setCart([...cart]);
    } else {
      setCart([...cart, { product, quantity, comment }]);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/drinks" element={<Drinks />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </Router>
  );
};

export default App;
