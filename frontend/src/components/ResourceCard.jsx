import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
  ExternalLink,
  Info,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { CATEGORY_ICONS } from './SearchFilterBar';

export default function ResourceCard({
  resource,
  onSelect,
  onVerify,
  onUpvote,
  onReport,
}) {
  const [upvoting, setUpvoting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const IconComponent = CATEGORY_ICONS[resource.category] || MapPin;

  // Format verification date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never verified';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysSince = resource.daysSinceVerification;
  const isOutdated = resource.isOutdated;

  const handleUpvoteClick = async (e) => {
    e.stopPropagation();
    if (upvoting) return;
    setUpvoting(true);
    await onUpvote(resource._id);
    setUpvoting(false);
  };

  const handleVerifyClick = async (e) => {
    e.stopPropagation();
    if (verifying) return;
    setVerifying(true);
    await onVerify(resource._id);
    setVerifying(false);
  };

  return (
    <div className="resource-card" onClick={() => onSelect(resource)}>
      {/* Verification Status Banner */}
      {isOutdated ? (
        <div className="verification-badge verification-outdated">
          <AlertTriangle size={15} color="#d97706" />
          <span>Flagged: Not verified in {daysSince} days (Needs review)</span>
        </div>
      ) : (
        <div className="verification-badge verification-fresh">
          <ShieldCheck size={15} color="#16a34a" />
          <span>Verified active ({daysSince === 0 ? 'Today' : `${daysSince}d ago`})</span>
        </div>
      )}

      {/* Image Box */}
      <div className="card-image-box">
        <img
          src={resource.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'}
          alt={resource.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="card-badges">
          <span className="category-tag">
            <IconComponent size={14} color="#059669" />
            {resource.category}
          </span>
          <span
            className={`status-tag ${
              resource.status === 'Active'
                ? 'status-active'
                : resource.status === 'Under Maintenance'
                ? 'status-maint'
                : 'status-closed'
            }`}
          >
            {resource.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 className="card-title">{resource.name}</h3>
        <p className="card-description">{resource.description}</p>

        {/* Metadata Details */}
        <div className="card-meta-list">
          <div className="meta-item">
            <MapPin size={16} />
            <span>
              {resource.address}, {resource.city}
            </span>
          </div>

          <div className="meta-item">
            <Clock size={16} />
            <span>{resource.openingHours}</span>
          </div>

          <div className="meta-item">
            <Calendar size={16} />
            <span>Last checked: {formatDate(resource.lastVerifiedAt)}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="card-footer">
        <button
          className="card-action-btn btn-vote"
          onClick={handleUpvoteClick}
          title="Mark this facility as helpful"
        >
          <ThumbsUp size={15} />
          <span>{resource.upvotes || 0}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isOutdated && (
            <button
              className="card-action-btn"
              style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}
              onClick={handleVerifyClick}
              title="Confirm this facility is still operating"
            >
              <CheckCircle2 size={15} />
              <span>{verifying ? 'Updating...' : 'Verify'}</span>
            </button>
          )}

          <button
            className="card-action-btn btn-details"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(resource);
            }}
          >
            <span>Details</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
