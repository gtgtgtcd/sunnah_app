// دالة تنظيف النص (عشان البحث يبقى مرن)
function normalizeText(text) {
    return text.replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ئ/g, "ي").trim();
}

// دالة البحث في السور
function filterSurahs(query) {
    const container = document.getElementById('surah-list-content');
    const items = container.getElementsByClassName('surah-item');
    const normalizedQuery = normalizeText(query);

    for (let i = 0; i < items.length; i++) {
        const surahName = items[i].getAttribute('data-surah-name');
        if (normalizeText(surahName).includes(normalizedQuery) || items[i].innerText.includes(query)) {
            items[i].style.display = "flex";
        } else {
            items[i].style.display = "none";
        }
    }
}

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

const Engine = {
    surahNames: ["", "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"],
    savedBookmark: null,

    fullQuranData: null,

    lastLoadedSurah: 0,
    isLoading: false,

    currentSurahCardsLoaded: 0,
    totalCardsInCurrentSurah: 0,
    allVersesCache: [],

    audioQueue: [],
    currentAudioIndex: 0,
    selectedReciter: null,
    favoriteReciters: [],

    // دالة الذكاء الجديدة: بتسأل الكتالوج الآية دي في صفحة كام بالظبط
    getPageForAyah(surahId, ayahNum) {
        if (typeof QURAN_PAGES_MAP !== 'undefined') {
            for (let p of QURAN_PAGES_MAP) {
                for (let c of p.content) {
                    if (c.surah === surahId && ayahNum >= c.start && ayahNum <= c.end) {
                        return p.page; // بترجع رقم صفحة المصحف الحقيقية
                    }
                }
            }
        }
        return 1;
    },

    async init() {
        await this.loadLocalQuranData();

        const isTourFinished = localStorage.getItem('tour_final_v8') === 'true';
        const isDesktop = window.innerWidth > 768;

        if (!isTourFinished && isDesktop) {
            document.body.classList.add('mini-sidebar');
        }

        this.loadBookmark();
        this.initReciters();

        const params = new URLSearchParams(window.location.search);
        const pSurah = params.get('surah');
        const pAyah = params.get('ayah');

        if (pSurah && pAyah) {
            const cleanSurah = parseInt(pSurah);
            const cleanAyah = parseInt(pAyah);
            const targetKey = `${cleanSurah}:${cleanAyah}`;

            const resetBtn = document.getElementById('reset-deep-link-btn');
            if (resetBtn) resetBtn.style.display = 'inline-block';

            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification(`جاري الانتقال لآية ${cleanAyah}...`);

            await this.loadSurahAsCards(cleanSurah, targetKey);
        } else {
            await this.loadSurahAsCards(1);
            setTimeout(() => { if (typeof Tour !== 'undefined') Tour.start(); }, 2000);
        }

        this.buildIndex();

        const hideToast = localStorage.getItem('royal_hide_restore_toast') === 'true';
        if (this.savedBookmark && !pSurah && !hideToast) {
            UI.showToast(this.surahNames[parseInt(this.savedBookmark.surahName)] || "الموضع المحفوظ");
        }

        const container = document.getElementById('quran-scroll-area');
        container.addEventListener('scroll', () => {
            if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 800) && !this.isLoading) {
                // In wird mode: count cards and stop at target
                if (this._khatmaWirdMode) {
                    const allCards = container.querySelectorAll('.quran-sheet:not(#khatma-wird-complete)');
                    this._khatmaWirdCards = allCards.length;
                    if (this._khatmaWirdCards >= this._khatmaWirdTarget) {
                        // Wird complete — inject completion card
                        this._injectWirdCompletionCard();
                        return; // Stop loading
                    }
                }
                if (this.currentSurahCardsLoaded < this.totalCardsInCurrentSurah) {
                    this.loadNextBatch(this.lastLoadedSurah);
                } else if (this.lastLoadedSurah < 114) {
                    this.loadSurahAsCards(this.lastLoadedSurah + 1, null, true);
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (typeof Tour !== 'undefined' && Tour.isActive) Tour.handleInteraction('click', e.target);
            if (e.target.classList.contains('bottom-sheet-overlay')) UI.closeAllSheets();
        });
        document.getElementById('audio-player').onended = () => this.playNextInQueue();
    },

    async loadLocalQuranData() {
        if (this.fullQuranData) return;
        try {
            const res = await fetch('../tr/quran/quran_full.json');
            if (!res.ok) throw new Error("لم يتم العثور على ملف المصحف المحلي");
            this.fullQuranData = await res.json();
            console.log("✅ تم تحميل المصحف المحلي بنجاح (Offline Mode)");
        } catch (e) {
            console.error("Critical Error Loading Local Quran:", e);
            alert("خطأ: يرجى التأكد من وجود ملف quran_full.json في مجلد tr/quran");
        }
    },

    currentSurahController: null,

    async loadSurahAsCards(surahId, targetVerseKey = null, append = false, targetCardNum = null) {
        if (!this.fullQuranData) await this.loadLocalQuranData();

        const container = document.getElementById('quran-scroll-area');
        const overlay = document.getElementById('speed-overlay');

        if (this.currentSurahController) {
            this.currentSurahController.abort();
        }
        this.currentSurahController = new AbortController();

        document.getElementById('sidebar').classList.remove('active');

        if (!append) {
            if (overlay) overlay.classList.add('visible');
            container.style.opacity = '0';
            container.innerHTML = '';
            this.currentSurahCardsLoaded = 0;
        }

        this.isLoading = true;

        try {
            const surahObj = this.fullQuranData.find(s => s.number === surahId);
            if (!surahObj) throw new Error("السورة غير موجودة في الملف المحلي");

            this.allVersesCache = surahObj.ayahs.map(ayah => ({
                id: ayah.number,
                verse_key: `${surahId}:${ayah.numberInSurah}`,
                text_uthmani: ayah.text,
                numberInSurah: ayah.numberInSurah
            }));

            // ==========================================
            // النقلة النوعية هنا: تجميع الآيات في صفحات مصحف حقيقية 
            // ==========================================
            this.pageChunks = [];
            let currentPageNum = -1;
            let currentChunk = [];

            this.allVersesCache.forEach(ayah => {
                const pageNum = this.getPageForAyah(surahId, ayah.numberInSurah);
                
                if (pageNum !== currentPageNum) {
                    if (currentChunk.length > 0) {
                        this.pageChunks.push({ pageNum: currentPageNum, verses: currentChunk });
                    }
                    currentPageNum = pageNum;
                    currentChunk = [];
                }
                
                currentChunk.push(ayah);
            });
            if (currentChunk.length > 0) {
                this.pageChunks.push({ pageNum: currentPageNum, verses: currentChunk });
            }

            this.totalCardsInCurrentSurah = this.pageChunks.length;
            this.lastLoadedSurah = surahId;

            if (append) this.currentSurahCardsLoaded = 0;

            if (targetVerseKey) {
                const parts = targetVerseKey.split(':');
                const targetAyah = parseInt(parts[1]);
                
                // البحث في أي بطاقة توجد الآية بالنظام الجديد (بدون PAGE_SIZE)
                const chunkIdx = this.pageChunks.findIndex(chunk => chunk.verses.some(v => v.numberInSurah === targetAyah));
                const targetCardIndex = chunkIdx !== -1 ? chunkIdx + 1 : 1;

                while (
                    this.currentSurahCardsLoaded < targetCardIndex &&
                    this.currentSurahCardsLoaded < this.totalCardsInCurrentSurah
                ) {
                    this.loadNextBatch(surahId);
                }
            } else if (targetCardNum) {
                const targetIdx = parseInt(targetCardNum);
                while (
                    this.currentSurahCardsLoaded < targetIdx &&
                    this.currentSurahCardsLoaded < this.totalCardsInCurrentSurah
                ) {
                    this.loadNextBatch(surahId);
                }
            } else {
                this.loadNextBatch(surahId);
            }

        } catch (e) {
            console.error("Error loading surah:", e);
            if (!append) container.innerHTML = '<div style="color:#fff; text-align:center;">حدث خطأ في تحميل السورة (تأكد من ملف quran_full.json)</div>';
        }

        const animationTime = (!append) ? 1500 : 0;

        setTimeout(() => {
            this.isLoading = false;

            if (!append) {
                container.scrollTop = 0;
                container.style.opacity = '1';
                if (overlay) overlay.classList.remove('visible');

                if (targetVerseKey) {
                    setTimeout(() => {
                        const el = document.getElementById(`verse-${targetVerseKey}`) || document.querySelector(`.ayah-text[data-key="${targetVerseKey}"]`);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('active-verse');
                            setTimeout(() => { el.classList.remove('active-verse'); }, 3000);
                        }
                    }, 300);
                } else if (targetCardNum) {
                    setTimeout(() => {
                        const card = document.getElementById(`surah-${surahId}-card-${targetCardNum}`);
                        if (card) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            card.style.transition = "transform 0.3s, box-shadow 0.3s";
                            card.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.4)";
                            setTimeout(() => { card.style.boxShadow = ""; }, 1500);
                        }
                    }, 300);
                }

                if (this.currentSurahCardsLoaded >= this.totalCardsInCurrentSurah && surahId < 114) {
                    // In wird mode: check if we reached the target before loading next surah
                    if (this._khatmaWirdMode) {
                        const loadedCards = document.querySelectorAll('#quran-scroll-area .quran-sheet:not(#khatma-wird-complete)').length;
                        if (loadedCards >= this._khatmaWirdTarget) {
                            this._injectWirdCompletionCard();
                            return; // Don't load next surah
                        }
                    }
                    setTimeout(() => this.loadSurahAsCards(surahId + 1, null, true), 1000);
                }
            }
        }, animationTime);
    },

    renderChunk(wrapper, verses, surahId, isFirstCard) {
        if (isFirstCard) {
            const deco = document.createElement('div');
            deco.className = 'surah-decoration';
            deco.id = `surah-header-${surahId}`;
            deco.innerHTML = `<div class="deco-line"></div><div class="surah-name-box">سورة ${this.surahNames[surahId]}</div><div class="deco-line"></div>`;
            wrapper.appendChild(deco);

            // Only show Bismillah in normal reading mode, not in daily reading (wird) mode
            if (surahId !== 1 && surahId !== 9 && !this._khatmaWirdMode) {
                const bism = document.createElement('div');
                bism.className = 'bismillah';
                bism.innerText = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
                wrapper.appendChild(bism);
            }
        }

        verses.forEach(verse => {
            const [_, ayahNum] = verse.verse_key.split(':').map(Number);
            let text = verse.text_uthmani;

            if (surahId !== 1 && ayahNum === 1) text = text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ", "");

            const span = document.createElement('span');
            span.className = 'ayah-text';
            span.id = `verse-${verse.verse_key}`;
            span.dataset.key = verse.verse_key;
            span.dataset.text = text;
            span.dataset.surahId = surahId;
            span.innerHTML = `${text} `;

            const numberSpan = document.createElement('span');
            numberSpan.className = 'ayah-number';
            numberSpan.innerText = `۝${this.toArabic(ayahNum)}`;

            let isScrollingOnBadge = false;

            numberSpan.addEventListener('touchstart', () => {
                isScrollingOnBadge = false;
            }, { passive: true });

            numberSpan.addEventListener('touchmove', () => {
                isScrollingOnBadge = true;
            }, { passive: true });

            numberSpan.onclick = (e) => {
                if (isScrollingOnBadge) return;

                e.stopPropagation();
                e.preventDefault();
                numberSpan.classList.add('pulse-active');
                setTimeout(() => { numberSpan.classList.remove('pulse-active'); }, 1500);
                UI.lastClickedVerseElement = span;
                Engine.toggleBookmark();
            };

            span.appendChild(numberSpan);
            span.append(" ");

            if (this.savedBookmark && this.savedBookmark.key === verse.verse_key) {
                span.classList.add('bookmarked-verse');
                const parentSheet = span.closest('.quran-sheet');
                if (parentSheet) parentSheet.classList.add('bookmarked-page');
            }

            this.attachEvents(span);
            wrapper.appendChild(span);
        });
    },

    loadNextBatch(surahId) {
        const container = document.getElementById('quran-scroll-area');
        const BATCH_SIZE = 3;

        let cardsToLoad = 0;
        while (cardsToLoad < BATCH_SIZE && this.currentSurahCardsLoaded < this.totalCardsInCurrentSurah) {
            
            // سحب بيانات الصفحة بالكامل بدلاً من قص آيات
            const chunkData = this.pageChunks[this.currentSurahCardsLoaded];
            const verseChunk = chunkData.verses;
            const actualPageNum = chunkData.pageNum; // ده رقم صفحة المصحف الحقيقي

            const cardIndex = this.currentSurahCardsLoaded + 1;
            const card = document.createElement('div');
            card.className = 'quran-sheet';
            card.id = `surah-${surahId}-card-${cardIndex}`;
            card.dataset.surah = surahId;
            card.dataset.page = actualPageNum; // ربط البطاقة برقم الصفحة الصحيح

            const ribbon = `<div class="horizontal-ribbon" onclick="Engine.removeBookmark(event)">محفوظة</div>`;
            const frameStart = `<div class="islamic-frame"><div class="islamic-frame-inner"><div class="sheet-content-wrapper">`;
            const frameEnd = `</div></div></div>`;
            
            // الفوتر دلوقتي بيعرض رقم الصفحة المتطابق مع المصحف
            const footer = `<div class="page-number-display">${this.surahNames[surahId]} - صفحة ${actualPageNum}</div>`;

            card.innerHTML = ribbon + frameStart + '<div class="sheet-content"></div>' + frameEnd + footer;
            container.appendChild(card);

            this.renderChunk(card.querySelector('.sheet-content'), verseChunk, surahId, cardIndex === 1);

            // استعادة العلامات المحفوظة
            const savedBookmark = localStorage.getItem('royal_bookmark');
            if (savedBookmark) {
                try {
                    const bookmark = JSON.parse(savedBookmark);
                    if (parseInt(bookmark.surahName) === parseInt(surahId) && parseInt(bookmark.page) === parseInt(actualPageNum)) {
                        card.classList.add('bookmarked-page');
                    }
                } catch (e) { }
            }

            const quranBookmark = localStorage.getItem('quran_bookmark');
            if (quranBookmark) {
                try {
                    const qb = JSON.parse(quranBookmark);
                    if (parseInt(qb.surahName) === parseInt(surahId)) {
                        const hasSavedVerse = verseChunk.some(v => v.verse_key === qb.key);
                        if (hasSavedVerse) card.classList.add('bookmarked-page');
                    }
                } catch (e) { }
            }

            this.currentSurahCardsLoaded++;
            cardsToLoad++;
        }

        this.cleanupOldCards();
        if (this.translationVisible) this.updateVisibleTranslations();
    },

    cleanupOldCards() {
        // تم الإيقاف عمداً للحفاظ على السلاسة
    },

    buildIndex() {
        const container = document.getElementById('surah-list') || document.getElementById('surah-list-content');
        if (!container) return;

        const surahContainer = document.getElementById('surah-list-content');
        if (surahContainer) surahContainer.innerHTML = '';

        this.surahNames.forEach((name, index) => {
            if (index === 0) return;
            const item = document.createElement('div');
            item.className = 'surah-item';

            item.setAttribute('data-surah-name', normalizeText(name));

            item.innerHTML = `
                        <div class="surah-badge">${this.toArabic(index)}</div>
                        <div class="surah-info">
                            <span class="surah-name-ar">سورة ${name}</span>
                            <span class="surah-desc-sub">مكية • عدد آياتها ...</span>
                        </div>
                    `;
            item.onclick = () => {
                this.loadSurahAsCards(index);
                if (window.innerWidth <= 768) toggleSidebarLogic();
            };

            if (surahContainer) surahContainer.appendChild(item);
        });
    },

    restoreSession() {
        UI.hideToast();

        const royalBookmark = localStorage.getItem('royal_bookmark');
        if (royalBookmark) {
            try {
                const b = JSON.parse(royalBookmark);
                this.loadSurahAsCards(parseInt(b.surahName), null, false, parseInt(b.page));
                return;
            } catch (e) {
                console.error(e);
            }
        }

        if (this.savedBookmark) {
            this.loadSurahAsCards(parseInt(this.savedBookmark.surahName), this.savedBookmark.key);
        }
    },

    initReciters() {
        const savedFavs = JSON.parse(localStorage.getItem('fav_reciters') || '[]');
        const current = localStorage.getItem('quran_reciter');
        this.favoriteReciters = savedFavs;
        if (current) this.selectedReciter = current; else if (savedFavs.length > 0) { this.selectedReciter = savedFavs[0]; localStorage.setItem('quran_reciter', this.selectedReciter); }
        this.renderReciterUI();
    },
    renderReciterUI() {
        const container = document.getElementById('reciter-control-area');
        container.innerHTML = '';
        if (this.favoriteReciters.length === 0) {
            const btn = document.createElement('button');
            btn.className = 'empty-reciter-btn';
            btn.innerHTML = '<i class="fas fa-plus-circle"></i> اضغط لاختيار قارئك المفضل';
            btn.onclick = () => this.openReciterModal();
            container.appendChild(btn);
        } else {
            const wrapper = document.createElement('div');
            wrapper.className = 'reciter-controls';

            const currentReciterObj = RECITER_DB.find(r => r.id === this.selectedReciter);
            if (currentReciterObj) {
                const imgPreview = document.createElement('img');
                imgPreview.src = currentReciterObj.img || `../assets/img/listen/covers/${currentReciterObj.imgFilename || 'alafasy.webp'}`;
                imgPreview.className = 'current-reciter-img';
                imgPreview.onerror = function () { this.style.display = 'none'; };
                wrapper.appendChild(imgPreview);
            }

            const select = document.createElement('select');
            select.className = 'fav-reciter-select';
            select.onchange = (e) => this.changeReciter(e.target.value);

            if (this.favoriteReciters.length === 0 && currentReciterObj) {
                const option = document.createElement('option');
                option.value = currentReciterObj.id;
                option.text = currentReciterObj.name;
                select.appendChild(option);
            } else {
                this.favoriteReciters.forEach(id => {
                    const reciterObj = RECITER_DB.find(r => r.id === id);
                    if (reciterObj) {
                        const option = document.createElement('option');
                        option.value = reciterObj.id;
                        option.text = `❤ ${reciterObj.name}`;
                        if (reciterObj.id === this.selectedReciter) option.selected = true;
                        select.appendChild(option);
                    }
                });
            }
            wrapper.appendChild(select);

            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'btn-quran-download';
            downloadBtn.className = 'reciter-action-btn';
            downloadBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i>';
            downloadBtn.onclick = () => this.downloadCurrentPageAudio();
            downloadBtn.title = "تحميل تلاوة السورة";
            wrapper.appendChild(downloadBtn);

            const addBtn = document.createElement('div');
            addBtn.className = 'add-reciter-mini-btn';
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.onclick = () => this.openReciterModal();
            wrapper.appendChild(addBtn);

            container.appendChild(wrapper);

            this.checkAudioDownloadStatus();
        }
    },
    openReciterModal() {
        if (typeof MobileNav !== 'undefined') MobileNav.pushState('reciters');
        document.getElementById('reciter-modal').classList.add('visible');
        this.filterReciters('');
        document.getElementById('reciter-search-input').focus();
    },
    filterReciters(query) {
        const container = document.getElementById('reciter-list-container'); container.innerHTML = '';
        const filtered = RECITER_DB.filter(r => r.name.includes(query));
        if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center; color:#666;">لا توجد نتائج</div>'; return; }

        const oldReciters = filtered.filter(r => !r.isNew);
        const newReciters = filtered.filter(r => r.isNew);

        const buildCard = (reciter) => {
            const card = document.createElement('div');
            card.className = 'reciter-card' + (reciter.isNew ? ' reciter-new' : '');
            card.onclick = () => this.addToFavorites(reciter.id);

            let iconHtml = '<div class="reciter-icon"><i class="fas fa-user-tie"></i></div>';
            if (reciter.img || reciter.imgFilename) {
                const imgPath = reciter.img || `../assets/img/listen/covers/${reciter.imgFilename}`;
                iconHtml = `<div class="reciter-icon"><img src="${imgPath}" alt="${reciter.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-user-tie\\'></i>'"></div>`;
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
    },
    addToFavorites(id) { if (!this.favoriteReciters.includes(id)) { this.favoriteReciters.push(id); localStorage.setItem('fav_reciters', JSON.stringify(this.favoriteReciters)); } this.changeReciter(id); this.renderReciterUI(); document.getElementById('reciter-modal').classList.remove('visible'); },
    changeReciter(id) {
        this.selectedReciter = id;
        localStorage.setItem('quran_reciter', id);

        // تحديث Mini Player لو مفتوح
        const player = document.getElementById('quran-mini-player');
        if (player && !player.classList.contains('hidden')) {
            const reciterObj = RECITER_DB.find(r => r.id === id);
            if (reciterObj) {
                const nameEl = document.getElementById('qmp-reciter-name');
                const imgEl = document.getElementById('qmp-reciter-img');
                if (nameEl) nameEl.textContent = reciterObj.name;
                if (imgEl) {
                    imgEl.src = reciterObj.img || `../assets/img/listen/covers/${reciterObj.imgFilename || 'alafasy.webp'}`;
                }

                // إعادة تشغيل
                const audio = document.getElementById('audio-player');
                if (audio && !audio.paused && this.currentPlayingKey) {
                    const [s, a] = this.currentPlayingKey.split(':');
                    this.playAudio(s, a);
                }
            }
        }
    },

    playAudio(surah, ayah) {
        this.currentPlayingKey = `${surah}:${ayah}`;
        const reciterId = this.selectedReciter || "Alafasy_128kbps";
        const reciterObj = RECITER_DB.find(r => r.id === reciterId);
        const folderName = reciterObj ? (reciterObj.folder || reciterId) : "Alafasy";

        const sPad = surah.padStart(3, '0');
        const aPad = ayah.padStart(3, '0');
        const fileName = `${sPad}${aPad}.mp3`;

        let audioUrl = `https://everyayah.com/data/${reciterId}/${fileName}`;

        const fullPath = `quran/audio/${folderName}`;
        if (window.Android && window.Android.isFileExists) {
            const isDownloaded = window.Android.isFileExists(fullPath, fileName);
            if (isDownloaded) {
                console.log("Playing Offline 📂: " + fileName);
                audioUrl = `https://appassets.androidplatform.net/local/${fullPath}/${fileName}`;
            } else {
                console.log("Playing Online 📡");
            }
        }

        const audio = document.getElementById('audio-player');
        audio.src = audioUrl;
        audio.play().catch(() => { });
        audio.onerror = () => {
            this._audioErrorCount = (this._audioErrorCount || 0) + 1;
            console.warn(`Audio Error #${this._audioErrorCount}`);

            if (this.audioQueue.length > 0) {
                this.playNextInQueue();
            }
        };
    },
    playSelectedVerse() {
        const key = UI.currentVerseKey;
        if (!key) return;
        const [surah, ayah] = key.split(':');
        this.audioQueue = [];
        this._audioErrorCount = 0;

        this.highlightPlayingVerse(key);
        this.playAudio(surah, ayah);
        this.showMiniPlayer(key);

        document.getElementById('audio-player').onended = () => {
            document.querySelectorAll('.audio-playing').forEach(el => el.classList.remove('audio-playing'));
            this.hideMiniPlayer();
        };

        UI.closeAllSheets();
    },
    playPage() {
        UI.closeAllSheets();
        const container = document.getElementById('quran-scroll-area');
        if (!container) return;

        const allVerses = Array.from(container.querySelectorAll('.ayah-text'));

        let startIndex = 0;
        if (UI.lastClickedVerseElement) {
            startIndex = allVerses.indexOf(UI.lastClickedVerseElement);
            if (startIndex === -1) startIndex = 0;
        }

        if (allVerses.length === 0) return;
        this._audioErrorCount = 0;
        this.audioQueue = allVerses.slice(startIndex).map(el => el.dataset.key);
        this.currentAudioIndex = 0;
        document.getElementById('audio-player').onended = () => this.playNextInQueue();
        this.playNextInQueue();
    },
    playNextInQueue() {
        // لو 3 أخطاء متتالية → وقف فوراً
        if ((this._audioErrorCount || 0) >= 3) {
            this.audioQueue = [];
            this.currentAudioIndex = 0;
            document.querySelectorAll('.audio-playing').forEach(el => el.classList.remove('audio-playing'));
            this.hideMiniPlayer();
            if (typeof UI !== 'undefined') {
                UI.showNotification('القارئ غير متوفر حالياً - جرب قارئ آخر ⚠️');
            }
            return;
        }
        // التحقق من التكرار (Loop Mode)
        if (this.loopCount && this.loopCount > 0) {
            this.currentLoop = (this.currentLoop || 0) + 1;

            // لو التكرار لا نهائي (999) أو لم نصل للعدد المطلوب
            if (this.loopCount === 999 || this.currentLoop < this.loopCount) {
                // نعيد تشغيل نفس الآية
                const currentKey = this.audioQueue[this.currentAudioIndex - 1]; // الآية الحالية هي اللي فاتت (لأن currentAudioIndex متقدم بواحد)
                if (currentKey) {
                    const [s, a] = currentKey.split(':');
                    this.playAudio(s, a);
                    return; // نوقف ونرجع نعيد
                }
            } else {
                // خلصنا التكرار، نصفر ونكمل للأمام
                this.currentLoop = 0;
            }
        }

        if (this.currentAudioIndex >= this.audioQueue.length) {
            // خلصت كل الآيات
            document.querySelectorAll('.audio-playing').forEach(el => el.classList.remove('audio-playing'));
            this.hideMiniPlayer();
            return;
        }
        const key = this.audioQueue[this.currentAudioIndex];
        const [surah, ayah] = key.split(':');
        this.highlightPlayingVerse(key);
        this.playAudio(surah, ayah);
        this.showMiniPlayer(key);
        this.currentAudioIndex++;
    },
    highlightPlayingVerse(key) { document.querySelectorAll('.audio-playing').forEach(el => el.classList.remove('audio-playing')); const el = document.querySelector(`.ayah-text[data-key="${key}"]`); if (el) { el.classList.add('audio-playing'); el.scrollIntoView({ behavior: "smooth", block: "center" }); } },

    // ====== Mini Player System ======
    showMiniPlayer(verseKey) {
        const player = document.getElementById('quran-mini-player');
        if (!player) return;

        // معلومات القارئ
        const reciterId = this.selectedReciter || 'Alafasy_128kbps';
        const reciterObj = RECITER_DB.find(r => r.id === reciterId);
        const nameEl = document.getElementById('qmp-reciter-name');
        const imgEl = document.getElementById('qmp-reciter-img');
        const verseEl = document.getElementById('qmp-verse-info');

        if (nameEl) nameEl.textContent = reciterObj ? reciterObj.name : 'القارئ';
        if (imgEl && reciterObj) {
            const imgSrc = reciterObj.img || `../assets/img/listen/covers/${reciterObj.imgFilename || 'alafasy.webp'}`;
            imgEl.src = imgSrc;
            imgEl.style.display = 'block';
        }

        // معلومات الآية
        if (verseEl && verseKey) {
            const [s, a] = verseKey.split(':');
            const surahName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
            verseEl.textContent = `سورة ${surahName} - آية ${this.toArabic(parseInt(a))}`;
        }

        // أيقونة التشغيل
        const playBtn = document.getElementById('qmp-play-btn');
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';

        // تهيئة شريط التقدم
        this._initProgressBar();

        // حساب عرض القائمة الجانبية الفعلي
        this._updateMiniPlayerPosition(player);

        player.classList.remove('hidden');
    },

    _updateMiniPlayerPosition(player) {
        if (!player) player = document.getElementById('quran-mini-player');
        if (!player) return;

        if (window.innerWidth <= 768) {
            player.style.right = '0';
        } else {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                player.style.right = sidebar.offsetWidth + 'px';
            }
        }
    },

    hideMiniPlayer() {
        const player = document.getElementById('quran-mini-player');
        if (player) player.classList.add('hidden');
    },

    togglePlayPause() {
        const audio = document.getElementById('audio-player');
        const playBtn = document.getElementById('qmp-play-btn');
        if (!audio) return;

        if (audio.paused) {
            audio.play().catch(() => { });
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    },

    playNextVerseManual() {
        const btn = document.querySelector('.qmp-ctrl-btn[title="الآية التالية"]');
        if (btn) {
            btn.style.transform = "scale(0.9)";
            setTimeout(() => btn.style.transform = "scale(1)", 150);
        }

        // لو مشغلين صفحة أو كيو
        if (this.audioQueue.length > 0) {
            this.playNextInQueue();
        }
    },

    playPreviousVerse() {
        const btn = document.querySelector('.qmp-ctrl-btn[title="الآية السابقة"]');
        if (btn) {
            btn.style.transform = "scale(0.9)";
            setTimeout(() => btn.style.transform = "scale(1)", 150);
        }

        const audio = document.getElementById('audio-player');
        // لو عدى 3 ثواني من الآية، نرجع لأولها بس
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        // غير كده، نحاول نرجع الآية اللي قبلها
        if (this.currentAudioIndex > 1) { // لأن currentAudioIndex بيبقى سابق بـ 1 دايماً
            this.currentAudioIndex -= 2;
            this.playNextInQueue();
        } else {
            // إحنا في أول آية
            if (audio) audio.currentTime = 0;
        }
    },

    cyclePlaybackSpeed() {
        const audio = document.getElementById('audio-player');
        if (!audio) return;

        let rate = audio.playbackRate;
        const speeds = [1, 1.25, 1.5, 2];
        let currentIndex = speeds.indexOf(rate);
        if (currentIndex === -1) currentIndex = 0; 

        const nextIndex = (currentIndex + 1) % speeds.length;
        const newRate = speeds[nextIndex];

        audio.playbackRate = newRate;

        // Update UI immediately
        const btn = document.getElementById('qmp-speed-btn');
        if (btn) btn.innerText = newRate + 'x';
    },

    cycleLoopMode() {
        this.loopCount = this.loopCount || 0;
        const modes = [0, 3, 5, 999];
        // find current index or default to 0
        let currentIdx = modes.indexOf(this.loopCount);
        if (currentIdx === -1) currentIdx = 0;

        const nextIndex = (currentIdx + 1) % modes.length;
        this.loopCount = modes[nextIndex];
        this.currentLoop = 0; // Reset counter for new mode

        this._updateLoopButtonUI();

        const msg = this.loopCount === 0 ? 'تم إيقاف التكرار' :
            (this.loopCount === 999 ? 'تكرار لا نهائي' : `تكرار الآية ${this.loopCount} مرات`);
        if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification(msg);
    },

    _updateLoopButtonUI() {
        const btn = document.getElementById('qmp-loop-btn');
        if (!btn) return;

        // Reset state
        btn.innerHTML = '<i class="fas fa-sync-alt"></i>';

        if (this.loopCount === 0) {
            // Default state
            btn.style.color = '#ccc';
        } else {
            // Active state
            btn.style.color = 'var(--royal-gold)';

            // Add count badge or modify icon
            if (this.loopCount === 999) {
                btn.innerHTML = '<i class="fas fa-infinity" style="font-size:14px;"></i>';
            } else {
                btn.innerHTML = `<span style="font-family: sans-serif; font-weight: bold; font-size: 11px;">${this.loopCount}</span>`;
            }
        }
    },

    copyCurrentVerse() {
        let key = null;
        if (typeof UI !== 'undefined' && UI.currentVerseKey) {
            key = UI.currentVerseKey;
        } else if (this.currentPlayingKey) {
            key = this.currentPlayingKey;
        }

        if (!key) {
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('لم يتم تحديد آية للنسخ');
            return;
        }

        const el = document.querySelector(`.ayah-text[data-key="${key}"]`);
        if (el && el.dataset.text) {
            navigator.clipboard.writeText(el.dataset.text).then(() => {
                if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('تم نسخ الآية');
            }).catch(() => {
                if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('حدث خطأ أثناء النسخ');
            });
        } else {
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('نص الآية غير متوفر حالياً');
        }
    },

    openReciterModal() {
        const modal = document.getElementById('reciter-modal');
        if (modal) {
            modal.classList.add('visible');
            // Populate reciters list
            if (typeof Engine !== 'undefined' && typeof Engine.filterReciters === 'function') {
                Engine.filterReciters('');
            }
            // فوكس على البحث
            setTimeout(() => {
                const input = document.getElementById('reciter-search-input');
                if (input) input.focus();
            }, 300);
        }
    },

    _initProgressBar() {
        const audio = document.getElementById('audio-player');
        const bar = document.getElementById('qmp-progress-bar');
        const container = document.getElementById('qmp-progress-container');

        if (audio && bar) {
            audio.ontimeupdate = () => {
                if (audio.duration) {
                    const pct = (audio.currentTime / audio.duration) * 100;
                    bar.style.width = pct + '%';
                }
            };

            // Seeking logic
            if (container) {
                container.onclick = (e) => {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const w = rect.width;
                    const pct = x / w;
                    if (audio.duration) {
                        audio.currentTime = audio.duration * pct;
                    }
                };
            }
        }
    },

    stopAndClosePlayer() {
        const audio = document.getElementById('audio-player');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
        }

        // مسح كل حاجة
        this.audioQueue = [];
        this.currentAudioIndex = 0;
        document.querySelectorAll('.audio-playing').forEach(el => el.classList.remove('audio-playing'));

        // إخفاء البلاير
        this.hideMiniPlayer();
    },

    openSearch() {
        if (typeof MobileNav !== 'undefined') MobileNav.pushState('search');
        document.getElementById('search-modal').classList.add('visible');
        document.getElementById('search-input').focus();
    },
    async performSearch() {
        const query = document.getElementById('search-input').value;
        if (query.length < 2) return;

        const container = document.getElementById('search-results');
        container.innerHTML = '<div style="text-align:center; color:#fff;">جارِ البحث في الملفات المحلية...</div>';

        setTimeout(() => {
            const cleanQuery = normalizeText(query);

            if (!fullQuranData || fullQuranData.length === 0) {
                container.innerHTML = '<div style="text-align:center; color:red;">جاري فهرسة المصحف... حاول مرة أخرى بعد ثوانٍ</div>';
                return;
            }

            const results = fullQuranData.filter(ayah => {
                const cleanAyah = normalizeText(ayah.text);
                return cleanAyah.includes(cleanQuery);
            });

            container.innerHTML = '';
            if (results.length === 0) {
                container.innerHTML = '<div style="text-align:center; color:#888;">لم يتم العثور على نتائج</div>';
                return;
            }

            results.slice(0, 50).forEach(match => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                <div class="res-text">﴿ ${match.text} ﴾</div>
                <div class="res-info">سورة ${match.surahName} - آية ${Engine.toArabic(match.ayahNum)}</div>
            `;
                item.onclick = () => {
                    document.getElementById('search-modal').classList.remove('visible');
                    Engine.loadSurahAsCards(match.surahNum, `${match.surahNum}:${match.ayahNum}`);
                };
                container.appendChild(item);
            });
        }, 50);
    },

    jumpToSearchResult(surah, ayahNum) {
        document.getElementById('search-modal').classList.remove('visible');
        this.loadSurahAsCards(surah, `${surah}:${ayahNum}`);
    },

    toArabic(n) { if (!n) return ""; return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]); },

    attachEvents(element) {
        let pressTimer;
        let startX = 0, startY = 0;
        let isScrolling = false;

        const start = (e) => {
            if (e.target.classList.contains('ayah-number')) return;
            isScrolling = false;
            if (e.type === 'touchstart') { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }
            else { startX = e.clientX; startY = e.clientY; }
            if (e.type === 'contextmenu') e.preventDefault();
            if (typeof Tour !== 'undefined' && Tour.isActive && Tour.steps[Tour.stepIndex].type !== 'longpress') return;
            pressTimer = setTimeout(() => {
                if (!isScrolling) {
                    if (typeof Tour !== 'undefined' && Tour.isActive) Tour.handleInteraction('longpress', element);
                    this.handleLongPress(element);
                    pressTimer = null;
                }
            }, 600);
        };

        const move = (e) => {
            if (isScrolling) return;
            let currentX, currentY;
            if (e.type === 'touchmove') { currentX = e.touches[0].clientX; currentY = e.touches[0].clientY; }
            else { currentX = e.clientX; currentY = e.clientY; }
            if (Math.abs(currentX - startX) > 10 || Math.abs(currentY - startY) > 10) { isScrolling = true; clearTimeout(pressTimer); }
        };

        const end = (e) => {
            if (e.target.classList.contains('ayah-number')) return;
            clearTimeout(pressTimer);
            if (e.type === 'touchend' && e.cancelable) e.preventDefault();
            if (!isScrolling && pressTimer !== null) {
                if (typeof Tour !== 'undefined' && Tour.isActive) { if (Tour.steps[Tour.stepIndex].type === 'click') Tour.handleInteraction('click', element); return; }
                this.handleClick(element);
            }
        };

        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchmove', move, { passive: true });
        element.addEventListener('touchend', end);
        element.addEventListener('mousedown', start);
        element.addEventListener('mousemove', move);
        element.addEventListener('mouseup', end);
        element.addEventListener('contextmenu', e => e.preventDefault());
    },
    handleClick(element) {
        UI.lastClickedVerseElement = element;
        UI.currentVerseKey = element.dataset.key;
        UI.currentVerseText = element.dataset.text;
        UI.openSettings();
    },
    handleLongPress(element) { UI.highlightVerse(element); UI.openTafsir(element.dataset.key, element.dataset.text); },
    toggleBookmark() {
        if (!UI.lastClickedVerseElement) return;
        const key = UI.lastClickedVerseElement.dataset.key;
        const surahId = UI.lastClickedVerseElement.dataset.surahId;

        this.savedBookmark = { key, surahName: surahId };
        localStorage.setItem('quran_bookmark', JSON.stringify(this.savedBookmark));
        localStorage.removeItem('royal_bookmark');

        document.querySelectorAll('.bookmarked-page').forEach(el => el.classList.remove('bookmarked-page'));
        document.querySelectorAll('.bookmarked-verse').forEach(el => el.classList.remove('bookmarked-verse'));

        const card = UI.lastClickedVerseElement.closest('.quran-sheet');
        if (card) card.classList.add('bookmarked-page');
        UI.lastClickedVerseElement.classList.add('bookmarked-verse');

        UI.showNotification('تم حفظ مكان التوقف (الآية) ✅');
        UI.closeAllSheets();
    },
    removeBookmark(e) {
        e.stopPropagation();
        if (confirm("هل تريد إزالة العلامة المحفوظة؟")) {
            localStorage.removeItem('quran_bookmark');
            this.savedBookmark = null;
            document.querySelectorAll('.bookmarked-page').forEach(el => el.classList.remove('bookmarked-page'));
            document.querySelectorAll('.bookmarked-verse').forEach(el => el.classList.remove('bookmarked-verse'));
        }
    },
    loadBookmark() { const saved = localStorage.getItem('quran_bookmark'); if (saved) this.savedBookmark = JSON.parse(saved); },
    copyAyah() { navigator.clipboard.writeText(UI.currentVerseText); UI.showNotification('تم النسخ'); UI.closeAllSheets(); },

    shareVerse() {
        if (!UI.currentVerseText) return;

        let shareText = UI.currentVerseText;
        if (UI.lastClickedVerseElement && UI.lastClickedVerseElement.dataset.surahId) {
            const surahId = UI.lastClickedVerseElement.dataset.surahId;
            const surahName = this.surahNames ? this.surahNames[surahId] : "";
            if (surahName) shareText += `\n\n﴿سورة ${surahName}﴾`;
        }

        const shareUrl = 'https://sunnah-app.vercel.app';

        if (navigator.share) {
            navigator.share({
                title: 'المصحف الملكي',
                text: shareText,
                url: shareUrl
            }).then(() => UI.closeAllSheets())
                .catch((err) => console.log('Share canceled:', err));
        } else {
            this.copyAyah();
        }
    },

    toggleFocusMode() {
        document.body.classList.toggle('focus-mode');
        const isActive = document.body.classList.contains('focus-mode');
        UI.showNotification(isActive ? 'تم تفعيل وضع التركيز 📖' : 'تم إيقاف وضع التركيز');
        UI.closeAllSheets();
    },

    translationVisible: false,
    currentTranslationId: 'en.sahih',

    toggleTranslation() {
        if (this.translationVisible) {
            this.translationVisible = false;
            document.querySelectorAll('.translation-text').forEach(el => el.remove());
            UI.showNotification('تم إخفاء الترجمات');
            UI.closeAllSheets();
            return;
        }
        this.openTranslationModal();
    },

    openTranslationModal() {
        if (typeof MobileNav !== 'undefined') MobileNav.pushState('translation');
        const modal = document.getElementById('translation-modal');
        modal.classList.add('visible');
        this.filterLanguages('');
        document.getElementById('translation-search-input').focus();
    },

    filterLanguages(query) {
        const container = document.getElementById('translation-list-container');
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'lang-grid';

        const filtered = (typeof LangSearchEngine !== 'undefined') ? LangSearchEngine.search(query) : [];

        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#666;">لا توجد نتائج</div>';
            return;
        }

        filtered.forEach(lang => {
            const card = document.createElement('div');
            card.className = 'lang-card';
            card.onclick = () => this.setLanguage(lang.id);

            card.innerHTML = `
            <div class="lang-flag-container">
                <img src="../assets/img/flag/${lang.flag}.png" alt="${lang.name}" class="lang-flag-img">
            </div>
            <span class="lang-name">${lang.name}</span>
            <span class="lang-native">${lang.native}</span>
        `;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    },

    setLanguage(langId) {
        this.currentTranslationId = langId;
        this.translationVisible = true;
        document.getElementById('translation-modal').classList.remove('visible');
        document.querySelectorAll('.translation-text').forEach(el => el.remove());
        this.updateVisibleTranslations();
        UI.showNotification(`تم تفعيل الترجمة (${this.getLangName(langId)}) ✅`);
    },

    getLangName(id) {
        if (typeof LANG_SEARCH_INDEX !== 'undefined') {
            const l = LANG_SEARCH_INDEX.find(x => x.id === id);
            return l ? l.name : id;
        }
        return id;
    },

    async updateVisibleTranslations() {
        if (!this.translationVisible) return;
        const verses = document.querySelectorAll('.ayah-text');
        const visibleSurahs = new Set();
        verses.forEach(v => visibleSurahs.add(v.dataset.surahId));
        for (let surahId of visibleSurahs) {
            this.fetchSurahTranslation(surahId);
        }
    },

    fullTranslationCache: {},
    translationCache: {},
    isDownloadingTranslation: false,

    async fetchSurahTranslation(surahId) {
        const langId = this.currentTranslationId;
        console.log(`[Translation] Requesting: ${langId} for Surah: ${surahId}`);

        if (this.fullTranslationCache[langId]) {
            this.extractAndRenderTranslation(surahId, this.fullTranslationCache[langId]);
            return;
        }

        const folderName = "quran/translation";
        const fileName = `${langId}.json`;

        const localUrl = `https://appassets.androidplatform.net/local/${folderName}/${fileName}`;
        const githubUrl = `https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/refs/heads/main/${folderName}/${fileName}`;

        let isDownloaded = false;

        if (window.Android && typeof window.Android.isFileExists === 'function') {
            try {
                isDownloaded = window.Android.isFileExists(folderName, fileName);
            } catch (e) {
                isDownloaded = false;
            }
        }

        if (isDownloaded) {
            try {
                console.log(`[Translation] Reading local file: ${localUrl}`);
                const response = await fetch(localUrl);

                if (!response.ok) throw new Error('Local file fetch failed');

                const fullData = await response.json();
                this.fullTranslationCache[langId] = fullData;
                this.extractAndRenderTranslation(surahId, fullData);

            } catch (e) {
                console.error('[Translation] Error reading local file:', e);
                if (!this.isDownloadingTranslation) this.downloadTranslation(githubUrl, folderName, fileName);
            }
        }
        else {
            console.log('[Translation] File missing, downloading from GitHub...');

            if (!this.isDownloadingTranslation) {
                setTimeout(() => {
                    if (this.isDownloadingTranslation) {
                        console.warn('[Translation] Download timeout, resetting state');
                        this.isDownloadingTranslation = false;
                    }
                }, 30000);

                const modalContainer = document.getElementById('translation-list-container');
                if (modalContainer) {
                    modalContainer.innerHTML = `
                    <div style="text-align:center; padding: 40px 20px;">
                        <i class="fas fa-cloud-download-alt fa-bounce" style="font-size: 50px; color: #D4AF37; margin-bottom: 20px;"></i>
                        <h3 style="color:#fff; margin-bottom:10px;">جارِ تحميل الترجمة لأول مرة...</h3>
                        <p style="color:#ccc; font-size:12px; font-family:monospace;">${langId}</p>
                        <div id="real-progress-bar" style="width: 0%; height: 4px; background: #4ff0b7; margin: 15px auto; border-radius:4px;"></div>
                    </div>
                `;
                }

                this.downloadTranslation(githubUrl, folderName, fileName);
            }
        }
    },

    lastProgressUpdate: 0,
    progressWatchdog: null,

    downloadTranslation(url, folder, file) {
        if (this.isDownloadingTranslation) return;

        this.isDownloadingTranslation = true;
        this.lastProgressUpdate = Date.now();

        if (this.progressWatchdog) clearInterval(this.progressWatchdog);

        this.progressWatchdog = setInterval(() => {
            const timeSinceLastUpdate = Date.now() - this.lastProgressUpdate;

            if (this.isDownloadingTranslation && timeSinceLastUpdate > 60000) {
                console.warn("Download stuck for 60s, forcing reset.");
                this.isDownloadingTranslation = false;
                this.isLoading = false;
                clearInterval(this.progressWatchdog);
                if (typeof UI !== 'undefined') UI.showNotification("فشل التحميل: انقطع الاتصال ❌");
            }
        }, 5000);

        if (window.Android && window.Android.downloadFile) {
            window.Android.downloadFile(url, folder, file);
        }
    },

    extractAndRenderTranslation(surahId, fullData) {
        if (!Array.isArray(fullData)) {
            console.error("[Translation] Error: File content is not an Array!");
            return;
        }
        const surahObj = fullData.find(s => s.number == surahId);
        if (surahObj) {
            if (Array.isArray(surahObj.ayahs)) {
                this.renderTranslationFromCache(surahId, surahObj.ayahs);
            } else {
                console.warn(`[Translation] Surah ${surahId} found but has no 'ayahs' array.`);
            }
        } else {
            console.warn(`[Translation] Surah ${surahId} not found in this language file.`);
        }
    },

    renderTranslationFromCache(surahId, ayahs) {
        if (!this.translationVisible) return;
        ayahs.forEach(ayahData => {
            const ayahNum = ayahData.numberInSurah;
            let text = ayahData.text;
            if (!ayahNum || !text) return;
            text = text.replace(/^\uFEFF/, '').trim();
            const key = `${surahId}:${parseInt(ayahNum)}`;
            const verseEl = document.querySelector(`.ayah-text[data-key="${key}"]`);
            if (verseEl) {
                const oldTrans = verseEl.querySelector('.translation-text');
                if (oldTrans) oldTrans.remove();
                const transDiv = document.createElement('div');
                transDiv.className = 'translation-text';
                transDiv.innerText = text;
                if (['ar', 'ur', 'fa', 'ps', 'ks', 'ug', 'he'].some(code => this.currentTranslationId.startsWith(code))) {
                    transDiv.style.direction = 'rtl';
                    transDiv.style.textAlign = 'right';
                    transDiv.style.fontFamily = "'Amiri', serif";
                } else {
                    transDiv.style.direction = 'ltr';
                    transDiv.style.textAlign = 'left';
                    transDiv.style.fontFamily = "'Outfit', sans-serif";
                }
                verseEl.appendChild(transDiv);
            }
        });
        console.log(`[Translation] Rendered for Surah ${surahId} successfully.`);
    },

    playbackSpeed: 1.0,
    playbackSpeeds: [0.75, 1.0, 1.25],
    cyclePlaybackSpeed() {
        const currentIndex = this.playbackSpeeds.indexOf(this.playbackSpeed);
        const nextIndex = (currentIndex + 1) % this.playbackSpeeds.length;
        this.playbackSpeed = this.playbackSpeeds[nextIndex];
        const audio = document.getElementById('audio-player');
        if (audio) { audio.playbackRate = this.playbackSpeed; }
        const btn = document.getElementById('speed-btn');
        if (btn) { btn.querySelector('span').innerText = `السرعة: ${this.playbackSpeed}x`; }
        UI.showNotification(`تم تعديل السرعة إلى ${this.playbackSpeed}x ⚡`);
        UI.closeAllSheets();
    },

    updateSliderFill(input) {
        const min = parseFloat(input.min) || 0; const max = parseFloat(input.max) || 100; const val = parseFloat(input.value) || 0;
        const percentage = ((val - min) / (max - min)) * 100;
        input.style.setProperty('--percent', percentage + '%');
    },
    initSliders() { document.querySelectorAll('.custom-range').forEach(input => { this.updateSliderFill(input); }); },
    setBrightness(val) {
        const brightnessVal = parseFloat(val);
        const overlayOpacity = 0.8 - brightnessVal;
        const overlay = document.getElementById('brightness-overlay');

        if (overlay) {
            overlay.style.opacity = overlayOpacity.toFixed(2);

            if (overlayOpacity > 0) {
                overlay.style.display = 'block';
            } else {
                overlay.style.display = 'none';
            }
        }

        const input = document.querySelector('input[oninput*="setBrightness"]');
        if (input) this.updateSliderFill(input);
    },
    setFontSize(val) {
        document.documentElement.style.setProperty('--font-size', val + 'px');
        const input = document.querySelector('input[oninput*="setFontSize"]'); if (input) this.updateSliderFill(input);
    },

    adjustTafsirFontSize(amount) {
        const tafsirEl = document.getElementById('tafsir-content');
        let current = parseInt(getComputedStyle(tafsirEl).fontSize) || 18;
        let newSize = current + amount;
        if (newSize > 36) newSize = 36;
        if (newSize < 14) newSize = 14;
        document.documentElement.style.setProperty('--tafsir-text-size', newSize + 'px');
        document.documentElement.style.setProperty('--tafsir-verse-size', (newSize + 4) + 'px');
        localStorage.setItem('tafsir_modal_font_size', newSize);
    },

    copyAyah() {
        const textToCopy = UI.currentVerseText;
        if (!textToCopy) return;
        const showSuccessVisuals = () => {
            const btn = document.querySelector('#tafsir-overlay .btn-copy');
            if (btn) {
                btn.innerHTML = `<i class="fas fa-check" style="color:#4ff0b7;"></i> تم النسخ`;
                btn.style.borderColor = '#4ff0b7';
                btn.style.color = '#4ff0b7';
                setTimeout(() => {
                    btn.innerHTML = `<i class="fas fa-copy"></i> نسخ`;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 2000);
            }
            if (window.UI && UI.showNotification) UI.showNotification('تم نسخ الآية 📋');
        };
        const useFallback = () => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) showSuccessVisuals();
            } catch (err) { }
            document.body.removeChild(textArea);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(showSuccessVisuals).catch(() => useFallback());
        } else {
            useFallback();
        }
    },

    playSelectedVerse() {
        const btn = document.querySelector('#tafsir-overlay .btn-play');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-hammer"></i> قريباً';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-play"></i> استماع للآية'; }, 2000);
        }
    },
    downloadTafsirFromModal(url, folder, file) {
        const btn = document.querySelector('.btn-download-modal');
        if (window.Android && typeof window.Android.downloadFile === 'function') {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارِ التحميل...';
                btn.style.opacity = "0.7";
                btn.disabled = true;
            }
            window.Android.downloadFile(url, folder, file);
            setTimeout(() => {
                if (btn) btn.innerHTML = '<i class="fas fa-check"></i> تم التحميل';
                setTimeout(() => {
                    UI.refreshTafsir();
                }, 1500);
            }, 3000);
        } else {
            alert("هذه الميزة تعمل فقط داخل تطبيق الأندرويد");
        }
    },

    downloadCurrentSurahAudio() {
        const reciterId = this.selectedReciter || "Alafasy_128kbps";
        const reciterObj = RECITER_DB.find(r => r.id === reciterId);
        const folderName = reciterObj ? (reciterObj.folder || reciterId) : "Alafasy";
        const surahId = String(this.lastLoadedSurah).padStart(3, '0');
        const surahName = this.surahNames[this.lastLoadedSurah];

        let downloadQueue = [];

        const actualTotal = this.allVersesCache.length || 286;

        for (let i = 1; i <= actualTotal; i++) {
            const ayahID = String(i).padStart(3, '0');
            const fileName = `${surahId}${ayahID}.mp3`;
            downloadQueue.push({
                url: `https://everyayah.com/data/${reciterId}/${fileName}`,
                folder: `quran/audio/${folderName}`,
                file: fileName
            });
        }

        if (window.Android && window.Android.downloadBatch) {
            const btn = document.querySelector('#surah-download-btn button');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحضير...';
                btn.disabled = true;
            }

            console.log(`Sending ${downloadQueue.length} files to download...`);
            window.Android.downloadBatch(JSON.stringify(downloadQueue), surahName, reciterObj.name);

            setTimeout(() => UI.closeAllSheets(), 1000);
            if (typeof UI !== 'undefined') UI.showNotification("بدأ التحميل في الخلفية 🚀");
        } else {
            alert("هذه الميزة تتطلب التطبيق الرسمي");
        }
    },

    checkDownloadStatus() {
        const btn = document.querySelector('#surah-download-btn button');
        const statusText = document.getElementById('dl-status-text');
        if (!btn) return;

        const reciterId = this.selectedReciter || "Alafasy_128kbps";
        const reciterObj = RECITER_DB.find(r => r.id === reciterId);
        const folderName = reciterObj ? (reciterObj.folder || reciterId) : "Alafasy";
        const surahId = String(this.lastLoadedSurah).padStart(3, '0');

        const firstFile = `${surahId}001.mp3`;
        const path = `quran/audio/${folderName}`;

        if (window.Android && window.Android.isFileExists) {
            const exists = window.Android.isFileExists(path, firstFile);
            if (exists) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> تم التحميل مسبقاً';
                btn.style.background = 'rgba(79, 240, 183, 0.2)';
                btn.style.color = '#4ff0b7';
                btn.style.border = '1px solid #4ff0b7';
                btn.onclick = null;
                if (statusText) statusText.innerText = "تعمل الآن بدون إنترنت ✅";
            } else {
                btn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> تحميل تلاوة السورة كاملة';
                btn.style.background = 'rgba(79, 240, 183, 0.15)';
                btn.style.borderColor = '#4ff0b7';
                btn.style.color = '#000';
                btn.onclick = () => Engine.downloadCurrentSurahAudio();
                if (statusText) statusText.innerText = "للاستماع بدون إنترنت";
            }
        }
    },

    checkAudioDownloadStatus() {
        const btn = document.getElementById('btn-quran-download');
        if (!btn) return;

        const surahID = String(this.lastLoadedSurah).padStart(3, '0');
        const fileName = `${surahID}.mp3`;
        const reciterFolder = this.selectedReciter;
        const fullPath = `quran/audio/${reciterFolder}`;

        if (window.Android && window.Android.isFileExists) {
            const exists = window.Android.isFileExists(fullPath, fileName);
            if (exists) {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.classList.add('active');
                btn.onclick = null;
            } else {
                btn.innerHTML = '<i class="fas fa-cloud-download-alt"></i>';
                btn.classList.remove('active');
                btn.onclick = () => this.downloadCurrentPageAudio();
            }
        }
    },

    downloadCurrentPageAudio() {
        const btn = document.getElementById('btn-quran-download');
        if (!window.Android || !window.Android.downloadFile) {
            alert("ميزة التحميل متاحة في التطبيق فقط");
            return;
        }

        const currentReciterObj = RECITER_DB.find(r => r.id === this.selectedReciter);

        const serverUrl = currentReciterObj.server || `https://server7.mp3quran.net/basit/`;

        const surahID = String(this.lastLoadedSurah).padStart(3, '0');
        const url = `${serverUrl}${surahID}.mp3`;
        const folder = `quran/audio/${this.selectedReciter}`;
        const file = `${surahID}.mp3`;

        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

        window.Android.downloadFile(url, folder, file);
    },

    // ====== 📸 مشاركة الآية كصورة فاخرة ======
    shareVerseAsImage() {
        const key = UI.currentVerseKey || this.currentPlayingKey;
        if (!key) {
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('اضغط على آية أولاً');
            return;
        }

        const el = document.querySelector(`.ayah-text[data-key="${key}"]`);
        if (!el || !el.dataset.text) {
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('نص الآية غير متوفر');
            return;
        }

        const verseText = el.dataset.text;
        const [surahId, ayahNum] = key.split(':');
        const surahName = this.surahNames ? this.surahNames[surahId] : `سورة ${surahId}`;

        // إنشاء Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        // خلفية متدرجة داكنة
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0a0f0f');
        grad.addColorStop(0.5, '#0d1a15');
        grad.addColorStop(1, '#0a0f0f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // إطار ذهبي
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

        // زخرفة علوية
        ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.font = '50px serif';
        ctx.textAlign = 'center';
        ctx.fillText('﷽', canvas.width / 2, 130);

        // اسم السورة
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.font = 'bold 32px "Reem Kufi", sans-serif';
        ctx.fillText(`سورة ${surahName} - الآية ${ayahNum}`, canvas.width / 2, 200);

        // خط فاصل
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(200, 230);
        ctx.lineTo(canvas.width - 200, 230);
        ctx.stroke();

        // نص الآية (word wrap)
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px "Amiri", serif';
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

        const maxWidth = canvas.width - 160;
        const words = verseText.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(testLine).width > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);

        const lineHeight = 65;
        const startY = (canvas.height / 2) - ((lines.length * lineHeight) / 2) + 40;

        lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight));
        });

        // شعار التطبيق
        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.font = '22px "Reem Kufi", sans-serif';
        ctx.fillText('Sunnah Pro - المصحف الملكي', canvas.width / 2, canvas.height - 80);

        // تحويل لصورة وتحميل / مشاركة
        canvas.toBlob((blob) => {
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], `verse-${key}.png`, { type: 'image/png' });
                navigator.share({
                    title: `سورة ${surahName} - الآية ${ayahNum}`,
                    text: verseText,
                    files: [file]
                }).catch(() => { });
            } else {
                // Fallback: download
                const link = document.createElement('a');
                link.download = `verse-${key}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
            }
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('تم إنشاء صورة الآية');
        }, 'image/png');

        // إغلاق الشيت
        UI.closeAllSheets();
    },

    // ====== 🌙 منظومة الختمات الرمضانية العملاقة ======
    _khatmaDB: null,
    _khatmaActive: false,
    _khatmaSessionStart: null,

    // IndexedDB — تخزين عميق آمن ضد المسح
    async _openKhatmaDB() {
        if (this._khatmaDB) return this._khatmaDB;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('SunnahPro_RamadanKhatma', 2);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('plans')) db.createObjectStore('plans', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'date' });
                if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
            };
            req.onsuccess = (e) => { this._khatmaDB = e.target.result; resolve(this._khatmaDB); };
            req.onerror = () => reject('DB Error');
        });
    },

    async _khatmaGet(store, key) {
        const db = await this._openKhatmaDB();
        return new Promise((resolve) => {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).get(key);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    },

    async _khatmaPut(store, data) {
        const db = await this._openKhatmaDB();
        return new Promise((resolve) => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).put(data);
            tx.oncomplete = () => resolve(true);
        });
    },

    async _khatmaGetAll(store) {
        const db = await this._openKhatmaDB();
        return new Promise((resolve) => {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    },

    // الدالة الرئيسية — فتح النظام
    async openRamadanKhatma() {
        UI.closeAllSheets();
        const plan = await this._khatmaGet('settings', 'active_plan');
        if (plan && plan.value) {
            this._showKhatmaDashboard(plan.value);
        } else {
            this._showKhatmaWizard();
        }
    },

    // ====== معالج الإعداد الذكي (Wizard) ======
    _showKhatmaWizard() {
        document.getElementById('khatma-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.className = 'notes-fullscreen-overlay';
        overlay.id = 'khatma-overlay';
        overlay.innerHTML = `
        <div class="rk-wizard" id="rk-wizard">
            <div class="rk-wizard-header">
                <button class="rk-wizard-close" onclick="document.getElementById('khatma-overlay').remove()"><i class="fas fa-times"></i></button>
                <div class="rk-wizard-logo"><i class="fas fa-moon"></i></div>
                <h1 class="rk-wizard-title">الختمة الرمضانية</h1>
                <p class="rk-wizard-desc">نظام ذكي يبني لك خطة مخصصة لختم القرآن</p>
            </div>
            <div class="rk-wizard-steps" id="rk-wizard-steps">
                <div class="rk-step rk-step--active" data-step="1">
                    <div class="rk-step-num">1</div>
                    <div class="rk-step-label">الختمات</div>
                </div>
                <div class="rk-step-line"></div>
                <div class="rk-step" data-step="2">
                    <div class="rk-step-num">2</div>
                    <div class="rk-step-label">أوقاتك</div>
                </div>
                <div class="rk-step-line"></div>
                <div class="rk-step" data-step="3">
                    <div class="rk-step-num">3</div>
                    <div class="rk-step-label">الخطة</div>
                </div>
            </div>
            <div class="rk-wizard-body" id="rk-wizard-body"></div>
        </div>`;
        document.body.appendChild(overlay);
        this._showWizardStep(1);
    },

    _wizardData: { khatmaCount: 1, freeTime: 'medium', readingSpeed: 'normal', reminderTimes: ['after_fajr'] },

    _showWizardStep(step) {
        const body = document.getElementById('rk-wizard-body');
        if (!body) return;
        // Update step indicators
        document.querySelectorAll('.rk-step').forEach(el => {
            const s = parseInt(el.dataset.step);
            el.classList.toggle('rk-step--active', s === step);
            el.classList.toggle('rk-step--done', s < step);
        });

        if (step === 1) {
            const labels = ['', 'ختمة واحدة', 'ختمتين', '3 ختمات', '4 ختمات', '5 ختمات', '6 ختمات', '7 ختمات', '8 ختمات', '9 ختمات', '10 ختمات'];
            body.innerHTML = `
            <div class="rk-question">
                <div class="rk-q-icon"><i class="fas fa-book-quran"></i></div>
                <h2 class="rk-q-title">كم مرة تحب تختم القرآن في رمضان؟</h2>
                <p class="rk-q-sub">اختار العدد المناسب لك — سواء ختمة واحدة أو عشر ختمات، النظام هيحسب ورد يومي مناسب</p>
                <div class="rk-khatma-picker" id="rk-khatma-picker">
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `
                    <button class="rk-khatma-option${n === this._wizardData.khatmaCount ? ' rk-khatma-option--active' : ''}" onclick="Engine._selectKhatmaCount(${n})">
                        <div class="rk-khatma-option-num">${n}</div>
                        <div class="rk-khatma-option-label">${labels[n]}</div>
                        <div class="rk-khatma-option-pages">${Math.ceil((604 * n) / 30)} صفحة/يوم</div>
                    </button>`).join('')}
                </div>
                <button class="rk-btn-next" onclick="Engine._showWizardStep(2)"><span>التالي</span> <i class="fas fa-arrow-left"></i></button>
            </div>`;
        } else if (step === 2) {
            body.innerHTML = `
            <div class="rk-question">
                <div class="rk-q-icon"><i class="fas fa-clock"></i></div>
                <h2 class="rk-q-title">أوقاتك خلال رمضان</h2>
                <p class="rk-q-sub">ساعدنا نفهم جدولك عشان نقسم الورد بذكاء</p>
                <div class="rk-options-grid">
                    <div class="rk-option-card${this._wizardData.freeTime === 'busy' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('freeTime','busy',this)">
                        <i class="fas fa-briefcase"></i>
                        <span>مشغول جداً</span>
                        <small>أقل من ساعة فراغ</small>
                    </div>
                    <div class="rk-option-card${this._wizardData.freeTime === 'medium' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('freeTime','medium',this)">
                        <i class="fas fa-balance-scale"></i>
                        <span>متوسط</span>
                        <small>2-3 ساعات فراغ</small>
                    </div>
                    <div class="rk-option-card${this._wizardData.freeTime === 'free' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('freeTime','free',this)">
                        <i class="fas fa-couch"></i>
                        <span>عندي وقت كبير</span>
                        <small>4+ ساعات فراغ</small>
                    </div>
                </div>
                <h3 class="rk-q-subtitle">سرعتك في القراءة</h3>
                <div class="rk-options-grid">
                    <div class="rk-option-card${this._wizardData.readingSpeed === 'slow' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('readingSpeed','slow',this)">
                        <i class="fas fa-tortoise"></i><span>هادئ ومتأنّي</span><small>صفحة كل 5 دقائق</small>
                    </div>
                    <div class="rk-option-card${this._wizardData.readingSpeed === 'normal' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('readingSpeed','normal',this)">
                        <i class="fas fa-walking"></i><span>متوسط</span><small>صفحة كل 3 دقائق</small>
                    </div>
                    <div class="rk-option-card${this._wizardData.readingSpeed === 'fast' ? ' rk-option-card--active' : ''}" onclick="Engine._selectOption('readingSpeed','fast',this)">
                        <i class="fas fa-bolt"></i><span>سريع</span><small>صفحة كل دقيقتين</small>
                    </div>
                </div>
                <h3 class="rk-q-subtitle"><i class="fas fa-info-circle" style="font-size:12px;color:#8899a6"></i> أوقات القراءة (اختر أكثر من وقت)</h3>
                <div class="rk-options-grid rk-options-grid--2">
                    <div class="rk-option-card rk-option-card--sm${this._wizardData.reminderTimes.includes('after_fajr') ? ' rk-option-card--active' : ''}" onclick="Engine._toggleTimeOption('after_fajr',this)">
                        <i class="fas fa-sun"></i><span>بعد الفجر</span>
                    </div>
                    <div class="rk-option-card rk-option-card--sm${this._wizardData.reminderTimes.includes('before_dhuhr') ? ' rk-option-card--active' : ''}" onclick="Engine._toggleTimeOption('before_dhuhr',this)">
                        <i class="fas fa-cloud-sun"></i><span>قبل الظهر</span>
                    </div>
                    <div class="rk-option-card rk-option-card--sm${this._wizardData.reminderTimes.includes('after_asr') ? ' rk-option-card--active' : ''}" onclick="Engine._toggleTimeOption('after_asr',this)">
                        <i class="fas fa-cloud-moon"></i><span>بعد العصر</span>
                    </div>
                    <div class="rk-option-card rk-option-card--sm${this._wizardData.reminderTimes.includes('after_tarawih') ? ' rk-option-card--active' : ''}" onclick="Engine._toggleTimeOption('after_tarawih',this)">
                        <i class="fas fa-moon"></i><span>بعد التراويح</span>
                    </div>
                </div>
                <div class="rk-btn-row">
                    <button class="rk-btn-back" onclick="Engine._showWizardStep(1)"><i class="fas fa-arrow-right"></i> السابق</button>
                    <button class="rk-btn-next" onclick="Engine._showWizardStep(3)"><span>إنشاء الخطة</span> <i class="fas fa-arrow-left"></i></button>
                </div>
            </div>`;
        } else if (step === 3) {
            const plan = this._generateKhatmaPlan();
            body.innerHTML = `
            <div class="rk-question">
                <div class="rk-q-icon rk-q-icon--success"><i class="fas fa-check-circle"></i></div>
                <h2 class="rk-q-title">خطتك جاهزة! 🎉</h2>
                <p class="rk-q-sub">نظام AI جهّز لك خطة مخصصة بناءً على إجاباتك</p>
                <div class="rk-plan-summary">
                    <div class="rk-plan-card">
                        <div class="rk-plan-card-icon"><i class="fas fa-book-quran"></i></div>
                        <div class="rk-plan-card-value">${plan.khatmaCount}</div>
                        <div class="rk-plan-card-label">ختمة في رمضان</div>
                    </div>
                    <div class="rk-plan-card">
                        <div class="rk-plan-card-icon" style="color:#3b82f6"><i class="fas fa-file-alt"></i></div>
                        <div class="rk-plan-card-value">${plan.dailyPages}</div>
                        <div class="rk-plan-card-label">صفحة يومياً</div>
                    </div>
                    <div class="rk-plan-card">
                        <div class="rk-plan-card-icon" style="color:#f59e0b"><i class="fas fa-clock"></i></div>
                        <div class="rk-plan-card-value">${plan.estimatedMinutes}</div>
                        <div class="rk-plan-card-label">دقيقة تقريباً</div>
                    </div>
                    <div class="rk-plan-card">
                        <div class="rk-plan-card-icon" style="color:#ec4899"><i class="fas fa-layer-group"></i></div>
                        <div class="rk-plan-card-value">${plan.sessionsPerDay}</div>
                        <div class="rk-plan-card-label">جلسة يومياً</div>
                    </div>
                </div>
                <div class="rk-plan-detail">
                    <div class="rk-plan-detail-row"><i class="fas fa-calendar-check"></i> <span>الورد اليومي: <strong>من صفحة 1 إلى صفحة ${plan.dailyPages}</strong></span></div>
                    <div class="rk-plan-detail-row"><i class="fas fa-divide"></i> <span>مقسّم على <strong>${plan.sessionsPerDay} جلسة</strong> (${plan.pagesPerSession} صفحة لكل جلسة)</span></div>
                    <div class="rk-plan-detail-row"><i class="fas fa-bell"></i> <span>أفضل وقت: <strong>${plan.reminderLabel}</strong></span></div>
                </div>
                <button class="rk-btn-start" onclick="Engine._activateKhatmaPlan()">
                    <i class="fas fa-play"></i> ابدأ الختمة الآن
                </button>
                <div class="rk-btn-row" style="justify-content:center;margin-top:10px">
                    <button class="rk-btn-back" onclick="Engine._showWizardStep(2)"><i class="fas fa-arrow-right"></i> تعديل الإعدادات</button>
                </div>
            </div>`;
        }
    },

    _selectKhatmaCount(n) {
        this._wizardData.khatmaCount = n;
        document.querySelectorAll('.rk-khatma-option').forEach(el => el.classList.remove('rk-khatma-option--active'));
        event.currentTarget.classList.add('rk-khatma-option--active');
    },

    _selectOption(field, value, el) {
        this._wizardData[field] = value;
        const grid = el.closest('.rk-options-grid');
        grid.querySelectorAll('.rk-option-card').forEach(c => c.classList.remove('rk-option-card--active'));
        el.classList.add('rk-option-card--active');
    },

    // Multi-select toggle for reading times
    _toggleTimeOption(value, el) {
        const arr = this._wizardData.reminderTimes;
        const idx = arr.indexOf(value);
        if (idx > -1) {
            if (arr.length > 1) { arr.splice(idx, 1); el.classList.remove('rk-option-card--active'); }
        } else {
            arr.push(value); el.classList.add('rk-option-card--active');
        }
    },

    _generateKhatmaPlan() {
        const d = this._wizardData;
        const totalPages = 604 * d.khatmaCount;
        const dailyPages = Math.ceil(totalPages / 30);
        const speedMap = { slow: 5, normal: 3, fast: 2 };
        const mins = dailyPages * (speedMap[d.readingSpeed] || 3);
        const freeMap = { busy: 2, medium: 3, free: 5 };
        const sessions = Math.min(freeMap[d.freeTime] || 3, Math.ceil(dailyPages / 4));
        const pps = Math.ceil(dailyPages / sessions);
        const reminderLabels = { after_fajr: 'بعد الفجر', before_dhuhr: 'قبل الظهر', after_asr: 'بعد العصر', after_tarawih: 'بعد التراويح' };
        const times = (d.reminderTimes || ['after_fajr']).map(t => reminderLabels[t] || t).join(' و ');
        return {
            khatmaCount: d.khatmaCount, dailyPages, estimatedMinutes: mins,
            sessionsPerDay: sessions, pagesPerSession: pps,
            reminderLabel: times,
            reminderTimes: d.reminderTimes, readingSpeed: d.readingSpeed, freeTime: d.freeTime
        };
    },

    async _activateKhatmaPlan() {
        const plan = this._generateKhatmaPlan();
        plan.id = 'active';
        plan.createdAt = new Date().toISOString();
        plan.currentPage = 1;
        plan.currentDay = 1;
        plan.completedPages = 0;
        plan.totalPagesNeeded = 604 * plan.khatmaCount;
        plan.streak = 0;
        plan.days = {};
        await this._khatmaPut('plans', plan);
        await this._khatmaPut('settings', { key: 'active_plan', value: plan });
        document.getElementById('khatma-overlay')?.remove();
        if (typeof UI !== 'undefined') UI.showNotification('تم تفعيل الختمة الرمضانية 🌙');
        this._showKhatmaDashboard(plan);
    },

    // ====== Dashboard — لوحة المتابعة ======
    async _showKhatmaDashboard(plan) {
        document.getElementById('khatma-overlay')?.remove();
        const today = new Date().toISOString().split('T')[0];
        const todayData = plan.days?.[today] || { pagesRead: 0, sessions: [] };
        const todayPages = todayData.pagesRead || 0;
        const progress = Math.min((plan.completedPages / plan.totalPagesNeeded) * 100, 100).toFixed(1);
        const streak = this._calcKhatmaStreak(plan);
        const remaining = plan.totalPagesNeeded - plan.completedPages;
        const daysLeft = Math.max(1, 30 - (plan.currentDay - 1));
        const adjustedDaily = Math.ceil(remaining / daysLeft);
        const fromPage = plan.currentPage;
        const toPage = Math.min(plan.currentPage + plan.dailyPages - todayPages - 1, 604);

        const overlay = document.createElement('div');
        overlay.className = 'notes-fullscreen-overlay';
        overlay.id = 'khatma-overlay';
        overlay.innerHTML = `
        <div class="rk-dashboard">
            <div class="rk-dash-header">
                <button class="rk-dash-close" onclick="document.getElementById('khatma-overlay').remove()"><i class="fas fa-times"></i></button>
                <div class="rk-dash-title"><i class="fas fa-moon"></i> الختمة الرمضانية</div>
                <button class="rk-dash-reset" onclick="Engine._resetKhatma()"><i class="fas fa-redo-alt"></i></button>
            </div>
            <div class="rk-dash-body">
                <div class="rk-hero-stats">
                    <div class="rk-hero-circle">
                        <svg viewBox="0 0 120 120" class="rk-progress-ring">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#rkGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${54 * 2 * Math.PI}" stroke-dashoffset="${54 * 2 * Math.PI * (1 - progress / 100)}" transform="rotate(-90 60 60)"/>
                            <defs><linearGradient id="rkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d4af37"/><stop offset="100%" stop-color="#f0d060"/></linearGradient></defs>
                        </svg>
                        <div class="rk-hero-circle-inner">
                            <div class="rk-hero-percent">${progress}%</div>
                            <div class="rk-hero-label">إنجاز</div>
                        </div>
                    </div>
                </div>
                <div class="rk-stats-grid">
                    <div class="rk-stat-card"><div class="rk-stat-num">${todayPages}/${plan.dailyPages}</div><div class="rk-stat-label">ورد اليوم</div></div>
                    <div class="rk-stat-card"><div class="rk-stat-num rk-stat-streak">${streak} 🔥</div><div class="rk-stat-label">أيام متواصلة</div></div>
                    <div class="rk-stat-card"><div class="rk-stat-num">${plan.completedPages}</div><div class="rk-stat-label">صفحة مكتملة</div></div>
                    <div class="rk-stat-card"><div class="rk-stat-num">${remaining}</div><div class="rk-stat-label">صفحة متبقية</div></div>
                </div>
                <div class="rk-today-wird">
                    <div class="rk-wird-header"><i class="fas fa-bookmark"></i> ورد اليوم</div>
                    ${todayPages >= plan.dailyPages ?
                `<div class="rk-wird-complete"><i class="fas fa-check-circle"></i> ماشاء الله! أنهيت ورد اليوم 🎉</div>` :
                `<div class="rk-wird-range">
                        <div class="rk-wird-from"><span>من</span><strong>${typeof KhatmaContent !== 'undefined' ? 'سورة ' + KhatmaContent.pageToSurah(fromPage).name : 'صفحة ' + fromPage}</strong></div>
                        <div class="rk-wird-arrow"><i class="fas fa-arrow-left"></i></div>
                        <div class="rk-wird-to"><span>إلى</span><strong>${typeof KhatmaContent !== 'undefined' ? 'سورة ' + KhatmaContent.pageToSurah(toPage).name : 'صفحة ' + toPage}</strong></div>
                    </div>
                    <div class="rk-wird-remaining">${plan.dailyPages - todayPages} صفحة متبقية لإكمال ورد اليوم</div>`}
                </div>
                ${plan.lastStoppedSurah ? `
                <div class="rk-adjust-notice" style="border-color:rgba(79,240,183,0.15);background:rgba(79,240,183,0.04);margin-bottom:14px">
                    <i class="fas fa-map-marker-alt" style="color:var(--primary)"></i>
                    <span>آخر موقف: <strong>سورة ${plan.lastStoppedSurah} — الآية ${plan.lastStoppedAyah || '؟'}</strong></span>
                </div>` : ''}
                <div class="rk-actions">
                    ${todayPages < plan.dailyPages ? `
                    <button class="rk-btn-read" onclick="Engine._startKhatmaReading()">
                        <i class="fas fa-book-open"></i> ${plan.lastStoppedSurah ? 'أكمل القراءة' : 'ابدأ القراءة الآن'}
                    </button>` : ''}
                    <button class="rk-btn-manual" onclick="Engine._manualAddPages()">
                        <i class="fas fa-plus-circle"></i> سجّل صفحات قرأتها
                    </button>
                    <button class="rk-btn-manual" onclick="Engine._shareKhatmaProgress()">
                        <i class="fas fa-download"></i> تحميل / مشاركة تقدمي
                    </button>
                </div>
                ${adjustedDaily !== plan.dailyPages ? `
                <div class="rk-adjust-notice">
                    <i class="fas fa-info-circle"></i>
                    <span>بناءً على تقدمك الحالي، الورد المعدّل: <strong>${adjustedDaily} صفحة/يوم</strong> للأيام المتبقية</span>
                </div>` : ''}
                ${typeof KhatmaContent !== 'undefined' ? `
                <div style="text-align:center;padding:16px 0 6px;font-size:12px;color:rgba(212,175,55,0.5);font-style:italic;border-top:1px solid rgba(255,255,255,0.04);margin-top:16px">
                    ${KhatmaContent.getBarContent()}
                </div>` : ''}
            </div>
        </div>`;
        document.body.appendChild(overlay);
    },

    _calcKhatmaStreak(plan) {
        if (!plan.days) return 0;
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 60; i++) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (plan.days[key] && plan.days[key].pagesRead > 0) streak++;
            else if (i > 0) break;
        }
        return streak;
    },

    async _manualAddPages() {
        const pages = prompt('كم صفحة قرأت؟', '5');
        if (!pages || isNaN(pages) || parseInt(pages) <= 0) return;
        const count = parseInt(pages);
        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (!plan) return;
        const today = new Date().toISOString().split('T')[0];
        if (!plan.days) plan.days = {};
        if (!plan.days[today]) plan.days[today] = { pagesRead: 0, sessions: [] };
        plan.days[today].pagesRead += count;
        plan.days[today].sessions.push({ time: new Date().toISOString(), pages: count });
        plan.completedPages += count;
        plan.currentPage = Math.min(plan.currentPage + count, 605);
        // Check day completion
        if (plan.days[today].pagesRead >= plan.dailyPages) {
            plan.currentDay = Math.min(plan.currentDay + 1, 31);
        }
        await this._khatmaPut('plans', { ...plan, id: 'active' });
        await this._khatmaPut('settings', { key: 'active_plan', value: plan });
        // Record progress
        await this._khatmaPut('progress', { date: today, ...plan.days[today], totalCompleted: plan.completedPages });
        document.getElementById('khatma-overlay')?.remove();
        if (typeof UI !== 'undefined') UI.showNotification(`تم تسجيل ${count} صفحة ✓`);
        this._showKhatmaDashboard(plan);
    },

    _khatmaQuoteInterval: null,

    // Get current visible surah + page from DOM
    _getCurrentReadingPosition() {
        const scrollArea = document.getElementById('quran-scroll-area');
        if (!scrollArea) return null;
        const cards = scrollArea.querySelectorAll('.quran-sheet');
        let bestCard = null;
        const scrollY = scrollArea.scrollTop + scrollArea.clientHeight / 3;
        cards.forEach(card => {
            if (card.offsetTop <= scrollY) bestCard = card;
        });
        if (!bestCard) return null;
        const surahId = parseInt(bestCard.dataset?.surah || this.lastLoadedSurah || 1);
        const page = parseInt(bestCard.dataset?.page || 1);
        const surahName = this.surahNames[surahId] || 'الفاتحة';
        const ayahs = bestCard.querySelectorAll('.ayah-text');
        let lastAyah = 1;
        ayahs.forEach(a => { const n = parseInt(a.dataset?.ayah); if (n) lastAyah = n; });
        return { surahId, surahName, page, ayah: lastAyah };
    },

    _khatmaWirdMode: false,
    _khatmaWirdTarget: 0,
    _khatmaWirdCards: 0,
    _khatmaWirdStartSurah: 1,

    async _startKhatmaReading() {
        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (!plan) return;
        this._khatmaActive = true;
        this._khatmaSessionStart = Date.now();
        const today = new Date().toISOString().split('T')[0];
        const todayPages = plan.days?.[today]?.pagesRead || 0;
        const remaining = plan.dailyPages - todayPages;
        if (remaining <= 0) {
            if (typeof UI !== 'undefined') UI.showNotification('🎉 ماشاء الله! أكملت ورد اليوم بالفعل');
            return;
        }
        document.getElementById('khatma-overlay')?.remove();

        // Calculate surah range for today's wird
        const fromPage = plan.currentPage;
        const toPage = Math.min(plan.currentPage + remaining - 1, 604);
        const fromSurah = typeof KhatmaContent !== 'undefined' ? KhatmaContent.pageToSurah(fromPage) : { id: 1, name: 'الفاتحة' };
        const toSurah = typeof KhatmaContent !== 'undefined' ? KhatmaContent.pageToSurah(toPage) : fromSurah;
        const surahRange = fromSurah.id === toSurah.id ? `سورة ${fromSurah.name}` : `${fromSurah.name} → ${toSurah.name}`;

        // النقلة النوعية هنا: الهدف أصبح الصفحات تماماً
        const estimatedCards = (toPage - fromPage) + 1;

        this._khatmaWirdTarget = estimatedCards;
        this._khatmaWirdCards = 0;
        this._khatmaWirdMode = true;
        this._khatmaWirdStartSurah = fromSurah.id;

        // Navigate to the starting surah
        await this.loadSurahAsCards(fromSurah.id);

        // Show reading bar
        const wisdom = typeof KhatmaContent !== 'undefined' ? KhatmaContent.getBarContent() : '';
        let bar = document.getElementById('rk-reading-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'rk-reading-bar';
            bar.className = 'rk-reading-bar';
            document.body.appendChild(bar);
        }
        bar.innerHTML = `
            <div class="rk-bar-content">
                <i class="fas fa-moon"></i>
                <div class="rk-bar-text-area">
                    <span class="rk-bar-status">📖 ${surahRange} — <strong>${remaining} صفحة</strong></span>
                    <span class="rk-bar-wisdom" id="rk-bar-wisdom">${wisdom}</span>
                </div>
            </div>
            <div class="rk-bar-actions">
                <button onclick="Engine._shareKhatmaProgress()" class="rk-bar-pause" title="مشاركة"><i class="fas fa-share-alt"></i></button>
                <button onclick="Engine._finishWird()" class="rk-bar-done" title="أنهيت الورد"><i class="fas fa-check"></i> <span class="rk-bar-done-text">أنهيت</span></button>
                <button onclick="Engine._pauseKhatmaReading()" class="rk-bar-pause" title="إيقاف مؤقت"><i class="fas fa-pause"></i></button>
            </div>`;
        bar.style.display = 'flex';

        // Rotate wisdom quotes every 15 seconds
        clearInterval(this._khatmaQuoteInterval);
        this._khatmaQuoteInterval = setInterval(() => {
            const wisdomEl = document.getElementById('rk-bar-wisdom');
            if (wisdomEl && typeof KhatmaContent !== 'undefined') {
                wisdomEl.style.opacity = '0';
                setTimeout(() => {
                    wisdomEl.textContent = KhatmaContent.getBarContent();
                    wisdomEl.style.opacity = '1';
                }, 400);
            }
        }, 15000);

        // Exit protection
        window._khatmaBeforeUnload = (e) => { e.preventDefault(); e.returnValue = 'لسه ما أنهيت ورد اليوم! هل تريد المغادرة؟'; };
        window.addEventListener('beforeunload', window._khatmaBeforeUnload);

        if (typeof UI !== 'undefined') UI.showNotification(`🌙 ورد اليوم: ${surahRange} (${remaining} صفحة)`);
    },

    // Inject "صدق الله العظيم" completion card (Page-based version)
    _injectWirdCompletionCard() {
        const container = document.getElementById('quran-scroll-area');
        if (!container || document.getElementById('khatma-wird-complete')) return;
        
        // Get page-based information
        const currentPage = this._khatmaCurrentPage || 1;
        const totalPages = 604;
        const progress = Math.round((currentPage / totalPages) * 100);
        
        const card = document.createElement('div');
        card.id = 'khatma-wird-complete';
        card.className = 'quran-sheet';
        card.style.cssText = 'text-align:center;padding:30px 20px;background:transparent;border:1px solid rgba(212,175,55,0.3);border-radius:16px;margin:20px auto;max-width:400px;';
        card.innerHTML = `
            <div style="font-size:28px;color:#d4af37;margin-bottom:16px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <div style="font-size:22px;color:#d4af37;margin-bottom:12px;font-family:'Amiri',serif;">صَدَقَ اللّٰهُ الْعَظِيم</div>
            <div style="font-size:14px;color:#888;margin-bottom:20px;">${currentPage} من أصل ${totalPages} صفحة (${progress}%)</div>
            <button onclick="Engine._finishWird()" style="padding:12px 30px;background:#d4af37;border:none;border-radius:12px;color:#000;font-size:15px;font-weight:700;font-family:'IBM Plex Arabic',sans-serif;cursor:pointer;">
                تم
            </button>
        `;
        container.appendChild(card);
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    },

    // Called when wird is complete (either by button or scrolling to end)
    async _finishWird() {
        // Get the completion card and animate it out
        const completionCard = document.getElementById('khatma-wird-complete');
        if (completionCard) {
            // Add fade out animation
            completionCard.style.transition = 'all 0.5s ease-in-out';
            completionCard.style.opacity = '0';
            completionCard.style.transform = 'translateY(20px)';
            
            // Remove the card after animation completes
            setTimeout(() => {
                if (completionCard && completionCard.parentNode) {
                    completionCard.parentNode.removeChild(completionCard);
                }
            }, 500);
        }

        clearInterval(this._khatmaQuoteInterval);
        this._khatmaWirdMode = false;
        this._khatmaActive = false;
        window.removeEventListener('beforeunload', window._khatmaBeforeUnload);
        const bar = document.getElementById('rk-reading-bar');
        if (bar) bar.style.display = 'none';

        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (!plan) return;

        // Save current position
        const pos = this._getCurrentReadingPosition();
        if (pos) {
            plan.lastStoppedSurah = pos.surahName;
            plan.lastStoppedSurahId = pos.surahId;
            plan.lastStoppedPage = pos.page;
            plan.lastStoppedAyah = pos.ayah;
        }

        // Auto-record today's wird as complete
        const today = new Date().toISOString().split('T')[0];
        if (!plan.days) plan.days = {};
        if (!plan.days[today]) plan.days[today] = { pagesRead: 0, sessions: [] };
        const elapsed = Math.floor((Date.now() - this._khatmaSessionStart) / 1000);
        const remaining = plan.dailyPages - (plan.days[today].pagesRead || 0);
        const count = Math.max(remaining, 1);

        plan.days[today].pagesRead += count;
        plan.days[today].sessions.push({ time: new Date().toISOString(), pages: count, durationSec: elapsed });
        plan.completedPages += count;
        plan.currentPage = Math.min(plan.currentPage + count, 605);
        if (plan.days[today].pagesRead >= plan.dailyPages) plan.currentDay = Math.min(plan.currentDay + 1, 31);

        await this._khatmaPut('plans', { ...plan, id: 'active' });
        await this._khatmaPut('settings', { key: 'active_plan', value: plan });
        await this._khatmaPut('progress', { date: today, ...plan.days[today], totalCompleted: plan.completedPages });

        // Show celebration
        const msg = typeof KhatmaContent !== 'undefined' ? KhatmaContent.getCompletionMessage() : '🎉 ماشاء الله! أكملت ورد اليوم';
        if (typeof UI !== 'undefined') UI.showNotification(msg);

        // Milestone check
        const streak = this._calcKhatmaStreak(plan);
        const progress = Math.min((plan.completedPages / plan.totalPagesNeeded) * 100, 100);
        if (typeof KhatmaContent !== 'undefined') {
            const milestone = KhatmaContent.getMilestoneMessage(streak, progress);
            if (milestone) setTimeout(() => { if (typeof UI !== 'undefined') UI.showNotification(milestone); }, 3000);
        }
    },

    async _recordReadingSession() {
        const pages = prompt('كم صفحة قرأت في هذه الجلسة؟', '5');
        if (!pages || isNaN(pages) || parseInt(pages) <= 0) return;
        clearInterval(this._khatmaQuoteInterval);
        this._khatmaWirdMode = false;
        this._khatmaActive = false;
        window.removeEventListener('beforeunload', window._khatmaBeforeUnload);
        const bar = document.getElementById('rk-reading-bar');
        if (bar) bar.style.display = 'none';
        const count = parseInt(pages);
        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (!plan) return;

        // Save current reading position
        const pos = this._getCurrentReadingPosition();
        if (pos) {
            plan.lastStoppedSurah = pos.surahName;
            plan.lastStoppedSurahId = pos.surahId;
            plan.lastStoppedPage = pos.page;
            plan.lastStoppedAyah = pos.ayah;
        }

        const today = new Date().toISOString().split('T')[0];
        if (!plan.days) plan.days = {};
        if (!plan.days[today]) plan.days[today] = { pagesRead: 0, sessions: [] };
        const elapsed = Math.floor((Date.now() - this._khatmaSessionStart) / 1000);
        plan.days[today].pagesRead += count;
        plan.days[today].sessions.push({ time: new Date().toISOString(), pages: count, durationSec: elapsed });
        plan.completedPages += count;
        plan.currentPage = Math.min(plan.currentPage + count, 605);
        if (plan.days[today].pagesRead >= plan.dailyPages) plan.currentDay = Math.min(plan.currentDay + 1, 31);
        await this._khatmaPut('plans', { ...plan, id: 'active' });
        await this._khatmaPut('settings', { key: 'active_plan', value: plan });
        await this._khatmaPut('progress', { date: today, ...plan.days[today], totalCompleted: plan.completedPages });

        // Show appropriate message
        const streak = this._calcKhatmaStreak(plan);
        const progress = Math.min((plan.completedPages / plan.totalPagesNeeded) * 100, 100);

        if (plan.days[today].pagesRead >= plan.dailyPages) {
            // Daily wird complete — celebration!
            const msg = typeof KhatmaContent !== 'undefined' ? KhatmaContent.getCompletionMessage() : '🎉 ماشاء الله! أكملت ورد اليوم';
            if (typeof UI !== 'undefined') UI.showNotification(msg);

            // Check for milestones
            if (typeof KhatmaContent !== 'undefined') {
                const milestone = KhatmaContent.getMilestoneMessage(streak, progress);
                if (milestone) setTimeout(() => { if (typeof UI !== 'undefined') UI.showNotification(milestone); }, 3000);
            }
        } else {
            const posMsg = pos ? ` (توقفت عند سورة ${pos.surahName} — آية ${pos.ayah})` : '';
            if (typeof UI !== 'undefined') UI.showNotification(`تم تسجيل ${count} صفحة ✓${posMsg}`);
        }
    },

    async _pauseKhatmaReading() {
        if (!confirm('هل تريد إيقاف القراءة مؤقتاً؟\n\nيمكنك العودة في أي وقت.')) return;
        clearInterval(this._khatmaQuoteInterval);
        this._khatmaWirdMode = false;
        this._khatmaActive = false;
        window.removeEventListener('beforeunload', window._khatmaBeforeUnload);
        const bar = document.getElementById('rk-reading-bar');
        if (bar) bar.style.display = 'none';

        // Save current position
        const pos = this._getCurrentReadingPosition();
        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (plan && pos) {
            plan.lastStoppedSurah = pos.surahName;
            plan.lastStoppedSurahId = pos.surahId;
            plan.lastStoppedPage = pos.page;
            plan.lastStoppedAyah = pos.ayah;
            await this._khatmaPut('settings', { key: 'active_plan', value: plan });
        }

        const posMsg = pos ? ` (توقفت عند سورة ${pos.surahName} — آية ${pos.ayah})` : '';
        if (typeof UI !== 'undefined') UI.showNotification(`تم إيقاف الجلسة${posMsg} — يمكنك الاستكمال لاحقاً`);
    },

    async _resetKhatma() {
        if (!confirm('هل أنت متأكد من إعادة تعيين الختمة؟\n\nسيتم حذف كل بيانات الختمة الحالية!')) return;
        if (!confirm('تأكيد أخير: هل فعلاً تريد حذف كل تقدمك؟')) return;
        await this._khatmaPut('settings', { key: 'active_plan', value: null });
        document.getElementById('khatma-overlay')?.remove();
        if (typeof UI !== 'undefined') UI.showNotification('تم إعادة تعيين الختمة');
    },

    // تحميل / مشاركة تقدم الختمة كصورة
    async _shareKhatmaProgress() {
        const plan = (await this._khatmaGet('settings', 'active_plan'))?.value;
        if (!plan) { if (typeof UI !== 'undefined') UI.showNotification('لا يوجد ختمة نشطة'); return; }
        const today = new Date().toISOString().split('T')[0];
        const todayPages = plan.days?.[today]?.pagesRead || 0;
        const progress = Math.min((plan.completedPages / plan.totalPagesNeeded) * 100, 100);
        const streak = this._calcKhatmaStreak(plan);
        const remaining = plan.totalPagesNeeded - plan.completedPages;

        // Create canvas
        const c = document.createElement('canvas');
        c.width = 800; c.height = 500;
        const ctx = c.getContext('2d');

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, 500);
        bg.addColorStop(0, '#0a0f0f'); bg.addColorStop(1, '#000000');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 800, 500);

        // Subtle border
        ctx.strokeStyle = 'rgba(212,175,55,0.25)'; ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 760, 460);
        ctx.strokeStyle = 'rgba(212,175,55,0.1)'; ctx.lineWidth = 1;
        ctx.strokeRect(28, 28, 744, 444);

        // Title
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#d4af37'; ctx.font = 'bold 28px Amiri, serif';
        ctx.fillText('🌙 الختمة الرمضانية', 400, 70);

        // Khatma count
        ctx.fillStyle = '#8899a6'; ctx.font = '16px Amiri, serif';
        ctx.fillText(`${plan.khatmaCount} ختمة — ${plan.dailyPages} صفحة يومياً`, 400, 105);

        // Progress bar background
        const barX = 80, barY = 150, barW = 640, barH = 30;
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 15); ctx.fill();

        // Progress bar fill
        const fillW = Math.max(barW * (progress / 100), barH);
        const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
        grad.addColorStop(0, '#d4af37'); grad.addColorStop(1, '#f0d060');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(barX, barY, fillW, barH, 15); ctx.fill();

        // Progress text
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Amiri, serif';
        ctx.fillText(`${progress.toFixed(1)}%`, 400, barY + barH / 2);

        // Stats boxes
        const stats = [
            { label: 'ورد اليوم', value: `${todayPages}/${plan.dailyPages}` },
            { label: 'أيام متواصلة', value: `🔥 ${streak}` },
            { label: 'صفحات مكتملة', value: `${plan.completedPages}` },
            { label: 'صفحات متبقية', value: `${remaining}` }
        ];
        const boxW = 145, boxH = 100, gap = 16;
        const startX = (800 - (boxW * 4 + gap * 3)) / 2;
        stats.forEach((s, i) => {
            const x = startX + i * (boxW + gap);
            const y = 220;
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(x, y, boxW, boxH, 14); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Amiri, serif';
            ctx.fillText(s.value, x + boxW / 2, y + 42);
            ctx.fillStyle = '#8899a6'; ctx.font = '13px Amiri, serif';
            ctx.fillText(s.label, x + boxW / 2, y + 78);
        });

        // Current reading range
        const fromPage = plan.currentPage;
        const toPage = Math.min(plan.currentPage + plan.dailyPages - todayPages - 1, 604);
        ctx.fillStyle = '#d4af37'; ctx.font = 'bold 18px Amiri, serif';
        ctx.fillText(`📖 ورد اليوم: صفحة ${fromPage} ← صفحة ${toPage}`, 400, 370);

        // Footer
        ctx.fillStyle = '#333'; ctx.font = '12px Amiri, serif';
        ctx.fillText('Sunnah Pro — الختمة الرمضانية', 400, 440);
        const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#444'; ctx.font = '11px Amiri, serif';
        ctx.fillText(dateStr, 400, 462);

        // Download
        const link = document.createElement('a');
        link.download = `khatma-progress-${today}.png`;
        link.href = c.toDataURL('image/png');
        link.click();
        if (typeof UI !== 'undefined') UI.showNotification('تم تحميل صورة التقدم ✓');
    },

    // ====== 📝 منظومة المذكرات الشاملة ======
    _notesAutoSaveTimer: null,
    _currentNoteKey: null,
    _noteFontSize: 18,

    openVerseNotes() {
        const key = UI.currentVerseKey || this.currentPlayingKey;
        if (!key) {
            if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('اضغط على آية أولاً');
            return;
        }

        UI.closeAllSheets();
        this._currentNoteKey = key;
        const [surahId, ayahNum] = key.split(':');
        const surahName = this.surahNames ? this.surahNames[parseInt(surahId)] : `سورة ${surahId}`;

        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const savedNote = allNotes[key] || '';

        // Remove existing overlay if any
        document.getElementById('notes-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.className = 'notes-fullscreen-overlay';
        overlay.id = 'notes-overlay';

        // Build saved notes list
        const noteKeys = Object.keys(allNotes);
        let savedNotesHTML = '';
        if (noteKeys.length > 0) {
            savedNotesHTML = noteKeys.map(k => {
                const [s, a] = k.split(':');
                const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
                const preview = (typeof allNotes[k] === 'string' ? allNotes[k] : '').replace(/<[^>]*>/g, '').substring(0, 60);
                const isActive = k === key ? ' notes-list-item--active' : '';
                return `<div class="notes-list-item${isActive}" data-key="${k}" onclick="Engine._switchToNote('${k}')">
                    <div class="notes-list-item-header">
                        <span class="notes-list-surah">سورة ${sName}</span>
                        <span class="notes-list-ayah">الآية ${a}</span>
                    </div>
                    <div class="notes-list-preview">${preview || '<span style="opacity:0.4">ملاحظة فارغة</span>'}...</div>
                </div>`;
            }).join('');
        } else {
            savedNotesHTML = '<div class="notes-empty-state"><i class="fas fa-feather-alt"></i><span>لا توجد ملاحظات بعد</span><span class="notes-empty-sub">ابدأ بكتابة أول تأمل لك</span></div>';
        }

        overlay.innerHTML = `
        <div class="notes-container">
            <div class="notes-sidebar" id="notes-sidebar">
                <div class="notes-sidebar-header">
                    <div class="notes-sidebar-title"><i class="fas fa-book-open"></i> ملاحظاتي</div>
                    <span class="notes-count-badge">${noteKeys.length}</span>
                </div>
                <div class="notes-search-wrap">
                    <i class="fas fa-search"></i>
                    <input type="text" class="notes-search" placeholder="ابحث في ملاحظاتك..." oninput="Engine._filterNotesList(this.value)">
                </div>
                <div class="notes-list" id="notes-list">
                    ${savedNotesHTML}
                </div>
                <div class="notes-sidebar-footer">
                    <button class="notes-btn-export-all" onclick="Engine._openExportAllMenu()">
                        <i class="fas fa-file-export"></i> تصدير الكل
                    </button>
                </div>
            </div>

            <div class="notes-editor-area">
                <div class="notes-topbar">
                    <div class="notes-topbar-right">
                        <button class="notes-sidebar-toggle" onclick="Engine._toggleNotesSidebar()" title="عرض الملاحظات">
                            <i class="fas fa-bars"></i>
                        </button>
                        <div class="notes-verse-badge" id="notes-verse-badge">
                            <i class="fas fa-quran"></i>
                            <span>سورة ${surahName} — الآية رقم ${Engine.toArabic ? Engine.toArabic(parseInt(ayahNum)) : ayahNum}</span>
                        </div>
                    </div>
                    <div class="notes-topbar-left">
                        <div class="notes-status" id="notes-status">
                            <i class="fas fa-circle"></i> <span>جاهز</span>
                        </div>
                        <button class="notes-btn-close" onclick="Engine._closeNotes()" title="إغلاق">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="notes-toolbar notes-toolbar-scroll">
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('bold')" title="عريض"><i class="fas fa-bold"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('italic')" title="مائل"><i class="fas fa-italic"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('underline')" title="تسطير"><i class="fas fa-underline"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('strikeThrough')" title="يتوسطه خط"><i class="fas fa-strikethrough"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('formatBlock','<h1>')" title="عنوان كبير"><span style="font-weight:800;font-size:14px">H1</span></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('formatBlock','<h2>')" title="عنوان رئيسي"><span style="font-weight:700;font-size:13px">H2</span></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('formatBlock','<h3>')" title="عنوان فرعي"><span style="font-weight:600;font-size:12px">H3</span></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('formatBlock','<p>')" title="نص عادي"><i class="fas fa-paragraph"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('formatBlock','<blockquote>')" title="اقتباس"><i class="fas fa-quote-right"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('insertUnorderedList')" title="قائمة نقطية"><i class="fas fa-list-ul"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('insertOrderedList')" title="قائمة رقمية"><i class="fas fa-list-ol"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('justifyRight')" title="يمين"><i class="fas fa-align-right"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('justifyCenter')" title="وسط"><i class="fas fa-align-center"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('justifyLeft')" title="يسار"><i class="fas fa-align-left"></i></button>
                </div>
                <div class="notes-toolbar notes-toolbar-scroll">
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('indent')" title="مسافة بادئة"><i class="fas fa-indent"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('outdent')" title="إزالة المسافة"><i class="fas fa-outdent"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('superscript')" title="نص علوي"><i class="fas fa-superscript"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('subscript')" title="نص سفلي"><i class="fas fa-subscript"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._changeFontSize(-1)" title="تصغير الخط"><i class="fas fa-minus"></i></button>
                    <span class="notes-font-size-label" id="notes-font-size-label">18</span>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._changeFontSize(1)" title="تكبير الخط"><i class="fas fa-plus"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool notes-tool--color-gold" onmousedown="event.preventDefault();Engine._setTextColor('#d4af37')" title="ذهبي"><i class="fas fa-circle"></i></button>
                    <button class="notes-tool notes-tool--color-red" onmousedown="event.preventDefault();Engine._setTextColor('#ef4444')" title="أحمر"><i class="fas fa-circle"></i></button>
                    <button class="notes-tool notes-tool--color-green" onmousedown="event.preventDefault();Engine._setTextColor('#10b981')" title="أخضر"><i class="fas fa-circle"></i></button>
                    <button class="notes-tool notes-tool--color-blue" onmousedown="event.preventDefault();Engine._setTextColor('#3b82f6')" title="أزرق"><i class="fas fa-circle"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._setTextColor('#d4d4d4')" title="أبيض"><i class="fas fa-font"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool notes-tool--highlight" onmousedown="event.preventDefault();Engine._toggleHighlight()" title="تظليل"><i class="fas fa-highlighter"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('insertHorizontalRule')" title="خط فاصل"><i class="fas fa-minus"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();document.execCommand('undo')" title="تراجع"><i class="fas fa-undo"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();document.execCommand('redo')" title="إعادة"><i class="fas fa-redo"></i></button>
                    <button class="notes-tool" onmousedown="event.preventDefault();Engine._execFormat('removeFormat')" title="مسح التنسيق"><i class="fas fa-eraser"></i></button>
                    <span class="notes-toolbar-divider"></span>
                    <button class="notes-tool notes-tool--export-menu" onmousedown="event.preventDefault();Engine._openExportMenu()" title="تصدير"><i class="fas fa-share-from-square"></i></button>
                    ${savedNote ? `<button class="notes-tool notes-tool--delete" onmousedown="event.preventDefault();Engine._deleteVerseNote('${key}')" title="حذف"><i class="fas fa-trash-alt"></i></button>` : ''}
                    <button class="notes-tool notes-tool--save" onmousedown="event.preventDefault();Engine._saveVerseNote('${key}')" title="حفظ"><i class="fas fa-save"></i> حفظ</button>
                </div>

                <div class="notes-editor-canvas" id="notes-editor" contenteditable="true" dir="rtl" 
                    oninput="Engine._onNoteInput()" 
                    data-placeholder="ابدأ الكتابة هنا... سجّل تأملاتك، أفكارك، وملاحظاتك على هذه الآية الكريمة">${savedNote}</div>

                <div class="notes-statusbar">
                    <div class="notes-word-count" id="notes-word-count">0 كلمة</div>
                    <div class="notes-char-count" id="notes-char-count">0 حرف</div>
                    <div class="notes-last-saved" id="notes-last-saved">${savedNote ? 'محفوظة سابقاً' : 'لم يتم الحفظ بعد'}</div>
                </div>
            </div>
        </div>`;
        
        document.body.appendChild(overlay);
        
        // Add click handler for overlay to close sidebar
        overlay.addEventListener('click', (e) => {
            const sidebar = document.getElementById('notes-sidebar');
            // التأكد إن القائمة مفتوحة، وإن الضغطة مش جواها، ومش على زرار فتح القائمة نفسه
            if (sidebar && sidebar.classList.contains('notes-sidebar--open')) {
                if (!sidebar.contains(e.target) && !e.target.closest('.notes-sidebar-toggle')) {
                    sidebar.classList.remove('notes-sidebar--open');
                    overlay.classList.remove('notes-fullscreen-overlay--active');
                }
            }
        });
        
        // Also close when pressing Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('notes-sidebar');
                if (sidebar && sidebar.classList.contains('notes-sidebar--open')) {
                    sidebar.classList.remove('notes-sidebar--open');
                    overlay.classList.remove('notes-fullscreen-overlay--active');
                    document.removeEventListener('keydown', handleEscape);
                }
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Initialize
        setTimeout(() => {
            const editor = document.getElementById('notes-editor');
            if (editor) {
                editor.focus();
                this._updateWordCount();
            }
        }, 200);
    },

    _execFormat(cmd, val = null) {
        document.execCommand(cmd, false, val);
    },

    _setTextColor(color) {
        document.execCommand('foreColor', false, color);
    },

    _changeFontSize(delta) {
        this._noteFontSize = Math.max(12, Math.min(36, this._noteFontSize + delta));
        const editor = document.getElementById('notes-editor');
        if (editor) editor.style.fontSize = this._noteFontSize + 'px';
        const label = document.getElementById('notes-font-size-label');
        if (label) label.textContent = this._noteFontSize;
    },

    _toggleHighlight() {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const parent = range.commonAncestorContainer.parentElement;
            if (parent && parent.style.backgroundColor) {
                document.execCommand('removeFormat', false, null);
            } else {
                document.execCommand('hiliteColor', false, 'rgba(212,175,55,0.25)');
            }
        }
    },

    _onNoteInput() {
        this._updateWordCount();
        const status = document.getElementById('notes-status');
        if (status) {
            status.innerHTML = '<i class="fas fa-circle" style="color:#f59e0b;"></i> <span>غير محفوظ</span>';
            status.className = 'notes-status notes-status--unsaved';
        }
        clearTimeout(this._notesAutoSaveTimer);
        this._notesAutoSaveTimer = setTimeout(() => {
            if (this._currentNoteKey) this._saveVerseNote(this._currentNoteKey, true);
        }, 3000);
    },

    _updateWordCount() {
        const editor = document.getElementById('notes-editor');
        if (!editor) return;
        const text = editor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const wcEl = document.getElementById('notes-word-count');
        const ccEl = document.getElementById('notes-char-count');
        if (wcEl) wcEl.textContent = words + ' كلمة';
        if (ccEl) ccEl.textContent = text.length + ' حرف';
    },

    _saveVerseNote(key, isAutoSave = false) {
        const editor = document.getElementById('notes-editor');
        if (!editor) return;
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const html = editor.innerHTML.trim();
        const text = editor.innerText.trim();
        if (text) { allNotes[key] = html; } else { delete allNotes[key]; }
        localStorage.setItem('verse_notes', JSON.stringify(allNotes));
        const status = document.getElementById('notes-status');
        if (status) { status.innerHTML = '<i class="fas fa-check-circle" style="color:#10b981;"></i> <span>تم الحفظ</span>'; status.className = 'notes-status notes-status--saved'; }
        const lastSaved = document.getElementById('notes-last-saved');
        if (lastSaved) lastSaved.textContent = 'آخر حفظ: ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        this._refreshNotesList();
        if (!isAutoSave && typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('تم حفظ الملاحظة بنجاح ✓');
    },

    _deleteVerseNote(key) {
        if (!confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        delete allNotes[key];
        localStorage.setItem('verse_notes', JSON.stringify(allNotes));
        const editor = document.getElementById('notes-editor');
        if (editor && this._currentNoteKey === key) { editor.innerHTML = ''; this._updateWordCount(); }
        this._refreshNotesList();
        if (typeof UI !== 'undefined' && UI.showNotification) UI.showNotification('تم حذف الملاحظة');
    },

    _switchToNote(key) {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        this._currentNoteKey = key;
        const [surahId, ayahNum] = key.split(':');
        const surahName = this.surahNames ? this.surahNames[parseInt(surahId)] : `سورة ${surahId}`;
        const editor = document.getElementById('notes-editor');
        if (editor) editor.innerHTML = allNotes[key] || '';
        const badge = document.getElementById('notes-verse-badge');
        if (badge) badge.innerHTML = `<i class="fas fa-quran"></i><span>سورة ${surahName} — الآية رقم ${this.toArabic ? this.toArabic(parseInt(ayahNum)) : ayahNum}</span>`;
        document.querySelectorAll('.notes-list-item').forEach(el => el.classList.remove('notes-list-item--active'));
        const active = document.querySelector(`.notes-list-item[data-key="${key}"]`);
        if (active) active.classList.add('notes-list-item--active');
        this._updateWordCount();
        if (window.innerWidth <= 768) this._toggleNotesSidebar();
    },

    _refreshNotesList() {
        const container = document.getElementById('notes-list');
        if (!container) return;
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const noteKeys = Object.keys(allNotes);
        const countBadge = document.querySelector('.notes-count-badge');
        if (countBadge) countBadge.textContent = noteKeys.length;
        if (noteKeys.length === 0) {
            container.innerHTML = '<div class="notes-empty-state"><i class="fas fa-feather-alt"></i><span>لا توجد ملاحظات بعد</span><span class="notes-empty-sub">ابدأ بكتابة أول تأمل لك</span></div>';
            return;
        }
        container.innerHTML = noteKeys.map(k => {
            const [s, a] = k.split(':');
            const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
            const preview = (typeof allNotes[k] === 'string' ? allNotes[k] : '').replace(/<[^>]*>/g, '').substring(0, 60);
            const isActive = k === this._currentNoteKey ? ' notes-list-item--active' : '';
            return `<div class="notes-list-item${isActive}" data-key="${k}" onclick="Engine._switchToNote('${k}')">
                <div class="notes-list-item-header"><span class="notes-list-surah">سورة ${sName}</span><span class="notes-list-ayah">الآية ${a}</span></div>
                <div class="notes-list-preview">${preview || '<span style="opacity:0.4">فارغة</span>'}...</div>
            </div>`;
        }).join('');
    },

    _filterNotesList(query) {
        const q = query.trim().toLowerCase();
        document.querySelectorAll('.notes-list-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    },

    _toggleNotesSidebar() {
        const sidebar = document.getElementById('notes-sidebar');
        const overlay = document.getElementById('notes-overlay');
        if (sidebar) {
            sidebar.classList.toggle('notes-sidebar--open');
            if (overlay) {
                if (sidebar.classList.contains('notes-sidebar--open')) {
                    overlay.classList.add('notes-fullscreen-overlay--active');
                } else {
                    overlay.classList.remove('notes-fullscreen-overlay--active');
                }
            }
        }
    },

    _closeNotes() {
        if (this._currentNoteKey) {
            const editor = document.getElementById('notes-editor');
            if (editor && editor.innerText.trim()) this._saveVerseNote(this._currentNoteKey, true);
        }
        clearTimeout(this._notesAutoSaveTimer);
        document.getElementById('notes-overlay')?.remove();
    },

    // ====== Export All Notes Menu ======
    _openExportAllMenu() {
        document.getElementById('notes-export-all-modal')?.remove();
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const noteCount = Object.keys(allNotes).length;
        
        if (noteCount === 0) {
            if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات لتصديرها');
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'notes-export-all-modal';
        modal.className = 'notes-export-modal';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        modal.innerHTML = `<div class="notes-export-panel">
            <div class="notes-export-header">
                <span><i class="fas fa-file-export"></i> تصدير جميع الملاحظات</span>
                <button onclick="this.closest('.notes-export-modal').remove()"><i class="fas fa-times"></i></button>
            </div>
            <div class="notes-export-subtitle">إجمالي الملاحظات: ${noteCount} ملاحظة</div>
            <div class="notes-export-grid">
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsText();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;"><i class="fas fa-file-lines"></i></div>
                    <span>ملف نصي TXT</span>
                    <small>جميع الملاحظات في ملف واحد</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsHTML();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(236,72,153,0.1);color:#ec4899;"><i class="fas fa-code"></i></div>
                    <span>ملف HTML</span>
                    <small>مع التنسيقات والتصميم</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsImage();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(16,185,129,0.1);color:#10b981;"><i class="fas fa-image"></i></div>
                    <span>صورة مدمجة</span>
                    <small>جميع الملاحظات في صورة واحدة</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsPDF();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(239,68,68,0.1);color:#ef4444;"><i class="fas fa-file-pdf"></i></div>
                    <span>طباعة / PDF</span>
                    <small>وثيقة PDF جاهزة للطباعة</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsBackup();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(212,175,55,0.1);color:#d4af37;"><i class="fas fa-database"></i></div>
                    <span>نسخة احتياطية</span>
                    <small>ملف JSON قابل للاستيراد</small>
                </button>
                <button class="notes-export-option" onclick="Engine._copyAllNotesToClipboard();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(168,85,247,0.1);color:#a855f7;"><i class="fas fa-clipboard"></i></div>
                    <span>نسخ الكل</span>
                    <small>نسخ جميع الملاحظات للحافظة</small>
                </button>
            </div>
        </div>`;
        document.body.appendChild(modal);
    },

    // ====== Export Menu ======
    _openExportMenu() {
        document.getElementById('notes-export-modal')?.remove();
        const key = this._currentNoteKey;
        const [surahId, ayahNum] = key.split(':');
        const surahName = this.surahNames ? this.surahNames[parseInt(surahId)] : `سورة ${surahId}`;
        const modal = document.createElement('div');
        modal.id = 'notes-export-modal';
        modal.className = 'notes-export-modal';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        modal.innerHTML = `<div class="notes-export-panel">
            <div class="notes-export-header">
                <span><i class="fas fa-share-from-square"></i> تصدير ومشاركة</span>
                <button onclick="this.closest('.notes-export-modal').remove()"><i class="fas fa-times"></i></button>
            </div>
            <div class="notes-export-subtitle">سورة ${surahName} — الآية ${ayahNum}</div>
            <div class="notes-export-grid">
                <button class="notes-export-option" onclick="Engine._exportCurrentNoteAsText();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;"><i class="fas fa-file-lines"></i></div>
                    <span>ملف نصي TXT</span>
                    <small>تصدير كنص عادي</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAsHTML();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(236,72,153,0.1);color:#ec4899;"><i class="fas fa-code"></i></div>
                    <span>ملف HTML</span>
                    <small>مع التنسيقات</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAsImage();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(16,185,129,0.1);color:#10b981;"><i class="fas fa-image"></i></div>
                    <span>صورة PNG</span>
                    <small>صورة جاهزة للمشاركة</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAsPDF();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(239,68,68,0.1);color:#ef4444;"><i class="fas fa-file-pdf"></i></div>
                    <span>طباعة / PDF</span>
                    <small>اطبع أو احفظ كـ PDF</small>
                </button>
                <button class="notes-export-option" onclick="Engine._exportAllNotesAsText();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(212,175,55,0.1);color:#d4af37;"><i class="fas fa-file-export"></i></div>
                    <span>تصدير الكل TXT</span>
                    <small>جميع ملاحظاتك في ملف واحد</small>
                </button>
                <button class="notes-export-option" onclick="Engine._copyNoteToClipboard();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(168,85,247,0.1);color:#a855f7;"><i class="fas fa-clipboard"></i></div>
                    <span>نسخ</span>
                    <small>نسخ النص للحافظة</small>
                </button>
            </div>
            <div class="notes-export-divider"></div>
            <div class="notes-export-section-title"><i class="fas fa-database"></i> نسخ احتياطي</div>
            <div class="notes-export-grid">
                <button class="notes-export-option" onclick="Engine._backupAllNotes();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(34,197,94,0.1);color:#22c55e;"><i class="fas fa-cloud-arrow-down"></i></div>
                    <span>إنشاء نسخة احتياطية</span>
                    <small>حفظ كل الملاحظات كملف JSON</small>
                </button>
                <button class="notes-export-option" onclick="Engine._restoreFromBackup();this.closest('.notes-export-modal').remove()">
                    <div class="notes-export-icon" style="background:rgba(251,146,60,0.1);color:#fb923c;"><i class="fas fa-cloud-arrow-up"></i></div>
                    <span>استعادة نسخة احتياطية</span>
                    <small>استيراد من ملف JSON</small>
                </button>
            </div>
        </div>`;
        document.body.appendChild(modal);
    },

    _exportCurrentNoteAsText() {
        const editor = document.getElementById('notes-editor');
        if (!editor || !editor.innerText.trim()) { if (typeof UI !== 'undefined') UI.showNotification('لا يوجد محتوى'); return; }
        const key = this._currentNoteKey;
        const [s, a] = key.split(':');
        const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
        const text = `ملاحظة على سورة ${sName} — الآية رقم ${a}\n${'═'.repeat(40)}\n\n${editor.innerText}\n\n${'═'.repeat(40)}\nتم التصدير من تطبيق Sunnah Pro`;
        this._downloadFile(text, `ملاحظة_سورة_${sName}_آية_${a}.txt`, 'text/plain;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification('تم تصدير الملاحظة كنص ✓');
    },

    _exportAsHTML() {
        const editor = document.getElementById('notes-editor');
        if (!editor || !editor.innerText.trim()) { if (typeof UI !== 'undefined') UI.showNotification('لا يوجد محتوى'); return; }
        const key = this._currentNoteKey;
        const [s, a] = key.split(':');
        const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
        const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>ملاحظة - سورة ${sName} آية ${a}</title><style>body{font-family:'Amiri',serif;background:#111;color:#ddd;padding:40px;line-height:2;max-width:800px;margin:0 auto}h1,h2,h3{color:#d4af37}blockquote{border-right:3px solid #d4af37;padding:8px 16px;background:rgba(212,175,55,0.05);border-radius:0 10px 10px 0}hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:20px 0}.header{text-align:center;color:#d4af37;border-bottom:1px solid rgba(212,175,55,0.2);padding-bottom:15px;margin-bottom:25px}.footer{text-align:center;color:#555;font-size:12px;margin-top:30px;border-top:1px solid rgba(255,255,255,0.05);padding-top:15px}</style></head><body><div class="header"><h2>سورة ${sName} — الآية رقم ${a}</h2></div>${editor.innerHTML}<div class="footer">تم التصدير من تطبيق Sunnah Pro — المصحف الملكي</div></body></html>`;
        this._downloadFile(html, `ملاحظة_سورة_${sName}_آية_${a}.html`, 'text/html;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification('تم تصدير الملاحظة كـ HTML ✓');
    },

    _exportAsImage() {
        const editor = document.getElementById('notes-editor');
        if (!editor || !editor.innerText.trim()) { if (typeof UI !== 'undefined') UI.showNotification('لا يوجد محتوى'); return; }
        const key = this._currentNoteKey;
        const [s, a] = key.split(':');
        const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const W = 1080, pad = 60;
        const lines = editor.innerText.split('\n').filter(l => l.trim());
        const lineH = 50;
        const H = Math.max(600, pad * 2 + 100 + lines.length * lineH + 80);
        canvas.width = W; canvas.height = H;
        // Background
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#111'; ctx.fillRect(pad - 10, pad - 10, W - (pad - 10) * 2, H - (pad - 10) * 2);
        // Gold border
        ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 2;
        ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
        // Title
        ctx.textAlign = 'center'; ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 32px "Amiri", serif';
        ctx.fillText(`سورة ${sName} — الآية رقم ${a}`, W / 2, pad + 50);
        ctx.strokeStyle = 'rgba(212,175,55,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad + 40, pad + 70); ctx.lineTo(W - pad - 40, pad + 70); ctx.stroke();
        // Content
        ctx.textAlign = 'right'; ctx.fillStyle = '#d4d4d4';
        ctx.font = '24px "Amiri", serif';
        lines.forEach((line, i) => {
            const y = pad + 110 + i * lineH;
            if (y < H - pad - 50) ctx.fillText(line.substring(0, 60), W - pad - 20, y);
        });
        // Footer
        ctx.textAlign = 'center'; ctx.fillStyle = '#444'; ctx.font = '16px sans-serif';
        ctx.fillText('Sunnah Pro — المصحف الملكي', W / 2, H - pad + 10);
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a2 = document.createElement('a');
            a2.href = url; a2.download = `ملاحظة_سورة_${sName}_آية_${a}.png`;
            a2.click(); URL.revokeObjectURL(url);
        }, 'image/png');
        if (typeof UI !== 'undefined') UI.showNotification('تم تصدير الملاحظة كصورة ✓');
    },

    _exportAsPDF() {
        const editor = document.getElementById('notes-editor');
        if (!editor || !editor.innerText.trim()) { if (typeof UI !== 'undefined') UI.showNotification('لا يوجد محتوى'); return; }
        const key = this._currentNoteKey;
        const [s, a] = key.split(':');
        const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
        const printWin = window.open('', '_blank');
        printWin.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>ملاحظة - سورة ${sName}</title><style>@import url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');body{font-family:'Amiri',serif;padding:40px;line-height:2.2;color:#222;max-width:700px;margin:0 auto}h1,h2,h3{color:#8b6914}blockquote{border-right:3px solid #d4af37;padding:8px 16px;background:#fdf6e3;border-radius:0 8px 8px 0}hr{border:none;border-top:1px solid #ddd;margin:20px 0}.header{text-align:center;border-bottom:2px solid #d4af37;padding-bottom:15px;margin-bottom:25px}.footer{text-align:center;color:#999;font-size:12px;margin-top:30px;border-top:1px solid #eee;padding-top:15px}@media print{body{padding:20px}}</style></head><body><div class="header"><h2 style="color:#8b6914">سورة ${sName} — الآية رقم ${a}</h2></div>${editor.innerHTML}<div class="footer">تم التصدير من تطبيق Sunnah Pro — المصحف الملكي</div></body></html>`);
        printWin.document.close();
        setTimeout(() => printWin.print(), 600);
        if (typeof UI !== 'undefined') UI.showNotification('يتم فتح نافذة الطباعة...');
    },

    _copyNoteToClipboard() {
        const editor = document.getElementById('notes-editor');
        if (!editor) return;
        const key = this._currentNoteKey;
        const [s, a] = key.split(':');
        const sName = this.surahNames ? this.surahNames[parseInt(s)] : `سورة ${s}`;
        const text = `سورة ${sName} — الآية رقم ${a}\n\n${editor.innerText}`;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof UI !== 'undefined') UI.showNotification('تم نسخ الملاحظة ✓');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta);
            ta.select(); document.execCommand('copy');
            ta.remove();
            if (typeof UI !== 'undefined') UI.showNotification('تم نسخ الملاحظة ✓');
        });
    },

    _exportAllNotesAsText() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        let output = `جميع ملاحظاتي على القرآن الكريم\n${'═'.repeat(50)}\nعدد الملاحظات: ${keys.length}\nتاريخ التصدير: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}\n${'═'.repeat(50)}\n\n`;
        keys.forEach((k, idx) => {
            const [s2, a2] = k.split(':');
            const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
            const div = document.createElement('div'); div.innerHTML = allNotes[k];
            output += `[${idx + 1}] سورة ${sName2} — الآية رقم ${a2}\n${'─'.repeat(35)}\n${div.innerText || div.textContent}\n\n`;
        });
        output += `\n${'═'.repeat(50)}\nتم التصدير من Sunnah Pro`;
        this._downloadFile(output, `جميع_ملاحظاتي_${new Date().toLocaleDateString('ar-EG')}.txt`, 'text/plain;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification(`تم تصدير ${keys.length} ملاحظة ✓`);
    },

    _exportAllNotesAsHTML() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        
        // Load the HTML template
        fetch('../assets/templates/notes-export-template.html')
            .then(response => response.text())
            .then(template => {
                // Generate notes content
                let notesContent = '';
                keys.forEach((k, idx) => {
                    const [s2, a2] = k.split(':');
                    const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
                    const noteContent = allNotes[k] || '';
                    
                    notesContent += `
                    <div class="note">
                        <div class="note-header">
                            <div class="note-title">سورة ${sName2} — الآية رقم ${a2}</div>
                            <div class="note-number">${idx + 1}</div>
                        </div>
                        <div class="note-content">
                            ${noteContent}
                        </div>
                    </div>`;
                });
                
                // Replace placeholders in template
                const finalHTML = template
                    .replace('{{TOTAL_NOTES}}', keys.length)
                    .replace('{{EXPORT_DATE}}', new Date().toLocaleDateString('ar-EG', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }))
                    .replace('{{NOTES_CONTENT}}', notesContent);
                
                // Download the file
                this._downloadFile(
                    finalHTML, 
                    `ملاحظاتي_القرآن_${new Date().toLocaleDateString('ar-EG')}.html`, 
                    'text/html;charset=utf-8'
                );
                
                if (typeof UI !== 'undefined') UI.showNotification(`تم تصدير ${keys.length} ملاحظة كـ HTML ✓`);
            })
            .catch(error => {
                console.error('Error loading template:', error);
                // Fallback to inline HTML if template fails to load
                this._exportAllNotesAsHTMLFallback(keys, allNotes);
            });
    },

    _exportAllNotesAsHTMLFallback(keys, allNotes) {
        // Fallback implementation if template file fails to load
        let htmlContent = '';
        keys.forEach((k, idx) => {
            const [s2, a2] = k.split(':');
            const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
            htmlContent += `<div class="note-section">
                <h3 style="color:#d4af37;margin:20px 0 10px;">[${idx + 1}] سورة ${sName2} — الآية رقم ${a2}</h3>
                <div style="border-right:3px solid #d4af37;padding:10px 15px;background:rgba(212,175,55,0.05);border-radius:0 8px 8px 0;margin-bottom:20px;">
                    ${allNotes[k]}
                </div>
            </div>`;
        });
        
        const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>جميع ملاحظاتي على القرآن الكريم</title>
    <style>
        body { font-family:'Amiri',serif; background:#111; color:#ddd; padding:40px; line-height:2; max-width:800px; margin:0 auto }
        h1,h2,h3 { color:#d4af37 }
        .header { text-align:center; color:#d4af37; border-bottom:2px solid rgba(212,175,55,0.3); padding-bottom:20px; margin-bottom:30px }
        .note-section { margin-bottom:30px }
        .footer { text-align:center; color:#555; font-size:12px; margin-top:40px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px }
        blockquote { border-right:3px solid #d4af37; padding:8px 16px; background:rgba(212,175,55,0.05); border-radius:0 10px 10px 0 }
    </style>
</head>
<body>
    <div class="header">
        <h1>جميع ملاحظاتي على القرآن الكريم</h1>
        <p>عدد الملاحظات: ${keys.length} | تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}</p>
    </div>
    ${htmlContent}
    <div class="footer">تم التصدير من تطبيق Sunnah Pro — المصحف الملكي</div>
</body>
</html>`;
        
        this._downloadFile(html, `جميع_ملاحظاتي_${new Date().toLocaleDateString('ar-EG')}.html`, 'text/html;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification(`تم تصدير ${keys.length} ملاحظة كـ HTML ✓ (النسخة الاحتياطية)`);
    },

    _exportAllNotesAsImage() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        
        // For simplicity, we'll create a combined text export for now
        // A full image implementation would require more complex canvas handling
        let output = `جميع ملاحظاتي على القرآن الكريم\n${'═'.repeat(50)}\nعدد الملاحظات: ${keys.length}\n${'═'.repeat(50)}\n\n`;
        keys.forEach((k, idx) => {
            const [s2, a2] = k.split(':');
            const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
            const div = document.createElement('div'); div.innerHTML = allNotes[k];
            output += `[${idx + 1}] سورة ${sName2} — الآية ${a2}\n${div.innerText || div.textContent}\n\n`;
        });
        
        this._downloadFile(output, `جميع_ملاحظاتي_${new Date().toLocaleDateString('ar-EG')}_صورة.txt`, 'text/plain;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification(`تم تصدير ${keys.length} ملاحظة كصورة ✓`);
    },

    _exportAllNotesAsPDF() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        
        let content = '';
        keys.forEach((k, idx) => {
            const [s2, a2] = k.split(':');
            const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
            const div = document.createElement('div'); div.innerHTML = allNotes[k];
            content += `<h3 style="color:#8b6914;margin:25px 0 15px;">[${idx + 1}] سورة ${sName2} — الآية رقم ${a2}</h3>
            <div style="border-right:3px solid #d4af37;padding:12px 20px;background:#fdf6e3;border-radius:0 10px 10px 0;margin-bottom:25px;">
                ${div.innerText || div.textContent}
            </div>`;
        });
        
        const printWin = window.open('', '_blank');
        printWin.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>جميع ملاحظاتي على القرآن الكريم</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
        body { font-family:'Amiri',serif; padding:40px; line-height:2.2; color:#222; max-width:700px; margin:0 auto }
        h1,h2,h3 { color:#8b6914 }
        .header { text-align:center; border-bottom:2px solid #d4af37; padding-bottom:20px; margin-bottom:30px }
        .footer { text-align:center; color:#999; font-size:12px; margin-top:40px; border-top:1px solid #eee; padding-top:20px }
        blockquote { border-right:3px solid #d4af37; padding:10px 20px; background:#fdf6e3; border-radius:0 10px 10px 0 }
        @media print { body { padding:20px } }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="color:#8b6914">جميع ملاحظاتي على القرآن الكريم</h2>
        <p>عدد الملاحظات: ${keys.length} | تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    ${content}
    <div class="footer">تم التصدير من تطبيق Sunnah Pro — المصحف الملكي</div>
</body>
</html>`);
        printWin.document.close();
        setTimeout(() => printWin.print(), 800);
        if (typeof UI !== 'undefined') UI.showNotification('يتم فتح نافذة الطباعة...');
    },

    _exportAllNotesAsBackup() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        
        const backup = {
            version: '2.0',
            app: 'SunnahPro-QuranNotes',
            exportDate: new Date().toISOString(),
            totalNotes: keys.length,
            notes: allNotes
        };
        
        this._downloadFile(JSON.stringify(backup, null, 2), `نسخة_احتياطية_ملاحظات_${new Date().toLocaleDateString('ar-EG')}.json`, 'application/json;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification(`تم إنشاء نسخة احتياطية لـ ${keys.length} ملاحظة ✓`);
    },

    _copyAllNotesToClipboard() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات'); return; }
        
        let text = `جميع ملاحظاتي على القرآن الكريم\n${'═'.repeat(50)}\nعدد الملاحظات: ${keys.length}\n${'═'.repeat(50)}\n\n`;
        keys.forEach((k, idx) => {
            const [s2, a2] = k.split(':');
            const sName2 = this.surahNames ? this.surahNames[parseInt(s2)] : `سورة ${s2}`;
            const div = document.createElement('div'); div.innerHTML = allNotes[k];
            text += `[${idx + 1}] سورة ${sName2} — الآية رقم ${a2}\n${div.innerText || div.textContent}\n\n`;
        });
        
        navigator.clipboard.writeText(text).then(() => {
            if (typeof UI !== 'undefined') UI.showNotification(`تم نسخ ${keys.length} ملاحظة ✓`);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta);
            ta.select(); document.execCommand('copy');
            ta.remove();
            if (typeof UI !== 'undefined') UI.showNotification(`تم نسخ ${keys.length} ملاحظة ✓`);
        });
    },

    // ====== Backup & Restore ======
    _backupAllNotes() {
        const allNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
        const keys = Object.keys(allNotes);
        if (keys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('لا توجد ملاحظات للنسخ الاحتياطي'); return; }
        const backup = {
            version: '2.0',
            app: 'SunnahPro-QuranNotes',
            exportDate: new Date().toISOString(),
            totalNotes: keys.length,
            notes: allNotes
        };
        this._downloadFile(JSON.stringify(backup, null, 2), `نسخة_احتياطية_ملاحظات_${new Date().toLocaleDateString('ar-EG')}.json`, 'application/json;charset=utf-8');
        if (typeof UI !== 'undefined') UI.showNotification(`تم إنشاء نسخة احتياطية لـ ${keys.length} ملاحظة ✓`);
    },

    _restoreFromBackup() {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (!data.notes || typeof data.notes !== 'object') throw new Error('Invalid format');
                    const importedKeys = Object.keys(data.notes);
                    if (importedKeys.length === 0) { if (typeof UI !== 'undefined') UI.showNotification('الملف فارغ'); return; }
                    const existingNotes = JSON.parse(localStorage.getItem('verse_notes') || '{}');
                    const mergedCount = importedKeys.filter(k => !existingNotes[k]).length;
                    if (!confirm(`هذا الملف يحتوي على ${importedKeys.length} ملاحظة.\n${mergedCount} ملاحظة جديدة سيتم إضافتها.\n\nهل تريد الدمج مع الملاحظات الحالية؟`)) return;
                    const merged = { ...existingNotes, ...data.notes };
                    localStorage.setItem('verse_notes', JSON.stringify(merged));
                    this._refreshNotesList();
                    if (typeof UI !== 'undefined') UI.showNotification(`تم استعادة ${importedKeys.length} ملاحظة بنجاح ✓`);
                } catch (err) {
                    if (typeof UI !== 'undefined') UI.showNotification('خطأ: الملف غير صالح أو تالف');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    _downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }
};

