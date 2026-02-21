// اسم الملف: js/verify-print.js
// الوظيفة: طباعة التقرير من صفحة التحقق
import { tafqeet, generateQRCodeBase64 } from './zakat-pdf.js';

// ===================== 2. دالة الطباعة الرئيسية =====================

async function printVerifiedReport(data) {
    if (!data) return alert("لا توجد بيانات للطباعة");

    // 1. تجهيز البيانات
    const refNum = data.ref_num;
    const totalAmount = parseFloat(data.total_amount);
    const currency = data.currency || 'EGP';

    // تنسيق التاريخ: نستخدم تاريخ إنشاء التقرير الأصلي
    const createdDate = new Date(data.created_at);
    const issueDate = createdDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(createdDate);

    // دالة تنسيق الأرقام
    const fmt = (n) => Number(n || 0).toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // 2. الميزة الذكية: الباركود هو رابط الصفحة الحالية
    // هذا يضمن أن من يمسح الباركود يعود لنفس هذه الصفحة
    const currentVerifyLink = window.location.href;
    const qrCodeImageSrc = await generateQRCodeBase64(currentVerifyLink);

    // 3. تحويل المدخلات الخام (Raw Inputs) إلى صفوف الجدول
    // نحتاج لقاموس لترجمة المفاتيح الإنجليزية للعربية
    const dictionary = {
        "g18": "ذهب عيار 18", "g21": "ذهب عيار 21", "g24": "ذهب عيار 24",
        "sil": "فضة", "silver": "فضة",
        "cash_hand": "سيولة نقدية", "cash_bank": "رصيد بنكي",
        "trade_val": "عروض تجارة", "stock_trade": "أسهم تجارية",
        "re_income": "عائد مستغلات",
        "crop_val": "قيمة زروع", "crop_weight": "وزن زروع",
        "cattle_count": "عدد ماشية", "cattle_price": "سعر الرأس",
        "fitr_count": "عدد أفراد (فطر)", "fitr_val": "قيمة الفرد",
        "crypto_count": "عملات رقمية", "crypto_unit_price": "سعر العملة"
    };

    let inputs = data.raw_inputs;
    if (typeof inputs === 'string') { try { inputs = JSON.parse(inputs); } catch (e) { } }

    // بناء صفوف الجدول
    let tableRows = '';

    // تجميع الذهب (اختياري للتنظيم)
    let goldHTML = '';
    const goldKeys = ['g18', 'g21', 'g24', 'sil', 'silver', 'gold_18', 'gold_21', 'gold_24'];
    let hasGold = false;

    // تجميع الأموال
    let moneyHTML = '';
    const moneyKeys = ['cash_hand', 'cash_bank', 'trade_val', 'stock_trade', 're_income', 'cash_owed_to_user'];
    let hasMoney = false;

    // تجميع الباقي
    let otherHTML = '';

    // مصفوفة للمفاتيح التي تم استخدامها لتجنب التكرار
    const processedKeys = new Set(['report-title-input', 'pin']);

    Object.entries(inputs).forEach(([key, val]) => {
        if (!val || val == 0 || processedKeys.has(key)) return;
        const numVal = parseFloat(val);
        if (isNaN(numVal)) return; // تجاهل النصوص غير الرقمية

        const label = dictionary[key] || dictionary[key.replace(/_/g, ' ')] || key;
        const row = `<tr><td class="item-name">- ${label}</td><td class="item-val">${fmt(numVal)}</td></tr>`;

        if (goldKeys.some(k => key.includes(k))) {
            goldHTML += row; hasGold = true;
        } else if (moneyKeys.some(k => key.includes(k))) {
            moneyHTML += row; hasMoney = true;
        } else {
            otherHTML += row;
        }
    });

    if (hasGold) tableRows += `<tr class="sec-header"><th colspan="2">الذهب والفضة</th></tr>` + goldHTML;
    if (hasMoney) tableRows += `<tr class="sec-header"><th colspan="2">الأموال والتجارة</th></tr>` + moneyHTML;
    if (otherHTML) tableRows += `<tr class="sec-header"><th colspan="2">بنود أخرى</th></tr>` + otherHTML;


    // 4. بناء كود HTML للطباعة (نفس تصميم zakat-pdf-design.js بالمللي)
    const reportHTML = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>Zakat Verified Report ${refNum}</title>
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
                            <div class="title-box">شهادة زكاة (نسخة طبق الأصل)</div>
                        </div>
                        <div style="width:32%; text-align:left;">
                            <div><span class="lbl">تاريخ الإصدار:</span> <span class="val">${issueDate}</span></div>
                            <div><span class="lbl">هجري:</span> <span class="val">${hijriDate}</span></div>
                        </div>
                    </div>

                    <div class="info-bar">
                        <div><span>الحالة:</span> <span style="color:green">✔ موثقة ومعتمدة</span></div>
                        <div style="direction:rtl;">الرقم المرجعي: <span style="font-family:monospace; font-weight:bold;">${refNum}</span></div>
                    </div>

                    <table class="details-table">
                        ${tableRows}
                    </table>

                    <div class="total-area">
                        <div style="background:#111; color:#fff; padding:5px; font-size:12px; font-family:'Cairo'; display:flex; justify-content:space-between;">
                            <span>إجمالي الزكاة المستحقة</span>
                            <span style="font-family:monospace; letter-spacing:2px;">#${refNum}</span>
                        </div>
                        <div style="padding:15px 20px; display:flex; align-items:center; justify-content:space-between;">
                            <div style="flex:1; text-align:right;">
                                <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:5px;">
                                    <span style="font-size:42px; font-weight:900; font-family:'Arial';">${fmt(totalAmount)}</span>
                                    <span style="font-size:14px; background:#000; color:#fff; padding:2px 8px; border-radius:4px; font-weight:bold;">${currency}</span>
                                </div>
                                <div style="font-family:'Amiri'; font-size:14px; color:#555; font-weight:bold; border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:8px 0; font-style:italic;">
                                    ${tafqeet(totalAmount)}
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
                    <div style="text-align:center; width:30%;"><div style="font-size:10px; font-weight:bold;">تحقق إلكترونياً</div><div style="font-family:'Courier New'; font-size:9px; margin-top:5px;">${refNum}</div></div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    // 5. فتح نافذة الطباعة
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

// Make globally available
window.printVerifiedReport = printVerifiedReport;