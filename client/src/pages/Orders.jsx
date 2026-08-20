import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-16 text-neutral-400 text-sm tracking-wide">Loading...</p>
    );

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20 px-6 text-center">
        <p className="text-neutral-400 text-sm tracking-wide">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-neutral-900 mb-10 text-center">My orders</h1>

        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-white border border-neutral-200 hover:border-neutral-400 p-5 mb-3 transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] uppercase tracking-widest border border-neutral-300 text-neutral-600 px-2 py-1">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">{order.items.length} item(s)</p>
            <p className="text-neutral-900 font-medium">₹{order.totalAmount}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;