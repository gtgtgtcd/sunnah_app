/**
 * Unified Sidebar Component
 * Generates the sidebar consistently across all pages.
 * 
 * المنطق:
 * ─────────────────────────────────────────────────────────
 * > 1200px (ديسكتوب)      → مفتوحة كاملة، toggle = collapse
 * 769-1200px (تابلت كبير)  → collapsed افتراضي، toggle = overlay كامل
 * ≤ 768px (موبايل)         → مخفية، toggle = drawer من اليمين
 * ─────────────────────────────────────────────────────────
 */

export function initSidebar(activePageId) {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Define Navigation Items
    const navItems = [
        { id: 'home', label: 'الرئيسية', link: '../Dashboard/index.html' },
        { id: 'quran', label: 'المصحف الشريف', link: '../quran/index.html' },
        { id: 'tafsir', label: 'التفسير والتدبر', link: '../tafsir/index.html' },
        { id: 'hadith', label: 'الحديث النبوي', link: '../hadith/index.html' },
        { id: 'azkar', label: 'الأذكار والأدعية', link: '../azkar/index.html' },
        { id: 'listen', label: 'التلاوات القرآنية', link: '../listen/1.html' },
        { id: 'radio', label: 'إذاعة القرآن', link: '../radio/index.html' },
        { id: 'zakat', label: 'حاسبة الزكاة', link: '../zakat/index.html' }, // Temporarily disabled
        { id: 'tasbih', label: 'السبحة الإلكترونية', link: '../tasbih/index.html' },
        { id: 'asma', label: 'أسماء الله الحسنى', link: '../asma/index.html' },
        { id: 'calendar', label: 'التقويم', link: '../calendar/index.html' },
        { id: 'contact', label: 'تواصل معنا', link: 'https://wa.me/201125935035?text=مرحباً فريق Sunnah Pro، لدي استفسار', external: true }
    ];

    // Generate HTML
    let navHTML = '<div class="nav-links">';

    // Group 1: Main
    navHTML += '<div class="nav-label">القائمة الرئيسية</div>';
    navHTML += renderNavItem(navItems[0], activePageId);

    // Group 2: Worship
    navHTML += '<div class="nav-label">العبادات</div>';
    navHTML += renderNavItem(navItems[1], activePageId);
    navHTML += renderNavItem(navItems[2], activePageId);
    navHTML += renderNavItem(navItems[3], activePageId);
    navHTML += renderNavItem(navItems[4], activePageId);
    // navHTML += renderNavItem(navItems[7], activePageId); // Zakat temporarily disabled

    // Group 3: Media
    navHTML += '<div class="nav-label">الميديا</div>';
    navHTML += renderNavItem(navItems[5], activePageId);
    navHTML += renderNavItem(navItems[6], activePageId);

    // Group 4: Tools
    navHTML += '<div class="nav-label">المعرفة والأدوات</div>';
    navHTML += renderNavItem(navItems[8], activePageId);
    navHTML += renderNavItem(navItems[9], activePageId);
    navHTML += renderNavItem(navItems[10], activePageId);

    // Group 5: Contact
    navHTML += '<div class="nav-label">الدعم</div>';
    navHTML += renderNavItem(navItems[11], activePageId);
    navHTML += '</div>';

    // User Profile Container (Filled by auth.js)
    const profileHTML = `
        <div class="user-profile" id="sidebarProfile">
            <div style="width: 35px; height: 35px; border-radius: 50%; background: #333;"></div>
            <div>
                 <h4 style="color: #fff; font-size: 14px; margin: 0; width: 100px; height: 10px; background: #333; border-radius: 5px;"></h4>
            </div>
        </div>
    `;

    // Inject into DOM
    sidebarContainer.innerHTML = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header"></div>
            ${navHTML}
            ${profileHTML}
        </div>
        <div class="mobile-overlay" id="mobileOverlay"></div>
    `;

    // ربط الـ overlay بالإغلاق
    const overlay = document.getElementById('mobileOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Initial Logic Trigger
    handleResize();
    window.addEventListener('resize', handleResize);

    // Attach Toggle Logic globally
    window.toggleSidebar = toggleSidebarLogic;
}

function renderNavItem(item, activeId) {
    const isActive = item.id === activeId ? 'active' : '';
    const isExternal = item.external ? 'target="_blank"' : '';
    const iconClass = item.id === 'contact' ? 'fab fa-whatsapp' : '';
    const iconStyle = item.id === 'contact' ? 'color: #25d366; font-size: 24px; width: 24px; height: 24px; margin-left: 10px; display: flex; align-items: center; justify-content: center;' : 'width: 24px; height: 24px; margin-left: 10px;';
    const iconElement = item.id === 'contact' 
        ? `<i class="${iconClass}" style="${iconStyle}"></i>`
        : `<img src="../assets/icon/sidebar/${item.id}.svg" style="${iconStyle}" alt="${item.label}">`;

    return `
        <a href="${item.link}" class="nav-item ${isActive}" ${isExternal}>
            ${iconElement}
            <span>${item.label}</span>
        </a>
    `;
}

/* =========================================
   التحكم في سكرول الـ Body
========================================= */
function lockBodyScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollLockY = String(scrollY);
}

function unlockBodyScroll() {
    const prevY = parseInt(document.body.dataset.scrollLockY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.dataset.scrollLockY = '';
    window.scrollTo(0, prevY);
}

/* =========================================
   فتح وإغلاق الـ Sidebar
========================================= */
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if (!sidebar) return;

    sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    lockBodyScroll();
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if (!sidebar) return;

    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    unlockBodyScroll();
}

/* =========================================
   منطق الـ Toggle الرئيسي
   
   3 حالات واضحة:
   1. موبايل (≤768): drawer من اليمين
   2. تابلت (769-1200): collapsed → يفتح overlay
   3. ديسكتوب (>1200): مفتوح → يعمل collapse
========================================= */
function toggleSidebarLogic() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const winWidth = window.innerWidth;

    if (!sidebar) return;

    if (winWidth <= 768) {
        // ===== موبايل وميني تابلت =====
        // الساب بار مخفية تماماً → بتطلع كـ drawer
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }

    } else if (winWidth <= 1200) {
        // ===== تابلت كبير =====
        // الساب بار collapsed (72px أيقونات بس)
        // لما تدوس toggle → بتفتح كاملة فوق المحتوى كـ overlay
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }

    } else {
        // ===== ديسكتوب =====
        // الساب بار مفتوحة كاملة
        // لما تدوس toggle → بتتقفل لـ 72px (collapsed)
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }
}

/* =========================================
   التعامل مع تغيير حجم الشاشة
   بينظف كل الحالات ويبدأ من الصفر
========================================= */
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('mobileOverlay');

    if (!sidebar) return;

    // تنظيف كل الحالات
    sidebar.classList.remove('active');
    sidebar.classList.remove('collapsed');
    if (mainContent) mainContent.classList.remove('expanded');
    if (overlay) overlay.classList.remove('active');
    unlockBodyScroll();
}