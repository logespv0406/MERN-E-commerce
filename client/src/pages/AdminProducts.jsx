import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get('/products');
    setProducts(res.data);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStock('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) formData.append('image', image);

    try {
      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Product added');
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-neutral-900 mb-10 text-center">
          Admin — manage products
        </h1>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 mb-10">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Add new product
          </h2>
          {message && <p className="text-sm text-neutral-600 mb-4">{message}</p>}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mb-6 text-sm text-neutral-600"
            required
          />

          <button
            type="submit"
            className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
          >
            Add product
          </button>
        </form>

        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
          Existing products
        </h2>
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-neutral-200 p-5 mb-3 flex items-center gap-5"
          >
            <div className="w-16 h-16 bg-neutral-100 overflow-hidden flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-base text-neutral-900">{product.name}</h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
                ₹{product.price} • Stock: {product.stock}
              </p>
            </div>
            <button
              onClick={() => handleDelete(product._id)}
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;