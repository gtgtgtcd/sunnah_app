// ================= CALCULATOR LOGIC =================

window.updateCattlePriceInput = function () {
    const type = document.getElementById('cattle_type').value;
    let p = 0;
    if (type === 'sheep') p = window.basePrices.sheep; else if (type === 'cow') p = window.basePrices.cow; else if (type === 'camel') p = window.basePrices.camel;
    document.getElementById('cattle_price').value = Math.floor(p * window.globalConfig.rate);
};

window.calc = function () {
    const val = (id) => Math.max(0, parseFloat(document.getElementById(id).value) || 0);
    const gRate = window.basePrices.gold * window.globalConfig.rate;
    const sRate = window.basePrices.silver * window.globalConfig.rate;

    // Gold
    const isZinah = document.getElementById('is_zinah').checked;
    let g24 = val('g24') * gRate, g21 = val('g21') * gRate * 0.875, g18 = val('g18') * gRate * 0.75;
    if (isZinah) { g21 = 0; g18 = 0; }
    const sil = val('sil') * sRate;

    // Cash
    const cashHand = val('cash_hand') * window.cashInputRate * window.globalConfig.rate;
    const cashBank = val('cash_bank') * window.globalConfig.rate;
    const cashOwed = val('cash_owed_to_user') * window.globalConfig.rate;
    const trade = (val('trade_val') - val('trade_debt')) + val('stock_trade');

    const baseWealth = g24 + g21 + g18 + sil + cashHand + cashBank + cashOwed + trade;
    let zakatMoney = (baseWealth >= window.nisabThreshold) ? baseWealth * window.zakatRate : 0;

    // Crops
    const cType = document.getElementById('crop_type').value;
    let cVal = val('crop_val');
    if (cType === 'wheat') cVal = val('crop_weight') * ((window.basePrices.wheat * window.globalConfig.rate) / 150);
    else if (cType === 'rice') cVal = val('crop_weight') * ((window.basePrices.rice * window.globalConfig.rate) / 1000);
    document.getElementById('crop_val').value = Math.floor(cVal);

    let zakatCrops = 0;
    if (val('crop_weight') >= 653) zakatCrops = cVal * parseFloat(document.getElementById('irrigation_type').value);

    // Real Estate
    const reNet = Math.max(0, val('re_income') - val('re_expense'));
    const zakatRe = reNet * window.zakatRate;

    // Cattle Logic
    const cattleType = document.getElementById('cattle_type').value;
    const cCount = val('cattle_count');
    const cPrice = val('cattle_price');

    let heads = 0; // عدد الرؤوس الواجب إخراجها كزكاة (للتحويل النقدي)
    let txt = "لا زكاة"; // النص الذي يظهر للمستخدم

    if (cattleType === 'sheep') {
        if (cCount >= 40 && cCount <= 120) { heads = 1; txt = "شاة واحدة"; }
        else if (cCount >= 121 && cCount <= 200) { heads = 2; txt = "شاتان"; }
        else if (cCount >= 201 && cCount <= 300) { heads = 3; txt = "3 شياه"; }
        else if (cCount > 300) {
            heads = Math.floor(cCount / 100);
            txt = heads + " شياه (لكل 100 شاة)";
        }
    } else if (cattleType === 'cow') {
        if (cCount >= 30 && cCount <= 39) { heads = 1; txt = "تبيع (عجل سنة)"; }
        else if (cCount >= 40 && cCount <= 59) { heads = 1.25; txt = "مسنة (بقرة سنتين)"; }
        else if (cCount >= 60) {
            let musinna = 0;
            let tabia = 0;
            let tempCount = cCount;
            while (tempCount >= 40) {
                if ((tempCount % 30) === 0) break;
                tempCount -= 40;
                musinna++;
            }
            tabia = Math.floor(tempCount / 30);
            heads = (tabia * 1) + (musinna * 1.25);
            txt = `${musinna} مسنة و ${tabia} تبيع`;
        }
    } else if (cattleType === 'camel') {
        if (cCount < 5) { heads = 0; txt = "لا زكاة"; }
        else if (cCount >= 5 && cCount <= 9) { heads = 1; txt = "شاة واحدة"; }
        else if (cCount >= 10 && cCount <= 14) { heads = 2; txt = "شاتان"; }
        else if (cCount >= 15 && cCount <= 19) { heads = 3; txt = "3 شياه"; }
        else if (cCount >= 20 && cCount <= 24) { heads = 4; txt = "4 شياه"; }
        else if (cCount >= 25 && cCount <= 35) { heads = 1; txt = "بنت مخاض (ناقة سنة)"; }
        else if (cCount >= 36 && cCount <= 45) { heads = 1; txt = "بنت لبون (ناقة سنتين)"; }
        else if (cCount >= 46 && cCount <= 60) { heads = 1; txt = "حقة (ناقة 3 سنوات)"; }
        else if (cCount >= 61 && cCount <= 75) { heads = 1; txt = "جذعة (ناقة 4 سنوات)"; }
        else if (cCount >= 76 && cCount <= 90) { heads = 2; txt = "بنتا لبون"; }
        else if (cCount >= 91 && cCount <= 120) { heads = 2; txt = "حقتان"; }
        else {
            heads = Math.floor(cCount / 50);
            txt = "حقة لكل 50 أو بنت لبون لكل 40";
        }
    }

    document.getElementById('cattle_result_text').innerText = (heads > 0 || (cCount >= 5 && cattleType === 'camel')) ? txt : "لا يوجد زكاة";
    const zakatCattle = heads * cPrice;

    // Fitr
    const zakatFitr = val('fitr_count') * val('fitr_val');
    const totalDue = zakatMoney + zakatCrops + zakatRe + zakatCattle + zakatFitr;

    // Update UI
    document.getElementById('display-total-wealth').innerText = Math.floor(baseWealth).toLocaleString();
    let pct = (window.nisabThreshold > 0) ? (baseWealth / window.nisabThreshold) * 100 : 0;

    document.getElementById('wc-percent').innerText = pct.toFixed(1) + "% من النصاب";
    document.getElementById('wc-status').innerHTML = (baseWealth >= window.nisabThreshold) ? '<span class="dot" style="background:var(--primary)"></span> النصاب مكتمل - الزكاة واجبة' : '<span class="dot"></span> لم تبلغ النصاب (في المال والذهب)';
    document.getElementById('wealth-card').classList.toggle('active', baseWealth >= window.nisabThreshold);
    document.getElementById('status-icon').parentElement.classList.toggle('active', baseWealth >= window.nisabThreshold);
    document.getElementById('progress-circle').style.strokeDashoffset = (2 * Math.PI * 32) * (1 - Math.min(100, pct) / 100);

    const footer = document.querySelector('.sticky-total');
    if (footer) {
        document.getElementById('total-due').innerHTML = Math.floor(totalDue).toLocaleString() + " <span>" + window.globalConfig.symbol + "</span>";
        if (totalDue > 0) { footer.classList.add('visible'); document.getElementById('total-due').style.color = "#00E676"; } else { footer.classList.remove('visible'); }
    }

    // Store Data
    window.reportData = {
        goldDetails: [
            { label: 'ذهب عيار 24', weight: val('g24'), price: gRate, total: g24 },
            { label: 'ذهب عيار 21', weight: val('g21'), price: gRate * 0.875, total: g21, isZinah },
            { label: 'ذهب عيار 18', weight: val('g18'), price: gRate * 0.75, total: g18, isZinah },
            { label: 'فضة خالصة', weight: val('sil'), price: sRate, total: sil }
        ],
        moneyDetails: [
            { label: 'نقدية ومحافظ', val: cashHand }, { label: 'بنك وشهادات', val: cashBank },
            { label: 'ديون لك', val: cashOwed }, { label: 'تجارة وأسهم', val: trade - val('trade_debt') },
            { label: 'خصم ديون عليك', val: -val('trade_debt') }
        ],
        cropDetails: { w: val('crop_weight'), v: cVal, type: cType },
        cattleDetails: { count: cCount, text: txt },
        reDetails: { inc: val('re_income'), net: reNet },
        fitrDetails: { c: val('fitr_count'), v: val('fitr_val') },
        totalW: baseWealth, zMoney: zakatMoney, zCrop: zakatCrops, zCattle: zakatCattle, zRe: zakatRe, zFitr: zakatFitr, finalZ: totalDue
    };

    // Auto-Save Draft with debounce to avoid excessive saving while typing
    if (typeof window.saveDraft === 'function') {
        clearTimeout(window.saveDraftTimeout);
        window.saveDraftTimeout = setTimeout(() => {
            window.saveDraft();
        }, 500); // Delay saving by 500ms to avoid saving while user is still typing
    }
};

