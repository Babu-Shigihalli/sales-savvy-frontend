import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    setError('');
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error && !product) {
    return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  }

  const inStock = product.stockQuantity > 0;

  return (
    <div className="container py-4">
      <Link to="/" className="d-inline-block mb-3">&larr; Back to products</Link>

      <div className="card border-0 shadow-sm">
        <div className="row g-0">
          <div className="col-12 col-md-5">
            <div
              className="d-flex align-items-center justify-content-center bg-light text-secondary fw-bold overflow-hidden h-100"
              style={{ minHeight: 280, fontSize: '5rem' }}
            >
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-100 h-100 object-fit-cover" />
              ) : (
                product.name.charAt(0)
              )}
            </div>
          </div>

          <div className="col-12 col-md-7">
            <div className="card-body p-4">
              <span className="badge text-bg-secondary mb-2">{product.category?.name}</span>
              <h2>{product.name}</h2>
              <p className="text-muted">{product.description}</p>
              <p className="fs-3 fw-bold mb-1">₹{product.price}</p>
              <p className={inStock ? 'text-success' : 'text-danger'}>
                {inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </p>

              <div className="d-flex align-items-center gap-3 my-4">
                <label className="form-label mb-0">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="form-control w-auto"
                  style={{ width: 90 }}
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn btn-primary btn-lg"
              >
                Add to Cart
              </button>

              {message && <div className="alert alert-success mt-3 py-2">{message}</div>}
              {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;