import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import ImageUpload from '../components/ImageUpload';

const emptyForm = { name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' };

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    getAllProducts().then(setProducts).catch(() => setError('Failed to load products.'));
    getAllCategories().then(setCategories).catch(() => setError('Failed to load categories.'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    stockQuantity: parseInt(form.stockQuantity),
    imageUrl: form.imageUrl || null,
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

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl || '',
      categoryId: p.category?.id || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Products</h2>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="mb-3">{editingId ? 'Edit product' : 'Add a new product'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <input name="name" className="form-control" placeholder="Product name"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <select name="categoryId" className="form-select"
                  value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <textarea name="description" className="form-control" rows={2} placeholder="Description"
                  value={form.description} onChange={handleChange} />
              </div>
              <div className="col-6 col-md-3">
                <input name="price" type="number" step="0.01" className="form-control" placeholder="Price"
                  value={form.price} onChange={handleChange} required />
              </div>
              <div className="col-6 col-md-3">
                <input name="stockQuantity" type="number" className="form-control" placeholder="Stock"
                  value={form.stockQuantity} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                />
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}

            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2">
                {editingId ? 'Update product' : 'Add product'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th></th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ width: 60 }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} width="48" height="48" className="rounded object-fit-cover" />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center fw-bold text-secondary"
                          style={{ width: 48, height: 48 }}>
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="fw-bold">{p.name}</td>
                    <td>&#8377;{p.price}</td>
                    <td>{p.stockQuantity}</td>
                    <td><span className="badge text-bg-secondary">{p.category?.name}</span></td>
                    <td className="text-end">
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
