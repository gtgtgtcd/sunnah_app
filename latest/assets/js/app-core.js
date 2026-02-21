/* =========================================================================
   ASSETS/JS/APP-CORE.JS
   نظام الإدارة المركزي - الإصدار الملكي (The Royal Core V2.0)
   يحتوي على: نظام التنقل (Nav) + نظام التحديث المركزي (Config)
   ========================================================================= */


window.RoyalGlobalURL = localStorage.getItem('royal_app_url') || "SunnahPro.com";

const RoyalConfig = {
    tableName: 'app_config',
    localKey: 'royal_app_url', // مفتاح التخزين المحلي

    // دالة البدء
    init() {
        console.log("🚀 Royal Config: System Started");
        console.log("📱 Current URL:", window.RoyalGlobalURL);
        
        // التحقق من التحديثات في الخلفية
        this.syncWithCloud();
    },

    // المزامنة مع سوبابيس
    async syncWithCloud() {
        if (typeof supabase === 'undefined') return;

        // 1. عامل الحظ (Random Factor): احتمال 1% فقط من المستخدمين هم اللي يبعتوا طلب
        const luckyShot = Math.random() < 0.01; 
        if (!luckyShot && localStorage.getItem(this.localKey)) {
            console.log("🌸 Royal Core: Skip sync to save server traffic.");
            return;
        }

        const now = Date.now();
        const lastSync = localStorage.getItem('royal_last_sync') || 0;
        const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // خليه يتأكد كل أسبوع مرة

        if (now - lastSync < ONE_WEEK && localStorage.getItem(this.localKey)) return;

        try {
            // الطلب مش هيروح غير للـ 1% المحظوظين فقط
            const { data, error } = await supabase
                .from(this.tableName)
                .select('website_url')
                .limit(1)
                .single();

            if (data && data.website_url) {
                window.RoyalGlobalURL = data.website_url;
                localStorage.setItem(this.localKey, data.website_url);
                localStorage.setItem('royal_last_sync', now);
                console.log("💎 Cloud URL Updated:", data.website_url);
            }
        } catch (err) {
            // صامت تماماً عشان المستخدم ميحسش بحاجة
        }
    }
};

// ==================== 2. MOBILE NAVIGATION SYSTEM (THE BODY) ====================
const MobileNav = {
    // قائمة بكل العناصر القابلة للإغلاق في مشروعك
    uiElements: [
        // 1. المودالات الكبيرة وشاشات البحث
        { id: 'searchModal', class: 'visible', type: 'modal' },
        { id: 'search-modal', class: 'visible', type: 'modal' },
        { id: 'reciter-modal', class: 'visible', type: 'modal' },
        { id: 'translation-modal', class: 'visible', type: 'modal' },
        { id: 'episodesModal', class: 'active', type: 'modal' },
        { id: 'customDhikrModal', class: 'active', type: 'modal' },
        
        // 2. مودالات الزكاة
        { id: 'exportModal', class: 'active', type: 'modal' },
        { id: 'fiqhModal', class: 'active', type: 'modal' },
        { id: 'securityModal', class: 'active', type: 'modal' },
        { id: 'namingModal', class: 'active', type: 'modal' },
        { id: 'historyModal', class: 'active', type: 'modal' },
        { id: 'customConfirmModal', class: 'active', type: 'modal' },
        { id: 'banModal', class: 'active', type: 'modal' },
        
        // 3. القوائم السفلية (Sheets & Overlays)
        { selector: '.sheet-overlay.active', type: 'sheet' },
        { id: 'modesSheetOverlay', class: 'active', type: 'sheet' },
        { id: 'shareSheetOverlay', class: 'active', type: 'sheet' },
        { id: 'customizeSheetOverlay', class: 'active', type: 'sheet' },
        { id: 'completionOverlay', class: 'active', type: 'overlay' },
        { id: 'sanctuaryOverlay', class: 'active', type: 'overlay' },
        
        // 4. القوائم الجانبية
        { id: 'sidebar', class: 'active', type: 'sidebar', overlay: ['sidebar-overlay', 'sidebarOverlay', 'mobileOverlay'] },
        { id: 'sidebar-container', class: 'active', type: 'sidebar' }, 
        { id: 'sidebar', class: 'translate-x-full', inverse: true, type: 'sidebar' },

        // 5. القوائم المنسدلة
        { id: 'mood-menu', class: 'hidden', inverse: true, type: 'menu' },
        { id: 'globalNavLinks', class: 'expanded', type: 'collapse' },
        
        // 6. Overlays خاصة
        { id: 'settings-overlay', class: 'visible', type: 'overlay' },
        { id: 'tafsir-overlay', class: 'visible', type: 'overlay' }
    ],

    init() {
        window.addEventListener('popstate', (e) => this.handleBack(e));
        window.MobileNav = this;
        console.log("🚀 Royal App Core: Navigation System Online");
    },

    pushState(name) {
        if (history.state && history.state.popup === name) return;
        history.pushState({ popup: name }, document.title, window.location.href);
    },

    handleBack(event) {
        for (const config of this.uiElements) {
            let element = null;
            if (config.id) element = document.getElementById(config.id);
            else if (config.selector) element = document.querySelector(config.selector);

            if (!element) continue;

            let isActive = false;
            if (config.inverse) {
                isActive = !element.classList.contains(config.class);
            } else {
                isActive = element.classList.contains(config.class);
                if (!isActive && element.style.display === 'block') isActive = true;
                if (!isActive && element.style.display === 'flex') isActive = true;
            }

            if (isActive) {
                this.closeElement(element, config);
                return;
            }
        }
    },

    closeElement(element, config) {
        if (config.inverse) {
            element.classList.add(config.class);
        } else {
            element.classList.remove(config.class);
        }

        if (element.style.display === 'block' || element.style.display === 'flex') {
            element.style.display = 'none';
        }

        if (config.overlay) {
            const overlays = Array.isArray(config.overlay) ? config.overlay : [config.overlay];
            overlays.forEach(id => {
                const ol = document.getElementById(id) || document.querySelector(`.${id}`);
                if (ol) {
                    ol.classList.remove('active', 'visible');
                    ol.style.display = 'none';
                }
            });
        }

        document.body.style.overflow = '';
        
        if (config.id === 'reciter-modal' && typeof Engine !== 'undefined' && Engine.closeReciterModal) {
            // Engine.closeReciterModal(); 
        }
    }
};

// ==================== 3. INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. تشغيل نظام التحديث المركزي أولاً
    RoyalConfig.init();

    // 2. تشغيل نظام التنقل
    MobileNav.init();
});