import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  console.log('AdminRoute check - user:', user, 'loading:', loading);

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;