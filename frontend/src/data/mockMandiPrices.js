/**
 * Mock Mandi Prices Intelligence Data
 * Representative sample data for major agricultural mandis across India.
 * Note: Clearly labelled as sample data — not live market prices.
 */

export const MOCK_CROPS = [
  "Ragi (Finger Millet)",
  "Wheat",
  "Paddy (Dhan)",
  "Maize (Corn)",
  "Cotton",
  "Soybean",
  "Onion",
  "Mustard",
  "Turmeric",
  "Tomato"
];

export const MOCK_STATES = [
  {
    name: "Karnataka",
    districts: [
      { name: "Bengaluru Rural", markets: ["Doddaballapur APMC", "Nelamangala Market", "Devanahalli Mandi"] },
      { name: "Mysuru", markets: ["Bandipalya APMC", "Nanjangud Market"] },
      { name: "Belagavi", markets: ["Belagavi Main Mandi", "Bailhongal APMC"] }
    ]
  },
  {
    name: "Maharashtra",
    districts: [
      { name: "Nashik", markets: ["Lasalgaon APMC", "Pimpalgaon Mandi", "Yeola Market"] },
      { name: "Pune", markets: ["Gultekdi APMC", "Baramati Market"] },
      { name: "Yavatmal", markets: ["Yavatmal APMC", "Wani Market"] }
    ]
  },
  {
    name: "Punjab",
    districts: [
      { name: "Ludhiana", markets: ["Khanna Mandi (Asia's Largest)", "Jagraon Grain Market"] },
      { name: "Amritsar", markets: ["Bhagtanwala APMC", "Rayya Market"] }
    ]
  },
  {
    name: "Madhya Pradesh",
    districts: [
      { name: "Indore", markets: ["Choithram APMC", "Sanwer Market"] },
      { name: "Ujjain", markets: ["Ujjain Krishi Upaj Mandi", "Nagda APMC"] }
    ]
  }
];

