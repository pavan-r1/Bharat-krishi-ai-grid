// Safe UI fixtures: all current eligibility, benefit, and document details defer to official portals.
export const MOCK_SCHEMES = [
  {
    id: 'PMFBY', title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture and Farmers Welfare, Government of India', category: 'Insurance', state: 'All India / National',
    summary: 'Official crop insurance portal for scheme information, enrollment services, policy status, and loss reporting.',
    subsidyDetails: 'Premium, coverage, notified crops, and enrollment periods depend on current state and season notifications. Confirm them on the official portal.',
    eligibility: ['Check the current state, season, crop, and applicant conditions in the official notification before applying.'],
    benefits: ['Coverage and claim terms are governed by the current official notification and policy.'],
    documents: ['Use the current official application checklist; document requirements depend on the application and notification.'],
    steps: ['Open the official portal to check current availability, apply through an authorized channel, or check policy status.'],
    officialUrl: 'https://pmfby.gov.in/', isPopular: true,
  },
  {
    id: 'PMKISAN', title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    ministry: 'Department of Agriculture and Farmers Welfare, Government of India', category: 'Financial Assistance', state: 'All India / National',
    summary: 'Official PM-KISAN portal for farmer registration, beneficiary status, eKYC, and scheme information.',
    subsidyDetails: 'Check the official portal for current benefit, eligibility, payment, and verification information.',
    eligibility: ['Use the official Know Your Status service and current scheme guidelines; BKIG does not determine eligibility.'],
    benefits: ['Refer to the current official scheme page for benefit and payment details.'],
    documents: ['Follow the current official registration and verification checklist.'],
    steps: ['Visit the official portal, review eligibility guidance, and use its registration or status services.'],
    officialUrl: 'https://pmkisan.gov.in/', isPopular: true,
  },
  {
    id: 'SMAM', title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    ministry: 'Department of Agriculture and Farmers Welfare, Government of India', category: 'Equipment', state: 'All India / National',
    summary: 'Official agricultural mechanization portal for current scheme guidelines, equipment information, and state application notices.',
    subsidyDetails: 'Availability, assistance, eligible equipment, and application windows depend on current guidelines and state allocations.',
    eligibility: ['Check the current financial-year guidelines and state portal notice for applicant and equipment conditions.'],
    benefits: ['Assistance details are published in the current official guidelines and portal notices.'],
    documents: ['Use the official portal current application checklist; requirements can vary by state and application.'],
    steps: ['Check current state availability and guidelines on the official mechanization portal.'],
    officialUrl: 'https://agrimachinery.nic.in/', isPopular: false,
  },
  {
    id: 'PMKSY', title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    ministry: 'Ministry of Jal Shakti and participating Government of India departments', category: 'Irrigation & Soil', state: 'All India / National',
    summary: 'Official programme portal with component information and links to the responsible implementing departments.',
    subsidyDetails: 'Components, implementing departments, and state availability vary. Confirm current details with the responsible official portal.',
    eligibility: ['Select the relevant programme component and verify its current rules with the responsible department.'],
    benefits: ['Refer to current component guidelines published by the responsible department.'],
    documents: ['Check the implementing department current application checklist.'],
    steps: ['Use the official portal to locate the relevant component and responsible department.'],
    officialUrl: 'https://pmksy.mowr.gov.in/', isPopular: false,
  },
];

export const MOCK_SCHEME_CATEGORIES = ['All Categories', ...new Set(MOCK_SCHEMES.map(scheme => scheme.category))];
