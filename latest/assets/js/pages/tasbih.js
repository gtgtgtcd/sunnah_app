/* =========================================================================
   ROYAL TASBIH ENGINE - V3.1 (MINIMALIST ELEGANCE)
   تم التحديث: تنظيف النصوص + إزالة الإيموجي + توحيد نمط النسخ (Royal Style)
   ========================================================================= */

// ==================== STATE MANAGEMENT ====================
let count = 0;
let target = 100;
let isSoundOn = true;
let isVibrateOn = true;
let currentDhikrKey = 'essentials.subhan-bihamdihi';

// Stats
let stats = JSON.parse(localStorage.getItem('tasbihStats')) || {
    totalToday: 0,
    totalAll: 0,
    streak: 0,
    lastDate: new Date().toDateString()
};

// Notification Settings
let notificationSettings = JSON.parse(localStorage.getItem('tasbihNotifications')) || {
    enabled: false,
    morningReminder: false,
    eveningReminder: false,
    sleepReminder: false,
    achievementNotif: true
};

// Auto-advance Setting
let isAutoAdvanceEnabled = localStorage.getItem('tasbihAutoAdvance') !== 'false';

let notificationTimers = [];

// Custom Dhikr Storage
let customDhikrs = JSON.parse(localStorage.getItem('customDhikrs')) || [];

