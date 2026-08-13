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

    // Building multipart form data, since we're sending a file
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
      setMessage('Product added!');
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
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Products</h1>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <h2 className="font-semibold mb-3">Add New Product</h2>
          {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mb-4"
            required
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Add Product
          </button>
        </form>

        <h2 className="font-semibold mb-3">Existing Products</h2>
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm mb-3 flex items-center gap-4">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">₹{product.price} • Stock: {product.stock}</p>
            </div>
            <button
              onClick={() => handleDelete(product._id)}
              className="text-red-500 hover:underline text-sm"
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