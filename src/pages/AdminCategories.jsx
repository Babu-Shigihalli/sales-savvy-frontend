import { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const emptyForm = { name: '', description: '' };
  const [form, setForm] = useState(emptyForm);

  const loadCategories = () => {
    getAllCategories().then(setCategories).catch(() => setError('Failed to load categories.'));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category.');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h2>Manage Categories</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <input name="name" placeholder="Category name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
          {editingId ? 'Update' : 'Add'} Category
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ padding: '8px 16px' }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Categories</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
            <th>Name</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button onClick={() => handleEdit(cat)} style={{ marginRight: '8px' }}>Edit</button>
                <button onClick={() => handleDelete(cat.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;