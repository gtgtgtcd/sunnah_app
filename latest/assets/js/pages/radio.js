// التشغيل الأولي
window.onload = function () {
    initPlayerOnLoad();
};

// --- PLAYER LOGIC (FROM NEW FILE) ---
const globalStationsDB = [
    { id: 'EG', name: 'إذاعة القاهرة', desc: 'من ماسبيرو', img: 'https://flagcdn.com/w320/eg.png', url: 'https://n02.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABj6Yy_34A7-2i_vJ2aT_4wQ', code: 'EG', loc: 'القاهرة' },
    { id: 'SA', name: 'إذاعة السعودية', desc: 'من الرياض', img: 'https://flagcdn.com/w320/sa.png', url: 'https://stream.radiojar.com/4wqre23fytzuv', code: 'SA', loc: 'السعودية' },
    { id: 'KW', name: 'إذاعة الكويت', desc: 'تلاوة 24 ساعة', img: 'https://flagcdn.com/w320/kw.png', url: 'https://node33.obviousapproach.com:9000/stream', code: 'KW', loc: 'الكويت' },
    { id: 'BH', name: 'إذاعة البحرين', desc: 'المنامة', img: 'https://flagcdn.com/w320/bh.png', url: 'https://n09.radiojar.com/0tpy1h0kxtzuv?rj-ttl=5&rj-tok=AAABj6Yy_34A7-2i_vJ2aT_4wQ', code: 'BH', loc: 'البحرين' },
    { id: 'SHJ', name: 'إذاعة الشارقة', desc: 'قرآن وسنة', img: 'https://flagcdn.com/w320/ae.png', url: 'https://l3.itworkscdn.net/smcquranlive/quranradiolive/icecast.audio', code: 'AE', loc: 'الشارقة' },
    { id: 'OM', name: 'إذاعة مسقط', desc: 'مسقط', img: 'https://flagcdn.com/w320/om.png', url: 'https://partrdo.mangomolo.com/quranrdo.mp3', code: 'OM', loc: 'عمان' },
    { id: 'LB', name: 'إذاعة لبنان', desc: 'بيروت', img: 'https://flagcdn.com/w320/lb.png', url: 'https://audio.osina.cloud:7987/stream', code: 'LB', loc: 'لبنان' },
    { id: 'PS', name: 'إذاعة نابلس', desc: 'صوت فلسطين', img: 'https://flagcdn.com/w320/ps.png', url: 'https://quran-radio.org:8080/;', code: 'PS', loc: 'فلسطين' },
    { id: 'PK', name: 'إذاعة باكستان', desc: 'إسلام آباد', img: 'https://flagcdn.com/w320/pk.png', url: 'https://whmsonic.radio.gov.pk:7002/stream/;', code: 'PK', loc: 'باكستان' }
];

const podcastsDB = {
    'prophets': {
        title: 'قصص الأنبياء',
        speaker: 'نبيل العوضي',
        img: 'podcasts/prophets.png',  // تم تعديل الاسم
        episodes: [
            { name: 'قصة آدم عليه السلام', url: 'https://archive.org/download/NabilAl-awadi-QasasAl-anbiya/01-QasasAl-anbiya.mp3' },
            { name: 'قصة نوح عليه السلام', url: 'https://archive.org/download/NabilAl-awadi-QasasAl-anbiya/02-QasasAl-anbiya.mp3' },
            { name: 'قصة هود وصالح', url: 'https://archive.org/download/NabilAl-awadi-QasasAl-anbiya/03-QasasAl-anbiya.mp3' },
            { name: 'قصة إبراهيم عليه السلام', url: 'https://archive.org/download/NabilAl-awadi-QasasAl-anbiya/04-QasasAl-anbiya.mp3' }
        ]
    },
    'seera': {
        title: 'السيرة النبوية',
        speaker: 'راغب السرجاني',
        img: 'podcasts/seera.png', // تم تعديل الاسم
        episodes: [
            { name: 'مولد النبي ﷺ', url: 'https://archive.org/download/Seera_Ragheb_Al-Sergany/01.mp3' },
            { name: 'نشأته وشبابه', url: 'https://archive.org/download/Seera_Ragheb_Al-Sergany/02.mp3' }
        ]
    }
};

let currentPodcastKey = null;

// Visualizer Logic
const visualizer = document.getElementById('visualizer');
for (let i = 0; i < 40; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
    bar.style.height = Math.random() * 100 + '%';
    visualizer.appendChild(bar);
}

