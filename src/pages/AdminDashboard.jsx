import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link to="/admin/products" style={{ padding: '15px 25px', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
          Manage Products
        </Link>
        <Link to="/admin/categories" style={{ padding: '15px 25px', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
          Manage Categories
        </Link>
        <Link to="/admin/orders" style={{ padding: '15px 25px', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
          Manage Orders
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;