const messages = {
  en: {
    mandi: 'Gemini is temporarily unavailable. To compare mandi prices in BKIG, select the same crop and location filters, then compare each market’s modal price (₹/quintal) and arrival date. Prices are daily observations, not live quotes. Open Mandi Prices to view available records.',
    schemes: 'Gemini is temporarily unavailable. Browse BKIG’s Government Schemes section for summaries and official links. Check the linked government portal for current eligibility, documents, benefits, and deadlines.',
    claims: 'Gemini is temporarily unavailable. Open My Claims to see your own claim status, or Submit Claim to start a claim. Sign in first; this offline reply cannot confirm claim decisions or risk scores.',
    general: 'Gemini is temporarily unavailable, so I can’t give a reliable crop-specific answer right now. You can still use BKIG’s Mandi Prices, Government Schemes, and My Claims sections. Please try your farming question again shortly.'
  },
  kn: {
    mandi: 'Gemini ಸೇವೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. BKIG ನಲ್ಲಿ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಲು ಒಂದೇ ಬೆಳೆ ಮತ್ತು ಸ್ಥಳದ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ; ನಂತರ ಪ್ರತಿ ಮಾರುಕಟ್ಟೆಯ ಮಾದರಿ ಬೆಲೆ (₹/ಕ್ವಿಂಟಲ್) ಮತ್ತು ಆಗಮನ ದಿನಾಂಕವನ್ನು ಹೋಲಿಸಿ. ಇವು ದೈನಂದಿನ ದಾಖಲೆಗಳು, ನೇರ ಸಮಯದ ಬೆಲೆಗಳಲ್ಲ. ಲಭ್ಯವಿರುವ ದಾಖಲೆಗಳಿಗಾಗಿ Mandi Prices ವಿಭಾಗವನ್ನು ತೆರೆಯಿರಿ.',
    schemes: 'Gemini ಸೇವೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ಯೋಜನೆಗಳ ಸಾರಾಂಶ ಮತ್ತು ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳಿಗಾಗಿ BKIG ಯ Government Schemes ವಿಭಾಗವನ್ನು ನೋಡಿ. ಅರ್ಹತೆ, ದಾಖಲೆಗಳು, ಪ್ರಯೋಜನಗಳು ಮತ್ತು ಕೊನೆಯ ದಿನಾಂಕಗಳ ಪ್ರಸ್ತುತ ಮಾಹಿತಿಯನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    claims: 'Gemini ಸೇವೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಸ್ವಂತ ಕ್ಲೇಮ್ ಸ್ಥಿತಿಗಾಗಿ My Claims ತೆರೆಯಿರಿ ಅಥವಾ ಹೊಸ ಕ್ಲೇಮ್‌ಗಾಗಿ Submit Claim ಆಯ್ಕೆಮಾಡಿ. ಮೊದಲು ಸೈನ್ ಇನ್ ಮಾಡಿ. ಈ ಆಫ್‌ಲೈನ್ ಉತ್ತರವು ಕ್ಲೇಮ್ ನಿರ್ಧಾರ ಅಥವಾ ಅಪಾಯದ ಅಂಕವನ್ನು ನೀಡುವುದಿಲ್ಲ.',
    general: 'Gemini ಸೇವೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ; ಆದ್ದರಿಂದ ಈಗ ವಿಶ್ವಾಸಾರ್ಹ ಬೆಳೆ-ನಿರ್ದಿಷ್ಟ ಸಲಹೆ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ. BKIG ಯ Mandi Prices, Government Schemes ಮತ್ತು My Claims ವಿಭಾಗಗಳನ್ನು ಬಳಸಬಹುದು. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
  },
  hi: {
    mandi: 'Gemini सेवा अभी उपलब्ध नहीं है। BKIG में मंडी भाव की तुलना के लिए एक ही फसल और स्थान के फ़िल्टर चुनें, फिर हर मंडी का मॉडल भाव (₹/क्विंटल) और आवक की तारीख देखें। ये दैनिक आँकड़े हैं, लाइव भाव नहीं। उपलब्ध रिकॉर्ड देखने के लिए Mandi Prices खोलें।',
    schemes: 'Gemini सेवा अभी उपलब्ध नहीं है। योजनाओं के सारांश और आधिकारिक लिंक के लिए BKIG का Government Schemes अनुभाग देखें। पात्रता, दस्तावेज़, लाभ और अंतिम तिथियों की वर्तमान जानकारी संबंधित सरकारी पोर्टल पर जाँचें।',
    claims: 'Gemini सेवा अभी उपलब्ध नहीं है। अपने दावे की स्थिति देखने के लिए My Claims खोलें या नया दावा शुरू करने के लिए Submit Claim चुनें। पहले साइन इन करें। यह ऑफ़लाइन उत्तर दावा निर्णय या जोखिम स्कोर नहीं देता।',
    general: 'Gemini सेवा अभी उपलब्ध नहीं है, इसलिए इस समय फसल-विशेष सलाह देना भरोसेमंद नहीं होगा। आप BKIG के Mandi Prices, Government Schemes और My Claims अनुभाग इस्तेमाल कर सकते हैं। कृपया थोड़ी देर बाद फिर कोशिश करें.'
  }
};

export function localChatFallback(message, requestedLanguage = 'auto') {
  const text = String(message || '');
  const lower = text.toLocaleLowerCase();
  let language = requestedLanguage;
  if (language === 'auto') {
    if (/[\u0C80-\u0CFF]/u.test(text) || /\b(kannada|in kannada)\b/i.test(text)) language = 'kn';
    else if (/[\u0900-\u097F]/u.test(text) || /\b(hindi|in hindi)\b/i.test(text)) language = 'hi';
    else language = 'en';
  }
  const intent = /(mandi|market|price|prices|ಬೆಲೆ|ಮಾರುಕಟ್ಟೆ|ಹೋಲಿಸ|मंडी|भाव|कीमत|तुलना)/u.test(lower)
    ? 'mandi'
    : /(scheme|subsidy|ಯೋಜನೆ|ಅನುದಾನ|योजना|सब्सिडी)/u.test(lower)
      ? 'schemes'
      : /(claim|insurance|ದಾವೆ|ವಿಮೆ|ಕ್ಲೇಮ್|बीमा|दावा)/u.test(lower)
        ? 'claims'
        : 'general';
  return messages[language]?.[intent] || messages.en[intent];
}