// Radio Variables
const audio = document.getElementById('radioPlayer');
const playIcon = document.getElementById('playIcon');
const vinyl = document.getElementById('vinylRecord');
const stationImgEl = document.getElementById('stationImageElement');
const mainCard = document.getElementById('mainPlayerCard');
const playingTag = document.getElementById('playingTag');
let isPlaying = false;

function toggleRadio() {
    if (isPlaying) {
        audio.pause();
        playIcon.className = 'fas fa-play';
        visualizer.style.opacity = '0.3';
    } else {
        if (!audio.src) {
            playStation('https://n02.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABj6Yy_34A7-2i_vJ2aT_4wQ', 'إذاعة القرآن الكريم', 'من القاهرة', '../assets/img/flag/eg.png', null, false);
        } else {
            audio.play();
            playIcon.className = 'fas fa-pause';
            visualizer.style.opacity = '1';
        }
    }
    isPlaying = !isPlaying;
}

// Global State for Fallback
let currentStationUrls = [];
let currentUrlIndex = 0;
let streamTimeout = null;

function playStation(urlOrUrls, name, desc, img, element, isPodcast, playAudio = true) {
    document.getElementById('currentStationName').innerText = name;
    document.getElementById('currentStationDesc').innerText = desc;
    stationImgEl.src = img;

    if (isPodcast) {
        mainCard.classList.add('vip-mode');
        playingTag.innerHTML = '<div class="pulse-dot"></div> بودكاست مميز';
        document.querySelectorAll('.podcast-card').forEach(c => c.classList.remove('active-pod'));
        document.querySelectorAll('.station-card').forEach(c => c.classList.remove('active'));
        if (element) element.classList.add('active-pod');
        document.getElementById('btnRandom').style.display = 'none';
        document.getElementById('btnList').style.display = 'flex';
    } else {
        mainCard.classList.remove('vip-mode');
        playingTag.innerHTML = '<div class="pulse-dot"></div> بث مباشر الآن';
        document.querySelectorAll('.station-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.podcast-card').forEach(c => c.classList.remove('active-pod'));
        if (element) element.classList.add('active');
        document.getElementById('btnList').style.display = 'none';
        document.getElementById('btnRandom').style.display = 'flex';
    }

    // Set up URLs
    if (Array.isArray(urlOrUrls)) {
        currentStationUrls = urlOrUrls;
    } else {
        currentStationUrls = [urlOrUrls];
    }
    currentUrlIndex = 0;

    // Clear any previous timeout
    if (streamTimeout) clearTimeout(streamTimeout);

    // Start playing process
    playCurrentStream(playAudio);
}

function tryNextStream() {
    if (streamTimeout) clearTimeout(streamTimeout);
    currentUrlIndex++;
    if (currentUrlIndex < currentStationUrls.length) {
        console.log("⏭️ Switching to backup stream...");
        playCurrentStream(true);
    } else {
        console.error("❌ No more backup streams available.");
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        visualizer.style.opacity = '0.3';
    }
}

function playCurrentStream(shouldPlay) {
    if (currentUrlIndex >= currentStationUrls.length) {
        console.error("❌ All streams failed.");
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        visualizer.style.opacity = '0.3';
        return;
    }

    const url = currentStationUrls[currentUrlIndex];
    console.log(`📻 Loading stream ${currentUrlIndex + 1}/${currentStationUrls.length}: ${url}`);

    // Clear previous handlers
    audio.onerror = null;
    audio.onplaying = null;
    audio.onstalled = null;
    if (streamTimeout) clearTimeout(streamTimeout);

    audio.src = url;

    // Handle direct errors
    audio.onerror = function (e) {
        console.warn(`❌ Stream error: ${url}`);
        tryNextStream();
    };

    // Handle stalled streams (no data flowing)
    audio.onstalled = function () {
        console.warn(`⚠️ Stream stalled: ${url}`);
        // Give it 5 more seconds after stall before switching
        if (streamTimeout) clearTimeout(streamTimeout);
        streamTimeout = setTimeout(() => {
            console.warn(`⏰ Stall timeout, switching stream...`);
            tryNextStream();
        }, 5000);
    };

    if (shouldPlay) {
        // Set a timeout: if stream doesn't start playing within 10 seconds, try next
        streamTimeout = setTimeout(() => {
            if (!isPlaying || audio.paused) {
                console.warn(`⏰ Stream timeout (10s), trying next: ${url}`);
                tryNextStream();
            }
        }, 10000);

        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Stream started successfully
                audio.onplaying = function () {
                    // Stream is actually playing, cancel timeout
                    if (streamTimeout) clearTimeout(streamTimeout);
                    console.log(`✅ Stream playing: ${url}`);
                };
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
                visualizer.style.opacity = '1';
            })
                .catch(error => {
                    console.warn(`⚠️ Play failed: ${url}`, error.message);
                    tryNextStream();
                });
        }
    } else {
        audio.load();
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
        vinyl.classList.remove('playing');
        visualizer.style.opacity = '0.3';
    }
}

