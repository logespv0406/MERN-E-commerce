import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-10 w-full max-w-sm">
        <h2 className="font-serif text-3xl text-neutral-900 text-center mb-8">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-300 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 px-4 py-3 text-sm mb-6 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
        >
          Login
        </button>
        <p className="text-xs text-center mt-6 text-neutral-500 tracking-wide">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors duration-300">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;