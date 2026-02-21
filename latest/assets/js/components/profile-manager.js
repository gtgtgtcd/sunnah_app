/* =========================================================================
   ASSETS/JS/COMPONENTS/PROFILE-MANAGER.JS
   نظام إدارة البروفايل الموحد - النسخة الكاملة (Supabase Integrated)
   ========================================================================= */

import { getSupabase, logout } from '../auth.js';

// ── ثوابت التطبيق ──
const APP_INFO = {
    name: 'SUNNAH PRO',
    version: 'v1.2.0',
    build: 'Beta',
    developer: 'SUNNAH PRO Team',
    website: 'https://sunnah-app.vercel.app',
    shareUrl: 'https://sunnah-app.vercel.app', // الرابط الرسمي الثابت
    shareTitle: 'تطبيق سُنّة برو - رفيقك الإيماني',
    shareText: '📿 تطبيق سُنّة برو - القرآن الكريم، الأذكار، مواقيت الصلاة وأكثر!\n\n🌙 حمّل التطبيق الآن وابدأ رحلتك الإيمانية:',
    description: 'تطبيق إسلامي شامل يضم القرآن الكريم، الأذكار، مواقيت الصلاة، السبحة الإلكترونية، وأدوات إيمانية متعددة لمساعدتك على التقرب من الله.',
    ogImage: window.location.origin + '/assets/img/og-preview.png', // مسار الصورة الكامل
    features: [
        { icon: 'fas fa-quran', text: 'القرآن الكريم كاملاً مع التفسير' },
        { icon: 'fas fa-hands-praying', text: 'أذكار الصباح والمساء' },
        { icon: 'fas fa-mosque', text: 'مواقيت الصلاة الدقيقة' },
        { icon: 'fas fa-circle-dot', text: 'السبحة الإلكترونية' },
        { icon: 'fas fa-moon', text: 'التقويم الهجري' },
        { icon: 'fas fa-compass', text: 'اتجاه القبلة' }
    ]
};

/**
 * تهيئة نظام البروفايل في أي صفحة
 */
export async function initProfileSystem(currentUser = null) {
    const navActions = document.querySelector('.nav-actions');

    if (!navActions) return;

    if (currentUser) {
        renderUserHeader(navActions, currentUser);
    } else {
        renderGuestHeader(navActions);
    }

    // تعريف الدوال العامة
    window.toggleProfileDropdown = toggleProfileDropdown;
    window.openCameraUpdate = () => updateAvatar(currentUser);
    window.openNameUpdate = () => updateName(currentUser);
    window.handleLogout = logout;
    window.closeProfileDropdown = closeProfileDropdown;
    window.openAboutModal = openAboutModal;
    window.closeAboutModal = closeAboutModal;
    window.shareApp = shareApp;
}

// -----------------------------------------------------------------------------
// 1. دوال الرسم (HTML Injection)
// -----------------------------------------------------------------------------

