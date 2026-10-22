/**
 * Mock Dashboard Analytics & Telemetry Data
 * All weather, notifications, and seasonal metrics are isolated sample data.
 */

export const MOCK_FARMER_WEATHER = {
  location: "Doddaballapur, Bengaluru Rural",
  state: "Karnataka",
  temperature: "28°C",
  condition: "Partly Cloudy",
  humidity: "62%",
  precipitationRisk: "25%",
  forecast: "Favorable soil moisture for late Kharif grain ripening",
  isSimulated: true
};

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Claim Under Review",
    message: "Claim BKIG-CLM-2026-081 (Ragi) satellite verification has been completed by the zonal assessment cell.",
    time: "2 hours ago",
    read: false,
    type: "info"
  },
  {
    id: "notif-2",
    title: "Mandi Price Alert",
    message: "Ragi modal price at Doddaballapur APMC gained +4.2% reaching ₹3,850/Quintal.",
    time: "Yesterday",
    read: false,
    type: "success"
  },
  {
    id: "notif-3",
    title: "Scheme Enrollment Reminder",
    message: "Rabi 2026 PMFBY insurance cut-off date is approaching on 30th November.",
    time: "3 days ago",
    read: true,
    type: "warning"
  }
];

export const MOCK_OFFICER_NOTIFICATIONS = [
  {
    id: "onotif-1",
    title: "High Risk Assessment Detected",
    message: "Claim BKIG-CLM-2026-105 (Cotton, Yavatmal) flagged with 74% risk score due to spectral reflectance anomaly.",
    time: "35 mins ago",
    read: false,
    type: "warning"
  },
  {
    id: "onotif-2",
    title: "Batch Sync Completed",
    message: "12 new Kharif claim filings synchronized from the State PMFBY registry.",
    time: "3 hours ago",
    read: true,
    type: "info"
  }
];
