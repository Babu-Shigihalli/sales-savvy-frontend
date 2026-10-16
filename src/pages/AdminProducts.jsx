import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getAllCategories } from '../services/categoryService';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const emptyForm = { name: '', description: '', price: '', stockQuantity: '', categoryId: '' };
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    getAllProducts().then(setProducts).catch(() => setError('Failed to load products.'));
    getAllCategories().then(setCategories).catch(() => setError('Failed to load categories.'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    stockQuantity: parseInt(form.stockQuantity),
    category: { id: parseInt(form.categoryId) },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateProduct(editingId, buildPayload());
      } else {
        await createProduct(buildPayload());
      }
      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.category?.id || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>

        <div style={{ marginBottom: '10px' }}>
          <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required style={{ flex: 1, padding: '8px' }} />
          <input name="stockQuantity" type="number" placeholder="Stock" value={form.stockQuantity} onChange={handleChange} required style={{ flex: 1, padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px' }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Products</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
            <th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>{p.category?.name}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ marginRight: '8px' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;