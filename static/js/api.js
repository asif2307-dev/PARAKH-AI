/**
 * PARAKH AI - API Client
 * Facilitates asynchronous interaction with FastAPI backend.
 */

const API_BASE = '/api';

const api = {
  // Authentication
  async login(username, password, role = 'officer') {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return await res.json();
  },

  // Bids List
  async getBids(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.risk && params.risk !== 'All') query.append('risk', params.risk);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/bids?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load bids list');
    return await res.json();
  },

  // Bid Detail
  async getBidDetail(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}`);
    if (!res.ok) throw new Error(`Failed to load bid ${bidId}`);
    return await res.json();
  },

  // Analyze Bid (AI OCR + Deterministic Evaluation)
  async analyzeBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Analysis failed for bid ${bidId}`);
    return await res.json();
  },

  // Evidence Mapping
  async getEvidenceMapping(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/evidence-mapping`);
    if (!res.ok) throw new Error(`Failed to load evidence mapping for ${bidId}`);
    return await res.json();
  },

  // Trigger Multi-Source Verification
  async verifyBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Verification failed for ${bidId}`);
    return await res.json();
  },

  // Submit Officer Decision
  async submitOfficerDecision(bidId, decisionData) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisionData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit officer decision');
    }
    return await res.json();
  },

  // Audit Trail
  async getAuditTrail(bidId = null) {
    const url = bidId ? `${API_BASE}/audit-trail?bid_id=${bidId}` : `${API_BASE}/audit-trail`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load audit trail');
    return await res.json();
  },

  // Connectors
  async getConnectors() {
    const res = await fetch(`${API_BASE}/connectors`);
    if (!res.ok) throw new Error('Failed to load connectors');
    return await res.json();
  },

  // Test Connector
  async testConnector(connectorId) {
    const res = await fetch(`${API_BASE}/connectors/${connectorId}/test`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to test connector ${connectorId}`);
    return await res.json();
  },

  // Reset Single Bid to pristine demo state
  async resetBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset bid state');
    return await res.json();
  },

  // Reset entire Demo DB
  async resetDemo() {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo dataset');
    return await res.json();
  }
};

window.api = api;