function renderUserHeader(container, user) {
    const fullName = user.user_metadata.full_name || user.email.split('@')[0];
    
    // إصلاح مشكلة كسر الرابط: لا نضيف معلمة الكاش إلا لروابط Supabase فقط لتجنب إتلاف روابط Google
    let avatarUrl = user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
    if (avatarUrl.includes('supabase.co')) {
        avatarUrl += (avatarUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
    }
    
    const email = user.email;

    container.innerHTML = `
        <div class="relative">
            <div class="nav-user-btn" onclick="toggleProfileDropdown(event)">
                <img src="${avatarUrl}" class="nav-user-img" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
                <div class="nav-user-info">
                    <span class="nav-user-name">${fullName}</span>
                    <span class="nav-user-role">مشترك</span>
                </div>
                <i class="fas fa-chevron-down nav-user-arrow"></i>
            </div>

            <div id="profileDropdown" class="profile-dropdown">
                <div class="sheet-handle-wrapper">
                    <div class="sheet-handle"></div>
                </div>
                
                <div class="sheet-islamic-header">
                    <div class="sheet-corner-ornament top-left"></div>
                    <div class="sheet-corner-ornament top-right"></div>
                    <div class="sheet-islamic-icon">
                        <span class="bismillah-text">﷽</span>
                    </div>
                </div>
                
                <div class="sheet-body">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar-wrapper">
                            <img src="${avatarUrl}" class="dropdown-avatar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                            <button class="camera-btn" onclick="openCameraUpdate()" title="تغيير الصورة">
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>
                        <div class="dropdown-name-row">
                            <span class="dropdown-name">${fullName}</span>
                            <i class="fas fa-pen edit-name-icon" onclick="openNameUpdate()" title="تعديل الاسم"></i>
                        </div>
                        <span class="dropdown-email">${email}</span>
                    </div>
                    
                    <div class="sheet-stats">
                        <div class="sheet-stat-card">
                            <div class="sheet-stat-value">24</div>
                            <div class="sheet-stat-label">يوم متتالي</div>
                        </div>
                        <div class="sheet-stat-card">
                            <div class="sheet-stat-value">156</div>
                            <div class="sheet-stat-label">آية اليوم</div>
                        </div>
                    </div>
                    
                    <div class="dropdown-divider"></div>
                    
                    <div class="sheet-section-label">
                        <i class="fas fa-user-cog"></i>
                        الحساب والإعدادات
                    </div>
                    
                    <a href="../profile/index.html" class="dropdown-item item-settings">
                        <div class="item-icon"><i class="fas fa-user"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">الملف الشخصي</span>
                            <span class="item-desc">إدارة معلوماتك الشخصية</span>
                        </div>
                        <i class="fas fa-chevron-left item-arrow"></i>
                    </a>
                    
                    <a href="../settings/index.html" class="dropdown-item item-theme">
                        <div class="item-icon"><i class="fas fa-palette"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">السمة والتصميم</span>
                            <span class="item-desc">تخصيص مظهر التطبيق</span>
                        </div>
                        <i class="fas fa-chevron-left item-arrow"></i>
                    </a>

                    <div class="dropdown-item item-notifications">
                        <div class="item-icon"><i class="fas fa-bell"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">الإشعارات</span>
                            <span class="item-desc">تنبيهات ومتابعة الأحداث</span>
                        </div>
                        <label class="sheet-toggle">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="sheet-section-label">
                        <i class="fas fa-info-circle"></i>
                        معلومات ومساعدة
                    </div>

                    <div class="dropdown-item item-about" onclick="openAboutModal()">
                        <div class="item-icon"><i class="fas fa-info"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">عن التطبيق</span>
                            <span class="item-desc">معلومات وإصدار التطبيق</span>
                        </div>
                        <span class="item-badge">جديد</span>
                    </div>

                    <div class="dropdown-item item-share" onclick="shareApp()">
                        <div class="item-icon"><i class="fas fa-share-alt"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">مشاركة التطبيق</span>
                            <span class="item-desc">أنشر الخير مع أصدقائك</span>
                        </div>
                        <i class="fas fa-chevron-left item-arrow"></i>
                    </div>

                    <div onclick="handleLogout()" class="dropdown-item logout">
                        <div class="item-icon"><i class="fas fa-sign-out-alt"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">تسجيل الخروج</span>
                            <span class="item-desc">الخروج من الحساب</span>
                        </div>
                        <i class="fas fa-chevron-left item-arrow"></i>
                    </div>

                    <div class="dropdown-footer">
                        <div class="footer-brand">
                            <i class="fas fa-mosque footer-brand-icon"></i>
                            <span class="footer-brand-name">SUNNAH PRO</span>
                        </div>
                        <div class="footer-version">${APP_INFO.version} (${APP_INFO.build})</div>
                        <div class="footer-dua">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderGuestHeader(container) {
    container.innerHTML = `
        <div class="relative">
            <div class="nav-user-btn" onclick="toggleProfileDropdown(event)">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-user" style="color: var(--text-muted); font-size: 18px;"></i>
                </div>
                <div class="nav-user-info">
                    <span class="nav-user-name">ضيف</span>
                    <span class="nav-user-role">غير مسجل</span>
                </div>
                <i class="fas fa-chevron-down nav-user-arrow"></i>
            </div>

            <div id="profileDropdown" class="profile-dropdown">
                <div class="sheet-handle-wrapper"><div class="sheet-handle"></div></div>
                
                <div class="sheet-islamic-header">
                    <div class="sheet-corner-ornament top-left"></div>
                    <div class="sheet-corner-ornament top-right"></div>
                    <div class="sheet-islamic-icon"><span class="bismillah-text">﷽</span></div>
                </div>
                
                <div class="sheet-body">
                    <div class="dropdown-header" style="margin-top: -45px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 2px dashed var(--text-muted); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="fas fa-user" style="color: var(--text-muted); font-size: 36px;"></i>
                        </div>
                        <h3 style="color: #fff; margin: 0 0 10px; font-family: 'Kufam', sans-serif;">أنت ضيف!</h3>
                        <p style="color: var(--text-muted); margin: 0 0 20px; font-size: 14px;">سجل دخول لتفعيل الميزات الكاملة</p>
                        <button onclick="window.loginApp()" style="background: var(--primary); color: #000; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; width: calc(100% - 20px); margin: 0 10px;">
                            <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
                        </button>
                    </div>
                    
                    <div class="dropdown-divider"></div>
                    
                    <div class="dropdown-item" style="opacity: 1; cursor: not-allowed;">
                        <div class="item-icon"><i class="fas fa-user"></i></div>
                        <div class="item-text-group"><span class="item-label">الملف الشخصي</span></div>
                    </div>

                    <div class="dropdown-divider"></div>

                    <div class="dropdown-item item-about" onclick="openAboutModal()">
                        <div class="item-icon"><i class="fas fa-info"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">عن التطبيق</span>
                            <span class="item-desc">معلومات وإصدار التطبيق</span>
                        </div>
                        <span class="item-badge">جديد</span>
                    </div>

                    <div class="dropdown-item item-share" onclick="shareApp()">
                        <div class="item-icon"><i class="fas fa-share-alt"></i></div>
                        <div class="item-text-group">
                            <span class="item-label">مشاركة التطبيق</span>
                            <span class="item-desc">أنشر الخير مع أصدقائك</span>
                        </div>
                        <i class="fas fa-chevron-left item-arrow"></i>
                    </div>

                    <div class="dropdown-footer">
                        <div class="footer-brand"><i class="fas fa-mosque footer-brand-icon"></i> SUNNAH PRO</div>
                        <div class="footer-version">${APP_INFO.version} (${APP_INFO.build})</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// -----------------------------------------------------------------------------
// 2. دوال المنطق (Logic) - تحديث البيانات الحقيقي (Supabase)
// -----------------------------------------------------------------------------

async function updateName(user) {
    if (!user) return;
    const currentName = document.querySelector('.dropdown-name').innerText;
    const newName = prompt("أدخل الاسم الجديد:", currentName);
    
    if (!newName || newName === currentName) return;

    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
    });

    if (error) {
        alert("حدث خطأ أثناء تحديث الاسم: " + error.message);
    } else {
        document.querySelectorAll('.nav-user-name').forEach(el => el.innerText = newName);
        document.querySelector('.dropdown-name').innerText = newName;
        alert("تم تغيير الاسم بنجاح!");
    }
}

