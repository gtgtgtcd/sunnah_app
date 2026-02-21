// ================= USER & AUTHENTICATION =================



let tempSecurityPin = null;

// Note: Profile rendering logic moved to shared auth.js

window.getVisitorId = function () {
    let vid = localStorage.getItem('z_visitor_id');
    if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('z_visitor_id', vid);
    }
    return vid;
};


// Auth & Saving Logic
window.handleAuth = async function () {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) window.openNamingModal();
    else document.getElementById('securityModal').classList.add('active');
};

window.saveMethod = async function (type) {
    if (type === 'google') {
        const { error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.href }
        });
        if (error) alert("خطأ: " + error.message);
    } else if (type === 'pin') {
        const pin = prompt("اكتب 4 أرقام سرية لحماية بياناتك:");
        if (pin) {
            tempSecurityPin = pin;
            window.finalizeSave('pin');
        }
    } else if (type === 'receipt') {
        window.finalizeSave('receipt');
    }
};

window.finalizeSave = function (method) {
    localStorage.setItem('zakat_auth_method', method);
    document.getElementById('securityModal').classList.remove('active');
    window.openNamingModal();
};

window.openNamingModal = function () {
    MobileNav.pushState('namingModal');
    const modal = document.getElementById('namingModal');
    modal.classList.add('active');
    setTimeout(() => {
        const input = document.getElementById('report-title-input');
        if (input) input.focus();
    }, 100);

    if (window.captchaWidgetId === null || window.captchaWidgetId === undefined) {
        if (typeof turnstile !== 'undefined') {
            window.captchaWidgetId = turnstile.render('#turnstile-container', {
                sitekey: '0x4AAAAAACYRN5440YiOaClx',
                theme: 'dark',
                execution: 'render',
                callback: function (token) { window.isCaptchaSolved = true; }
            });
        }
    } else {
        window.isCaptchaSolved = false;
        if (typeof turnstile !== 'undefined') turnstile.reset(window.captchaWidgetId);
    }
};

window.dismissSecurity = function () {
    if (confirm("هل أنت متأكد؟ لن تتمكن من استرجاع البيانات إذا ضاع الجهاز.")) {
        document.getElementById('securityModal').classList.remove('active');
        window.openNamingModal();
    }
};

window.uploadData = async function () {
    const saveBtn = document.querySelector('.sec-btn');
    if (saveBtn && saveBtn.disabled) return;
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...';
    }

    try {
        let attempts = 0;
        const maxAttempts = 30;
        while (!window.isCaptchaSolved && !turnstile.getResponse(window.captchaWidgetId)) {
            if (attempts >= maxAttempts) throw new Error("تأخر التحقق الأمني كثيراً.");
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        const turnstileToken = turnstile.getResponse(window.captchaWidgetId);
        if (!turnstileToken) throw new Error("فشل الحصول على الرمز الأمني.");

        if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الاتصال بالسيرفر...';

        if (!window.reportData) window.calc();
        const d = window.reportData;
        let reportTitle = document.getElementById('report-title-input').value.trim();
        if (!reportTitle) reportTitle = `تقرير زكاة ${new Date().toLocaleDateString('ar-EG')}`;

        const { data: sessionData } = await window.supabaseClient.auth.getSession();
        const user = sessionData?.session?.user;

        const payload = {
            ref_num: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000), // Timestamp + Random suffix
            currency: window.globalConfig.currency || 'EGP',
            total_amount: parseFloat(d.finalZ) || 0,
            report_data: d,
            raw_inputs: window.getInputsSafe(),
            user_name: user?.user_metadata?.full_name || "زائر",
            user_id: user?.id || null,
            device_id: localStorage.getItem('zakat_device_id') || 'unknown',
            custom_title: reportTitle,
            fingerprint_id: window.getVisitorId(),
            honeypot_value: document.getElementById('hp_field') ? document.getElementById('hp_field').value : '',
            captcha_token: turnstileToken,
            security_pin: tempSecurityPin
        };

        const { data: funcData, error: funcError } = await window.supabaseClient.functions.invoke('save-zakat-report', {
            body: payload,
            headers: sessionData?.session?.access_token ? { 'Authorization': `Bearer ${sessionData.session.access_token}` } : {}
        });

        tempSecurityPin = null;

        if (funcData && funcData.error === 'BLOCK_USER') {
            document.getElementById('namingModal').classList.remove('active');
            window.startBanTimer(funcData.retry_after || 3600);
            if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<span>تأكيد وحفظ الملف</span>'; }
            turnstile.reset(window.captchaWidgetId);
            return;
        }

        if (funcError) throw funcError;

        if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-check"></i> تم الحفظ!';
        document.getElementById('namingModal').classList.remove('active');

        const serverRef = funcData.ref_num || funcData.id;

        if (!user) {
            window.saveAnonymousRefToLocal(serverRef);
            window.showSuccessModal(serverRef);
        } else {
            showToast("تم حفظ التقرير بنجاح", "success");
            setTimeout(() => {
                if (window.selectedExportType === 'image') window.generateZakatReportImage(serverRef);
                else window.generateZakatReportPDF(serverRef);
                setTimeout(() => location.reload(), 3000);
            }, 1000);
        }
        turnstile.reset(window.captchaWidgetId);
        window.isCaptchaSolved = false;

    } catch (err) {
        console.error(err);
        let msg = err.message || "حدث خطأ غير متوقع";
        if (msg.includes("Edge Function")) msg = "تم رفض الطلب من السيرفر";
        if (msg.includes("حظر") || msg.includes("block") || msg.includes("ban")) {
            document.getElementById('securityModal').classList.remove('active');
            document.getElementById('banModal').classList.add('active');
            window.startBanTimer(60);
        } else {
            showToast(msg, "error");
        }
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<span>تأكيد وحفظ الملف</span>'; }
        turnstile.reset(window.captchaWidgetId);
    }
};

