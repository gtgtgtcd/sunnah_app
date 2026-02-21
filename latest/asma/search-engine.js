/**
 * =================================================================================
 * ASMA AL-HUSNA - ADVANCED SEARCH ENGINE & GIANT INDEX (V3.0 - RANKING MASTER)
 * =================================================================================
 * التحديثات:
 * 1. إضافة Jaro-Winkler Algorithm لدقة ترتيب الأسماء.
 * 2. إضافة Trigram Similarity لمنع تداخل الكلمات المتشابهة في الحروف فقط.
 * 3. تحسين نظام الـ Scoring عشان "الراشيد" تيجي قبل أي حاجة تانية بفرق شاسع.
 */

// ================= 1. GIANT SEARCH INDEX (الفهرس العملاق) ================= //
const SEARCH_INDEX = [
    { id: 1, keywords: ["الرحمن", "رحمان", "الرمن", "ارحمن", "ar-rahman"] },
    { id: 2, keywords: ["الرحيم", "رحيم", "الراحيم", "ar-rahim"] },
    { id: 3, keywords: ["الملك", "ملك", "المالك", "مليك", "al-malik"] },
    { id: 4, keywords: ["القدوس", "قدوس", "الكدوس", "المقدس", "al-quddus"] },
    { id: 5, keywords: ["السلام", "سلام", "السلم", "as-salam"] },
    { id: 6, keywords: ["المؤمن", "المومن", "مؤمن", "al-mu'min"] },
    { id: 7, keywords: ["المهيمن", "مهيمن", "المهمين", "al-muhaymin"] },
    { id: 8, keywords: ["العزيز", "عزيز", "العزز", "al-aziz"] },
    { id: 9, keywords: ["الجبار", "جبار", "الجيار", "al-jabbar"] },
    { id: 10, keywords: ["المتكبر", "متكبر", "الكبرياء", "al-mutakabbir"] },
    { id: 11, keywords: ["الخالق", "خالق", "الخلق", "al-khaliq"] },
    { id: 12, keywords: ["البارئ", "بارئ", "البارى", "al-bari"] },
    { id: 13, keywords: ["المصور", "مصور", "المسور", "al-musawwir"] },
    { id: 14, keywords: ["الغفار", "غفار", "الغفر", "al-gaffar"] },
    { id: 15, keywords: ["القهار", "قهار", "الكهار", "al-qahhar"] },
    { id: 16, keywords: ["الوهاب", "وهاب", "الوهااب", "al-wahhab"] },
    { id: 17, keywords: ["الرزاق", "رزاق", "الرازق", "ar-razzaq"] },
    { id: 18, keywords: ["الفتاح", "فتاح", "الفتح", "al-fattah"] },
    { id: 19, keywords: ["العليم", "عليم", "العلم", "al-alim"] },
    { id: 20, keywords: ["القابض", "قابض", "القبض", "al-qabid"] },
    { id: 21, keywords: ["الباسط", "باسط", "البسط", "al-basit"] },
    { id: 22, keywords: ["الخافض", "خافض", "الخفض", "al-khafid"] },
    { id: 23, keywords: ["الرافع", "رافع", "الرفع", "ar-rafi"] },
    { id: 24, keywords: ["المعز", "معز", "العز", "al-mu'izz"] },
    { id: 25, keywords: ["المذل", "مذل", "الذل", "al-mudhill"] },
    { id: 26, keywords: ["السميع", "سميع", "السمع", "as-sami"] },
    { id: 27, keywords: ["البصير", "بصير", "البصر", "al-basir"] },
    { id: 28, keywords: ["الحكم", "حكم", "الحاكم", "al-hakam"] },
    { id: 29, keywords: ["العدل", "عدل", "العادل", "al-adl"] },
    { id: 30, keywords: ["اللطيف", "لطيف", "اللطف", "al-latif"] },
    { id: 31, keywords: ["الخبير", "خبير", "الخبرة", "al-khabir"] },
    { id: 32, keywords: ["الحليم", "حليم", "الحلم", "al-halim"] },
    { id: 33, keywords: ["العظيم", "عظيم", "العظم", "al-azim"] },
    { id: 34, keywords: ["الغفور", "غفور", "الغفر", "al-ghafur"] },
    { id: 35, keywords: ["الشكور", "شكور", "الشكر", "ash-shakur"] },
    { id: 36, keywords: ["العلي", "علي", "العلو", "al-ali"] },
    { id: 37, keywords: ["الكبير", "كبير", "الكبر", "al-kabir"] },
    { id: 38, keywords: ["الحفيظ", "حفيظ", "الحافظ", "al-hafiz"] },
    { id: 39, keywords: ["المقيت", "مقيت", "المقت", "al-muqit"] },
    { id: 40, keywords: ["الحسيب", "حسيب", "الحساب", "al-hasib"] },
    { id: 41, keywords: ["الجليل", "جليل", "الجلال", "al-jalil"] },
    { id: 42, keywords: ["الكريم", "كريم", "الكرام", "al-karim"] },
    { id: 43, keywords: ["الرقيب", "رقيب", "الرقب", "ar-raqib"] },
    { id: 44, keywords: ["المجيب", "مجيب", "الاجابة", "al-mujib"] },
    { id: 45, keywords: ["الواسع", "واسع", "al-wasi"] },
    { id: 46, keywords: ["الحكيم", "حكيم", "الحكمة", "al-hakim"] },
    { id: 47, keywords: ["الودود", "ودود", "الود", "al-wadud"] },
    { id: 48, keywords: ["المجيد", "مجيد", "المجد", "al-majid"] },
    { id: 49, keywords: ["الباعث", "باعث", "البعث", "al-ba'ith"] },
    { id: 50, keywords: ["الشهيد", "شهيد", "ash-shahid"] },
    { id: 51, keywords: ["الحق", "حق", "الحقيقه", "al-haqq"] },
    { id: 52, keywords: ["الوكيل", "وكيل", "التوكل", "al-wakil"] },
    { id: 53, keywords: ["القوي", "قوي", "القوة", "al-qawiyy"] },
    { id: 54, keywords: ["المتين", "متين", "al-matin"] },
    { id: 55, keywords: ["الولي", "ولي", "الولاية", "al-waliyy"] },
    { id: 56, keywords: ["الحميد", "حميد", "الحمد", "al-hamid"] },
    { id: 57, keywords: ["المحصي", "محصي", "الاحصاء", "al-muhsi"] },
    { id: 58, keywords: ["المبدئ", "مبدئ", "المبدى", "al-mubdi"] },
    { id: 59, keywords: ["المعيد", "معيد", "الاعادة", "al-mu'id"] },
    { id: 60, keywords: ["المحيي", "محيي", "المحي", "al-muhyi"] },
    { id: 61, keywords: ["المميت", "مميت", "الموت", "al-mumit"] },
    { id: 62, keywords: ["الحي", "حي", "al-hayy"] },
    { id: 63, keywords: ["القيوم", "قيوم", "al-qayyum"] },
    { id: 64, keywords: ["الواجد", "واجد", "الوجود", "al-wajid"] },
    { id: 65, keywords: ["الماجد", "ماجد", "al-majid"] },
    { id: 66, keywords: ["الواحد", "واحد", "al-wahid"] },
    { id: 67, keywords: ["الصمد", "صمد", "as-samad"] },
    { id: 68, keywords: ["القادر", "قادر", "القدرة", "al-qadir"] },
    { id: 69, keywords: ["المقتدر", "مقتدر", "al-muqtadir"] },
    { id: 70, keywords: ["المقدم", "مقدم", "al-muqaddim"] },
    { id: 71, keywords: ["المؤخر", "مؤخر", "الموخر", "al-mu'akhkhir"] },
    { id: 72, keywords: ["الأول", "الاول", "اول", "al-awwal"] },
    { id: 73, keywords: ["الآخر", "الاخر", "اخر", "al-akhir"] },
    { id: 74, keywords: ["الظاهر", "ظاهر", "az-zahir"] },
    { id: 75, keywords: ["الباطن", "باطن", "al-batin"] },
    { id: 76, keywords: ["الوالي", "والي", "al-wali"] },
    { id: 77, keywords: ["المتعال", "المتعالي", "متعالي", "al-muta'ali"] },
    { id: 78, keywords: ["البر", "بر", "al-barr"] },
    { id: 79, keywords: ["التواب", "تواب", "التوبة", "at-tawwab"] },
    { id: 80, keywords: ["المنتقم", "منتقم", "الانتقام", "al-muntaqim"] },
    { id: 81, keywords: ["العفو", "عفو", "al-afuww"] },
    { id: 82, keywords: ["الرؤوف", "رؤوف", "الرؤف", "ar-ra'uf"] },
    { id: 83, keywords: ["مالك الملك", "ملك الملك", "malik-ul-mulk"] },
    { id: 84, keywords: ["ذو الجلال والإكرام", "الجلال والاكرام", "zul-jalali-wal-ikram"] },
    { id: 85, keywords: ["المقسط", "مقسط", "القسط", "al-muqsit"] },
    { id: 86, keywords: ["الجامع", "جامع", "al-jami"] },
    { id: 87, keywords: ["الغني", "غني", "al-ghaniyy"] },
    { id: 88, keywords: ["المغني", "مغني", "al-mughni"] },
    { id: 89, keywords: ["المانع", "مانع", "المنع", "al-mani"] },
    { id: 90, keywords: ["الضار", "ضار", "ad-darr"] },
    { id: 91, keywords: ["النافع", "نافع", "النفع", "an-nafi"] },
    { id: 92, keywords: ["النور", "نور", "an-nur"] },
    { id: 93, keywords: ["الهادي", "هادي", "الهدايه", "al-hadi"] },
    { id: 94, keywords: ["البديع", "بديع", "al-badi"] },
    { id: 95, keywords: ["الباقي", "باقي", "al-baqi"] },
    { id: 96, keywords: ["الوارث", "وارث", "al-warith"] },
    { id: 97, keywords: ["الرشيد", "ارشيد", "الراشد", "الراشيد", "ar-rashid"] },
    { id: 98, keywords: ["الصبور", "صبور", "الصبر", "as-sabur"] },
    { id: 99, keywords: ["الله", "الاله", "allah"] }
];