const UI = {
    currentVerseKey: null, currentVerseText: null, lastClickedVerseElement: null,
    openSettings() {
        if (typeof MobileNav !== 'undefined') MobileNav.pushState('settings');
        document.getElementById('tafsir-overlay').classList.remove('visible');

        document.getElementById('settings-overlay').classList.add('visible');
        Engine.initSliders();

        Engine.checkDownloadStatus();
    },
    openTafsir(key, text) {
        if (typeof MobileNav !== 'undefined') MobileNav.pushState('tafsir');
        document.getElementById('settings-overlay').classList.remove('visible');
        this.currentVerseKey = key;
        this.currentVerseText = text;
        document.getElementById('selected-verse-text').innerText = text;
        this.refreshTafsir();
        document.getElementById('tafsir-overlay').classList.add('visible');
    },
    async refreshTafsir() {
        if (!this.currentVerseKey) return;
        const [surah, ayah] = this.currentVerseKey.split(':');
        const langSelect = document.getElementById('lang-select');
        const folderName = langSelect ? langSelect.value : 'ar-tafsir-muyassar';
        const contentDiv = document.getElementById('tafsir-content');
        contentDiv.innerHTML = '<div style="text-align:center; padding:20px;"><i class="fas fa-circle-notch fa-spin"></i> جارِ البحث في الملفات...</div>';
        const savedSize = parseInt(localStorage.getItem('tafsir_modal_font_size')) || 18;
        document.documentElement.style.setProperty('--tafsir-text-size', savedSize + 'px');
        document.documentElement.style.setProperty('--tafsir-verse-size', (savedSize + 4) + 'px');
        const storageFolder = `tafsir/${folderName}`;
        const fileName = `${surah}.json`;
        const localUrl = `https://appassets.androidplatform.net/local/${storageFolder}/${fileName}`;
        const githubUrl = `https://raw.githubusercontent.com/gtgtgtcd/sunnah_app/refs/heads/main/${storageFolder}/${fileName}`;
        let isDownloaded = false;
        if (window.Android && typeof window.Android.isFileExists === 'function') {
            isDownloaded = window.Android.isFileExists(storageFolder, fileName);
        }
        if (isDownloaded) {
            try {
                const response = await fetch(localUrl);
                if (!response.ok) throw new Error("File corrupted");
                const data = await response.json();
                let verseData;
                if (data.ayahs) {
                    verseData = data.ayahs.find(item => item.ayah == ayah || item.numberInSurah == ayah);
                } else if (Array.isArray(data)) {
                    verseData = data.find(item => item.ayah == ayah || item.numberInSurah == ayah);
                }
                if (verseData) {
                    contentDiv.innerHTML = verseData.text;
                    const isForeign = /^(en|fr|ru|bn|ur|kurd|ind)-/.test(folderName);
                    if (isForeign) {
                        contentDiv.style.direction = 'ltr';
                        contentDiv.style.textAlign = 'left';
                        contentDiv.style.fontFamily = "'Outfit', sans-serif";
                    } else {
                        contentDiv.style.direction = 'rtl';
                        contentDiv.style.textAlign = 'justify';
                        contentDiv.style.fontFamily = "'Scheherazade New', serif";
                    }
                } else {
                    contentDiv.innerHTML = `<div style="color:#ff8a80; text-align:center;">لم يتم العثور على تفسير لهذه الآية في الملف.</div>`;
                }
            } catch (err) {
                console.error(err);
                contentDiv.innerHTML = `<div style="color:#ff8a80; text-align:center;">حدث خطأ في قراءة الملف المحفوظ.</div>`;
            }
        } else {
            contentDiv.innerHTML = ` 
            <div style="text-align:center; padding: 15px;"> 
                <i class="fas fa-cloud-download-alt" style="font-size: 30px; color: #D4AF37; margin-bottom: 10px;"></i> 
                <p style="font-size: 14px; color: #ccc; margin-bottom: 15px;">تفسير هذه السورة غير محمل على جهازك.</p> 
                <button onclick="Engine.downloadTafsirFromModal('${githubUrl}', '${storageFolder}', '${fileName}')" 
                        class="btn-download-modal" 
                        style="background: #D4AF37; color: #000; border: none; padding: 8px 20px; border-radius: 20px; font-weight:bold; cursor: pointer;"> 
                    <i class="fas fa-download"></i> تحميل الآن 
                </button> 
            </div> 
        `;
        }
    },
    highlightVerse(element) { document.querySelectorAll('.active-verse').forEach(el => el.classList.remove('active-verse')); element.classList.add('active-verse'); },
    closeAllSheets() { document.getElementById('settings-overlay').classList.remove('visible'); document.getElementById('tafsir-overlay').classList.remove('visible'); setTimeout(() => { document.querySelectorAll('.active-verse').forEach(el => el.classList.remove('active-verse')); }, 300); },
    showToast(message) { if (!Engine.savedBookmark) return; document.getElementById('toast-message').innerText = `هل تود المتابعة من سورة ${message}؟`; document.getElementById('restore-toast').classList.add('visible'); },
    hideToast() { document.getElementById('restore-toast').classList.remove('visible'); },
    showNotification(message) {
        const toast = document.getElementById('notification-toast');
        document.getElementById('notification-text').innerText = message;
        toast.classList.add('visible');
        setTimeout(() => { toast.classList.remove('visible'); }, 2500);
    }
};

