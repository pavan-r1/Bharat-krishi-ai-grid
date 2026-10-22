import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  PackageOpen
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import claimsService from '../../services/claimsService';

export const MyClaimsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const res = await claimsService.getClaims({
          farmerId: currentUser?.id,
          status: statusFilter,
          search: searchQuery
        });
        setClaims(res.claims || []);
      } catch (err) {
        console.error('Failed to fetch claims:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, [currentUser, statusFilter, searchQuery]);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
              My Insurance Claims
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Track your PMFBY claim filings, risk assessments, and sanction decisions.
          </p>
        </div>

        <Link to="/farmer/submit-claim" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Lodge New Claim</span>
        </Link>
      </div>

      {/* Search and Status Filters */}
      <div 
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem var(--space-lg)'
        }}
      >
        {/* Search */}
        <div className="input-with-icon" style={{ flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Claim ID, crop, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Pills Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { id: 'all', label: 'All Claims' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleStatusChange(item.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: statusFilter === item.id ? 'var(--color-forest-green)' : 'var(--color-surface-white)',
                borderColor: statusFilter === item.id ? 'var(--color-forest-green)' : 'var(--color-border)',
                color: statusFilter === item.id ? 'var(--color-warm-cream)' : 'var(--color-text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Content List / Table */}
      {loading ? (
        <LoadingState message="Fetching your claim records..." />
      ) : claims.length === 0 ? (
        <EmptyState
          title="No claims match your filter"
          description="Try clearing search keywords or selecting 'All Claims' to view historical records."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            handleStatusChange('all');
          }}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Crop & Variety</th>
                <th>Submission Date</th>
                <th>Land Area</th>
                <th>Claimed Amount</th>
                <th>Risk Indicator</th>
                <th>Claim Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
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
                      {claim.crop}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {claim.crop_variety || 'Standard Variety'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Calendar size={14} color="var(--color-text-muted)" />
                      <span>{new Date(claim.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td>
                    <span>{claim.area_hectares} Hectares</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-text-primary)' }}>
                      ₹{parseFloat(claim.claimed_amount).toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    <RiskBadge level={claim.risk_level} score={claim.risk_score} />
                  </td>
                  <td>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/farmer/claims/${claim.claim_id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
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

export default MyClaimsPage;
