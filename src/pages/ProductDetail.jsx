import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart.');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error && !product) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p style={{ fontSize: '1.5em' }}><strong>₹{product.price}</strong></p>
      <p>Stock available: {product.stockQuantity}</p>
      <p style={{ color: '#666' }}>Category: {product.category?.name}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stockQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '60px', padding: '5px' }}
        />
      </div>

      <button onClick={handleAddToCart} style={{ padding: '10px 20px' }}>
        Add to Cart
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ProductDetail;