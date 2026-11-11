import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import SearchFilterBar from './components/SearchFilterBar';
import ResourceCard from './components/ResourceCard';
import ResourceDetailModal from './components/ResourceDetailModal';
import AddResourceModal from './components/AddResourceModal';
import ReportIssueModal from './components/ReportIssueModal';
import InteractiveMapPreview from './components/InteractiveMapPreview';
import Footer from './components/Footer';
import {
  fetchResources,
  fetchStats,
  createResource,
  verifyResource,
  upvoteResource,
  submitReport,
} from './services/api';
import {
  MapPin,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Grid,
  Map as MapIcon,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function App() {
  // State
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [outdatedFilter, setOutdatedFilter] = useState('all'); // 'all', 'fresh', 'outdated'
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Modals
  const [selectedResource, setSelectedResource] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reportingResource, setReportingResource] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Load resources
  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sortBy,
        limit: 50,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (outdatedFilter === 'fresh') params.outdated = 'false';
      if (outdatedFilter === 'outdated') params.outdated = 'true';

      const data = await fetchResources(params);
      if (data.success) {
        setResources(data.data);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  }, [search, category, outdatedFilter, sortBy]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadResources();
    }, 250); // Small debounce for search
    return () => clearTimeout(timer);
  }, [loadResources]);

  // Handlers
  const handleVerify = async (id) => {
    try {
      const res = await verifyResource(id);
      if (res.success) {
        showToast('Facility verified! Verification date updated to today.');
        // Update local list
        setResources((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...res.data, isOutdated: false, daysSinceVerification: 0 } : r))
        );
        if (selectedResource && selectedResource._id === id) {
          setSelectedResource({ ...selectedResource, ...res.data, isOutdated: false, daysSinceVerification: 0 });
        }
        loadStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to verify', 'error');
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await upvoteResource(id);
      if (res.success) {
        showToast('Thank you for voting! Marked as helpful.');
        setResources((prev) =>
          prev.map((r) => (r._id === id ? { ...r, upvotes: res.data.upvotes } : r))
        );
        if (selectedResource && selectedResource._id === id) {
          setSelectedResource({ ...selectedResource, upvotes: res.data.upvotes });
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to vote', 'error');
    }
  };

  const handleCreateResource = async (formData) => {
    const res = await createResource(formData);
    if (res.success) {
      showToast(`Resource "${res.data.name}" added successfully!`);
      loadResources();
      loadStats();
    }
  };

  const handleSubmitReport = async (reportData) => {
    const res = await submitReport(reportData);
    if (res.success) {
      showToast('Issue report received. Community volunteers will investigate.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setOutdatedFilter('all');
    setSortBy('newest');
  };

  const handleFilterOutdated = (type) => {
    setOutdatedFilter(type);
    const element = document.getElementById('directory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Toast Alert */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'error' ? (
              <AlertCircle size={20} color="#ef4444" />
            ) : (
              <CheckCircle size={20} color="#10b981" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        stats={stats}
        activeCategory={category}
        onSelectCategory={setCategory}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-pill">
            <span className="dot"></span>
            <span>Real-Time Community Resource Directory</span>
          </div>

          <h1 className="hero-title">
            Locate Essential <span className="highlight">Public Resources</span> &amp; Facilities Near You
          </h1>

          <p className="hero-desc">
            Discover verified public drinking water fountains, phone and EV charging kiosks,
            emergency shelters, hygienic public restrooms, and urgent clinics in your neighborhood.
          </p>

          {/* Search & Filter Bar */}
          <SearchFilterBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            outdatedFilter={outdatedFilter}
            setOutdatedFilter={setOutdatedFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />
        </div>
      </section>

      {/* Stats Summary Banner */}
      <StatsBanner stats={stats} onFilterOutdated={handleFilterOutdated} />

      {/* Directory & Content Section */}
      <main className="container" id="directory">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {category === 'All' ? 'All Community Resources' : `${category} Locations`}
            </h2>
            <p className="section-subtitle">
              Showing {resources.length} {resources.length === 1 ? 'place' : 'places'} &bull; Verified by local residents
            </p>
          </div>

          {/* View Toggles */}
          <div className="view-controls">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
              <span>Card Grid</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <MapIcon size={16} />
              <span>Area Map View</span>
            </button>
          </div>
        </div>

        {/* Interactive Map Preview (when in map view or preview mode) */}
        {viewMode === 'map' && resources.length > 0 && (
          <InteractiveMapPreview
            resources={resources}
            onSelectResource={(res) => setSelectedResource(res)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--slate-medium)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: '#10b981' }} />
            <p style={{ fontWeight: 600 }}>Loading verified community resources...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#991b1b',
              margin: '32px 0',
            }}
          >
            <AlertCircle size={32} style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Failed to load directory</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
            <button className="btn-secondary" onClick={loadResources}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && resources.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <MapPin size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--navy-dark)' }}>
              No resources found matching your search
            </h3>
            <p style={{ color: 'var(--slate-light)', maxWidth: '450px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
              We couldn't find any resources for "{search || category}". Try resetting filters or contribute by submitting a new location!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
              <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={16} />
                <span>Add This Resource</span>
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && resources.length > 0 && (
          <div className="resource-grid">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onSelect={(res) => setSelectedResource(res)}
                onVerify={handleVerify}
                onUpvote={handleUpvote}
                onReport={(res) => setReportingResource(res)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onCategoryClick={(cat) => setCategory(cat)} />

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onVerify={handleVerify}
          onUpvote={handleUpvote}
          onOpenReport={(res) => {
            setSelectedResource(null);
            setReportingResource(res);
          }}
        />
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <AddResourceModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={handleCreateResource}
        />
      )}

      {/* Report Issue Modal */}
      {reportingResource && (
        <ReportIssueModal
          resource={reportingResource}
          onClose={() => setReportingResource(null)}
          onSubmitReport={handleSubmitReport}
        />
      )}
    </div>
  );
}