function initPodcast(key) {
    const data = podcastsDB[key];
    if (!data) return;
    currentPodcastKey = key;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playStation(data.episodes[0].url, data.episodes[0].name, data.speaker, data.img, null, true);
    document.getElementById('modalTitle').innerText = data.title;
}

function openEpisodesModal() {
    if (!currentPodcastKey) return;
    const data = podcastsDB[currentPodcastKey];
    const listContainer = document.getElementById('episodesList');
    listContainer.innerHTML = '';

    data.episodes.forEach((ep, index) => {
        const item = document.createElement('div');
        item.className = 'episode-item';
        if (audio.src === ep.url) item.classList.add('active');

        item.innerHTML = `
                    <i class="fas ${audio.src === ep.url ? 'fa-volume-up' : 'fa-play'}"></i>
                    <div class="episode-info">
                        <h4 style="margin:0; font-size:14px;">${ep.name}</h4>
                        <span style="font-size:11px; color:#888;">الحلقة ${index + 1}</span>
                    </div>
                `;

        item.onclick = () => {
            playStation(ep.url, ep.name, data.speaker, data.img, null, true);
            closeEpisodesModal();
        };
        listContainer.appendChild(item);
    });

    document.getElementById('modalTitle').innerText = data.title;
    MobileNav.pushState('episodesModal');
    document.getElementById('episodesModal').classList.add('active');
}

function closeEpisodesModal() {
    document.getElementById('episodesModal').classList.remove('active');
}

function playPrevEp() {
    if (currentPodcastKey) {
        // Podcast Logic: Play previous episode
        const data = podcastsDB[currentPodcastKey];
        if (!data) return;
        const currentUrl = audio.src;
        let idx = data.episodes.findIndex(ep => ep.url === currentUrl);

        if (idx > 0) {
            idx--;
        } else {
            idx = data.episodes.length - 1; // Loop to last
        }

        const ep = data.episodes[idx];
        playStation(ep.url, ep.name, data.speaker, data.img, null, true);

        // Update modal list active state if open
        const episodesModal = document.getElementById('episodesModal');
        if (episodesModal && episodesModal.classList.contains('active')) {
            openEpisodesModal();
        }

    } else {
        // Station Logic: Play previous station in grid
        const allStations = Array.from(document.querySelectorAll('.stations-grid .station-card'));
        const activeIndex = allStations.findIndex(card => card.classList.contains('active'));

        let nextIndex;
        if (activeIndex > 0) {
            nextIndex = activeIndex - 1;
        } else {
            nextIndex = allStations.length - 1; // Loop to last
        }

        if (allStations[nextIndex]) {
            allStations[nextIndex].click();
        }
    }
}

function playNextEp() {
    if (currentPodcastKey) {
        // Podcast Logic: Play next episode
        const data = podcastsDB[currentPodcastKey];
        if (!data) return;
        const currentUrl = audio.src;
        let idx = data.episodes.findIndex(ep => ep.url === currentUrl);

        if (idx !== -1 && idx < data.episodes.length - 1) {
            idx++;
        } else {
            idx = 0; // Loop to first
        }

        const ep = data.episodes[idx];
        playStation(ep.url, ep.name, data.speaker, data.img, null, true);

        // Update modal list active state if open
        const episodesModal = document.getElementById('episodesModal');
        if (episodesModal && episodesModal.classList.contains('active')) {
            openEpisodesModal();
        }

    } else {
        // Station Logic: Play next station in grid
        const allStations = Array.from(document.querySelectorAll('.stations-grid .station-card'));
        const activeIndex = allStations.findIndex(card => card.classList.contains('active'));

        let nextIndex;
        if (activeIndex !== -1 && activeIndex < allStations.length - 1) {
            nextIndex = activeIndex + 1;
        } else {
            nextIndex = 0; // Loop to first
        }

        if (allStations[nextIndex]) {
            allStations[nextIndex].click();
        }
    }
}

