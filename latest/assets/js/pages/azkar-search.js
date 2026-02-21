// نظام البحث الشامل والمتطور لصفحة الأذكار (يقرأ الموسوعة الكاملة - 135 قسم)
class AzkarSearchEngine {
    constructor() {
        this.categoriesData = [];
        this.currentResults = [];
        this.lastQuery = '';
        this.isReady = false;

        this.miniSearch = new MiniSearch({
            fields: ['text', 'category', 'extendedSearchText', 'translation', 'transliteration'],
            storeFields: ['id', 'category', 'categoryKey', 'text', 'transliteration', 'translation', 'reference', 'count', 'originalData'],
            
            searchOptions: {
                fuzzy: 0.2,
                prefix: true,
                boost: { category: 2, extendedSearchText: 1.5, text: 1 }
            },

            processTerm: (term) => {
                if (!term) return term;
                let normalized = term.toLowerCase();
                normalized = normalized.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
                normalized = normalized.replace(/[أإآ]/g, 'ا');
                normalized = normalized.replace(/ة/g, 'ه');
                normalized = normalized.replace(/ى/g, 'ي');
                if (normalized.length > 3 && normalized.startsWith('ال')) {
                    normalized = normalized.substring(2);
                }
                return normalized;
            }
        });

        this.init();
    }

    async init() {
        try {
            console.log('جاري بناء فهرس الموسوعة الشاملة (135 قسم) أوفلاين...');
            const startTime = performance.now();

            await this.loadAzkarCategories();
            this.addGiantDictionary();

            if (this.categoriesData.length > 0) {
                this.miniSearch.addAll(this.categoriesData);
            }

            const endTime = performance.now();
            this.isReady = true;
            console.log(`نظام البحث جاهز! تم فهرسة ${this.categoriesData.length} ذكر من الموسوعة في ${Math.round(endTime - startTime)} ملي ثانية.`);
        } catch (error) {
            console.error('خطأ في تحميل الموسوعة:', error);
        }
    }

    async loadAzkarCategories() {
        // قائمة ملفات الأذكار (الأسماء الصحيحة من المجلد)
        const coreCategories = [
            // --- أذكار أساسية ---
            "morning", "evening", "waking_up", "sleep",
            "toilet", "ablution_after", "mosque_enter", "mosque_exit", "mosque_go",
            "prayer", "roqya", "distress", "sadness", "sickness", "travel",
            "travel_ride", "market", "home", "food", "hajj", "rooster",
            "thunder", "wind", "rain", "crescent", "istisqa",
            
            // --- أذكار الصلاة ---
            "adhan", "istiftah", "ruku", "rising_from_ruku", "sujood",
            "sitting_between_sujood", "sajdah_tilawah", "tashahhud", "after_tashahhud",
            "witr_qunut", "istikhara",
            
            // --- أذكار متنوعة ---
            "clothes", "new_clothes", "undressing", "debt", "anger", "happiness",
            "devil", "whisper", "difficult_affair", "calamity", "dying", "burial",
            "graves_visit", "talqin", "condolence", "tasbeeh", "dajjal", "wonder",
            "sneezing", "istighfar", "salam",
            
            // --- ملفات إضافية ---
            "black_stone", "jamarat", "safa_marwa", "arafah", "breaking_fast",
            "newborn", "sexual_intercourse", "slaughter", "buying_animal_wife",
            "entering_town", "traveler_dawn", "resident_to_traveler", "traveler_to_resident",
            "stumbling_mount", "barking_dogs", "bad_omens", "night_waking_dhikr",
            "turning_in_bed", "stopping_place", "early_fruit", "clearing_clouds",
            "after_rain", "after_burial", "after_sin", "after_witr", "fear_shirk",
            "fear_evil_eye", "fear_people", "abused_person", "seeing_afflicted",
            "protecting_children", "against_enemy", "devils_plot", "panic",
            "unpleasant_event", "paying_debt", "visiting_sick", "praising_muslim",
            "reply_jazak_allah", "reply_barak_allah", "reply_forgive_you",
            "reply_love_allah", "reply_money_offer", "replying_non_muslim",
            "congrats_newlywed", "happy_event", "being_praised", "general_manners",
            "sitting_gathering", "how_to_tasbeeh", "kaffarat_majlis", "fasting_insult",
            "mashar_haram", "answered_prayers"
        ];

        const fetchPromises = [];

        for (const category of coreCategories) {
            fetchPromises.push(this.fetchAndProcessCategory(category));
        }

        await Promise.all(fetchPromises);
    }

