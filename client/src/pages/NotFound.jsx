import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl text-neutral-900 mb-4">404</p>
      <h1 className="font-serif text-2xl text-neutral-900 mb-2">Page not found</h1>
      <p className="text-sm text-neutral-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
      >
        Back to shop
      </Link>
    </div>
  );
};

export default NotFound;