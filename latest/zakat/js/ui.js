// ================= UI FUNCTIONS =================

window.setTab = function (index, btn) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.inputs-container').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + index).classList.add('active');
};

window.updateUI = function () {
    const gPrice = window.basePrices.gold * window.globalConfig.rate;
    const sPrice = window.basePrices.silver * window.globalConfig.rate;

    // Update Header Prices
    const elGold = document.getElementById('gold-price');
    if (elGold) elGold.innerHTML = `${Math.floor(gPrice).toLocaleString()} <span style="font-size:11px; color:#d4af37;">${window.globalConfig.symbol}</span>`;

    const elSilver = document.getElementById('silver-price');
    if (elSilver) elSilver.innerHTML = `${Math.floor(sPrice).toLocaleString()} <span style="font-size:11px; color:#8899a6;">${window.globalConfig.symbol}</span>`;

    const p21 = gPrice * (21 / 24);
    const p18 = gPrice * (18 / 24);

    const labelStyle = 'color:#8899a6; font-size:11px; font-weight:normal; margin-left:4px;';
    const numStyle = 'display:inline-flex; flex-direction:row; align-items:center; justify-content:flex-start; min-width:70px; direction:ltr; gap:4px;';

    const formatPrice = (price) => {
        return `<span style="${labelStyle}">سعر الجرام:</span>
                <span style="${numStyle}">
                    <span style="font-size:13px; font-weight:bold; color:#d4af37; margin-top:1px;">${window.globalConfig.symbol}</span>
                    <span style="font-size:14px; font-weight:bold;">${Math.floor(price).toLocaleString()}</span>
                </span>`;
    };

    if (document.getElementById('lbl-price-24')) document.getElementById('lbl-price-24').innerHTML = formatPrice(gPrice);
    if (document.getElementById('lbl-price-21')) document.getElementById('lbl-price-21').innerHTML = formatPrice(p21);
    if (document.getElementById('lbl-price-18')) document.getElementById('lbl-price-18').innerHTML = formatPrice(p18);
    if (document.getElementById('lbl-price-sil')) document.getElementById('lbl-price-sil').innerHTML = formatPrice(sPrice);

    window.nisabThreshold = gPrice * 85;
    if (document.getElementById('nisab-val')) document.getElementById('nisab-val').innerText = Math.floor(window.nisabThreshold).toLocaleString() + " " + window.globalConfig.symbol;

    if (document.getElementById('fitr_val')) document.getElementById('fitr_val').value = (window.basePrices.fitr * window.globalConfig.rate).toFixed(2);

    window.updateCattlePriceInput();
    window.updateCryptoInputDisplay();
    window.calc();
};

window.resetAllData = function () {
    // Show confirmation modal
    const modal = document.getElementById('customConfirmModal');
    const title = modal.querySelector('.cyber-title');
    const desc = modal.querySelector('.cyber-desc');
    const actions = modal.querySelector('.cyber-actions');
    
    title.innerHTML = 'حذف جميع البيانات';
    desc.innerHTML = 'هل تريد بالتأكيد <span style="color:var(--danger)">حذف جميع البيانات</span> والبدء من جديد؟';
    
    actions.innerHTML = `
        <button id="btn-confirm-yes" class="btn-cyber-primary"><i class="fas fa-trash-alt"></i><span>نعم، احذف</span></button>
        <button id="btn-confirm-no" class="btn-cyber-secondary"><span>إلغاء</span></button>`;
    
    // Set up event listeners for the buttons after they're created
    setTimeout(() => {
        const yesBtn = document.getElementById('btn-confirm-yes');
        const noBtn = document.getElementById('btn-confirm-no');
        
        if (yesBtn) {
            yesBtn.onclick = () => {
                // Clear all input fields
                document.querySelectorAll('input[type="text"], input[type="search"], input[type="number"]').forEach(i => i.value = "");
                document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
                
                // Clear draft from localStorage
                localStorage.removeItem('zakat_draft_v1');
                
                // Recalculate to update UI
                window.calc();
                
                // Show success message
                window.showToast("تم إعادة تعيين البيانات", "success");
                
                // Close modal
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
};


// Sidebar Toggle (was inline in HTML often)
window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('mobileOverlay');
    const winWidth = window.innerWidth;

    if (!sidebar) return;

    if (winWidth <= 768) {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        if (sidebar.classList.contains('active')) {
            MobileNav.pushState('sidebar');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }
};
