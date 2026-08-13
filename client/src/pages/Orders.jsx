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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6 text-center">
        <p className="text-gray-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-white p-4 rounded-lg shadow-sm mb-3 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
            <p className="font-bold">₹{order.totalAmount}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;