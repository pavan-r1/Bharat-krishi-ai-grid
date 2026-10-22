import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Maximize2,
  FileText,
  UserCheck
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import RiskBadge from '../../components/common/RiskBadge';
import ClaimTimeline from '../../components/common/ClaimTimeline';
import LoadingState from '../../components/common/LoadingState';
import claimsService from '../../services/claimsService';

export const ClaimDetailsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    async function fetchClaim() {
      setLoading(true);
      try {
        const data = await claimsService.getClaimById(claimId);
        setClaim(data);
      } catch (err) {
        console.error('Failed to load claim detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClaim();
  }, [claimId]);

  if (loading) {
    return <LoadingState message="Retrieving claim dossier..." />;
  }

  if (!claim) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <h2 style={{ color: 'var(--color-status-danger)', marginBottom: '0.5rem' }}>Claim Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          No insurance claim matching #{claimId} was found.
        </p>
        <Link to="/farmer/claims" className="btn btn-primary">
          Back to My Claims
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Top Header & Back Link */}
      <div>
        <div style={{ marginBottom: '0.75rem' }}>
          <Link 
            to="/farmer/claims"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--color-forest-green)', fontWeight: 500 }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Claims</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--color-forest-green)' }}>
                Claim #{claim.claim_id}
              </h1>
              <span className="demo-pill">PMFBY Dossier</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Lodged by {claim.farmer_name} &bull; Sown on {claim.sowing_date}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RiskBadge level={claim.risk_level} score={claim.risk_score} />
            <StatusBadge status={claim.status} />
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-xl)'
        }}
      >
        {/* Left Column: Claim Information & Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Main Information Card */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>
              Crop & Parcel Specifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>CROP & VARIETY</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{claim.crop}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{claim.crop_variety || 'High Yield'}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>AFFECTED LAND AREA</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{claim.area_hectares} Hectares</div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>CLAIMED AMOUNT</span>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-forest-green)' }}>
                  ₹{parseFloat(claim.claimed_amount).toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>SURVEY NUMBER</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{claim.survey_number}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>LOCATION JURISDICTION</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                <MapPin size={16} color="var(--color-terracotta)" />
                <span>{claim.village}, Taluk {claim.taluk}, {claim.district}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>REASON FOR CLAIM</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {claim.claim_reason}
              </p>
            </div>
          </div>

          {/* Evidence Photos Gallery */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
              Crop Photographic Evidence
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Click any photograph to view high-resolution preview.
            </p>

            {claim.evidence_photos && claim.evidence_photos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {claim.evidence_photos.map((photo) => (
                  <div 
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      aspectRatio: '4/3',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    className="card-hover"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption || "Crop evidence"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <Maximize2 size={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                No field photos were attached with this submission.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: AI Telemetry & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Officer Remarks (if any) */}
          {claim.officer_notes && (
            <div className="card" style={{ backgroundColor: 'var(--color-gold-light)', borderColor: 'var(--color-harvest-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <UserCheck size={18} color="var(--color-forest-green)" />
                <h4 style={{ margin: 0, color: 'var(--color-forest-green)', fontSize: '1rem' }}>
                  Assessor / Officer Remarks
                </h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.6 }}>
                "{claim.officer_notes}"
              </p>
            </div>
          )}

          {/* AI Analysis Summary */}
          {claim.ai_assessment && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">AI Risk Assessment</h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    Model {claim.ai_assessment.model_version} &bull; Experimental assessment
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div><strong>Risk score:</strong> {claim.ai_assessment.risk_score}%</div>
                <div><strong>Risk category:</strong> {claim.ai_assessment.risk_category}</div>
                <div>{claim.ai_assessment.disclaimer}</div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                *Final claim decisions require officer review.
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
              Claim Review Progress
            </h3>
            <ClaimTimeline events={claim.timeline} />
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedPhoto && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedPhoto(null)}
          style={{ zIndex: 1100 }}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '800px',
              width: '90%',
              backgroundColor: '#000',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close image preview"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.caption || "Crop Evidence"} 
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            />
            {selectedPhoto.caption && (
              <div style={{ padding: '0.75rem 1rem', color: '#fff', backgroundColor: '#172A21', fontSize: '0.85rem' }}>
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetailsPage;
