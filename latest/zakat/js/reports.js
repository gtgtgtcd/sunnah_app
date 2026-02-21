// ================= REPORTS & EXPORT =================
import { generateZakatReportPDF } from './zakat-pdf.js';

window.selectedExportType = 'image';

window.openExportModal = function () {
    if (!window.reportData) window.calc();
    // ... logic for modal ...
    let complexity = window.reportData.goldDetails.length + window.reportData.moneyDetails.length;
    if (window.reportData.cattleDetails.count > 0) complexity++;
    document.getElementById('rec-pdf').style.display = (complexity > 6) ? 'block' : 'none';
    document.getElementById('rec-img').style.display = (complexity <= 6) ? 'block' : 'none';
    MobileNav.pushState('exportModal');
    document.getElementById('exportModal').classList.add('active');
};
// ...
window.executeDownload = function (type) {
    window.closeExportModal();
    if (type === 'image') window.generateZakatReportImage(); else generateZakatReportPDF();
};

window.generateZakatReportPDF = generateZakatReportPDF; // Expose globally just in case

window.closeExportModal = function () { document.getElementById('exportModal').classList.remove('active'); };

window.startExport = function (type) {
    window.closeExportModal();
    window.selectedExportType = type;
    window.handleAuth();
};



window.generateZakatReportImage = function (providedRef = null) {
    if (!window.reportData) window.calc();
    const d = window.reportData;
    const cur = window.globalConfig.symbol;
    const fmt = (n) => Math.floor(n).toLocaleString();
    const currentRef = providedRef || "مسودة";

    document.getElementById('rep-date-now').innerText = new Date().toLocaleDateString('ar-EG');
    document.getElementById('r-gold-total').innerText = fmt(d.goldDetails.reduce((a, b) => a + b.total, 0)) + ' ' + cur;

    // Gold Details
    let goldHTML = '';
    d.goldDetails.forEach(i => {
        if (i.weight > 0) {
            goldHTML += `<div class="rep-item"><div><span class="rep-label">${i.label}</span><span class="rep-sub-val">${i.weight} جم × ${fmt(i.price)}</span></div><span class="rep-val">${fmt(i.total)}</span></div>`;
        }
    });
    document.getElementById('r-gold-details').innerHTML = goldHTML || '<div class="rep-label" style="text-align:center; color:#555;">لا يوجد</div>';

    // Money Details
    document.getElementById('r-money-total').innerText = fmt(d.moneyDetails.reduce((a, b) => a + b.val, 0)) + ' ' + cur;
    let moneyHTML = '';
    d.moneyDetails.forEach(i => {
        if (i.val !== 0) moneyHTML += `<div class="rep-item"><span class="rep-label">${i.label}</span><span class="rep-val">${fmt(i.val)}</span></div>`;
    });
    moneyHTML += `<div class="rep-item" style="margin-top:20px; padding-top:15px; border-top:2px solid #333;"><span class="rep-label" style="color:var(--primary)">الزكاة المستحقة (2.5%)</span><span class="rep-val" style="color:var(--primary)">${fmt(d.zMoney)}</span></div>`;
    document.getElementById('r-money-details').innerHTML = moneyHTML;

    // Crop Details
    const cropDiv = document.getElementById('r-crop-section');
    if (d.cropDetails && d.cropDetails.w > 0) {
        cropDiv.innerHTML = `<div class="rep-item"><div><span class="rep-label">زكاة الزروع</span><span class="rep-sub-val">${d.cropDetails.w} كجم (${d.cropDetails.type})</span></div><span class="rep-val">${fmt(d.cropDetails.v)} (القيمة)</span></div><div class="rep-item" style="margin-top:15px; padding-top:15px; border-top:1px dashed #333;"><span class="rep-label" style="color:var(--primary)">الزكاة المستحقة</span><span class="rep-val" style="color:var(--primary)">${fmt(d.zCrop)}</span></div>`;
    } else {
        cropDiv.innerHTML = '<div class="rep-label" style="text-align:center; color:#555;">لا يوجد زروع</div>';
    }

    // Cattle Details
    const cattleDiv = document.getElementById('r-cattle-section');
    if (d.cattleDetails && d.cattleDetails.count > 0) {
        cattleDiv.innerHTML = `<div class="rep-item"><div><span class="rep-label">زكاة الأنعام</span><span class="rep-sub-val">${d.cattleDetails.count} رأس</span></div><span class="rep-val" style="font-size:28px;">${d.cattleDetails.text}</span></div><div class="rep-item" style="margin-top:15px; padding-top:15px; border-top:1px dashed #333;"><span class="rep-label" style="color:var(--primary)">القيمة النقدية</span><span class="rep-val" style="color:var(--primary)">${fmt(d.zCattle)}</span></div>`;
    } else {
        cattleDiv.innerHTML = '<div class="rep-label" style="text-align:center; color:#555;">لا يوجد أنعام</div>';
    }

    // Others
    document.getElementById('r-z-re').innerText = fmt(d.zRe) + ' ' + cur;
    if (d.fitrDetails && d.fitrDetails.c > 0) {
        document.getElementById('r-fitr-desc').innerText = `${d.fitrDetails.c} أفراد × ${fmt(d.fitrDetails.v)}`;
        document.getElementById('r-z-fitr').innerText = fmt(d.zFitr) + ' ' + cur;
    } else {
        document.getElementById('r-fitr-desc').innerText = '--';
        document.getElementById('r-z-fitr').innerText = '0 ' + cur;
    }

    // Total
    document.getElementById('r-total-w').innerText = fmt(d.totalW) + ' ' + cur;
    document.getElementById('r-final-z').innerText = fmt(d.finalZ) + ' ' + cur;

    // Capture
    const studio = document.getElementById("zakat-report-studio");
    html2canvas(studio, {
        scale: 1.5,
        width: 1920,
        windowWidth: 1920,
        height: studio.scrollHeight,
        backgroundColor: '#050505'
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = `Zakat_Report_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
};

window.generateZakatReportPDF = function (refNum) {
    // Calling the imported robust PDF generator
    generateZakatReportPDF(refNum);
};