window.saveDraft = function () {
    // Collect all inputs with IDs to ensure comprehensive draft saving
    const inputs = {};
    
    // Get inputs using the safe method if available
    if (typeof window.getInputsSafe === 'function') {
        Object.assign(inputs, window.getInputsSafe());
    }
    
    // Also collect any other inputs that might not be captured by getInputsSafe
    document.querySelectorAll('input[id]').forEach(el => {
        if (el.id && (el.type === 'checkbox' || el.type === 'text' || el.type === 'number' || el.type === 'search')) {
            inputs[el.id] = (el.type === 'checkbox') ? el.checked : el.value;
        }
    });
    
    // Save draft with timestamp
    const draft = {
        timestamp: Date.now(),
        inputs: inputs
    };
    localStorage.setItem('zakat_draft_v1', JSON.stringify(draft));
};

window.restoreDraft = function () {
    try {
        const raw = localStorage.getItem('zakat_draft_v1');
        if (!raw) return;

        const draft = JSON.parse(raw);
        if (!draft || !draft.inputs) return;

        // Wait for UI to be ready before restoring
        setTimeout(() => {
            // Restore inputs
            Object.entries(draft.inputs).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox') el.checked = val;
                    else el.value = val;
                }
            });

            // Trigger calc to update UI
            window.calc();
            
            // Ensure the sticky total bar is shown if there's an amount due after draft restoration
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
            
            // Notify user silently or via toast if needed (optional)
            console.log("Draft restored from " + new Date(draft.timestamp).toLocaleTimeString());
        }, 100); // Small delay to ensure UI is ready

    } catch (e) {
        console.error("Failed to restore draft", e);
    }
};
