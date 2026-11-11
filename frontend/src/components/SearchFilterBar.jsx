import React from 'react';
import {
  Search,
  MapPin,
  Filter,
  RotateCcw,
  Droplets,
  Zap,
  Home,
  Bath,
  HeartPulse,
  Users,
  Utensils,
  Wifi,
  Sparkles,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export const CATEGORY_ICONS = {
  'Drinking Water': Droplets,
  'Charging Point': Zap,
  'Shelter': Home,
  'Public Toilet': Bath,
  'Hospital / Clinic': HeartPulse,
  'Community Facility': Users,
  'Food Bank': Utensils,
  'Wi-Fi Zone': Wifi,
};

export const CATEGORIES = [
  'All',
  'Drinking Water',
  'Charging Point',
  'Shelter',
  'Public Toilet',
  'Hospital / Clinic',
  'Community Facility',
  'Food Bank',
  'Wi-Fi Zone',
];

export default function SearchFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  outdatedFilter,
  setOutdatedFilter,
  sortBy,
  setSortBy,
  onReset,
}) {
  return (
    <div className="search-filter-card">
      <div className="search-inputs-row">
        {/* Search Input */}
        <div className="input-group">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, address, facility keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Verification Status Filter */}
        <div className="input-group">
          <Filter size={18} className="input-icon" />
          <select
            className="select-input"
            value={outdatedFilter}
            onChange={(e) => setOutdatedFilter(e.target.value)}
          >
            <option value="all">Verification: All Resources</option>
            <option value="fresh">✅ Verified Fresh (&le;30 Days)</option>
            <option value="outdated">⚠️ Flagged Outdated (&gt;30 Days)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="input-group">
          <Sparkles size={18} className="input-icon" />
          <select
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Recently Added</option>
            <option value="popular">Sort: Most Helpful / Upvoted</option>
            <option value="verified">Sort: Recently Verified</option>
            <option value="name">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          className="btn-filter-reset"
          onClick={onReset}
          title="Reset all filters"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="category-chips-row">
        {CATEGORIES.map((cat) => {
          const Icon = cat === 'All' ? Sparkles : CATEGORY_ICONS[cat] || MapPin;
          const isActive = category === cat;

          return (
            <button
              key={cat}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              <Icon size={15} />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