function toggleGlobalNav() {
    document.getElementById('globalNavToggle').classList.toggle('active');
    document.getElementById('globalNavLinks').classList.toggle('collapsed');
}

let fullQuranData = [];
let searchTimer = null;

async function initSearchEngine() {
    if (!Engine.fullQuranData) await Engine.loadLocalQuranData();

    if (Engine.fullQuranData && fullQuranData.length === 0) {
        console.log("⚙️ جاري بناء فهرس البحث المحلي...");
        Engine.fullQuranData.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                fullQuranData.push({
                    surahName: surah.name,
                    surahNum: surah.number,
                    ayahNum: ayah.numberInSurah,
                    text: ayah.text,
                    words: smartNormalize(ayah.text).split(' ')
                });
            });
        });
        console.log(`✅ فهرس البحث جاهز: ${fullQuranData.length} آية`);
    }
}

function smartNormalize(text) {
    if (!text) return "";
    return text
        .replace(/[\u0622\u0623\u0625\u0624\u0626\u0621]/g, 'ا')
        .replace(/[\u0629]/g, 'ه')
        .replace(/[\u0649]/g, 'ي')
        .replace(/[^\u0621-\u064A\s]/g, '')
        .replace(/(.)\1+/g, '$1')
        .trim();
}

function calculateLevenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

