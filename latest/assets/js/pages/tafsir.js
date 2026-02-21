let quranData = [];
let currentSurahIndex = 1;
let currentAyahIndex = 1;
let totalAyahsInSurah = 7;

// Sidebar toggle function for tafsir page
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (!sidebar) return;
    
    const winWidth = window.innerWidth;
    
    if (winWidth <= 768) {
        // Mobile: toggle drawer
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    } else {
        // Desktop: toggle collapse
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }
}

let fullQuranData = null;
const LOCAL_QURAN_PATH = "../tr/quran/quran_full.json";
const API_SURAH_LIST = "https://api.quran.com/api/v4/chapters?language=ar";
const BASE_TAFSIR_API = "https://quranenc.com/api/v1/translation/aya";

// ==========================================
//  قائمة القراء (محدثة بروابط التحميل الكامل) - نفس المصفوفة من صفحة القرآن
// ==========================================
const RECITER_DB = [
    // === الأكثر شهرة ===
    { id: "Alafasy_128kbps", folder: "Alafasy", name: "مشاري راشد العفاسي", style: "مرتل", img: "../assets/img/listen/covers/alafasy.webp" },
    { id: "Abdurrahmaan_As-Sudais_192kbps", folder: "Sudais", name: "عبد الرحمن السديس", style: "مرتل", img: "../assets/img/listen/covers/al_sudais.webp" },
    { id: "Saood_ash-Shuraym_128kbps", folder: "Shuraim", name: "سعود الشريم", style: "مرتل", img: "../assets/img/listen/covers/saud_al_shuraim.webp" },
    { id: "MaherAlMuaiqly128kbps", folder: "Muaiqly", name: "ماهر المعيقلي", style: "مرتل", img: "../assets/img/listen/covers/maher_al_muaiqly.webp" },
    { id: "Yasser_Ad-Dussary_128kbps", folder: "Dosari", name: "ياسر الدوسري", style: "مرتل", img: "../assets/img/listen/covers/yasser_al_dosari.webp" },
    { id: "Ghamadi_40kbps", folder: "Ghamdi", name: "سعد الغامدي", style: "مرتل", img: "../assets/img/listen/covers/saad_al_ghamdi.webp" },
    { id: "Nasser_Alqatami_128kbps", folder: "Qatami", name: "ناصر القطامي", style: "مرتل", img: "../assets/img/listen/covers/nasser_al_qatami.webp" },
    { id: "Fares_Abbad_64kbps", folder: "Fares", name: "فارس عباد", style: "مرتل", img: "../assets/img/listen/covers/fares_abbad.webp" },
    { id: "Abu_Bakr_Ash-Shaatree_128kbps", folder: "Shatri", name: "أبو بكر الشاطري", style: "مرتل", img: "../assets/img/listen/covers/abu_bakr_al_shatri.webp" },
    { id: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net", folder: "Ajamy", name: "أحمد العجمي", style: "مرتل", img: "../assets/img/listen/covers/ahmed_al_ajamy.webp" },
    { id: "Hani_Rifai_192kbps", folder: "Hani_Rifai", name: "هاني الرفاعي", style: "مرتل", img: "../assets/img/listen/covers/hani_rifai.webp", isNew: true },
    
    // === عبد الباسط عبد الصمد ===
    { id: "Abdul_Basit_Murattal_192kbps", folder: "Abdul_Basit", name: "عبد الباسط عبد الصمد", style: "مرتل", img: "../assets/img/listen/covers/abdul_basit.webp" },
    { id: "Abdul_Basit_Mujawwad_128kbps", folder: "Abdul_Basit_Mujawwad", name: "عبد الباسط عبد الصمد (مجود)", style: "مجود", img: "../assets/img/listen/covers/abdul_basit.webp" },
    
    // === المنشاوي ===
    { id: "Minshawy_Murattal_128kbps", folder: "Minshawy", name: "محمد صديق المنشاوي", style: "مرتل", img: "../assets/img/listen/covers/minshawi.webp" },
    { id: "Minshawy_Mujawwad_192kbps", folder: "Minshawy_Mujawwad", name: "المنشاوي (مجود)", style: "مجود", img: "../assets/img/listen/covers/minshawi.webp" },
    { id: "Minshawy_Teacher_128kbps", folder: "Minshawy_Teacher", name: "المنشاوي (معلم)", style: "معلم", img: "../assets/img/listen/covers/minshawi.webp", isNew: true },
    
    // === الحصري ===
    { id: "Husary_128kbps", folder: "Hussary", name: "محمود خليل الحصري", style: "مرتل", img: "../assets/img/listen/covers/al_hussary.webp" },
    { id: "Husary_128kbps_Mujawwad", folder: "Husary_Mujawwad", name: "الحصري (مجود)", style: "مجود", img: "../assets/img/listen/covers/al_hussary.webp", isNew: true },
    { id: "Husary_Muallim_128kbps", folder: "Husary_Muallim", name: "الحصري (المعلم)", style: "معلم", img: "../assets/img/listen/covers/al_hussary.webp", isNew: true },
    
    // === الحذيفي ===
    { id: "Hudhaify_128kbps", folder: "Hudhaify", name: "علي الحذيفي", style: "مرتل", img: "../assets/img/listen/covers/al_hudhaify.webp" },
    
    // === قراء تم ربطهم بالصور الجديدة (تم التحويل إلى WEBP) ===
    { id: "Muhammad_Ayyoub_128kbps", folder: "Ayyoub", name: "محمد أيوب", style: "مرتل", img: "../assets/img/listen/covers/muhammad_ayyub.webp" },
    { id: "Muhammad_Jibreel_128kbps", folder: "Muhammad_Jibreel", name: "محمد جبريل", style: "مرتل", img: "../assets/img/listen/covers/muhammad_jibreel.webp", isNew: true },
    { id: "Mustafa_Ismail_48kbps", folder: "Mustafa_Ismail", name: "مصطفى إسماعيل", style: "مرتل", img: "../assets/img/listen/covers/mustafa_ismail.webp", isNew: true },
    { id: "Muhammad_AbdulKareem_128kbps", folder: "Muhammad_AbdulKareem", name: "محمد عبد الكريم", style: "مرتل", img: "../assets/img/listen/covers/muhammad_abdulkarim.webp", isNew: true },
    { id: "Khaalid_Abdullaah_al-Qahtaanee_192kbps", folder: "Khaalid_al_Qahtaanee", name: "خالد القحطاني", style: "مرتل", img: "../assets/img/listen/covers/khalid_qahtani.webp", isNew: true },
    { id: "khalefa_al_tunaiji_64kbps", folder: "khalefa_al_tunaiji", name: "خليفة الطنيجي", style: "مرتل", img: "../assets/img/listen/covers/khalifa_tunaiji.webp", isNew: true },
    { id: "Yaser_Salamah_128kbps", folder: "Yaser_Salamah", name: "ياسر سلامة", style: "مرتل", img: "../assets/img/listen/covers/yasser_salamah.webp", isNew: true },
    { id: "Akram_AlAlaqimy_128kbps", folder: "Akram_AlAlaqimy", name: "أكرم العلاقمي", style: "مرتل", img: "../assets/img/listen/covers/akram_alaqmi.webp", isNew: true },
    { id: "Ibrahim_Akhdar_64kbps", folder: "Ibrahim_Akhdar", name: "إبراهيم الأخضر", style: "مرتل", img: "../assets/img/listen/covers/ibrahim_akhdar.webp", isNew: true },
    
    // === قراء آخرون مدعومون في EveryAyah ===
    { id: "Mohammad_al_Tablaway_128kbps", folder: "Tablawi", name: "محمد الطبلاوي", style: "مرتل", img: "../assets/img/listen/covers/al_tablawi.webp" },
    { id: "Abdullah_Basfar_192kbps", folder: "Basfar", name: "عبد الله بصفر", style: "مرتل", img: "../assets/img/listen/covers/abdullah_basfar.webp" },
    { id: "Ali_Jaber_64kbps", folder: "Jaber", name: "علي جابر", style: "مرتل", img: "../assets/img/listen/covers/ali_jaber.webp" },
    { id: "Salaah_AbdulRahman_Bukhatir_128kbps", folder: "Bukhatir", name: "صلاح البخاتير", style: "مرتل", img: "../assets/img/listen/covers/salah_bukhatir.webp", isNew: true },
    { id: "Muhsin_Al_Qasim_192kbps", folder: "Muhsin_Al_Qasim", name: "محسن القاسم", style: "مرتل", img: "../assets/img/listen/covers/muhsin_al_qasim.webp", isNew: true },
    { id: "Abdullaah_3awwaad_Al-Juhaynee_128kbps", folder: "Abdullaah_Awwaad", name: "عبد الله عواد الجهني", style: "مرتل", img: "../assets/img/listen/covers/abdullah_al_juhany.webp", isNew: true },
    { id: "Salah_Al_Budair_128kbps", folder: "Salah_Al_Budair", name: "صالح البدير", style: "مرتل", img: "../assets/img/listen/covers/salah_al_budair.webp", isNew: true },
    { id: "Abdullah_Matroud_128kbps", folder: "Abdullah_Matroud", name: "عبد الله المطرود", style: "مرتل", img: "../assets/img/listen/covers/abdullah_matroud.webp", isNew: true },
    { id: "Ahmed_Neana_128kbps", folder: "Ahmed_Neana", name: "أحمد النعينع", style: "مرتل", img: "../assets/img/listen/covers/ahmed_neana.webp", isNew: true },
    { id: "mahmoud_ali_al_banna_32kbps", folder: "mahmoud_ali_al_banna", name: "محمود علي البنا", style: "مرتل", img: "../assets/img/listen/covers/mahmoud_ali_al_banna.webp", isNew: true },
    { id: "Ali_Hajjaj_AlSuesy_128kbps", folder: "Ali_Hajjaj_AlSuesy", name: "علي الحجاج السويسي", style: "مرتل", img: "../assets/img/listen/covers/ali_hajjaj_alsuesy.webp", isNew: true },
    { id: "Sahl_Yassin_128kbps", folder: "Sahl_Yassin", name: "سهل ياسين", style: "مرتل", img: "../assets/img/listen/covers/sahl_yassin.webp", isNew: true },
    { id: "Ayman_Sowaid_64kbps", folder: "Ayman_Sowaid", name: "أيمن سويد", style: "مرتل", img: "../assets/img/listen/covers/ayman_sowaid.webp", isNew: true },
    { id: "aziz_alili_128kbps", folder: "aziz_alili", name: "عزيز أليلي", style: "مرتل", img: "../assets/img/listen/covers/aziz_alili.webp", isNew: true },
    { id: "Karim_Mansoori_40kbps", folder: "Karim_Mansoori", name: "كريم منصوري", style: "مرتل", img: "../assets/img/listen/covers/karim_mansoori.webp", isNew: true },
    { id: "Nabil_Rifa3i_48kbps", folder: "Nabil_Rifa3i", name: "نبيل الرفاعي", style: "مرتل", img: "../assets/img/listen/covers/nabil_rifai.webp", isNew: true },
    
    // === قراء برواية ورش ===
    { id: "warsh/warsh_Abdul_Basit_128kbps", folder: "warsh_Abdul_Basit", name: "عبد الباسط (رواية ورش)", style: "ورش", img: "../assets/img/listen/covers/abdul_basit.webp", isNew: true },
    { id: "warsh/warsh_ibrahim_aldosary_128kbps", folder: "warsh_ibrahim_aldosary", name: "إبراهيم الدوسري (رواية ورش)", style: "ورش", img: "../assets/img/listen/covers/ibrahim_dosari.webp", isNew: true },
    { id: "warsh/warsh_yassin_al_jazaery_64kbps", folder: "warsh_yassin_al_jazaery", name: "ياسين الجزائري (رواية ورش)", style: "ورش", img: "../assets/img/listen/covers/yassin_al_jazaery.webp", isNew: true }
];

// Legacy reciters array for backward compatibility
const reciters = RECITER_DB.map(r => ({
    key: r.id,
    folder: r.folder,
    name: r.name,
    server: `https://everyayah.com/data/${r.id}/`,
    img: r.img
}));

let currentReciterKey = RECITER_DB[0].id;

const loader = document.getElementById('loader');
const ayahTextEl = document.getElementById('ayahTextDisplay');
const tafsirTextEl = document.getElementById('tafsirTextDisplay');
const surahTitleEl = document.getElementById('currentSurahName');
const ayahInfoEl = document.getElementById('currentAyahInfo');
const bismillahEl = document.getElementById('bismillahText');
const ayahNumBadge = document.getElementById('ayahNumBadge');
const audioPlayer = document.getElementById('quranAudio');
const audioIcon = document.getElementById('audioIcon');

window.onload = async () => {
    await fetchSurahList();
    populateReciterSelect();

    const urlParams = new URLSearchParams(window.location.search);
    let urlSurah = urlParams.get('surah');
    let urlAyah = urlParams.get('ayah');

    if (!urlSurah || !urlAyah) {
        const storedSurah = sessionStorage.getItem('target_tafsir_surah');
        const storedAyah = sessionStorage.getItem('target_tafsir_ayah');

        if (storedSurah && storedAyah) {
            console.log("Found params in SessionStorage:", storedSurah, storedAyah);
            urlSurah = storedSurah;
            urlAyah = storedAyah;

            // تنظيف الذاكرة بعد الاستخدام عشان ميفضلش يرجع لنفس الآية مستقبلاً
            sessionStorage.removeItem('target_tafsir_surah');
            sessionStorage.removeItem('target_tafsir_ayah');
        }
    }

    if (urlSurah && urlAyah) {
        await loadAyah(urlSurah.trim(), urlAyah.trim());
    } else {
        await loadAyah(1, 1);
    }

    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);

    const navToggle = document.getElementById('globalNavToggle');
    if (navToggle) navToggle.addEventListener('click', toggleGlobalNav);

    initSearchEngine();
};

