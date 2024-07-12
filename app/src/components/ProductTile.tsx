import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  pic: string;
}

interface ProductTileProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductTile: React.FC<ProductTileProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="tile">
      <img src={product.pic} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price}€</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={() => onAddToCart(product, quantity)}>Add to Cart</button>
    </div>
  );
};

export default ProductTile;
