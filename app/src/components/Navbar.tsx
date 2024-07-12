import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/coffee">Coffee</Link>
      <Link to="/drinks">Drinks</Link>
      <Link to="/cart">Cart</Link>
    </nav>
  );
};

export default Navbar;