window.onpopstate = function (event) {
    const urlParams = new URLSearchParams(window.location.search);
    const s = urlParams.get('surah') || 1;
    const a = urlParams.get('ayah') || 1;
    loadAyah(s, a);
};

async function loadLocalQuranData() {
    if (fullQuranData) return;
    try {
        const res = await fetch(LOCAL_QURAN_PATH);
        if (!res.ok) throw new Error("local quran not found");
        fullQuranData = await res.json();
    } catch (_) {
        fullQuranData = null;
    }
}

async function fetchSurahList() {
    try {
        await loadLocalQuranData();
        if (fullQuranData) {
            quranData = fullQuranData.map(s => ({
                id: s.number,
                name_arabic: s.name,
                revelation_place: s.revelationType === 'Meccan' ? 'makkah' : 'madinah',
                verses_count: Array.isArray(s.ayahs) ? s.ayahs.length : 0
            }));
        } else {
            const response = await fetch(API_SURAH_LIST);
            const data = await response.json();
            quranData = data.chapters || [];
        }
        const selectH = document.getElementById('surahSelectHeader');
        selectH.innerHTML = quranData.map(surah => `<option value="${surah.id}">${surah.id}. سورة ${surah.name_arabic}</option>`).join('');
        populateSidebar(quranData);
    } catch (error) { console.error(error); }
}

