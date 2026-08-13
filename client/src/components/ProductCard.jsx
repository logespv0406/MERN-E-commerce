import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden block"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;