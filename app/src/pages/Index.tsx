import React from 'react';
import { Link } from 'react-router-dom';

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

const Index: React.FC = () => {
  const openCart = () => {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      const cart: CartItem[] = JSON.parse(cartData);
      let cartContent = cart.map(item => {
        return `${item.product.name} x${item.quantity} - ${item.product.price * item.quantity}€\nComment: ${item.comment}`;
      }).join('\n');
      alert(cartContent);
    } else {
      alert('Cart is empty');
    }
  };

  return (
    <div>
      <button className="top-right-button" onClick={openCart}>Cart</button>
      <div className="buttons">
        <Link to="/coffee">
          <button>Coffee</button>
        </Link>
        <Link to="/drinks">
          <button>Drinks</button>
        </Link>
        {/* Add other categories as needed */}
      </div>
    </div>
  );
};

export default Index;