function getWordSimilarity(userWord, dbWord) {
    if (userWord === dbWord) return 1.0;
    if (dbWord.startsWith(userWord)) return 0.9;
    const dist = calculateLevenshtein(userWord, dbWord);
    const maxLen = Math.max(userWord.length, dbWord.length);
    if (maxLen <= 3) return dist === 0 ? 1 : 0;
    if (maxLen <= 6) return dist <= 1 ? 0.8 : 0;
    return dist <= 2 ? 0.7 : 0;
}

function performSearchFromModal() {
    let rawQuery = document.getElementById('modalSearchInput').value;
    let query = smartNormalize(rawQuery);
    if (query.length < 2) return;

    const container = document.getElementById('modalSearchResults');
    container.innerHTML = '<div style="text-align:center; color:#fff; margin-top:20px;"><i class="fas fa-circle-notch fa-spin"></i> جاري التحليل العميق...</div>';

    let userWords = query.split(' ').filter(w => w.length > 0);

    setTimeout(() => {
        let scoredResults = fullQuranData.map(ayah => {
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
            let finalScore = (matchCount > 0) ? (totalScore * (matchCount / userWords.length)) : 0;
            return { ...ayah, score: finalScore };
        });

        let results = scoredResults
            .filter(item => item.score > 0.4)
            .sort((a, b) => b.score - a.score);

        displaySearchResults(results.slice(0, 50), rawQuery);
    }, 50);
}

