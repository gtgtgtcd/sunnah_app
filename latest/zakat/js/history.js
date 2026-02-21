// ================= HISTORY =================

window.searchCaptchaWidgetId = null;

window.openHistoryModal = function () {
    MobileNav.pushState('historyModal');
    document.getElementById('calculator-view').style.display = 'none';
    document.getElementById('history-view').style.display = 'block';
    document.querySelector('.sticky-total').style.display = 'none';

    // إضافة تأخير بسيط للتأكد من أن عناصر الصفحة ظهرت قبل رسم الكابتشا
    // هذا يمنع أخطاء "Container not found"
    setTimeout(() => {
        window.renderSearchCaptcha();
    }, 100);

    window.loadHistoryData();
};

window.renderSearchCaptcha = function () {
    // التأكد من تحميل مكتبة Turnstile
    if (typeof turnstile !== 'undefined') {
        const container = document.getElementById('turnstile-search-container');
        
        // الحالة الأولى: الكابتشا لم تُرسم بعد
        if (window.searchCaptchaWidgetId === null) {
            if (container) {
                container.innerHTML = ''; // تنظيف الحاوية
                try {
                    window.searchCaptchaWidgetId = turnstile.render('#turnstile-search-container', {
                        sitekey: '0x4AAAAAACYRN5440YiOaClx', // مفتاح الموقع الخاص بك
                        theme: 'dark',
                        execution: 'render', // هام: جعلناها ظاهرة لتجنب خطأ 401
                        callback: function (token) {
                            // يتم استدعاء هذه الدالة عند الحل الناجح
                            window.searchTurnstileToken = token;
                        },
                        "expired-callback": function() {
                            // عند انتهاء صلاحية التوكن
                            window.searchTurnstileToken = null;
                        }
                    });
                } catch (e) { console.warn("Turnstile render error", e); }
            }
        } 
        // الحالة الثانية: الكابتشا موجودة بالفعل، نقوم بعمل Reset لتجهيزها
        else {
            try { turnstile.reset(window.searchCaptchaWidgetId); } catch(e){}
        }
    }
};

window.closeHistoryView = function () {
    document.getElementById('calculator-view').style.display = 'block';
    document.getElementById('history-view').style.display = 'none';
    
    // إعادة إظهار الشريط السفلي إذا كان هناك مبلغ مستحق
    if (parseFloat(document.getElementById('total-due').innerText) > 0) {
        document.querySelector('.sticky-total').style.display = 'flex';
        document.querySelector('.sticky-total').classList.add('visible');
    }
    
    // Ensure the draft is saved when closing history view
    if (typeof window.saveDraft === 'function') {
        window.saveDraft();
    }
};

window.loadHistoryData = async function () {
    const list = document.getElementById('history-grid');
    const loading = document.getElementById('history-loading');
    const empty = document.getElementById('history-empty');

    list.innerHTML = '';
    loading.style.display = 'block';
    empty.style.display = 'none';

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    let reports = [];

    try {
        if (session) {
            // للمستخدم المسجل: جلب البيانات من السيرفر
            const { data } = await window.supabaseClient
                .from('zakat_reports')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });
            reports = data || [];
        } else {
            // للزائر: الاعتماد على البحث اليدوي (لأسباب أمنية)
            const localRefs = JSON.parse(localStorage.getItem('zakat_anon_history') || '[]');
            if (localRefs.length > 0) {
                loading.style.display = 'none';
                if (empty) {
                    empty.innerHTML = `
                        <i class="fas fa-history" style="font-size:40px; color:#555; margin-bottom:15px;"></i>
                        <h3 style="color:#fff; font-size:16px;">سجلاتك المحفوظة (${localRefs.length})</h3>
                        <p style="color:#777; font-size:12px;">لأسباب أمنية، يرجى إدخال رقم الوصل والتحقق يدوياً للبحث.</p>
                     `;
                    empty.style.display = 'block';
                }
                return;
            }
        }
    } catch (err) { console.error("History Load Error:", err); }

    loading.style.display = 'none';

    if (!reports || reports.length === 0) {
        if (empty) {
            empty.innerHTML = `
                <i class="fas fa-box-open" style="font-size:50px; color:#333; margin-bottom:15px;"></i>
                <h3 style="color:#fff; font-size:16px;">لا توجد سجلات محفوظة</h3>
                <p style="color:#777; font-size:12px;">أدخل رقم وصل للبحث أو سجل دخولك لعرض ملفاتك.</p>`;
            empty.style.display = 'block';
        }
        return;
    }

    // رسم الكروت للمستخدم المسجل
    let html = '';
    reports.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString('ar-EG');
        const amount = parseFloat(item.total_amount).toLocaleString();
        const itemStr = encodeURIComponent(JSON.stringify(item));
        const badge = !session ? '<span style="font-size:10px; background:#333; padding:2px 6px; border-radius:4px; color:#aaa; margin-right:5px;">محفوظ في الجهاز</span>' : '';
        const title = item.custom_title || "تقرير زكاة";

        html += `
        <div data-report-id="${item.id}" style="background:#111; border:1px solid #333; border-radius:15px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                    <div><div style="color:var(--primary); font-weight:bold; font-size:16px;">${title}</div>${badge}</div>
                    <span style="background:rgba(212,175,55,0.1); color:var(--gold); padding:2px 8px; border-radius:6px; font-size:11px; font-family:monospace;">#${item.ref_num}</span>
                </div>
                <div style="font-size:28px; font-weight:bold; color:#fff; font-family:'Outfit';">${amount} <span style="font-size:14px; color:var(--primary);">${item.currency}</span></div>
                <div style="font-size:12px; color:#777;">${date}</div>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px; border-top:1px solid #222; padding-top:15px;">
                <button onclick="confirmRestore('${itemStr}')" class="btn-premium-restore"><i class="fas fa-box-open"></i> استعادة</button>
                <button onclick="${session ? `deleteReport('${item.id}')` : `removeLocalReport('${item.ref_num}')`}" style="background:rgba(255,61,0,0.1); color:#ff8a80; border:1px solid #d32f2f; width:40px; border-radius:8px;"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>`;
    });
    list.innerHTML = html;
};

