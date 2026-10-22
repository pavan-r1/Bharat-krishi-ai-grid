import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  Filter,
  Eye,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Calendar
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import { useAuth } from '../../context/AuthContext';
import claimsService from '../../services/claimsService';

export const OfficerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const res = await claimsService.getClaims();
        setClaims(res.claims || []);
      } catch (err) {
        console.error('Failed to load officer dashboard claims:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  if (loading) {
    return <LoadingState message="Loading officer assessment dashboard..." />;
  }

  const totalClaims = claims.length;
  const underReview = claims.filter(c => c.status === 'under_review' || c.status === 'submitted').length;
  const approved = claims.filter(c => c.status === 'approved').length;
  const rejected = claims.filter(c => c.status === 'rejected').length;
  const highRiskClaims = claims.filter(c => c.risk_level === 'high');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-surface-white)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.65rem', margin: 0, color: 'var(--color-forest-green)' }}>
              Claims Assessment Dashboard
            </h1>
            <span className="demo-pill">Officer Portal</span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Logged in as <strong>{currentUser?.name}</strong> &bull; {currentUser?.designation} ({currentUser?.branch})
          </p>
        </div>

        <Link to="/officer/queue" className="btn btn-primary btn-sm">
          <ClipboardCheck size={16} />
          <span>Open Full Review Queue</span>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-md)'
        }}
      >
        <StatCard
          title="Total Claims Assigned"
          value={totalClaims}
          subtitle="Regional pool"
          icon={FileText}
          colorScheme="blue"
          onClick={() => navigate('/officer/queue')}
        />
        <StatCard
          title="Under Review"
          value={underReview}
          subtitle="Action required"
          icon={Clock}
          colorScheme="gold"
          onClick={() => navigate('/officer/queue?status=under_review')}
        />
        <StatCard
          title="Approved Claims"
          value={approved}
          subtitle="DBT sanctioned"
          icon={CheckCircle2}
          colorScheme="green"
          onClick={() => navigate('/officer/queue?status=approved')}
        />
        <StatCard
          title="Rejected / Disputed"
          value={rejected}
          subtitle="Audit failed"
          icon={XCircle}
          colorScheme="terracotta"
          onClick={() => navigate('/officer/queue?status=rejected')}
        />
      </div>

      {/* High-Risk Telemetry Alert Callout */}
      {highRiskClaims.length > 0 && (
        <div 
          style={{
            backgroundColor: 'var(--color-status-danger-bg)',
            border: '1px solid var(--color-status-danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FADCDA',
            color: 'var(--color-status-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, color: 'var(--color-status-danger)', fontSize: '1rem' }}>
                Attention: {highRiskClaims.length} Claim(s) Flagged for Physical Ground Verification
              </h4>
              <span className="demo-pill">Experimental model signal</span>
            </div>
            <p style={{ margin: '4px 0 0.75rem 0', fontSize: '0.86rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              Random Forest telemetry identified spectral reflectance inconsistencies or weather station precipitation discrepancies. Human physical inspection is mandatory before decision entry.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {highRiskClaims.map(c => (
                <Link 
                  key={c.claim_id}
                  to={`/officer/claims/${c.claim_id}`}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  <span>Audit {c.claim_id} ({c.crop})</span>
                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Queue Preview Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-white)' }}>
          <div>
            <h3 className="card-title">Priority Assessment Queue</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Claims awaiting telemetry inspection and sanction decision
            </span>
          </div>
          <Link to="/officer/queue" className="btn btn-secondary btn-sm">
            <span>View All ({totalClaims})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Farmer Name</th>
                <th>Crop & District</th>
                <th>Submission Date</th>
                <th>Claimed Amount</th>
                <th>AI Risk Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.slice(0, 5).map((claim) => (
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
                      ID: {claim.farmer_id}
                    </div>
                  </td>
                  <td>
                    <div>{claim.crop}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {claim.district}
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
                      <span>Review Claim</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
