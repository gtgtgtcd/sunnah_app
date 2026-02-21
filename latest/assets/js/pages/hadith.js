
import { initSidebar } from '../components/sidebar.js';

// Initialize Sidebar Logic for Hadith Page
initSidebar('hadith');

// ==========================================
// 🛠️ UI & FAVORITES SYSTEM
// ==========================================
const UI = {
    fontSize: 24,

    // 1. التحكم بالخط
    changeFontSize(amount) {
        this.fontSize += amount;
        if (this.fontSize < 16) this.fontSize = 16;
        if (this.fontSize > 40) this.fontSize = 40;
        document.documentElement.style.setProperty('--hadith-font-size', this.fontSize + 'px');
        localStorage.setItem('hadith_font_size', this.fontSize);
    },

    // 2. تحميل الخط المحفوظ عند البدء
    initFont() {
        const saved = localStorage.getItem('hadith_font_size');
        if (saved) {
            this.fontSize = parseInt(saved);
            document.documentElement.style.setProperty('--hadith-font-size', this.fontSize + 'px');
        }
    },

    // 3. التبديل بين الكتب والمفضلة
    switchTab(tab, btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tab === 'books') {
            document.getElementById('booksView').style.display = 'block';
            document.getElementById('sectionsView').style.display = 'none';
            if (HadithEngine.data.currentBook) {
                // Keep current view
            } else {
                HadithEngine.renderWelcomeScreen();
            }
        } else {
            document.getElementById('booksView').style.display = 'none';
            document.getElementById('sectionsView').style.display = 'none';
            this.renderFavorites();
        }
    },

    // 4. إدارة المفضلة
    toggleFavorite(btn) {
        const card = btn.closest('.hadith-card');

        const hadithData = {
            id: card.querySelector('.hadith-number').innerText,
            text: card.querySelector('.hadith-text').innerHTML,
            number: card.querySelector('.hadith-number').innerText,
            grade: card.querySelector('.grade-badge') ? card.querySelector('.grade-badge').outerHTML : '',
            book: document.getElementById('selectedBookLabel').innerText || "المفضلة",
            ref: card.querySelector('.source-tag').innerText
        };

        let favs = JSON.parse(localStorage.getItem('fav_hadiths') || "[]");
        const existsIndex = favs.findIndex(h => h.id === hadithData.id && h.text === hadithData.text);

        if (existsIndex > -1) {
            favs.splice(existsIndex, 1);
            btn.classList.remove('active');
            this.showToast('تم الحذف من المفضلة 💔');
            if (document.querySelector('.tab-btn:nth-child(2)').classList.contains('active')) {
                this.renderFavorites();
            }
        } else {
            favs.push(hadithData);
            btn.classList.add('active');
            this.showToast('تم الحفظ في المفضلة ❤');
        }
        localStorage.setItem('fav_hadiths', JSON.stringify(favs));
    },

    // 5. رسم المفضلة
    renderFavorites() {
        const container = document.getElementById('hadithGrid');
        const favs = JSON.parse(localStorage.getItem('fav_hadiths') || "[]");

        container.innerHTML = '';

        // اللافتة المعلقة (تصميمك)
        const hangingSign = `<div class="hanging-container" style="grid-column: 1 / -1;"><div class="sign-wrapper"><div class="chain left"></div><div class="chain right"></div><div class="wooden-sign"><div class="sign-content">المفضلة (${favs.length})</div></div></div></div>`;
        container.innerHTML += hangingSign;

        if (favs.length === 0) {
            container.innerHTML += `<div style="text-align:center; color:#666; margin-top:50px; grid-column: 1 / -1;">لا توجد أحاديث محفوظة بعد</div>`;
            return;
        }

        favs.forEach(h => {
            const card = document.createElement('div');
            card.className = 'hadith-card';
            card.innerHTML = `
                    <div class="card-inner-frame">
                        <div class="card-header">
                            ${h.grade}
                            <span class="hadith-number">${h.number}</span>
                        </div>
                        <div class="hadith-text">${h.text}</div>
                        <div class="card-footer">
                            <span class="source-tag">${h.ref}</span>
                            <div class="card-actions">
                                <button class="btn-fav active" onclick="UI.toggleFavorite(this)"><i class="fas fa-heart"></i></button>
                                <button class="btn-share" onclick="shareHadithText(this)"><i class="fas fa-share-alt"></i></button>
                                <button class="btn-camera-glow" onclick="generateHadithPost(this)"><i class="fas fa-camera"></i></button>
                                <button class="btn-copy" onclick="navigator.clipboard.writeText(this.closest('.hadith-card').querySelector('.hadith-text').innerText); UI.showToast('تم النسخ')"><i class="fas fa-copy"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            container.appendChild(card);
        });
    },

    showToast(msg) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

window.addEventListener('DOMContentLoaded', () => UI.initFont());

// ==========================================
// 🏛️ محرك الحديث
// ==========================================
const HadithEngine = {
    config: {
        infoPath: '../assets/data/hadith/info.json',
        // 👇👇 التعديل هنا: حطينا رابط جيت هب المباشر اللي فيه ملفات الـ JSON 👇👇
        booksDir: 'https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/refs/heads/main/hadith-api-1/editions'
    },
    data: {
        currentBook: null,
        allHadiths: [],
        renderedCount: 0,
        currentSectionName: '',
        isPaginationLoad: false,
        scrollHandlerAttached: false
    },
    booksMap: [
        { id: 'ara-bukhari', name: 'صحيح البخاري', type: 'main' },
        { id: 'ara-muslim', name: 'صحيح مسلم', type: 'main' },
        { id: 'ara-abudawud', name: 'سنن أبي داود', type: 'main' },
        { id: 'ara-tirmidhi', name: 'جامع الترمذي', type: 'main' },
        { id: 'ara-nasai', name: 'سنن النسائي', type: 'main' },
        { id: 'ara-ibnmajah', name: 'سنن ابن ماجه', type: 'main' },
        { id: 'ara-malik', name: 'موطأ مالك', type: 'other' },
        { id: 'ara-nawawi', name: 'الأربعون النووية', type: 'other' },
        { id: 'ahmed', name: 'مسند الإمام أحمد بن حنبل', type: 'other' },
        { id: 'ara-qudsi', name: 'الأحاديث القدسية', type: 'other' },
        { id: 'ara-dehlawi', name: 'أربعون الدهلوي', type: 'other' }
    ],

    // ============================================================
    // 🚀 محرك البحث الذكي الشامل (The Hunter Engine)
    // ============================================================

    normalizeText(text) {
        if (!text) return "";
        text = text.toString();

        // 1. إزالة التشكيل والتطويل
        text = text.replace(/[\u064B-\u065F\u0670\u0640]/g, "");

        // 2. توحيد الألفات والهمزات
        text = text.replace(/[\u0622\u0623\u0625\u0671]/g, "ا");
        text = text.replace(/ؤ/g, "و");
        text = text.replace(/ئ/g, "ي");
        text = text.replace(/ء/g, "");

        // 3. توحيد التاء المربوطة والهاء
        text = text.replace(/ة/g, "ه");
        text = text.replace(/ى/g, "ي");

        // 4. (جديد) توحيد المتشابهات الصوتية (عشان "ضل" و "ظل")
        text = text.replace(/ظ/g, "ض");
        text = text.replace(/ذ/g, "ز");
        text = text.replace(/ث/g, "س");

        // 6. تنظيف الرموز
        text = text.replace(/[^\u0600-\u06FF\s0-9]/g, " ");
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    },

    // ============================================================
    // 🔎 إدارة مودال البحث (Search Modal Logic)
    // ============================================================

    // فتح المودال
    openSearchModal() {
        MobileNav.pushState('searchModal');
        const modal = document.getElementById('searchModal');

        // تعديل: نظهره الأول
        modal.style.display = 'flex';

        // استنى لحظة صغيرة عشان الأنيميشن يشتغل (خدعة CSS)
        setTimeout(() => {
            modal.classList.add('visible');
            document.getElementById('modalSearchInput').focus();
        }, 10);
    },

    // إغلاق المودال
    closeSearchModal() {
        const modal = document.getElementById('searchModal');
        modal.classList.remove('visible');

        // استنى الأنيميشن يخلص وبعدين اخفيه تماماً
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // نفس مدة الـ transition في الـ CSS

        // تفريغ النتائج
        document.getElementById('modalSearchInput').value = '';
        document.getElementById('modalResultsBody').innerHTML = `
            <div style="text-align:center; color:var(--text-muted); margin-top:50px; font-family:'Amiri';">
                <i class="fas fa-search" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px; display:block; margin-left: auto; margin-right: auto;"></i>
                ابدأ بكتابة حديث أو كلمة للبحث عنها في جميع الكتب
            </div>`;
    },

    // 🚀 دالة الفتح السريع: تفتح الكتاب وتدخل على أول قسم فوراً
    async openBookDirectly(bookId, bookName) {
        // 1. نعرض لودينج عشان المستخدم يحس باستجابة
        const container = document.getElementById('hadithGrid');
        container.innerHTML = `<div style="height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--royal-gold);">
            <i class="fas fa-circle-notch fa-spin fa-3x"></i>
            <h3 style="margin-top:20px; font-family:'Kufam', sans-serif; font-weight:900; font-style:italic; letter-spacing:normal;">جاري فتح ${bookName}...</h3>
        </div>`;

        // 2. استدعاء الدالة الأساسية عشان تجهز القائمة الجانبية (مهم جداً عشان التنقل بعد كدة)
        // ونستنى لما تخلص وترجعلنا أقسام الكتاب
        const sections = await this.loadBookSections(bookId, bookName);

        // 3. نجيب "مفتاح" أول قسم في الكتاب (أول ID)
        // Object.keys بيرجع مصفوفة فيها كل الـ IDs، بناخد رقم [0]
        const firstSectionId = Object.keys(sections)[0];

        if (firstSectionId) {
            const firstSectionName = sections[firstSectionId];

            // 4. نحمل أحاديث القسم ده فوراً
            await this.loadHadiths(firstSectionId, firstSectionName);

            // 5. نحدث الرابط فوق عشان لو عمل Refresh يرجع لنفس المكان
            this.updateURL(bookId, firstSectionId);
        } else {
            // لو الكتاب مفيهوش أقسام (زي حالة خطأ)، نكتب رسالة
            container.innerHTML = '<div style="text-align:center; padding:20px;">عذراً، لم يتم العثور على أقسام في هذا الكتاب</div>';
        }
    },

    // دالة البحث الشامل (نظام النقاط)
    async handleGlobalSearch(query) {
        const list = document.getElementById('modalResultsBody');

        // لو الكلام قليل، نعرض الرسالة الافتراضية
        if (!query || query.length < 2) {
            list.innerHTML = `
                <div style="text-align: center; color: #64748b; margin-top: 20px;">
                    <i class="fas fa-bolt" style="font-size: 2rem; opacity: 0.5; margin-bottom: 10px; color: var(--royal-gold);"></i>
                    <p>اكتب للبحث الفوري...</p>
                </div>`;
            return;
        }

        list.innerHTML = '<div style="padding:20px; text-align:center; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i></div>';

        const priorityBooks = [
            'ara-bukhari', 'ara-muslim',
            'ahmed', // 🌟 اسم الملف الجديد
            'ara-abudawud', 'ara-tirmidhi', 'ara-nasai', 'ara-ibnmajah',
            'ara-malik', 'ara-nawawi'
        ];

        let allMatches = [];
        const normalizedQuery = this.normalizeText(query);
        const searchTerms = normalizedQuery.split(" ").filter(t => t.length > 1);

        const searchPromises = priorityBooks.map(async (bookId) => {
            try {
                // ========================================================
                // 🌟 تحديد المسار بذكاء
                // ========================================================
                let path;
                if (bookId === 'ahmed') path = `${this.config.booksDir}/ara-ahmad.json`;
                else path = `${this.config.booksDir}/${bookId}.json`;

                // 👇👇 ضيف السطر ده هنا عشان يكشفلنا المستور 👇👇
                if (bookId === 'ahmed') console.log("🚀 بحاول أحمل ملف أحمد من المسار:", path);

                const res = await fetch(path);

                // 👇👇 وضيف ده كمان 👇👇
                if (bookId === 'ahmed' && res.ok) console.log("✅ تم تحميل ملف أحمد بنجاح! وجاري البحث داخله...");

                if (!res.ok) {
                    if (bookId === 'ahmed') console.error("❌ فشل تحميل ملف أحمد! تأكد من المسار واسم الملف");
                    return;
                }
                const data = await res.json();

                // دعم الصيغ المختلفة للملفات
                let hadiths = Array.isArray(data) ? data : (data.hadiths || []);

                // الفلترة الذكية (Scoring)
                // التعديل: بناخد ترتيب الحديث (index) معانا عشان الملفات اللي مفهاش أرقام
                hadiths.forEach((h, originalIndex) => {
                    const text = h.text || h.body || h.hadith || h["Musnad Ahmad ibn Hanbal"] || "";
                    const normalizedText = this.normalizeText(text);

                    let score = 0;
                    let matchedTermsCount = 0;

                    // حساب درجة التطابق
                    searchTerms.forEach(term => {
                        if (normalizedText.includes(term)) {
                            score += 10;
                            matchedTermsCount++;
                        }
                    });

                    // بونص للتطابق الكامل للجملة
                    if (normalizedText.includes(normalizedQuery)) score += 50;

                    // قاعدة القبول: لو لقى نص الكلمات أو كلمة واحدة مميزة
                    const threshold = searchTerms.length === 1 ? 1 : Math.ceil(searchTerms.length / 2);

                    if (matchedTermsCount >= threshold) {
                        // 2. بنبعت الترتيب (originalIndex) مع النتيجة
                        allMatches.push({ hadith: h, bookId: bookId, score: score, realIndex: originalIndex });
                    }
                });

            } catch (e) { }
        });

        await Promise.all(searchPromises);

        // الترتيب والعرض
        allMatches.sort((a, b) => b.score - a.score);

        list.innerHTML = '';
        if (allMatches.length === 0) {
            list.innerHTML = `
                <div style="text-align:center; padding: 30px; color: #94a3b8;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity:0.5"></i>
                    <p>لا توجد نتائج مطابقة لـ "${query}"</p>
                </div>`;
        } else {
            // عرض أفضل 20 نتيجة للسرعة
            let htmlBuffer = '';
            allMatches.slice(0, 20).forEach(match => {
                htmlBuffer += this.createSearchResultHTML(match, query); // ابعت الكائن كله (match)
            });
            list.innerHTML = htmlBuffer;
        }
    },

    // دالة عرض النتيجة (معدلة لتقبل الترتيب)
    createSearchResultHTML(matchData, query) {
        const h = matchData.hadith;
        const bookId = matchData.bookId;

        // 🔥 التعديل: قراءة الرقم الصريح من الملف فقط 🔥
        // بما إن الملف بقى سليم، إحنا واثقين إن hadithnumber موجود
        const strictNumber = h.hadithnumber;

        const bookName = this.booksMap.find(b => b.id === bookId)?.name || bookId;

        // تنظيف النص
        let rawText = h.text || h.body || h.hadith || h["Musnad Ahmad ibn Hanbal"] || "";
        let text = rawText.toString().replace(/<[^>]*>/g, '').substring(0, 300) + "...";

        // تحديد القسم (للأحمد بنخليه ALL)
        let sectionId = 'ALL';
        if (bookId !== 'ahmed' && h.reference && h.reference.book) {
            sectionId = h.reference.book;
        }

        const grade = h.grades && h.grades[0]?.grade ? h.grades[0].grade : '';

        return `
            <div class="search-result-item" onclick="HadithEngine.openDeepLink('${bookId}', '${bookName}', '${sectionId}', '${strictNumber}')">
                <div class="res-text">${text}</div>
                <div class="res-info">
                    <i class="fas fa-book-open"></i> ${bookName} ${grade ? `| <span style="color:var(--primary)">${grade}</span>` : ''}
                    <span style="margin-right:5px; opacity:0.7">#${strictNumber}</span>
                </div>
            </div>
        `;
    },

    async openDeepLink(bookId, bookName, sectionId, hadithNumber) {
        this.closeSearchModal();
        const container = document.getElementById('hadithGrid');

        container.innerHTML = `<div style="height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--royal-gold);">
            <i class="fas fa-circle-notch fa-spin fa-3x"></i>
            <h3 style="margin-top:20px; font-family:'Kufam', sans-serif; font-weight:900; font-style:italic; letter-spacing:normal;">جاري الانتقال للحديث رقم ${hadithNumber}...</h3>
        </div>`;

        try {
            this.data.currentBook = bookId;
            this.data.currentSectionId = sectionId;

            // Check if book is downloaded locally first
            const folderName = "hadith/books";
            let fileName = `${bookId}.json`;
            if (bookId === 'ahmed') fileName = 'ara-ahmad.json';
            
            let isDownloaded = false;
            if (window.Android && window.Android.isFileExists) {
                isDownloaded = window.Android.isFileExists(folderName, fileName);
            }

            // If not downloaded, show download prompt instead of trying to load
            if (!isDownloaded) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--royal-gold);">
                        <i class="fas fa-cloud-download-alt fa-4x" style="margin-bottom: 20px; opacity: 0.8;"></i>
                        <h3 style="font-family: 'Amiri'; margin-bottom: 10px;">تحميل الكتاب المطلوب</h3>
                        <p style="color: #ccc; margin-bottom: 30px;">للوصول إلى الحديث رقم ${hadithNumber} من كتاب ${bookName}، يجب تحميل الكتاب أولاً.</p>
                        
                        <button onclick="HadithEngine.downloadBookAndNavigate('${bookId}', '${bookName}', '${sectionId}', '${hadithNumber}')" 
                            id="btn-download-navigate"
                            style="background: var(--royal-gold); color: #000; border: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                            <i class="fas fa-download"></i> تحميل وفتح الحديث
                        </button>
                        
                        <div id="navigate-download-progress" style="display:none; margin-top: 20px;">
                            <div style="width: 200px; height: 6px; background: #333; margin: 0 auto; border-radius: 10px; overflow: hidden;">
                                <div id="navigate-progress-bar" style="width: 0%; height: 100%; background: var(--royal-gold); transition: width 0.3s;"></div>
                            </div>
                            <div style="font-size: 12px; color: #888; margin-top: 5px;">جارِ التحميل... <span id="navigate-progress-text">0%</span></div>
                        </div>
                    </div>
                `;
                return;
            }

            await this.loadHadiths(sectionId, bookName);
            const allData = this.data.allHadiths;

            let targetIndex = allData.findIndex(h => h.hadithnumber == hadithNumber);
            if (targetIndex === -1) targetIndex = allData.findIndex(h => h.number == hadithNumber);

            if (targetIndex === -1) {
                UI.showToast("لم يتم العثور على الحديث، تم الانتقال للبداية");
                targetIndex = 0;
            }

            let startView = Math.max(0, targetIndex - 2);
            this.renderVirtualBatch(startView, 50, true);

            // تحديث الرابط (التصحيح السابق)
            this.updateURL(bookId, sectionId, hadithNumber);

            setTimeout(() => {
                const cardId = `h-${hadithNumber}`;
                let targetCard = document.getElementById(cardId);

                if (!targetCard) {
                    const cards = document.getElementsByClassName('hadith-card');
                    targetCard = cards[Math.min(2, cards.length - 1)];
                }

                if (targetCard) {
                    // 1. الانتقال لبداية البطاقة (الحل لمشكلة النزول للأسفل)
                    // block: 'start' هيخلي أول البطاقة يلزق في سقف الشاشة
                    // behavior: 'smooth' عشان الحركة تبقي ناعمة
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // عشان الهيدر مايغطيش علي أول البطاقة، هنعمل إزاحة بسيطة (اختياري بس شيك)
                    window.scrollBy(0, -80);

                    // 2. الوميض الأخضر (بدل الشريط المتحرك)
                    // هنستخدم CSS مباشر عشان نضمن إنه يشتغل
                    targetCard.style.transition = "all 0.5s ease";
                    targetCard.style.borderColor = "var(--primary)"; // لون البرواز أخضر
                    targetCard.style.boxShadow = "0 0 50px rgba(79, 240, 183, 0.5)"; // وهج أخضر قوي
                    targetCard.style.transform = "scale(1.02)"; // تكبير بسيط جداً للفت الانتباه

                    // إزالة التأثير بعد ثانيتين ونص
                    setTimeout(() => {
                        targetCard.style.borderColor = "";
                        targetCard.style.boxShadow = "";
                        targetCard.style.transform = "";
                    }, 2500);
                }
            }, 500);

        } catch (e) {
            console.error("Deep link error:", e);
            container.innerHTML = `<div style="text-align:center; padding:50px;">حدث خطأ: ${e.message}</div>`;
        }
    },

    // دالة تغيير الرابط في المتصفح (عشان المشاركة والنسخ)
    updateURL(bookId, sectionId = '', hadithId = '') {
        const url = new URL(window.location);
        if (bookId) url.searchParams.set('book', bookId);
        if (sectionId) url.searchParams.set('sec', sectionId);
        if (hadithId) url.searchParams.set('id', hadithId);

        // حفظ في السجل (عشان زرار الـ Back يشتغل)
        window.history.pushState({}, '', url);
    },

    // دالة مساعدة عشان تلاقي الكارت وتجري عليه
    scrollToHadith(number) {
        // بنبحث عن الكارت اللي فيه الرقم ده
        const cardId = `h-${number}`;
        const targetCard = document.getElementById(cardId);

        if (targetCard) {
            // 1. الجري للكارت
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 2. عمل وميض (Highlight) عشان اليوزر يشوفه
            targetCard.style.transition = "0.5s";
            targetCard.style.borderColor = "var(--primary)";
            targetCard.style.boxShadow = "0 0 30px rgba(79, 240, 183, 0.3)";

            // نرجع الستايل الطبيعي بعد ثانيتين
            setTimeout(() => {
                targetCard.style.borderColor = "";
                targetCard.style.boxShadow = "";
            }, 2000);
        }
    },

    async init() {
        this.renderBooksMenu();
        this.renderWelcomeScreen();
        this.loadDailyContent();

        // 1. تفعيل زرار العدسة في الهيدر لفتح المودال
        // (تم ربطه في الـ HTML مباشرة عبر onclick="HadithEngine.openSearchModal()")

        // 2. تفعيل الكتابة في خانة المودال
        let debounceTimer;
        const modalInput = document.getElementById('modalSearchInput');
        const actionBtn = document.getElementById('searchActionBtn');

        if (modalInput) {
            modalInput.addEventListener('input', (e) => {
                const val = e.target.value;

                // تفعيل زر البحث لو فيه نص
                if (val.length > 0) actionBtn.classList.add('active');
                else actionBtn.classList.remove('active');

                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.handleGlobalSearch(val);
                }, 500);
            });

            // البحث عند الضغط على Enter
            modalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleGlobalSearch(e.target.value);
                }
            });
        }

        // 3. إغلاق المودال بزر ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSearchModal();

            // 4. اختصار Ctrl + K لفتح البحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault(); // منع فتح بحث المتصفح
                this.openSearchModal();
            }
        });

        console.log("تم تفعيل نظام البحث المودال (Spotlight) - نسخة التفسير 🔦");

        // 🔥 ضيف السطر ده في آخر الدالة 🔥
        this.checkDeepLinkFromURL();
    },

    // دالة فحص الرابط عند الفتح (The Link Catcher)
    checkDeepLinkFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let bookId = urlParams.get('book');
        let secId = urlParams.get('sec');
        let hadithId = urlParams.get('id');

        const clean = (v) => (v || '').trim().replace(/\/+/g, '');
        bookId = clean(bookId);
        secId = clean(secId);
        hadithId = clean(hadithId);

        if (bookId) {
            const bookObj = this.booksMap.find(b => b.id === bookId);
            const bookName = bookObj ? bookObj.name : bookId;

            console.log(`🔗 رابط مكتشف: كتاب ${bookName}`);

            if (hadithId) {
                // حالة رابط حديث مباشر
                setTimeout(async () => {
                    // 🔥🔥 الخطوة المهمة جداً: تحميل سياق الكتاب الأول (القائمة الجانبية) 🔥🔥
                    await this.loadBookSections(bookId, bookName);

                    // بعد ما الكتاب يحمل، نفتح الحديث
                    this.openDeepLink(bookId, bookName, secId || 'ALL', hadithId);
                }, 500);
            } else {
                // حالة رابط كتاب أو قسم
                setTimeout(async () => {
                    const sectionsMap = await this.loadBookSections(bookId, bookName);
                    if (secId && secId !== 'ALL') {
                        const realSectionName = sectionsMap[secId] || "القسم المحدد";
                        this.loadHadiths(secId, realSectionName);
                    }
                }, 500);
            }
        } else {
            this.goHome();
        }
    },

    // دالة العودة للرئيسية (تنظيف شامل)
    goHome() {
        // 1. تنظيف الرابط تماماً (حذف أي باراميترز)
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: cleanUrl }, '', cleanUrl);

        // 2. تصفير المتغيرات
        this.data.currentBook = null;
        this.data.currentSectionId = null;
        this.data.allHadiths = []; // تفريغ الذاكرة

        // 3. إعادة ضبط القائمة الجانبية
        document.getElementById('booksView').style.display = 'block';
        document.getElementById('sectionsView').style.display = 'none';

        // 4. عرض شاشة الترحيب (الداشبورد)
        this.renderWelcomeScreen();

        // 5. إغلاق القائمة الجانبية (في الموبايل)
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    },
    showBooksList() {
        this.updateURL();
        this.data.currentBook = null;
        this.data.currentSectionId = null;
        const booksView = document.getElementById('booksView');
        const sectionsView = document.getElementById('sectionsView');
        const label = document.getElementById('selectedBookLabel');
        const sections = document.getElementById('sectionsList');
        if (booksView) booksView.style.display = 'block';
        if (sectionsView) sectionsView.style.display = 'none';
        if (label) label.innerText = '';
        if (sections) sections.innerHTML = '';
    },

    async loadDailyContent() {
        try {
            const res = await fetch('../assets/data/hadith/daily_content.json');
            const data = await res.json();

            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const index = (dayOfYear - 1) % data.length;
            const item = data[index];

            const heroText = document.getElementById('dailyText');
            if (heroText) {
                heroText.innerText = `"${item.text}"`;
                document.getElementById('dailySource').innerHTML = `<i class="fas fa-book"></i> ${item.source}`;

                const typeMap = {
                    'hadith': 'حديث شريف',
                    'quran': 'آية كريمة',
                    'quote': 'حكمة'
                };
                document.getElementById('dailyType').innerText = typeMap[item.type] || 'جوامع الكلم';
            }
        } catch (e) {
            console.error("Failed to load daily content", e);
        }
    },

    renderWelcomeScreen() {
        const container = document.getElementById('hadithGrid');

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const gregDate = date.toLocaleDateString('ar-EG', options);
        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

        container.innerHTML = `
                <div class="welcome-container" style="grid-column: 1 / -1;">
                    
                    <div class="daily-hadith-hero" id="dailyHero">
                        <div class="hero-badge">
                            <i class="fas fa-star"></i> <span id="dailyType">جوامع الكلم</span>
                        </div>
                        <div class="hero-content-text" id="dailyText">
                            "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ..."
                        </div>
                        <div class="hero-footer">
                            <span id="dailySource"><i class="fas fa-book"></i> صحيح البخاري</span>
                        </div>
                    </div>

                    <div class="dashboard-grid">
                        
                        <div class="hero-card">
                            <div class="hero-text-content">
                                <h1 class="main-title" style="font-size: 24px; margin-bottom: 10px; font-family: 'Kufam', sans-serif; font-weight: 900; font-style: italic; letter-spacing: normal; color: #fff; text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);">موسوعة الحديث الشريف</h1>
                                <p class="sub-title" style="font-size: 16px; margin-bottom: 20px; font-family: 'Amiri'; color: var(--text-muted);">
                                    تراث النبوة بين يديك.. ابدأ رحلتك الآن.
                                </p>
                                <div class="start-action-box" onclick="toggleSidebar()" style="width: fit-content; margin: 0 auto 0 0; display: inline-flex; align-items: center; gap: 15px; padding: 10px 30px; background: linear-gradient(90deg, rgba(212, 175, 55, 0.1), transparent, rgba(212, 175, 55, 0.1)); border: 1px solid var(--royal-gold); border-radius: 50px; cursor: pointer; transition: all 0.3s ease;">
                                    <span style="font-family: 'Kufam', sans-serif; font-weight: 900; font-style: italic; letter-spacing: normal; font-size: 16px; color: #fff;">تصفح المكتبة</span>
                                    <i class="fas fa-arrow-left" style="font-size: 18px; color: var(--royal-gold);"></i>
                                </div>
                            </div>
                            <div id="lottieContainer" class="hero-lottie"></div>
                        </div>

                        <div class="info-card">
                            <div class="info-date-container">
                                <div class="today-badge">اليوم</div>
                                <div class="hijri-date">${hijriDate}</div>
                                <div class="greg-date"><i class="far fa-calendar-alt"></i> ${gregDate}</div>
                            </div>

                            <div class="info-stats-container">
                                <div class="stat-box">
                                    <span class="stat-value">10</span>
                                    <span class="stat-label">كتب</span>
                                </div>
                                <div class="stat-box">
                                    <span class="stat-value">+30K</span>
                                    <span class="stat-label">حديث</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="quick-books-title">
                            <i class="fas fa-bolt" style="color:var(--royal-gold)"></i> وصول سريع لأمهات الكتب
                        </div>
                        <div class="books-row">
                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-bukhari', 'صحيح البخاري')">
                                <div class="shortcut-icon"><i class="fas fa-book"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">صحيح البخاري</div>
                                    <div style="font-size:11px; color:#888;">أصح الكتب</div>
                                </div>
                            </div>

                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-muslim', 'صحيح مسلم')">
                                <div class="shortcut-icon"><i class="fas fa-book-open"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">صحيح مسلم</div>
                                    <div style="font-size:11px; color:#888;">الجامع الصحيح</div>
                                </div>
                            </div>

                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-abudawud', 'سنن أبي داود')">
                                <div class="shortcut-icon"><i class="fas fa-scroll"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">سنن أبي داود</div>
                                    <div style="font-size:11px; color:#888;">السنن</div>
                                </div>
                            </div>

                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-tirmidhi', 'جامع الترمذي')">
                                <div class="shortcut-icon"><i class="fas fa-university"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">جامع الترمذي</div>
                                    <div style="font-size:11px; color:#888;">الجامع الكبير</div>
                                </div>
                            </div>

                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-nasai', 'سنن النسائي')">
                                <div class="shortcut-icon"><i class="fas fa-feather"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">سنن النسائي</div>
                                    <div style="font-size:11px; color:#888;">السنن الكبرى</div>
                                </div>
                            </div>
                            
                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-ibnmajah', 'سنن ابن ماجه')">
                                <div class="shortcut-icon"><i class="fas fa-book-reader"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">سنن ابن ماجه</div>
                                    <div style="font-size:11px; color:#888;">المسند</div>
                                </div>
                            </div>

                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-nawawi', 'الأربعون النووية')">
                                <div class="shortcut-icon"><i class="fas fa-leaf"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">الأربعون النووية</div>
                                    <div style="font-size:11px; color:#888;">أحاديث الأحكام</div>
                                </div>
                            </div>
                            
                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-musnad', 'مسند أحمد')">
                                <div class="shortcut-icon"><i class="fas fa-database"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">مسند أحمد</div>
                                    <div style="font-size:11px; color:#888;">المسند الأكبر</div>
                                </div>
                            </div>
                            
                            <div class="book-shortcut" onclick="HadithEngine.openBookDirectly('ara-qudsi', 'الأحاديث القدسية')">
                                <div class="shortcut-icon"><i class="fas fa-kaaba"></i></div>
                                <div>
                                    <div style="font-family:'Amiri'; font-weight:bold; font-size:16px; color:#fff;">القدسية</div>
                                    <div style="font-size:11px; color:#888;">أنوار ربانية</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            `;

        loadLottieAnimation();
    },

    renderBooksMenu() {
        const mainList = document.getElementById('mainBooksList');
        const otherList = document.getElementById('otherBooksList');

        this.booksMap.forEach((book, index) => {
            const item = `
                    <div class="book-item" onclick="HadithEngine.loadBookSections('${book.id}', '${book.name}')">
                        <div class="book-icon">${index + 1}</div>
                        <div class="book-name">${book.name}</div>
                    </div>
                `;
            if (book.type === 'main') mainList.innerHTML += item;
            else otherList.innerHTML += item;
        });
    },

    // ============================================================
    // 🛠️ دالة تحميل الكتب (نسخة التشخيص وإصلاح الأخطاء)
    // ============================================================
    // ============================================================
    // 🛠️ دالة تحميل الكتب (نسخة التشخيص وإصلاح الأخطاء)
    // ============================================================
    async loadBookSections(bookId, bookName) {
        const safeBookId = (bookId || '').trim().replace(/\/+$/g, '');
        this.updateURL(safeBookId);

        const sectionsList = document.getElementById('sectionsList');
        sectionsList.innerHTML = '<div style="text-align:center; color:#fff; padding:20px;">جاري المعالجة...</div>';

        document.getElementById('booksView').style.display = 'none';
        document.getElementById('sectionsView').style.display = 'block';
        document.getElementById('selectedBookLabel').innerText = bookName;

        this.data.currentBook = safeBookId;

        try {
            let path = (safeBookId === 'ahmed') ? `${this.config.booksDir}/ara-ahmad.json?v=${new Date().getTime()}` : `${this.config.booksDir}/${safeBookId}.json`;

            const res = await fetch(path);
            if (!res.ok) throw new Error("ملف الكتاب غير موجود");

            const bookData = await res.json();

            let sections = bookData.metadata?.sections || { "ALL": "عرض جميع الأحاديث" };

            sectionsList.innerHTML = '';

            // 🔥 التعديل هنا: استخدمنا forEach عشان نجيب الـ index (الترتيب)
            Object.entries(sections).forEach(([secId, secName], index) => {
                const div = document.createElement('div');
                div.className = 'book-item';

                // التحقق من الرابط لتفعيل القسم الحالي
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('sec') === secId) {
                    div.classList.add('active');
                }

                div.innerHTML = `
                    <div class="book-icon">${index + 1}</div>
                    <div class="book-name">${secName}</div>
                    <i class="fas fa-chevron-left" style="color:var(--text-gray); font-size:0.8rem"></i>
                `;

                div.onclick = () => {
                    const allItems = sectionsList.querySelectorAll('.book-item');
                    allItems.forEach(item => item.classList.remove('active'));
                    div.classList.add('active');

                    this.updateURL(bookId, secId);
                    this.loadHadiths(secId, secName, bookData);

                    if (window.innerWidth <= 768) {
                        toggleSidebar();
                    }
                };
                sectionsList.appendChild(div);
            });

            return sections;

        } catch (e) {
            console.error(e);
            sectionsList.innerHTML = `<div style="text-align:center; color:#ff6b6b; padding:20px;">حدث خطأ في التحميل</div>`;
            return {};
        }
    },

    async loadHadiths(sectionId, sectionName) {
        this.data.currentSectionId = (sectionId || '').trim().replace(/\/+$/g, '');
        const container = document.getElementById('hadithGrid');
        const bookId = this.data.currentBook;

        // 1. تحديد اسم الملف بدقة (عشان مسند أحمد اسمه مختلف)
        let fileName = `${bookId}.json`;
        if (bookId === 'ahmed') fileName = 'ara-ahmad.json';

        // 2. تحديد المسارات (Local vs GitHub)
        const folderName = "hadith/books"; // ده الفولدر اللي هنحفظ فيه في الموبايل
        const localUrl = `https://appassets.androidplatform.net/local/${folderName}/${fileName}`;
        // رابط جيت هب المباشر للملف
        const githubUrl = `https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/refs/heads/main/hadith-api-1/editions/${fileName}`;

        // 3. هل الكتاب متحمل عندنا؟
        let isDownloaded = false;
        if (window.Android && window.Android.isFileExists) {
            isDownloaded = window.Android.isFileExists(folderName, fileName);
        }

        // 🛑 الحالة الأولى: الكتاب مش موجود -> اعرض زرار التحميل
        if (!isDownloaded) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--royal-gold);">
                    <i class="fas fa-cloud-download-alt fa-4x" style="margin-bottom: 20px; opacity: 0.8;"></i>
                    <h3 style="font-family: 'Amiri'; margin-bottom: 10px;">كتاب غير محمل</h3>
                    <p style="color: #ccc; margin-bottom: 30px;">هذا الكتاب غير موجود على جهازك. يجب تحميله أولاً لتصفحه.</p>
                    
                    <button onclick="HadithEngine.downloadBook('${githubUrl}', '${folderName}', '${fileName}')" 
                        id="btn-download-book"
                        style="background: var(--royal-gold); color: #000; border: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                        <i class="fas fa-download"></i> تحميل الكتاب الآن
                    </button>
                    
                    <div id="book-download-progress" style="display:none; margin-top: 20px;">
                        <div style="width: 200px; height: 6px; background: #333; margin: 0 auto; border-radius: 10px; overflow: hidden;">
                            <div id="book-progress-bar" style="width: 0%; height: 100%; background: var(--royal-gold); transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 12px; color: #888; margin-top: 5px;">جارِ التحميل... <span id="book-progress-text">0%</span></div>
                    </div>
                </div>
            `;
            return; // وقف الدالة هنا
        }

        // ✅ الحالة الثانية: الكتاب موجود -> حمله من الملف المحلي
        if (!this.data.isPaginationLoad) {
            this.data.allHadiths = [];
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--royal-gold);">
                    <i class="fas fa-circle-notch fa-spin fa-3x"></i>
                    <h3 style="margin-top: 20px;">جاري فتح الكتاب...</h3>
                </div>`;
        }

        try {
            // التحميل من الملف المحلي (Local)
            // نستخدم الكاش (الرامات) لو الكتاب مفتوح قبل كدة عشان السرعة
            if (!window.booksCache) window.booksCache = {};
            
            let fullBookData;
            if (window.booksCache[bookId]) {
                fullBookData = window.booksCache[bookId];
            } else {
                console.log(`Loading local book: ${localUrl}`);
                const res = await fetch(localUrl);
                if (!res.ok) throw new Error("فشل قراءة الملف المحلي");
                fullBookData = await res.json();
                window.booksCache[bookId] = fullBookData; // حفظ في الرامات
            }

            // الفلترة وعرض الأحاديث (نفس الكود القديم بتاعك)
            let hadiths = [];
            if (bookId === 'ahmed') {
                hadiths = fullBookData;
            } else {
                if (fullBookData.hadiths) {
                    hadiths = fullBookData.hadiths.filter(h => h.reference && h.reference.book == sectionId);
                }
            }

            if (!hadiths || hadiths.length === 0) {
                container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">لا توجد أحاديث في هذا القسم</div>`;
                return;
            }

            this.data.allHadiths = hadiths;
            this.data.currentSectionName = sectionName;

            if (!this.data.isPaginationLoad) {
                this.data.renderedCount = 0;
                container.innerHTML = '';
            }

            this.renderVirtualBatch(0, 50, true);
            this.initScrollListener();

        } catch (e) {
            console.error("خطأ:", e);
            // لو الملف المحلي بايز، امسحه واعرض زرار التحميل تاني
            // (ممكن تضيف كود هنا يمسح الملف لو حابب، بس حالياً نعرض رسالة خطأ)
            container.innerHTML = `<div style="text-align:center; padding:50px; color:#ff6b6b;">ملف الكتاب تالف، يرجى إعادة تحميله.<br>${e.message}</div>`;
        }
    },

    // دالة تحميل الكتب
    downloadBook(url, folder, fileName) {
        const btn = document.getElementById('btn-download-book');
        const progressDiv = document.getElementById('book-download-progress');

        if (btn) btn.style.display = 'none'; // اخفي الزرار
        if (progressDiv) progressDiv.style.display = 'block'; // اظهر شريط التحميل

        // تشغيل التحميل عبر الأندرويد
        if (window.Android && window.Android.downloadFile) {
            window.Android.downloadFile(url, folder, fileName);
        } else {
            alert("هذه الميزة تتطلب تطبيق الأندرويد");
        }
    },

    // دالة تحميل الكتاب والتنقل للحديث مباشرة
    downloadBookAndNavigate(bookId, bookName, sectionId, hadithNumber) {
        const btn = document.getElementById('btn-download-navigate');
        const progressDiv = document.getElementById('navigate-download-progress');
        const progressBar = document.getElementById('navigate-progress-bar');
        const progressText = document.getElementById('navigate-progress-text');

        if (btn) btn.style.display = 'none';
        if (progressDiv) progressDiv.style.display = 'block';

        // تحديد الرابط والمسار
        let fileName = `${bookId}.json`;
        if (bookId === 'ahmed') fileName = 'ara-ahmad.json';
        
        const folderName = "hadith/books";
        const githubUrl = `https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/refs/heads/main/hadith-api-1/editions/${fileName}`;

        // تشغيل التحميل عبر الأندرويد مع رد الاتصال
        if (window.Android && window.Android.downloadFileWithCallback) {
            // التحميل مع متابعة التقدم
            window.Android.downloadFileWithCallback(
                githubUrl, 
                folderName, 
                fileName,
                `HadithEngine.onDownloadComplete('${bookId}', '${bookName}', '${sectionId}', '${hadithNumber}')`,
                `HadithEngine.onDownloadProgress`
            );
        } else if (window.Android && window.Android.downloadFile) {
            // التحميل العادي بدون متابعة
            window.Android.downloadFile(githubUrl, folderName, fileName);
            // انتظار قصير ثم المحاولة
            setTimeout(() => {
                this.onDownloadComplete(bookId, bookName, sectionId, hadithNumber);
            }, 3000);
        } else {
            alert("هذه الميزة تتطلب تطبيق الأندرويد");
        }
    },

    // دالة استدعاء عند اكتمال التحميل
    onDownloadComplete(bookId, bookName, sectionId, hadithNumber) {
        // تحديث واجهة المستخدم
        const progressDiv = document.getElementById('navigate-download-progress');
        if (progressDiv) {
            progressDiv.innerHTML = '<div style="color: #4ff0b7;">✅ تم التحميل بنجاح! جاري الفتح...</div>';
        }

        // انتظار قصير ثم فتح الحديث
        setTimeout(() => {
            this.openDeepLink(bookId, bookName, sectionId, hadithNumber);
        }, 1000);
    },

    // دالة تحديث شريط التقدم
    onDownloadProgress(progress) {
        const progressBar = document.getElementById('navigate-progress-bar');
        const progressText = document.getElementById('navigate-progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    },

    // دالة العرض الذكي (Virtual Renderer)
    renderVirtualBatch(startIndex, count, clearContainer = false) {
        const container = document.getElementById('hadithGrid');
        const allData = this.data.allHadiths || [];

        if (clearContainer) {
            container.innerHTML = '';
            const hangingSign = document.createElement('div');
            hangingSign.className = 'hanging-container';
            hangingSign.style.gridColumn = '1 / -1';
            hangingSign.innerHTML = `<div class="sign-wrapper"><div class="chain left"></div><div class="chain right"></div><div class="wooden-sign"><div class="sign-content">${this.data.currentSectionName}</div></div></div>`;
            container.appendChild(hangingSign);
            this.data.renderedCount = startIndex;
        }

        const endIndex = Math.min(startIndex + count, allData.length);
        const batch = allData.slice(startIndex, endIndex);

        if (batch.length === 0) return;

        const favs = JSON.parse(localStorage.getItem('fav_hadiths') || "[]");

        batch.forEach((h, index) => {
            const card = document.createElement('div');
            card.className = 'hadith-card';

            // 🔥 الأمان: لو مفيش رقم حديث، نستخدم ترتيبه (احتياطي) عشان الكود ميكسرش
            const uniqueID = h.hadithnumber || h.number || (this.data.renderedCount + 1);

            card.id = `h-${uniqueID}`; // النتيجة هتكون h-1, h-2, h-500 وهكذا

            let rawText = h.text || h.body || h.hadith || h["Musnad Ahmad ibn Hanbal"] || "";
            let text = rawText.toString().replace(/<[^>]*>/g, '');
            let grade = (h.grades && h.grades.length > 0) ? `<div class="grade-badge"><i class="fas fa-check-circle"></i> ${h.grades[0].grade}</div>` : '';
            const isFav = favs.some(f => f.text.includes(text.substring(0, 20)));
            const activeClass = isFav ? 'active' : '';

            card.innerHTML = `
        <div class="card-inner-frame">
            <div class="card-header">
                ${grade}
                <span class="hadith-number">#${uniqueID}</span>
                <div class="card-font-controls">
                    <button class="font-btn" onclick="UI.changeFontSize(2)"><i class="fas fa-plus"></i></button>
                    <button class="font-btn" onclick="UI.changeFontSize(-2)"><i class="fas fa-minus"></i></button>
                </div>
            </div>
            <div class="hadith-text">${text}</div>
            <div class="card-footer">
                <span class="source-tag"><i class="fas fa-book"></i> المرجع: ${h.reference ? `حديث ${h.reference.hadith}` : 'غير متوفر'}</span>
                <div class="card-actions">
                    <button class="btn-fav ${activeClass}" onclick="UI.toggleFavorite(this)"><i class="fas fa-heart"></i></button>
                    <button class="btn-share" onclick="shareHadithText(this)"><i class="fas fa-share-alt"></i></button>
                    <button class="btn-camera-glow" onclick="generateHadithPost(this)"><i class="fas fa-camera"></i></button>
                    <button class="btn-copy" onclick="navigator.clipboard.writeText(this.closest('.hadith-card').querySelector('.hadith-text').innerText); UI.showToast('تم النسخ')"><i class="fas fa-copy"></i></button>
                </div>
            </div>
        </div>`;
            container.appendChild(card);
            this.data.renderedCount++;
        });
    },

    // دالة مراقبة السكرول (عشان يحمل لما توصل تحت)
    initScrollListener() {
        // نمنع تكرار الليسنر
        if (this.scrollHandlerAttached) return;

        const mainContent = document.querySelector('.hadith-container'); // أو الحاوية اللي بتسكرول

        mainContent.addEventListener('scroll', () => {
            // لو قربنا من نهاية الصفحة بـ 300 بكسل
            if (mainContent.scrollTop + mainContent.clientHeight >= mainContent.scrollHeight - 300) {
                // نحمل الـ 50 اللي عليهم الدور
                this.renderVirtualBatch(this.data.renderedCount, 50, false);
            }
        });

        this.scrollHandlerAttached = true;
    },

    renderHadithCards(hadiths, sectionTitle) {
        const container = document.getElementById('hadithGrid');
        container.innerHTML = '';

        // اللافتة المعلقة (تصميمك)
        const hangingSign = document.createElement('div');
        hangingSign.className = 'hanging-container';
        hangingSign.style.gridColumn = '1 / -1';
        hangingSign.innerHTML = `<div class="sign-wrapper"><div class="chain left"></div><div class="chain right"></div><div class="wooden-sign"><div class="sign-content">${sectionTitle}</div></div></div>`;
        container.appendChild(hangingSign);

        const favs = JSON.parse(localStorage.getItem('fav_hadiths') || "[]");

        hadiths.forEach(h => {
            const card = document.createElement('div');
            card.className = 'hadith-card';

            // التعديل: عشان يقرأ أي صيغة (أحمد، بخاري، أو غيره)
            let rawText = h.text || h.body || h.hadith || h["Musnad Ahmad ibn Hanbal"] || "";
            let text = rawText.toString().replace(/<[^>]*>/g, '');

            let grade = (h.grades && h.grades.length > 0) ? `<div class="grade-badge"><i class="fas fa-check-circle"></i> ${h.grades[0].grade}</div>` : '';
            const isFav = favs.some(f => f.text.includes(text.substring(0, 20)));
            const activeClass = isFav ? 'active' : '';

            card.innerHTML = `
                    <div class="card-inner-frame">
                        <div class="card-header">
                            ${grade}
                            <span class="hadith-number">#${h.hadithnumber || h.number || '0'}</span>
                            <div class="card-font-controls">
                                <button class="font-btn" onclick="UI.changeFontSize(2)"><i class="fas fa-plus"></i> تكبير</button>
                                <button class="font-btn" onclick="UI.changeFontSize(-2)"><i class="fas fa-minus"></i> تصغير</button>
                            </div>
                        </div>
                        <div class="hadith-text">${text}</div>
                        <div class="card-footer">
                            <span class="source-tag"><i class="fas fa-book"></i> المرجع: ${h.reference ? `حديث ${h.reference.hadith}` : 'غير متوفر'}</span>
                            <div class="card-actions">
                                <button class="btn-fav ${activeClass}" onclick="UI.toggleFavorite(this)" title="إضافة للمفضلة">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <button class="btn-share" onclick="shareHadithText(this)" title="مشاركة نصية"><i class="fas fa-share-alt"></i></button>
                                <button class="btn-camera-glow" onclick="generateHadithPost(this)" title="حفظ كصورة"><i class="fas fa-camera"></i></button>
                                <button class="btn-copy" onclick="navigator.clipboard.writeText(this.closest('.hadith-card').querySelector('.hadith-text').innerText); UI.showToast('تم النسخ')" title="نسخ النص"><i class="fas fa-copy"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            container.appendChild(card);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// UI Helpers
function toggleSidebar() { // kept for potential legacy calls, but main logic is in sidebar.js
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');
    const isMobile = window.innerWidth <= 768;

    if (!sidebar) return;

    if (isMobile) {
        if (overlay) overlay.classList.toggle('active');
        sidebar.classList.toggle('active');

        // === إضافة حالة التنقل + قفل السكرول ===
        if (sidebar.classList.contains('active')) {
            MobileNav.pushState('sidebar');
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.dataset.scrollLockY = String(scrollY);
        } else {
            if (overlay) overlay.classList.remove('active');
            const prevY = parseInt(document.body.dataset.scrollLockY || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.dataset.scrollLockY = '';
            window.scrollTo(0, prevY);
        }
    } else {
        // Desktop: Collapse/Expand to icons-only mode
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) menuBtn.classList.remove('pulse-active');
}
window.toggleSidebar = toggleSidebar; // Make it global for HTML onclicks

function toggleGlobalNav() {
    const list = document.getElementById('globalNavLinks');
    const icon = document.querySelector('#globalNavToggle .toggle-icon');
    if (list) list.classList.toggle('expanded');
    if (icon) icon.classList.toggle('rotate');
}
window.toggleGlobalNav = toggleGlobalNav;

function searchHadith() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const cards = document.getElementsByClassName('hadith-card');

    for (let i = 0; i < cards.length; i++) {
        const text = cards[i].innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
window.searchHadith = searchHadith;

function loadLottieAnimation() {
    const container = document.getElementById('lottieContainer');
    if (container) {
        container.innerHTML = '';
        lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '../assets/data/hadith/light.json'
        });
    }
}

// Generate Post Logic (Studio)
function generateHadithPost(btnElement) {
    const card = btnElement.closest('.hadith-card');
    const text = card.querySelector('.hadith-text').innerText;
    const number = card.querySelector('.hadith-number').innerText;
    const gradeEl = card.querySelector('.grade-badge');
    const grade = gradeEl ? gradeEl.innerText : "";
    const bookName = document.getElementById('selectedBookLabel').innerText || "الحديث النبوي";

    document.getElementById('studio-hadith-text').innerText = text;
    document.getElementById('studio-number').innerText = number;
    document.getElementById('studio-book-name').innerText = bookName;

    const gradeContainer = document.getElementById('studio-grade-container');
    if (grade) {
        document.getElementById('studio-grade').innerText = grade.replace('grade', '').trim();
        gradeContainer.style.display = 'block';
    } else {
        gradeContainer.style.display = 'none';
    }

    const studio = document.getElementById('hadith-post-studio');
    const originalIcon = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

    setTimeout(() => {
        html2canvas(studio, { scale: 2, backgroundColor: null, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Hadith_Pro_${Date.now()}.jpg`;
            link.href = canvas.toDataURL("image/jpeg", 0.9);
            link.click();
            btnElement.innerHTML = originalIcon;
        }).catch(err => {
            console.error(err);
            alert("حدث خطأ أثناء حفظ الصورة");
            btnElement.innerHTML = originalIcon;
        });
    }, 100);
}
window.generateHadithPost = generateHadithPost;

