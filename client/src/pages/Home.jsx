import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
  const timer = setTimeout(() => {
    fetchProducts();
  }, 400);

  return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-neutral-50 py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl text-neutral-900 mb-2">The collection</h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Curated pieces, thoughtfully made
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
          />

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <p className="text-center text-neutral-400 text-sm tracking-wide">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-neutral-400 text-sm tracking-wide">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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