import { initSupabase, onAuthStateChange, renderUserProfile, renderLoginButton } from '../auth.js';
import { initSidebar } from '../components/sidebar.js';
import { initProfileSystem } from '../components/profile-manager.js';

const SUPABASE_URL = 'https://kstknnfyesrthyjlrlle.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdGtubmZ5ZXNydGh5amxybGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzUyMDksImV4cCI6MjA3OTQ1MTIwOX0.PQRPsv0l9-b7wwwKnnHBJGY6PO0JarcVpihULMOhAeE';

const supabaseClient = initSupabase(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    initSidebar('home');
    
    // Initialize auth system which handles both header and sidebar profiles
    await initAuthSystem();
});

// Prayer Times Logic
const apiURL = "https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5";
const prayerNamesAr = { Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };

function updateHeaderInfo(hijri, gregorian) {
    const hDate = `${toArabicNumerals(hijri.day)} ${hijri.month.ar} ${toArabicNumerals(hijri.year)} هـ`;
    const hDateEl = document.getElementById('hijriDateDisplay');
    if (hDateEl) hDateEl.innerText = hDate;

    const gDate = `${gregorian.day} / ${gregorian.month.number} / ${gregorian.year} م`;
    const gDateEl = document.getElementById('gregorianDateDisplay');
    if (gDateEl) gDateEl.innerText = gDate;
}

async function fetchPrayerTimes() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;
        const gregorian = data.data.date.gregorian;

        updateHeaderInfo(hijri, gregorian);
        setupNextPrayer(timings);
        updatePrayerWidget(timings);

    } catch (error) {
        console.error("Error:", error);
    }
}

function setupNextPrayer(timings) {
    const now = new Date();
    const timeNow = now.getHours() * 60 + now.getMinutes();
    const prayersOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let nextPrayerKey = null;
    let nextPrayerTimeObj = null;

    for (let prayer of prayersOrder) {
        const [h, m] = timings[prayer].replace(/ \(.*\)/, '').split(':').map(Number);
        const prayerMinutes = h * 60 + m;
        if (prayerMinutes > timeNow) {
            nextPrayerKey = prayer;
            nextPrayerTimeObj = new Date();
            nextPrayerTimeObj.setHours(h, m, 0);
            break;
        }
    }

    if (!nextPrayerKey) {
        nextPrayerKey = 'Fajr';
        const [h, m] = timings['Fajr'].replace(/ \(.*\)/, '').split(':').map(Number);
        nextPrayerTimeObj = new Date();
        nextPrayerTimeObj.setDate(nextPrayerTimeObj.getDate() + 1);
        nextPrayerTimeObj.setHours(h, m, 0);
    }

    const nextPName = document.getElementById('nextPrayerName');
    if (nextPName) nextPName.innerText = prayerNamesAr[nextPrayerKey];
    startLiveCountdown(nextPrayerTimeObj);
}

let countdownInterval;
function startLiveCountdown(targetDate) {
    if (countdownInterval) clearInterval(countdownInterval);

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        const countEl = document.getElementById('countdown');

        if (distance < 0) {
            clearInterval(countdownInterval);
            fetchPrayerTimes();
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countEl) countEl.innerText =
            `${toArabicNumerals(String(hours).padStart(2, '0'))}:${toArabicNumerals(String(minutes).padStart(2, '0'))}:${toArabicNumerals(String(seconds).padStart(2, '0'))}`;
    };

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

function updatePrayerWidget(timings) {
    const list = document.getElementById('prayerTimesList');
    if (!list) return;
    list.innerHTML = '';
    const prayersToShow = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayersToShow.forEach(key => {
        const div = document.createElement('div');
        div.className = 'prayer-item';
        let [h, m] = timings[key].replace(/ \(.*\)/, '').split(':');
        h = h % 12 || 12;
        div.innerHTML = `<span>${prayerNamesAr[key]}</span><strong>${toArabicNumerals(h)}:${toArabicNumerals(m)}</strong>`;
        list.appendChild(div);
    });
}

function toArabicNumerals(num) { return num.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]); }

// Start Prayer Logic
fetchPrayerTimes();