window.searchByRefNum = async function () {
    const inputField = document.getElementById('search-ref-input');
    const refInput = inputField.value.trim();
    
    // التحقق من المدخلات
    if (!/^\d+$/.test(refInput)) { window.showToast("يجب إدخال أرقام فقط", "error"); return; }

    // التحقق من وجود الكابتشا
    if (typeof turnstile === 'undefined' || window.searchCaptchaWidgetId === null) {
        window.renderSearchCaptcha();
        window.showToast("الرجاء حل اختبار الأمان أولاً", "warning");
        return;
    }

    const widgetId = window.searchCaptchaWidgetId;
    const list = document.getElementById('history-grid');
    const loading = document.getElementById('history-loading');
    const empty = document.getElementById('history-empty');

    // 1. الحصول على التوكن (Token) مباشرة
    let turnstileToken = turnstile.getResponse(widgetId);

    // إذا لم يحل المستخدم الكابتشا، نوقف العملية هنا (حماية الواجهة)
    if (!turnstileToken) {
        window.showToast("يجب حل اختبار الأمان (أنا لست روبوت)", "warning");
        return;
    }

    // بدء التحميل
    list.innerHTML = '';
    empty.style.display = 'none';
    loading.style.display = 'block';

    try {
        const { data: sessionData } = await window.supabaseClient.auth.getSession();
        const userEmail = sessionData?.session?.user?.email || null;
        
        // 2. إرسال الطلب للسيرفر مع التوكن
        const { data: funcResponse, error: funcError } = await window.supabaseClient.functions.invoke('secure-search', {
            body: { ref_num: refInput, email: userEmail, fingerprint: window.visitorId, captcha_token: turnstileToken }
        });

        // هام: حرق التوكن بعد الاستخدام (لأنه يستخدم مرة واحدة)
        try { turnstile.reset(widgetId); } catch (e) { }

        loading.style.display = 'none';

        // ============================================================
        // نقطة التحقق من الحظر: تفعيل المودال البرتقالي
        // ============================================================
        if (funcResponse && funcResponse.error === 'BLOCK_USER') {
            window.startBanTimer(funcResponse.retry_after || 60); // استدعاء دالة الحظر الموجودة في auth.js
            return;
        }
        // ============================================================

        // التحقق من وجود أخطاء أخرى
        if (funcError || (funcResponse && funcResponse.error)) {
            const msg = funcResponse?.error ? funcResponse.error : (funcError?.message || "خطأ");
            window.showToast(msg, "error");
            return;
        }

        // 3. عرض النتيجة في حالة النجاح
        const data = funcResponse.data;
        if (data) {
            const item = data;
            const date = new Date(item.created_at).toLocaleDateString('ar-EG');
            const amount = parseFloat(item.total_amount).toLocaleString();
            const itemStr = encodeURIComponent(JSON.stringify(item));
            const html = `
            <div data-report-id="${item.id}" style="background:#111; border:1px solid var(--primary); border-radius:15px; padding:20px;">
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:var(--gold); font-size:12px;">#${item.ref_num}</span>
                    <span style="color:#777; font-size:12px;">${date}</span>
                </div>
                <div style="font-size:28px; font-weight:bold; color:#fff;">${amount} <span style="font-size:14px; color:var(--primary);">${item.currency}</span></div>
                <div style="margin-top:20px; border-top:1px solid #222; padding-top:15px;">
                    <button onclick="confirmRestore('${itemStr}')" class="btn-premium-restore"><i class="fas fa-box-open"></i> استعادة</button>
                </div>
            </div>`;
            list.innerHTML = html;
        } else {
            empty.style.display = 'block';
            empty.innerHTML = `
                <div style="text-align:center;">
                    <i class="fas fa-search" style="font-size:40px; color:#555; margin-bottom:15px;"></i>
                    <p style="color:#fff;">لم يتم العثور على تقرير بهذا الرقم</p>
                </div>`;
        }

    } catch (err) {
        console.error(err);
        loading.style.display = 'none';
        window.showToast("خطأ في الاتصال", "error");
    }
};

