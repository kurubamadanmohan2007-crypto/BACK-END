import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Send } from 'lucide-react';

const ISSUE_TYPES = [
  'Incorrect Address',
  'Permanently Closed',
  'Temporarily Closed',
  'Outdated Hours',
  'Damaged / Non-Functional',
  'Restricted Access',
  'Other',
];

export default function ReportIssueModal({ resource, onClose, onSubmitReport }) {
  const [issueType, setIssueType] = useState('Outdated Hours');
  const [description, setDescription] = useState('');
  const [reportedByName, setReportedByName] = useState('');
  const [reportedByEmail, setReportedByEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!resource) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      return setError('Please provide details regarding the problem.');
    }

    setLoading(true);
    try {
      await onSubmitReport({
        resourceId: resource._id,
        issueType,
        description,
        reportedByName,
        reportedByEmail,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
            <Flag size={20} />
            <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>Report an Issue</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '18px',
                fontSize: '0.88rem',
                color: '#991b1b',
              }}
            >
              Reporting facility: <strong>{resource.name}</strong> ({resource.address})
            </div>

            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.86rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Issue Category <span className="req">*</span></label>
              <select
                className="form-select"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description of the Issue <span className="req">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Please describe what changed (e.g. water fountain tap broken, charging kiosk has no power, facility closed permanently...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Your Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Resident or Volunteer"
                  value={reportedByName}
                  onChange={(e) => setReportedByName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="resident@example.com"
                  value={reportedByEmail}
                  onChange={(e) => setReportedByEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              disabled={loading}
            >
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