// ============ Volume Control Logic (YouTube-style Custom Vertical Slider) ============
function toggleVolumeSlider(e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    const slider = document.getElementById('volumeSlider');
    const isActive = slider.classList.toggle('active');

    if (isActive) {
        setTimeout(() => {
            document.addEventListener('click', closeVolumeOutside);
        }, 0);
    } else {
        document.removeEventListener('click', closeVolumeOutside);
    }
}

function closeVolumeOutside(e) {
    const wrapper = document.querySelector('.volume-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('volumeSlider').classList.remove('active');
        document.removeEventListener('click', closeVolumeOutside);
    }
}

function setVolume(val) {
    val = Math.max(0, Math.min(1, val));
    const audio = document.getElementById('radioPlayer');
    if (audio) audio.volume = val;

    // Update icon
    const icon = document.getElementById('btnVolumeIcon');
    if (icon) {
        if (val == 0) icon.className = 'fas fa-volume-mute';
        else if (val < 0.5) icon.className = 'fas fa-volume-down';
        else icon.className = 'fas fa-volume-up';
    }

    // Update visual slider
    updateVolumeVisual(val);
}

function updateVolumeVisual(val) {
    const fill = document.getElementById('volumeFill');
    const thumb = document.getElementById('volumeThumb');
    if (!fill || !thumb) return;

    // val 1 = top (0%), val 0 = bottom (100%)
    const percent = (1 - val) * 100;
    thumb.style.top = percent + '%';
    fill.style.height = (val * 100) + '%';
}

// Custom Drag Logic for Volume Thumb
(function initVolumeSlider() {
    let isDragging = false;

    function getVolumeFromY(clientY) {
        const track = document.getElementById('volumeTrackContainer');
        if (!track) return 1;
        const rect = track.getBoundingClientRect();
        const y = clientY - rect.top;
        const ratio = y / rect.height;
        return Math.max(0, Math.min(1, 1 - ratio));
    }

    function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setVolume(getVolumeFromY(clientY));
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setVolume(getVolumeFromY(clientY));
    }

    function onDragEnd() {
        isDragging = false;
    }

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', function () {
        const sliderBox = document.getElementById('volumeSlider');

        if (sliderBox) {
            // Start drag from anywhere inside the slider box
            sliderBox.addEventListener('mousedown', onDragStart);
            sliderBox.addEventListener('touchstart', onDragStart, { passive: false });
        }

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);

        // Initialize visual to full volume
        updateVolumeVisual(1);
    });
})();

// Expose functions to window
window.toggleVolumeSlider = toggleVolumeSlider;
window.setVolume = setVolume;
window.playNextEp = playNextEp;
window.playPrevEp = playPrevEp;

async function initPlayerOnLoad() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const geoData = await response.json();
        const countryCode = geoData.country_code || geoData.countryCode;

        const station = globalStationsDB.find(s => s.code === countryCode) || globalStationsDB.find(s => s.id === 'EG');

        // Find the matching card in the HTML and mark it active
        const allCards = document.querySelectorAll('.stations-grid .station-card');
        let matchedCard = null;
        allCards.forEach(card => {
            const h4 = card.querySelector('.station-info h4');
            if (h4 && h4.textContent.includes(station.name.replace('إذاعة ', ''))) {
                matchedCard = card;
            }
        });

        playStation(station.url, station.name, station.desc, station.img, matchedCard, false, false);
    } catch (e) {
        console.log("Location Error, defaulting to Egypt");
        const defaultStation = globalStationsDB.find(s => s.id === 'EG');

        const allCards = document.querySelectorAll('.stations-grid .station-card');
        let matchedCard = null;
        allCards.forEach(card => {
            const h4 = card.querySelector('.station-info h4');
            if (h4 && h4.textContent.includes('القاهرة')) {
                matchedCard = card;
            }
        });

        playStation(defaultStation.url, defaultStation.name, defaultStation.desc, defaultStation.img, matchedCard, false, false);
    }
}

// تم إيقاف كود الـ Supabase هنا لأنه يسبب خطأ TypeError صامت يعطل عمل السكربت 
// بسبب أنه يحاول استدعاء window.supabase قبل أن يتم تحميل الـ Module الموجود في index.html
// const supabaseClient = window.supabase.createClient('https://kstknnfyesrthyjlrlle.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdGtubmZ5ZXNydGh5amxybGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzUyMDksImV4cCI6MjA3OTQ1MTIwOX0.PQRPsv0l9-b7wwwKnnHBJGY6PO0JarcVpihULMOhAeE');

// End of file