// ================= SMART LIVE STREAM SYSTEM =================
window.playLiveStream = async function () {
    const videoContainer = document.getElementById('videoContainer');
    const placeholder = document.getElementById('livePlaceholderContent');
    const target = document.getElementById('playerTarget');

    if (placeholder) placeholder.style.display = 'none';
    if (videoContainer) videoContainer.style.display = 'block';

    target.innerHTML = '<div style="color:white; height:100%; display:flex; align-items:center; justify-content:center;">جاري جلب أحدث بث...</div>';

    try {
        const { data, error } = await supabaseClient
            .from('app_config')
            .select('value')
            .eq('key', 'makkah_live_id')
            .single();

        let videoId = 'PfrBk8tPF7c';

        if (error || !data) {
            console.warn('فشل الاتصال بقاعدة البيانات، استخدام الرابط الاحتياطي');
        } else {
            console.log('تم جلب الرابط من السيرفر:', data.value);
            videoId = data.value;
        }

        target.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&showinfo=0" 
                title="Makkah Live" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="border-radius: 15px;">
            </iframe>
            
            <button onclick="closeLiveStream()" style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; z-index: 20;">
                <i class="fas fa-times"></i>
            </button>
        `;

    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

window.closeLiveStream = function () {
    const videoContainer = document.getElementById('videoContainer');
    const placeholder = document.getElementById('livePlaceholderContent');
    const target = document.getElementById('playerTarget');

    if (videoContainer) videoContainer.style.display = 'none';
    if (target) target.innerHTML = '';
    if (placeholder) placeholder.style.display = 'flex';
};

// --- Ultimate Garden Logic ---
const gardenData = JSON.parse(localStorage.getItem('gardenData')) || { xp: 0, level: 0, totalHasanat: 0 };
const levelThresholds = [100, 300, 600, 1000];
const titles = ["بذرة الإيمان", "نبتة خضراء", "شجرة طيبة", "حديقة مثمرة"];

function initGarden() {
    updateGardenUI();
}

window.gardenAction = function (type) {
    let gain = 0;
    if (type === 'water') { gain = 10; triggerRain(); }
    if (type === 'sun') { gain = 20; triggerSun(); }
    if (type === 'fert') { gain = 50; triggerFertilizer(); }

    gardenData.xp += gain;
    gardenData.totalHasanat += gain;
    checkLevelUp();
    saveGarden();
    updateGardenUI();

    if (navigator.vibrate) navigator.vibrate(50);
};

function checkLevelUp() {
    if (gardenData.level < levelThresholds.length) {
        if (gardenData.xp >= levelThresholds[gardenData.level]) {
            gardenData.xp = 0;
            gardenData.level++;
            showLevelUpEffect();
        }
    }
}

function updateGardenUI() {
    document.querySelectorAll('.tree-stage').forEach(el => el.classList.remove('active'));
    let stageIndex = Math.min(gardenData.level, 3);
    const stageEl = document.getElementById(`tree-stage-${stageIndex}`);
    if (stageEl) stageEl.classList.add('active');

    const titleEl = document.getElementById('gardenLevelTitle');
    if (titleEl) titleEl.innerText = `المستوى ${gardenData.level + 1}: ${titles[Math.min(gardenData.level, 3)]}`;

    let maxXP = levelThresholds[Math.min(gardenData.level, levelThresholds.length - 1)];
    let percent = Math.min((gardenData.xp / maxXP) * 100, 100);
    if (gardenData.level >= 3) percent = 100;

    const barEl = document.getElementById('gardenProgressBar');
    if (barEl) barEl.style.width = percent + '%';

    const xpDisplay = document.getElementById('gardenXPDisplay');
    if (xpDisplay) xpDisplay.innerText = gardenData.level >= 3 ? "المستوى الأقصى" : `${gardenData.xp} / ${maxXP} XP`;
}

function saveGarden() {
    localStorage.setItem('gardenData', JSON.stringify(gardenData));
}

function triggerRain() {
    const container = document.getElementById('rainContainer');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        let drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(drop);
        setTimeout(() => drop.remove(), 1000);
    }
}

function triggerSun() {
    const ray = document.getElementById('sunRay');
    if (ray) {
        ray.classList.add('active');
        setTimeout(() => ray.classList.remove('active'), 2000);
    }
}

function triggerFertilizer() {
    const fruits = document.querySelectorAll('.fruit');
    fruits.forEach(fruit => {
        fruit.style.animation = 'popIn 0.5s forwards';
        setTimeout(() => {
            fruit.style.animation = '';
        }, 500);
    });
}

function showLevelUpEffect() {
    const effect = document.getElementById('levelUpEffect');
    if (effect) {
        effect.classList.add('show');
        setTimeout(() => {
            effect.classList.remove('show');
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initGarden();
});

// --- Sanctuary Mode Logic ---
window.toggleSanctuary = function () {
    const overlay = document.getElementById('sanctuaryOverlay');
    const bg = document.getElementById('sanctuaryBg');
    const title = document.getElementById('sanctuaryTitle');
    const msg = document.getElementById('sanctuaryMsg');
    const audio = document.getElementById('ambientSound');

    if (!overlay) return;
    if (overlay.style.display === 'flex') {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 500);
        if (audio) audio.pause();
    } else {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);

        const hour = new Date().getHours();
        if (hour >= 5 && hour < 18) {
            if (bg) bg.style.backgroundImage = "url('https://i.pinimg.com/originals/78/e4/93/78e49322603b01269261482210224936.jpg')";
            if (title) title.innerText = "وقت النشاط";
            if (msg) msg.innerText = "اللهم بك أصبحنا وبك أمسينا";
        } else {
            if (bg) bg.style.backgroundImage = "url('https://i.pinimg.com/originals/2a/27/91/2a279107341134763365808101542491.jpg')";
            if (title) title.innerText = "هدوء الليل";
            if (msg) msg.innerText = "أرحنا بها يا بلال";
        }
    }
};

const sidebarEl = document.getElementById('sidebar');
if (sidebarEl) {
    sidebarEl.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

// Function to fetch Khatma data from IndexedDB
async function fetchKhatmaData() {
    return new Promise((resolve) => {
        const req = indexedDB.open('SunnahPro_RamadanKhatma', 2);
        req.onsuccess = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('settings')) {
                resolve(null);
                return;
            }
            const tx = db.transaction('settings', 'readonly');
            const store = tx.objectStore('settings');
            const getReq = store.get('active_plan');
            getReq.onsuccess = () => resolve(getReq.result ? getReq.result.value : null);
            getReq.onerror = () => resolve(null);
        };
        req.onerror = () => resolve(null);
    });
}

// Function to calculate streak
function calculateKhatmaStreakDashboard(plan) {
    if (!plan.days) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (plan.days[key] && plan.days[key].pagesRead > 0) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    return streak;
}

// Update Khatma card with real data
async function updateKhatmaProgress() {
    const plan = await fetchKhatmaData();
    
    const circle = document.querySelector('.kc-progress-ring-circle');
    const percentVal = document.getElementById('kc-percent-val');
    const wirdText = document.getElementById('kc-wird-text');
    const pagesLeftText = document.getElementById('kc-pages-left-text');
    const statStreak = document.getElementById('kc-stat-streak');
    const statCompleted = document.getElementById('kc-stat-completed');
    const statToday = document.getElementById('kc-stat-today');
    const startBtn = document.getElementById('kc-start-btn');

    let percent = 0;

    if (plan && plan.id === 'active') {
        // Calculate data based on active plan
        const today = new Date().toISOString().split('T')[0];
        const todayPages = plan.days?.[today]?.pagesRead || 0;
        percent = Math.min((plan.completedPages / plan.totalPagesNeeded) * 100, 100);
        const streak = calculateKhatmaStreakDashboard(plan);
        const fromPage = plan.currentPage;
        const toPage = Math.min(plan.currentPage + plan.dailyPages - todayPages - 1, 604);
        const remainingToday = plan.dailyPages - todayPages;
        
        // Fill data in the interface
        if(percentVal) percentVal.innerText = percent.toFixed(1) + '%';
        if(wirdText) wirdText.innerText = `ورد اليوم: صفحة ${fromPage} - صفحة ${toPage}`;
        
        if(pagesLeftText) {
            if(remainingToday <= 0) {
                pagesLeftText.innerText = 'أنهيت ورد اليوم 🎉';
            } else {
                pagesLeftText.innerText = `متبقي ${remainingToday} صفحة لورد اليوم`;
            }
        }

        if(statStreak) statStreak.innerText = streak;
        if(statCompleted) statCompleted.innerText = plan.completedPages;
        if(statToday) statToday.innerText = `${todayPages}/${plan.dailyPages}`;
        
        // Hide start button because khatma is already active
        if(startBtn) startBtn.style.display = 'none';

    } else {
        // Zero out data if user hasn't started their journey
        if(percentVal) percentVal.innerText = '0%';
        if(wirdText) wirdText.innerText = 'لم تبدأ بعد';
        if(pagesLeftText) pagesLeftText.innerText = 'ابدأ خطتك المخصصة الآن';
        if(statStreak) statStreak.innerText = '0';
        if(statCompleted) statCompleted.innerText = '0';
        if(statToday) statToday.innerText = '0/0';
        
        // Show start button
        if(startBtn) startBtn.style.display = 'flex';
    }

    // Update circle (animation)
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (percent / 100) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 500);
    }
}

// Function to save daily wird state to localStorage
function saveDailyWirdState() {
    const today = new Date().toISOString().split('T')[0];
    const state = {
        date: today,
        chk1: document.getElementById('wird-chk-1') ? document.getElementById('wird-chk-1').checked : false,
        chk2: document.getElementById('wird-chk-2') ? document.getElementById('wird-chk-2').checked : false,
        chk3: document.getElementById('wird-chk-3') ? document.getElementById('wird-chk-3').checked : false,
        chk4: document.getElementById('wird-chk-4') ? document.getElementById('wird-chk-4').checked : false
    };
    localStorage.setItem('sunnah_daily_wird_checklist', JSON.stringify(state));
}

// Function to load daily wird state from localStorage
function loadDailyWirdState() {
    const today = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem('sunnah_daily_wird_checklist');
    
    if (savedData) {
        try {
            const saved = JSON.parse(savedData);
            // If data is saved for the same day, restore it
            if (saved && saved.date === today) {
                if (document.getElementById('wird-chk-1')) document.getElementById('wird-chk-1').checked = saved.chk1;
                if (document.getElementById('wird-chk-2')) document.getElementById('wird-chk-2').checked = saved.chk2;
                if (document.getElementById('wird-chk-3')) document.getElementById('wird-chk-3').checked = saved.chk3;
                if (document.getElementById('wird-chk-4')) document.getElementById('wird-chk-4').checked = saved.chk4;
                return; // Exit the function since we successfully restored the data
            }
        } catch (e) {
            console.error("Error parsing saved wird state", e);
        }
    }
    
    // If it's a new day or no saved data, uncheck all boxes
    if (document.getElementById('wird-chk-1')) document.getElementById('wird-chk-1').checked = false;
    if (document.getElementById('wird-chk-2')) document.getElementById('wird-chk-2').checked = false;
    if (document.getElementById('wird-chk-3')) document.getElementById('wird-chk-3').checked = false;
    if (document.getElementById('wird-chk-4')) document.getElementById('wird-chk-4').checked = false;
}

// Call the function to update khatma progress when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateKhatmaProgress, 1000); // Delay to ensure DOM is ready
    loadDailyWirdState(); // Load daily wird state
    updateHijriDate(); // Update hijri date immediately
});

// Update hijri date from the main header
function updateHijriDate() {
    const hijriDateElement = document.getElementById('dash-hijri-date');
    const mainHijriDate = document.getElementById('hijriDateDisplay');
    if (hijriDateElement && mainHijriDate) {
        hijriDateElement.textContent = mainHijriDate.textContent;
    }
}

// Update hijri date periodically
setInterval(updateHijriDate, 60000); // Update every minute

// ==========================================
// ✅ CORE AUTH INTEGRATION
// ==========================================

async function initAuthSystem() {
    // Set up the auth state change listener
    onAuthStateChange((user) => {
        if (user) {
            // تحديث القائمة الجانبية والهيدر مع بعض بنفس البيانات المباشرة
            renderUserProfile(user, 'sidebarProfile');
            initProfileSystem(user); 
        } else {
            // تحديث القائمة الجانبية والهيدر في حالة الضيف
            renderLoginButton('sidebarProfile');
            initProfileSystem(null);
        }
    });

    // Initialize current state on load
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        renderUserProfile(session.user, 'sidebarProfile');
        initProfileSystem(session.user);
    } else {
        renderLoginButton('sidebarProfile');
        initProfileSystem(null);
    }
}