window.removeLocalReport = function (refNum) {
    if (!confirm("حذف من سجل الجهاز فقط؟")) return;
    let savedRefs = JSON.parse(localStorage.getItem('zakat_anon_history') || '[]');
    savedRefs = savedRefs.filter(r => r != refNum);
    localStorage.setItem('zakat_anon_history', JSON.stringify(savedRefs));
    window.loadHistoryData();
    window.showToast("تمت الإزالة", "success");
};

window.confirmRestore = function (itemStr) {
    // دالة استعادة البيانات للمدخلات
    const item = JSON.parse(decodeURIComponent(itemStr));
    if (item.raw_inputs) {
        // Check if there's existing data in the fields
        let hasExistingData = false;
        
        // Check a few key fields to determine if there's existing data
        const keyFields = ['g24', 'g21', 'g18', 'sil', 'cash_hand', 'cash_bank', 'trade_val'];
        for (const fieldId of keyFields) {
            const el = document.getElementById(fieldId);
            if (el) {
                if ((el.type === 'checkbox' && el.checked) || 
                    (el.type !== 'checkbox' && el.value && el.value.trim() !== '')) {
                    hasExistingData = true;
                    break;
                }
            }
        }
        
        // If there's existing data, show confirmation modal
        if (hasExistingData) {
            // Show confirmation modal
            const modal = document.getElementById('customConfirmModal');
            const title = modal.querySelector('.cyber-title');
            const desc = modal.querySelector('.cyber-desc');
            const actions = modal.querySelector('.cyber-actions');
            
            title.innerHTML = 'استبدال البيانات';
            desc.innerHTML = 'هل أنت متأكد من استبدال البيانات الحالية ببيانات التقرير المحدد؟ <span style="color:var(--danger); display:block; margin-top:5px;">(سيتم فقدان الأرقام الحالية)</span>';
            
            actions.innerHTML = `
                <button id="btn-confirm-yes" class="btn-cyber-primary"><i class="fas fa-check-circle"></i><span>نعم، استبدل</span></button>
                <button id="btn-confirm-no" class="btn-cyber-secondary"><span>إلغاء</span></button>`;
            
            // Set up event listeners for the buttons after they're created
            setTimeout(() => {
                const yesBtn = document.getElementById('btn-confirm-yes');
                const noBtn = document.getElementById('btn-confirm-no');
                
                if (yesBtn) {
                    yesBtn.onclick = () => {
                        performRestore(item.raw_inputs);
                        document.getElementById('customConfirmModal').classList.remove('active');
                    };
                }
                
                if (noBtn) {
                    noBtn.onclick = () => {
                        document.getElementById('customConfirmModal').classList.remove('active');
                    };
                }
            }, 0);
            
            modal.classList.add('active');
        } else {
            // If no existing data, restore directly
            performRestore(item.raw_inputs);
        }
    }
};

// Function to perform the actual restoration
function performRestore(rawInputs) {
    for (const [k, v] of Object.entries(rawInputs)) {
        const el = document.getElementById(k);
        if (el) {
            if (el.type === 'checkbox') el.checked = v;
            else el.value = v;
        }
    }
    
    // Calculate first to update all values
    window.calc();
    
    // Close history view
    window.closeHistoryView();
    
    // Ensure the sticky total bar is shown if there's an amount due
    const totalDue = parseFloat(document.getElementById('total-due').innerText) || 0;
    const footer = document.querySelector('.sticky-total');
    if (footer) {
        if (totalDue > 0) { 
            footer.classList.add('visible'); 
            document.getElementById('total-due').style.color = "#00E676"; 
        } else { 
            footer.classList.remove('visible'); 
        }
    }
    
    // Save the restored data as a draft to ensure it persists
    if (typeof window.saveDraft === 'function') {
        window.saveDraft();
    }
    
    window.showToast("تم استعادة البيانات", "success");
}