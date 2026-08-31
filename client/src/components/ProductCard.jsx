import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageUrl';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block bg-white border border-neutral-200 hover:border-neutral-400 transition-colors duration-500"
    >
      <div className="overflow-hidden aspect-square bg-neutral-100">
        <img
          src={optimizeImage(product.imageUrl, 400)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-base text-neutral-900 truncate">{product.name}</h3>
        <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1 mb-3">
          {product.category}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-neutral-900 font-medium">₹{product.price}</span>
          <span
            className={`text-[10px] uppercase tracking-widest ${
              product.stock > 0 ? 'text-neutral-500' : 'text-red-500'
            }`}
          >
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;