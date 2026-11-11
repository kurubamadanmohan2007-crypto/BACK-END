import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { CATEGORY_ICONS } from './SearchFilterBar';

export default function InteractiveMapPreview({ resources, onSelectResource }) {
  const [activePin, setActivePin] = useState(resources[0] || null);

  // Map markers relative coordinates within a normalized view area
  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--navy-dark)',
            }}
          >
            🗺️ Interactive Area Resource Map
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-light)' }}>
            Select any active facility pin across the community zone to inspect
          </p>
        </div>

        <span
          style={{
            background: 'var(--primary-blue-subtle)',
            color: 'var(--primary-blue)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {resources.length} Pins Plotted
        </span>
      </div>

      {/* Styled Map Canvas Visual */}
      <div
        style={{
          height: '360px',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%)',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #bae6fd',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Abstract road grid lines for aesthetic city map feeling */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        >
          <line x1="0" y1="90" x2="100%" y2="90" stroke="#0284c7" strokeWidth="6" />
          <line x1="0" y1="220" x2="100%" y2="220" stroke="#059669" strokeWidth="8" />
          <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#0284c7" strokeWidth="6" />
          <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#059669" strokeWidth="6" />
          <circle cx="28%" cy="90" r="14" fill="#38bdf8" />
          <circle cx="68%" cy="220" r="16" fill="#34d399" />
        </svg>

        {/* Resource Pins */}
        {resources.map((item, idx) => {
          // Spread pseudo coordinates visually across the map preview
          const topPos = 18 + ((idx * 37 + 13) % 68);
          const leftPos = 10 + ((idx * 53 + 7) % 78);
          const isSelected = activePin?._id === item._id;
          const Icon = CATEGORY_ICONS[item.category] || MapPin;

          return (
            <button
              key={item._id}
              onClick={() => setActivePin(item)}
              style={{
                position: 'absolute',
                top: `${topPos}%`,
                left: `${leftPos}%`,
                transform: isSelected ? 'scale(1.25) translateY(-6px)' : 'scale(1)',
                background: item.isOutdated ? '#f59e0b' : '#10b981',
                color: '#fff',
                padding: '6px',
                borderRadius: '50%',
                boxShadow: isSelected
                  ? '0 0 0 6px rgba(37, 99, 235, 0.4), 0 8px 16px rgba(0,0,0,0.3)'
                  : '0 4px 8px rgba(0,0,0,0.15)',
                zIndex: isSelected ? 20 : 10,
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
              }}
              title={`${item.name} (${item.category})`}
            >
              <Icon size={18} />
            </button>
          );
        })}

        {/* Selected Pin Popover in Map */}
        {activePin && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              maxWidth: '460px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(8px)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 30,
              border: '1px solid var(--border-color)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ecfdf5',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {activePin.category}
                </span>
                {activePin.isOutdated ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#b45309',
                      background: '#fef3c7',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <AlertTriangle size={12} /> Outdated
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#15803d',
                      background: '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ShieldCheck size={12} /> Fresh
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '0.98rem', color: 'var(--navy-dark)', display: 'block' }}>
                {activePin.name}
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-light)' }}>
                {activePin.address} &bull; {activePin.openingHours}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', flexShrink: 0, marginLeft: '12px' }}
              onClick={() => onSelectResource(activePin)}
            >
              <span>View Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