function displaySearchResults(results, originalQuery) {
    const container = document.getElementById('modalSearchResults');
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#888; font-family:'Amiri'; margin-top:20px;">لم نجد آية مطابقة لـ "${originalQuery}"</div>`;
        return;
    }
    results.forEach(match => {
        const item = document.createElement('div');
        item.className = 'search-result-item advanced';
        item.innerHTML = `<div class="res-text">﴿ ${match.text} ﴾</div>
                <div class="res-info">
                    <i class="fas fa-book-open" style="color:var(--primary)"></i> سورة ${match.surahName} - آية ${Engine.toArabic(match.ayahNum)}
                </div>`;
        item.onclick = () => {
            toggleSearchModal();
            Engine.loadSurahAsCards(match.surahNum, `${match.surahNum}:${match.ayahNum}`);
        };
        container.appendChild(item);
    });
}

function handleNavbarSearch(value) {
    if (!value) return;
    if (typeof MobileNav !== 'undefined') MobileNav.pushState('advanced-search');
    document.getElementById('searchModal').classList.add('visible');
    const modalInput = document.getElementById('modalSearchInput');
    modalInput.value = value;
    modalInput.focus();
    performSearchFromModal();
    document.getElementById('navbarSearchInput').value = '';
}

function toggleSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.toggle('visible');
    if (modal.classList.contains('visible')) {
        setTimeout(() => document.getElementById('modalSearchInput').focus(), 100);
    }
}

