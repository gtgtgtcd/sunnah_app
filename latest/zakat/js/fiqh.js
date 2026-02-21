// ================= FIQH HELPER =================

window.openFiqh = function (type) {
    MobileNav.pushState('fiqhModal');
    const modal = document.getElementById('fiqhModal');
    const body = document.getElementById('fiqhBody');
    const val = (id) => parseFloat(document.getElementById(id).value) || 0;

    const goldNisab = window.nisabThreshold;
    const actualTotalStr = document.getElementById('display-total-wealth').innerText;
    const actualTotalNum = parseFloat(actualTotalStr.replace(/[^0-9.-]+/g, "")) || 0;

    let html = "";

    if (type === 'gold_cash') {
        const isNisabReached = actualTotalNum >= goldNisab;
        html = `
            <p><strong>القاعدة الشرعية:</strong> تجب الزكاة في المال والذهب إذا بلغ مجموعهما قيمة <strong>85 جراماً من الذهب عيار 24</strong> وحال عليه الحول.</p>
            <div class="fiqh-stat-box">
                <span>💰 قيمة النصاب اليوم: <span class="fiqh-highlight">${Math.floor(goldNisab).toLocaleString()} ${window.globalConfig.symbol}</span></span>
                <span>📊 إجمالي مالك وذهبك: <span class="fiqh-highlight">${actualTotalStr} ${window.globalConfig.symbol}</span></span>
            </div>
            <div class="fiqh-verdict ${isNisabReached ? 'verdict-yes' : 'verdict-no'}">
                ${isNisabReached ?
                '<i class="fas fa-check-circle"></i> بلغت النصاب وتجب عليك الزكاة (2.5%).' :
                `<i class="fas fa-times-circle"></i> لم تبلغ النصاب.<br>باقي لك ${Math.floor(goldNisab - actualTotalNum).toLocaleString()} لتجب الزكاة.`}
            </div>`;
    }
    else if (type === 'crops') {
        const weight = val('crop_weight');
        const isNisab = weight >= 653;
        html = `
            <p><strong>القاعدة الشرعية:</strong> نصاب الزروع هو <strong>5 أوسق</strong>، وهو ما يعادل بالكيلوجرامات الحديثة حوالي <strong>653 كجم</strong>.</p>
            <div class="fiqh-stat-box">
                <span>⚖️ الوزن الذي أدخلته: <span class="fiqh-highlight">${weight} كجم</span></span>
                <span>🌾 حد النصاب: <span class="fiqh-highlight">653 كجم</span></span>
            </div>
            <div class="fiqh-verdict ${isNisab ? 'verdict-yes' : 'verdict-no'}">
                ${isNisab ?
                '<i class="fas fa-check-circle"></i> تجاوزت النصاب. تجب الزكاة يوم الحصاد.' :
                '<i class="fas fa-times-circle"></i> لم تبلغ النصاب، فلا زكاة عليك في هذا المحصول.'}
            </div>
            <p style="font-size:12px; margin-top:10px; color:#aaa;">* ملاحظة: النسبة (10% أو 5%) تعتمد على طريقة الري التي اخترتها.</p>`;
    }
    else if (type === 'cattle') {
        const cType = document.getElementById('cattle_type').value;
        const count = val('cattle_count');
        const typeName = cType === 'sheep' ? 'الغنم' : (cType === 'cow' ? 'البقر' : 'الإبل');
        let minNisab = cType === 'sheep' ? 40 : (cType === 'cow' ? 30 : 5);
        let detailMsg = "";
        if (cType === 'sheep' && count >= 40 && count <= 120) detailMsg = "لأن العدد بين 40 و 120.";
        else if (cType === 'camel' && count >= 5 && count < 10) detailMsg = "في كل 5 جمال شاة واحدة.";
        const isNisab = count >= minNisab;
        html = `
            <p><strong>القاعدة الشرعية:</strong> يبدأ نصاب ${typeName} من <strong>${minNisab} رؤوس</strong>. ما دون ذلك لا زكاة فيه (وقص) إلا أن يشاء صاحبه.</p>
            <div class="fiqh-stat-box">
                <span>🐄 العدد المملوك: <span class="fiqh-highlight">${count}</span></span>
                <span>📏 بداية النصاب: <span class="fiqh-highlight">${minNisab}</span></span>
            </div>
            <div class="fiqh-verdict ${isNisab ? 'verdict-yes' : 'verdict-no'}">
                ${isNisab ?
                `<i class="fas fa-check-circle"></i> تجب فيها الزكاة.<br>${detailMsg}` :
                `<i class="fas fa-times-circle"></i> لم تبلغ النصاب. تحتاج إلى ${minNisab - count} رؤوس إضافية لتجب الزكاة.`}
            </div>`;
    }
    else if (type === 'trade') {
        const tradeTotal = val('trade_val') + val('stock_trade') - val('trade_debt');
        const isNisabReached = actualTotalNum >= goldNisab;
        html = `
            <p><strong>القاعدة الشرعية:</strong> عروض التجارة والأسهم تُقوَّم بسعر السوق الحالي يوم إخراج الزكاة، وتُضم إلى المال والذهب ليكمل النصاب.</p>
            <div class="fiqh-stat-box">
                <span>📦 صافي قيمة التجارة: <span class="fiqh-highlight">${Math.floor(tradeTotal).toLocaleString()}</span></span>
                <span>📉 الديون المخصومة: <span class="fiqh-highlight">${val('trade_debt').toLocaleString()}</span></span>
                <span>💰 إجمالي وعاء الزكاة (مع المال): <span class="fiqh-highlight">${actualTotalStr}</span></span>
            </div>
            <div class="fiqh-verdict ${isNisabReached ? 'verdict-yes' : 'verdict-no'}">
                ${isNisabReached ?
                '<i class="fas fa-check-circle"></i> مجموع تجارتك ومالك بلغ النصاب. تجب الزكاة (2.5%).' :
                '<i class="fas fa-times-circle"></i> إجمالي أموالك وتجارتك لم يبلغ النصاب بعد.'}
            </div>`;
    }
    else if (type === 'real_estate') {
        const income = val('re_income');
        const expense = val('re_expense');
        const net = income - expense;
        const zakatVal = net * 0.025;
        html = `
            <p><strong>القاعدة الشرعية:</strong> المستغلات (عمارة للتأجير، سيارة أجرة..) <strong>لا زكاة في قيمتها الأصلية</strong>، وإنما الزكاة في <strong>صافي الربح السنوي</strong> إذا حال عليه الحول وبلغ النصاب.</p>
            <div class="fiqh-stat-box">
                <span>💵 الإيراد السنوي: <span class="fiqh-highlight">${income.toLocaleString()}</span></span>
                <span>🛠️ المصاريف (صيانة/ضرائب): <span class="fiqh-highlight">${expense.toLocaleString()}</span></span>
                <span>📊 الصافي الخاضع للزكاة: <span class="fiqh-highlight">${Math.max(0, net).toLocaleString()}</span></span>
            </div>
            <div class="fiqh-verdict ${net > 0 ? 'verdict-yes' : 'verdict-no'}">
                ${net > 0 ?
                `<i class="fas fa-check-circle"></i> الزكاة الواجبة: <strong>${Math.floor(zakatVal).toLocaleString()} ${window.globalConfig.symbol}</strong> (2.5% من الصافي).` :
                '<i class="fas fa-times-circle"></i> لا يوجد صافي ربح، فلا زكاة عليك.'}
            </div>`;
    }
    else if (type === 'fitr') {
        const count = val('fitr_count');
        const valuePerPerson = val('fitr_val');
        const total = count * valuePerPerson;
        html = `
            <p><strong>القاعدة الشرعية:</strong> زكاة الفطر واجبة على كل مسلم (صغير أو كبير) يملك قوت يومه. تخرج قبل صلاة العيد طهرة للصائم وطعمة للمساكين.</p>
            <div class="fiqh-stat-box">
                <span>👨‍👩‍👧‍👦 عدد الأفراد: <span class="fiqh-highlight">${count}</span></span>
                <span>🥣 القيمة للفرد: <span class="fiqh-highlight">${valuePerPerson} ${window.globalConfig.symbol}</span></span>
            </div>
            <div class="fiqh-verdict verdict-yes" style="background:rgba(0, 230, 118, 0.05); border-color:var(--primary);">
                <i class="fas fa-info-circle"></i> المبلغ الإجمالي المستحق: <strong style="color: #fff;">${total.toLocaleString()} ${window.globalConfig.symbol}</strong>
            </div>`;
    }

    body.innerHTML = html;
    modal.classList.add('active');
};

window.closeFiqh = function () { // Make global
    document.getElementById('fiqhModal').classList.remove('active');
};
