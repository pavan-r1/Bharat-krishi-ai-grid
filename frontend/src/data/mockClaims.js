/**
 * Mock Insurance Claims Data
 * Conforms to both the FastAPI backend schema and BKIG frontend interface specifications.
 * All records are marked as demonstration data.
 */

export const INITIAL_MOCK_CLAIMS = [
  {
    claim_id: "BKIG-CLM-2026-081",
    farmer_name: "Rameshwar Patel",
    farmer_id: "BKIG-FARMER-001",
    crop: "Ragi (Finger Millet)",
    crop_variety: "GPU-28 High Yield",
    district: "Bengaluru Rural",
    taluk: "Doddaballapur",
    village: "Rajankunte",
    survey_number: "SY-142/3B",
    area_hectares: 2.5,
    claimed_amount: 45000,
    sowing_date: "2026-06-15",
    incident_date: "2026-09-22",
    claim_reason: "Severe localized drought and dry spell during the flowering stage leading to vegetative withering.",
    status: "under_review", // submitted, under_review, approved, rejected, needs_more_information
    created_at: "2026-09-28T10:14:00Z",
    risk_score: 28, // 0 to 100
    risk_level: "low", // low, medium, high
    ai_assessment: {
      model_version: "BKIG-RF-v1.4",
      prediction_date: "2026-09-29T14:30:00Z",
      rainfall_deficit: "38% below 10-year block average",
      ndvi_vegetation_index: "0.24 (abnormally low for September)",
      weather_satellite_match: "High correlation (91%) with IMD radar precipitation anomaly",
      inconsistencies: []
    },
    evidence_photos: [
      {
        id: "ev-1",
        caption: "Parched Ragi field showing stunted flowering panicles",
        url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
        uploaded_at: "2026-09-28T10:15:00Z"
      },
      {
        id: "ev-2",
        caption: "Soil cracking and withered vegetative shoot",
        url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
        uploaded_at: "2026-09-28T10:15:00Z"
      }
    ],
    timeline: [
      { status: "submitted", title: "Claim Submitted", date: "28 Sep 2026, 10:14 AM", note: "Submitted via BKIG Farmer Portal with 2 geolocated crop photos." },
      { status: "under_review", title: "Assigned for Field Review", date: "29 Sep 2026, 02:30 PM", note: "Automated satellite NDVI verification and IMD weather correlation completed." }
    ],
    officer_notes: "Satellite telemetry confirms precipitation deficit in Doddaballapur taluk. Scheduled for final assessment signature."
  },
  {
    claim_id: "BKIG-CLM-2026-074",
    farmer_name: "Rameshwar Patel",
    farmer_id: "BKIG-FARMER-001",
    crop: "Maize (Corn)",
    crop_variety: "DHM-117 Hybrid",
    district: "Bengaluru Rural",
    taluk: "Doddaballapur",
    village: "Rajankunte",
    survey_number: "SY-142/3A",
    area_hectares: 1.7,
    claimed_amount: 32000,
    sowing_date: "2026-05-10",
    incident_date: "2026-07-18",
    claim_reason: "Sudden hailstorm and pest lodging damage destroying early grain filling.",
    status: "approved",
    created_at: "2026-07-22T08:30:00Z",
    risk_score: 18,
    risk_level: "low",
    ai_assessment: {
      model_version: "BKIG-RF-v1.4",
      prediction_date: "2026-07-23T11:00:00Z",
      rainfall_deficit: "Normal rainfall, localized squall detected",
      ndvi_vegetation_index: "0.31 (drop following hailstorm event)",
      weather_satellite_match: "Hailstorm event confirmed by regional Doppler radar",
      inconsistencies: []
    },
    evidence_photos: [
      {
        id: "ev-3",
        caption: "Lodged maize stalks post-hailstorm",
        url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
        uploaded_at: "2026-07-22T08:35:00Z"
      }
    ],
    timeline: [
      { status: "submitted", title: "Claim Submitted", date: "22 Jul 2026, 08:30 AM", note: "Claim received." },
      { status: "under_review", title: "Risk Assessment", date: "23 Jul 2026, 11:00 AM", note: "Low risk classification." },
      { status: "approved", title: "Claim Approved", date: "29 Jul 2026, 04:15 PM", note: "Approved for full reimbursement of ₹32,000 via DBT." }
    ],
    officer_notes: "Crop cut experiment (CCE) sampling aligns with loss statement. DBT transfer initiated."
  },
  {
    claim_id: "BKIG-CLM-2026-092",
    farmer_name: "Gurpreet Singh",
    farmer_id: "BKIG-FARMER-044",
    crop: "Paddy (Basmati)",
    crop_variety: "Pusa-1121",
    district: "Ludhiana",
    taluk: "Jagraon",
    village: "Sidhwan Bet",
    survey_number: "LD-89/1A",
    area_hectares: 6.0,
    claimed_amount: 120000,
    sowing_date: "2026-06-20",
    incident_date: "2026-09-10",
    claim_reason: "Flash flooding resulting in field inundation for 7 consecutive days.",
    status: "submitted",
    created_at: "2026-10-02T15:20:00Z",
    risk_score: 42,
    risk_level: "medium",
    ai_assessment: {
      model_version: "BKIG-RF-v1.4",
      prediction_date: "2026-10-03T09:15:00Z",
      rainfall_deficit: "Heavy precipitation (+65% over normal)",
      ndvi_vegetation_index: "0.19 (submerged canopy)",
      weather_satellite_match: "Partial match: river overflow reported upstream",
      inconsistencies: ["Historical yield threshold discrepancies in adjoining cadastral plots"]
    },
    evidence_photos: [
      {
        id: "ev-4",
        caption: "Inundated paddy fields near Sutlej drainage canal",
        url: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80",
        uploaded_at: "2026-10-02T15:22:00Z"
      }
    ],
    timeline: [
      { status: "submitted", title: "Claim Submitted", date: "02 Oct 2026, 03:20 PM", note: "Fresh submission awaiting assessor queue assignment." }
    ],
    officer_notes: ""
  },
  {
    claim_id: "BKIG-CLM-2026-105",
    farmer_name: "Manjula Devi",
    farmer_id: "BKIG-FARMER-067",
    crop: "Cotton",
    crop_variety: "Bt Cotton Bollgard II",
    district: "Yavatmal",
    taluk: "Ralegaon",
    village: "Pimpalgaon",
    survey_number: "YT-204/C",
    area_hectares: 3.8,
    claimed_amount: 85000,
    sowing_date: "2026-06-05",
    incident_date: "2026-09-14",
    claim_reason: "Pink bollworm infestation causing extensive square and green boll damage.",
    status: "under_review",
    created_at: "2026-10-05T12:00:00Z",
    risk_score: 74,
    risk_level: "high",
    ai_assessment: {
      model_version: "BKIG-RF-v1.4",
      prediction_date: "2026-10-06T10:45:00Z",
      rainfall_deficit: "Rainfall within typical bounds",
      ndvi_vegetation_index: "0.48 (dense canopy inconsistent with reported 90% loss)",
      weather_satellite_match: "High discrepancy: synthetic radar shows normal crop vigor index",
      inconsistencies: [
        "Canopy spectral reflectance does not correlate with catastrophic pest defoliation",
        "Survey plot boundary overlaps with previously settled claim in adjacent revenue village"
      ]
    },
    evidence_photos: [
      {
        id: "ev-5",
        caption: "Close-up of damaged cotton boll with larval entry",
        url: "https://images.unsplash.com/photo-1594488554790-2e4b47c6e611?auto=format&fit=crop&w=600&q=80",
        uploaded_at: "2026-10-05T12:05:00Z"
      }
    ],
    timeline: [
      { status: "submitted", title: "Claim Submitted", date: "05 Oct 2026, 12:00 PM", note: "Submitted online." },
      { status: "under_review", title: "Model signal flagged for review", date: "06 Oct 2026, 10:45 AM", note: "Experimental sample record. Requires human verification." }
    ],
    officer_notes: "Physical verification requested: District agricultural officer notified to conduct on-site GPS verification."
  },
  {
    claim_id: "BKIG-CLM-2026-062",
    farmer_name: "Shivappa Nayak",
    farmer_id: "BKIG-FARMER-019",
    crop: "Groundnut",
    crop_variety: "TMV-2",
    district: "Anantapur",
    taluk: "Dharmavaram",
    village: "Chigicherla",
    survey_number: "AP-311/2",
    area_hectares: 2.0,
    claimed_amount: 38000,
    sowing_date: "2026-07-01",
    incident_date: "2026-08-20",
    claim_reason: "Extreme heatwave and dry spells causing pod development failure.",
    status: "rejected",
    created_at: "2026-08-25T14:10:00Z",
    risk_score: 82,
    risk_level: "high",
    ai_assessment: {
      model_version: "BKIG-RF-v1.4",
      prediction_date: "2026-08-26T16:00:00Z",
      rainfall_deficit: "Normal precipitation recorded by local automatic weather station (AWS)",
      ndvi_vegetation_index: "0.52",
      weather_satellite_match: "High discrepancy: weather station reported 4 rainy days during stated dry spell",
      inconsistencies: ["Reported incident date conflicts with AWS records showing 42mm rain"]
    },
    evidence_photos: [],
    timeline: [
      { status: "submitted", title: "Claim Submitted", date: "25 Aug 2026, 02:10 PM", note: "Claim logged." },
      { status: "under_review", title: "Risk Assessment Evaluated", date: "26 Aug 2026, 04:00 PM", note: "Weather record contradiction detected." },
      { status: "rejected", title: "Claim Rejected", date: "30 Aug 2026, 11:30 AM", note: "Rejected after field review: local AWS data disproves drought conditions for the claimed parcel." }
    ],
    officer_notes: "Claim rejected following inspection. AWS station recorded adequate moisture; no drought stress observed."
  }
];