function populateSidebar(data) {
    const container = document.getElementById('surah-list-content');
    container.innerHTML = '';
    data.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        item.setAttribute('data-surah-name', normalizeText(surah.name_arabic));
        if (surah.id === currentSurahIndex) item.classList.add('active');

        item.innerHTML = `
                    <div class="surah-badge">${toArabic(surah.id)}</div>
                    <div class="surah-info">
                        <span class="surah-name-ar">سورة ${surah.name_arabic}</span>
                        <span class="surah-desc-sub">${surah.revelation_place === 'makkah' ? 'مكية' : 'مدنية'} • ${surah.verses_count} آية</span>
                    </div>
                `;
        item.onclick = () => {
            loadAyah(surah.id, 1);
            document.querySelectorAll('.surah-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        };
        container.appendChild(item);
    });
}

function normalizeText(text) { return text.replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ئ/g, "ي").trim(); }

function filterSurahs(query) {
    const container = document.getElementById('surah-list-content');
    const items = container.getElementsByClassName('surah-item');
    const normalizedQuery = normalizeText(query);
    for (let i = 0; i < items.length; i++) {
        const surahName = items[i].getAttribute('data-surah-name');
        if (normalizeText(surahName).includes(normalizedQuery) || items[i].innerText.includes(query)) {
            items[i].style.display = "flex";
        } else { items[i].style.display = "none"; }
    }
}

