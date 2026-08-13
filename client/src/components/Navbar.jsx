import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">
        MyShop
      </Link>

      <div className="flex items-center gap-6">
        {user?.isAdmin && (
          <Link to="/admin/products" className="text-sm text-gray-600 hover:text-blue-500">
            Admin
          </Link>
        )}

        {user && (
          <Link to="/orders" className="text-sm text-gray-600 hover:text-blue-500">
            My Orders
          </Link>
        )}

        <Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-500">
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-500">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;