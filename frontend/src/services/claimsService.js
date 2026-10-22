import { INITIAL_MOCK_CLAIMS } from '../data/mockClaims';
import apiClient, { IS_MOCK_MODE } from './apiClient';

// Local in-memory session store so user actions (submitting claims, reviewing) persist during the test session
let sessionClaims = [...INITIAL_MOCK_CLAIMS];

export const claimsService = {
  /**
   * Retrieve claims with optional query filters
   */
  async getClaims(filters = {}) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 350));
      let results = [...sessionClaims];

      if (filters.farmerId) {
        results = results.filter(c => c.farmer_id === filters.farmerId);
      }
      if (filters.status && filters.status !== 'all') {
        results = results.filter(c => c.status === filters.status);
      }
      if (filters.crop && filters.crop !== 'all') {
        results = results.filter(c => c.crop.toLowerCase().includes(filters.crop.toLowerCase()));
      }
      if (filters.riskLevel && filters.riskLevel !== 'all') {
        results = results.filter(c => c.risk_level === filters.riskLevel);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(c => 
          c.claim_id.toLowerCase().includes(query) ||
          c.farmer_name.toLowerCase().includes(query) ||
          c.crop.toLowerCase().includes(query) ||
          c.district.toLowerCase().includes(query)
        );
      }

      return {
        count: results.length,
        claims: results
      };
    }

    // Connect to real FastAPI backend
    const response = await apiClient.get('/api/v1/insurance/claims/');
    let claims = response.claims || [];
    if (filters.status && filters.status !== 'all') claims = claims.filter(c => c.status === filters.status);
    if (filters.search) claims = claims.filter(c => `${c.claim_id} ${c.farmer_name} ${c.crop} ${c.district}`.toLowerCase().includes(filters.search.toLowerCase()));
    return { count: claims.length, claims };
  },

  /**
   * Retrieve a single claim by its ID
   */
  async getClaimById(claimId) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const claim = sessionClaims.find(c => c.claim_id === claimId);
      if (!claim) {
        throw new Error(`Claim #${claimId} not found`);
      }
      return claim;
    }

    // In backend, get claim details
    const claim = await apiClient.get(`/api/v1/insurance/claims/${encodeURIComponent(claimId)}`);
    claim.evidence_photos = await Promise.all((claim.evidence_photos || []).map(async photo => {
      if (!photo.url?.startsWith('/api/')) return photo;
      const blob = await apiClient.get(photo.url, { responseType: 'blob' });
      return { ...photo, url: URL.createObjectURL(blob) };
    }));
    return claim;
  },

  async assessClaim(claimId, inputs) {
    if (IS_MOCK_MODE) throw new Error('Risk assessment requires the BKIG backend and its configured model.');
    return apiClient.post(`/api/v1/insurance/claims/${encodeURIComponent(claimId)}/assessment`, inputs);
  },

  /**
   * Submit a new crop insurance claim
   */
  async createClaim(claimData) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 700));

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const newClaimId = `BKIG-CLM-2026-${randomSuffix}`;

      const newClaim = {
        claim_id: newClaimId,
        farmer_name: claimData.farmer_name || 'Rameshwar Patel',
        farmer_id: claimData.farmer_id || 'BKIG-FARMER-001',
        crop: claimData.crop || 'Ragi',
        crop_variety: claimData.crop_variety || 'High Yield Variety',
        district: claimData.district || 'Bengaluru Rural',
        taluk: claimData.taluk || 'Doddaballapur',
        village: claimData.village || 'Local Village',
        survey_number: claimData.survey_number || 'SY-NEW/01',
        area_hectares: parseFloat(claimData.area_hectares) || 2.0,
        claimed_amount: parseFloat(claimData.claimed_amount) || 40000,
        sowing_date: claimData.sowing_date || '2026-06-15',
        incident_date: claimData.incident_date || new Date().toISOString().split('T')[0],
        claim_reason: claimData.claim_reason || 'Crop damage due to unfavorable climatic conditions',
        status: 'submitted',
        created_at: new Date().toISOString(),
        risk_score: null,
        risk_level: null,
        evidence_photos: claimData.evidence_photos || [],
        timeline: [
          {
            status: 'submitted',
            title: 'Claim Submitted (Local Mode)',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            note: 'Claim saved in local browser storage. It has not been sent to the BKIG API.'
          }
        ],
        officer_notes: ''
      };

      // Prepend to session list
      sessionClaims = [newClaim, ...sessionClaims];
      return newClaim;
    }

    // Call real FastAPI backend
    const created = await apiClient.post('/api/v1/insurance/claims/', {
      ...claimData,
      claimed_amount: parseFloat(claimData.claimed_amount),
      area_hectares: parseFloat(claimData.area_hectares),
      // Browser object URLs are previews only; persist safe file metadata until upload storage is configured.
      evidence_photos: []
    });
    created.evidence_photos = [];
    for (const photo of (claimData.evidence_photos || []).filter(item => item.file)) {
      const form = new FormData();
      form.append('file', photo.file, photo.name);
      try {
        const saved = await apiClient.post(`/api/v1/insurance/claims/${encodeURIComponent(created.claim_id)}/evidence`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        created.evidence_photos.push(saved);
      } catch (error) {
        created.evidence_upload_warning = `Claim ${created.claim_id} was created, but an evidence file could not be uploaded: ${error.message}`;
        break;
      }
    }
    return created;
  },

  /**
   * Officer submits an evaluation decision (Approve, Reject, Needs More Info)
   */
  async submitOfficerReview(claimId, { decision, notes }) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const targetIndex = sessionClaims.findIndex(c => c.claim_id === claimId);
      if (targetIndex === -1) {
        throw new Error(`Claim #${claimId} not found`);
      }

      // Map decision to claim status
      let newStatus = decision;
      if (decision === 'needs_more_information') {
        newStatus = 'under_review';
      }

      const updated = {
        ...sessionClaims[targetIndex],
        status: newStatus,
        officer_notes: notes,
        timeline: [
          ...sessionClaims[targetIndex].timeline,
          {
            status: newStatus,
            title: `Officer Decision: ${decision.replace(/_/g, ' ').toUpperCase()}`,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            note: notes || 'Officer review record saved in local browser storage.'
          }
        ]
      };

      sessionClaims[targetIndex] = updated;
      return {
        success: true,
        claim_id: claimId,
        decision,
        message: 'Review saved in local browser storage; no server record was changed.'
      };
    }

    // Call FastAPI backend
    return apiClient.post(`/api/v1/officer/claims/${claimId}/review`, {
      decision,
      notes
    });
  }
};

export default claimsService;