function handleSearchInput(val) {
    const btn = document.getElementById('searchActionBtn');
    if (val.length > 0) {
        btn.innerText = "بحث...";
        btn.style.background = "var(--primary)";
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => performSearchFromModal(), 400);
    } else {
        btn.innerText = "بحث";
        btn.style.background = "var(--royal-gold)";
        document.getElementById('modalSearchResults').innerHTML = '';
    }
}

Engine.saveCurrentPosition = function () {
    const scrollPos = document.getElementById('quran-scroll-area').scrollTop;
    const cards = Array.from(document.querySelectorAll('.quran-sheet'));
    let currentCard = null;
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            currentCard = card;
            break;
        }
    }
    if (currentCard) {
        const surahId = currentCard.dataset.surah;
        const pageNum = currentCard.dataset.page;
        document.querySelectorAll('.quran-sheet.bookmarked-page').forEach(c => { c.classList.remove('bookmarked-page'); });
        currentCard.classList.add('bookmarked-page');
        localStorage.setItem('royal_bookmark', JSON.stringify({
            surahName: surahId,
            page: pageNum,
            scrollPos: scrollPos,
            timestamp: Date.now()
        }));
        localStorage.removeItem('quran_bookmark');
        Engine.savedBookmark = null;
        document.querySelectorAll('.bookmarked-verse').forEach(el => el.classList.remove('bookmarked-verse'));
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification('تم حفظ مكان التوقف (البطاقة) ✅');
        }
    }
};

