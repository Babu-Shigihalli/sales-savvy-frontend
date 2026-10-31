import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { payForOrder } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  PENDING: 'warning',
  APPROVED: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [payingId, setPayingId] = useState(null);
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || '');
  const { user } = useAuth();

  const loadOrders = () => {
    getMyOrders()
      .then((data) => setOrders(data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handlePay = async (orderId) => {
    setNotice('');
    setActionError('');
    setPayingId(orderId);
    try {
      const result = await payForOrder(orderId, user);
      if (result === 'PAID') {
        setNotice(`Payment received for order #${orderId}.`);
      } else if (result === 'FAILED') {
        setActionError('The payment could not be verified. Please try again.');
      }
      loadOrders();
    } catch (err) {
      setActionError(err.response?.data?.error || 'The payment could not be started.');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>

      {notice && <div className="alert alert-info">{notice}</div>}
      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {orders.length === 0 ? (
        <div className="alert alert-info">You have not placed any orders yet.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">Order #{order.id}</h5>
                  {order.createdAt && (
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <span className={`badge text-bg-${STATUS_COLORS[order.status] || 'secondary'}`}>
                  {order.status}
                </span>
              </div>

              <p className="mt-3 mb-2 text-muted">Shipping to: {order.shippingAddress}</p>

              <ul className="list-group list-group-flush mb-2">
                {order.items?.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>&#8377;{item.priceAtPurchase}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between align-items-center">
                {order.status === 'PENDING' ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePay(order.id)}
                    disabled={payingId === order.id}
                  >
                    {payingId === order.id ? 'Opening payment...' : 'Pay now'}
                  </button>
                ) : (
                  <span></span>
                )}
                <div className="fw-bold fs-5">Total: &#8377;{order.totalAmount}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