export const MOCK_PRICE_RECORDS = {
  "Ragi (Finger Millet)": {
    commodity: "Ragi (Finger Millet)",
    variety: "Local / Hybrid Blend",
    unit: "₹ / Quintal (100 kg)",
    lastUpdated: "Today, 06:30 AM (IST)",
    summary: {
      modalPrice: 3850,
      minPrice: 3500,
      maxPrice: 4200,
      change7d: "+4.2%",
      trend: "up"
    },
    historicalTrend: [
      { date: "12 Oct", modal: 3680, min: 3400, max: 3950 },
      { date: "13 Oct", modal: 3710, min: 3450, max: 4000 },
      { date: "14 Oct", modal: 3740, min: 3480, max: 4050 },
      { date: "15 Oct", modal: 3790, min: 3500, max: 4100 },
      { date: "16 Oct", modal: 3810, min: 3520, max: 4150 },
      { date: "17 Oct", modal: 3840, min: 3510, max: 4180 },
      { date: "18 Oct", modal: 3850, min: 3500, max: 4200 }
    ],
    marketComparisons: [
      { market: "Doddaballapur APMC", state: "Karnataka", district: "Bengaluru Rural", arrivalsTonnes: 185, minPrice: 3550, maxPrice: 4200, modalPrice: 3850 },
      { market: "Nelamangala Market", state: "Karnataka", district: "Bengaluru Rural", arrivalsTonnes: 140, minPrice: 3500, maxPrice: 4100, modalPrice: 3780 },
      { market: "Bandipalya APMC", state: "Karnataka", district: "Mysuru", arrivalsTonnes: 210, minPrice: 3600, maxPrice: 4250, modalPrice: 3910 },
      { market: "Belagavi Main Mandi", state: "Karnataka", district: "Belagavi", arrivalsTonnes: 95, minPrice: 3480, maxPrice: 4050, modalPrice: 3720 },
      { market: "Choithram APMC", state: "Madhya Pradesh", district: "Indore", arrivalsTonnes: 60, minPrice: 3400, maxPrice: 3980, modalPrice: 3650 }
    ]
  },
  "Wheat": {
    commodity: "Wheat",
    variety: "Sharbati / Lokwan",
    unit: "₹ / Quintal (100 kg)",
    lastUpdated: "Today, 07:15 AM (IST)",
    summary: {
      modalPrice: 2475,
      minPrice: 2275,
      maxPrice: 2680,
      change7d: "+1.8%",
      trend: "up"
    },
    historicalTrend: [
      { date: "12 Oct", modal: 2420, min: 2250, max: 2600 },
      { date: "13 Oct", modal: 2435, min: 2260, max: 2620 },
      { date: "14 Oct", modal: 2450, min: 2270, max: 2640 },
      { date: "15 Oct", modal: 2460, min: 2280, max: 2650 },
      { date: "16 Oct", modal: 2465, min: 2270, max: 2660 },
      { date: "17 Oct", modal: 2470, min: 2275, max: 2670 },
      { date: "18 Oct", modal: 2475, min: 2275, max: 2680 }
    ],
    marketComparisons: [
      { market: "Khanna Mandi", state: "Punjab", district: "Ludhiana", arrivalsTonnes: 850, minPrice: 2325, maxPrice: 2680, modalPrice: 2520 },
      { market: "Choithram APMC", state: "Madhya Pradesh", district: "Indore", arrivalsTonnes: 620, minPrice: 2350, maxPrice: 2750, modalPrice: 2580 },
      { market: "Ujjain Krishi Upaj", state: "Madhya Pradesh", district: "Ujjain", arrivalsTonnes: 490, minPrice: 2300, maxPrice: 2620, modalPrice: 2460 },
      { market: "Gultekdi APMC", state: "Maharashtra", district: "Pune", arrivalsTonnes: 310, minPrice: 2275, maxPrice: 2580, modalPrice: 2410 }
    ]
  },
  "Paddy (Dhan)": {
    commodity: "Paddy (Dhan)",
    variety: "Common / Grade A",
    unit: "₹ / Quintal (100 kg)",
    lastUpdated: "Today, 06:45 AM (IST)",
    summary: {
      modalPrice: 2300,
      minPrice: 2183,
      maxPrice: 2450,
      change7d: "-0.5%",
      trend: "down"
    },
    historicalTrend: [
      { date: "12 Oct", modal: 2320, min: 2200, max: 2480 },
      { date: "13 Oct", modal: 2315, min: 2200, max: 2470 },
      { date: "14 Oct", modal: 2310, min: 2190, max: 2460 },
      { date: "15 Oct", modal: 2305, min: 2190, max: 2450 },
      { date: "16 Oct", modal: 2300, min: 2185, max: 2450 },
      { date: "17 Oct", modal: 2300, min: 2185, max: 2450 },
      { date: "18 Oct", modal: 2300, min: 2183, max: 2450 }
    ],
    marketComparisons: [
      { market: "Jagraon Grain Market", state: "Punjab", district: "Ludhiana", arrivalsTonnes: 740, minPrice: 2200, maxPrice: 2450, modalPrice: 2340 },
      { market: "Bandipalya APMC", state: "Karnataka", district: "Mysuru", arrivalsTonnes: 410, minPrice: 2190, maxPrice: 2420, modalPrice: 2310 },
      { market: "Nelamangala Market", state: "Karnataka", district: "Bengaluru Rural", arrivalsTonnes: 260, minPrice: 2183, maxPrice: 2380, modalPrice: 2270 }
    ]
  },
  "Cotton": {
    commodity: "Cotton",
    variety: "Medium Staple (H-4)",
    unit: "₹ / Quintal (100 kg)",
    lastUpdated: "Today, 08:00 AM (IST)",
    summary: {
      modalPrice: 7120,
      minPrice: 6600,
      maxPrice: 7550,
      change7d: "+3.1%",
      trend: "up"
    },
    historicalTrend: [
      { date: "12 Oct", modal: 6900, min: 6500, max: 7300 },
      { date: "13 Oct", modal: 6950, min: 6520, max: 7350 },
      { date: "14 Oct", modal: 7010, min: 6550, max: 7400 },
      { date: "15 Oct", modal: 7050, min: 6580, max: 7450 },
      { date: "16 Oct", modal: 7080, min: 6600, max: 7500 },
      { date: "17 Oct", modal: 7100, min: 6600, max: 7520 },
      { date: "18 Oct", modal: 7120, min: 6600, max: 7550 }
    ],
    marketComparisons: [
      { market: "Yavatmal APMC", state: "Maharashtra", district: "Yavatmal", arrivalsTonnes: 520, minPrice: 6700, maxPrice: 7550, modalPrice: 7200 },
      { market: "Wani Market", state: "Maharashtra", district: "Yavatmal", arrivalsTonnes: 380, minPrice: 6650, maxPrice: 7480, modalPrice: 7140 },
      { market: "Bailhongal APMC", state: "Karnataka", district: "Belagavi", arrivalsTonnes: 290, minPrice: 6600, maxPrice: 7400, modalPrice: 7020 }
    ]
  },
  "Onion": {
    commodity: "Onion",
    variety: "Red Nasik Quality",
    unit: "₹ / Quintal (100 kg)",
    lastUpdated: "Today, 06:15 AM (IST)",
    summary: {
      modalPrice: 2850,
      minPrice: 2200,
      maxPrice: 3400,
      change7d: "-6.5%",
      trend: "down"
    },
    historicalTrend: [
      { date: "12 Oct", modal: 3100, min: 2400, max: 3700 },
      { date: "13 Oct", modal: 3050, min: 2350, max: 3600 },
      { date: "14 Oct", modal: 2980, min: 2300, max: 3550 },
      { date: "15 Oct", modal: 2920, min: 2250, max: 3500 },
      { date: "16 Oct", modal: 2890, min: 2220, max: 3450 },
      { date: "17 Oct", modal: 2860, min: 2200, max: 3420 },
      { date: "18 Oct", modal: 2850, min: 2200, max: 3400 }
    ],
    marketComparisons: [
      { market: "Lasalgaon APMC", state: "Maharashtra", district: "Nashik", arrivalsTonnes: 1250, minPrice: 2250, maxPrice: 3400, modalPrice: 2880 },
      { market: "Pimpalgaon Mandi", state: "Maharashtra", district: "Nashik", arrivalsTonnes: 820, minPrice: 2200, maxPrice: 3350, modalPrice: 2820 },
      { market: "Gultekdi APMC", state: "Maharashtra", district: "Pune", arrivalsTonnes: 540, minPrice: 2300, maxPrice: 3450, modalPrice: 2910 }
    ]
  }
};
