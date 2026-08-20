import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCodOrder = async () => {
    try {
      const res = await API.post('/orders', {
        shippingAddress: { street, city, postalCode, country },
      });
      await fetchCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const { data } = await API.post('/orders/razorpay/create');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Kastra',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/orders/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: { street, city, postalCode, country },
            });

            await fetchCart();
            navigate(`/orders/${verifyRes.data._id}`);
          } catch (err) {
            setError('Payment succeeded but order verification failed. Contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#1a1a1a',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (paymentMethod === 'COD') {
      await handleCodOrder();
      setLoading(false);
    } else {
      await handleRazorpayPayment();
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20 px-6 text-center">
        <p className="text-neutral-400 text-sm tracking-wide">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl text-neutral-900 mb-10 text-center">Checkout</h1>

        <div className="bg-white border border-neutral-200 p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Order summary
          </h2>
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between text-sm text-neutral-700 mb-2"
            >
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-neutral-900 font-medium mt-4 pt-4 border-t border-neutral-200">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Shipping address
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="text"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-6 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />

          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Payment method
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-center gap-3 border border-neutral-300 px-4 py-3 cursor-pointer has-[:checked]:border-neutral-900 transition-colors duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-neutral-900"
              />
              <span className="text-sm text-neutral-800">Pay online (Card / UPI / Netbanking)</span>
            </label>

            <label className="flex items-center gap-3 border border-neutral-300 px-4 py-3 cursor-pointer has-[:checked]:border-neutral-900 transition-colors duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-neutral-900"
              />
              <span className="text-sm text-neutral-800">Cash on delivery</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : paymentMethod === 'COD'
              ? `Place order (₹${total})`
              : `Pay ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;