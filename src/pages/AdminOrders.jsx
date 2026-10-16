import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    getAllOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status.');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading orders...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>Manage Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>Order #{order.id} — {order.user?.email}</h4>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                style={{ padding: '5px' }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
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

export default AdminOrders;