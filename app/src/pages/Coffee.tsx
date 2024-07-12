import React, { useEffect, useState } from 'react';
import ProductTile from '../components/ProductTile';
import CartModal from '../components/CartModal';

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

const Coffee: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    const coffeeProducts = await fetch('http://localhost:3000/products/coffee').then(res => res.json());
    setProducts(coffeeProducts);
  };

  const addToCart = (product: Product, quantity: number, comment: string) => {
    setCart([...cart, { product, quantity, comment }]);
    saveCart([...cart, { product, quantity, comment }]);
  };

  const openModal = (product: Product, quantity: number) => {
    setModalProduct(product);
    setModalQuantity(quantity);
  };

  const closeModal = () => {
    setModalProduct(null);
    setModalQuantity(1);
  };

  const saveCart = (cart: CartItem[]) => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  };

  const loadCart = () => {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  };

  return (
    <div>
      {products.map(product => (
        <ProductTile
          key={product.id}
          product={product}
          onAddToCart={(prod, qty) => openModal(prod, qty)}
        />
      ))}
      <CartModal
        product={modalProduct}
        quantity={modalQuantity}
        onClose={closeModal}
        onSubmit={addToCart}
      />
    </div>
  );
};

export default Coffee;
