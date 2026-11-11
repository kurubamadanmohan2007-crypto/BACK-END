import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Check } from 'lucide-react';
import { CATEGORIES } from './SearchFilterBar';

export default function AddResourceModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Drinking Water',
    description: '',
    address: '',
    city: 'Metro City',
    state: '',
    zipCode: '',
    openingHours: 'Open 24/7',
    accessNotes: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    imageUrl: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableCategories = CATEGORIES.filter((c) => c !== 'All');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) return setError('Please enter a facility name');
    if (!formData.description.trim()) return setError('Please enter a short description');
    if (!formData.address.trim()) return setError('Please enter a street address');
    if (!formData.openingHours.trim()) return setError('Please specify the opening hours');

    setLoading(true);
    try {
      await onCreated(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={22} color="#059669" />
            <h3 className="modal-title">Add Community Public Resource</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Resource Name */}
              <div className="form-group form-full">
                <label className="form-label">
                  Resource / Facility Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Civic Park Clean Hydration Station"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  Category <span className="req">*</span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Current Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active & Operating</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Temporarily Closed">Temporarily Closed</option>
                </select>
              </div>

              {/* Description */}
              <div className="form-group form-full">
                <label className="form-label">
                  Description <span className="req">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="What is available here? (e.g. Free filtered drinking water, 4 refill spouts, pet fountain...)"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group form-full">
                <label className="form-label">
                  Street Address / Landmark <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="e.g. 120 Main Street (Adjacent to North Gate)"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">City / Town</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              {/* Opening Hours */}
              <div className="form-group">
                <label className="form-label">
                  Opening Hours <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="openingHours"
                  className="form-input"
                  placeholder="e.g. Open 24/7 or 8:00 AM - 9:00 PM"
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Access Notes */}
              <div className="form-group form-full">
                <label className="form-label">Accessibility & Directions</label>
                <input
                  type="text"
                  name="accessNotes"
                  className="form-input"
                  placeholder="e.g. Wheelchair accessible ramp, braille signage, free public access"
                  value={formData.accessNotes}
                  onChange={handleChange}
                />
              </div>

              {/* Image URL */}
              <div className="form-group form-full">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Phone */}
              <div className="form-group">
                <label className="form-label">Contact Phone (Optional)</label>
                <input
                  type="text"
                  name="contactPhone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>

              {/* Website */}
              <div className="form-group">
                <label className="form-label">Website / Portal (Optional)</label>
                <input
                  type="url"
                  name="website"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Check size={18} />
              <span>{loading ? 'Submitting...' : 'Register Resource'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