function toggleGlobalNav() {
    const toggleBtn = document.getElementById('globalNavToggle');
    const navLinks = document.getElementById('globalNavLinks');
    if (!toggleBtn || !navLinks) return;
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

// Sidebar toggle functions removed - now handled by sidebar.js component

async function loadAyah(surahId, ayahNum) {
    // 1. تحديث الأرقام
    currentSurahIndex = parseInt(surahId);
    currentAyahIndex = parseInt(ayahNum);

    // 🔥 2. افحص التحميل فوراً بعد تحديث الرقم 🔥
    // ده هيحل مشكلة القائمة الجانبية 100%
    checkSurahDownloadStatus();

    const newUrl = `?surah=${surahId}&ayah=${ayahNum}`;
    if (window.location.search !== newUrl) {
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const surahMeta = quranData.find(s => s.id === currentSurahIndex);
    if (!surahMeta) return;
    totalAyahsInSurah = surahMeta.verses_count;

    surahTitleEl.innerText = `سورة ${surahMeta.name_arabic}`;
    document.title = `سورة ${surahMeta.name_arabic} - آية ${currentAyahIndex} | التفسير`;

    ayahInfoEl.innerText = `الآية ${currentAyahIndex} من ${totalAyahsInSurah}`;
    document.getElementById('revelationType').innerText = surahMeta.revelation_place === 'makkah' ? 'مكية' : 'مدنية';
    ayahNumBadge.innerText = currentAyahIndex;

    document.querySelectorAll('.surah-item').forEach(el => el.classList.remove('active'));
    const sidebarItems = document.querySelectorAll('.surah-item');
    if (sidebarItems[currentSurahIndex - 1]) {
        sidebarItems[currentSurahIndex - 1].classList.add('active');
        if (window.innerWidth > 768) sidebarItems[currentSurahIndex - 1].scrollIntoView({ block: "center", behavior: "smooth" });
    }

    if (currentAyahIndex === 1 && currentSurahIndex !== 9 && currentSurahIndex !== 1) bismillahEl.style.display = 'block';
    else bismillahEl.style.display = 'none';

    document.getElementById('surahSelectHeader').value = currentSurahIndex;

    try {
        await loadLocalQuranData();
        if (fullQuranData) {
            const surahObj = fullQuranData.find(s => s.number === currentSurahIndex);
            const ayahObj = surahObj && Array.isArray(surahObj.ayahs) ? surahObj.ayahs.find(a => a.numberInSurah === currentAyahIndex) : null;
            let text = ayahObj ? ayahObj.text : "جارِ التحميل...";
            if (currentSurahIndex !== 1 && currentSurahIndex !== 9 && currentAyahIndex === 1) {
                text = text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ", "");
            }
            ayahTextEl.innerText = text;
        } else {
            const textRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${currentSurahIndex}:${currentAyahIndex}?language=en&fields=text_uthmani`);
            const textData = await textRes.json();
            ayahTextEl.innerText = textData?.verse?.text_uthmani || "جارِ التحميل...";
        }
    } catch (e) { ayahTextEl.innerText = "جارِ التحميل..."; }

    reloadTafsir();
    updateAudioSource(currentSurahIndex, currentAyahIndex);
}

function nextAyah() {
    if (currentAyahIndex < totalAyahsInSurah) loadAyah(currentSurahIndex, currentAyahIndex + 1);
    else if (currentSurahIndex < 114) loadAyah(currentSurahIndex + 1, 1);
}

function prevAyah() {
    if (currentAyahIndex > 1) loadAyah(currentSurahIndex, currentAyahIndex - 1);
    else if (currentSurahIndex > 1) loadAyah(currentSurahIndex - 1, 1);
}

function changeSurah(id) { loadAyah(id, 1); }
function toArabic(n) { return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]); }
function toggleAudio() {
    if (audioPlayer.paused) { audioPlayer.play(); audioIcon.className = "fas fa-pause"; }
    else { audioPlayer.pause(); audioIcon.className = "fas fa-volume-up"; }
}
function resetAudioIcon() { audioIcon.className = "fas fa-volume-up"; }
audioPlayer.onended = () => resetAudioIcon();

function populateReciterSelect() {
    const selectEl = document.getElementById('reciterSelect');
    if (selectEl) {
        selectEl.innerHTML = '';
        reciters.forEach(reciter => {
            const option = `<option value="${reciter.key}">${reciter.name}</option>`;
            selectEl.innerHTML += option;
        });
    }
}

// === Reciter Modal Functions (Copied from Quran page) ===
function openReciterModal() {
    document.getElementById('reciter-modal').classList.add('visible');
    filterReciters('');
    document.getElementById('reciter-search-input').focus();
}

function filterReciters(query) {
    const container = document.getElementById('reciter-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    const filtered = RECITER_DB.filter(r => r.name.includes(query));
    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#666;">لا توجد نتائج</div>';
        return;
    }

    const oldReciters = filtered.filter(r => !r.isNew);
    const newReciters = filtered.filter(r => r.isNew);

    const buildCard = (reciter) => {
        const card = document.createElement('div');
        card.className = 'reciter-card' + (reciter.isNew ? ' reciter-new' : '');
        card.onclick = () => selectReciter(reciter.id);

        let iconHtml = '<div class="reciter-icon"><i class="fas fa-user-tie"></i></div>';
        if (reciter.img) {
            iconHtml = `<div class="reciter-icon"><img src="${reciter.img}" alt="${reciter.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-user-tie\\'></i>'"></div>`;
        }

        const newDot = reciter.isNew ? '<span class="new-reciter-dot"></span>' : '';

        card.innerHTML = `${newDot}${iconHtml}<div class="reciter-name">${reciter.name}</div><div class="reciter-style">${reciter.style}</div>`;
        return card;
    };

    // Old reciters grid
    if (oldReciters.length > 0) {
        const oldGrid = document.createElement('div');
        oldGrid.className = 'reciter-list-grid';
        oldReciters.forEach(r => oldGrid.appendChild(buildCard(r)));
        container.appendChild(oldGrid);
    }

    // Divider + New reciters grid
    if (newReciters.length > 0) {
        const divider = document.createElement('div');
        divider.className = 'new-reciters-divider';
        divider.innerHTML = '<div class="divider-line"></div><span class="divider-label">قراء جدد ✨</span><div class="divider-line"></div>';
        container.appendChild(divider);

        const newGrid = document.createElement('div');
        newGrid.className = 'reciter-list-grid';
        newReciters.forEach(r => newGrid.appendChild(buildCard(r)));
        container.appendChild(newGrid);
    }
}

function selectReciter(id) {
    currentReciterKey = id;
    updateAudioSource(currentSurahIndex, currentAyahIndex);
    
    // Update the button text to show selected reciter
    const reciterBtn = document.querySelector('.btn-hero-secondary');
    if (reciterBtn) {
        const reciterObj = RECITER_DB.find(r => r.id === id);
        if (reciterObj) {
            reciterBtn.innerHTML = `<i class="fas fa-microphone-alt"></i><span>${reciterObj.name}</span>`;
        }
    }
    
    document.getElementById('reciter-modal').classList.remove('visible');
    showToast(`تم تغيير القارئ إلى: ${RECITER_DB.find(r => r.id === id)?.name}`);
}

function updateAudioSource(surah, ayah) {
    const currentReciterObj = reciters.find(r => r.key === currentReciterKey);
    const sPad = String(surah).padStart(3, '0');
    const aPad = String(ayah).padStart(3, '0');
    const fileName = `${sPad}${aPad}.mp3`;
    
    // 🔥 التعديل: استخدام خاصية folder الجديدة 🔥
    // لو مش موجودة (احتياطي) نستخدم ال key
    const folderNameStr = currentReciterObj ? currentReciterObj.folder : currentReciterKey;
    const folderName = `quran/audio/${folderNameStr}`; 

    // 1. الافتراضي: الرابط الأونلاين (ده بيفضل يستخدم ال key عشان everyayah)
    let audioUrl = `https://everyayah.com/data/${currentReciterKey}/${fileName}`;

    // 2. الفحص المحلي (الأوفلاين)
    if (window.Android && window.Android.isFileExists) {
        const isDownloaded = window.Android.isFileExists(folderName, fileName);
        
        if (isDownloaded) {
            console.log("Playing Offline Ayat 📂: " + fileName);
            audioUrl = `https://appassets.androidplatform.net/local/${folderName}/${fileName}`;
        } else {
            console.log("File not found locally in " + folderName);
        }
    }

    audioPlayer.src = audioUrl;
    audioPlayer.pause();
    resetAudioIcon();
}

function changeReciter(newKey) {
    currentReciterKey = newKey;
    updateAudioSource(currentSurahIndex, currentAyahIndex);
    
    audioPlayer.play();
    audioIcon.className = "fas fa-pause";
    
    // 🔥 التعديل: افحص هل القارئ الجديد ده ملفاته موجودة ولا لأ 🔥
    checkSurahDownloadStatus();
}

async function reloadTafsir() {
    const selectedTafsir = document.getElementById('tafsirSource').value;
    const tafsirContainer = document.getElementById('tafsirTextDisplay');
    tafsirContainer.style.opacity = '0.5';
    tafsirContainer.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جارِ الفحص...';
    if (selectedTafsir.includes('english') || selectedTafsir.includes('indonesian')) {
        fetchFromQuranEnc(selectedTafsir, tafsirContainer);
        return;
    }
    const folderName = `tafsir/${selectedTafsir}`;
    const fileName = `${currentSurahIndex}.json`;
    const localUrl = `https://appassets.androidplatform.net/local/${folderName}/${fileName}`;
    const githubUrl = `https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/main/${folderName}/${fileName}`;
    let isDownloaded = false;
    if (window.Android && typeof window.Android.isFileExists === 'function') {
        try { isDownloaded = window.Android.isFileExists(folderName, fileName); } catch (_) { isDownloaded = false; }
    }
    if (isDownloaded) {
        try {
            const response = await fetch(localUrl);
            if (!response.ok) throw new Error('Local file error');
            const json = await response.json();
            displayTafsirText(json, tafsirContainer, selectedTafsir);
        } catch (e) {
            console.error(e);
            tafsirContainer.style.opacity = '1';
            tafsirContainer.innerHTML = "حدث خطأ في قراءة الملف المحفوظ. حاول تحميله مرة أخرى.";
        }
    } else {
        tafsirContainer.style.opacity = '1';
        tafsirContainer.innerHTML = `
            <div style="text-align:center; padding: 20px;">
                <i class="fas fa-cloud-download-alt" style="font-size: 40px; margin-bottom: 15px;"></i>
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">تفسير هذه السورة غير موجود</h3>
                <p style="font-size: 14px; color: #888;">يجب تحميل حزمة التفسير أولاً لتصفحها بدون إنترنت.</p>
                <button onclick="downloadTafsirPack('${githubUrl}', '${folderName}', '${fileName}')"
                        id="btnDownloadTafsir"
                        style="background: rgba(79, 240, 183, 0.15); border: 1px solid #4ff0b7; padding: 10px 20px; border-radius: 25px; font-family: inherit; cursor: pointer; margin-top: 10px; transition: all 0.3s ease;">
                    <i class="fas fa-download"></i> تحميل التفسير الآن
                </button>
            </div>
        `;
    }
}

async function fetchFromQuranEnc(key, container) {
    try {
        container.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> loading...';
        const url = `https://quranenc.com/api/v1/translation/aya/${key}/${currentSurahIndex}/${currentAyahIndex}`;
        const res = await fetch(url);
        const data = await res.json();
        container.style.opacity = '1';
        if (data.result) container.innerHTML = data.result.translation || data.result.text;
    } catch (e) {
        container.innerHTML = "Error fetching translation.";
    }
}

function displayTafsirText(json, container, source) {
    let text = "";
    if (json.ayahs && Array.isArray(json.ayahs)) {
        const verseData = json.ayahs.find(item => item.ayah == currentAyahIndex);
        text = verseData ? verseData.text : "لم يتم العثور على تفسير لهذه الآية.";
    } else {
        text = JSON.stringify(json);
    }
    container.style.opacity = '1';
    const isForeign = /^(en|fr|ru|bn|ur|kurd|ind)-/.test(source);
    if (isForeign) {
        container.style.direction = 'ltr';
        container.style.textAlign = 'left';
        container.style.fontFamily = "'Outfit', sans-serif";
    } else {
        container.style.direction = 'rtl';
        container.style.textAlign = 'justify';
        container.style.fontFamily = "'Scheherazade New', serif";
    }
    container.innerHTML = text;
}

function downloadTafsirPack(url, folder, file) {
    // 1. فحص النت أول حاجة
    if (!navigator.onLine) {
        showToast("⚠️ فشل التحميل: تأكد من اتصال الإنترنت");
        return;
    }

    const btn = document.getElementById('btnDownloadTafsir');
    if (window.Android && typeof window.Android.downloadFile === 'function') {
        
        // تغيير الزر لوضع الانتظار
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارِ التحميل...';
        btn.disabled = true;
        btn.style.opacity = "0.7";
        
        try { 
            window.Android.downloadFile(url, folder, file); 
        } catch (e) {
            console.error(e);
            // في حالة حدوث خطأ برمجي (Java Crash)
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> حدث خطأ، حاول مجدداً';
            btn.disabled = false;
            btn.style.opacity = "1";
            return;
        }

        // محاكاة انتظار (يفضل لو الأندرويد يبعت callback حقيقي، لكن هذا حل مؤقت للويب)
        // ملاحظة: لو النت بطيء جداً وفشل التحميل في الأندرويد بدون ما يبلغنا، 
        // التايمر ده هيشتغل. الحل الجذري إن الجافا يبعت رسالة خطأ JS.
        // لكن حالياً سنفترض النجاح المبدئي بعد وقت
        setTimeout(() => {
            // هنا المفروض نتأكد إن الملف نزل فعلاً
            if (window.Android.isFileExists(folder, file)) {
                btn.innerHTML = '<i class="fas fa-check"></i> جاري فتح التفسير...';
                setTimeout(() => reloadTafsir(), 1500);
            } else {
                // لو عدى الوقت والملف لسه مش موجود (غالباً النت قطع أو بطيء)
                btn.innerHTML = '<i class="fas fa-redo"></i> فشل التحميل، اضغط للمحاولة';
                btn.disabled = false;
                btn.style.opacity = "1";
                showToast("لم يكتمل التحميل، يرجى المحاولة مرة أخرى");
            }
        }, 5000); // زودنا الوقت لـ 5 ثواني عشان نلحق نحمل
        
    } else {
        alert("هذه الميزة تعمل فقط داخل تطبيق الأندرويد");
    }
}

// 🔥 دالة إعادة تعيين زرار التحميل 🔥
function resetDownloadButton() {
    const btn = document.getElementById('btn-smart-download');
    if (btn) {
        // إعادة الزرار للحالة الأصلية
        btn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> <span class="btn-label">تحميل صوتي</span>';
        btn.classList.remove('active');
        btn.disabled = false;
    }
}

function showToast(message) {
    const toast = document.getElementById('customToast');
    const msgSpan = document.getElementById('toastMessage');

    msgSpan.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// دالة فحص حالة التحميل التلقائي
// ==========================================

function checkSurahDownloadStatus() {
    const dlBtn = document.getElementById('btn-smart-download');
    if (!dlBtn) return;

    // 1. هات بيانات القارئ الحالي عشان نعرف مسار المجلد
    const currentReciterObj = reciters.find(r => r.key === currentReciterKey);
    if (!currentReciterObj) return;

    // تجهيز المسارات زي ما عملنا في دالة التحميل بالضبط
    const surahID = String(currentSurahIndex).padStart(3, '0');
    // تنظيف اسم القارئ عشان المسار
    const safeReciterName = currentReciterObj.name.replace(/\s/g, '_'); 
    // المسار الكامل للملف الصوتي المجمع للسورة
    const reciterFolderFull = `quran/audio/${safeReciterName}`;
    const fullSurahFile = `${surahID}.mp3`;

    // 2. اسأل الأندرويد: الملف موجود؟
    let isDownloaded = false;
    if (window.Android && window.Android.isFileExists) {
        // فحص ملف السورة الكاملة
        isDownloaded = window.Android.isFileExists(reciterFolderFull, fullSurahFile);
    }

    // 3. تحديث الزر بناء على النتيجة
    if (isDownloaded) {
        // لو موجود: غير الايقونة لصح واقفل الزرار (أو سيبه شغال بس غير شكله)
        dlBtn.innerHTML = '<i class="fas fa-check-circle" style="color:#4ff0b7;"></i> <span class="btn-label">تم التحميل</span>';
        dlBtn.classList.add('active'); 
        // ممكن تلغي تفعيل الزرار لو مش عايز اليوزر يدوس عليه تاني
        // dlBtn.style.pointerEvents = "none"; 
    } else {
        // لو مش موجود: رجعه لوضع التحميل الطبيعي
        dlBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> <span class="btn-label">تحميل صوتي</span>';
        dlBtn.classList.remove('active');
        dlBtn.style.pointerEvents = "auto";
    }
}

/* ==========================================
   نظام النسخ الصامت (بدون وميض أو كيبورد)
   ========================================== */

// الدالة الرئيسية للنسخ
function copyToClipboard(text, successMessage) {
    // محاولة النسخ بالطريقة الحديثة (لو مدعومة)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(successMessage))
            .catch(() => fallbackCopy(text, successMessage));
    } else {
        // استخدام الطريقة التقليدية المحسنة
        fallbackCopy(text, successMessage);
    }
}

// دالة النسخ الاحتياطية (المسؤلة عن منع الوميض)
function fallbackCopy(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // خصائص تمنع الوميض وظهور الكيبورد
    textArea.style.position = "fixed";  // تثبيت المكان
    textArea.style.left = "-9999px";    // إخفاء خارج الشاشة
    textArea.style.top = "0";
    textArea.setAttribute('readonly', ''); // 🔥 السطر ده هو اللي بيمنع الكيبورد يفتح
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);

    // تحديد النص بطريقة تدعم آيفون وأندرويد
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);

    try {
        document.execCommand('copy');
        showToast(successMessage);
    } catch (err) {
        console.error('فشل النسخ', err);
        showToast("حدث خطأ أثناء النسخ");
    }

    // تنظيف
    document.body.removeChild(textArea);
}

/* --- ربط الزراير بدوال النسخ الجديدة --- */

function copyAyahText() {
    copyToClipboard(ayahTextEl.innerText, "تم نسخ نص الآية الكريمة");
}

function copyTafsirText() {
    const tafsirSelect = document.getElementById('tafsirSource');
    const selectedOption = tafsirSelect.options[tafsirSelect.selectedIndex].text;
    copyToClipboard(tafsirTextEl.innerText, `تم نسخ ${selectedOption}`);
}

function copyTafsir() {
    const text = `﴿ ${ayahTextEl.innerText} ﴾

التفسير: ${tafsirTextEl.innerText}

(سورة ${surahTitleEl.innerText.replace('سورة ', '')} - الآية ${currentAyahIndex})`;
    copyToClipboard(text, "تم نسخ الآية والتفسير بنجاح");
}

/* SEARCH MODAL LOGIC */
function toggleSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.toggle('visible');
    
    // === إضافة حالة التنقل ===
    if (modal.classList.contains('visible')) {
        MobileNav.pushState('searchModal');
        document.getElementById('modalSearchInput').focus();
    }
    // ========================
}

function handleSearchInput(val) {
    // لو الكتابة جاية من الهيدر، افتح المودال وانقل النص ليه
    const modalInput = document.getElementById('modalSearchInput');
    const modal = document.getElementById('searchModal');

    if (!modal.classList.contains('visible') && val.length > 0) {
        toggleSearchModal();
        modalInput.value = val;
        modalInput.focus();
    } else if (modal.classList.contains('visible')) {
        // لو المودال مفتوح، كمل بحث عادي
        const btn = document.getElementById('searchActionBtn');
        if (val.length > 0) {
            btn.classList.add('active');
            btn.innerText = "بحث فوري";
            // تشغيل البحث التلقائي
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => performSearchFromModal(), 300);
        } else {
            btn.classList.remove('active');
            btn.innerText = "ابحث";
        }
    }
}

