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
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {});
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    closeMenu();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <header className="shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold" onClick={closeMenu}>
            <img src="/logo-icon.svg" alt="" width="30" height="30" />
            Sales Savvy
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <form onSubmit={handleSearch} className="nav-search d-flex mt-2 mt-lg-0">
            <input
              className="form-control rounded-end-0"
              placeholder="Search for products"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-start-0">Search</button>
          </form>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3 ms-lg-auto py-2 py-lg-0">
              {user ? (
                <>
                  <Link to="/cart" className="text-light" onClick={closeMenu}>Cart</Link>
                  <Link to="/orders" className="text-light" onClick={closeMenu}>My Orders</Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-warning" onClick={closeMenu}>Admin</Link>
                  )}
                  <span
                    className="badge text-bg-secondary text-truncate align-self-start"
                    style={{ maxWidth: 220 }}
                  >
                    {user.email}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm align-self-start">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-light" onClick={closeMenu}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm align-self-start" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
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
