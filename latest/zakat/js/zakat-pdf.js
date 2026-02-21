// اسم الملف: js/zakat-pdf.js
// الوظيفة: توليد ملفات PDF و QRCodes

export function tafqeet(number) {
    var value = Math.ceil(number);
    if (value === 0) return "صفر";

    const currencyMap = {
        'EGP': 'جنيهاً مصرياً', 'SAR': 'ريالاً سعودياً', 'USD': 'دولاراً أمريكياً',
        'AED': 'درهماً إماراتياً', 'QAR': 'ريالاً قطرياً', 'KWD': 'ديناراً كويتياً'
    };

    const currCode = (window.globalConfig && window.globalConfig.currency) ? window.globalConfig.currency : 'EGP';
    const currencyName = currencyMap[currCode] || (window.globalConfig ? window.globalConfig.symbol : 'عملة');

    const units = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
    const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

    function convertGroup(n) {
        if (n === 0) return "";
        var h = Math.floor(n / 100);
        var rem = n % 100;
        var t = Math.floor(rem / 10);
        var u = rem % 10;
        var text = "";

        if (h > 0) text += hundreds[h];
        if (rem > 0) {
            if (h > 0) text += " و";
            if (rem < 10) text += units[rem];
            else if (rem < 20) text += teens[rem - 10];
            else {
                if (u > 0) text += units[u] + " و";
                text += tens[t];
            }
        }
        return text;
    }

    var millions = Math.floor(value / 1000000);
    var remainder = value % 1000000;
    var thousands = Math.floor(remainder / 1000);
    var ones = remainder % 1000;
    var result = [];

    if (millions > 0) {
        var mText = convertGroup(millions);
        mText += (millions >= 3 && millions <= 10) ? " ملايين" : " مليون";
        result.push(mText);
    }
    if (thousands > 0) {
        var tText = convertGroup(thousands);
        if (thousands === 1) tText = "ألف";
        else if (thousands === 2) tText = "ألفان";
        else if (thousands >= 3 && thousands <= 10) tText += " آلاف";
        else tText += " ألف";
        result.push(tText);
    }
    if (ones > 0) result.push(convertGroup(ones));

    var finalString = result.join(" و");
    finalString = finalString.replace("واحد ألف", "ألف").replace("اثنان ألف", "ألفان");
    return "فقط " + finalString + " " + currencyName + " لا غير";
}

