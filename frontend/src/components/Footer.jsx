import React from 'react';
import { MapPin, Heart, Shield, RefreshCw } from 'lucide-react';

export default function Footer({ onCategoryClick }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Col 1: Mission */}
        <div>
          <div className="brand" style={{ marginBottom: '14px' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <MapPin size={20} />
            </div>
            <div className="brand-title" style={{ fontSize: '1.2rem' }}>
              Local Resource <span>Map</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-medium)', lineHeight: 1.6 }}>
            A verified community resource directory bridging residents to essential public utilities —
            clean drinking water fountains, phone charging points, emergency shelters, public restrooms,
            urgent health centers, and community facilities.
          </p>
        </div>

        {/* Col 2: Categories */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--navy-dark)' }}>
            Resource Categories
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--slate-light)' }}>
            <li><a href="#directory" onClick={() => onCategoryClick('Drinking Water')}>💧 Drinking Water</a></li>
            <li><a href="#directory" onClick={() => onCategoryClick('Charging Point')}>⚡ Charging Points</a></li>
            <li><a href="#directory" onClick={() => onCategoryClick('Shelter')}>🏠 Emergency Shelters</a></li>
            <li><a href="#directory" onClick={() => onCategoryClick('Public Toilet')}>🚻 Public Restrooms</a></li>
            <li><a href="#directory" onClick={() => onCategoryClick('Hospital / Clinic')}>🏥 Hospitals & Clinics</a></li>
            <li><a href="#directory" onClick={() => onCategoryClick('Community Facility')}>🏛️ Community Centers</a></li>
          </ul>
        </div>

        {/* Col 3: Verification & Integrity */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--navy-dark)' }}>
            Community Verification
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-light)', marginBottom: '12px' }}>
            Every entry tracks its <strong>last verified date</strong>. Items untouched for over 30 days are
            automatically flagged as outdated until a resident confirms their operational status.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
            <Shield size={16} />
            <span>Built with MERN Stack for Community Resilience</span>
          </div>
        </div>
      </div>

      <div className="container footer-copy">
        Local Resource Map &bull; Built with React, Express, Node.js & MongoDB &bull; Public Community Initiative
      </div>
    </footer>
  );
}