async function shareHadithText(btn) {
    const card = btn.closest('.hadith-card');
    const text = card.querySelector('.hadith-text').innerText;

    // بنجيب الرقم من الـ ID بتاع الكارت مباشرة عشان نضمن الدقة
    // الكارت الـ ID بتاعه h-505 مثلاً، فإحنا بناخد الرقم اللي بعد الشرطة
    const rawId = card.id.replace('h-', '');
    const number = rawId;

    const bookName = document.getElementById('selectedBookLabel').innerText || "الحديث النبوي";
    const bookId = HadithEngine.data.currentBook;
    const sectionId = HadithEngine.data.currentSectionId || 'ALL';

    const gradeEl = card.querySelector('.grade-badge');
    const grade = gradeEl ? gradeEl.innerText.trim() : "";

    // 🔗 صناعة الرابط الذكي
    // بنشيل أي باراميتر قديم ونحط الجديد
    const baseUrl = window.location.origin + window.location.pathname;
    const shareLink = `${baseUrl}?book=${bookId}&sec=${sectionId}&id=${number}`;

    const formattedMessage = `
ﷺ حديث شريف ﷺ

"${text}"

ــــــــــــــــــــــــــــــ
📖 المصدر: ${bookName}
🔢 الرقم: ${number}
${grade ? `✨ الدرجة: ${grade}` : ''}

🔗 رابط الحديث المباشر:
${shareLink}

تم عبر تطبيق Sunnah Pro
`;

    // استخدام الرابط الرسمي الثابت دائماً
    const finalShareUrl = 'https://sunnah-app.vercel.app';
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'حديث من Sunnah Pro', text: formattedMessage, url: finalShareUrl });
        } catch (err) { }
    } else {
        navigator.clipboard.writeText(formattedMessage).then(() => {
            UI.showToast("تم نسخ الحديث والرابط!");
        });
    }
}
window.shareHadithText = shareHadithText;

