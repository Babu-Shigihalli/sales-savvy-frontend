import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('default');
  const [searchParams] = useSearchParams();

  const rawQuery = searchParams.get('q') || '';
  const q = rawQuery.toLowerCase();
  const category = searchParams.get('category');

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  let visible = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(q);
    const matchesCategory = !category || p.category?.name === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === 'low') visible = [...visible].sort((a, b) => a.price - b.price);
  if (sort === 'high') visible = [...visible].sort((a, b) => b.price - a.price);

  const title = category || (rawQuery ? `Results for "${rawQuery}"` : 'All products');

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
    <>
      {!rawQuery && !category && (
        <section className="hero text-white text-center py-5">
          <div className="container py-4">
            <h1 className="display-5 fw-bold">Shop smart with Sales Savvy</h1>
            <p className="lead mb-4">Electronics, fashion, books and more, delivered to your door.</p>
            <a href="#products" className="btn btn-light btn-lg">Shop now</a>
          </div>
        </section>
      )}

      <div className="container py-4" id="products">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h4 className="mb-0">{title}</h4>
            <small className="text-muted">{visible.length} products</small>
          </div>
          <select
            className="form-select w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <div className="alert alert-info">No products match your search.</div>
        ) : (
          <div className="row g-3">
            {visible.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                <Link to={`/products/${p.id}`} className="text-dark">
                  <div className="card h-100 border-0 shadow-sm product-card">
                    <div
                      className="d-flex align-items-center justify-content-center bg-light text-secondary fs-1 fw-bold overflow-hidden"
                      style={{ height: 180 }}
                    >
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-100 h-100 object-fit-cover" />
                      ) : (
                        p.name.charAt(0)
                      )}
                    </div>
                    <div className="card-body pb-2">
                      <h6 className="card-title mb-1">{p.name}</h6>
                      <small className="text-muted">{p.category?.name}</small>
                    </div>
                    <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-bold">₹{Number(p.price).toLocaleString('en-IN')}</span>
                      <small className={p.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                        {p.stockQuantity > 0 ? 'In stock' : 'Out of stock'}
                      </small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;