import { useState } from 'react';
import { uploadImage } from '../services/uploadService';

function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed.');
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        {value ? (
          <img
            src={value}
            alt="Preview"
            width="64"
            height="64"
            className="rounded object-fit-cover border"
          />
        ) : (
          <div
            className="bg-light border rounded d-flex align-items-center justify-content-center text-muted small"
            style={{ width: 64, height: 64 }}
          >
            No image
          </div>
        )}

        <div className="flex-grow-1">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="form-control"
            onChange={handleFile}
            disabled={uploading}
          />
          {uploading && <small className="text-muted">Uploading...</small>}
        </div>

        {value && (
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

export default ImageUpload;