// ============================================================
// 🧠 محرك البحث النووي الموحد (Levenshtein + Scoring + Ghemah)
// ============================================================

let quranSearchIndex = [];
let searchTimer = null;

// 1. التهيئة (تحميل المصحف)
async function initSearchEngine() {
    try {
        console.log("📥 جارِ تحميل فهرس البحث الذكي للتفسير...");
        const response = await fetch('https://api.alquran.cloud/v1/quran/quran-simple-clean');
        const data = await response.json();

        quranSearchIndex = [];
        data.data.surahs.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                quranSearchIndex.push({
                    surahName: surah.name,
                    surahNum: surah.number,
                    ayahNum: ayah.numberInSurah,
                    text: ayah.text,
                    // تخزين النص ككلمات منفصلة لتسريع البحث
                    words: smartNormalize(ayah.text).split(' ')
                });
            });
        });
        console.log(`✅ تم فهرسة ${quranSearchIndex.length} آية بنجاح.`);
    } catch (error) {
        console.error("فشل تحميل بيانات البحث", error);
    }
}

// 2. تنظيف النصوص (التوحيد القياسي)
function smartNormalize(text) {
    if (!text) return "";
    return text
        .replace(/[\u0622\u0623\u0625\u0624\u0626\u0621]/g, 'ا') // أ إ آ ء ؤ ئ -> ا
        .replace(/[\u0629]/g, 'ه') // ة -> ه
        .replace(/[\u0649]/g, 'ي') // ى -> ي
        .replace(/[^\u0621-\u064A\s]/g, '') // حذف التشكيل
        .trim();
}

