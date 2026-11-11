import React from 'react';
import { Layers, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

export default function StatsBanner({ stats, onFilterOutdated }) {
  if (!stats) return null;

  return (
    <div className="container stats-banner">
      <div className="stats-grid">
        {/* Total Directory Resources */}
        <div className="stat-card" onClick={() => onFilterOutdated('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper blue">
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.total || 0}</div>
            <div className="stat-label">Total Public Resources</div>
          </div>
        </div>

        {/* Recently Verified */}
        <div className="stat-card" onClick={() => onFilterOutdated('fresh')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper green">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.verifiedRecently || 0}</div>
            <div className="stat-label">Verified Active (Last 30 Days)</div>
          </div>
        </div>

        {/* Potentially Outdated */}
        <div
          className="stat-card"
          onClick={() => onFilterOutdated('outdated')}
          style={{ cursor: 'pointer', borderColor: stats.flaggedOutdated > 0 ? '#fde68a' : 'inherit' }}
          title="Click to view resources that need community verification"
        >
          <div className="stat-icon-wrapper amber">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.flaggedOutdated || 0}</div>
            <div className="stat-label">Flagged Outdated (&gt;30 Days)</div>
          </div>
        </div>

        {/* Active & Accessible */}
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.activeCount || 0}</div>
            <div className="stat-label">Accessible Facilities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
