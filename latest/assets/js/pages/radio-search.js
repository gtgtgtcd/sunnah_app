// نظام البحث الشامل لصفحة الراديو
class RadioSearchEngine {
    constructor() {
        this.stationsData = [];
        this.podcastsData = [];
        this.recitersData = [];
        this.searchIndex = [];
        this.currentResults = [];
        this.init();
    }

    async init() {
        try {
            // تحميل بيانات الإذاعات والبودكاست
            await this.loadStationsData();  // This method loads both stations and podcasts
            await this.buildSearchIndex();
            console.log('نظام البحث جاهز!');
        } catch (error) {
            console.error('خطأ في تحميل بيانات البحث:', error);
        }
    }

    // تحميل بيانات الإذاعات من HTML
    async loadStationsData() {
        // جمع بيانات الإذاعات من بطاقات الصفحة
        const stationCards = document.querySelectorAll('.station-card');
        this.stationsData = Array.from(stationCards).map(card => {
            const img = card.querySelector('.station-img');
            const title = card.querySelector('h4');
            const desc = card.querySelector('p');
            
            return {
                id: `station_${Math.random().toString(36).substr(2, 9)}`,
                type: 'station',
                title: title?.textContent.trim() || '',
                description: desc?.textContent.trim() || '',
                image: img?.src || '',
                element: card,
                searchableText: `${title?.textContent} ${desc?.textContent}`.toLowerCase()
            };
        });

        // جمع بيانات البودكاست
        const podcastCards = document.querySelectorAll('.podcast-card');
        this.podcastsData = Array.from(podcastCards).map(card => {
            const title = card.querySelector('.pod-title');
            const meta = card.querySelector('.pod-meta');
            
            return {
                id: `podcast_${Math.random().toString(36).substr(2, 9)}`,
                type: 'podcast',
                title: title?.textContent.trim() || '',
                description: meta?.textContent.trim() || '',
                element: card,
                searchableText: `${title?.textContent} ${meta?.textContent}`.toLowerCase()
            };
        });

        console.log(`تم تحميل ${this.stationsData.length} إذاعة و${this.podcastsData.length} بودكاست`);
    }

    // بناء فهرس البحث
    async buildSearchIndex() {
        this.searchIndex = [
            ...this.stationsData.map(item => ({
                ...item,
                category: 'الإذاعات',
                priority: 1
            })),
            ...this.podcastsData.map(item => ({
                ...item,
                category: 'البودكاست',
                priority: 2
            }))
        ];

        // إضافة كلمات مفتاحية إضافية
        this.addKeywords();
        console.log('فهرس البحث جاهز:', this.searchIndex.length, 'عنصر');
    }

    // إضافة كلمات مفتاحية للبحث المحسن
    addKeywords() {
        const keywordsMap = {
            // كلمات للبحث في القراء
            'القارئ': ['قارئ', 'شيخ', 'مقرئ', 'تلاوة'],
            'الإذاعة': ['إذاعة', 'م电台', 'بث', 'مباشر'],
            'القرآن': ['قرآن', 'كتاب', 'الله', 'آيات'],
            // كلمات حسب البلدان
            'مصر': ['القاهرة', 'مصر', 'ماسبيرو'],
            'السعودية': ['الرياض', 'السعودية', 'المدينة'],
            'الكويت': ['الكويت', 'دولة الكويت'],
            'الإمارات': ['الشارقة', 'أبوظبي', 'الإمارات'],
            'عمان': ['مسقط', 'سلطنة عمان'],
            'فلسطين': ['نابلس', 'فلسطين'],
            'لبنان': ['بيروت', 'لبنان']
        };

        this.searchIndex.forEach(item => {
            let extendedText = item.searchableText;
            
            // إضافة كلمات مرتبطة بالمحتوى
            Object.keys(keywordsMap).forEach(keyword => {
                if (item.title.includes(keyword) || item.description.includes(keyword)) {
                    extendedText += ' ' + keywordsMap[keyword].join(' ');
                }
            });
            
            item.extendedSearchText = extendedText;
        });
    }

    // البحث في البيانات
    search(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        this.searchIndex.forEach(item => {
            const searchText = item.extendedSearchText || item.searchableText;
            
            // حساب درجة التطابق
            let score = 0;
            
            // تطابق كامل في العنوان (أعلى أولوية)
            if (item.title.toLowerCase().includes(searchTerm)) {
                score += 100;
            }
            
            // تطابق في الوصف
            if (item.description.toLowerCase().includes(searchTerm)) {
                score += 50;
            }
            
            // تطابق جزئي في النص الموسّع
            if (searchText.includes(searchTerm)) {
                score += 20;
            }
            
            // تطابق كلمات مفتاحية
            const words = searchTerm.split(' ');
            words.forEach(word => {
                if (searchText.includes(word)) {
                    score += 10;
                }
            });

            if (score > 0) {
                results.push({
                    ...item,
                    score: score,
                    matchedQuery: searchTerm
                });
            }
        });

        // ترتيب النتائج حسب الدرجة
        results.sort((a, b) => b.score - a.score);
        this.currentResults = results.slice(0, 50); // حد أقصى 50 نتيجة
        
        return this.currentResults;
    }

