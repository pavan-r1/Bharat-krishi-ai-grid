/**
 * Mock user profile fixtures for isolated frontend tests and previews.
 * These records are not an authentication source; the backend owns all access decisions.
 */

export const MOCK_USERS = [
  {
    id: "BKIG-FARMER-001",
    mobile: "9876543210",
    name: "Rameshwar Patel",
    role: "farmer",
    state: "Karnataka",
    district: "Bengaluru Rural",
    taluk: "Doddaballapur",
    village: "Rajankunte",
    landArea: "4.2 Hectares",
    primaryCrop: "Ragi & Maize",
    aadhaarMasked: "XXXX-XXXX-4921",
    kisanCreditCard: "KCC-KA-88912",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "BKIG-OFFICER-001",
    mobile: "9123456789",
    name: "Dr. Ananya Sharma",
    role: "officer",
    designation: "Senior Agricultural Claims Assessor",
    officerId: "OFF-KA-8402",
    branch: "PMFBY Zonal Assessment Wing",
    department: "Department of Agriculture & Farmers Welfare",
    jurisdiction: "Southern Karnataka Zone",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  }
];
