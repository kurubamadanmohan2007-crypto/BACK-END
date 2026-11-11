const API_BASE = '/api';

/**
 * Fetch resources with query parameters
 */
export async function fetchResources(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch resources (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch a single resource by ID
 */
export async function fetchResourceById(id) {
  const res = await fetch(`${API_BASE}/resources/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Resource not found');
  }
  return res.json();
}

/**
 * Create a new public resource
 */
export async function createResource(data) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to submit resource');
  }
  return json;
}

/**
 * Verify a resource (updates lastVerifiedAt)
 */
export async function verifyResource(id) {
  const res = await fetch(`${API_BASE}/resources/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to verify resource');
  }
  return json;
}

/**
 * Upvote / mark helpful
 */
export async function upvoteResource(id) {
  const res = await fetch(`${API_BASE}/resources/${id}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to record vote');
  }
  return json;
}

/**
 * Submit an issue report
 */
export async function submitReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to submit report');
  }
  return json;
}

/**
 * Fetch directory stats
 */
export async function fetchStats() {
  const res = await fetch(`${API_BASE}/resources/meta/stats`);
  if (!res.ok) {
    throw new Error('Failed to load stats');
  }
  return res.json();
}
