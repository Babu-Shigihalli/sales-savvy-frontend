import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import { payForOrder } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    let order;
    try {
      order = await placeOrder(shippingAddress);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
      setPlacing(false);
      return;
    }

    try {
      const result = await payForOrder(order.id, user);
      if (result === 'PAID') {
        navigate(`/order-confirmation/${order.id}`);
      } else {
        navigate('/orders', {
          state: { notice: `Order #${order.id} is placed but not paid yet. Use Pay now to finish the payment.` },
        });
      }
    } catch (err) {
      navigate('/orders', {
        state: { notice: `Order #${order.id} is placed, but the payment could not be started. Try Pay now again.` },
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4">Checkout</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Shipping address</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full shipping address"
                    required
                  />
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <button type="submit" disabled={placing} className="btn btn-primary btn-lg w-100">
                  {placing ? 'Processing...' : 'Place order and pay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
