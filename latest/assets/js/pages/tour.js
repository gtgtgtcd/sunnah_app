/**
 * =================================================================================
 * ROYAL TOUR ENGINE - FINAL PRODUCTION READY (BUG FREE)
 * =================================================================================
 * نظام الجولة التعريفية للمصحف الملكي - النسخة النهائية 
 * تم إضافة خاصية الـ Refresh التلقائي بعد انتهاء الجولة لضمان نظافة الواجهة 100%
 */

const Tour = {
    isActive: false,
    stepIndex: 0,
    guardListener: null,
    currentHole: null,

    // ── الإعدادات والثوابت ──
    CONSTANTS: {
        OVERLAY_Z: 10000,
        BORDER_Z: 10001,
        ELEVATED_Z: 10002,
        TOOLTIP_Z: 10005,
        TRANSITION: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        DIM_COLOR: 'rgba(0, 0, 0, 0.82)'
    },

    steps: [
        {
            desc: "أهلاً بك في المصحف الملكي.\nجولة سريعة لتعلم أسرار التطبيق.",
            target: null,
            type: "intro",
            onStart: () => {
                const nav = document.querySelector('.top-navbar');
                if (nav) nav.style.zIndex = '20001';
            }
        },
        {
            desc: "اضغط هنا لفتح فهرس السور والقوائم.",
            target: "#menu-btn",
            type: "click",
            showArrow: true,
            padOverride: 8,
            borderRadiusOverride: '50%',
            onStart: () => {
                const nav = document.querySelector('.top-navbar');
                if (nav) nav.style.zIndex = '20001';
            },
            preAction: () => {
                const sb = document.getElementById('sidebar');
                if (sb) sb.classList.remove('active');
            }
        },
        {
            desc: "هذه القائمة الجانبية الجديدة.\nيمكنك التنقل بين السور والصفحات الرئيسية.",
            target: "#sidebar",
            type: "custom",
            btnText: "إغلاق القائمة",
            onStart: () => {
                const nav = document.querySelector('.top-navbar');
                if (nav) nav.style.zIndex = '';
                const sb = document.getElementById('sidebar');
                if (sb) sb.classList.add('active');
            },
            action: () => {
                const sb = document.getElementById('sidebar');
                if (sb) sb.classList.remove('active');
                Tour.next();
            }
        },
        {
            desc: "اضغط (نقرة واحدة) على الآية لفتح الإعدادات.",
            target: '[data-key="1:2"]',
            type: "click",
            hint: "اضغط نقرة واحدة"
        },
        {
            desc: "من هنا تتحكم في التلاوة، القراء، والمظهر.",
            target: "#settings-sheet-content",
            type: "info",
            onStart: () => UI.openSettings()
        },
        {
            desc: "السر الأكبر: اضغط (ضغطة مطولة) على الآية لفتح التفسير.",
            target: '[data-key="1:2"]',
            type: "longpress",
            hint: "اضغط واستمر بالضغط (Long Press)",
            preAction: () => UI.closeAllSheets()
        },
        {
            desc: "هنا تجد التفسير والترجمات وخيارات النسخ.",
            target: "#tafsir-overlay .bottom-sheet",
            type: "info",
            onStart: () => {
                const overlay = document.getElementById('tafsir-overlay');
                if (overlay) overlay.style.zIndex = "10005";
            },
            preAction: () => {
                const overlay = document.getElementById('tafsir-overlay');
                if (overlay) overlay.style.zIndex = "";
            }
        },
        {
            desc: "تمت الجولة بنجاح. تلاوة مباركة.",
            target: null,
            type: "finish",
            preAction: () => UI.closeAllSheets(),
            onStart: () => {
                Tour.playCelebration();
            }
        }
    ],

    // ═══════════════════════════════════════════════════
    //  1. تهيئة النظام وإنشاء طبقات التعتيم
    // ═══════════════════════════════════════════════════
    createOverlayElements() {
        if (document.getElementById('tour-overlay-top')) return;

        const positions = ['top', 'bottom', 'left', 'right'];
        positions.forEach(pos => {
            const div = document.createElement('div');
            div.id = `tour-overlay-${pos}`;
            div.className = 'tour-overlay-piece';
            Object.assign(div.style, {
                position: 'fixed',
                background: this.CONSTANTS.DIM_COLOR,
                zIndex: String(this.CONSTANTS.OVERLAY_Z),
                pointerEvents: 'none',
                transition: this.CONSTANTS.TRANSITION,
                opacity: '0',
                top: '0', left: '0', width: '0', height: '0'
            });
            document.body.appendChild(div);
        });

        const border = document.createElement('div');
        border.id = 'tour-spotlight-border';
        Object.assign(border.style, {
            position: 'fixed',
            border: '2px solid var(--royal-gold, #d4af37)',
            borderRadius: '12px',
            zIndex: String(this.CONSTANTS.BORDER_Z),
            pointerEvents: 'none',
            transition: this.CONSTANTS.TRANSITION,
            opacity: '0',
            boxSizing: 'border-box',
            top: '0', left: '0', width: '0', height: '0'
        });
        document.body.appendChild(border);
    },

    // ═══════════════════════════════════════════════════
    //  2. المحرك الرئيسي للرسم (Update Overlay)
    // ═══════════════════════════════════════════════════
    updateOverlay(holeTop, holeLeft, holeWidth, holeHeight, borderRadius) {
        const top = document.getElementById('tour-overlay-top');
        const bottom = document.getElementById('tour-overlay-bottom');
        const left = document.getElementById('tour-overlay-left');
        const right = document.getElementById('tour-overlay-right');
        const border = document.getElementById('tour-spotlight-border');

        if (!top || !bottom || !left || !right) return;

        const W = window.innerWidth;
        const H = window.innerHeight;

        const safeTop = Math.max(0, holeTop);
        const safeLeft = Math.max(0, holeLeft);
        const safeBottom = Math.min(H, holeTop + holeHeight);
        const safeRight = Math.min(W, holeLeft + holeWidth);
        const safeWidth = safeRight - safeLeft;
        const safeHeight = safeBottom - safeTop;

        this.currentHole = {
            top: safeTop,
            left: safeLeft,
            width: safeWidth,
            height: safeHeight,
            bottom: safeBottom,
            right: safeRight
        };

        Object.assign(top.style, {
            top: '0', left: '0',
            width: W + 'px',
            height: Math.max(0, safeTop) + 'px',
            opacity: '1'
        });
        Object.assign(bottom.style, {
            top: safeBottom + 'px', left: '0',
            width: W + 'px',
            height: Math.max(0, H - safeBottom) + 'px',
            opacity: '1'
        });
        Object.assign(left.style, {
            top: safeTop + 'px', left: '0',
            width: Math.max(0, safeLeft) + 'px',
            height: safeHeight + 'px',
            opacity: '1'
        });
        Object.assign(right.style, {
            top: safeTop + 'px', left: safeRight + 'px',
            width: Math.max(0, W - safeRight) + 'px',
            height: safeHeight + 'px',
            opacity: '1'
        });

        if (border) {
            Object.assign(border.style, {
                top: safeTop + 'px',
                left: safeLeft + 'px',
                width: safeWidth + 'px',
                height: safeHeight + 'px',
                borderRadius: borderRadius || '12px',
                opacity: '1'
            });
        }
    },

    // ═══════════════════════════════════════════════════
    //  3. أدوات مساعدة
    // ═══════════════════════════════════════════════════
    hideOverlay() {
        ['top', 'bottom', 'left', 'right'].forEach(pos => {
            const el = document.getElementById(`tour-overlay-${pos}`);
            if (el) el.style.opacity = '0';
        });
        const border = document.getElementById('tour-spotlight-border');
        if (border) border.style.opacity = '0';
        this.currentHole = null;
    },

    fullDim() {
        const top = document.getElementById('tour-overlay-top');
        const others = ['bottom', 'left', 'right'].map(p =>
            document.getElementById(`tour-overlay-${p}`)
        );
        const border = document.getElementById('tour-spotlight-border');

        if (!top) return;

        Object.assign(top.style, {
            top: '0', left: '0',
            width: '100vw', height: '100vh',
            opacity: '1'
        });
        others.forEach(el => {
            if (el) Object.assign(el.style, { opacity: '0', width: '0', height: '0' });
        });
        if (border) border.style.opacity = '0';
        this.currentHole = null;
    },

    computeHole(step, el) {
        const rect = el.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const defaultPad = isMobile ? 6 : 10;
        const pad = step.padOverride !== undefined ? step.padOverride : defaultPad;

        let hole = {
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + (pad * 2),
            height: rect.height + (pad * 2),
            borderRadius: step.borderRadiusOverride || '12px',
            pad: pad
        };

        if (step.target === '#settings-sheet-content' ||
            step.target === '#tafsir-overlay .bottom-sheet') {
            const sheet = el.closest('.bottom-sheet') || el;
            const sheetRect = sheet.getBoundingClientRect();
            hole = {
                top: sheetRect.top, left: 0,
                width: window.innerWidth,
                height: window.innerHeight - sheetRect.top,
                borderRadius: '24px 24px 0 0', pad: 0
            };
        } else if (step.target === '#sidebar') {
            // === الإصلاح الجذري للقائمة الجانبية للموبايل ===
            if (isMobile) {
                // في الموبايل، القائمة تظهر من اليمين وعرضها هو offsetWidth
                const sidebarWidth = el.offsetWidth;
                hole = {
                    top: 0, 
                    left: window.innerWidth - sidebarWidth, // لزق في اليمين
                    width: sidebarWidth,
                    height: window.innerHeight,
                    borderRadius: '0', pad: 0
                };
            } else {
                hole = {
                    top: 0, left: rect.left,
                    width: el.offsetWidth,
                    height: window.innerHeight,
                    borderRadius: '0', pad: 0
                };
            }
        }
        return hole;
    },

    // ═══════════════════════════════════════════════════
    //  ★ تسليط الضوء مع قص النص الخارج
    // ═══════════════════════════════════════════════════
    highlightAyahsInSpotlight(hole) {
        document.querySelectorAll('.tour-ayah-highlighted').forEach(el => {
            el.classList.remove('tour-ayah-highlighted');
            el.style.clipPath = '';
            el.style.webkitClipPath = '';
        });

        if (!hole) return;

        const boxTop = hole.top;
        const boxLeft = hole.left;
        const boxBottom = hole.top + hole.height;
        const boxRight = hole.left + hole.width;

        const allAyahs = document.querySelectorAll('.ayah-text, [data-key]');

        allAyahs.forEach(ayah => {
            const r = ayah.getBoundingClientRect();

            const overlaps = !(
                r.bottom < boxTop ||
                r.top > boxBottom ||
                r.right < boxLeft ||
                r.left > boxRight
            );

            if (!overlaps) return;

            ayah.classList.add('tour-ayah-highlighted');

            const extendsOutside = (
                r.top < boxTop ||
                r.bottom > boxBottom ||
                r.left < boxLeft ||
                r.right > boxRight
            );

            if (extendsOutside) {
                const clipTop = Math.max(0, boxTop - r.top);
                const clipBottom = Math.max(0, r.bottom - boxBottom);
                const clipLeft = Math.max(0, boxLeft - r.left);
                const clipRight = Math.max(0, r.right - boxRight);

                const clipValue = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
                ayah.style.clipPath = clipValue;
                ayah.style.webkitClipPath = clipValue;
            } else {
                ayah.style.clipPath = '';
                ayah.style.webkitClipPath = '';
            }
        });
    },

    // ═══════════════════════════════════════════════════
    //  4. التحكم في التولتيب والسهم
    // ═══════════════════════════════════════════════════
    positionTooltip(tooltip, step, hole) {
        const isMobile = window.innerWidth < 768;
        const isBottomSheet = (
            step.target === '#settings-sheet-content' ||
            step.target === '#tafsir-overlay .bottom-sheet'
        );
        const isSidebar = step.target === '#sidebar';

        Object.assign(tooltip.style, {
            top: '', left: '', bottom: '', right: '', transform: ''
        });

        if (isBottomSheet) {
            if (isMobile) {
                tooltip.classList.add('dock-top');
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
            } else {
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.style.top = (hole.top > 250)
                    ? (hole.top - 220) + 'px'
                    : '40px';
            }
        } else if (isSidebar) {
            if (isMobile) {
                tooltip.classList.add('bottom-sheet-mode');
            } else {
                tooltip.classList.add('compact-mode');
                const isRTL = getComputedStyle(document.body).direction === 'rtl';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translateY(-50%)';
                tooltip.style.left = isRTL
                    ? Math.max(20, hole.left - 380) + 'px'
                    : (hole.left + hole.width + 20) + 'px';
            }
        } else {
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            if (isMobile) {
                const holeCenter = hole.top + (hole.height / 2);
                if (holeCenter > window.innerHeight / 2) {
                    tooltip.classList.add('dock-top');
                }
            } else {
                const holeCenter = hole.top + (hole.height / 2);
                const margin = 20;
                tooltip.style.top = (holeCenter < window.innerHeight / 2)
                    ? (hole.top + hole.height + margin) + 'px'
                    : Math.max(20, hole.top - 200) + 'px';
            }
        }
    },

    positionArrow(arrow, step, hole) {
        if (!step.showArrow) {
            arrow.style.display = 'none';
            return;
        }
        const arrowSize = 30;
        arrow.style.display = 'block';
        arrow.style.opacity = '1';
        arrow.classList.add('arrow-anim');
        arrow.style.left = (hole.left + (hole.width / 2) - (arrowSize / 2)) + 'px';
        arrow.style.top = (hole.top + hole.height + 12) + 'px';
    },

    // ═══════════════════════════════════════════════════
    //  5. تشغيل الاحتفال (Lottie)
    // ═══════════════════════════════════════════════════
    playCelebration() {
        const container = document.getElementById('lottie-celebration');
        if (!container) return;

        container.innerHTML = '';

        if (typeof lottie !== 'undefined') {
            lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: '../assets/lottie/Confetti.json' 
            });
        }
    },

    // ═══════════════════════════════════════════════════
    //  6. دورة الحياة (Start, Next, Render, End)
    // ═══════════════════════════════════════════════════
    start() {
        if (localStorage.getItem('tour_final_v8') === 'true') return;

        this.cleanup();

        this.isActive = true;
        this.stepIndex = 0;
        document.body.classList.add('tour-active');

        this.createOverlayElements();
        this.injectHighlightStyles();
        this.enableGuard();
        this.render();
    },

    render() {
        const step = this.steps[this.stepIndex];
        const tooltip = document.getElementById('tour-tooltip');
        const btn = document.getElementById('tour-btn');
        const arrow = document.getElementById('tour-arrow-guide');

        if (!tooltip || !btn || !arrow) return;

        arrow.style.display = 'none';

        if (step.preAction) step.preAction();
        if (step.onStart) setTimeout(step.onStart, 80);

        const skipBtn = document.getElementById('tour-skip-btn');
        if (skipBtn) {
            if (this.stepIndex === 0) {
                skipBtn.style.display = 'block';
                skipBtn.onclick = () => this.end();
            } else {
                skipBtn.style.display = 'none';
            }
        }

        if (['info', 'intro', 'finish'].includes(step.type)) {
            btn.style.display = 'block';
            btn.innerText = step.type === 'finish' ? 'إنهاء' : 'التالي';
            btn.onclick = () => step.type === 'finish' ? this.end() : this.next();
        } else if (step.type === 'custom') {
            btn.style.display = 'block';
            btn.innerText = step.btnText;
            btn.onclick = step.action;
        } else {
            btn.style.display = 'none';
        }

        if (!step.target) {
            this.fullDim();
            tooltip.classList.remove(
                'compact-mode', 'medium-mode', 'dock-top',
                'bottom-sheet-mode', 'center-mobile'
            );
            tooltip.classList.add('center-screen-global');

            const descEl = document.getElementById('tour-desc');
            const counterEl = document.getElementById('tour-counter');
            if (descEl) descEl.innerText = step.desc;
            if (counterEl) counterEl.innerText = `${this.stepIndex + 1} / ${this.steps.length}`;

            tooltip.style.opacity = '1';
            return;
        }

        setTimeout(() => {
            const el = document.querySelector(step.target);
            if (!el) {
                console.warn(`[Tour] Target missing: ${step.target}`);
                this.next();
                return;
            }

            const skipScroll = (
                step.target === '#sidebar' ||
                step.target.includes('sheet')
            );
            
            if (!skipScroll) {
                el.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center'
                });
            }

            setTimeout(() => {
                tooltip.classList.remove(
                    'compact-mode', 'medium-mode', 'dock-top',
                    'center-screen-global', 'bottom-sheet-mode', 'center-mobile'
                );

                document.querySelectorAll('.tour-ayah-highlighted').forEach(el => {
                    el.classList.remove('tour-ayah-highlighted');
                    el.style.clipPath = '';
                    el.style.webkitClipPath = '';
                });

                const descEl = document.getElementById('tour-desc');
                const counterEl = document.getElementById('tour-counter');
                if (descEl) descEl.innerText = step.desc;
                if (counterEl) counterEl.innerText = `${this.stepIndex + 1} / ${this.steps.length}`;

                const hole = this.computeHole(step, el);
                this.updateOverlay(
                    hole.top, hole.left,
                    hole.width, hole.height,
                    hole.borderRadius
                );

                if (!skipScroll) this.highlightAyahsInSpotlight(hole);

                this.positionArrow(arrow, step, hole);
                this.positionTooltip(tooltip, step, hole);

                tooltip.style.opacity = '1';
            }, 500); 
        }, 50); 
    },

    handleInteraction(type, target) {
        if (!this.isActive) return;
        const step = this.steps[this.stepIndex];
        if (step.type !== 'click' && step.type !== 'longpress') return;

        const isAyah = target.classList.contains('ayah-text') ||
            target.closest('.ayah-text');
        const el = document.querySelector(step.target);
        const isTarget = el && (el === target || el.contains(target));

        if (isAyah || isTarget) {
            if (step.type === type) this.next();
            else if (step.type === 'longpress' && type === 'click') {
                this.showHint(step.hint);
            }
        }
    },

    showHint(msg) {
        const hint = document.getElementById('tour-hint');
        if (!hint) return;
        hint.innerText = msg;
        hint.classList.add('visible');
        setTimeout(() => hint.classList.remove('visible'), 2200);
    },

    next() {
        if (this.stepIndex < this.steps.length - 1) {
            this.stepIndex++;
            this.render();
        } else {
            this.end();
        }
    },

    // ═══════════════════════════════════════════════════
    //  7. الحماية (Guard) والستايلات
    // ═══════════════════════════════════════════════════
    enableGuard() {
        this.guardListener = (e) => {
            if (e.target.closest('#tour-tooltip') ||
                e.target.closest('#globalNavToggle')) return;

            const step = this.steps[this.stepIndex];

            if (step.target === '#sidebar' && e.target.closest('#sidebar')) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            if (step.type === 'click' || step.type === 'longpress') {
                const targetEl = document.querySelector(step.target);
                const isAyah = e.target.classList.contains('ayah-text') ||
                    e.target.closest('.ayah-text');
                const isHighlighted = e.target.classList.contains('tour-ayah-highlighted') ||
                    e.target.closest('.tour-ayah-highlighted');

                if (isAyah || isHighlighted ||
                    (targetEl && (e.target === targetEl || targetEl.contains(e.target)))) {
                    return;
                }
            }
            e.stopPropagation();
            e.preventDefault();
        };
        ['click', 'mousedown', 'touchstart'].forEach(evt =>
            document.addEventListener(evt, this.guardListener, true)
        );
    },

    disableGuard() {
        if (this.guardListener) {
            ['click', 'mousedown', 'touchstart'].forEach(evt =>
                document.removeEventListener(evt, this.guardListener, true)
            );
            this.guardListener = null;
        }
    },

    injectHighlightStyles() {
        if (document.getElementById('tour-highlight-styles')) return;
        const style = document.createElement('style');
        style.id = 'tour-highlight-styles';
        style.textContent = `
            .tour-active .ayah-text,
            .tour-active [data-key] {
                position: relative;
            }

            .tour-ayah-highlighted {
                position: relative;
                z-index: ${this.CONSTANTS.ELEVATED_Z} !important;
                text-shadow: 0 0 8px rgba(212, 175, 55, 0.35);
                transition: all 0.3s ease;
            }

            .tour-ayah-highlighted * {
                pointer-events: auto !important;
            }

            @keyframes tourBorderPulse {
                0%, 100% { border-color: rgba(212, 175, 55, 0.8); }
                50% { border-color: rgba(212, 175, 55, 0.35); }
            }

            #tour-spotlight-border {
                animation: tourBorderPulse 2.5s ease-in-out infinite;
            }

            .tour-overlay-piece {
                will-change: top, left, width, height, opacity;
            }
        `;
        document.body.appendChild(style);
    },

    // ═══════════════════════════════════════════════════
    //  ★ التنظيف العنيف والدقيق 
    // ═══════════════════════════════════════════════════
    cleanup() {
        ['top', 'bottom', 'left', 'right'].forEach(pos => {
            const el = document.getElementById(`tour-overlay-${pos}`);
            if (el) el.remove();
        });
        const border = document.getElementById('tour-spotlight-border');
        if (border) border.remove();
        const styles = document.getElementById('tour-highlight-styles');
        if (styles) styles.remove();

        const lottieContainer = document.getElementById('lottie-celebration');
        if (lottieContainer) lottieContainer.innerHTML = '';

        document.querySelectorAll('.tour-ayah-highlighted').forEach(el => {
            el.classList.remove('tour-ayah-highlighted');
            el.style.clipPath = '';
            el.style.webkitClipPath = '';
        });

        this.currentHole = null;
    },

    // ═══════════════════════════════════════════════════
    //  ★ دالة الإنهاء الجديدة مع الريفريش النظيف
    // ═══════════════════════════════════════════════════
    end() {
        this.isActive = false;
        
        // 1. تسجيل إن الجولة خلصت عشان متفتحش تاني بعد الريفريش
        localStorage.setItem('tour_final_v8', 'true');
        
        // 2. إزالة الكلاسات الأساسية اللي بتأثر على الستايل
        document.body.classList.remove('tour-active');
        document.body.classList.remove('mini-sidebar');

        // 3. إخفاء التولتيب والسهم عشان اليوزر يشوف الشاشة بتنضف
        const tooltip = document.getElementById('tour-tooltip');
        if (tooltip) tooltip.style.opacity = '0';
        const arrow = document.getElementById('tour-arrow-guide');
        if (arrow) arrow.style.display = 'none';

        // 4. إخفاء وإزالة طبقات التعتيم
        this.hideOverlay();
        this.cleanup();
        this.disableGuard();

        const nav = document.querySelector('.top-navbar');
        if (nav) nav.style.zIndex = '';

        // 5. اللمسة السحرية: ريفريش كامل للصفحة للبدء "على نظافة" 
        setTimeout(() => {
            window.location.reload();
        }, 300); // 300 ملي ثانية عشان اليوزر يلاحظ تأثير الإغلاق قبل الريفريش
    }
};