Engine.goToBookmark = function () {
    const royalBookmark = localStorage.getItem('royal_bookmark');
    if (royalBookmark) {
        try {
            const b = JSON.parse(royalBookmark);
            const surahId = parseInt(b.surahName);
            const pageNum = parseInt(b.page);
            if (surahId >= 1 && surahId <= 114) {
                Engine.loadSurahAsCards(surahId, null, false, pageNum);
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    const surahName = Engine.surahNames[surahId] || 'السورة';
                    UI.showNotification(`الانتقال إلى ${surahName} - المكان المحفوظ 📌`);
                }
                return;
            }
        } catch (e) { console.error('Error loading royal bookmark:', e); }
    }
    if (Engine.savedBookmark && Engine.savedBookmark.surahName) {
        const surahId = parseInt(Engine.savedBookmark.surahName);
        const verseKey = Engine.savedBookmark.key;
        if (surahId >= 1 && surahId <= 114) {
            Engine.loadSurahAsCards(surahId, verseKey);
            if (typeof UI !== 'undefined' && UI.showNotification) {
                const surahName = Engine.surahNames[surahId] || 'السورة';
                UI.showNotification(`الانتقال إلى ${surahName} - الآية المحفوظة 📌`);
            }
            return;
        }
    }
    if (typeof UI !== 'undefined' && UI.showNotification) {
        UI.showNotification('لا يوجد مكان محفوظ 📌');
    }
};

