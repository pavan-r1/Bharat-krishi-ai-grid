import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import Stepper from '../../components/common/Stepper';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import claimsService from '../../services/claimsService';

export const SubmitClaimPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [stepError, setStepError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Crop Details
    crop: 'Ragi (Finger Millet)',
    crop_variety: 'GPU-28 High Yield',
    sowing_date: '2026-06-15',
    incident_date: '2026-09-22',
    expected_yield: '18 Quintals / Ha',
    area_hectares: '2.5',
    claimed_amount: '45000',
    claim_reason: 'Severe localized drought and dry spell during the flowering stage leading to vegetative withering.',

    // Step 2: Land and Location
    state: currentUser?.state || 'Karnataka',
    district: currentUser?.district || 'Bengaluru Rural',
    taluk: currentUser?.taluk || 'Doddaballapur',
    village: currentUser?.village || 'Rajankunte',
    survey_number: 'SY-142/3B',
    coordinates: '',

    // Step 3: Evidence Photos (Simulated uploads with client-side preview)
    evidence_photos: []
  });

  useEffect(() => {
    const location = currentUser?.device_location;
    if (!location) return;
    setFormData(previous => ({
      ...previous,
      coordinates: `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`,
    }));
  }, [currentUser?.device_location]);

  const steps = [
    { title: 'Crop Details' },
    { title: 'Land & Location' },
    { title: 'Evidence Photos' },
    { title: 'Review & Submit' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setStepError('');
  };

  // Image Upload handler (supports drag or click, validates size & format)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setStepError('Please upload only valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStepError(`File ${file.name} exceeds maximum 5MB size limit.`);
        return;
      }

      // Create preview object URL
      const previewUrl = URL.createObjectURL(file);
      const newPhoto = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        url: previewUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        file
      };

      setFormData(prev => ({
        ...prev,
        evidence_photos: [...prev.evidence_photos, newPhoto]
      }));
    }
    setStepError('');
  };

  const handleRemovePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      evidence_photos: prev.evidence_photos.filter(p => p.id !== photoId)
    }));
  };

  // Step Validation before progressing
  const validateStep = (stepIndex) => {
    if (stepIndex === 0) {
      if (!formData.crop || !formData.sowing_date || !formData.area_hectares || !formData.claimed_amount || !formData.claim_reason) {
        setStepError('Please fill in all mandatory crop details and loss description.');
        return false;
      }
      if (parseFloat(formData.area_hectares) <= 0 || parseFloat(formData.claimed_amount) <= 0) {
        setStepError('Area and claimed amount must be positive numbers.');
        return false;
      }
    } else if (stepIndex === 1) {
      if (!formData.state || !formData.district || !formData.taluk || !formData.village || !formData.survey_number) {
        setStepError('Please provide complete revenue village and survey plot references.');
        return false;
      }
    } else if (stepIndex === 2) {
      // Evidence warning if no photos attached
      if (formData.evidence_photos.length === 0) {
        setStepError('Attaching at least one photographic evidence helps accelerate assessment.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setStepError('');
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        farmer_name: currentUser?.name || 'Rameshwar Patel',
        farmer_id: currentUser?.id || 'BKIG-FARMER-001',
        crop: formData.crop,
        crop_variety: formData.crop_variety,
        district: formData.district,
        taluk: formData.taluk,
        village: formData.village,
        survey_number: formData.survey_number,
        area_hectares: formData.area_hectares,
        claimed_amount: formData.claimed_amount,
        sowing_date: formData.sowing_date,
        incident_date: formData.incident_date,
        claim_reason: formData.claim_reason,
        evidence_photos: formData.evidence_photos
      };

      const created = await claimsService.createClaim(payload);
      setShowConfirmModal(false);
      setSubmissionSuccess(created);
    } catch (err) {
      setStepError(err.message || 'Error submitting claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: 'var(--space-2xl) auto', textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-status-success-bg)',
          color: 'var(--color-status-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-md)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-forest-green)', marginBottom: '0.5rem' }}>
          Claim Successfully Submitted!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Your PMFBY crop insurance claim has been logged into the Bharat Krishi Intelligence Grid.
        </p>
        {submissionSuccess.evidence_upload_warning && <p role="alert" style={{ color: 'var(--color-status-danger)' }}>{submissionSuccess.evidence_upload_warning}</p>}

        <div style={{
          backgroundColor: 'var(--color-ivory-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Claim Reference ID:</span>
            <strong style={{ color: 'var(--color-forest-green)' }}>{submissionSuccess.claim_id}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Crop & Area:</span>
            <span>{submissionSuccess.crop} ({submissionSuccess.area_hectares} Ha)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Claimed Amount:</span>
            <span>₹{parseFloat(submissionSuccess.claimed_amount).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Status:</span>
            <span className="badge badge-submitted">Submitted (Queued for Audit)</span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--color-gold-light)',
          border: '1px solid var(--color-harvest-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          fontSize: '0.82rem',
          color: 'var(--color-text-primary)',
          marginBottom: '1.5rem'
        }}>
          <strong>Local record:</strong> This claim is saved in this browser. Connect to the BKIG API to persist claims and upload evidence.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/farmer/dashboard')}
          >
            Go to Dashboard
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => navigate(`/farmer/claims/${submissionSuccess.claim_id}`)}
          >
            <span>Track Claim Progress</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Page Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Submit Crop Insurance Claim
          </h1>
          <span className="demo-pill">PMFBY Form</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Provide crop loss specifics and geotagged photographic evidence to initiate verification.
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step Error Notice */}
      {stepError && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-status-danger-bg)',
            border: '1px solid var(--color-status-danger-border)',
            color: 'var(--color-status-danger)',
            fontSize: '0.88rem'
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{stepError}</span>
        </div>
      )}

      {/* Multi-step Form Container */}
      <div className="card" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', backgroundColor: 'var(--color-warm-cream)' }}>
        {/* Step 1: Crop Details */}
        {currentStep === 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest-green)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
              Step 1: Crop & Damage Details
            </h3>

            <div className="grid grid-cols-2 gap-md">
              <div className="form-group">
                <label className="form-label" htmlFor="crop-select">
                  Crop Type <span className="required">*</span>
                </label>
                <select
                  id="crop-select"
                  className="form-select"
                  value={formData.crop}
                  onChange={(e) => handleInputChange('crop', e.target.value)}
                >
                  <option value="Ragi (Finger Millet)">Ragi (Finger Millet)</option>
                  <option value="Maize (Corn)">Maize (Corn)</option>
                  <option value="Paddy (Dhan)">Paddy (Dhan)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="crop-variety">
                  Crop Variety
                </label>
                <input
                  id="crop-variety"
                  type="text"
                  className="form-input"
                  placeholder="e.g. GPU-28 High Yield"
                  value={formData.crop_variety}
                  onChange={(e) => handleInputChange('crop_variety', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sowing-date">
                  Sowing Date <span className="required">*</span>
                </label>
                <input
                  id="sowing-date"
                  type="date"
                  className="form-input"
                  value={formData.sowing_date}
                  onChange={(e) => handleInputChange('sowing_date', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="incident-date">
                  Date of Loss Event <span className="required">*</span>
                </label>
                <input
                  id="incident-date"
                  type="date"
                  className="form-input"
                  value={formData.incident_date}
                  onChange={(e) => handleInputChange('incident_date', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="area-hectares">
                  Affected Land Area (Hectares) <span className="required">*</span>
                </label>
                <input
                  id="area-hectares"
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-input"
                  placeholder="e.g. 2.5"
                  value={formData.area_hectares}
                  onChange={(e) => handleInputChange('area_hectares', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="claimed-amount">
                  Estimated Loss Amount (₹) <span className="required">*</span>
                </label>
                <input
                  id="claimed-amount"
                  type="number"
                  step="500"
                  min="1000"
                  className="form-input"
                  placeholder="e.g. 45000"
                  value={formData.claimed_amount}
                  onChange={(e) => handleInputChange('claimed_amount', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="claim-reason">
                Loss Description & Cause <span className="required">*</span>
              </label>
              <textarea
                id="claim-reason"
                className="form-textarea"
                rows={3}
                placeholder="Explain the climatic factor or pest event that caused crop failure..."
                value={formData.claim_reason}
                onChange={(e) => handleInputChange('claim_reason', e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Land and Location */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest-green)', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
              Step 2: Land Cadastral & Geographic Coordinates
            </h3>

            <div className="grid grid-cols-2 gap-md">
              <div className="form-group">
                <label className="form-label" htmlFor="state-input">
                  State <span className="required">*</span>
                </label>
                <input
                  id="state-input"
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="district-input">
                  District <span className="required">*</span>
                </label>
                <input
                  id="district-input"
                  type="text"
                  className="form-input"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="taluk-input">
                  Taluk / Block <span className="required">*</span>
                </label>
                <input
                  id="taluk-input"
                  type="text"
                  className="form-input"
                  value={formData.taluk}
                  onChange={(e) => handleInputChange('taluk', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="village-input">
                  Revenue Village <span className="required">*</span>
                </label>
                <input
                  id="village-input"
                  type="text"
                  className="form-input"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="survey-num">
                  Land Survey / Cadastral Plot Number <span className="required">*</span>
                </label>
                <input
                  id="survey-num"
                  type="text"
                  className="form-input"
                  placeholder="e.g. SY-142/3B"
                  value={formData.survey_number}
                  onChange={(e) => handleInputChange('survey_number', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gps-coords">
                  Device GPS Location (Optional)
                </label>
                <input
                  id="gps-coords"
                  type="text"
                  className="form-input"
                  placeholder="Not shared from this device"
                  value={formData.coordinates}
                  readOnly
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Shared with claim officers only when you allow location access after sign-in.</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-sage-light)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-forest-green)' }}>
              <MapPin size={18} />
              <span>Survey number references are matched against state land registries during the automated officer review.</span>
            </div>
          </div>
        )}

        {/* Step 3: Evidence Photos */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest-green)', marginBottom: '0.5rem' }}>
              Step 3: Crop Damage Photographs
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Upload clear field photographs highlighting withered vegetative shoots, pest signs, or lodging.
            </p>

            {/* Upload Dropzone */}
            <label 
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2xl) var(--space-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--color-surface-white)',
                marginBottom: '1.5rem',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-forest-green)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <input 
                type="file" 
                multiple 
                accept="image/jpeg,image/png,image/webp" 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
              />
              <UploadCloud size={40} color="var(--color-forest-green)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                Click to browse or drop crop loss photos here
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Supports JPG, PNG, WebP (Max 5MB per file)
              </div>
            </label>

            {/* Client-side Image Previews */}
            {formData.evidence_photos.length > 0 && (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
                  Selected Evidence Photos ({formData.evidence_photos.length})
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {formData.evidence_photos.map((photo) => (
                    <div 
                      key={photo.id}
                      style={{
                        position: 'relative',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-surface-white)'
                      }}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.name || "Evidence"} 
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        aria-label="Remove image"
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          backgroundColor: 'rgba(0,0,0,0.65)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                      <div style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {photo.name || 'Crop photo'} &bull; {photo.size}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Honest Demo Disclaimer */}
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: 'var(--color-gold-light)',
              border: '1px solid var(--color-harvest-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--color-text-primary)'
            }}>
              <strong>Evidence handling:</strong> Files are uploaded to private backend storage when the claim is submitted and can be viewed by you and authorized officers.
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest-green)', marginBottom: '0.5rem' }}>
              Step 4: Review Your Claim Dossier
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Verify all entered information before lodging your official submission.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Summary Block 1 */}
              <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-forest-green)' }}>Crop & Loss Details</span>
                  <button type="button" onClick={() => setCurrentStep(0)} style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>Edit</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div><strong>Crop:</strong> {formData.crop} ({formData.crop_variety})</div>
                  <div><strong>Sown On:</strong> {formData.sowing_date}</div>
                  <div><strong>Loss Date:</strong> {formData.incident_date}</div>
                  <div><strong>Affected Area:</strong> {formData.area_hectares} Hectares</div>
                  <div><strong>Claimed Amount:</strong> ₹{parseFloat(formData.claimed_amount).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <strong>Cause:</strong> {formData.claim_reason}
                </div>
              </div>

              {/* Summary Block 2 */}
              <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-forest-green)' }}>Land & Plot Reference</span>
                  <button type="button" onClick={() => setCurrentStep(1)} style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>Edit</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div><strong>Village:</strong> {formData.village}</div>
                  <div><strong>Taluk:</strong> {formData.taluk}</div>
                  <div><strong>District:</strong> {formData.district}, {formData.state}</div>
                  <div><strong>Survey Plot:</strong> {formData.survey_number}</div>
                  <div><strong>Coordinates:</strong> {formData.coordinates}</div>
                </div>
              </div>

              {/* Summary Block 3 */}
              <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-forest-green)' }}>Attached Photographs</span>
                  <button type="button" onClick={() => setCurrentStep(2)} style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>Edit</button>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {formData.evidence_photos.length} photo(s) selected for upload and officer review. No satellite analysis is connected.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xl)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-subtle)' }}>
          {currentStep > 0 ? (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleBack}
            >
              <ArrowLeft size={16} />
              <span>Previous Step</span>
            </button>
          ) : <div />}

          {currentStep < steps.length - 1 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleNext}
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-gold"
              onClick={() => setShowConfirmModal(true)}
            >
              <Check size={16} />
              <span>Submit Insurance Claim</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Claim Lodgement"
        description={`Are you sure you want to lodge this PMFBY crop insurance claim for ₹${parseFloat(formData.claimed_amount || 0).toLocaleString('en-IN')} covering ${formData.area_hectares} Ha of ${formData.crop}?`}
        confirmLabel="Yes, Submit Claim"
        cancelLabel="Review Information"
        variant="primary"
        isSubmitting={isSubmitting}
        onConfirm={handleFinalSubmit}
        onCancel={() => setShowConfirmModal(false)}
      >
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          Your claim and attached evidence will be saved to the configured backend. Any risk assessment is experimental and requires explicit assessment inputs.
        </div>
      </ConfirmModal>
    </div>
  );
};

export default SubmitClaimPage;
