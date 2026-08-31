import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { optimizeImage } from '../utils/imageUrl';

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
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product)
    return (
      <p className="text-center mt-16 text-neutral-400 text-sm tracking-wide">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-neutral-200 overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-80 md:h-auto bg-neutral-100 overflow-hidden">
          <img
            src={optimizeImage(product.imageUrl, 600)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 flex-1">
          <h1 className="font-serif text-3xl text-neutral-900 mb-2">{product.name}</h1>
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-6">
            {product.category}
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed mb-6">{product.description}</p>
          <p className="text-2xl text-neutral-900 font-medium mb-4">₹{product.price}</p>

          <p
            className={`text-xs uppercase tracking-widest mb-6 ${
              product.stock > 0 ? 'text-neutral-500' : 'text-red-500'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <label className="text-xs uppercase tracking-widest text-neutral-500">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 border border-neutral-300 p-2 text-center text-sm focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
              >
                Add to cart
              </button>

              {message && (
                <p className="text-xs uppercase tracking-widest text-neutral-500 mt-4">
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;