// Make core objects global for HTML event attributes
window.UI = UI;
window.HadithEngine = HadithEngine;

// دوال التقدم العالمية للتحميل
window.updateDownloadProgress = function(percent, downloadedBytes, totalBytes) {
    // 1. تحديث القرآن (لو المودال مفتوح)
    if (typeof Engine !== 'undefined') Engine.lastProgressUpdate = Date.now();
    
    const loadedMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

    // كود القرآن القديم
    const quranBar = document.getElementById('real-progress-bar');
    if (quranBar) {
        quranBar.style.width = percent + "%";
        // ... باقي تحديثات نصوص القرآن
    }

    // 2. 🔥 تحديث الحديث (الجديد)
    const bookBar = document.getElementById('book-progress-bar');
    const bookText = document.getElementById('book-progress-text');
    if (bookBar) {
        bookBar.style.width = percent + "%";
        if (bookText) bookText.innerText = `${percent}% (${loadedMB}/${totalMB} MB)`;
    }
};

window.onDownloadComplete = function(fileName) {
    console.log("Download completed: " + fileName);

    // فك تعليق القرآن (لو موجود)
    if (typeof Engine !== 'undefined') {
        Engine.isDownloadingTranslation = false;
        if (Engine.progressWatchdog) clearInterval(Engine.progressWatchdog);
        if (typeof Engine.updateVisibleTranslations === 'function') Engine.updateVisibleTranslations();
    }

    // إشعار عام
    if (typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(`تم اكتمال التحميل: ${fileName} ✅`);
    }

    // 🔥 خاص بالحديث: لو كنا بنحمل كتاب، نعيد تحميل الصفحة الحالية
    const bookBar = document.getElementById('book-progress-bar');
    if (bookBar) {
        // احنا لسه في صفحة التحميل، نعيد تشغيل دالة الفتح
        // بنعرف الكتاب الحالي من Engine ونعمله Reload
        if (typeof HadithEngine !== 'undefined' && HadithEngine.data.currentBook) {
            const bookId = HadithEngine.data.currentBook;
            const secId = HadithEngine.data.currentSectionId;
            // إعادة استدعاء الدالة عشان تشوف الملف الجديد وتفتح
            setTimeout(() => {
                HadithEngine.loadHadiths(secId, "القسم الحالي"); 
            }, 1000);
        }
    }
};

window.onload = () => HadithEngine.init();

// ================= SEARCH INPUT HANDLER =================
function handleSearchInput(query) {
    if (query.length > 0) {
        // Debounce the search to avoid too many requests
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            HadithEngine.handleGlobalSearch(query);
        }, 300);
    }
}
