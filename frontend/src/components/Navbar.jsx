import React from 'react';
import { MapPin, PlusCircle, Compass, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAddModal, stats, activeCategory, onSelectCategory }) {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <div className="brand" onClick={() => onSelectCategory('All')}>
          <div className="brand-icon">
            <MapPin size={24} />
          </div>
          <div>
            <div className="brand-title">
              Local Resource <span>Map</span>
            </div>
            <div className="brand-subtitle">
              Public Community Directory & Verification
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button
            className="btn-primary"
            onClick={onOpenAddModal}
            title="Submit a newly discovered public facility"
          >
            <PlusCircle size={18} />
            <span>Add Resource</span>
          </button>
        </div>
      </div>
    </header>
  );
}