window.getInputsSafe = function () {
    const inputs = {};
    document.querySelectorAll('.inp-field, input[type="checkbox"]').forEach(el => {
        if (el.id) inputs[el.id] = (el.type === 'checkbox') ? el.checked : el.value;
    });
    return inputs;
};

// Modals Helpers
window.startBanTimer = function (seconds) {
    let totalSeconds = seconds;
    const timerElement = document.getElementById('ban-timer');
    const modal = document.getElementById('banModal');
    if (modal) modal.classList.add('active');

    // Play Animation
    const player = document.getElementById('ban-lottie-player');
    if (player) { player.stop(); player.play(); }

    if (window.banInterval) clearInterval(window.banInterval);
    window.banInterval = setInterval(() => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        if (timerElement) timerElement.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (totalSeconds <= 0) {
            clearInterval(window.banInterval);
            if (timerElement) timerElement.textContent = "انتهى الحظر";
        }
        totalSeconds--;
    }, 1000);
};

window.showSuccessModal = function (refNum) {
    const modal = document.getElementById('customConfirmModal');
    const title = modal.querySelector('.cyber-title');
    const desc = modal.querySelector('.cyber-desc');
    const actions = modal.querySelector('.cyber-actions');
    const icon = modal.querySelector('.icon-circle i');

    if (!refNum) refNum = "Error";
    icon.className = "fas fa-file-circle-check";
    icon.style.color = "#00E676";
    modal.querySelector('.cyber-modal-card').style.borderTopColor = "#00E676";
    title.innerText = "تم حفظ الزكاة بنجاح!";
    desc.innerHTML = `
        <div style="text-align:center; color:#ccc; margin-bottom:10px; font-size:14px;">يرجى نسخ <strong>رقم الوصل</strong>:</div>
        <div style="background: rgba(255, 255, 255, 0.05); color: #FFD700; font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 12px; margin: 10px 0 20px; border: 2px dashed #FFD700; text-align: center;" onclick="navigator.clipboard.writeText('${refNum}'); showToast('تم النسخ', 'success')">
            ${refNum}
        </div>`;
    actions.innerHTML = `
        <div style="display:flex; gap:10px; width:100%;">
            <button onclick="navigator.clipboard.writeText('${refNum}'); showToast('تم النسخ', 'success')" class="btn-cyber-secondary" style="flex:1;"><i class="fas fa-copy"></i> نسخ</button>
            <button onclick="generateZakatReportPDF('${refNum}')" class="btn-cyber-primary" style="flex:1; background:#00E676; color:#000;"><i class="fas fa-print"></i> طباعة</button>
        </div>
        <button onclick="location.reload()" class="btn-cyber-secondary" style="margin-top:10px; border-color:#d32f2f; color:#ff8a80;"><i class="fas fa-times"></i> إغلاق</button>`;
    modal.classList.add('active');
}

window.showCustomConfirm = function (message, actionCallback) {
    MobileNav.pushState('customConfirmModal');
    const modal = document.getElementById('customConfirmModal');
    modal.querySelector('.cyber-desc').innerText = message;

    // Set up unique event handlers manually to avoid duplicates
    const yesBtn = document.getElementById('btn-confirm-yes');
    const newYes = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYes, yesBtn);

    newYes.addEventListener('click', () => {
        actionCallback();
        document.getElementById('customConfirmModal').classList.remove('active');
    });

    modal.classList.add('active');
};

window.closeCustomConfirm = function () { document.getElementById('customConfirmModal').classList.remove('active'); };
window.closeBanModal = function () { document.getElementById('banModal').classList.remove('active'); };

// Toast Notification
window.showToast = function (msg, type = "success") {
    const toast = document.getElementById('custom-toast');
    toast.querySelector('.toast-msg').innerText = msg;
    if (type === 'error') {
        toast.style.borderRightColor = 'var(--danger)';
        toast.querySelector('.toast-icon').innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i>';
    } else {
        toast.style.borderRightColor = 'var(--primary)';
        toast.querySelector('.toast-icon').innerHTML = '<i class="fas fa-check" style="color:var(--primary)"></i>';
    }
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
};

window.saveAnonymousRefToLocal = function (refNum) {
    let savedRefs = JSON.parse(localStorage.getItem('zakat_anon_history') || '[]');
    if (!savedRefs.includes(refNum)) {
        savedRefs.unshift(refNum);
        localStorage.setItem('zakat_anon_history', JSON.stringify(savedRefs));
    }
};