export function generateQRCodeBase64(text) {
    return new Promise((resolve) => {
        const div = document.createElement('div');
        if (typeof QRCode === 'undefined') {
            console.error("QRCode library not loaded! Check index.html");
            resolve("");
            return;
        }

        const qr = new QRCode(div, {
            text: text,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        setTimeout(() => {
            const img = div.querySelector('img');
            if (img && img.src) {
                resolve(img.src);
            } else {
                const canvas = div.querySelector('canvas');
                if (canvas) resolve(canvas.toDataURL());
                else resolve("");
            }
        }, 100);
    });
}

export async function generateZakatReportPDF(providedRef = null) {
    if (!window.reportData) {
        if (typeof window.calc === 'function') window.calc();
        else return alert("لا توجد بيانات للحساب");
    }

    const d = window.reportData;
    const cur = (window.globalConfig && window.globalConfig.symbol) ? window.globalConfig.symbol : 'ج.م';
    const fmt = (n) => Number(n || 0).toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const refNum = providedRef || Math.floor(Math.random() * 89999999) + 10000000;
    const issueDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

    const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    const verifyLink = `${window.location.origin}${currentPath}/verify.html#${refNum}`;

    const qrCodeImageSrc = await generateQRCodeBase64(verifyLink);

    let goldRows = '';
    if (d.goldDetails && d.goldDetails.length > 0) {
        let hasGold = false;
        d.goldDetails.forEach(item => {
            if (item.weight > 0) {
                hasGold = true;
                goldRows += `<tr><td class="item-name">- ${item.label} <span class="sub-info">(${item.weight} جم × ${fmt(item.price)})</span></td><td class="item-val">${fmt(item.total)}</td></tr>`;
            }
        });
        if (hasGold) goldRows = `<tr class="sec-header"><th colspan="2">أولاً: الذهب والفضة</th></tr>` + goldRows;
    }

    let moneyRows = '';
    if (d.moneyDetails && d.moneyDetails.length > 0) {
        moneyRows = `<tr class="sec-header"><th colspan="2">ثالثاً: السيولة النقدية وعروض التجارة</th></tr>`;
        d.moneyDetails.forEach(item => {
            if (item.val !== 0) {
                let labelText = item.val < 0 ? `(يخصم) ${item.label.replace('خصم ', '')}` : item.label;
                let style = item.val < 0 ? 'color:#d32f2f;' : '';
                moneyRows += `<tr><td class="item-name" style="${style}">- ${labelText}</td><td class="item-val" style="${style}">${fmt(Math.abs(item.val))} ${item.val < 0 ? '-' : ''}</td></tr>`;
            }
        });
    }

    let otherRows = '';
    if (d.cropDetails.w > 0 || d.cattleDetails.count > 0 || d.reDetails.inc > 0) {
        otherRows = `<tr class="sec-header"><th colspan="2">ثالثاً: بنود أخرى</th></tr>`;
        if (d.cropDetails.w > 0) otherRows += `<tr><td class="item-name">- زكاة الزروع (${d.cropDetails.w} كجم)</td><td class="item-val">${fmt(d.cropDetails.v)}</td></tr>`;
        if (d.cattleDetails.count > 0) otherRows += `<tr><td class="item-name">- زكاة الأنعام (${d.cattleDetails.count} رأس)</td><td class="item-val" style="direction:rtl">${d.cattleDetails.text}</td></tr>`;
        if (d.reDetails.inc > 0) otherRows += `<tr><td class="item-name">- صافي ربح المستغلات</td><td class="item-val">${fmt(d.reDetails.net)}</td></tr>`;
    }

    const reportHTML = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>Zakat Report ${refNum}</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@600;700&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
        <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; background: #fff; font-family: 'Amiri', serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .page-container { width: 210mm; min-height: 296mm; padding: 10mm; margin: 0 auto; box-sizing: border-box; }
            .border-box { border: 3px double #000; padding: 10px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
            .lbl { font-weight: 800; font-family: 'Amiri'; font-size: 11px; }
            .val { font-family: 'Arial', sans-serif; font-weight: bold; font-size: 11px; }
            .title-box { border: 2px solid #000; padding: 3px 15px; border-radius: 8px; font-family: 'Cairo'; font-weight: 700; font-size: 16px; display: inline-block; }
            .info-bar { background: #f5f5f5; border: 1px solid #000; padding: 4px; display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; font-family: 'Cairo'; font-size: 10px; }
            table.details-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
            table.details-table th, table.details-table td { border: 1px solid #000; padding: 4px 8px; }
            tr.sec-header th { background: #eee; text-align: right; font-family: 'Cairo'; font-size: 11px; padding: 6px; }
            .item-name { font-family: 'Amiri'; font-weight: bold; }
            .item-val { font-family: 'Arial'; font-weight: bold; text-align: left; width: 25%; direction: ltr; }
            .summary-section { display: flex; justify-content: space-between; gap: 10px; margin-top: 5px; }
            .summary-box { border: 1px solid #000; flex: 1; padding: 5px; }
            .s-title { font-size: 10px; font-family: 'Cairo'; font-weight: bold; border-bottom: 1px solid #ddd; margin-bottom: 5px; padding-bottom: 2px; }
            .s-row { display: flex; justify-content: space-between; font-size: 11px; }
            .total-area { border: 3px solid #000; padding: 8px; text-align: center; margin-top: 10px; background: #fdfbf7; }
            .footer-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 10px; }
            .stamp-circle { width: 60px; height: 60px; border: 3px double #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-10deg); font-size: 9px; font-weight: bold; margin: 0 auto; }
        </style>
    </head>
    <body>
        <div class="page-container">
            <div class="border-box">
                <div>
                    <div class="header">
                        <div style="width:32%; text-align:right;">
                            <div><span class="lbl">الجهة:</span> <span class="val">تطبيق زكاتي</span></div>
                            <div><span class="lbl">رقم الوصل:</span><span class="val" style="font-size:14px; background:#eee; padding:0 5px;">${refNum}</span></div>
                        </div>
                        <div style="width:36%; text-align:center;">
                            <div style="font-size:11px;">بسم الله الرحمن الرحيم</div>
                            <div class="title-box">شهادة زكاة</div>
                        </div>
                        <div style="width:32%; text-align:left;">
                            <div><span class="lbl">التاريخ:</span> <span class="val">${issueDate}</span></div>
                            <div><span class="lbl">هجري:</span> <span class="val">${hijriDate}</span></div>
                        </div>
                    </div>

                    <div class="info-bar">
                        <div><span>المكلف:</span> ...........................................</div>
                        <div style="direction:rtl;">رقم الوصل المرجعي: <span style="font-family:monospace; font-weight:bold;">${refNum}</span></div>
                    </div>

                    <table class="details-table">
                        ${goldRows} ${moneyRows} ${otherRows}
                        <tr style="background:#333; color:#fff;">
                            <th style="border:1px solid #000;">صافي الوعاء</th>
                            <td style="font-family:'Arial'; font-weight:bold; font-size:14px; text-align:left;">${fmt(d.totalW)}</td>
                        </tr>
                    </table>

                    <div class="sec-title" style="margin-top:10px; font-weight:bold;">رابعاً: ملخص الزكاة المستحقة</div>
                    <div class="summary-section">
                        <div class="summary-box">
                            <div class="s-title">زكاة المال (2.5%)</div>
                            <div class="s-row"><span>القيمة:</span> <span style="font-family:Arial; font-weight:bold;">${fmt(d.zMoney)}</span></div>
                        </div>
                        ${d.zCrop > 0 ? `<div class="summary-box"><div class="s-title">زكاة الزروع</div><div class="s-row"><span>القيمة:</span> <span style="font-family:Arial; font-weight:bold;">${fmt(d.zCrop)}</span></div></div>` : ''}
                        ${(d.zCattle + d.zRe) > 0 ? `<div class="summary-box"><div class="s-title">أنعام/مستغلات</div><div class="s-row"><span>القيمة:</span> <span style="font-family:Arial; font-weight:bold;">${fmt(d.zCattle + d.zRe)}</span></div></div>` : ''}
                        ${d.zFitr > 0 ? `<div class="summary-box"><div class="s-title">زكاة الفطر</div><div class="s-row"><span>القيمة:</span> <span style="font-family:Arial; font-weight:bold;">${fmt(d.zFitr)}</span></div></div>` : ''}
                    </div>

                    <div class="total-area">
                        <div style="background:#111; color:#fff; padding:5px; font-size:12px; font-family:'Cairo'; display:flex; justify-content:space-between;">
                            <span>إجمالي المستحق للدفع</span>
                            <span style="font-family:monospace; letter-spacing:2px;">#${refNum}</span>
                        </div>
                        <div style="padding:15px 20px; display:flex; align-items:center; justify-content:space-between;">
                            <div style="flex:1; text-align:right;">
                                <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:5px;">
                                    <span style="font-size:42px; font-weight:900; font-family:'Arial';">${fmt(Math.ceil(d.finalZ))}</span>
                                    <span style="font-size:14px; background:#000; color:#fff; padding:2px 8px; border-radius:4px; font-weight:bold;">${cur}</span>
                                </div>
                                <div style="font-family:'Amiri'; font-size:14px; color:#555; font-weight:bold; border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:8px 0; font-style:italic;">
                                    ${tafqeet(d.finalZ)}
                                </div>
                            </div>
                            <div style="width:80px; border-right:1px solid #ddd; padding-right:15px; margin-right:15px; text-align:center;">
                                <img src="${qrCodeImageSrc}" style="width:70px; height:70px;">
                                <div style="font-size:8px; margin-top:2px;">Scan to Verify</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-row">
                    <div style="text-align:center; width:30%;"><div style="font-size:10px; font-weight:bold;">المدقق الشرعي</div><div style="margin-top:15px;">..................</div></div>
                    <div style="text-align:center;"><div class="stamp-circle">الختم<br>الرسمي</div></div>
                    <div style="text-align:center; width:30%;"><div style="font-size:10px; font-weight:bold;">رقم الوصل (للاستعلام)</div><div style="font-family:'Courier New'; font-size:9px; margin-top:5px;">${refNum}</div></div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute; width:0; height:0; border:none;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(reportHTML);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
}
