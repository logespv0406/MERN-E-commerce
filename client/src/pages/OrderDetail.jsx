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

  if (!order)
    return (
      <p className="text-center mt-16 text-neutral-400 text-sm tracking-wide">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-lg mx-auto bg-white border border-neutral-200 p-8">
        <h1 className="font-serif text-3xl text-neutral-900 mb-2">Order confirmed</h1>
        <p className="text-xs uppercase tracking-widest text-neutral-400 mb-6">
          Order ID: {order._id}
        </p>

        <div className="mb-6">
          <span className="inline-block text-[10px] uppercase tracking-widest border border-neutral-300 text-neutral-600 px-3 py-1">
            {order.status}
          </span>
        </div>

        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-neutral-700 mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between text-neutral-900 font-medium mt-4 pt-4 border-t border-neutral-200 mb-8">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
          Shipping address
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {order.shippingAddress.street}, {order.shippingAddress.city}<br />
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;