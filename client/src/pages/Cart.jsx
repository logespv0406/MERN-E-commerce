import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-blue-500 hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="bg-white p-4 rounded-lg shadow-sm mb-3 flex items-center gap-4"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
              <p className="text-sm text-gray-500">₹{item.product.price} each</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.product.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
              className="w-16 border border-gray-300 p-1 rounded text-center"
            />
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="bg-white p-4 rounded-lg shadow-sm mt-6 flex justify-between items-center">
          <span className="text-lg font-bold">Total: ₹{total}</span>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;