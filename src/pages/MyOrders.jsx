import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading orders...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Order #{order.id}</h4>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                backgroundColor: order.status === 'DELIVERED' ? '#d4edda' : '#fff3cd',
                fontSize: '0.85em'
              }}>
                {order.status}
              </span>
            </div>
            <p>Shipping to: {order.shippingAddress}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <div>
              {order.items?.map((item) => (
                <p key={item.id} style={{ fontSize: '0.9em', color: '#555' }}>
                  {item.product.name} × {item.quantity} — ₹{item.priceAtPurchase}
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;