    // عرض نتائج البحث
    displayResults(results, containerId = 'modalResultsBody') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; color:var(--text-muted); margin-top:50px; font-family:'Amiri';">
                    <i class="fas fa-search" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px; display:block;"></i>
                    لم يتم العثور على نتائج لبحثك
                </div>
            `;
            return;
        }

        let html = '<div class="search-results-list">';
        
        // تجميع النتائج حسب الفئة
        const grouped = {};
        results.forEach(result => {
            if (!grouped[result.category]) {
                grouped[result.category] = [];
            }
            grouped[result.category].push(result);
        });

        // عرض النتائج مجمعة
        Object.keys(grouped).forEach(category => {
            html += `<div class="search-category-header">${category}</div>`;
            
            grouped[category].forEach(result => {
                html += this.renderResultItem(result);
            });
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // تصميم عنصر نتيجة البحث
    renderResultItem(result) {
        let icon, bgColor;
        
        switch(result.type) {
            case 'station':
                icon = '📻';
                bgColor = 'rgba(79, 240, 183, 0.1)';
                break;
            case 'podcast':
                icon = '🎙️';
                bgColor = 'rgba(212, 175, 55, 0.1)';
                break;
            default:
                icon = '🎵';
                bgColor = 'rgba(255, 255, 255, 0.05)';
        }

        return `
            <div class="search-result-item" onclick="radioSearch.selectResult('${result.id}')">
                <div class="result-header">
                    <div class="result-icon" style="background:${bgColor}">${icon}</div>
                    <div class="result-info">
                        <h4 class="result-title">${this.highlightMatch(result.title, result.matchedQuery)}</h4>
                        <p class="result-desc">${this.highlightMatch(result.description, result.matchedQuery)}</p>
                    </div>
                </div>
                <div class="result-score">درجة التطابق: ${result.score}</div>
            </div>
        `;
    }

    // تمييز الكلمات المطابقة
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // اختيار نتيجة البحث
    selectResult(resultId) {
        const result = this.currentResults.find(r => r.id === resultId);
        if (!result) return;

        // التمرير إلى العنصر في الصفحة
        if (result.element) {
            result.element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // إضواء العنصر مؤقتًا
            result.element.style.transform = 'scale(1.05)';
            result.element.style.boxShadow = '0 0 20px var(--primary)';
            result.element.style.transition = 'all 0.3s';
            
            setTimeout(() => {
                result.element.style.transform = '';
                result.element.style.boxShadow = '';
            }, 2000);
        }

        // إغلاق نافذة البحث
        this.closeSearchModal();
    }

    // فتح نافذة البحث - تم الإصلاح هنا بإضافة كلاس visible
    openSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.style.display = 'flex';
            // استخدام setTimeout صغير لضمان تطبيق display: flex قبل تفعيل كلاس الأنيميشن
            setTimeout(() => {
                modal.classList.add('visible');
                const input = document.getElementById('modalSearchInput');
                if (input) input.focus();
            }, 10);
        }
    }

    // إغلاق نافذة البحث - تم الإصلاح هنا بإزالة كلاس visible
    closeSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('visible');
            // انتظار انتهاء الأنيميشن قبل إخفاء العنصر تماماً
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // معالجة البحث في الوقت الحقيقي
    handleSearch(query) {
        const results = this.search(query);
        this.displayResults(results);
        
        // تحديث زر البحث
        const searchBtn = document.getElementById('searchActionBtn');
        if (searchBtn) {
            // تفعيل زر البحث عند إدخال أي نص (حرفين أو أكثر)
            if (query && query.trim().length >= 2) {
                searchBtn.classList.add('active');
                if (results.length > 0) {
                    searchBtn.textContent = `عرض ${Math.min(results.length, 50)} نتيجة`;
                } else {
                    searchBtn.textContent = 'ابحث';
                }
            } else {
                searchBtn.classList.remove('active');
                searchBtn.textContent = 'ابحث';
            }
        }
    }
}

// تهيئة محرك البحث عند تحميل الصفحة
let radioSearch;

document.addEventListener('DOMContentLoaded', () => {
    radioSearch = new RadioSearchEngine();
    
    // ربط أحداث البحث
    const searchInput = document.getElementById('modalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            radioSearch.handleSearch(e.target.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const results = radioSearch.currentResults;
                if (results.length > 0) {
                    radioSearch.selectResult(results[0].id);
                }
            }
        });
    }
});

// دوال عامة للوصول من HTML - تم تحسينها لتكون أكثر أماناً
function openRadioSearchModal() {
    if (radioSearch) {
        radioSearch.openSearchModal();
    } else {
        // بديل للطوارئ إذا لم يكن المحرك جاهزاً بعد
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('visible'), 10);
        }
    }
}

function closeRadioSearchModal() {
    if (radioSearch) {
        radioSearch.closeSearchModal();
    } else {
        // بديل للطوارئ
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }
}