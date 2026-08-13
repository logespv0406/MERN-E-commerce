import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shop</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
