import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  pic: string;
}

interface CartModalProps {
  product: Product | null;
  quantity: number;
  onClose: () => void;
  onSubmit: (product: Product, quantity: number, comment: string) => void;
}

const CartModal: React.FC<CartModalProps> = ({ product, quantity, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  if (!product) return null;

  const handleSubmit = () => {
    onSubmit(product, quantity, comment);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Product Comment</h2>
        <textarea
          rows={4}
          placeholder="Enter your comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default CartModal;