    async fetchAndProcessCategory(categoryKey) {
        try {
            const response = await fetch(`../azkar/json/${categoryKey}.json`);
            if (response.ok) {
                const data = await response.json();
                this.processCategoryData(categoryKey, data);
            }
        } catch (error) {
            // صامت
        }
    }

    processCategoryData(categoryKey, data) {
        const categoryName = data.title || this.getCategoryName(categoryKey);
        let itemsToProcess = [];

        if (data.data && Array.isArray(data.data)) {
            itemsToProcess = data.data; 
        } else if (Array.isArray(data)) {
            itemsToProcess = data;
        }

        if (itemsToProcess.length === 0) return;
        
        itemsToProcess.forEach((zikr, index) => {
            this.categoriesData.push({
                id: `zikr_${categoryKey}_${index}`,
                category: categoryName,
                categoryKey: categoryKey,
                title: categoryName,
                text: zikr.zekr || zikr.text || '',
                transliteration: zikr.transliteration || '',
                translation: zikr.translation || '',
                reference: zikr.reference || zikr.source || '',
                count: zikr.count || zikr.repeat || 1,
                originalData: zikr,
                extendedSearchText: ''
            });
        });
    }

    getCategoryName(key) {
        const names = {
            'morning': 'أذكار الصباح',
            'evening': 'أذكار المساء',
            'mosque_enter': 'أذكار المسجد',
            'ablution_after': 'أذكار الوضوء',
            'adhan': 'أذكار الأذان',
            'hajj': 'أذكار الحج',
            'waking_up': 'أذكار الاستيقاظ',
            'sleep': 'أذكار النوم',
            'clothes': 'أذكار اللباس',
            'food': 'أذكار الطعام',
            'home': 'أذكار المنزل',
            'travel': 'أذكار السفر',
            'market': 'أذكار السوق',
            'roqya': 'الرقية الشرعية',
            'sickness': 'المرضى والعيادة',
            'prophets_duas': 'أدعية الأنبياء',
            'quran_duas': 'أدعية قرآنية'
        };
        return names[key] || 'أذكار';
    }

