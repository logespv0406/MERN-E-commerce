import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const res = await API.get('/cart');
      setCart(res.data || { items: [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await API.post('/cart', { productId, quantity: Number(quantity) || 1 });
    if (res.data) {
      setCart(res.data);
    }
    return res.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await API.put(`/cart/${productId}`, { quantity: Number(quantity) });
    if (res.data) {
      setCart(res.data);
    }
    return res.data;
  };

  const removeFromCart = async (productId) => {
    const res = await API.delete(`/cart/${productId}`);
    if (res.data) {
      setCart(res.data);
    }
    return res.data;
  };

  const clearCartLocally = () => {
    setCart({ items: [] });
  };

  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: cart || { items: [] },
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        clearCartLocally,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);