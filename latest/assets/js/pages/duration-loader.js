/**
 * 🔥 Duration Loader - ملف مستقل لتحميل مدد السور الحقيقية
 * 
 * يشتغل لوحده بشكل كامل في الخلفية.
 * كل سورة تخلص → يحفظها في localStorage + يحدّث الكارت فوراً.
 * بيشتغل بدفعات صغيرة (4 في نفس الوقت) عشان سرعة + موثوقية.
 */

const DurationLoader = {

    BATCH_SIZE: 4, // 4 سور في نفس الوقت (أقل من حد المتصفح 6)
    STORAGE_KEY: 'quran_duration_cache',

    // جلب الكاش الحالي
    getCache() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        } catch { return {}; }
    },

    // حفظ في الكاش
    saveToCache(key, seconds) {
        const cache = this.getCache();
        cache[key] = seconds;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
    },

    // تحويل ثواني لنص مقروء
    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    // تحميل metadata لسورة واحدة
    loadOne(serverUrl, surahIndex) {
        return new Promise((resolve) => {
            const surahID = String(surahIndex).padStart(3, '0');
            const url = `${serverUrl}${surahID}.mp3`;

            const audio = new Audio();
            audio.preload = 'metadata';
            let resolved = false;

            const done = (duration) => {
                if (resolved) return;
                resolved = true;
                audio.removeAttribute('src');
                audio.load(); // تنظيف كامل
                resolve(duration);
            };

            audio.addEventListener('loadedmetadata', () => {
                const dur = audio.duration;
                if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
                    done(dur);
                } else {
                    done(null);
                }
            }, { once: true });

            audio.addEventListener('error', () => done(null), { once: true });

            // Safety timeout - 30 ثانية كحد أقصى لكل سورة
            setTimeout(() => done(null), 30000);

            audio.src = url;
        });
    },

    // 🔥 البدء في تحميل كل المدد
    async start(reciterId, serverUrl) {
        if (!reciterId || !serverUrl) return;

        const cache = this.getCache();

        // تجميع السور الناقصة (بالترتيب 1→114)
        const missing = [];
        for (let i = 1; i <= 114; i++) {
            const key = `${reciterId}_${i}`;
            if (!cache[key]) {
                missing.push(i);
            }
        }

        if (missing.length === 0) {
            console.log('✅ كل مدد السور موجودة في الكاش');
            // بث إشارة إن الكل جاهز
            window.dispatchEvent(new CustomEvent('durations-all-ready'));
            return;
        }

        console.log(`⏱️ [DurationLoader] جاري تحميل مدد ${missing.length} سورة...`);

        // معالجة بالدفعات
        for (let b = 0; b < missing.length; b += this.BATCH_SIZE) {
            const batch = missing.slice(b, b + this.BATCH_SIZE);

            // تحميل الدفعة بالتوازي
            const results = await Promise.all(
                batch.map(async (surahIndex) => {
                    const duration = await this.loadOne(serverUrl, surahIndex);
                    return { surahIndex, duration };
                })
            );

            // حفظ النتائج وتحديث الكروت فوراً
            results.forEach(({ surahIndex, duration }) => {
                if (duration !== null) {
                    const key = `${reciterId}_${surahIndex}`;
                    this.saveToCache(key, duration);

                    // 🔥 إشارة ريل تايم: حدّث الكارت فوراً!
                    window.dispatchEvent(new CustomEvent('duration-loaded', {
                        detail: {
                            surahIndex,
                            duration,
                            formatted: this.formatDuration(duration)
                        }
                    }));
                }
            });

            console.log(`📦 [DurationLoader] دفعة ${Math.floor(b / this.BATCH_SIZE) + 1}/${Math.ceil(missing.length / this.BATCH_SIZE)} خلصت`);
        }

        console.log('✅ [DurationLoader] تم تحميل كل المدد!');
        window.dispatchEvent(new CustomEvent('durations-all-ready'));
    }
};