// 3. 📐 خوارزمية ليفنشتاين (حساب فرق الحروف)
function calculateLevenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // استبدال
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // إدخال وحذف
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// 4. دالة تقييم التشابه بين كلمتين (0 إلى 1)
function getWordSimilarity(userWord, dbWord) {
    // أ) تطابق تام
    if (userWord === dbWord) return 1.0;

    // ب) معالجة النون والتنوين (لنسفعن == لنسفعا)
    let uMod = userWord.replace(/ن$/, 'ا');
    let dMod = dbWord.replace(/ن$/, 'ا');
    if (uMod === dMod) return 0.95;

    // ج) الكلمة جزء من الكلمة (للبحث الجزئي)
    if (dbWord.startsWith(userWord)) return 0.9;

    // د) استخدام خوارزمية ليفنشتاين للأخطاء الإملائية
    const dist = calculateLevenshtein(userWord, dbWord);
    const maxLen = Math.max(userWord.length, dbWord.length);

    if (maxLen <= 3) return dist === 0 ? 1 : 0;
    if (maxLen <= 6) return dist <= 1 ? 0.8 : 0; // غلطة واحدة مسموحة
    return dist <= 2 ? 0.7 : 0; // غلطتين مسموحتين للكلمات الطويلة
}

// 5. ⚖️ نظام تجميع النقاط (Scoring System) وتنفيذ البحث
function performSearchFromModal() {
    let rawQuery = document.getElementById('modalSearchInput').value;
    let query = smartNormalize(rawQuery);

    if (query.length < 2) return;

    const container = document.getElementById('modalSearchResults');
    container.innerHTML = '<div style="text-align:center; color:#fff; margin-top:30px;"><div class="loading-spinner" style="margin:0 auto;"></div><p style="font-family:Reem Kufi; font-size:12px; color:#888; margin-top:10px">جاري التحليل العميق...</p></div>';

    let userWords = query.split(' ').filter(w => w.length > 0);

    setTimeout(() => {
        // حساب الدرجات لكل آية
        let scoredResults = quranSearchIndex.map(ayah => {
            let totalScore = 0;
            let matchCount = 0;

            userWords.forEach(uWord => {
                let bestWordScore = 0;
                ayah.words.forEach(dbWord => {
                    let sim = getWordSimilarity(uWord, dbWord);
                    if (sim > bestWordScore) bestWordScore = sim;
                });

                if (bestWordScore > 0.5) {
                    totalScore += bestWordScore;
                    matchCount++;
                }
            });

            // المعادلة: (مجموع النقاط) * (وزن عدد الكلمات المتطابقة)
            let finalScore = (matchCount > 0) ? (totalScore * (matchCount / userWords.length)) : 0;
            return { ...ayah, score: finalScore };
        });

        // فلترة وترتيب النتائج
        let results = scoredResults
            .filter(item => item.score > 0.4)
            .sort((a, b) => b.score - a.score);

        displaySearchResults(results.slice(0, 50), rawQuery);
    }, 50);
}