// ==================== 1. DHIKR DATABASE (THE DIAMOND MATRIX) ====================
const dhikrCategories = {
    'essentials': {
        name: 'الباقيات الصالحات',
        icon: 'fa-star',
        color: '#4ff0b7',
        dhikrs: {
            'subhan': { text: 'سُبْحَانَ اللهِ', target: 100, benefit: 'تكتب ألف حسنة أو تحط ألف خطيئة', source: 'رواه مسلم (2698)' },
            'hamd': { text: 'الْحَمْدُ لِلَّهِ', target: 100, benefit: 'تملأ الميزان، وهي أفضل الدعاء', source: 'رواه مسلم (223)' },
            'takbir': { text: 'اللهُ أَكْبَرُ', target: 100, benefit: 'أحب الكلام إلى الله', source: 'رواه مسلم (2137)' },
            'tahlil': { text: 'لَا إِلَهَ إِلَّا اللهُ', target: 100, benefit: 'أفضل الذكر، وتجدد الإيمان', source: 'رواه الترمذي (3383)' },
            'subhan-bihamdihi': { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', target: 100, benefit: 'حُطت خطاياه وإن كانت مثل زبد البحر', source: 'متفق عليه' },
            'subhan-azeem': { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ', target: 100, benefit: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان', source: 'متفق عليه' },
            'hawqala': { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', target: 100, benefit: 'كنز من كنوز الجنة وشفاء من 99 داء', source: 'متفق عليه' },
            'four-words': { text: 'سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ', target: 100, benefit: 'أحب الكلام إلى الله، لا يضرك بأيهن بدأت', source: 'رواه مسلم (2137)' },
            'adad-khalqih': { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ', target: 3, benefit: 'تعدل أذكار الصباح والنهار كلها في الأجر', source: 'رواه مسلم (2726)' },
            'astaghfir-simple': { text: 'أَسْتَغْفِرُ اللهَ', target: 100, benefit: 'طوبى لمن وجد في صحيفته استغفاراً كثيراً', source: 'رواه ابن ماجه' },
            'tawheed-100': { text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', target: 100, benefit: 'عدل عشر رقاب، ومائة حسنة، ومحو مائة سيئة', source: 'متفق عليه' }
        }
    },
    'relief': {
        name: 'تفريج الكروب',
        icon: 'fa-heart-crack',
        color: '#f472b6',
        dhikrs: {
            'yunus': { text: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', target: 100, benefit: 'دعوة ذي النون، لم يدعُ بها مكروب إلا استجاب الله له', source: 'رواه الترمذي (3505)' },
            'hasbi': { text: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ', target: 100, benefit: 'قالها إبراهيم في النار، وقالها محمد في المعركة', source: 'صحيح البخاري (4563)' },
            'karb-dua': { text: 'لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ', target: 33, benefit: 'دعاء الكرب الذي كان يدعو به النبي ﷺ', source: 'متفق عليه' },
            'ya-hayyu': { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', target: 40, benefit: 'كان النبي ﷺ إذا حزبه أمر قالها', source: 'رواه الترمذي' },
            'allah-allah': { text: 'اللهُ اللهُ رَبِّي لَا أُشْرِكُ بِهِ شَيْئًا', target: 100, benefit: 'دعوات المكروب', source: 'صحيح أبي داود' },
            'istighfar-relief': { text: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ', target: 100, benefit: 'من لزم الاستغفار جعل الله له من كل هم فرجاً', source: 'رواه أبو داود' },
            'salawat-relief': { text: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ', target: 100, benefit: 'تُكفى همك ويُغفر ذنبك', source: 'رواه الترمذي' },
            'dua-ayub': { text: 'رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ', target: 100, benefit: 'دعاء أيوب عليه السلام فكشف الله ما به من ضر', source: 'سورة الأنبياء (83)' },
            'dua-musa': { text: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', target: 100, benefit: 'دعاء موسى عليه السلام للرزق والفرج', source: 'سورة القصص (24)' }
        }
    },
    'rizq': {
        name: 'مفاتيح الرزق',
        icon: 'fa-wheat-awn',
        color: '#fbbf24',
        dhikrs: {
            'istighfar-rizq': { text: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', target: 100, benefit: 'يرسل السماء عليكم مدراراً ويمددكم بأموال وبنين', source: 'سورة نوح' },
            'malik-haqq': { text: 'لَا إِلَهَ إِلَّا اللهُ الْمَلِكُ الْحَقُّ الْمُبِينُ', target: 100, benefit: 'أمان من الفقر وأنس في القبر', source: 'رواه الخطيب' },
            'subhan-rizq': { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ، أَسْتَغْفِرُ اللهَ', target: 100, benefit: 'صلاة الملائكة وبها تُرزق الخلائق (بين الفجر والصلاة)', source: 'الأدب المفرد' },
            'dua-rizq-prophet': { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', target: 7, benefit: 'كان يقولها النبي ﷺ بعد صلاة الصبح', source: 'رواه ابن ماجه' },
            'dua-ghina': { text: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', target: 7, benefit: 'لو كان عليك مثل جبل صبير ديناً لأداه الله عنك', source: 'رواه الترمذي' },
            'wasi-maghfirah': { text: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَارْزُقْنِي وَعَافِنِي', target: 33, benefit: 'تجمع خيري الدنيا والآخرة', source: 'رواه مسلم' }
        }
    },
    'protection': {
        name: 'التحصين والحفظ',
        icon: 'fa-shield-halved',
        color: '#38bdf8',
        dhikrs: {
            'bismillah-protection': { text: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', target: 3, benefit: 'من قالها 3 مرات لم يضره شيء (صباحاً ومساءً)', source: 'رواه الترمذي' },
            'audhu-kalimat': { text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', target: 3, benefit: 'لم يضره شيء حتى يرحل من منزله', source: 'رواه مسلم' },
            'hasbi-allah': { text: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', target: 7, benefit: 'كفاه الله ما أهمه من أمر الدنيا والآخرة', source: 'رواه أبو داود' },
            'audhu-ghadab': { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ', target: 1, benefit: 'تحصين من الفزع والأرق', source: 'رواه الترمذي' }
        }
    },
    'salawat': {
        name: 'الصلاة على النبي',
        icon: 'fa-kaaba',
        color: '#a78bfa',
        dhikrs: {
            'salah-simple': { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100, benefit: 'من صلى علي صلاة صلى الله عليه بها عشراً', source: 'رواه مسلم' },
            'salah-ibrahim': { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ...', target: 10, benefit: 'الصلاة الإبراهيمية (أكمل الصيغ وأعظمها أجراً)', source: 'متفق عليه' },
            'salah-friday': { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ النَّبِيِّ الأُمِّيِّ', target: 80, benefit: 'مستحبة يوم الجمعة (عن أبي هريرة)', source: 'سنن الدارقطني' },
            'salah-shafaa': { text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَأَنْزِلْهُ الْمَقْعَدَ الْمُقَرَّبَ عِنْدَكَ يَوْمَ الْقِيَامَةِ', target: 10, benefit: 'وجبت له شفاعتي', source: 'رواه الطبراني' }
        }
    },
    'after-salah': {
        name: 'ختام الصلاة',
        icon: 'fa-mosque',
        color: '#10b981',
        dhikrs: {
            'subhan-33': { text: 'سُبْحَانَ اللهِ', target: 33, benefit: 'المعقبات لا يخيب قائلهن (دبر كل صلاة)', source: 'رواه مسلم' },
            'hamd-33': { text: 'الْحَمْدُ لِلَّهِ', target: 33, benefit: 'المعقبات لا يخيب قائلهن', source: 'رواه مسلم' },
            'takbir-33': { text: 'اللهُ أَكْبَرُ', target: 33, benefit: 'المعقبات لا يخيب قائلهن', source: 'رواه مسلم' },
            'finish-100': { text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ...', target: 1, benefit: 'تمام المائة: غفرت خطاياه وإن كانت مثل زبد البحر', source: 'رواه مسلم' },
            'allahumma-ainni': { text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', target: 1, benefit: 'وصية النبي ﷺ لمعاذ بن جبل دبر كل صلاة', source: 'رواه أبو داود' }
        }
    }
};

// ==================== 2. AUDIO MAPPING ====================
const dhikrAudioMap = {
    'essentials.subhan': '../assets/audio/dhikr/subhan/subhan.wav',
    'essentials.hamd': '../assets/audio/dhikr/hamd/hamd.wav',
    'essentials.takbir': '../assets/audio/dhikr/takbir/takbir.wav',
    'essentials.tahlil': '../assets/audio/dhikr/tahlil/tahlil.wav',
    'essentials.subhan-bihamdihi': '../assets/audio/dhikr/subhan-bihamdihi/subhan-bihamdihi.wav',
    'essentials.subhan-azeem': '../assets/audio/dhikr/subhan-azeem/subhan-azeem.wav',
    'essentials.hawqala': '../assets/audio/dhikr/hawqala/hawqala.wav',
    'essentials.four-words': '../assets/audio/dhikr/four-words/four-words.wav',
    'essentials.adad-khalqih': '../assets/audio/dhikr/adad-khalqih/adad-khalqih.wav',
    'essentials.astaghfir-simple': '../assets/audio/dhikr/astaghfir-simple/astaghfir-simple.wav',
    'essentials.tawheed-100': '../assets/audio/dhikr/tawheed-100/tawheed-100.wav',
    'relief.yunus': '../assets/audio/dhikr/yunus/yunus.wav',
    'relief.hasbi': '../assets/audio/dhikr/hasbi/hasbi.wav',
    'relief.karb-dua': '../assets/audio/dhikr/karb-dua/karb-dua.wav',
    'relief.ya-hayyu': '../assets/audio/dhikr/ya-hayyu/ya-hayyu.wav',
    'relief.allah-allah': '../assets/audio/dhikr/allah-allah/allah-allah.wav',
    'relief.istighfar-relief': '../assets/audio/dhikr/istighfar-relief/istighfar-relief.wav',
    'relief.salawat-relief': '../assets/audio/dhikr/salawat-relief/salawat-relief.wav',
    'relief.dua-ayub': '../assets/audio/dhikr/dua-ayub/dua-ayub.wav',
    'relief.dua-musa': '../assets/audio/dhikr/dua-musa/dua-musa.wav',
    'rizq.istighfar-rizq': '../assets/audio/dhikr/istighfar-rizq/istighfar-rizq.wav',
    'rizq.malik-haqq': '../assets/audio/dhikr/malik-haqq/malik-haqq.wav',
    'rizq.subhan-rizq': '../assets/audio/dhikr/subhan-rizq/subhan-rizq.wav',
    'rizq.dua-rizq-prophet': '../assets/audio/dhikr/dua-rizq-prophet/dua-rizq-prophet.wav',
    'rizq.dua-ghina': '../assets/audio/dhikr/dua-ghina/dua-ghina.wav',
    'rizq.wasi-maghfirah': '../assets/audio/dhikr/wasi-maghfirah/wasi-maghfirah.wav',
    'protection.bismillah-protection': '../assets/audio/dhikr/bismillah-protection/bismillah-protection.wav',
    'protection.audhu-kalimat': '../assets/audio/dhikr/audhu-kalimat/audhu-kalimat.wav',
    'protection.hasbi-allah': '../assets/audio/dhikr/hasbi-allah/hasbi-allah.wav',
    'protection.audhu-ghadab': '../assets/audio/dhikr/audhu-ghadab/audhu-ghadab.wav',
    'salawat.salah-simple': '../assets/audio/dhikr/salah-simple/salah-simple.wav',
    'salawat.salah-ibrahim': '../assets/audio/dhikr/salah-ibrahim/salah-ibrahim.wav',
    'salawat.salah-friday': '../assets/audio/dhikr/salah-friday/salah-friday.wav',
    'salawat.salah-shafaa': '../assets/audio/dhikr/salah-shafaa/salah-shafaa.wav',
    'after-salah.subhan-33': '../assets/audio/dhikr/subhan/subhan.wav',
    'after-salah.hamd-33': '../assets/audio/dhikr/hamd/hamd.wav',
    'after-salah.takbir-33': '../assets/audio/dhikr/takbir/takbir.wav',
    'after-salah.finish-100': '../assets/audio/dhikr/tawheed-100/tawheed-100.wav',
    'after-salah.allahumma-ainni': '../assets/audio/dhikr/allahumma-ainni/allahumma-ainni.wav'
};

// DOM Elements
const counterEl = document.getElementById('counter');
const progressRing = document.getElementById('progressRing');
const tasbihBtn = document.getElementById('tasbihBtn');
const targetDisplay = document.getElementById('targetDisplay');
const currentDhikr = document.getElementById('currentDhikr');
const currentBenefit = document.getElementById('currentBenefit');
const currentCategory = document.getElementById('currentCategory');
const bottomDhikrTextEl = document.getElementById('bottomDhikrText');
const bottomControlsEl = document.getElementById('bottomControls');
const completionOverlay = document.getElementById('completionOverlay');
const completionTitleEl = document.getElementById('completionTitle');
const completionDescEl = document.getElementById('completionDesc');
const completionQuoteEl = document.getElementById('completionQuote');
const totalTodayEl = document.getElementById('totalToday');
const totalAllEl = document.getElementById('totalAll');
const streakEl = document.getElementById('streak');
const levelEl = document.getElementById('level');

// ==================== CATEGORY SEQUENCE (AFTER SALAH) ====================
const AFTER_SALAH_SEQUENCE = [
    'after-salah.subhan-33',
    'after-salah.hamd-33',
    'after-salah.takbir-33',
    'after-salah.finish-100',
    'after-salah.allahumma-ainni'
];

let activeSequence = null;

function isAfterSalahDhikr(fullKey) {
    return typeof fullKey === 'string' && fullKey.startsWith('after-salah.');
}

function ensureSequenceForDhikr(fullKey) {
    if (!isAfterSalahDhikr(fullKey)) {
        activeSequence = null;
        return;
    }
    const idx = AFTER_SALAH_SEQUENCE.indexOf(fullKey);
    if (idx === -1) {
        activeSequence = null;
        return;
    }
    activeSequence = {
        name: 'ختام الصلاة',
        order: AFTER_SALAH_SEQUENCE,
        index: idx
    };
}

function getRandomCompletionQuote() {
    const quotes = [
        'قال ﷺ: «أحب الأعمال إلى الله أدومها وإن قل»',
        'قال تعالى: «فَاذْكُرُونِي أَذْكُرْكُمْ»',
        'قال ﷺ: «سبق المفردون… الذاكرون الله كثيرًا والذاكرات»',
        'قال تعالى: «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function showCompletionModal(title, desc) {
    if (!completionOverlay) return;
    if (completionTitleEl) completionTitleEl.innerText = title;
    if (completionDescEl) completionDescEl.innerText = desc;
    if (completionQuoteEl) completionQuoteEl.innerText = getRandomCompletionQuote();
    if (window.MobileNav) MobileNav.pushState('completionOverlay');
    completionOverlay.classList.add('active');
}

window.hideCompletionModal = function (e) {
    if (e && e.target && e.target !== completionOverlay) return;
    if (!completionOverlay) return;
    completionOverlay.classList.remove('active');
}

// ==================== AUDIO LOGIC ====================
let currentAudioObj = null;

function setSpeakBtnPlaying(isPlaying) {
    const btn = document.getElementById('speakDhikrBtn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (isPlaying) {
        btn.classList.add('playing');
        if (icon) icon.className = 'fas fa-stop';
    } else {
        btn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-volume-up';
    }
}

function stopAnyDhikrAudio() {
    try {
        if (currentAudioObj) {
            currentAudioObj.pause();
            currentAudioObj.currentTime = 0;
        }
    } catch (_) { }
    currentAudioObj = null;
    try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (_) { }
    setSpeakBtnPlaying(false);
}

function playRealAudio(path) {
    stopAnyDhikrAudio();
    setSpeakBtnPlaying(true);
    const audio = new Audio(path);
    currentAudioObj = audio;
    let fallbackTriggered = false;

    const triggerFallback = () => {
        if (fallbackTriggered) return;
        fallbackTriggered = true;
        currentAudioObj = null;
        const text = (currentDhikr && currentDhikr.innerText) ? currentDhikr.innerText.trim() : '';
        if (text) {
            playBrowserTTS(text);
        } else {
            setSpeakBtnPlaying(false);
        }
    };

    audio.onended = function () {
        currentAudioObj = null;
        setSpeakBtnPlaying(false);
    };
    audio.onerror = function () {
        triggerFallback();
    };
    audio.play().catch((err) => {
        if (!fallbackTriggered) triggerFallback();
    });
}

function playBrowserTTS(text) {
    if (!('speechSynthesis' in window)) {
        alert('ميزة النطق غير مدعومة على هذا المتصفح');
        return;
    }
    setSpeakBtnPlaying(true);
    try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ar-SA';
        utter.rate = 0.8;
        utter.pitch = 1;
        utter.volume = 1;

        const loadVoicesAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            const suitableVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic'));
            if (suitableVoice) utter.voice = suitableVoice;
            utter.onend = function () { setSpeakBtnPlaying(false); };
            utter.onerror = function () { setSpeakBtnPlaying(false); };
            if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
            setTimeout(() => { window.speechSynthesis.speak(utter); }, 50);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
            window.speechSynthesis.getVoices();
        } else {
            loadVoicesAndSpeak();
        }
    } catch (err) {
        setSpeakBtnPlaying(false);
    }
}

window.speakCurrentDhikr = function () {
    const isAudioPlaying = !!(currentAudioObj && !currentAudioObj.paused);
    const isTtsPlaying = !!(window.speechSynthesis && window.speechSynthesis.speaking);
    if (isAudioPlaying || isTtsPlaying) {
        stopAnyDhikrAudio();
        return;
    }
    const fullKey = currentDhikrKey;
    const audioPath = dhikrAudioMap[fullKey];
    if (audioPath) {
        playRealAudio(audioPath);
        return;
    }
    const text = (currentDhikr && currentDhikr.innerText) ? currentDhikr.innerText.trim() : '';
    if (!text) return;
    playBrowserTTS(text);
}

// ==================== MOBILE TAP RELIABILITY ====================
let isPointerDownOnTasbih = false;
let pointerDownX = 0;
let pointerDownY = 0;
let hasMovedBeyondTapThreshold = false;
const TAP_MOVE_THRESHOLD_PX = 12;

function addPressedState() {
    if (tasbihBtn) tasbihBtn.classList.add('is-pressed');
}

function removePressedState() {
    if (tasbihBtn) tasbihBtn.classList.remove('is-pressed');
}

function bindTasbihPointerHandlers() {
    if (!tasbihBtn) return;

    tasbihBtn.addEventListener('pointerdown', (e) => {
        isPointerDownOnTasbih = true;
        hasMovedBeyondTapThreshold = false;
        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
        addPressedState();
        if (tasbihBtn.setPointerCapture && typeof e.pointerId === 'number') {
            try { tasbihBtn.setPointerCapture(e.pointerId); } catch (_) { }
        }
    }, { passive: true });

    tasbihBtn.addEventListener('pointermove', (e) => {
        if (!isPointerDownOnTasbih) return;
        const dx = Math.abs(e.clientX - pointerDownX);
        const dy = Math.abs(e.clientY - pointerDownY);
        if (dx > TAP_MOVE_THRESHOLD_PX || dy > TAP_MOVE_THRESHOLD_PX) {
            hasMovedBeyondTapThreshold = true;
            removePressedState();
        }
    }, { passive: true });

    tasbihBtn.addEventListener('pointerup', (e) => {
        if (!isPointerDownOnTasbih) return;
        isPointerDownOnTasbih = false;
        removePressedState();
        if (!hasMovedBeyondTapThreshold) {
            if (e.cancelable) e.preventDefault();
            window.countUp(e);
        }
    }, { passive: false });

    tasbihBtn.addEventListener('pointercancel', () => {
        isPointerDownOnTasbih = false;
        hasMovedBeyondTapThreshold = false;
        removePressedState();
    }, { passive: true });
}

// ==================== INITIALIZATION ====================
function init() {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (stats.lastDate === yesterday && stats.totalToday > 0) {
            stats.streak++;
        } else if (stats.totalToday === 0) {
            // Keep streak
        } else {
            stats.streak = 0;
        }
        stats.totalToday = 0;
        stats.lastDate = today;
        saveStats();
    }
    updateStatsUI();
    setupProgressCircle();
    loadSavedState();
    buildCategoriesUI();
    createStars();
    bindTasbihPointerHandlers();
    updateBottomControlsLayout();
}

function updateBottomControlsLayout() {
    if (!bottomControlsEl) return;
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        bottomControlsEl.style.right = '12px';
        bottomControlsEl.style.left = '12px';
        return;
    }
    let sidebarWidth = 0;
    if (sidebar) {
        sidebarWidth = sidebar.classList.contains('collapsed') ? 90 : 300;
    }
    bottomControlsEl.style.left = '12px';
    bottomControlsEl.style.right = `calc(${sidebarWidth}px + 12px)`;
}

// ==================== BUILD CATEGORIES UI ====================
function buildCategoriesUI() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';

    const customCategory = addCustomDhikrsToCategories();
    const allCategories = { ...dhikrCategories };
    if (customCategory) {
        allCategories['custom'] = customCategory;
    }

    Object.keys(allCategories).forEach(catKey => {
        const category = allCategories[catKey];
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <div class="category-title">
                <div class="category-icon" style="color: ${category.color};">
                    <i class="fas ${category.icon}"></i>
                </div>
                <span>${category.name}</span>
            </div>
            <i class="fas fa-chevron-down category-chevron"></i>
        `;

        const categoryItems = document.createElement('div');
        categoryItems.className = 'category-items';

        Object.keys(category.dhikrs).forEach(dhikrKey => {
            const dhikr = category.dhikrs[dhikrKey];
            const fullKey = `${catKey}.${dhikrKey}`;

            const card = document.createElement('div');
            card.className = 'dhikr-card';
            card.setAttribute('data-dhikr', fullKey);
            card.onclick = () => setDhikr(fullKey);

            const deleteBtn = dhikr.isCustom ?
                `<button class="delete-custom-btn" onclick="event.stopPropagation(); deleteCustomDhikr('${dhikrKey}')">
                    <i class="fas fa-trash"></i>
                </button>` : '';

            card.innerHTML = `
                <div class="dhikr-icon" style="color: ${category.color};">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="dhikr-info">
                    <div class="dhikr-name">${dhikr.text.substring(0, 30)}${dhikr.text.length > 30 ? '...' : ''}</div>
                    <div class="dhikr-count">${dhikr.target} ${dhikr.target === 1 ? 'مرة واحدة' : 'مرة'}</div>
                </div>
                ${deleteBtn}
            `;
            categoryItems.appendChild(card);
        });

        categoryHeader.onclick = () => {
            categoryHeader.classList.toggle('active');
            categoryItems.classList.toggle('expanded');
        };

        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryItems);
        container.appendChild(categorySection);
    });

    const firstHeader = container.querySelector('.category-header');
    const firstItems = container.querySelector('.category-items');
    if (firstHeader && firstItems) {
        firstHeader.classList.add('active');
        firstItems.classList.add('expanded');
    }
}

// ==================== PROGRESS CIRCLE ====================
const circumference = 2 * Math.PI * 120;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setupProgressCircle() {
    setProgress(0);
}

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

// ==================== CORE COUNTING LOGIC ====================
window.countUp = function (e) {
    count++;
    counterEl.innerText = count;

    let progressPercent = (count % target) / target * 100;
    if (count % target === 0 && count !== 0) progressPercent = 100;
    setProgress(progressPercent);

    createRipple(e);

    if (isVibrateOn && navigator.vibrate) {
        try { navigator.vibrate(15); } catch (e) { }
    }
    if (isSoundOn) playSound('click');

    stats.totalToday++;
    stats.totalAll++;
    updateStatsUI();

    if (count % target === 0) {
        targetReachedEffect();
        if (isAutoAdvanceEnabled && activeSequence && activeSequence.order && activeSequence.index != null) {
            const nextIndex = activeSequence.index + 1;
            if (nextIndex < activeSequence.order.length) {
                const nextKey = activeSequence.order[nextIndex];
                window.setDhikr(nextKey);
            } else {
                activeSequence = null;
                showCompletionModal('مبروك 🎉', 'أتممت ختام الصلاة بنجاح.');
            }
        }
    }
    saveStats();
    saveCounterState();
}

// ==================== VISUAL EFFECTS ====================
function createRipple(e) {
    const rect = tasbihBtn.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    tasbihBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function targetReachedEffect() {
    tasbihBtn.style.borderColor = "#fff";
    tasbihBtn.style.boxShadow = "0 0 80px var(--primary), inset 0 0 40px var(--primary)";
    setTimeout(() => {
        tasbihBtn.style.borderColor = "var(--primary)";
        tasbihBtn.style.boxShadow = "0 0 40px var(--primary-dim), inset 0 0 30px rgba(0,0,0,0.9)";
        setProgress(0);
    }, 400);
    if (isVibrateOn && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    if (isSoundOn) playSound('complete');
}

// ==================== CONTROLS ====================
window.resetCounter = function (silent = false) {
    count = 0;
    counterEl.innerText = 0;
    setProgress(0);
    saveCounterState();
    if (!silent) {
        try { if (navigator.vibrate) navigator.vibrate(50); } catch (e) { }
    }
}

window.toggleSound = function () {
    isSoundOn = !isSoundOn;
    const toggle = document.getElementById('soundToggle');
    toggle.classList.toggle('active', isSoundOn);
    localStorage.setItem('tasbihSoundOn', isSoundOn);
}

window.toggleVibrate = function () {
    isVibrateOn = !isVibrateOn;
    const toggle = document.getElementById('vibrateToggle');
    toggle.classList.toggle('active', isVibrateOn);
    localStorage.setItem('tasbihVibrateOn', isVibrateOn);
}

window.toggleAutoAdvance = function () {
    isAutoAdvanceEnabled = !isAutoAdvanceEnabled;
    const toggle = document.getElementById('autoAdvanceToggle');
    toggle.classList.toggle('active', isAutoAdvanceEnabled);
    localStorage.setItem('tasbihAutoAdvance', isAutoAdvanceEnabled);
}

function mapLegacyDhikr(fullKey) {
    const legacy = {
        'general.subhan-bihamdihi': 'essentials.subhan-bihamdihi',
        'general.subhan': 'essentials.subhan',
        'general.hamd': 'essentials.hamd',
        'general.takbir': 'essentials.takbir',
        'general.tahlil': 'essentials.tahlil',
        'general.hawqala': 'essentials.hawqala',
        'salah-nabi.salah-simple': 'salawat.salah-simple'
    };
    return legacy[fullKey] || null;
}

// ==================== SET DHIKR & UPDATE UI ====================
window.setDhikr = function (fullKey) {
    const [catKey, dhikrKey] = fullKey.split('.');
    let category = dhikrCategories[catKey];
    let dhikr = category && category.dhikrs ? category.dhikrs[dhikrKey] : null;

    if ((!category || !dhikr) && catKey === 'custom') {
        const custom = customDhikrs.find(d => d.id === dhikrKey);
        if (custom) {
            category = { name: 'أذكاري المخصصة', color: '#a78bfa', icon: 'fa-user-pen', dhikrs: null };
            dhikr = custom;
        }
    }

    if (!category || !dhikr) {
        const migrated = mapLegacyDhikr(fullKey);
        if (migrated) {
            const parts = migrated.split('.');
            category = dhikrCategories[parts[0]];
            dhikr = category.dhikrs[parts[1]];
            fullKey = migrated;
        }
    }

    if (!category || !dhikr) {
        fullKey = 'essentials.subhan-bihamdihi';
        const parts = fullKey.split('.');
        category = dhikrCategories[parts[0]];
        dhikr = category.dhikrs[parts[1]];
    }

    currentDhikrKey = fullKey;
    currentDhikr.innerText = dhikr.text;
    currentBenefit.innerText = dhikr.benefit;
    currentCategory.innerText = category.name;

    const sourceEl = document.getElementById('currentSource');
    if (sourceEl) {
        const sourceText = dhikr.source || 'ذكر مخصص';
        const sourceTextSpan = sourceEl.querySelector('span');
        if (sourceTextSpan) {
            sourceTextSpan.innerText = sourceText;
        } else {
            sourceEl.innerHTML = `<i class="fas fa-book" style="color: #d4af37;"></i> <span>${sourceText}</span>`;
        }
    }

    if (bottomDhikrTextEl) bottomDhikrTextEl.innerText = dhikr.text;

    ensureSequenceForDhikr(fullKey);

    target = dhikr.target;
    targetDisplay.innerText = target;
    resetCounter(true);

    document.querySelectorAll('.dhikr-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.querySelector(`.dhikr-card[data-dhikr="${fullKey}"]`);
    if (activeCard) activeCard.classList.add('active');

    localStorage.setItem('currentDhikr', fullKey);
}

// ==================== NIGHT MODE ====================
function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

// ==================== STATS & ACHIEVEMENTS ====================
function updateStatsUI() {
    const counterEl = document.getElementById('counter');
    if (counterEl) counterEl.innerText = count;

    const todayEl = document.getElementById('totalToday');
    const allEl = document.getElementById('totalAll');
    const streakEl = document.getElementById('streak');

    if (todayEl) todayEl.innerText = stats.totalToday.toLocaleString();
    if (allEl) allEl.innerText = stats.totalAll.toLocaleString();
    if (streakEl) streakEl.innerText = stats.streak;

    const remainingEl = document.getElementById('remainingCount');
    if (remainingEl) {
        let remaining = target - count;
        if (remaining < 0) remaining = 0;
        remainingEl.innerText = remaining.toLocaleString();
    }

    setProgress((count % target) / target * 100);
}

// ==================== SOUND ====================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'complete') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

// ==================== STORAGE ====================
function saveStats() {
    localStorage.setItem('tasbihStats', JSON.stringify(stats));
}

function saveCounterState() {
    localStorage.setItem('tasbihCount', count);
}

function loadSavedState() {
    const savedCount = localStorage.getItem('tasbihCount');
    if (savedCount) {
        count = parseInt(savedCount);
        counterEl.innerText = count;
        setProgress((count % target) / target * 100);
    }

    const savedDhikr = localStorage.getItem('currentDhikr');
    if (savedDhikr) {
        setDhikr(savedDhikr);
    } else {
        setDhikr('essentials.subhan-bihamdihi');
    }

    const savedSound = localStorage.getItem('tasbihSoundOn');
    if (savedSound !== null) {
        isSoundOn = savedSound === 'true';
        const toggle = document.getElementById('soundToggle');
        toggle.classList.toggle('active', isSoundOn);
    }

    const savedVibrate = localStorage.getItem('tasbihVibrateOn');
    if (savedVibrate !== null) {
        isVibrateOn = savedVibrate === 'true';
        const toggle = document.getElementById('vibrateToggle');
        toggle.classList.toggle('active', isVibrateOn);
    }

    const savedAutoAdvance = localStorage.getItem('tasbihAutoAdvance');
    if (savedAutoAdvance !== null) {
        isAutoAdvanceEnabled = savedAutoAdvance === 'true';
        const toggle = document.getElementById('autoAdvanceToggle');
        toggle.classList.toggle('active', isAutoAdvanceEnabled);
    }
}

// ==================== KEYBOARD SUPPORT ====================
document.body.addEventListener('keyup', function (e) {
    if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        countUp(e);
    }
});

// ==================== GLOBAL NAV TOGGLE ====================
window.toggleGlobalNav = function () {
    const navLinks = document.getElementById('globalNavLinks');
    const toggleBtn = document.getElementById('globalNavToggle');
    if (navLinks.classList.contains('expanded')) {
        navLinks.classList.remove('expanded');
        navLinks.classList.add('collapsed');
        toggleBtn.classList.remove('active');
    } else {
        navLinks.classList.remove('collapsed');
        navLinks.classList.add('expanded');
        toggleBtn.classList.add('active');
    }
}

// ==================== SIDEBAR TOGGLE ====================
window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.querySelector('.sidebar-overlay');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        if (sidebar && sidebar.classList.contains('active')) {
            if (window.MobileNav) MobileNav.pushState('sidebar');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }
    updateBottomControlsLayout();
}

document.addEventListener('DOMContentLoaded', () => {
    handleResize();
});

window.addEventListener('resize', handleResize);

function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.querySelector('.sidebar-overlay');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        if (sidebar) sidebar.classList.remove('collapsed');
        if (mainContent) mainContent.classList.remove('expanded');
        if (sidebar && !sidebar.classList.contains('active')) {
            document.body.style.overflow = '';
            if (overlay) overlay.classList.remove('active');
        } else {
            document.body.style.overflow = 'hidden';
            if (overlay) overlay.classList.add('active');
        }
    } else {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    updateBottomControlsLayout();
}

// ==================== NOTIFICATION SYSTEM ====================
window.requestNotificationPermission = async function () {
    if (!('Notification' in window)) {
        alert('المتصفح لا يدعم الإشعارات');
        return;
    }
    const permission = await Notification.requestPermission();
    const toggle = document.getElementById('notificationPermissionToggle');
    if (permission === 'granted') {
        notificationSettings.enabled = true;
        toggle.classList.add('active');
        saveNotificationSettings();
        scheduleAllReminders();
        showNotification('🕌 تم تفعيل الإشعارات', 'سنذكرك بالأذكار في مواعيدها');
    } else {
        notificationSettings.enabled = false;
        toggle.classList.remove('active');
        saveNotificationSettings();
    }
}

window.toggleMorningReminder = function () {
    if (!notificationSettings.enabled) { alert('يرجى تفعيل الإشعارات أولاً'); return; }
    notificationSettings.morningReminder = !notificationSettings.morningReminder;
    const toggle = document.getElementById('morningReminderToggle');
    toggle.classList.toggle('active', notificationSettings.morningReminder);
    saveNotificationSettings();
    scheduleAllReminders();
}

window.toggleEveningReminder = function () {
    if (!notificationSettings.enabled) { alert('يرجى تفعيل الإشعارات أولاً'); return; }
    notificationSettings.eveningReminder = !notificationSettings.eveningReminder;
    const toggle = document.getElementById('eveningReminderToggle');
    toggle.classList.toggle('active', notificationSettings.eveningReminder);
    saveNotificationSettings();
    scheduleAllReminders();
}

window.toggleSleepReminder = function () {
    if (!notificationSettings.enabled) { alert('يرجى تفعيل الإشعارات أولاً'); return; }
    notificationSettings.sleepReminder = !notificationSettings.sleepReminder;
    const toggle = document.getElementById('sleepReminderToggle');
    toggle.classList.toggle('active', notificationSettings.sleepReminder);
    saveNotificationSettings();
    scheduleAllReminders();
}

window.toggleAchievementNotifications = function () {
    notificationSettings.achievementNotif = !notificationSettings.achievementNotif;
    const toggle = document.getElementById('achievementNotifToggle');
    toggle.classList.toggle('active', notificationSettings.achievementNotif);
    saveNotificationSettings();
}

function showNotification(title, body, icon = '🕌') {
    if (!notificationSettings.enabled || Notification.permission !== 'granted') return;
    const notification = new Notification(title, { body, icon, badge: icon, tag: 'tasbih-reminder', requireInteraction: false, silent: false });
    notification.onclick = function () { window.focus(); this.close(); };
}

function scheduleAllReminders() {
    notificationTimers.forEach(timer => clearTimeout(timer));
    notificationTimers = [];
    if (!notificationSettings.enabled) return;
    const now = new Date();

    if (notificationSettings.morningReminder) {
        const t = new Date(); t.setHours(7, 0, 0, 0);
        if (t < now) t.setDate(t.getDate() + 1);
        notificationTimers.push(setTimeout(() => {
            showNotification('🌅 أذكار الصباح', 'حان وقت أذكار الصباح.');
            scheduleAllReminders();
        }, t - now));
    }

    if (notificationSettings.eveningReminder) {
        const t = new Date(); t.setHours(17, 0, 0, 0);
        if (t < now) t.setDate(t.getDate() + 1);
        notificationTimers.push(setTimeout(() => {
            showNotification('🌆 أذكار المساء', 'حان وقت أذكار المساء.');
            scheduleAllReminders();
        }, t - now));
    }

    if (notificationSettings.sleepReminder) {
        const t = new Date(); t.setHours(22, 0, 0, 0);
        if (t < now) t.setDate(t.getDate() + 1);
        notificationTimers.push(setTimeout(() => {
            showNotification('🌙 أذكار النوم', 'لا تنس أذكار النوم.');
            scheduleAllReminders();
        }, t - now));
    }
}

function saveNotificationSettings() {
    localStorage.setItem('tasbihNotifications', JSON.stringify(notificationSettings));
}

function loadNotificationSettings() {
    if (Notification.permission === 'granted') {
        notificationSettings.enabled = true;
        const toggle = document.getElementById('notificationPermissionToggle');
        if (toggle) toggle.classList.add('active');
    }
    const morningToggle = document.getElementById('morningReminderToggle');
    const eveningToggle = document.getElementById('eveningReminderToggle');
    const sleepToggle = document.getElementById('sleepReminderToggle');
    const achievementToggle = document.getElementById('achievementNotifToggle');

    if (morningToggle) morningToggle.classList.toggle('active', notificationSettings.morningReminder);
    if (eveningToggle) eveningToggle.classList.toggle('active', notificationSettings.eveningReminder);
    if (sleepToggle) sleepToggle.classList.toggle('active', notificationSettings.sleepReminder);
    if (achievementToggle) achievementToggle.classList.toggle('active', notificationSettings.achievementNotif);

    if (notificationSettings.enabled) scheduleAllReminders();
}

// ==================== INITIALIZE ====================
init();
loadNotificationSettings();

// ==================== CUSTOM DHIKR MANAGEMENT ====================
function preventScrollLock(e) { e.preventDefault(); }

window.openCustomDhikrModal = function () {
    const modal = document.getElementById('customDhikrModal');
    if (window.MobileNav) MobileNav.pushState('customDhikrModal');
    modal.classList.add('active');
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollLockY = String(scrollY);
    document.addEventListener('wheel', preventScrollLock, { passive: false });
    document.addEventListener('touchmove', preventScrollLock, { passive: false });
    document.getElementById('customDhikrText').value = '';
    document.getElementById('customDhikrTarget').value = '100';
    document.getElementById('customDhikrBenefit').value = '';
}

window.closeCustomDhikrModal = function (event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('customDhikrModal');
    modal.classList.remove('active');
    const prevY = parseInt(document.body.dataset.scrollLockY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.dataset.scrollLockY = '';
    window.scrollTo(0, prevY);
    document.removeEventListener('wheel', preventScrollLock, { passive: false });
    document.removeEventListener('touchmove', preventScrollLock, { passive: false });
}

window.saveCustomDhikr = function () {
    const text = document.getElementById('customDhikrText').value.trim();
    const targetVal = parseInt(document.getElementById('customDhikrTarget').value);
    const benefit = document.getElementById('customDhikrBenefit').value.trim() || 'ذكر مخصص';

    if (!text) { alert('يرجى إدخال نص الذكر'); return; }
    if (!targetVal || targetVal < 1) { alert('يرجى إدخال عدد صحيح'); return; }

    const customDhikr = {
        id: Date.now().toString(),
        text: text,
        target: targetVal,
        benefit: benefit,
        isCustom: true,
        source: 'ذكر مخصص',
        createdAt: new Date().toISOString()
    };

    customDhikrs.push(customDhikr);
    localStorage.setItem('customDhikrs', JSON.stringify(customDhikrs));
    buildCategoriesUI();
    closeCustomDhikrModal();
}

window.deleteCustomDhikr = function (dhikrId) {
    if (!confirm('هل أنت متأكد من حذف هذا الذكر؟')) return;
    customDhikrs = customDhikrs.filter(d => d.id !== dhikrId);
    localStorage.setItem('customDhikrs', JSON.stringify(customDhikrs));
    buildCategoriesUI();
}

function addCustomDhikrsToCategories() {
    if (customDhikrs.length === 0) return null;
    return {
        name: 'أذكاري المخصصة',
        icon: 'fa-user-pen',
        color: '#a78bfa',
        dhikrs: customDhikrs.reduce((acc, dhikr) => {
            acc[dhikr.id] = dhikr;
            return acc;
        }, {})
    };
}

// ==================== DATA BACKUP & RESTORE ====================
window.exportData = function () {
    const data = {
        stats: JSON.parse(localStorage.getItem('tasbihStats')),
        customDhikrs: JSON.parse(localStorage.getItem('customDhikrs')) || [],
        notifications: JSON.parse(localStorage.getItem('tasbihNotifications')),
        settings: {
            theme: localStorage.getItem('tasbihTheme'),
            font: localStorage.getItem('tasbihFont')
        },
        timestamp: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "tasbih_backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(a);
    a.click();
    a.remove();
}

window.triggerImport = function () {
    const fileInput = document.getElementById('importFileInput');
    if (fileInput) fileInput.click();
    else alert('عذراً، لم يتم العثور على عنصر التحميل');
}

window.handleImportFile = function (element) {
    const file = element.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('سيتم استبدال بياناتك الحالية بالبيانات المستوردة. هل أنت متأكد؟')) {
                if (data.stats) localStorage.setItem('tasbihStats', JSON.stringify(data.stats));
                if (data.customDhikrs) localStorage.setItem('customDhikrs', JSON.stringify(data.customDhikrs));
                if (data.notifications) localStorage.setItem('tasbihNotifications', JSON.stringify(data.notifications));
                if (data.settings && data.settings.theme) localStorage.setItem('tasbihTheme', data.settings.theme);
                if (data.settings && data.settings.font) localStorage.setItem('tasbihFont', data.settings.font);
                alert('تم استعادة البيانات بنجاح! سيتم إعادة تحميل الصفحة.');
                location.reload();
            }
        } catch (error) {
            alert('ملف غير صالح أو تالف');
        }
    };
    reader.readAsText(file);
}

// ==================== SHEET OVERLAYS MANAGEMENT ====================
let savedScrollPosition = 0;

function lockBodyScroll() {
    savedScrollPosition = window.scrollY || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollPosition);
}

window.openModesSheet = function () {
    const overlay = document.getElementById('modesSheetOverlay');
    if (overlay) {
        if (window.MobileNav) MobileNav.pushState('modesSheet');
        overlay.classList.add('active');
        lockBodyScroll();
        if (typeof window.updateModesUI === 'function') window.updateModesUI();
    }
};

window.closeModesSheet = function () {
    const overlay = document.getElementById('modesSheetOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        unlockBodyScroll();
    }
};

window.openShareSheet = function () {
    const overlay = document.getElementById('shareSheetOverlay');
    if (overlay) {
        if (window.MobileNav) MobileNav.pushState('shareSheet');
        overlay.classList.add('active');
        lockBodyScroll();
    }
};

window.closeShareSheet = function () {
    const overlay = document.getElementById('shareSheetOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        unlockBodyScroll();
    }
};

// ==================== HERO COPY SYSTEM (UPDATED) ====================
window.copyHeroDhikr = function () {
    const btn = document.getElementById('heroCopyBtn');
    if (btn.classList.contains('copied')) return;

    const dhikrText = document.getElementById('currentDhikr').innerText;
    const benefitText = document.getElementById('currentBenefit').innerText;
    const sourceText = document.getElementById('currentSource').innerText;
    const targetCount = document.getElementById('targetDisplay').innerText;

    // تنسيق جديد نظيف بدون إيموجي (باستثناء الوردة في العنوان)
    const formattedMsg = `❀ ذكر اليوم ❀

"${dhikrText}"

- العدد المستهدف: ${targetCount}
- المصدر: ${sourceText}
- الفضل: ${benefitText}

تطبيق سُنّة برو`;

    const triggerEffect = () => {
        btn.classList.add('copied');
        setTimeout(() => { btn.classList.remove('copied'); }, 2500);
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(formattedMsg).then(() => triggerEffect()).catch(() => { });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedMsg;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        triggerEffect();
    }
};

window.openCustomizeSheet = function () {
    const overlay = document.getElementById('customizeSheetOverlay');
    if (overlay) {
        if (window.MobileNav) MobileNav.pushState('customizeSheet');
        overlay.classList.add('active');
        lockBodyScroll();
        if (typeof window.updateCustomizeUI === 'function') window.updateCustomizeUI();
    }
};

window.closeCustomizeSheet = function () {
    const overlay = document.getElementById('customizeSheetOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        unlockBodyScroll();
    }
};

// ==================== HERO COPY SYSTEM (LITE VERSION) ====================

window.copyHeroDhikr = function () {
    const btn = document.getElementById('heroCopyBtn');
    if (btn.classList.contains('copied')) return;

    const dhikrText = document.getElementById('currentDhikr').innerText;
    const benefitText = document.getElementById('currentBenefit').innerText;
    const sourceText = document.getElementById('currentSource').innerText;
    const targetCount = document.getElementById('targetDisplay').innerText;

    // ✅ استخدام الرابط الرسمي الثابت دائماً
    let appLink = "https://sunnah-app.vercel.app";

    // التنسيق: وردتين في العنوان، وفي الختام اسم التطبيق كرابط نظيف
    const formattedMsg = `🌸 *نفحات إيمانية* 🌸\n\n\"${dhikrText}\"\n\nــــــــــــــــــــــــــــــــــــــــ\n\n*الفضل:* ${benefitText}\n*المصدر:* ${sourceText}\n\n*العدد:* ${targetCount}\n\nــــــــــــــــــــــــــــــــــــــــ\n${appLink}`;

    const triggerEffect = () => {
        btn.classList.add('copied');
        showToast('تم نسخ الذكر'); // نرسل النص فقط بدون ورد، الورد هيضاف في التوست نفسه
        setTimeout(() => { btn.classList.remove('copied'); }, 2500);
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(formattedMsg).then(() => triggerEffect()).catch(() => { });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedMsg;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        triggerEffect();
    }
};

// ==================== ROYAL SMART COPY SYSTEM (FRESH LINK VERSION) ====================
window.handleSmartCopy = function(type, btnElement) {
    if (btnElement.classList.contains('copied')) return;

    let textToCopy = "";
    let toastTitle = "تم النسخ";

    // ✅ استخدام الرابط الرسمي الثابت دائماً
    let officialLink = "https://sunnah-app.vercel.app";

    // التوقيع للرسائل العادية
    const signature = `\n\n${officialLink}`;

    if (type === 'current') {
        const dhikrText = document.getElementById('currentDhikr')?.innerText || '';
        const benefitText = document.getElementById('currentBenefit')?.innerText || '';
        const sourceText = document.getElementById('currentSource')?.innerText || '';
        const targetCount = document.getElementById('targetDisplay')?.innerText || '';
        
        textToCopy = `🌸 *رسالة خير لك* 🌸\n\n\"${dhikrText}\"\n\n*ثوابها:* ${benefitText}\n*رواها:* ${sourceText}\n\n*العدد:* ${targetCount}${signature}`;
        toastTitle = "تم نسخ الذكر";
    } 
    else if (type === 'stats') {
        if (typeof stats === 'undefined') return;
        textToCopy = `🌸 *إنجازي في ذكر الله* 🌸\n\nإجمالي التسبيحات: ${stats.totalAll.toLocaleString()}\nأيام متواصلة: ${stats.streak}\nإنجاز اليوم: ${stats.totalToday.toLocaleString()}${signature}`;
        toastTitle = "تم نسخ الإحصائيات";
    }
    else if (type === 'app') {
        // هنا هيستخدم الرابط الصحيح اللي جبناه فوق
        textToCopy = `🌸 *هدية محب* 🌸\n\nأوصيك ونفسي بهذا التطبيق المبارك.\nيساعدك على ذكر الله بقلب حاضر.\n\n*رابط التطبيق:*\n${officialLink}`;
        toastTitle = "تم نسخ الرابط";
    }
    else if (type === 'custom') {
        if (!customDhikrs || customDhikrs.length === 0) {
            showToast('لا توجد أذكار مخصصة');
            return;
        }
        const list = customDhikrs.map((d, i) => `- ${d.text} (${d.target})`).join('\n');
        textToCopy = `🌸 *أورادي الخاصة* 🌸\n\n${list}\n\nتقبل الله طابتكم.${signature}`;
        toastTitle = "تم نسخ القائمة";
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        btnElement.classList.add('copied');
        showToast(toastTitle);
        setTimeout(() => {
            btnElement.classList.remove('copied');
        }, 2500);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        btnElement.classList.add('copied');
        showToast(toastTitle);
        setTimeout(() => {
            btnElement.classList.remove('copied');
        }, 2500);
    });
};

// دالة التوست المعدلة (وردتين متطابقتين تماماً)
function showToast(msg) {
    const existing = document.getElementById('copyToast');
    if (existing) existing.remove();

    // نتأكد إن الرسالة مفيهاش ورد عشان ميتكررش
    const cleanMsg = msg.replace(/🌸/g, '').trim();

    const toast = document.createElement('div');
    toast.id = 'copyToast';
    
    // هنا السر: عملنا span للوردة اليمين و span للوردة الشمال بنفس الكلاس بالظبط
    toast.innerHTML = `
        <span class="toast-rose" style="font-size:1.4em; line-height:1; display:block;">🌸</span>
        <span class="toast-text" style="margin: 0 10px;">${cleanMsg}</span>
        <span class="toast-rose" style="font-size:1.4em; line-height:1; display:block;">🌸</span>
    `;
    
    toast.style.cssText = `
        position: fixed; 
        bottom: 80px; 
        left: 50%; 
        transform: translateX(-50%);
        background: rgba(20, 20, 20, 0.95); 
        color: #fff; 
        padding: 10px 24px;
        border-radius: 50px; 
        font-size: 15px; 
        z-index: 10000; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 8px 25px rgba(0,0,0,0.4); 
        border: 1px solid rgba(255, 105, 180, 0.3);
        font-family: 'Cairo', sans-serif;
        pointer-events: none;
        backdrop-filter: blur(5px);
        min-width: max-content;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);

    // تفعيل الأنيميشن
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}