// ================= 2. ADVANCED RANKING ALGORITHMS ================= //

const SearchEngine = {
    normalize: function (text) {
        if (!text) return "";
        return text.toLowerCase()
            .replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
            .replace(/[ًٌٍَُِّْ]/g, '').trim();
    },

    // A. Jaro-Winkler Distance: الممتاز للترتيب (0.0 إلى 1.0)
    // بيدي أولوية للتطابق في أول الكلمة (Prefix Bonus)
    jaroWinkler: function (s1, s2) {
        let m = 0;
        if (s1.length === 0 || s2.length === 0) return 0;
        if (s1 === s2) return 1;

        let range = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1;
        let s1Matches = new Array(s1.length).fill(false);
        let s2Matches = new Array(s2.length).fill(false);

        for (let i = 0; i < s1.length; i++) {
            let low = (i >= range) ? i - range : 0;
            let high = (i + range <= s2.length - 1) ? i + range : s2.length - 1;
            for (let j = low; j <= high; j++) {
                if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
                    m++;
                    s1Matches[i] = s2Matches[j] = true;
                    break;
                }
            }
        }
        if (m === 0) return 0;
        let k = 0;
        let n_trans = 0;
        for (let i = 0; i < s1.length; i++) {
            if (s1Matches[i] === true) {
                for (let j = k; j < s2.length; j++) {
                    if (s2Matches[j] === true) {
                        k = j + 1;
                        if (s1[i] !== s2[j]) n_trans++;
                        break;
                    }
                }
            }
        }
        let weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3;
        let l = 0;
        let p = 0.1;
        if (weight > 0.7) {
            while (s1[l] === s2[l] && l < 4) l++;
            weight = weight + l * p * (1 - weight);
        }
        return weight;
    },

    // B. Trigrams: تقسيم الكلمة لمقاطع ثلاثية (السر لفهم هيكل الكلمة)
    // الراشيد -> الر - لرا - راش - اشي - شيد
    getTrigrams: function (text) {
        const trigrams = new Set();
        const padded = " " + text + " ";
        for (let i = 0; i < padded.length - 2; i++) {
            trigrams.add(padded.substring(i, i + 3));
        }
        return trigrams;
    },

    getTrigramScore: function (s1, s2) {
        const t1 = this.getTrigrams(s1);
        const t2 = this.getTrigrams(s2);
        let match = 0;
        t1.forEach(gram => { if (t2.has(gram)) match++; });
        return (2 * match) / (t1.size + t2.size);
    },

    // ================= 3. THE GIANT SEARCH FUNCTION ================= //
    search: function (query, allNames) {
        const normQuery = this.normalize(query);
        const results = new Map();

        SEARCH_INDEX.forEach(item => {
            const originalName = allNames.find(n => n.id === item.id);
            if (!originalName) return;

            let maxScore = 0;

            const candidates = [originalName.name, originalName.transliteration, ...item.keywords];

            candidates.forEach(keyword => {
                const normKey = this.normalize(keyword);

                // 1. التطابق التام (The Golden Match)
                if (normKey === normQuery) {
                    maxScore = Math.max(maxScore, 100);
                    return;
                }

                // 2. يحتوي عليه (في البداية أهم من الوسط)
                if (normKey.startsWith(normQuery)) {
                    maxScore = Math.max(maxScore, 90 + (query.length / keyword.length * 5));
                } else if (normKey.includes(normQuery)) {
                    maxScore = Math.max(maxScore, 80);
                }

                // 3. Jaro-Winkler + Trigrams (المقارنة الذكية)
                // دي اللي هتخلي "الراشيد" (0.95) تكسب "الوارث" (0.4)
                const jaro = this.jaroWinkler(normQuery, normKey);
                const tri = this.getTrigramScore(normQuery, normKey);

                // دمج السكورين بوزن نسبي
                const combinedScore = (jaro * 0.6 + tri * 0.4) * 100;

                // بونص لو الحروف الأساسية موجودة بنفس الترتيب
                if (jaro > 0.85) {
                    maxScore = Math.max(maxScore, combinedScore);
                }
            });

            // فلترة النتائج الضعيفة جداً
            if (maxScore > 65) {
                results.set(item.id, { ...originalName, score: maxScore });
            }
        });

        // الترتيب التنازلي حسب السكور (الأعلى فالأقل)
        return Array.from(results.values()).sort((a, b) => b.score - a.score);
    }
};
