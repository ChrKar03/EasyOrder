import React from 'react';

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

interface CartProps {
  cart: CartItem[];
}

const Cart: React.FC<CartProps> = ({ cart }) => {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.product.name} - {item.quantity} x {item.product.price}€ = {item.quantity * item.product.price}€
            <br />
            Comment: {item.comment}
          </li>
        ))}
      </ul>
      <h3>Total: {total}€</h3>
    </div>
  );
};

export default Cart;