function updateAvatar(user) {
    if (!user) return;
    
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت");
            return;
        }

        const btn = document.querySelector('.camera-btn');
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const supabase = getSupabase();
            const fileName = `${user.id}/${Date.now()}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            document.querySelectorAll('.nav-user-img, .dropdown-avatar').forEach(img => {
                img.src = publicUrl;
            });

            alert("تم تحديث الصورة الشخصية بنجاح!");

        } catch (error) {
            console.error(error);
            alert("فشل تحديث الصورة: " + error.message);
        } finally {
            btn.innerHTML = '<i class="fas fa-camera"></i>';
        }
    };

    input.click();
}

// -----------------------------------------------------------------------------
// 3. عن التطبيق (About Modal)
// -----------------------------------------------------------------------------

function openAboutModal() {
    // نقفل القائمة الأول
    closeProfileDropdown();

    // نشيل أي modal قديم
    const existing = document.getElementById('aboutModal');
    if (existing) existing.remove();

    const featuresHTML = APP_INFO.features.map(f => `
        <div class="about-feature-item">
            <div class="about-feature-icon"><i class="${f.icon}"></i></div>
            <span class="about-feature-text">${f.text}</span>
        </div>
    `).join('');

    const modal = document.createElement('div');
    modal.id = 'aboutModal';
    modal.className = 'about-modal-overlay';
    modal.innerHTML = `
        <div class="about-modal-container">
            <button class="about-close-btn" onclick="closeAboutModal()">
                <i class="fas fa-times"></i>
            </button>

            <div class="about-modal-header">
                <div class="about-app-logo">
                    <div class="about-logo-glow"></div>
                    <i class="fas fa-mosque"></i>
                </div>
                <h2 class="about-app-name">${APP_INFO.name}</h2>
                <div class="about-version-badge">
                    <span class="about-version">${APP_INFO.version}</span>
                    <span class="about-build">${APP_INFO.build}</span>
                </div>
            </div>

            <div class="about-description">
                <p>${APP_INFO.description}</p>
            </div>

            <div class="about-section">
                <h3 class="about-section-title">
                    <i class="fas fa-star"></i>
                    مميزات التطبيق
                </h3>
                <div class="about-features-grid">
                    ${featuresHTML}
                </div>
            </div>

            <div class="about-section">
                <h3 class="about-section-title">
                    <i class="fas fa-code"></i>
                    معلومات تقنية
                </h3>
                <div class="about-tech-info">
                    <div class="about-tech-row">
                        <span class="about-tech-label">الإصدار</span>
                        <span class="about-tech-value">${APP_INFO.version} (${APP_INFO.build})</span>
                    </div>
                    <div class="about-tech-row">
                        <span class="about-tech-label">المطور</span>
                        <span class="about-tech-value">${APP_INFO.developer}</span>
                    </div>
                    <div class="about-tech-row">
                        <span class="about-tech-label">الموقع</span>
                        <a href="${APP_INFO.website}" target="_blank" class="about-tech-link">${APP_INFO.website}</a>
                    </div>
                    <div class="about-tech-row">
                        <span class="about-tech-label">آخر تحديث</span>
                        <span class="about-tech-value">${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <button class="about-share-btn" onclick="shareApp(); closeAboutModal();">
                <i class="fas fa-share-alt"></i>
                شارك التطبيق مع أصدقائك
            </button>

            <div class="about-modal-footer">
                <div class="about-footer-dua">
                    سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ
                </div>
                <div class="about-footer-copy">
                    صُنع بـ ❤️ لخدمة الأمة الإسلامية
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // تأخير بسيط للأنيميشن
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    // إغلاق عند الضغط على الخلفية
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAboutModal();
    });

    // إغلاق بـ Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;

    modal.classList.remove('show');
    modal.classList.add('closing');

    setTimeout(() => {
        modal.remove();
    }, 400);
}

