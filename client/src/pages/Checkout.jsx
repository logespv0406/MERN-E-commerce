import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/orders', {
        shippingAddress: { street, city, postalCode, country },
      });
      await fetchCart(); // refresh cart (should now be empty)
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-3 border-t">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;