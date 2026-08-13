import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Order Confirmed! 🎉</h1>
        <p className="text-sm text-gray-500 mb-6">Order ID: {order._id}</p>

        <div className="mb-4">
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
            {order.status}
          </span>
        </div>

        <h2 className="font-semibold mb-2">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-3 pt-3 border-t mb-6">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-600">
          {order.shippingAddress.street}, {order.shippingAddress.city}<br />
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;