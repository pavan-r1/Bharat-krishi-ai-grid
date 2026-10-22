import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  Calendar, 
  Eye, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import claimsService from '../../services/claimsService';

export const ReviewQueuePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState(searchParams.get('risk') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('risk_desc'); // risk_desc, risk_asc, date_desc, date_asc

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const res = await claimsService.getClaims({
          crop: cropFilter,
          riskLevel: riskFilter,
          status: statusFilter,
          search: searchQuery
        });

        let list = res.claims || [];

        // Apply sorting
        if (sortBy === 'risk_desc') {
          list.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));
        } else if (sortBy === 'risk_asc') {
          list.sort((a, b) => (a.risk_score || 0) - (b.risk_score || 0));
        } else if (sortBy === 'date_desc') {
          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'date_asc') {
          list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        setClaims(list);
      } catch (err) {
        console.error('Failed to load review queue:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, [cropFilter, riskFilter, statusFilter, searchQuery, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setCropFilter('all');
    setRiskFilter('all');
    setStatusFilter('all');
    setSortBy('risk_desc');
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Insurance Claims Review Queue
          </h1>
          <span className="demo-pill">All District Filings</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Assess crop insurance claim filings, verify NDVI vegetation anomalies, and record sanction decisions.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div 
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-md)',
          alignItems: 'end',
          padding: 'var(--space-lg)'
        }}
      >
        {/* Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="queue-search">Search Claim / Farmer</label>
          <div className="input-with-icon">
            <Search size={16} className="input-icon-left" />
            <input
              id="queue-search"
              type="text"
              className="form-input"
              placeholder="Search Claim ID or Farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Risk Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="queue-risk">Risk Assessment Level</label>
          <select 
            id="queue-risk" 
            className="form-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk Flagged</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk Verified</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="queue-status">Workflow Status</label>
          <select 
            id="queue-status" 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="queue-sort">Sort Priority</label>
          <select 
            id="queue-sort" 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="risk_desc">Risk Score: High to Low</option>
            <option value="risk_asc">Risk Score: Low to High</option>
            <option value="date_desc">Submission: Newest First</option>
            <option value="date_asc">Submission: Oldest First</option>
          </select>
        </div>

        {/* Reset */}
        <div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleReset}
            style={{ width: '100%' }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Queue Table */}
      {loading ? (
        <LoadingState message="Loading claims review queue..." />
      ) : claims.length === 0 ? (
        <EmptyState
          title="No claims match current queue filters"
          description="Clear filters to inspect all claims awaiting PMFBY review."
          actionLabel="Reset Queue Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Farmer Name & ID</th>
                <th>Crop & District</th>
                <th>Submission Date</th>
                <th>Claimed Amount</th>
                <th>AI Risk Score</th>
                <th>Workflow Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claim_id}>
                  <td>
                    <strong style={{ color: 'var(--color-forest-green)' }}>
                      {claim.claim_id}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {claim.farmer_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {claim.farmer_id}
                    </div>
                  </td>
                  <td>
                    <div>{claim.crop}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {claim.district} ({claim.area_hectares} Ha)
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                      <Calendar size={13} color="var(--color-text-muted)" />
                      <span>{new Date(claim.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                  </td>
                  <td>
                    <strong>₹{parseFloat(claim.claimed_amount).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <RiskBadge level={claim.risk_level} score={claim.risk_score} />
                  </td>
                  <td>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/officer/claims/${claim.claim_id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye size={14} />
                      <span>Audit & Decide</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewQueuePage;
