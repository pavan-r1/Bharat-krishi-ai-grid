import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  PlusCircle, 
  TrendingUp, 
  ScrollText, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import claimsService from '../../services/claimsService';
import mandiService from '../../services/mandiService';
import schemesService from '../../services/schemesService';
import { MOCK_FARMER_WEATHER } from '../../data/mockDashboard';
import { IS_MOCK_MODE } from '../../services/apiClient';

export const FarmerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [mandiSnapshot, setMandiSnapshot] = useState(null);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);

  useEffect(() => {
    async function loadFarmerData() {
      setLoading(true);
      try {
        const [claimsRes, mandiRes, schemesRes] = await Promise.all([
          claimsService.getClaims({ farmerId: currentUser?.id }),
          mandiService.getCommodityPrices('Ragi (Finger Millet)'),
          schemesService.getSchemes({ category: 'Insurance' })
        ]);
        setClaims(claimsRes.claims || []);
        setMandiSnapshot(mandiRes);
        setRecommendedSchemes(schemesRes.slice(0, 2));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmerData();
  }, [currentUser]);

  if (loading) {
    return <LoadingState message="Loading your farm intelligence overview..." />;
  }

  const totalClaims = claims.length;
  const underReviewCount = claims.filter(c => c.status === 'under_review' || c.status === 'submitted').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Welcome & Quick Action Header */}
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
              Kisan Overview &bull; {currentUser?.name || 'Farmer'}
            </h1>
            {IS_MOCK_MODE && <span className="demo-pill">Sample Data</span>}
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Parcel Location: {currentUser?.village}, {currentUser?.taluk}, {currentUser?.district} &bull; Landholding: {currentUser?.landArea}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/farmer/submit-claim" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Submit New Claim</span>
          </Link>
          <Link to="/farmer/mandi-prices" className="btn btn-secondary btn-sm">
            <TrendingUp size={16} />
            <span>Check Mandi Prices</span>
          </Link>
          <Link to="/farmer/schemes" className="btn btn-secondary btn-sm">
            <ScrollText size={16} />
            <span>Find Schemes</span>
          </Link>
        </div>
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
          title="Total Claims Filed"
          value={totalClaims}
          subtitle="Lifetime PMFBY submissions"
          icon={FileText}
          colorScheme="blue"
          onClick={() => navigate('/farmer/claims')}
        />
        <StatCard
          title="Under Review"
          value={underReviewCount}
          subtitle="Pending field or satellite audit"
          icon={Clock}
          colorScheme="gold"
          onClick={() => navigate('/farmer/claims?status=under_review')}
        />
        <StatCard
          title="Approved Claims"
          value={approvedCount}
          subtitle="Settlement sanctioned"
          icon={CheckCircle2}
          colorScheme="green"
          onClick={() => navigate('/farmer/claims?status=approved')}
        />
        <StatCard
          title="Current Season"
          value="Kharif 2026"
          subtitle="Cutoff: 30 Nov 2026"
          icon={Calendar}
          colorScheme="terracotta"
        />
      </div>

      {/* Grid: Left Column (Recent Claims & Status), Right Column (Market & Schemes) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-xl)'
        }}
      >
        {/* Left Column: Recent Claims with Status Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Insurance Claims</h3>
              <Link to="/farmer/claims" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
                View All Claims &rarr;
              </Link>
            </div>

            {claims.length === 0 ? (
              <EmptyState 
                title="No insurance claims filed yet"
                description="If your crops have suffered loss due to drought, unseasonal rainfall, or pests, submit a PMFBY claim."
                actionLabel="Submit First Claim"
                onAction={() => navigate('/farmer/submit-claim')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {claims.slice(0, 3).map((claim) => (
                  <div 
                    key={claim.claim_id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      backgroundColor: 'var(--color-surface-white)',
                      transition: 'all 0.2s ease'
                    }}
                    className="card-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-forest-green)' }}>
                        {claim.claim_id}
                      </span>
                      <StatusBadge status={claim.status} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {claim.crop} ({claim.area_hectares} Ha)
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        ₹{claim.claimed_amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {claim.claim_reason}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '6px', borderTop: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Submitted {new Date(claim.created_at).toLocaleDateString('en-GB')}
                      </span>
                      <Link 
                        to={`/farmer/claims/${claim.claim_id}`}
                        style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-forest-green)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weather & Soil Advisory Card */}
          {IS_MOCK_MODE && <div className="card" style={{ backgroundColor: 'var(--color-sage-light)', borderColor: 'var(--color-sage-green)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span className="demo-pill">Sample local advisory</span>
                <h4 style={{ color: 'var(--color-forest-green)', fontSize: '1.1rem', marginTop: '6px', marginBottom: '4px' }}>
                  Weather & Soil Telemetry
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', margin: 0 }}>
                  {MOCK_FARMER_WEATHER.location} &bull; Humidity: {MOCK_FARMER_WEATHER.humidity}
                </p>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-forest-green)' }}>
                {MOCK_FARMER_WEATHER.temperature}
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem', marginBottom: 0 }}>
              <strong>Advisory:</strong> {MOCK_FARMER_WEATHER.forecast}. Precipitation probability currently at {MOCK_FARMER_WEATHER.precipitationRisk}.
            </p>
          </div>}
        </div>

        {/* Right Column: Mandi Snapshot & Recommended Schemes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Mandi Snapshot Card */}
          {mandiSnapshot?.summary?.modalPrice != null && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Mandi Price Snapshot</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {mandiSnapshot.isSampleData ? 'Sample fixture data' : mandiSnapshot.source}
                  </span>
                </div>
                <Link to="/farmer/mandi-prices" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
                  Full Trends &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--color-ivory-bg)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    {mandiSnapshot.commodity}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-forest-green)', fontFamily: 'var(--font-heading)' }}>
                    ₹{mandiSnapshot.summary.modalPrice.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/ Quintal</span>
                  </div>
                </div>
                <span className="badge badge-success">
                  {mandiSnapshot.summary.change7d} this week
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                <span>Min: ₹{mandiSnapshot.summary.minPrice}</span>
                <span>Max: ₹{mandiSnapshot.summary.maxPrice}</span>
                <span>Arrivals: 185 Tonnes</span>
              </div>

              <Link to="/farmer/mandi-prices" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <span>Compare Nearby Mandis</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Recommended Schemes Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recommended Schemes</h3>
              <Link to="/farmer/schemes" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
                Explore All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendedSchemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    backgroundColor: 'var(--color-surface-white)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-forest-green)' }}>
                      {scheme.title}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                      {scheme.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '4px 0 8px 0', lineHeight: 1.5 }}>
                    {scheme.summary}
                  </p>
                  <Link 
                    to="/farmer/schemes" 
                    style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-terracotta)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Check Eligibility Details</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