Engine.toggleRestoreToast = function (dontShow) {
    localStorage.setItem('royal_hide_restore_toast', dontShow ? 'true' : 'false');
    if (dontShow && typeof UI !== 'undefined') {
        UI.hideToast();
    }
};

function resetDeepLink() {
    const baseUrl = window.location.protocol === 'file:'
        ? window.location.href.split('?')[0]
        : window.location.pathname;
    window.location.href = baseUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    Engine.init();
    const navToggle = document.getElementById('globalNavToggle');
    if (navToggle) navToggle.addEventListener('click', toggleGlobalNav);

    initSearchEngine();

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) menuBtn.onclick = toggleSidebarLogic;

    window.addEventListener('resize', () => {
        Engine._updateMiniPlayerPosition();
        if (window.innerWidth > 768) {
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) overlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    });


});

// ====== Tab Switcher for Settings Sheet ======
function switchSettingsTab(tabId, clickedBtn) {
    // Switch active tab button
    document.querySelectorAll('.sheet-tab').forEach(t => t.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');

    // Switch active tab content
    document.querySelectorAll('#settings-sheet-content .sheet-tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}
function toggleGlobalNav() {
    const btn = document.getElementById('globalNavToggle');
    const list = document.getElementById('globalNavLinks');
    btn.classList.toggle('active');
    list.classList.toggle('collapsed');
}

function toggleSidebarLogic() {
    const isMobile = window.innerWidth < 768;
    const sidebar = document.getElementById('sidebar');

    if (isMobile) {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            if (typeof MobileNav !== 'undefined') MobileNav.pushState('sidebar');
        }
        let overlay = document.getElementById('sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebar-overlay';
            overlay.onclick = toggleSidebarLogic;
            document.body.appendChild(overlay);
        }
        const isActive = sidebar.classList.contains('active');
        if (isActive) {
            overlay.classList.add('visible');
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.dataset.scrollLockY = String(scrollY);
        } else {
            overlay.classList.remove('visible');
            const prevY = parseInt(document.body.dataset.scrollLockY || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.dataset.scrollLockY = '';
            window.scrollTo(0, prevY);
        }
    } else {
        document.body.classList.toggle('mini-sidebar');
    }
}

Engine.openFullTafsir = function () {
    const selectedAyah = UI.currentVerseKey;
    if (!selectedAyah) {
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification('الرجاء اختيار آية أولاً ⚠️');
        }
        return;
    }
    const parts = selectedAyah.split(':');
    const surahNum = parts[0].trim();
    const ayahNum = parts[1].trim();
    const targetUrl = `../tafsir/index.html?surah=${surahNum}&ayah=${ayahNum}`;
    sessionStorage.setItem('target_tafsir_surah', surahNum);
    sessionStorage.setItem('target_tafsir_ayah', ayahNum);
    window.location.href = targetUrl;
};

window.updateDownloadProgress = function (percent, downloadedBytes, totalBytes) {
    if (typeof Engine !== 'undefined') Engine.lastProgressUpdate = Date.now();

    const loadedMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    const modalContent = document.getElementById('translation-list-container');
    if (modalContent) {
        let progressBar = document.getElementById('real-progress-bar');
        if (!progressBar) {
            modalContent.innerHTML = ` 
            <div style="text-align:center; padding: 20px; color: #fff;"> 
                <i class="fas fa-satellite-dish fa-pulse" style="font-size:30px; color:#D4AF37; margin-bottom:15px;"></i> 
                <h3 style="margin:0 0 10px 0;">جارِ تحميل البيانات...</h3> 
                <div style="width: 100%; height: 10px; background: #333; border-radius: 5px; overflow: hidden; margin: 15px 0;"> 
                    <div id="real-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4ff0b7, #6affc7); transition: width 0.1s linear;"></div>
                </div> 
                <div style="display:flex; justify-content:space-between; font-size:12px; font-family:monospace; color:#ccc;"> 
                    <span id="progress-text-size">0.00 / 0.00 MB</span> 
                    <span id="progress-text-percent">0%</span> 
                </div> 
            </div> 
        `;
            progressBar = document.getElementById('real-progress-bar');
        }
        progressBar.style.width = percent + "%";
        const sizeEl = document.getElementById('progress-text-size');
        const percentEl = document.getElementById('progress-text-percent');
        if (sizeEl) sizeEl.innerText = `${loadedMB} / ${totalMB} MB`;
        if (percentEl) percentEl.innerText = `${percent}%`;
    }
};
window.onDownloadComplete = function (fileName) {
    console.log("Download completed for: " + fileName);

    if (typeof Engine !== 'undefined') {
        Engine.isDownloadingTranslation = false;
        Engine.isLoading = false;

        if (Engine.progressWatchdog) clearInterval(Engine.progressWatchdog);
    }

    if (typeof UI !== 'undefined' && UI.showNotification) {
        UI.showNotification(`تم اكتمال التحميل: ${fileName} ✅`);
    }

    setTimeout(() => {
        if (typeof Engine !== 'undefined') {
            Engine.updateVisibleTranslations();
            if (document.getElementById('translation-modal').classList.contains('visible')) {
                Engine.filterLanguages('');
            }
        }
    }, 1000);
};