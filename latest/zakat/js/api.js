// ================= API FUNCTIONS =================

window.fetchCryptoLivePrice = async function () {
    const coin = document.getElementById('crypto_select').value;
    const priceInput = document.getElementById('crypto_unit_price');
    const totalInput = document.getElementById('stock_trade');
    const statusMsg = document.getElementById('crypto_status');

    if (coin === 'manual') {
        priceInput.value = "---"; totalInput.readOnly = false; totalInput.value = "";
        statusMsg.style.display = 'none'; window.calc(); return;
    }

    totalInput.readOnly = true; statusMsg.style.display = 'none'; priceInput.value = "جاري الاتصال...";
    try {
        const { data } = await window.supabaseClient.functions.invoke('get-market-rates', { body: { type: 'crypto', symbol: coin } });
        if (data && data.rate) {
            window.liveCryptoPrices[coin] = parseFloat(data.rate);
            window.updateCryptoInputDisplay();
            statusMsg.style.display = 'block';
            statusMsg.innerHTML = `<i class="fas fa-check-circle" style="color:var(--primary)"></i> <span style="color:var(--primary)">المصدر:</span> Coinbase Global`;
        }
    } catch (err) { priceInput.value = "فشل"; totalInput.readOnly = false; }
};

window.calculateCryptoValue = function () {
    const coin = document.getElementById('crypto_select').value;
    if (coin === 'manual') return;
    const count = parseFloat(document.getElementById('crypto_count').value) || 0;
    const price = (window.liveCryptoPrices[coin] || 0) * window.globalConfig.rate;
    document.getElementById('stock_trade').value = (count * price).toFixed(2);
    window.calc();
};

window.updateCryptoInputDisplay = function () {
    const coin = document.getElementById('crypto_select').value;
    if (coin === 'manual' || !window.liveCryptoPrices[coin]) return;
    const price = window.liveCryptoPrices[coin] * window.globalConfig.rate;
    document.getElementById('crypto_unit_price').value = Math.floor(price).toLocaleString();
    document.getElementById('crypto_currency_symbol').innerText = window.globalConfig.symbol;
    window.calculateCryptoValue();
};

window.changeGlobalCountry = async function () {
    const selector = document.getElementById('global_currency');
    const selectedOption = selector.options[selector.selectedIndex];
    const targetCurrency = selector.value;
    window.globalConfig.currency = targetCurrency;
    window.globalConfig.symbol = selectedOption.getAttribute('data-symbol');

    document.querySelectorAll('.inp-unit, .currency, .total-num span, #nisab-val, #gold-price, #silver-price').forEach(el => {
        if (['ج.م', 'عملة', '$', 'ر.س', 'د.إ', 'ر.ق', 'د.ك', 'EGP'].some(cur => el.innerText.includes(cur))) {
            if (el.classList.contains('inp-unit')) { if (!['جرام', 'كجم', 'فرد', 'رأس'].includes(el.innerText)) el.innerText = window.globalConfig.symbol; }
            else { el.innerHTML = el.innerHTML.replace(/ج.م|EGP|ر.س|د.إ|ر.ق|د.ك|\$/g, window.globalConfig.symbol); }
        }
    });

    if (targetCurrency === 'EGP') { window.globalConfig.rate = 1; window.updateUI(); return; }

    try {
        const { data: dbData } = await window.supabaseClient.from('currency_cache').select('*').eq('currency_code', targetCurrency).single();
        if (dbData && (new Date().getTime() - new Date(dbData.updated_at).getTime() < 86400000)) {
            window.globalConfig.rate = dbData.rate; window.updateUI();
        } else {
            const { data } = await window.supabaseClient.functions.invoke('get-market-rates', { body: { type: 'fiat', symbol: targetCurrency } });
            if (data && data.rate) {
                const newRate = parseFloat(data.rate);
                await window.supabaseClient.from('currency_cache').upsert({ currency_code: targetCurrency, rate: newRate, updated_at: new Date().toISOString() });
                window.globalConfig.rate = newRate; window.updateUI();
            }
        }
    } catch (e) { selector.value = "EGP"; window.changeGlobalCountry(); }
};

window.updateCashCurrency = async function () {
    const selector = document.getElementById('currency_select');
    const currencyCode = selector.value;
    if (currencyCode === 'EGP') { window.cashInputRate = 1; document.getElementById('fx_rate_display').style.display = 'none'; window.calc(); return; }
    document.getElementById('fx_rate_display').style.display = 'block';
    document.getElementById('fx_curr').innerText = `1 ${currencyCode}`;
    try {
        const { data } = await window.supabaseClient.functions.invoke('get-market-rates', { body: { type: 'fiat', symbol: currencyCode } });
        if (data && data.rate) {
            window.cashInputRate = 1 / parseFloat(data.rate);
            document.getElementById('fx_val').innerText = window.cashInputRate.toFixed(2);
            window.calc();
        }
    } catch (e) { window.cashInputRate = 1; }
};

window.initData = async function () {
    try {
        const { data } = await window.supabaseClient.functions.invoke('get-zakat-data');
        if (data.gold) { window.basePrices.gold = data.gold.gold24; window.basePrices.silver = data.gold.silver; }
        if (data.settings) {
            window.basePrices.sheep = data.settings.sheep_price; window.basePrices.cow = data.settings.cow_price;
            window.basePrices.camel = data.settings.camel_price; window.basePrices.fitr = data.settings.fitr_val;
            window.basePrices.wheat = data.settings.wheat_ardeb_price; window.basePrices.rice = data.settings.rice_ton_price;
        }
        window.changeGlobalCountry();
    } catch (e) { alert("تعذر الاتصال بالخادم."); }
};
