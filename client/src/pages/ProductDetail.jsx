import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-1/2 h-80 object-cover"
        />
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{product.category}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900 mb-4">₹{product.price}</p>

          <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm text-gray-600">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 border border-gray-300 p-2 rounded"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>

              {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;