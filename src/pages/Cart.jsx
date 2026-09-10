import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../services/cartService';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadCart = () => {
    getCart()
      .then((data) => setCartItems(data))
      .catch(() => setError('Failed to load cart.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
      loadCart();
    } catch (err) {
      setError('Failed to update quantity.');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      loadCart();
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p style={{ padding: '20px' }}>Loading cart...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              padding: '15px 0'
            }}>
              <div>
                <h4>{item.product.name}</h4>
                <p>₹{item.product.price} each</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>
              <p><strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong></p>
              <button onClick={() => handleRemove(item.id)} style={{ color: 'red' }}>Remove</button>
            </div>
          ))}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button
              onClick={() => navigate('/checkout')}
              style={{ padding: '10px 20px', marginTop: '10px' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;