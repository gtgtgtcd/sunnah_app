/**
 * Comprehensive Reciter Search System
 * Supports multiple languages, transliterations, and variations of names
 */

// Main database mapping reciter IDs to alternative names in different languages/script
const RECITER_NAME_DATABASE = {
  // Example entry - add more reciters as needed
  'Idris': {
    primary: 'إدريس أبكر',
    arabic_variations: [
      'ادريس ابكر',
      'ادريس ابوكر',
      'ابوكر ادريس',
      'ادريس ابكر',
      'ادريس ابكر',
      'ادريس ابكر',
      'ادريس ابكر'
    ],
    english_transliterations: [
      'Idris Abkar',
      'Edris Abkar',
      'Idris Abker',
      'Edris Abker',
      'Abkar Idris',
      'Idris Al-Bukhari',
      'Edris Al-Bukhari'
    ],
    other_languages: {
      turkish: ['İdris Ebker'],
      urdu: ['ابوذر ابکر'],
      farsi: ['ایدریس ابکر']
    }
  },
  'Alafasy': {
    primary: 'مشاري راشد العفاسي',
    arabic_variations: [
      'مشاري العفاسي',
      'مشاري راشد',
      'العفاسي مشاري',
      'مشاري راشد الفاسي',
      'مشاري راشد العفاسي',
      'العفاسي'
    ],
    english_transliterations: [
      'Alafasy',
      'Mishary Rashid Alafasy',
      'Mishary Al Afasy',
      'Al-Afasy',
      'Mishary Afasy'
    ]
  },
  'Abdul_Basit': {
    primary: 'عبد الباسط عبد الصمد',
    arabic_variations: [
      'عبد الباسط',
      'عبد الصمد',
      'عبد الباسط عبد الصمد',
      'عبد الباسط عبدالصمد',
      'عبد الباسط عبدالصمد',
      'عبد الباسط عبد الصمد'
    ],
    english_transliterations: [
      'Abdul Basit',
      'Abdul Basit Abdus Samad',
      'Abdel Basit',
      'Abdel Basit Abdus Samad',
      'Abdul-Basit',
      'Abdul Basit Abdus-Samad'
    ]
  },
  'Minshawy': {
    primary: 'محمد صديق المنشاوي',
    arabic_variations: [
      'محمد صديق',
      'المنشاوي',
      'محمد صديق منشاوي',
      'محمد صديق المنشاوي',
      'المنشاوي محمد',
      'محمد المنشاوي'
    ],
    english_transliterations: [
      'Minshawy',
      'Monsawy',
      'Mohamed Siddiq al-Minshawi',
      'Mohammad Al Minshawy',
      'Siddiq Minshawi'
    ]
  },
  'Hussary': {
    primary: 'محمود خليل الحصري',
    arabic_variations: [
      'محمود الحصري',
      'الحصري',
      'محمود خليل الحصري',
      'الحصري محمود',
      'محمود الحصري',
      'محمود خليل'
    ],
    english_transliterations: [
      'Hussary',
      'Hosary',
      'Mahmoud Khalil Al-Hussary',
      'Mahmoud Al Hussary',
      'Husary'
    ]
  },
  'Muaiqly': {
    primary: 'ماهر المعيقلي',
    arabic_variations: [
      'ماهر المعيقلي',
      'ماهر',
      'المعيقلي',
      'ماهر المعيقلي',
      'المعيقلي ماهر',
      'ماهر المعيقلي'
    ],
    english_transliterations: [
      'Muaiqly',
      'Muayqili',
      'Maher Al Muaiqly',
      'Maher Al-Muaiqili',
      'Muaiqily'
    ]
  },
  'Shuraim': {
    primary: 'سعود الشريم',
    arabic_variations: [
      'سعود الشريم',
      'سعود',
      'الشريم',
      'سعود الشريم',
      'الشريم سعود',
      'سعود الشريم'
    ],
    english_transliterations: [
      'Shuraim',
      'Shuraym',
      'Saood Al-Shuraim',
      'Saad Al Shuraim',
      'Al Shuraim'
    ]
  },
  'Dosari': {
    primary: 'ياسر الدوسري',
    arabic_variations: [
      'ياسر الدوسري',
      'ياسر',
      'الدوسري',
      'ياسر الدوسري',
      'الدوسري ياسر',
      'ياسر الدوسري'
    ],
    english_transliterations: [
      'Dosari',
      'Dossary',
      'Yasser Al Dosari',
      'Yasser Al-Dosari',
      'Yasser Al-Dossary'
    ]
  },
  'Sudais': {
    primary: 'عبد الرحمن السديس',
    arabic_variations: [
      'عبد الرحمن السديس',
      'السديس',
      'عبد الرحمن',
      'عبدالرحمن السديس',
      'السديس عبدالرحمن',
      'عبد الرحمن السديس'
    ],
    english_transliterations: [
      'Sudais',
      'Al Sudais',
      'Abdul Rahman Al Sudais',
      'Abdul Rahman As Sudais',
      'As Sudais'
    ]
  },
  'Ghamdi': {
    primary: 'سعد الغامدي',
    arabic_variations: [
      'سعد الغامدي',
      'الغامدي',
      'سعد',
      'سعد الغامدي',
      'الغامدي سعد',
      'سعد الغامدي'
    ],
    english_transliterations: [
      'Ghamdi',
      'Ghomady',
      'Saad Al Ghamdi',
      'Saad Al-Ghamdi',
      'Al Ghamdi'
    ]
  },
  'Qatami': {
    primary: 'ناصر القطامي',
    arabic_variations: [
      'ناصر القطامي',
      'القطامي',
      'ناصر',
      'ناصر القطامي',
      'القطامي ناصر',
      'ناصر القطامي'
    ],
    english_transliterations: [
      'Qatami',
      'Qattami',
      'Nasser Al Qatami',
      'Nasser Al-Qatami',
      'Al Qatami'
    ]
  },
  'Fares': {
    primary: 'فارس عباد',
    arabic_variations: [
      'فارس عباد',
      'فارس',
      'عباد',
      'فارس عباد',
      'عباد فارس',
      'فارس عباد'
    ],
    english_transliterations: [
      'Fares',
      'Faris',
      'Fares Abbad',
      'Faris Abbad',
      'Fares Abbadi'
    ]
  },
  'Ajamy': {
    primary: 'أحمد العجمي',
    arabic_variations: [
      'أحمد العجمي',
      'أحمد',
      'العجمي',
      'أحمد العجمي',
      'العجمي أحمد',
      'أحمد العجمي'
    ],
    english_transliterations: [
      'Ajamy',
      'Ajmi',
      'Ahmad Al Ajamy',
      'Ahmad Al-Ajami',
      'Al Ajami'
    ]
  },
  'Balushi': {
    primary: 'هزاع البلوشي',
    arabic_variations: [
      'هزاع البلوشي',
      'هزاع',
      'البلوشي',
      'هذاع البلوشي',
      'هذاع',
      'البلوشي هزاع',
      'هزاع البلوشي'
    ],
    english_transliterations: [
      'Balushi',
      'Haza al Balushi',
      'Hazza al Balushi',
      'Haza Al Balushi',
      'Baluchi'
    ]
  },
  'Wadih': {
    primary: 'وديع اليمني',
    arabic_variations: [
      'وديع اليمني',
      'وديع',
      'اليميني',
      'وديع اليامني',
      'وديع اليمني',
      'اليمني وديع',
      'وديع اليامي'
    ],
    english_transliterations: [
      'Wadih',
      'Wadee al Yamani',
      'Wadih Al Yamani',
      'Wadi al-Yamani',
      'Yamani'
    ]
  },
  'Basfar': {
    primary: 'عبدالله بصفر',
    arabic_variations: [
      'عبدالله بصفر',
      'بصفر',
      'عبد الله بصفر',
      'عبدالله البصفر',
      'البصفر',
      'بصفر عبدالله',
      'عبدالله بصفر'
    ],
    english_transliterations: [
      'Basfar',
      'Bassfar',
      'Abdullah Basfar',
      'Abdulla Bassfar',
      'Basfar Abdullah'
    ]
  },
  'Tablawi': {
    primary: 'عدنان الشحات الطبلاوي',
    arabic_variations: [
      'عدنان الطبلاوي',
      'الTablaوي',
      'عدنان الشحات',
      'عدنان الشحات الطبلاوي',
      'الTablaوي عدنان',
      'عدنان',
      'الشحات'
    ],
    english_transliterations: [
      'Tablawi',
      'Adnan Tablawi',
      'Adnan Al Tablawi',
      'Tablawi Adnan',
      'Al Tablawi'
    ]
  },
  'Afasy': { // Alternative spelling for Alafasy
    primary: 'مشاري راشد العفاسي',
    arabic_variations: [
      'مشاري راشد العفاسي',
      'مشاري العفاسي',
      'مشاري راشد',
      'العفاسي مشاري',
      'مشاري راشد الفاسي',
      'مشاري راشد العفاسي',
      'العفاسي'
    ],
    english_transliterations: [
      'Afasy',
      'Afasi',
      'Mishary Rashid Afasy',
      'Mishary Afasi',
      'Afasi Mishary'
    ]
  }
};