// 6. عرض النتائج (مع الانتقال للتفسير)
function displaySearchResults(results, originalQuery) {
    const container = document.getElementById('modalSearchResults');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `
                    <div style="text-align:center; color:#888; font-family:'Amiri'; margin-top:20px;">
                        <i class="fas fa-search-minus" style="font-size:24px; margin-bottom:10px;"></i><br>
                        لم نجد آية مطابقة لـ "${originalQuery}"
                    </div>`;
        return;
    }

    results.forEach(match => {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        item.innerHTML = `
                    <div class="res-text">﴿ ${match.text} ﴾</div>
                    
                    <div class="res-info">
                        <i class="fas fa-quran"></i> سورة ${match.surahName} - آية ${toArabic(match.ayahNum)}
                    </div>
                `;

        item.onclick = () => {
            toggleSearchModal();
            // الانتقال لآية التفسير وتحديث الصفحة
            loadAyah(match.surahNum, match.ayahNum);
        };

        container.appendChild(item);
    });
}

function generatePostCard() {
    showToast("جارِ تصميم البطاقة... 🎨");

    const ayahText = ayahTextEl.innerText;
    const tafsirText = document.getElementById('tafsirTextDisplay').innerText;

    const surahNum = currentSurahIndex;
    const ayahNum = currentAyahIndex;
    const surahMeta = quranData.find(s => s.id === currentSurahIndex);
    const surahName = surahMeta ? surahMeta.name_arabic : "سورة";

    document.getElementById('post-ayah-text').innerText = ayahText;

    // اسم التفسير
    const tafsirSelect = document.getElementById('tafsirSource');
    const currentTafsirName = tafsirSelect.options[tafsirSelect.selectedIndex].text;
    document.getElementById('post-tafsir-label').innerText = `― ${currentTafsirName} ―`;

    let cleanTafsir = tafsirText.replace('جارِ قراءة الملف الشامل...', '');
    const MAX_CHARS = 430;

    const postTafsirEl = document.getElementById('post-tafsir-text');

    if (cleanTafsir.length > MAX_CHARS) {
        let cutText = cleanTafsir.substring(0, MAX_CHARS);
        cutText = cutText.substring(0, cutText.lastIndexOf(" "));

        postTafsirEl.innerHTML = `
                    ${cutText}...
                    <br>
                    <div style="
                        border-top: 2px dashed rgba(212, 175, 55, 0.5); 
                        margin-top: 25px; 
                        padding-top: 20px;
                        font-family: 'Traditional Arabic', 'Scheherazade New', serif; 
                        font-size: 26px; 
                        font-weight: bold; 
                        color: var(--gold);
                        text-align: center; 
                        line-height: 1.4;
                        opacity: 1;">
                        ✨ التفسير كامل ومفصل موجود داخل التطبيق
                        <br>
                        <span style="
                            font-size: 20px; 
                            font-weight: normal;
                            color: #ccc; 
                            direction: rtl; 
                            unicode-bidi: embed;
                            display: inline-block;">
                            (حمله الآن مجاناً لقراءة المزيد)
                        </span>
                    </div>
                `;
    } else {
        postTafsirEl.innerText = cleanTafsir;
    }

    document.getElementById('post-surah').innerText = `سورة ${surahName}`;
    document.getElementById('post-ayah-num').innerText = `آية ${toArabic(ayahNum)}`;

    const studio = document.getElementById('social-post-studio');

    setTimeout(() => {
        html2canvas(studio, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,       // مهم عشان الصور الخارجية
            allowTaint: true     // مهم عشان الصور المحلية
        }).then(canvas => {
            
            // 1. تحويل الصورة لنص Base64
            const base64Data = canvas.toDataURL("image/jpeg", 0.9);
            const fileName = `SunnahPro_${surahName}_${ayahNum}`;

            // 2. الكوبري السحري: هل إحنا جوه الأندرويد؟
            if (window.Android && window.Android.saveImage) {
                // ✅ نعم: ابعت الصورة للجاڤا عشان يحفظها
                showToast("جارِ الحفظ في المعرض...");
                window.Android.saveImage(base64Data, fileName);
            } else {
                // ❌ لا: إحنا على الكمبيوتر، نزلها عادي
                const link = document.createElement('a');
                link.download = fileName + ".jpg";
                link.href = base64Data;
                link.click();
                showToast("تم حفظ التصميم بنجاح ✅");
            }

        }).catch(err => {
            console.error(err);
            showToast("حدث خطأ أثناء التصميم");
        });
    }, 150);
}

// ==========================================
// 🚀 نظام التحميل الذكي (Smart Batch Download)
// ==========================================