    addGiantDictionary() {
        const categorySynonyms = {
            'travel': ['طريق', 'تحرك', 'عربيه', 'سياره', 'مواصلات', 'سواق', 'قطار', 'طياره', 'مسافر', 'رايح', 'مشوار', 'قياده', 'ركوب', 'دابه', 'travel', 'trip', 'journey', 'car', 'road'],
            'home': ['بيت', 'شقه', 'سكن', 'دار', 'داخل', 'طالع', 'خارج', 'مروح', 'رجوع', 'home', 'house', 'leaving', 'entering'],
            'market': ['مول', 'دكان', 'محل', 'شراء', 'بيع', 'شوبينج', 'فلوس', 'بشتري', 'تسوق', 'market', 'shopping', 'buy', 'mall', 'store'],
            'sleep': ['سرير', 'تعبان', 'هنام', 'نعسان', 'قلق', 'كابوس', 'احلام', 'حلم', 'sleep', 'bed', 'tired', 'nightmare', 'dream'],
            'waking_up': ['صحيت', 'صحيان', 'فقت', 'قمت', 'صباح الخير', 'wake up', 'awake', 'morning'],
            'morning': ['فجر', 'صبح', 'شروق', 'نهار', 'اصطباحه', 'بدايه اليوم', 'morning', 'sunrise', 'dawn'],
            'evening': ['مغرب', 'عشاء', 'ليل', 'عتمه', 'غروب', 'نهايه اليوم', 'evening', 'night', 'sunset'],
            'sadness': ['حزين', 'مكتئب', 'مخنوق', 'متضايق', 'قلقان', 'خايف', 'توتر', 'هم', 'غم', 'كرب', 'زعلان', 'مهموم', 'بكي', 'sad', 'depressed', 'anxious', 'fear'],
            'roqya': ['عين', 'حسد', 'سحر', 'مس', 'شيطان', 'تحصين', 'حفظ', 'وقايه', 'مرض', 'تعب', 'عيا', 'شفا', 'protection', 'evil eye', 'magic', 'sick', 'illness'],
            'ablution_after': ['مياه', 'طهاره', 'غسل', 'استحمام', 'نظافه', 'وضوء', 'ablution', 'wash', 'clean', 'wudu'],
            'mosque_enter': ['جامع', 'زاويه', 'صلاه', 'إقامه', 'فرض', 'خطبه', 'mosque', 'prayer', 'salah', 'masjid'],
            'adhan': ['مؤذن', 'سمعت الاذان', 'إقامه', 'اقامه', 'adhan', 'call to prayer'],
            'hajj': ['عمره', 'مكه', 'طواف', 'سعي', 'إحرام', 'كعبه', 'hajj', 'umrah', 'makkah', 'kaaba'],
            'food': ['اكل', 'شرب', 'جعان', 'عطشان', 'فطار', 'غداء', 'عشا', 'وجبه', 'food', 'eat', 'drink', 'hungry', 'meal'],
            'clothes': ['هدوم', 'طقم', 'قميص', 'لبس جديد', 'بلبس', 'بقلع', 'clothes', 'wear', 'dress', 'outfit'],
            'wind': ['مطر', 'شتاء', 'رعد', 'برق', 'ريح', 'هوا', 'عاصفه', 'زلزال', 'rain', 'wind', 'storm', 'thunder', 'weather'],
            'istikhara': ['حيره', 'محتار', 'قرار', 'مش عارف اختار', 'اختيار', 'istikhara', 'choice', 'decision']
        };

        this.categoriesData.forEach(item => {
            let extendedText = '';
            const key = item.categoryKey;
            
            if (categorySynonyms[key]) {
                extendedText += ' ' + categorySynonyms[key].join(' ');
            }
            
            let searchableBase = (item.text + ' ' + item.translation).toLowerCase();
            
            if (searchableBase.includes('توب') || searchableBase.includes('استغفر') || searchableBase.includes('ذنب')) {
                extendedText += ' توبه ندم معصيه غلطت';
            }
            if (searchableBase.includes('حمد') || searchableBase.includes('شكر')) {
                extendedText += ' شكر نعمه رزق نجاح';
            }
            if (searchableBase.includes('دعا') || searchableBase.includes('اللهم')) {
                extendedText += ' يارب مسأله طلب رجاء';
            }
            
            item.extendedSearchText = extendedText;
        });
    }

    search(query) {
        if (!this.isReady) return [];
        if (!query || query.trim().length < 2) {
            this.currentResults = [];
            return [];
        }
        const results = this.miniSearch.search(query);
        this.currentResults = results.slice(0, 100); 
        return this.currentResults;
    }

