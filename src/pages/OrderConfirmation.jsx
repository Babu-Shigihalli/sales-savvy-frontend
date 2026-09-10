import { useParams, Link } from 'react-router-dom';

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Order Placed Successfully! 🎉</h2>
      <p>Your order number is <strong>#{orderId}</strong></p>
      <p>Thank you for shopping with Sales Savvy.</p>
      <Link to="/orders">View My Orders</Link>
      {' | '}
      <Link to="/">Continue Shopping</Link>
    </div>
  );
}

export default OrderConfirmation;