function triggerSmartDownload() {
    // 1. شغل وضع الانتظار في الزرار
    const btn = document.getElementById('btn-smart-download');
    if(btn) {
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span class="btn-label">بدء التحميل...</span>';
        btn.disabled = true;
    }

    // 2. فحص الأندرويد
    if (!window.Android || !window.Android.downloadFile) {
        alert("يرجى استخدام التطبيق الرسمي");
        return;
    }

    const currentReciterObj = reciters.find(r => r.key === currentReciterKey);
    const surahID = String(currentSurahIndex).padStart(3, '0');
    // استخدمنا folder عشان نوحد المسارات زي ما اتفقنا
    const unifiedFolder = currentReciterObj.folder; 
    const reciterFolderFull = `quran/audio/${unifiedFolder}`;
    const fullSurahFile = `${surahID}.mp3`;

    // 3. 🔥 الخطوة الأولى: ابدأ بتحميل ملف السورة الكاملة فوراً 🔥
    // ده أهم ملف، وبمجرد ما يبدأ المستخدم هيحس بالاستجابة
    const fullSurahUrl = `${currentReciterObj.server}${surahID}.mp3`;
    
    // إرسال أول ملف فوراً (مش محتاجين JSON ضخم هنا)
    window.Android.downloadFile(fullSurahUrl, reciterFolderFull, fullSurahFile);
    
    // إظهار الشريط فوراً
    if(window.updateDownloadProgress) window.updateDownloadProgress(1); // 1% وهمي للبداية
    showToast("بدأ تحميل السورة...");

    // 4. 🔥 الخطوة الثانية: ابدأ تحميل الآيات في الخلفية (بدون تعليق) 🔥
    // هنستخدم setTimeout عشان ندي فرصة للمتصفح يتنفس وميعلقش
    setTimeout(() => {
        startAyahBatchDownload(currentReciterObj.key, unifiedFolder, surahID);
    }, 500);
}

// ==========================================

function startAyahBatchDownload(reciterKey, folderName, surahID) {
    // 1. تجهيز البيانات للإرسال
    // هنجيب اسم السورة من العنصر اللي في الصفحة
    const surahName = document.getElementById('currentSurahName').innerText; 
    
    // هنجيب اسم الشيخ من القائمة
    const currentReciterObj = reciters.find(r => r.key === reciterKey);
    const reciterName = currentReciterObj ? currentReciterObj.name : "قارئ غير معروف";

    // 2. تجهيز القائمة
    let downloadQueue = [];
    const reciterFolderAyat = `quran/audio/${folderName}`;

    for (let i = 1; i <= totalAyahsInSurah; i++) {
        const ayahID = String(i).padStart(3, '0');
        const fileName = `${surahID}${ayahID}.mp3`;
        
        downloadQueue.push({
            url: `https://everyayah.com/data/${reciterKey}/${fileName}`,
            folder: reciterFolderAyat,
            file: fileName
        });
    }

    console.log(`Sending batch with details: ${surahName} - ${reciterName}`);
    
    if (window.Android && window.Android.downloadBatch) {
        // 🔥 التعديل: بنبعت الـ 3 حاجات (القائمة، اسم السورة، اسم الشيخ) 🔥
        window.Android.downloadBatch(JSON.stringify(downloadQueue), surahName, reciterName);
    }
}

// ==========================================

// دالة الانتهاء (عرض علامة الصح فقط)
window.onBatchComplete = function() {
    const btn = document.getElementById('btn-smart-download');
    if(btn) {
        btn.innerHTML = '<i class="fas fa-check-circle" style="color:#4ff0b7;"></i>';
        btn.classList.add('active'); // نبقيه مميز بلون أخضر
    }
    showToast("تم تحميل السورة وملحقاتها بنجاح ✅");
};

// دالة بتفحص حالة الملفات وتظبط الزرار تلقائياً
function checkSurahDownloadStatus() {
    const dlBtn = document.getElementById('btn-smart-download');
    if (!dlBtn) return;

    // لو مفيش أندرويد، سيب الزرار عادي
    if (!window.Android || !window.Android.isFileExists) return;

    const currentReciterObj = reciters.find(r => r.key === currentReciterKey);
    if (!currentReciterObj) return;

    // تجهيز المسار للفحص (نفس المسار المستخدم في التحميل)
    const surahID = String(currentSurahIndex).padStart(3, '0');
    
    // 🔥 التعديل: استخدام نفس اسم الفولدر الموحد 🔥
    const unifiedFolder = currentReciterObj.folder; 
    const reciterFolderFull = `quran/audio/${unifiedFolder}`;
    const fullSurahFile = `${surahID}.mp3`;

    // سؤال الأندرويد
    const isDownloaded = window.Android.isFileExists(reciterFolderFull, fullSurahFile);

    if (isDownloaded) {
        // ✅ الحالة: تم التحميل (أبيض وأخضر)
        dlBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span class="btn-label">تم التحميل</span>';
        dlBtn.classList.add('active');
    } else {
        // ⬇️ الحالة: جاهز للتحميل
        dlBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> <span class="btn-label">تحميل صوتي</span>';
        dlBtn.classList.remove('active');
        dlBtn.style.pointerEvents = "auto";
        dlBtn.disabled = false;
    }
}

// دالة استقبال الأخطاء من الجافا (اللي عملناها فوق)
function onDownloadError(reason) {
    const dlBtn = document.getElementById('btn-smart-download');
    
    // 1. رجع الزرار لحالته الأصلية فوراً
    if(dlBtn) {
        dlBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> <span class="btn-label">تحميل صوتي</span>';
        dlBtn.classList.remove('active');
        dlBtn.disabled = false;
    }

    // إخفاء الشريط فوراً
    document.getElementById('download-progress-panel').style.display = 'none';
    
    // 2. طلع رسالة توضيحية
    if (reason === 'no_internet') {
        showToast("⚠️ لا يوجد اتصال بالإنترنت");
    } else if (reason === 'interrupted') {
        showToast("⚠️ انقطع الاتصال أثناء التحميل");
    } else {
        showToast("❌ حدث خطأ، حاول مرة أخرى");
    }
}

// دالة بتستقبل النسبة من الجافا وبتحرك الشريط
window.updateDownloadProgress = function(percent) {
    const panel = document.getElementById('download-progress-panel');
    const fill = document.getElementById('progress-bar-fill');
    const text = document.getElementById('progress-percent');

    // 1. إظهار اللوحة لو كانت مخفية
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    }

    // 2. تحديث العرض والنص
    fill.style.width = percent + '%';
    text.innerText = percent + '%';

    // 3. لو كمل 100%، اخفيه بعد ثانية ونص
    if (percent >= 100) {
        setTimeout(() => {
            panel.style.display = 'none';
            // وهنا نعيد تعيين العرض للصفر للمرة الجاية
            fill.style.width = '0%'; 
        }, 1500);
    }
};

// وتأكد إن دالة onDownloadError بتخفي الشريط لو حصل خطأ
const oldOnError = window.onDownloadError; // حفظ الدالة القديمة لو موجودة
window.onDownloadError = function(reason) {
    // إخفاء الشريط فوراً
    document.getElementById('download-progress-panel').style.display = 'none';
    
    // استدعاء الدالة القديمة عشان التوست والزرار
    if (oldOnError) oldOnError(reason); 
};