const matchReciterName = (query, names) => {
  const normalizedQuery = normalizeArabicText(query);
  
  // Check primary name
  if (names.primary && normalizeArabicText(names.primary).includes(normalizedQuery)) {
    return true;
  }
  
  // Check Arabic variations
  if (names.arabic_variations) {
    for (const variant of names.arabic_variations) {
      if (normalizeArabicText(variant).includes(normalizedQuery)) {
        return true;
      }
    }
  }
  
  // Check English transliterations
  if (names.english_transliterations) {
    for (const variant of names.english_transliterations) {
      if (variant.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }
  }
  
  // Check other languages if provided
  if (names.other_languages) {
    for (const langVariants of Object.values(names.other_languages)) {
      for (const variant of langVariants) {
        if (typeof variant === 'string' && variant.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
      }
    }
  }
  
  return false;
};

/**
 * Search for reciters based on query
 */
function searchReciters(query) {
  if (!query || query.trim() === '') {
    return RECI
  }
  
  const results = [];
  
  for (const [reciterId, names] of Object.entries(RECITER_NAME_DATABASE)) {
    if (matchReciterName(query, names)) {
      results.push({
        id: reciterId,
        name: names.primary
      });
    }
  }
  
  return results;
}

/**
 * Enhanced search that also accepts partial matches and fuzzy matching
 */
function enhancedSearchReciters(query) {
  if (!query || query.trim() === '') {
    return RECI
  }
  
  const results = [];
  const exactMatches = [];
  const partialMatches = [];
  
  for (const [reciterId, names] of Object.entries(RECITER_NAME_DATABASE)) {
    let score = calculateMatchScore(query, names);
    
    if (score > 0) {
      const result = {
        id: reciterId,
        name: names.primary,
        score: score
      };
      
      if (score >= 100) { // Exact match
        exactMatches.push(result);
      } else {
        partialMatches.push(result);
      }
    }
  }
  
  // Sort by score (higher first) and combine results
  exactMatches.sort((a, b) => b.score - a.score);
  partialMatches.sort((a, b) => b.score - a.score);
  
  return [...exactMatches, ...partialMatches];
}

/**
 * Calculate match score based on various factors
 */
function calculateMatchScore(query, names) {
  const normalizedQuery = normalizeArabicText(query.trim());
  let score = 0;
  
  // Exact match in primary name
  if (normalizeArabicText(names.primary).includes(normalizedQuery) && 
      normalizeArabicText(names.primary).length === normalizedQuery.length) {
    return 100; // Exact match
  }
  
  // Partial match in primary name
  if (normalizeArabicText(names.primary).includes(normalizedQuery)) {
    score += 80;
  }
  
  // Check Arabic variations
  if (names.arabic_variations) {
    for (const variant of names.arabic_variations) {
      if (normalizeArabicText(variant).includes(normalizedQuery)) {
        score += 70;
      } else if (normalizeArabicText(variant).startsWith(normalizedQuery)) {
        score += 60;
      }
    }
  }
  
  // Check English transliterations
  if (names.english_transliterations) {
    for (const variant of names.english_transliterations) {
      if (variant.toLowerCase().includes(query.toLowerCase())) {
        score += 50;
      } else if (variant.toLowerCase().startsWith(query.toLowerCase())) {
        score += 40;
      }
    }
  }
  
  // Check for phonetic similarity using simplified approach
  if (checkPhoneticSimilarity(normalizedQuery, normalizeArabicText(names.primary))) {
    score += 30;
  }
  
  return score;
}

/**
 * Simplified phonetic similarity check
 */
function checkPhoneticSimilarity(query, target) {
  // Remove diacritics and normalize both strings
  const cleanQuery = query.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  const cleanTarget = target.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  
  // Check if the cleaned strings share significant character sequences
  if (cleanQuery.length < 2 || cleanTarget.length < 2) {
    return false;
  }
  
  // Simple heuristic: if at least half of the query characters exist in the target in order
  let matchedChars = 0;
  let queryIndex = 0;
  
  for (let i = 0; i < cleanTarget.length && queryIndex < cleanQuery.length; i++) {
    if (cleanTarget[i] === cleanQuery[queryIndex]) {
      matchedChars++;
      queryIndex++;
    }
  }
  
  return matchedChars >= Math.floor(cleanQuery.length / 2);
}

/**
 * Normalize Arabic text by removing diacritics and standardizing characters
 */
function normalizeArabicText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove diacritics
    .replace(/[أإآ]/g, 'ا') // Standardize alef forms
    .replace(/ة/g, 'ه') // Replace te marbuta with ha
    .trim();
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchReciters,
    enhancedSearchReciters,
    normalizeArabicText,
    calculateMatchScore
  };
} else {
  // For browser environments, add to global window object
  if (typeof window !== 'undefined') {
    if (!window.ENHANCED_SEARCH) {
      window.ENHANCED_SEARCH = {};
    }
    
    window.ENHANCED_SEARCH.searchReciters = searchReciters;
    window.ENHANCED_SEARCH.enhancedSearchReciters = enhancedSearchReciters;
    window.ENHANCED_SEARCH.normalizeArabicText = normalizeArabicText;
    window.ENHANCED_SEARCH.calculateMatchScore = calculateMatchScore;
  }
}