// -----------------------------------------------------------------------------
// 4. مشاركة التطبيق (Share)
// -----------------------------------------------------------------------------

async function shareApp() {
    // نقفل القائمة
    closeProfileDropdown();

    const shareData = {
        title: APP_INFO.shareTitle,
        text: APP_INFO.shareText,
        url: APP_INFO.shareUrl
    };

    // ✅ لو المتصفح يدعم Web Share API (موبايل غالباً)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            showShareToast('تم فتح قائمة المشاركة بنجاح! 🎉');
        } catch (err) {
            // المستخدم قفل المشاركة - مش مشكلة
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
                showShareFallback();
            }
        }
    } else {
        // ✅ Fallback للديسكتوب - نعرض Modal مشاركة خاص
        showShareFallback();
    }
}

function showShareFallback() {
    const existing = document.getElementById('shareModal');
    if (existing) existing.remove();

    const fullShareText = `${APP_INFO.shareText}\n${APP_INFO.shareUrl}`;

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.className = 'about-modal-overlay';
    modal.innerHTML = `
        <div class="about-modal-container" style="max-width: 420px;">
            <button class="about-close-btn" onclick="document.getElementById('shareModal').classList.remove('show'); setTimeout(() => document.getElementById('shareModal')?.remove(), 400);">
                <i class="fas fa-times"></i>
            </button>

            <div class="about-modal-header">
                <div class="about-app-logo" style="background: linear-gradient(135deg, #25D366, #128C7E);">
                    <i class="fas fa-share-alt"></i>
                </div>
                <h2 class="about-app-name" style="font-size: 1.3rem;">شارك الخير مع أصدقائك</h2>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;">
                    الدال على الخير كفاعله ﷺ
                </p>
            </div>

            <div class="share-buttons-grid">
                <button class="share-platform-btn share-whatsapp" onclick="window.open('https://wa.me/?text=${encodeURIComponent(fullShareText)}', '_blank')">
                    <i class="fab fa-whatsapp"></i>
                    <span>واتساب</span>
                </button>
                <button class="share-platform-btn share-telegram" onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(APP_INFO.shareUrl)}&text=${encodeURIComponent(APP_INFO.shareText)}', '_blank')">
                    <i class="fab fa-telegram-plane"></i>
                    <span>تيليجرام</span>
                </button>
                <button class="share-platform-btn share-twitter" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(APP_INFO.shareText)}&url=${encodeURIComponent(APP_INFO.shareUrl)}', '_blank')">
                    <i class="fab fa-x-twitter"></i>
                    <span>تويتر</span>
                </button>
                <button class="share-platform-btn share-facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_INFO.shareUrl)}', '_blank')">
                    <i class="fab fa-facebook-f"></i>
                    <span>فيسبوك</span>
                </button>
                <button class="share-platform-btn share-email" onclick="window.open('mailto:?subject=${encodeURIComponent(APP_INFO.shareTitle)}&body=${encodeURIComponent(fullShareText)}')">
                    <i class="fas fa-envelope"></i>
                    <span>إيميل</span>
                </button>
                <button class="share-platform-btn share-copy" onclick="copyShareLink()">
                    <i class="fas fa-copy"></i>
                    <span>نسخ الرابط</span>
                </button>
            </div>

            <div class="share-text-preview">
                <div class="share-text-content">${fullShareText.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="about-modal-footer" style="margin-top: 15px;">
                <div class="about-footer-dua">
                    مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 400);
        }
    });

    // تعريف دالة نسخ الرابط
    window.copyShareLink = async () => {
        try {
            await navigator.clipboard.writeText(fullShareText);
            const copyBtn = modal.querySelector('.share-copy');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>تم النسخ!</span>';
            copyBtn.style.background = 'rgba(46, 204, 113, 0.2)';
            copyBtn.style.borderColor = '#2ecc71';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            // Fallback للمتصفحات القديمة
            const textArea = document.createElement('textarea');
            textArea.value = fullShareText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showShareToast('تم نسخ الرابط! 📋');
        }
    };
}

function showShareToast(message) {
    const existing = document.querySelector('.share-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// -----------------------------------------------------------------------------
// 5. دوال التحكم في القائمة (Toggle & Animation)
// -----------------------------------------------------------------------------

function toggleProfileDropdown(e) {
    if (e) e.stopPropagation();
    
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.querySelector('.nav-user-btn');
    
    if (!dropdown) return;

    if (dropdown.parentElement !== document.body) {
        document.body.appendChild(dropdown);
    }

    let backdrop = document.getElementById('profileBackdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'profileBackdrop';
        backdrop.className = 'profile-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', closeProfileDropdown);
    }

    if (dropdown.classList.contains('show')) {
        closeProfileDropdown();
    } else {
        dropdown.classList.add('show');
        if (btn) btn.classList.add('active');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.querySelector('.nav-user-btn');
    const backdrop = document.getElementById('profileBackdrop');
    
    if (dropdown) dropdown.classList.remove('show');
    if (btn) btn.classList.remove('active');
    if (backdrop) backdrop.classList.remove('show');
    
    document.body.style.overflow = '';
}