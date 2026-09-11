import { useState, useEffect } from 'react';
import API from '../api/axios';
import { optimizeImage } from '../utils/imageUrl';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageType, setImageType] = useState('file'); // 'file' or 'url'
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStock('');
    setImage(null);
    setImageUrl('');
    setPreviewUrl('');
    setImageType('file');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    setPreviewUrl(val.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (imageType === 'file' && !image) {
      setIsError(true);
      setMessage('Please select an image file from your computer');
      return;
    }

    if (imageType === 'url' && !imageUrl.trim()) {
      setIsError(true);
      setMessage('Please paste a valid image URL');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);

    if (imageType === 'file' && image) {
      formData.append('image', image);
    } else if (imageType === 'url' && imageUrl.trim()) {
      formData.append('imageUrl', imageUrl.trim());
    }

    try {
      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✓ Product added successfully & uploaded to Cloudinary!');
      setIsError(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Something went wrong while adding the product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
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
          {message && (
            <p className={`text-sm mb-4 font-medium ${isError ? 'text-red-500' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}

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
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Product Image Source
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setImageType('file');
                  setPreviewUrl(image ? URL.createObjectURL(image) : '');
                }}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors duration-200 ${
                  imageType === 'file'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageType('url');
                  setPreviewUrl(imageUrl.trim());
                }}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors duration-200 ${
                  imageType === 'url'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500'
                }`}
              >
                Paste Image URL
              </button>
            </div>
          </div>

          {imageType === 'file' ? (
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Uploads directly to your Cloudinary storage
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="url"
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                value={imageUrl}
                onChange={handleUrlChange}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors duration-300"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Cloudinary will automatically download, optimize, and store this in your Cloudinary account
              </p>
            </div>
          )}

          {previewUrl && (
            <div className="mb-6 flex items-center gap-4 p-3 bg-neutral-50 border border-neutral-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 object-cover border border-neutral-300 bg-white"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="text-xs text-neutral-600">
                <span className="font-medium text-neutral-800">Image Preview</span>
                <p className="text-[11px] text-neutral-400">
                  {imageType === 'file'
                    ? image?.name || 'File selected'
                    : 'Remote URL ready to upload to Cloudinary'}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50"
          >
            {submitting ? 'Uploading to Cloudinary...' : 'Add product'}
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
                src={optimizeImage(product.imageUrl, 100)}
                alt={product.name}
                loading="lazy"
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