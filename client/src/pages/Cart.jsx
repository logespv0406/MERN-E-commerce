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
      <div className="min-h-screen bg-neutral-50 py-20 px-6 text-center">
        <p className="text-neutral-400 text-sm tracking-wide mb-4">Your cart is empty.</p>
        <Link
          to="/"
          className="text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors duration-300"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-neutral-900 mb-10 text-center">Your cart</h1>

        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="bg-white border border-neutral-200 p-5 mb-3 flex items-center gap-5"
          >
            <div className="w-20 h-20 bg-neutral-100 overflow-hidden flex-shrink-0">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-base text-neutral-900">{item.product.name}</h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
                ₹{item.product.price} each
              </p>
            </div>
            <input
              type="number"
              min="1"
              max={item.product.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
              className="w-16 border border-neutral-300 p-2 text-center text-sm focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            />
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors duration-300"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="bg-white border border-neutral-200 p-6 mt-8 flex justify-between items-center">
          <span className="text-neutral-900 font-medium">Total: ₹{total}</span>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;