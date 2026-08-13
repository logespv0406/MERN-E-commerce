import { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await API.post('/cart', { productId, quantity });
    setCart(res.data);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await API.put(`/cart/${productId}`, { quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await API.delete(`/cart/${productId}`);
    setCart(res.data);
  };

  const clearCartLocally = () => {
    setCart({ items: [] });
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, fetchCart, clearCartLocally, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);