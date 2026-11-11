import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Info,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Mail,
  Globe,
  Navigation,
  Flag,
  ThumbsUp,
  CheckCircle2
} from 'lucide-react';
import { CATEGORY_ICONS } from './SearchFilterBar';

export default function ResourceDetailModal({
  resource,
  onClose,
  onVerify,
  onUpvote,
  onOpenReport,
}) {
  const [verifying, setVerifying] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  if (!resource) return null;

  const IconComponent = CATEGORY_ICONS[resource.category] || MapPin;
  const isOutdated = resource.isOutdated;
  const daysSince = resource.daysSinceVerification;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleVerify = async () => {
    setVerifying(true);
    await onVerify(resource._id);
    setVerifying(false);
  };

  const handleUpvote = async () => {
    setUpvoting(true);
    await onUpvote(resource._id);
    setUpvoting(false);
  };

  // Google Maps navigation link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${resource.name}, ${resource.address}, ${resource.city}`
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="category-tag">
              <IconComponent size={14} color="#059669" />
              {resource.category}
            </span>
            <span
              className={`status-tag ${
                resource.status === 'Active' ? 'status-active' : 'status-closed'
              }`}
            >
              {resource.status}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <img
            src={resource.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'}
            alt={resource.name}
            className="detail-hero-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <h2 className="modal-title" style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
            {resource.name}
          </h2>

          <p style={{ color: 'var(--slate-medium)', fontSize: '0.98rem', marginBottom: '20px' }}>
            {resource.description}
          </p>

          {/* Verification Status Banner */}
          <div className={`verification-box-prominent ${isOutdated ? 'outdated' : 'fresh'}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isOutdated ? (
                <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
              ) : (
                <ShieldCheck size={24} color="#16a34a" style={{ flexShrink: 0 }} />
              )}
              <div>
                <strong style={{ display: 'block', color: isOutdated ? '#92400e' : '#166534', fontSize: '0.94rem' }}>
                  {isOutdated
                    ? '⚠️ Community Warning: Potentially Outdated Information'
                    : '✅ Verified Community Resource'}
                </strong>
                <p style={{ fontSize: '0.82rem', color: isOutdated ? '#78350f' : '#14532d', marginTop: '2px' }}>
                  {isOutdated
                    ? `This resource was last verified ${daysSince} days ago (${formatDate(
                        resource.lastVerifiedAt
                      )}). Facilities change over time. If you are on site, please verify its status.`
                    : `Last verified on ${formatDate(resource.lastVerifiedAt)} (${
                        daysSince === 0 ? 'Today' : `${daysSince} days ago`
                      }). Confirmed by ${resource.verificationCount || 1} residents.`}
                </p>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
              onClick={handleVerify}
              disabled={verifying}
            >
              <CheckCircle2 size={16} />
              <span>{verifying ? 'Verifying...' : 'Verify Active Now'}</span>
            </button>
          </div>

          {/* Info Grid */}
          <h4 className="detail-section-title">Facility Information</h4>
          <div className="detail-info-grid">
            <div className="detail-info-card">
              <div className="detail-info-label">Full Street Address</div>
              <div className="detail-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#2563eb" />
                <span>{resource.address}, {resource.city} {resource.state} {resource.zipCode}</span>
              </div>
            </div>

            <div className="detail-info-card">
              <div className="detail-info-label">Operating Hours</div>
              <div className="detail-info-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#10b981" />
                <span>{resource.openingHours}</span>
              </div>
            </div>

            <div className="detail-info-card">
              <div className="detail-info-label">Access & Special Notes</div>
              <div className="detail-info-val" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Info size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{resource.accessNotes || 'Open to all general public.'}</span>
              </div>
            </div>

            <div className="detail-info-card">
              <div className="detail-info-label">Contact & Inquiries</div>
              <div className="detail-info-val" style={{ fontSize: '0.88rem' }}>
                {resource.contactPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Phone size={14} color="#64748b" /> {resource.contactPhone}
                  </div>
                )}
                {resource.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Mail size={14} color="#64748b" /> {resource.contactEmail}
                  </div>
                )}
                {resource.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color="#64748b" />
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                      Official Link
                    </a>
                  </div>
                )}
                {!resource.contactPhone && !resource.contactEmail && !resource.website && (
                  <span style={{ color: '#94a3b8' }}>No direct phone/email listed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => onOpenReport(resource)}
            style={{ marginRight: 'auto', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Flag size={16} />
            <span>Report Issue</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleUpvote}
            disabled={upvoting}
          >
            <ThumbsUp size={16} />
            <span>Helpful ({resource.upvotes || 0})</span>
          </button>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Navigation size={16} />
            <span>Navigate on Map</span>
          </a>
        </div>
      </div>
    </div>
  );
}
