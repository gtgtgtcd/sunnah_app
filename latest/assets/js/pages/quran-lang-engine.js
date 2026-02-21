/**
 * =================================================================================
 * QURAN TRANSLATION - WORLD LANGUAGES & COUNTRIES SEARCH ENGINE (GIANT INDEX V1.0)
 * =================================================================================
 * محرك بحث ذكي للغات العالم والدول، مصمم لسهولة العثور على الترجمات.
 */

const LANG_SEARCH_INDEX = [
    // العربية والتفسير
    { id: 'ar.muyassar', name: 'Arabic (Tafsir)', native: 'العربية (تفسير ميسر)', flag: 'sa', keywords: ['arabic', 'tafsir', 'muyassar', 'saudi', 'عربي', 'تفسير', 'ميسر', 'السعودية', 'مصر', 'الجزائر', 'المغرب', 'تونس', 'ليبيا', 'الاردن', 'سوريا', 'فلسطين', 'لبنان', 'العراق', 'الكويت', 'الامارات', 'عمان', 'قطر', 'البحرين', 'اليمن', 'السودان'] },

    // English & Americas
    { id: 'en.sahih', name: 'English', native: 'English', flag: 'gb', keywords: ['english', 'uk', 'united kingdom', 'london', 'انجليزي', 'بريطانيا', 'انجلترا', 'انجليزية'] },
    { id: 'en.pickthall', name: 'English (Pickthall)', native: 'English', flag: 'us', keywords: ['english', 'usa', 'america', 'us', 'pickthall', 'انجليزي', 'امريكا', 'امريكي', 'الولايات المتحدة'] },
    { id: 'es.cortes', name: 'Spanish', native: 'Español', flag: 'es', keywords: ['spanish', 'spain', 'espana', 'espanol', 'اسباني', 'اسبانيا', 'اسبانية'] },
    { id: 'es.asad', name: 'Spanish (Asad)', native: 'Español', flag: 'mx', keywords: ['spanish', 'mexico', 'latin', 'asad', 'اسباني', 'المكسيك', 'لاتيني'] },
    

    // Europe
    { id: 'fr.hamidullah', name: 'French', native: 'Français', flag: 'fr', keywords: ['french', 'france', 'francais', 'فرنسي', 'فرنسا', 'فرنسية'] },
    { id: 'de.aburida', name: 'German', native: 'Deutsch', flag: 'de', keywords: ['german', 'germany', 'deutschland', 'deutsch', 'الماني', 'المانيا', 'المانية'] },
    { id: 'it.piccardo', name: 'Italian', native: 'Italiano', flag: 'it', keywords: ['italian', 'italy', 'italia', 'italiano', 'ايطالي', 'ايطاليا', 'ايطالية'] },
    { id: 'ru.kuliev', name: 'Russian', native: 'Русский', flag: 'ru', keywords: ['russian', 'russia', 'روسي', 'روسيا', 'روسية'] },
    { id: 'tr.ates', name: 'Turkish', native: 'Türkçe', flag: 'tr', keywords: ['turkish', 'turkey', 'turkce', 'turkiye', 'تركي', 'تركيا', 'تركية'] },
    { id: 'nl.keyzer', name: 'Dutch', native: 'Nederlands', flag: 'nl', keywords: ['dutch', 'netherlands', 'holland', 'هولندي', 'هولندا'] },
    { id: 'sv.bernstrom', name: 'Swedish', native: 'Svenska', flag: 'se', keywords: ['swedish', 'sweden', 'سويدي', 'السويد'] },
    { id: 'no.berg', name: 'Norwegian', native: 'Norsk', flag: 'no', keywords: ['norwegian', 'norway', 'نرويجي', 'النرويج'] },
    { id: 'pl.bielawskiego', name: 'Polish', native: 'Polski', flag: 'pl', keywords: ['polish', 'poland', 'بولندي', 'بولندا'] },
    { id: 'ro.grigore', name: 'Romanian', native: 'Română', flag: 'ro', keywords: ['romanian', 'romania', 'روماني', 'رومانيا'] },
    { id: 'bg.theophanov', name: 'Bulgarian', native: 'Български', flag: 'bg', keywords: ['bulgarian', 'bulgaria', 'بلغاري', 'بلغاريا'] },
    { id: 'sq.ahmeti', name: 'Albanian', native: 'Shqip', flag: 'al', keywords: ['albanian', 'albania', 'shqip', 'الباني', 'البانيا'] },
    { id: 'bs.korkut', name: 'Bosnian', native: 'Bosanski', flag: 'ba', keywords: ['bosnian', 'bosnia', 'بوسني', 'البوسنة'] },
    { id: 'cs.hrbek', name: 'Czech', native: 'Čeština', flag: 'cz', keywords: ['czech', 'czechia', 'تشيكي', 'التشيك'] },

    // Asia & Central Asia
    { id: 'ur.jalandhry', name: 'Urdu', native: 'اردو', flag: 'pk', keywords: ['urdu', 'pakistan', 'pk', 'اردو', 'باكستان'] },
    { id: 'hi.farooq', name: 'Hindi', native: 'हिन्दी', flag: 'in', keywords: ['hindi', 'india', 'هندي', 'الهند'] },
    { id: 'bn.bengali', name: 'Bengali', native: 'বাংলা', flag: 'bd', keywords: ['bengali', 'bangladesh', 'بنغالي', 'بنغلاديش'] },
    { id: 'fa.ghomshei', name: 'Persian', native: 'فارسي', flag: 'ir', keywords: ['persian', 'iran', 'farsi', 'فارسي', 'ايران'] },
    { id: 'id.indonesian', name: 'Indonesian', native: 'Bahasa Indonesia', flag: 'id', keywords: ['indonesian', 'indonesia', 'اندونيسي', 'اندونيسيا'] },
    { id: 'ms.basmeih', name: 'Malay', native: 'Bahasa Melayu', flag: 'my', keywords: ['malay', 'malaysia', 'ماليزي', 'ماليزيا'] },
    { id: 'zh.jian', name: 'Chinese', native: '简体中文', flag: 'cn', keywords: ['chinese', 'china', 'صيني', 'الصين'] },
    
    
    { id: 'th.thai', name: 'Thai', native: 'ไทย', flag: 'th', keywords: ['thai', 'thailand', 'تايلاندي', 'تايلاند'] },
    
    { id: 'ta.tamil', name: 'Tamil', native: 'தமிழ்', flag: 'lk', keywords: ['tamil', 'sri lanka', 'india', 'تاميل', 'سريلانكا'] },
    
    { id: 'ml.abdulhameed', name: 'Malayalam', native: 'മലയാളം', flag: 'in', keywords: ['malayalam', 'india', 'مالايالام', 'الهند'] },
    { id: 'ps.abdulwali', name: 'Pashto', native: 'پښتو', flag: 'af', keywords: ['pashto', 'afghanistan', 'بشتو', 'افغانستان'] },
    { id: 'uz.sodik', name: 'Uzbek', native: 'Oʻzbekcha', flag: 'uz', keywords: ['uzbek', 'uzbekistan', 'اوزبكي', 'اوزباكستان'] },
    { id: 'az.mammadaliyev', name: 'Azerbaijani', native: 'Azərbaycanca', flag: 'az', keywords: ['azerbaijani', 'azerbaijan', 'اذربيجاني', 'اذربيجان'] },
    { id: 'tg.ayati', name: 'Tajik', native: 'Toҷикӣ', flag: 'tj', keywords: ['tajik', 'tajikistan', 'طاجيكي', 'طاجيكستان'] },
    { id: 'tt.nugman', name: 'Tatar', native: 'Татарча', flag: 'ru', keywords: ['tatar', 'روسيا', 'تتارستان'] },
    { id: 'ug.saleh', name: 'Uyghur', native: 'ئۇيغۇرچە', flag: 'cn', keywords: ['uyghur', 'china', 'ayghur', 'ايغور', 'الصين'] },
    { id: 'dv.divehi', name: 'Divehi', native: 'ދިވެހި', flag: 'mv', keywords: ['divehi', 'maldives', 'ديفيهي', 'المالديف'] },

    // Africa
    { id: 'sw.barwani', name: 'Swahili', native: 'Kiswahili', flag: 'tz', keywords: ['swahili', 'tanzania', 'kenya', 'سواحيلي', 'تنزانيا', 'كينيا'] },
    { id: 'ha.gumi', name: 'Hausa', native: 'Hausa', flag: 'ng', keywords: ['hausa', 'nigeria', 'هوسا', 'نيجيريا'] },
    
    { id: 'so.abduh', name: 'Somali', native: 'Af-Soomaali', flag: 'so', keywords: ['somali', 'somalia', 'صومالي', 'الصومال', 'جيبوتي'] },
    { id: 'am.sadiq', name: 'Amharic', native: 'አማርኛ', flag: 'et', keywords: ['amharic', 'ethiopia', 'امهري', 'اثيوبيا'] },
    { id: 'ber.mensur', name: 'Amazigh', native: 'Tamaziɣt', flag: 'dz', keywords: ['amazigh', 'berber', 'algeria', 'morocco', 'امازيغي', 'بربري', 'الجزائر', 'المغرب'] }
];

const LangSearchEngine = {
    normalize: function (text) {
        if (!text) return "";
        return text.toLowerCase()
            .replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
            .replace(/[ًٌٍَُِّْ]/g, '').replace(/[-\s]/g, '').trim();
    },

    search: function (query) {
        const normQuery = this.normalize(query);
        if (!normQuery) return LANG_SEARCH_INDEX;

        const results = LANG_SEARCH_INDEX.map(item => {
            let score = 0;
            const itemKeywords = [
                this.normalize(item.name),
                this.normalize(item.native),
                ...item.keywords.map(k => this.normalize(k))
            ];

            // 1. Exact Match (High Score)
            if (itemKeywords.some(k => k === normQuery)) {
                score = 100;
            }
            // 2. Starts With (Medium-High Score)
            else if (itemKeywords.some(k => k.startsWith(normQuery))) {
                score = 80;
            }
            // 3. Includes (Medium Score)
            else if (itemKeywords.some(k => k.includes(normQuery))) {
                score = 60;
            }

            return { ...item, score };
        });

        return results
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score);
    }
};
