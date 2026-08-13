import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminProducts from './pages/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.isAdmin ? (
            <Navigate to="/admin/products" />
          ) : (
            <Home />
          )
        }
      />
      <Route path="/shop" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={<ProtectedRoute><Checkout /></ProtectedRoute>}
      />
      <Route
        path="/orders"
        element={<ProtectedRoute><Orders /></ProtectedRoute>}
      />
      <Route
        path="/orders/:id"
        element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute><AdminProducts /></AdminRoute>}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;