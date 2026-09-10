import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const order = await placeOrder(shippingAddress);
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
      setPlacing(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Shipping Address</label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            rows={3}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your full shipping address"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={placing} style={{ padding: '10px 20px' }}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;