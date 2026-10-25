import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllCategories } from '../services/categoryService';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState([]);
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="shadow-sm">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex flex-wrap align-items-center gap-3">
          <Link to="/" className="navbar-brand fw-bold mb-0">🛍️ Sales Savvy</Link>

          <form onSubmit={handleSearch} className="flex-grow-1 d-flex" style={{ maxWidth: 600 }}>
            <input
              className="form-control rounded-end-0"
              placeholder="Search for products"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-start-0">Search</button>
          </form>

          <div className="d-flex flex-wrap align-items-center gap-3 ms-auto">
            {user ? (
              <>
                <Link to="/cart" className="text-light">Cart</Link>
                <Link to="/orders" className="text-light">My Orders</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-warning">Admin</Link>
                )}
                <span className="badge text-bg-secondary">{user.email}</span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-light">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-white border-bottom">
        <div className="container d-flex gap-4 overflow-auto py-2">
          <Link
            to="/"
            className={`text-nowrap small fw-semibold ${!activeCategory ? 'text-primary' : 'text-dark'}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/?category=${encodeURIComponent(c.name)}`}
              className={`text-nowrap small fw-semibold ${activeCategory === c.name ? 'text-primary' : 'text-dark'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;