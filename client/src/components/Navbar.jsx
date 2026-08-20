import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-neutral-200 px-6 md:px-10 py-5 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 72 72">
          <rect x="1" y="1" width="70" height="70" fill="none" stroke="#1a1a1a" strokeWidth="1" />
          <text x="36" y="47" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="34" fill="#1a1a1a">K</text>
        </svg>
        <span className="font-serif text-2xl tracking-wide text-neutral-900">Kastra</span>
      </Link>

      {!isAuthPage && (
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
          >
            Home
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin/products"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
            >
              Admin
            </Link>
          )}

          {user && (
            <Link
              to="/orders"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
            >
              My Orders
            </Link>
          )}

          <Link
            to="/cart"
            className="relative text-neutral-700 hover:text-neutral-900 transition-colors duration-300"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;