    displayResults(results, containerId = 'modalResultsBody') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; color:var(--text-muted); margin-top:50px; font-family:'Amiri';">
                    <i class="fas fa-search" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px; display:block;"></i>
                    لم يتم العثور على أذكار مطابقة لبحثك في الموسوعة الشاملة.
                </div>
            `;
            return;
        }

        let html = '<div class="search-results-list">';
        const grouped = {};
        
        results.forEach(result => {
            if (!grouped[result.category]) grouped[result.category] = [];
            grouped[result.category].push(result);
        });

        Object.keys(grouped).forEach(category => {
            html += `
                <div class="search-category-header" style="margin: 20px 0 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; font-weight: bold; color: var(--primary); border: 1px solid var(--border);">
                    📖 ${category} (${grouped[category].length} نتيجة)
                </div>
            `;
            grouped[category].forEach(result => {
                html += this.renderResultItem(result);
            });
        });

        html += '</div>';
        container.innerHTML = html;
    }

    renderResultItem(result) {
        const arabicFont = "'Amiri Quran', 'Scheherazade New', serif";
        const textFont = "'Amiri', serif";

        // توحيد الألوان باستخدام الثيم (الذهبي/الأخضر الفاتح) بدلاً من المهرجان
        let iconHtml = '<i class="fas fa-praying-hands" style="color: var(--primary);"></i>';
        let bgStyle = 'rgba(212, 175, 55, 0.1)';

        return `
            <div class="search-result-item" onclick="azkarSearch.selectResult('${result.id}')" 
                 style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 15px; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: 0.2s;">
                <div class="result-header" style="display: flex; align-items: flex-start; gap: 12px;">
                    <div class="result-icon" style="background: ${bgStyle}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                        ${iconHtml}
                    </div>
                    <div class="result-info" style="flex: 1;">
                        <h4 class="result-title" style="color: #fff; font-family: ${textFont}; margin: 0 0 8px 0; font-size: 16px;">
                            ${this.highlightMatch(result.category, this.lastQuery)}
                        </h4>
                        <div class="result-text" style="font-family: ${arabicFont}; font-size: 18px; line-height: 1.8; color: #e2e8f0; margin-bottom: 10px; direction: rtl; text-align: right;">
                            ${this.highlightMatch(result.text.substring(0, 150) + (result.text.length > 150 ? '...' : ''), this.lastQuery)}
                        </div>
                        ${result.reference ? `
                        <div class="result-translation" style="font-family: ${textFont}; font-size: 12px; color: var(--primary); margin-bottom: 8px; direction: rtl; text-align: right;">
                            <i class="fas fa-book"></i> المرجع: ${result.reference}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    highlightMatch(text, query) {
        if (!query || !text) return text;
        try {
            let safeQuery = query.replace(/^ال/, '');
            if(safeQuery.length < 2) safeQuery = query;

            const regex = new RegExp(`(${this.escapeRegExp(safeQuery)})`, 'gi');
            return text.replace(regex, '<mark style="background: var(--primary); color: #000; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        } catch (e) {
            return text;
        }
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // الدالة الذكية للقفز لرقم الذكر
    selectResult(resultId) {
        const result = this.currentResults.find(r => r.id === resultId);
        if (!result) return;

        // نحفظ اسم القسم ورقمه الدقيق
        const exactIndex = parseInt(result.id.split('_').pop());
        
        localStorage.setItem('search_selected_zikr', JSON.stringify({
            category: result.categoryKey,
            index: exactIndex
        }));

        window.location.href = '../azkar/azkar_player.html';
        this.closeSearchModal();
    }

    openSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('visible');
                const input = document.getElementById('modalSearchInput');
                if (input) input.focus();
            }, 10);
        }
    }

    closeSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    handleSearch(query) {
        this.lastQuery = query.toLowerCase().trim();
        const results = this.search(this.lastQuery);
        this.displayResults(results);
        
        const searchBtn = document.getElementById('searchActionBtn');
        if (searchBtn) {
            if (results.length > 0) {
                searchBtn.classList.add('active');
                searchBtn.textContent = `عرض ${Math.min(results.length, 100)} نتيجة`;
            } else {
                searchBtn.classList.remove('active');
                searchBtn.textContent = 'ابحث';
            }
        }
    }
}

let azkarSearch;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MiniSearch === 'undefined') {
        console.error('مكتبة MiniSearch غير موجودة. تأكد من تحميلها محلياً في مجلد libs');
        return;
    }

    azkarSearch = new AzkarSearchEngine();
    
    const searchInput = document.getElementById('modalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            azkarSearch.handleSearch(e.target.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const results = azkarSearch.currentResults;
                if (results.length > 0) {
                    azkarSearch.selectResult(results[0].id);
                }
            }
        });
    }
});

function openAzkarSearchModal() {
    if (azkarSearch) {
        azkarSearch.openSearchModal();
    } else {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10);
        }
    }
}

function closeAzkarSearchModal() {
    if (azkarSearch) {
        azkarSearch.closeSearchModal();
    } else {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }
}