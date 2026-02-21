// --- 1. Database: 62 Famous Reciters (Images + Server URLs) ---
const RECITERS_DB = [
    // ════════════════════════════════════════════════
    // ██ القراء الأساسيون (22 قارئ) ██
    // ════════════════════════════════════════════════

    // 1. عبد الباسط عبد الصمد (مرتل)
    { id: 'Abdul_Basit', name: 'عبد الباسط عبد الصمد', img: '../assets/img/listen/covers/abdul_basit.webp', server: 'https://server7.mp3quran.net/basit/' },

    // 2. محمد صديق المنشاوي
    { id: 'Minshawy', name: 'محمد صديق المنشاوي', img: '../assets/img/listen/covers/minshawi.webp', server: 'https://server10.mp3quran.net/minsh/' },

    // 3. مشاري راشد العفاسي
    { id: 'Alafasy', name: 'مشاري راشد العفاسي', img: '../assets/img/listen/covers/alafasy.webp', server: 'https://server8.mp3quran.net/afs/' },

    // 4. أحمد العجمي
    { id: 'Ajamy', name: 'أحمد العجمي', img: '../assets/img/listen/covers/ahmed_al_ajamy.webp', server: 'https://server10.mp3quran.net/ajm/' },

    // 5. محمود خليل الحصري
    { id: 'Hussary', name: 'محمود خليل الحصري', img: '../assets/img/listen/covers/al_hussary.webp', server: 'https://server13.mp3quran.net/husr/' },

    // 6. ماهر المعيقلي
    { id: 'Muaiqly', name: 'ماهر المعيقلي', img: '../assets/img/listen/covers/maher_al_muaiqly.webp', server: 'https://server12.mp3quran.net/maher/' },

    // 7. سعود الشريم
    { id: 'Shuraim', name: 'سعود الشريم', img: '../assets/img/listen/covers/saud_al_shuraim.webp', server: 'https://server7.mp3quran.net/shur/' },

    // 8. ياسر الدوسري
    { id: 'Dosari', name: 'ياسر الدوسري', img: '../assets/img/listen/covers/yasser_al_dosari.webp', server: 'https://server11.mp3quran.net/yasser/' },

    // 9. عبد الرحمن السديس
    { id: 'Sudais', name: 'عبد الرحمن السديس', img: '../assets/img/listen/covers/al_sudais.webp', server: 'https://server11.mp3quran.net/sds/' },

    // 10. سعد الغامدي
    { id: 'Ghamdi', name: 'سعد الغامدي', img: '../assets/img/listen/covers/saad_al_ghamdi.webp', server: 'https://server7.mp3quran.net/s_gmd/' },

    // 11. ناصر القطامي
    { id: 'Qatami', name: 'ناصر القطامي', img: '../assets/img/listen/covers/nasser_al_qatami.webp', server: 'https://server6.mp3quran.net/qtm/' },

    // 12. إدريس أبكر
    { id: 'Idris', name: 'إدريس أبكر', img: '../assets/img/listen/covers/idris_abkar.webp', server: 'https://server6.mp3quran.net/abkr/' },

    // 13. فارس عباد
    { id: 'Fares', name: 'فارس عباد', img: '../assets/img/listen/covers/fares_abbad.webp', server: 'https://server8.mp3quran.net/frs_a/' },

    // 14. هزاع البلوشي
    { id: 'Balushi', name: 'هزاع البلوشي', img: '../assets/img/listen/covers/hazza_al_balushi.webp', server: 'https://server11.mp3quran.net/hazza/' },

    // 15. وديع اليمني
    { id: 'Wadih', name: 'وديع اليمني', img: '../assets/img/listen/covers/wadih_al_yamani.webp', server: 'https://server6.mp3quran.net/wdee3/' },

    // 16. محمد محمود الطبلاوي
    { id: 'Tablawi', name: 'محمد محمود الطبلاوي', img: '../assets/img/listen/covers/al_tablawi.webp', server: 'https://server12.mp3quran.net/tblawi/' },

    // 17. علي الحذيفي
    { id: 'Hudhaify', name: 'علي الحذيفي', img: '../assets/img/listen/covers/al_hudhaify.webp', server: 'https://server9.mp3quran.net/hthfi/' },

    // 18. عبد الله الجهني
    { id: 'Juhany', name: 'عبد الله الجهني', img: '../assets/img/listen/covers/abdullah_al_juhany.webp', server: 'https://server13.mp3quran.net/jhn/' },

    // 19. أبو بكر الشاطري
    { id: 'Shatri', name: 'أبو بكر الشاطري', img: '../assets/img/listen/covers/abu_bakr_al_shatri.webp', server: 'https://server11.mp3quran.net/shatri/' },

    // 20. بندر بليلة
    { id: 'Bandar', name: 'بندر بليلة', img: '../assets/img/listen/covers/bandar_baleela.webp', server: 'https://server6.mp3quran.net/balilah/' },

    // 21. محمد اللحيدان
    { id: 'Lahidan', name: 'محمد اللحيدان', img: '../assets/img/listen/covers/mohammed_al_lahidan.webp', server: 'https://server8.mp3quran.net/lhdan/' },

    // 22. علي جابر
    { id: 'Jaber', name: 'علي جابر', img: '../assets/img/listen/covers/ali_jaber.webp', server: 'https://server11.mp3quran.net/a_jbr/' },

    // ════════════════════════════════════════════════
    // ██ قراء جدد مميزون ✨ (40 قارئ) ██
    // ════════════════════════════════════════════════

    // 🔥 إسلام صبحي - صوت عذب جدًا ومشهور عند الشباب
    { id: 'Islam_Sobhi', name: 'إسلام صبحي', img: '../assets/img/listen/covers/islam_sobhi.webp', server: 'https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // 🔥 رعد محمد الكردي - صوت خاشع وقوي
    { id: 'Raad_Kurdi', name: 'رعد محمد الكردي', img: '../assets/img/listen/covers/raad_kurdi.webp', server: 'https://server6.mp3quran.net/kurdi/', isNew: true },

    // 🔥 خالد الجليل - صوت هادئ وعذب
    { id: 'Khalid_Jaleel', name: 'خالد الجليل', img: '../assets/img/listen/covers/khalid_jaleel.webp', server: 'https://server10.mp3quran.net/jleel/', isNew: true },

    // 🔥 منصور السالمي - صوت مؤثر جدًا
    { id: 'Mansour_Salmi', name: 'منصور السالمي', img: '../assets/img/listen/covers/mansour_salmi.webp', server: 'https://server14.mp3quran.net/mansor/', isNew: true },

    // خليفة الطنيجي - صوت جميل
    { id: 'Khalifa_Tunaiji', name: 'خليفة الطنيجي', img: '../assets/img/listen/covers/khalifa_tunaiji.webp', server: 'https://server12.mp3quran.net/tnjy/', isNew: true },

    // خالد القحطاني
    { id: 'Khalid_Qahtani', name: 'خالد القحطاني', img: '../assets/img/listen/covers/khalid_qahtani.webp', server: 'https://server10.mp3quran.net/qht/', isNew: true },

    // عادل الكلباني - إمام الحرم سابقًا
    { id: 'Adel_Kalbani', name: 'عادل الكلباني', img: '../assets/img/listen/covers/adel_kalbani.webp', server: 'https://server8.mp3quran.net/a_klb/', isNew: true },

    // خالد عبدالكافي
    { id: 'Khalid_Kafi', name: 'خالد عبدالكافي', img: '../assets/img/listen/covers/khalid_kafi.webp', server: 'https://server11.mp3quran.net/kafi/', isNew: true },

    // محمد المحيسني - صوت شجي
    { id: 'Muhaisny', name: 'محمد المحيسني', img: '../assets/img/listen/covers/muhaisny.webp', server: 'https://server11.mp3quran.net/mhsny/', isNew: true },

    // محمد أيوب - إمام المسجد النبوي
    { id: 'Muhammad_Ayyub', name: 'محمد أيوب', img: '../assets/img/listen/covers/muhammad_ayyub.webp', server: 'https://server8.mp3quran.net/ayyub/', isNew: true },

    // محمد عبدالكريم
    { id: 'Muhammad_AbdulKarim', name: 'محمد عبدالكريم', img: '../assets/img/listen/covers/muhammad_abdulkarim.webp', server: 'https://server12.mp3quran.net/m_krm/', isNew: true },

    // مصطفى إسماعيل - من كبار القراء المصريين
    { id: 'Mustafa_Ismail', name: 'مصطفى إسماعيل', img: '../assets/img/listen/covers/mustafa_ismail.webp', server: 'https://server8.mp3quran.net/mustafa/', isNew: true },

    // أكرم العلاقمي
    { id: 'Akram_Alaqmi', name: 'أكرم العلاقمي', img: '../assets/img/listen/covers/akram_alaqmi.webp', server: 'https://server9.mp3quran.net/akrm/', isNew: true },

    // إبراهيم الأخضر
    { id: 'Ibrahim_Akhdar', name: 'إبراهيم الأخضر', img: '../assets/img/listen/covers/ibrahim_akhdar.webp', server: 'https://server6.mp3quran.net/akdr/', isNew: true },

    // داود حمزة
    { id: 'Dawud_Hamza', name: 'داود حمزة', img: '../assets/img/listen/covers/dawud_hamza.webp', server: 'https://server9.mp3quran.net/hamza/', isNew: true },

    // توفيق الصايغ
    { id: 'Tawfiq_Sayegh', name: 'توفيق الصايغ', img: '../assets/img/listen/covers/tawfiq_sayegh.webp', server: 'https://server6.mp3quran.net/twfeeq/', isNew: true },

    // محمد جبريل - صوت مؤثر
    { id: 'Muhammad_Jibreel', name: 'محمد جبريل', img: '../assets/img/listen/covers/muhammad_jibreel.webp', server: 'https://server8.mp3quran.net/jbrl/', isNew: true },

    // حاتم فريد الواعر
    { id: 'Hatem_Farid', name: 'حاتم فريد الواعر', img: '../assets/img/listen/covers/hatem_farid.webp', server: 'https://server11.mp3quran.net/hatem/', isNew: true },

    // إبراهيم الدوسري
    { id: 'Ibrahim_Dosari', name: 'إبراهيم الدوسري', img: '../assets/img/listen/covers/ibrahim_dosari.webp', server: 'https://server10.mp3quran.net/ibrahim_dosri/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // رامي الدعيس
    { id: 'Rami_Daeis', name: 'رامي الدعيس', img: '../assets/img/listen/covers/rami_daeis.webp', server: 'https://server6.mp3quran.net/rami/', isNew: true },

    // 🔥 بدر التركي - صوت شبابي عذب
    { id: 'Badr_Turki', name: 'بدر التركي', img: '../assets/img/listen/covers/badr_turki.webp', server: 'https://server10.mp3quran.net/bader/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // أحمد النفيس
    { id: 'Ahmad_Nafees', name: 'أحمد النفيس', img: '../assets/img/listen/covers/ahmad_nafees.webp', server: 'https://server16.mp3quran.net/nufais/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // أحمد خليل شاهين
    { id: 'Ahmad_Shaheen', name: 'أحمد خليل شاهين', img: '../assets/img/listen/covers/ahmad_shaheen.webp', server: 'https://server16.mp3quran.net/shaheen/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // عبدالله الموسى
    { id: 'Abdullah_Mousa', name: 'عبدالله الموسى', img: '../assets/img/listen/covers/abdullah_mousa.webp', server: 'https://server14.mp3quran.net/mousa/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // عبدالله الخلف
    { id: 'Abdullah_Khalf', name: 'عبدالله الخلف', img: '../assets/img/listen/covers/abdullah_khalf.webp', server: 'https://server14.mp3quran.net/khalf/', isNew: true },

    // مصطفى اللاهوني
    { id: 'Mustafa_Lahoni', name: 'مصطفى اللاهوني', img: '../assets/img/listen/covers/mustafa_lahoni.webp', server: 'https://server6.mp3quran.net/lahoni/', isNew: true },

    // مصطفى رعد العزاوي
    { id: 'Mustafa_Raad', name: 'مصطفى رعد العزاوي', img: '../assets/img/listen/covers/mustafa_raad.webp', server: 'https://server8.mp3quran.net/ra3ad/', isNew: true },

    // عبدالرحمن العوسي
    { id: 'Abdulrahman_Oosi', name: 'عبدالرحمن العوسي', img: '../assets/img/listen/covers/abdulrahman_oosi.webp', server: 'https://server6.mp3quran.net/aloosi/', isNew: true },

    // عبدالرحمن الماجد
    { id: 'Abdulrahman_Majed', name: 'عبدالرحمن الماجد', img: '../assets/img/listen/covers/abdulrahman_majed.webp', server: 'https://server10.mp3quran.net/a_majed/', isNew: true },

    // يوسف بن نوح أحمد
    { id: 'Yusuf_Noah', name: 'يوسف بن نوح أحمد', img: '../assets/img/listen/covers/yusuf_noah.webp', server: 'https://server8.mp3quran.net/noah/', isNew: true },

    // أحمد عامر
    { id: 'Ahmad_Amer', name: 'أحمد عامر', img: '../assets/img/listen/covers/ahmad_amer.webp', server: 'https://server10.mp3quran.net/Aamer/', isNew: true },

    // ماجد الزامل - صوت خاشع
    { id: 'Majid_Zamil', name: 'ماجد الزامل', img: '../assets/img/listen/covers/majid_zamil.webp', server: 'https://server9.mp3quran.net/zaml/', isNew: true },

    // سعد المقرن
    { id: 'Saad_Muqrin', name: 'سعد المقرن', img: '../assets/img/listen/covers/saad_muqrin.webp', server: 'https://server16.mp3quran.net/saad/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // صالح القريشي
    { id: 'Saleh_Quraishi', name: 'صالح القريشي', img: '../assets/img/listen/covers/saleh_quraishi.webp', server: 'https://server16.mp3quran.net/s_alquraishi/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // محمود عبدالحكم
    { id: 'Mahmoud_AbdulHakam', name: 'محمود عبدالحكم', img: '../assets/img/listen/covers/mahmoud_abdulhakam.webp', server: 'https://server16.mp3quran.net/m_abdelhakam/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // عبدالله كامل - صوت مميز
    { id: 'Abdullah_Kamel', name: 'عبدالله كامل', img: '../assets/img/listen/covers/abdullah_kamel.webp', server: 'https://server16.mp3quran.net/kamel/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // محمد خليل القارئ
    { id: 'Muhammad_Qari', name: 'محمد خليل القارئ', img: '../assets/img/listen/covers/muhammad_qari.webp', server: 'https://server8.mp3quran.net/m_qari/', isNew: true },

    // خالد المهنا
    { id: 'Khalid_Mohna', name: 'خالد المهنا', img: '../assets/img/listen/covers/khalid_mohna.webp', server: 'https://server11.mp3quran.net/mohna/', isNew: true },

    // محمود الرفاعي
    { id: 'Mahmoud_Rifai', name: 'محمود الرفاعي', img: '../assets/img/listen/covers/mahmoud_rifai.webp', server: 'https://server11.mp3quran.net/mrifai/', isNew: true },

    // إبراهيم الجرمي
    { id: 'Ibrahim_Jormy', name: 'إبراهيم الجرمي', img: '../assets/img/listen/covers/ibrahim_jormy.webp', server: 'https://server11.mp3quran.net/jormy/', isNew: true },

    // محمد صالح عالم شاه
    { id: 'Muhammad_Shah', name: 'محمد صالح عالم شاه', img: '../assets/img/listen/covers/muhammad_shah.webp', server: 'https://server12.mp3quran.net/shah/', isNew: true },

    // جمال شاكر عبدالله
    { id: 'Jamal_Shaker', name: 'جمال شاكر عبدالله', img: '../assets/img/listen/covers/jamal_shaker.webp', server: 'https://server6.mp3quran.net/jamal/', isNew: true },

    // جمعان العصيمي
    { id: 'Jomaan_Osaimy', name: 'جمعان العصيمي', img: '../assets/img/listen/covers/jomaan_osaimy.webp', server: 'https://server6.mp3quran.net/jaman/', isNew: true },

    // معيض الحارثي
    { id: 'Mueadh_Harthi', name: 'معيض الحارثي', img: '../assets/img/listen/covers/mueadh_harthi.webp', server: 'https://server8.mp3quran.net/harthi/', isNew: true },

    // محمد رشاد الشريف
    { id: 'Muhammad_Rashad', name: 'محمد رشاد الشريف', img: '../assets/img/listen/covers/muhammad_rashad.webp', server: 'https://server10.mp3quran.net/rashad/', isNew: true },

    // ناصر العصفور
    { id: 'Nasser_Osfoor', name: 'ناصر العصفور', img: '../assets/img/listen/covers/nasser_osfoor.webp', server: 'https://server14.mp3quran.net/alosfor/', isNew: true },

    // محمد البخيت
    { id: 'Muhammad_Bukheit', name: 'محمد البخيت', img: '../assets/img/listen/covers/muhammad_bukheit.webp', server: 'https://server14.mp3quran.net/bukheet/', isNew: true },

    // ناصر الماجد
    { id: 'Nasser_Majed', name: 'ناصر الماجد', img: '../assets/img/listen/covers/nasser_majed.webp', server: 'https://server14.mp3quran.net/nasser_almajed/', isNew: true },

    // أحمد السويلم
    { id: 'Ahmad_Swailem', name: 'أحمد السويلم', img: '../assets/img/listen/covers/ahmad_swailem.webp', server: 'https://server14.mp3quran.net/swlim/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // إبراهيم العسيري
    { id: 'Ibrahim_Asiri', name: 'إبراهيم العسيري', img: '../assets/img/listen/covers/ibrahim_asiri.webp', server: 'https://server6.mp3quran.net/3siri/', isNew: true },

    // محمد عثمان خان
    { id: 'Muhammad_Khan', name: 'محمد عثمان خان', img: '../assets/img/listen/covers/muhammad_khan.webp', server: 'https://server6.mp3quran.net/khan/', isNew: true },

    // أحمد الطرابلسي
    { id: 'Ahmad_Trabulsi', name: 'أحمد الطرابلسي', img: '../assets/img/listen/covers/ahmad_trabulsi.webp', server: 'https://server10.mp3quran.net/trabulsi/', isNew: true },

    // عبدالله الكندري
    { id: 'Abdullah_Kundari', name: 'عبدالله الكندري', img: '../assets/img/listen/covers/abdullah_kundari.webp', server: 'https://server10.mp3quran.net/Abdullahk/', isNew: true },

    // صالح الشمراني
    { id: 'Saleh_Shamrani', name: 'صالح الشمراني', img: '../assets/img/listen/covers/saleh_shamrani.webp', server: 'https://server16.mp3quran.net/shamrani/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // ياسر سلامة
    { id: 'Yasser_Salamah', name: 'ياسر سلامة', img: '../assets/img/listen/covers/yasser_salamah.webp', server: 'https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // محمد برهجي
    { id: 'Muhammad_Burhaji', name: 'محمد برهجي', img: '../assets/img/listen/covers/muhammad_burhaji.webp', server: 'https://server16.mp3quran.net/M_Burhaji/Rewayat-Hafs-A-n-Assem/', isNew: true },

    // موسى بلال
    { id: 'Musa_Bilal', name: 'موسى بلال', img: '../assets/img/listen/covers/musa_bilal.webp', server: 'https://server11.mp3quran.net/bilal/', isNew: true }
];

// --- 114 Surah Names ---
const surahNames = [
    "", "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود",
    "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون",
    "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ",
    "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف",
    "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد",
    "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك",
    "القلم", "الحاقة", "الماعون", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ",
    "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية",
    "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة",
    "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون",
    "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

// --- بيانات القوائم الصوتية (محدثة بعناوين روحانية) ---
const MOODS_PLAYLISTS = {
    sleep: {
        title: "تلاوات هادئة للنوم",
        reciter: "تلاوة مختارة",
        folder: "نوم",
        playlist: [
            { name: "سكون الليل", url: "https://dn721907.ca.archive.org/0/items/4_20251203_20251203_1955/1.mp3", imgIndex: 2 },
            { name: "طمأنينة الروح", url: "https://dn721907.ca.archive.org/0/items/4_20251203_20251203_1955/2.mp3", imgIndex: 3 },
            { name: "هدوء السحر", url: "https://dn721907.ca.archive.org/0/items/4_20251203_20251203_1955/4.mp3", imgIndex: 4 },
            { name: "راحة البال", url: "https://dn721907.ca.archive.org/0/items/4_20251203_20251203_1955/5.mp3", imgIndex: 5 },
            { name: "أحلام آمنة", url: "https://dn721907.ca.archive.org/0/items/4_20251203_20251203_1955/6.mp3", imgIndex: 6 }
        ]
    },
    sad: {
        title: "آيات الصبر والفرج",
        reciter: "تلاوة خاشعة",
        folder: "حزن",
        playlist: [
            { name: "بشرى الصابرين", url: "https://dn721808.ca.archive.org/0/items/7_20251203_20251203_1956/7.mp3", imgIndex: 2 },
            { name: "لا تحزن", url: "https://dn721808.ca.archive.org/0/items/7_20251203_20251203_1956/8.mp3", imgIndex: 3 },
            { name: "انشراح الصدر", url: "https://ia801903.us.archive.org/14/items/7_20251203_20251203_1956/9.mp3", imgIndex: 4 },
            { name: "نور الأمل", url: "https://dn721808.ca.archive.org/0/items/7_20251203_20251203_1956/10.mp3", imgIndex: 5 },
            { name: "فرج قريب", url: "https://dn721808.ca.archive.org/0/items/7_20251203_20251203_1956/11.mp3", imgIndex: 6 },
            { name: "مناجاة خاشعة", url: "https://dn721808.ca.archive.org/0/items/7_20251203_20251203_1956/12.mp3", imgIndex: 7 }
        ]
    },
    comfort: {
        title: "هدوء وسكينة",
        reciter: "تلاوة مريحة",
        folder: "هدوء",
        playlist: [
            { name: "واحة الإيمان", url: "https://ia804509.us.archive.org/27/items/16_20251203_20251203_1958/13.mp3", imgIndex: 2 },
            { name: "سكينة القلوب", url: "https://ia804509.us.archive.org/27/items/16_20251203_20251203_1958/14.mp3", imgIndex: 3 },
            { name: "نسائم الرحمة", url: "https://ia804509.us.archive.org/27/items/16_20251203_20251203_1958/15.mp3", imgIndex: 4 },
            { name: "صفاء النفس", url: "https://ia904509.us.archive.org/27/items/16_20251203_20251203_1958/16.mp3", imgIndex: 5 },
            { name: "همسات روحانية", url: "https://ia904509.us.archive.org/27/items/16_20251203_20251203_1958/17.mp3", imgIndex: 6 },
            { name: "رحاب القرآن", url: "https://ia904509.us.archive.org/27/items/16_20251203_20251203_1958/18.mp3", imgIndex: 2 }
        ]
    },
    fear: {
        title: "آيات السكينة والتحصين",
        reciter: "الرقية الشرعية",
        folder: "تحصين",
        playlist: [
            { name: "الحصن المنيع", url: "https://ia801702.us.archive.org/12/items/19_20251203/19.mp3", imgIndex: 2 },
            { name: "آيات السكينة", url: "https://dn720705.ca.archive.org/0/items/19_20251203/20.mp3", imgIndex: 3 },
            { name: "حفظ الله", url: "https://dn720705.ca.archive.org/0/items/19_20251203/21.mp3", imgIndex: 4 },
            { name: "الرقية الشافية", url: "https://dn720705.ca.archive.org/0/items/19_20251203/22.mp3", imgIndex: 5 },
            { name: "أمن وأمان", url: "https://dn720705.ca.archive.org/0/items/19_20251203/23.mp3", imgIndex: 6 },
            { name: "درع المؤمن", url: "https://dn720705.ca.archive.org/0/items/19_20251203/24.mp3", imgIndex: 7 }
        ]
    }
};

// --- UI Helper Functions ---
const UI = {
    showToast(message) {
        // Simple toast notification implementation
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                font-size: 14px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: opacity 0.3s;
                opacity: 0;
            `;
            document.body.appendChild(toast);
        }

        toast.innerText = message;
        toast.style.opacity = '1';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
};

// --- 2. The Audio Engine ---
const Engine = {
    currentReciter: null,
    currentSurahIndex: 1,
    audio: document.getElementById('audio-player'),
    isPlaying: false,
    isRestoring: true,
    isRadioMode: false,
    // --- أوضاع التكرار والنوم ---
    repeatMode: 0, // 0 = إيقاف, 1 = تكرار الكل, 2 = تكرار السورة
    sleepTimerId: null,
    sleepEndTime: null,
    sleepCountdownId: null,

    init() {
        // هام جداً للتحليل الصوتي
        this.audio.crossOrigin = "anonymous";

        // Initialize Time Awareness
        this.checkTimeEvents();

        // Load State
        this.loadState();

        // Initialize Audio Visualizer
        this.initAudioVisualizer();

        // Build UI
        this.buildSidebar();
        this.buildReciterModal();
        this.updateHeroUI();
        this.updatePlayerUI();

        // 🔥 تأكد من إعادة تعيين زرار التحميل عند البدء 🔥
        this.resetDownloadButton();

        // Draw static visualizers on page load
        this.drawStaticVisualizers();

        // 🔥 بناء الشبكة مع أزرار القلب
        this._rebuildGrid(null, null);

        // 🔥 تحميل مدد السور في الخلفية
        setTimeout(() => this.preloadDurations(), 2000);

        // Audio Events
        this.audio.addEventListener('loadedmetadata', () => {
            if (this.isRestoring) {
                const savedTime = localStorage.getItem('quran_last_time');
                if (savedTime && savedTime > 0) {
                    this.audio.currentTime = parseFloat(savedTime);
                    this.updateProgress();
                }
                this.isRestoring = false;
            }
            this.updateTotalDuration(); // محاولة أولى

            // 🔥 حفظ المدة الحقيقية في الكاش
            const dur = this.audio.duration;
            if (dur && !isNaN(dur) && isFinite(dur) && dur > 0 && this.currentReciter && !this.isPlaylistMode && !this.isRadioMode) {
                this.cacheDuration(this.currentReciter.id, this.currentSurahIndex, dur);
                // تحديث الكارت مباشرة لو ظاهر
                this._updateCardDuration(this.currentSurahIndex);
            }
        });

        // 🔥 هذا هو الحل السحري: حدث تغير المدة 🔥
        this.audio.addEventListener('durationchange', () => {
            this.updateTotalDuration();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            // محاولة مستمرة لتحديث المدة لو كانت 0
            if (document.getElementById('total-duration').innerText === "00:00") {
                this.updateTotalDuration();
            }

            // 🔥 تسجيل في الهيستوري بعد 20 ثانية استماع حقيقي
            if (!this._historyTracked && !this.isPlaylistMode && !this.isRadioMode && this.audio.currentTime >= 20) {
                this._historyTracked = true;
                this.addToHistory(this.currentSurahIndex);
            }
        });
        this.audio.addEventListener('ended', () => {
            if (this.repeatMode === 2) {
                // تكرار السورة الحالية
                this.audio.currentTime = 0;
                this.audio.play();
            } else if (this.repeatMode === 1 && this.currentSurahIndex >= 114 && !this.isPlaylistMode) {
                // تكرار الكل - ارجع للأول
                this.playSurah(1);
            } else {
                this.playNext();
            }
        });
        this.audio.addEventListener('play', () => this.updatePlayState(true));
        this.audio.addEventListener('pause', () => {
            this.updatePlayState(false);
            this.saveState();
        });

        // ==========================================
        // 🔥 نظام السحب المتطور (Smart Scrubbing) 🔥
        // ==========================================

        const seekContainer = document.getElementById('seek-bar-container');
        const progressBar = document.getElementById('progress-bar');
        const knob = document.getElementById('seek-knob');
        let isDragging = false;

        // 1. دالة حساب النسبة بناءً على الماوس (مع مراعاة الاتجاه العربي)
        const getScrubPercent = (clientX) => {
            const rect = seekContainer.getBoundingClientRect();

            // المعادلة السحرية للاتجاه العربي (RTL):
            // المسافة من الحافة اليمنى للشريط = (إحداثي اليمين للشريط - مكان الماوس)
            let offsetX = rect.right - clientX;

            // تحويلها لنسبة مئوية
            let percent = offsetX / rect.width;

            // التأكد ان النسبة بين 0 و 1 (ممنوع تطلع برة الشريط)
            return Math.max(0, Math.min(1, percent));
        };

        // 2. تحديث الشكل أثناء السحب (بدون تغيير الصوت لسه عشان الخروشة)
        const updateVisuals = (percent) => {
            const percentStr = (percent * 100) + '%';
            // تحديث الاثنين مع نفس القيمة في نفس الوقت
            progressBar.style.width = percentStr;
            knob.style.right = percentStr; // الدائرة تتحرك من اليمين

            // التأكد من التزامن التام
            requestAnimationFrame(() => {
                progressBar.style.width = percentStr;
                knob.style.right = percentStr;
            });
        };

        // 3. أحداث الماوس واللمس (Start Drag)
        const startDrag = (e) => {
            if (this.isRadioMode) return;
            isDragging = true;

            // وقف الصوت أثناء السحب
            this._wasPlayingBeforeScrub = !this.audio.paused;
            if (this._wasPlayingBeforeScrub) {
                this.audio.pause();
            }

            // 🔥 الحل لمشكلة تحديد النصوص: نضيف كلاس يمنع التحديد للـ Body
            document.body.classList.add('noselect');

            seekContainer.classList.add('dragging');

            // تكبير بسيط جداً (1.2) عشان الدائرة الصغيرة
            knob.style.transform = "translate(50%, -50%) scale(1.2)";

            const clientX = e.clientX || e.touches[0].clientX;
            const percent = getScrubPercent(clientX);
            updateVisuals(percent);
        };

        // 4. أثناء الحركة (Moving)
        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // منع تحديد النصوص أثناء السحب

            const clientX = e.clientX || e.touches[0].clientX;
            const percent = getScrubPercent(clientX);

            // تحديث الاثنين في نفس الوقت بدقة
            const percentStr = (percent * 100) + '%';
            progressBar.style.width = percentStr;
            knob.style.right = percentStr;

            // تحديث وقت العداد مؤقتاً (Visual Only)
            const duration = this.audio.duration;
            if (duration) {
                const previewTime = duration * percent;
                // تنسيق الوقت (دقائق:ثواني)
                const format = (t) => Math.floor(t / 60) + ':' + ('0' + Math.floor(t % 60)).slice(-2);
                document.getElementById('current-time').innerText = format(previewTime);
            }
        };

        // 5. عند ترك الماوس (End Drag)
        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;

            // 🔥 إعادة السماح بتحديد النصوص
            document.body.classList.remove('noselect');

            // إرجاع الحجم للطبيعي
            knob.style.transform = "translate(50%, -50%) scale(1)";
            seekContainer.classList.remove('dragging');

            const clientX = (e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0));
            const percent = getScrubPercent(clientX);

            if (this.audio.duration) {
                this.audio.currentTime = percent * this.audio.duration;
                this.saveState();
            }

            // استأنف التشغيل لو كان شغال قبل السحب
            if (this._wasPlayingBeforeScrub) {
                this.audio.play();
                this._wasPlayingBeforeScrub = false;
            }
        };

        // ربط الأحداث (للموبايل والكمبيوتر)
        seekContainer.addEventListener('mousedown', startDrag);
        seekContainer.addEventListener('touchstart', startDrag, { passive: false });

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, { passive: false });

        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        // ==========================================
        // 🔥 تحديث دالة updateProgress الأصلية 🔥
        // ==========================================

        // Periodic Save
        setInterval(() => {
            if (!this.audio.paused && !this.isRadioMode) this.saveState();
            // 🔥 تحديث الوقت كل ثانية عشان يتأكد إنه شغال
            if (!this.audio.paused && !isNaN(this.audio.duration)) {
                this.updateProgress();
                this.updateTotalDuration();
            }
        }, 1000);
    },

    // --- Time Awareness Logic ---
    checkTimeEvents() {
        const now = new Date();
        const day = now.getDay(); // 5 is Friday
        const hour = now.getHours();

        const btn = document.getElementById('btn-time-aware');
        const btnText = document.getElementById('time-aware-text');
        const btnIcon = btn ? (btn.querySelector('iconify-icon') || btn.querySelector('i')) : null;

        // Logic:
        // Friday -> Surah Kahf
        // Night (8PM - 4AM) -> Surah Mulk
        // Morning (5AM - 10AM) -> Surah Yasin (as morning adhkar placeholder)

        if (!btn || !btnText || !btnIcon) return;

        if (day === 5) {
            btn.classList.remove('hidden');
            btnText.innerText = "سورة الكهف";
            if (btnIcon.tagName && btnIcon.tagName.toLowerCase() === 'iconify-icon') {
                btnIcon.setAttribute('icon', 'ph:star-fill');
            } else {
                btnIcon.className = "ph-fill ph-star";
            }
            btn.onclick = () => Engine.playSurah(18);
        } else if (hour >= 20 || hour <= 4) {
            btn.classList.remove('hidden');
            btnText.innerText = "أذكار النوم (الملك)";
            if (btnIcon.tagName && btnIcon.tagName.toLowerCase() === 'iconify-icon') {
                btnIcon.setAttribute('icon', 'ph:moon-fill');
            } else {
                btnIcon.className = "ph-fill ph-moon";
            }
            btn.onclick = () => Engine.playSurah(67);
        } else if (hour >= 5 && hour <= 10) {
            btn.classList.remove('hidden');
            btnText.innerText = "أذكار الصباح";
            if (btnIcon.tagName && btnIcon.tagName.toLowerCase() === 'iconify-icon') {
                btnIcon.setAttribute('icon', 'ph:sun-fill');
            } else {
                btnIcon.className = "ph-fill ph-sun";
            }
            btn.onclick = () => Engine.playSurah(36);
        } else {
            btn.classList.add('hidden');
        }
    },

    // متغيرات لتشغيل القائمة (ضيفهم أول الـ Engine)
    currentPlaylist: [],
    currentPlaylistIndex: 0,
    isPlaylistMode: false,

    // --- دالة المودات (بتعديل وضع النوم فقط) ---
    filterByMood(mood) {
        const data = MOODS_PLAYLISTS[mood];
        if (!data) return;

        this.isPlaylistMode = true;
        this.currentMoodFolder = data.folder; // حفظ اسم المجلد للاستخدام لاحقاً
        this.currentPlaylist = data.playlist;

        // === تغيير الثيم فقط في وضع النوم ===
        if (mood === 'sleep') {
            document.body.setAttribute('data-theme', 'sleep');
        } else {
            document.body.setAttribute('data-theme', 'default');
        }

        // 1. تحديث الهيرو كارد (نأخذ الصورة الأولى أو صورة عشوائية من القائمة)
        // المسار: ../assets/img/listen/modes/اسم_المجلد/رقم_الصورة.webp
        const heroImgPath = `../assets/img/listen/modes/${data.folder}/${data.playlist[0].imgIndex}.webp`;

        document.getElementById('hero-reciter-name').innerText = data.title;
        document.getElementById('hero-reciter-img').src = heroImgPath;
        document.querySelector('.hero-subtitle').innerText = "تم اختيار قائمة: " + data.title + " - استمع بقلب خاشع.";

        // 2. إعادة رسم الكروت (Grid) بالصور الجديدة
        const gridContainer = document.getElementById('main-grid');
        if (gridContainer) {
            gridContainer.innerHTML = ''; // مسح القديم

            data.playlist.forEach((track, index) => {
                // بناء مسار الصورة الخاص بهذا الكارت
                const cardImgPath = `../assets/img/listen/modes/${data.folder}/${track.imgIndex}.webp`;

                const card = document.createElement('div');
                // 👇 هام جداً: إضافة ID للكارت عشان نعرف ننده عليه
                card.id = `playlist-card-${index}`;

                card.className = "audio-card group relative bg-quran-surface border border-white/5 rounded-2xl p-4 hover:border-quran-accent/30 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden shadow-lg flex flex-col justify-between h-[155px]";
                card.onclick = () => Engine.playFromPlaylist(index);

                card.innerHTML = `
                            <div class="absolute inset-0 bg-glow-radial opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div class="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 class="font-quranText text-lg font-bold text-white group-hover:text-quran-accent transition-colors mb-1 truncate max-w-[150px]">${track.name}</h3>
                                    <p class="text-xs text-gray-500 font-sans tracking-wide uppercase">Audio Track ${index + 1}</p>
                                </div>
                                <div class="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500 bg-black">
                                    <img src="${cardImgPath}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy">
                                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                        <i class="ph-fill ph-play text-white text-lg"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="relative z-10 flex items-end justify-between border-t border-white/5 pt-3">
                                <div class="flex items-center gap-2 text-xs text-gray-500"><i class="ph-fill ph-waveform"></i> استماع</div>
                                <div class="relative w-24 h-8 flex items-end justify-start">
                                    <canvas class="visualizer-canvas" width="100" height="40"></canvas>
                                </div>
                            </div>
                        `;
                gridContainer.appendChild(card);
            });
        }

        // تشغيل أول مقطع تلقائياً
        this.playFromPlaylist(0);

        // إغلاق القائمة بعد اختيار المود
        const menu = document.getElementById('mood-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    },

    // دالة لإعادة الوضع للطبيعي (ضيفها لو مش موجودة أو حدثها)
    resetFilter() {
        document.body.setAttribute('data-theme', 'default'); // إلغاء وضع النوم
        this.isPlaylistMode = false;
        window.location.reload(); // أو إعادة بناء القائمة الأصلية
    },

    // --- Live Radio Logic ---
    toggleRadio() {
        const btn = document.getElementById('btn-live-radio');
        const pulse = document.getElementById('live-pulse');

        if (this.isRadioMode && !this.audio.paused) {
            // Stop Radio
            this.audio.pause();
            this.isRadioMode = false;
            this.setAudioSrc(); // Return to surah
            pulse.classList.add('hidden');
            btn.classList.remove('bg-red-900/40', 'border-red-500/50');
            btn.classList.add('bg-red-900/20', 'border-red-500/20');
        } else {
            // Start Radio (MP3Quran Main Radio)
            this.isRadioMode = true;
            this.audio.src = 'https://n0e.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABjSDPzXQAQu9x4Q_1tP1mrg'; // Quran Radio Cairo
            this.audio.play();

            // Update UI
            document.getElementById('player-title').innerText = "إذاعة القرآن الكريم";
            document.getElementById('player-reciter').innerText = "بث مباشر - القاهرة";
            document.getElementById('player-img').src = "https://cdn-icons-png.flaticon.com/512/3659/3659784.png";

            pulse.classList.remove('hidden');
            pulse.classList.add('animate-ping');
            btn.classList.remove('bg-red-900/20', 'border-red-500/20');
            btn.classList.add('bg-red-900/40', 'border-red-500/50');
        }
    },

    // --- Voice Search ---
    startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window)) {
            alert("متصفحك لا يدعم البحث الصوتي");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.start();

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const searchBox = document.getElementById('surah-search');
            searchBox.value = transcript;
            filterSurahs(transcript);
            searchBox.focus();
        };
    },

    // --- Standard Engine Functions ---
    loadState() {
        const savedReciterId = localStorage.getItem('quran_reciter_id');
        const savedSurahIndex = localStorage.getItem('quran_surah_index');

        if (savedReciterId) {
            this.currentReciter = RECITERS_DB.find(r => r.id === savedReciterId);
        }
        if (!this.currentReciter) {
            this.currentReciter = RECITERS_DB.find(r => r.id === 'Alafasy') || RECITERS_DB[0];
        }

        if (savedSurahIndex) {
            this.currentSurahIndex = parseInt(savedSurahIndex);
        }

        this.setAudioSrc();
    },

    saveState() {
        if (this.currentReciter) localStorage.setItem('quran_reciter_id', this.currentReciter.id);
        localStorage.setItem('quran_surah_index', this.currentSurahIndex);
        if (!isNaN(this.audio.currentTime)) localStorage.setItem('quran_last_time', this.audio.currentTime);
    },

    setAudioSrc() {
        const surahID = String(this.currentSurahIndex).padStart(3, '0');
        const reciterFolder = this.currentReciter.id; // اسم فولدر الشيخ (مثلاً Abdul_Basit)
        const fileName = `${surahID}.mp3`;

        // 1. رابط السيرفر (للتحميل أو الاستماع اونلاين)
        const remoteUrl = `${this.currentReciter.server}${surahID}.mp3`;

        // 2. رابط الملف المحلي (لو نزل)
        // https://appassets.androidplatform.net/local/quran/audio/اسم_الشيخ/001.mp3
        const localPath = `quran/audio/${reciterFolder}`;
        const localUrl = `https://appassets.androidplatform.net/local/${localPath}/${fileName}`;

        // 3. نسأل الأندرويد: الملف ده عندك؟
        let isDownloaded = false;
        if (window.Android && window.Android.isFileExists) {
            isDownloaded = window.Android.isFileExists(localPath, fileName);
        }

        // 4. القرار
        if (isDownloaded) {
            console.log("Playing Offline 📂");
            this.audio.src = localUrl;
            this.updateDownloadUI(true); // نخفي زر التحميل ونظهر علامة صح
        } else {
            console.log("Playing Online 📡");
            this.audio.src = remoteUrl;
            this.updateDownloadUI(false); // نظهر زر التحميل
        }
    },

    playSurah(index) {
        this.isPlaylistMode = false;
        this.isRadioMode = false;
        document.getElementById('live-pulse').classList.add('hidden');
        this.currentSurahIndex = index;
        this.audio.currentTime = 0;
        this.setAudioSrc();
        this.audio.play();
        this.saveState();
        this._historyTracked = false; // 🔥 إعادة تعيين - هيتسجل بعد 20 ثانية
        this.updatePlayerUI();
        this.highlightSurah(index);
        // 🔥 التأكد من تحديث المدة فور بدء التشغيل
        setTimeout(() => {
            this.updateTotalDuration();
            this.updateProgress(); // تحديث الوقت فوراً
        }, 100);
    },

    playCurrentSurah() {
        if (this.audio.paused) {
            this.audio.play();
            // 🔥 تحديث الوقت فور بدء التشغيل
            setTimeout(() => {
                this.updateProgress();
                this.updateTotalDuration();
            }, 50);
        } else {
            this.audio.pause();
        }
    },

    changeReciter(reciter) {
        const currentTime = this.audio.currentTime;
        const wasPlaying = !this.audio.paused;

        this.currentReciter = reciter;
        this.closeReciterModal();
        this.updateHeroUI();
        this.updatePlayerUI();
        this.setAudioSrc();

        // 🔥 إعادة تعيين زرار التحميل عند تغيير القارئ 🔥
        this.resetDownloadButton();

        this.audio.addEventListener('loadedmetadata', function restoreTime() {
            this.currentTime = currentTime;
            if (wasPlaying) this.play();
            // 🔥 تحديث المدة بعد تحميل الملف
            if (typeof Engine !== 'undefined') {
                Engine.updateTotalDuration();
            }
            this.removeEventListener('loadedmetadata', restoreTime);
        }, { once: true });

        this.saveState();
    },

    togglePlay() {
        if (this.audio.paused) this.audio.play();
        else this.audio.pause();
    },

    // 🔥 دالة إعادة تعيين زرار التحميل 🔥
    resetDownloadButton() {
        const btnBulk = document.getElementById('btn-bulk-download');
        if (btnBulk) {
            // إعادة الزرار للحالة الأصلية
            btnBulk.innerHTML = '<i class="fas fa-cloud-download-alt"></i> تحميل المصحف كاملاً';
            btnBulk.style.borderColor = "var(--color-accent)";
            btnBulk.style.color = "var(--color-accent)";
            btnBulk.onclick = () => this.downloadFullQuran(); // إعادة تفعيل الدالة
            btnBulk.classList.remove('cursor-default', 'opacity-80');
        }

        // إخفاء شريط التقدم إن كان ظاهر
        const progressContainer = document.getElementById('bulk-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    },

    // --- 2. دالة تشغيل مقطع من القائمة (معدلة لتحديث الهيرو كارد) ---
    playFromPlaylist(index) {
        this.currentPlaylistIndex = index;
        const track = this.currentPlaylist[index];

        this.audio.src = track.url;
        this.audio.play();

        // تحديث نصوص المشغل السفلي
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-reciter').innerText = "وضع الاستماع الخاص";

        // تحديث الصور (للمشغل السفلي + الهيرو كارد)
        if (this.currentMoodFolder) {
            // مسار الصورة الحالية
            const imgPath = `../assets/img/listen/modes/${this.currentMoodFolder}/${track.imgIndex}.webp`;

            // 1. تحديث صورة المشغل السفلي (الاسطوانة)
            const pImg = document.getElementById('player-img');
            if (pImg) {
                pImg.src = imgPath;
                pImg.classList.remove('opacity-0');
            }
            document.getElementById('player-placeholder').style.opacity = '0';

            // 2. تحديث صورة الهيرو كارد (الإضافة الجديدة هنا 🔥)
            const heroImg = document.getElementById('hero-reciter-img');
            if (heroImg) {
                heroImg.src = imgPath; // وضع نفس الصورة في الهيرو
            }

            // اختياري: تحديث عنوان الهيرو أيضاً ليطابق المقطع
            // document.getElementById('hero-reciter-name').innerText = track.name; 
        }

        // 2. تحديث حالة الكروت (Highlight Active Card) 🔥 الجزئية الجديدة
        // أولاً: إزالة النشاط من كل الكروت
        document.querySelectorAll('.audio-card').forEach(el => {
            el.classList.remove('active-card');
        });

        // ثانياً: تفعيل الكارت الحالي
        const activeCard = document.getElementById(`playlist-card-${index}`);
        if (activeCard) {
            activeCard.classList.add('active-card');
        }

        this.updatePlayState(true);
    },

    // --- 3. دالة التالي (معدلة) ---
    playNext() {
        if (this.isPlaylistMode) {
            // لو في وضع القائمة، شغل اللي بعده
            if (this.currentPlaylistIndex < this.currentPlaylist.length - 1) {
                this.playFromPlaylist(this.currentPlaylistIndex + 1);
            } else {
                // خلصت القائمة، عيد من الأول أو وقف
                this.updatePlayState(false);
            }
        } else {
            // الوضع العادي (السور)
            if (this.currentSurahIndex < 114) {
                this.playSurah(this.currentSurahIndex + 1);
            }
        }
    },

    playPrev() {
        if (this.isPlaylistMode) {
            // لو في وضع القائمة، شغل اللي قبله
            if (this.currentPlaylistIndex > 0) {
                this.playFromPlaylist(this.currentPlaylistIndex - 1);
            }
        } else {
            // الوضع العادي (السور)
            if (this.currentSurahIndex > 1) this.playSurah(this.currentSurahIndex - 1);
        }
    },

    // --- متغيرات التحميل الجماعي ---
    bulkQueue: [],          // طابور السور المنتظرة
    totalBulkCount: 0,      // العدد الكلي (عشان نحسب النسبة)
    isBulkDownloading: false,

    downloadCurrentSurah() {
        const surahID = String(this.currentSurahIndex).padStart(3, '0');
        const reciterFolder = this.currentReciter.id;
        const fileName = `${surahID}.mp3`;
        const remoteUrl = `${this.currentReciter.server}${surahID}.mp3`;
        const localFolder = `quran/audio/${reciterFolder}`;

        // استدعاء وحش التحميل من الأندرويد (اللي لسه مضبطينه)
        if (window.Android && window.Android.downloadFile) {
            // نغير شكل الزرار لـ "جاري التحميل"
            const btn = document.getElementById('btn-download-surah');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
                btn.disabled = true;
            }

            window.Android.downloadFile(remoteUrl, localFolder, fileName);
        } else {
            alert("خاصية التحميل متاحة فقط في التطبيق");
        }
    },

    // === نظام التكرار ===
    cycleRepeatMode() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        // تحديث الموبايل والديسكتوب
        ['btn-repeat', 'btn-repeat-desktop'].forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const badge = btn.querySelector('.tool-badge');
            if (this.repeatMode === 0) {
                btn.classList.remove('active');
                if (badge) badge.classList.add('hidden');
            } else if (this.repeatMode === 1) {
                btn.classList.add('active');
                if (badge) badge.classList.add('hidden');
            } else {
                btn.classList.add('active');
                if (badge) { badge.classList.remove('hidden'); badge.textContent = '1'; }
            }
        });
    },

    // === نظام السرعة ===
    speedOptions: [1, 1.25, 1.5, 0.75],
    currentSpeedIndex: 0,

    cycleSpeed() {
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedOptions.length;
        const speed = this.speedOptions[this.currentSpeedIndex];
        this.audio.playbackRate = speed;
        const txt = speed === 1 ? '1x' : speed + 'x';
        // تحديث الموبايل والديسكتوب
        ['speed-label', 'speed-label-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = txt;
        });
        ['btn-speed', 'btn-speed-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { if (speed !== 1) el.classList.add('active'); else el.classList.remove('active'); }
        });
    },

    // === نظام مؤقت النوم (النافذة الاحترافية) ===
    toggleSleepPopup() {
        const popup = document.getElementById('sleep-popup');
        const overlay = document.getElementById('sleep-overlay');
        if (popup && overlay) {
            const isActive = popup.classList.contains('active');
            if (isActive) {
                this.closeSleepPopup();
            } else {
                popup.classList.add('active');
                overlay.classList.add('active');
            }
        }
    },

    closeSleepPopup() {
        const popup = document.getElementById('sleep-popup');
        const overlay = document.getElementById('sleep-overlay');
        if (popup) popup.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    },

    setSleepTimer(minutes) {
        // إلغاء أي مؤقت سابق
        if (this.sleepTimerId) clearTimeout(this.sleepTimerId);
        if (this.sleepCountdownId) clearInterval(this.sleepCountdownId);

        const activeDisplay = document.getElementById('sleep-active-display');
        const countdownBig = document.getElementById('sleep-countdown-big');

        // تفعيل الزر (موبايل + ديسكتوب)
        ['btn-sleep', 'btn-sleep-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        });

        // هايلايت الزر المختار
        document.querySelectorAll('.sleep-option-btn').forEach(b => {
            b.classList.remove('active-timer');
            if (parseInt(b.dataset.minutes) === minutes) b.classList.add('active-timer');
        });

        // إظهار العد التنازلي الكبير
        if (activeDisplay) activeDisplay.classList.remove('hidden');

        // حساب وقت الانتهاء
        this.sleepEndTime = Date.now() + (minutes * 60 * 1000);

        // تحديث العد التنازلي
        const updateCountdown = () => {
            const remaining = this.sleepEndTime - Date.now();
            if (remaining <= 0) {
                this.audio.pause();
                this.cancelSleepTimer();
                return;
            }
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            if (countdownBig) countdownBig.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
        };

        updateCountdown();
        this.sleepCountdownId = setInterval(updateCountdown, 1000);

        // المؤقت الرئيسي
        this.sleepTimerId = setTimeout(() => {
            this.audio.pause();
            this.cancelSleepTimer();
        }, minutes * 60 * 1000);
    },

    cancelSleepTimer() {
        if (this.sleepTimerId) {
            clearTimeout(this.sleepTimerId);
            this.sleepTimerId = null;
        }
        if (this.sleepCountdownId) {
            clearInterval(this.sleepCountdownId);
            this.sleepCountdownId = null;
        }
        this.sleepEndTime = null;

        const activeDisplay = document.getElementById('sleep-active-display');
        const countdownBig = document.getElementById('sleep-countdown-big');

        // إلغاء تفعيل الزر (موبايل + ديسكتوب)
        ['btn-sleep', 'btn-sleep-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        if (activeDisplay) activeDisplay.classList.add('hidden');
        if (countdownBig) countdownBig.textContent = '00:00';

        // إزالة هايلايت الأزرار
        document.querySelectorAll('.sleep-option-btn').forEach(b => b.classList.remove('active-timer'));

        // غلق الـ popup
        this.closeSleepPopup();
    },

    // === نظام التحكم بالصوت ===
    previousVolume: 1,

    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 1);
        }
    },

    setVolume(vol) {
        vol = Math.max(0, Math.min(1, vol));
        this.audio.volume = vol;

        // تحديث الشريط الأفقي (ديسكتوب)
        const fill = document.getElementById('volume-fill');
        const knob = document.getElementById('volume-knob');
        if (fill) fill.style.width = (vol * 100) + '%';
        if (knob) knob.style.left = (vol * 100) + '%';

        // تحديث الشريط العمودي (موبايل)
        this._updateMobileVolumeUI(vol);

        // تحديث الأيقونة
        this.updateVolumeIcon(vol);
    },

    updateVolumeIcon(vol) {
        const icon = document.getElementById('volume-icon-desktop');
        if (icon) {
            icon.className = 'fas text-[14px] ';
            if (vol === 0) icon.className += 'fa-volume-mute';
            else if (vol < 0.35) icon.className += 'fa-volume-off';
            else if (vol < 0.7) icon.className += 'fa-volume-down';
            else icon.className += 'fa-volume-up';
        }
        // تحديث أيقونة الموبايل كمان
        const mobileIcon = document.getElementById('volume-icon-mobile');
        if (mobileIcon) {
            mobileIcon.className = 'fas text-[13px] ';
            if (vol === 0) mobileIcon.className += 'fa-volume-mute';
            else if (vol < 0.35) mobileIcon.className += 'fa-volume-off';
            else if (vol < 0.7) mobileIcon.className += 'fa-volume-down';
            else mobileIcon.className += 'fa-volume-up';
        }
    },

    // === شريط الصوت العمودي للموبايل ===
    _mobileVolumeOpen: false,
    _mobileVolumeTimer: null,

    toggleMobileVolume() {
        const popup = document.getElementById('mobile-volume-popup');
        if (!popup) return;

        if (this._mobileVolumeOpen) {
            popup.classList.add('hidden');
            this._mobileVolumeOpen = false;
        } else {
            popup.classList.remove('hidden');
            this._mobileVolumeOpen = true;
            this._updateMobileVolumeUI(this.audio.volume);
            this._startMobileVolumeAutoClose();
        }
    },

    _startMobileVolumeAutoClose() {
        clearTimeout(this._mobileVolumeTimer);
        this._mobileVolumeTimer = setTimeout(() => {
            const popup = document.getElementById('mobile-volume-popup');
            if (popup) popup.classList.add('hidden');
            this._mobileVolumeOpen = false;
        }, 3000);
    },

    _updateMobileVolumeUI(vol) {
        const fill = document.getElementById('mobile-volume-fill');
        const label = document.getElementById('mobile-volume-label');
        const knob = document.getElementById('mobile-volume-knob');
        const pct = (vol * 100);
        if (fill) fill.style.height = pct + '%';
        if (knob) knob.style.bottom = pct + '%';
        if (label) label.textContent = Math.round(pct) + '%';
    },

    initMobileVolumeSlider() {
        const track = document.getElementById('mobile-volume-track');
        if (!track) return;

        let isDragging = false;

        const getVolFromY = (clientY) => {
            const rect = track.getBoundingClientRect();
            // فوق الشريط = صوت عالي، تحت = واطي
            let ratio = (rect.bottom - clientY) / rect.height;
            return Math.max(0, Math.min(1, ratio));
        };

        const onStart = (e) => {
            isDragging = true;
            e.preventDefault();
            e.stopPropagation();
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const vol = getVolFromY(clientY);
            this.setVolume(vol);
            this._updateMobileVolumeUI(vol);
            clearTimeout(this._mobileVolumeTimer);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const vol = getVolFromY(clientY);
            this.setVolume(vol);
            this._updateMobileVolumeUI(vol);
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            this._startMobileVolumeAutoClose();
        };

        track.addEventListener('touchstart', onStart, { passive: false });
        track.addEventListener('mousedown', onStart);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);

        // إغلاق لما يدوس برة
        document.addEventListener('click', (e) => {
            const wrapper = document.getElementById('mobile-volume-wrapper');
            if (this._mobileVolumeOpen && wrapper && !wrapper.contains(e.target)) {
                const popup = document.getElementById('mobile-volume-popup');
                if (popup) popup.classList.add('hidden');
                this._mobileVolumeOpen = false;
            }
        });
    },

    initVolumeSlider() {
        const track = document.getElementById('volume-track');
        const knob = document.getElementById('volume-knob');
        if (!track || !knob) return;

        let isDraggingVol = false;

        const getVolFromEvent = (e) => {
            const rect = track.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            return Math.max(0, Math.min(1, x / rect.width));
        };

        // ابدأ السحب بمجرد الضغط في أي مكان على الشريط أو الدائرة
        const startDrag = (e) => {
            e.preventDefault();
            isDraggingVol = true;
            document.body.style.cursor = 'grabbing';
            this.setVolume(getVolFromEvent(e)); // تحديث فوري للمكان
        };

        track.addEventListener('mousedown', startDrag);
        // knob.addEventListener('mousedown', startDrag); // مش محتاجينها لأن knob جوه track

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingVol) return;
            this.setVolume(getVolFromEvent(e));
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingVol) {
                isDraggingVol = false;
                document.body.style.cursor = '';
            }
        });
    },

    // === قائمة "بماذا تشعر" بتأخير ذكي ===
    initMoodMenu() {
        const btn = document.getElementById('mood-btn');
        const menu = document.getElementById('mood-menu');
        let hideTimeout;

        if (!btn || !menu) return;

        const showMenu = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            menu.classList.remove('hidden');
        };

        const hideMenuWithDelay = () => {
            hideTimeout = setTimeout(() => {
                menu.classList.add('hidden');
            }, 500);
        };

        // hover events بس على الديسكتوب (ماوس حقيقي)
        const isDesktop = window.matchMedia('(pointer: fine)').matches;
        if (isDesktop) {
            btn.addEventListener('mouseenter', showMenu);
            btn.addEventListener('mouseleave', hideMenuWithDelay);
            menu.addEventListener('mouseenter', showMenu);
            menu.addEventListener('mouseleave', hideMenuWithDelay);
        }

        // click للموبايل والديسكتوب
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menu.classList.contains('hidden')) {
                showMenu();
            } else {
                menu.classList.add('hidden');
            }
        });

        // إغلاق لما يدوس برة
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    },

    // 1. دالة بدء تحميل المصحف كاملاً
    downloadFullQuran() {
        console.log("📥 Download Full Quran button clicked!");

        if (this.isBulkDownloading) return;

        // إظهار واجهة التحميل
        const progressContainer = document.getElementById('bulk-progress-container');
        const btnBulk = document.getElementById('btn-bulk-download');

        if (progressContainer) progressContainer.style.display = 'block';
        if (btnBulk) btnBulk.style.display = 'none';

        this.bulkQueue = [];
        const reciterFolder = this.currentReciter.id;

        // 1. فحص الملفات وتجهيز الطابور
        for (let i = 1; i <= 114; i++) {
            const surahID = String(i).padStart(3, '0') + ".mp3";
            let exists = false;

            // التحقق من وجود الملف
            if (window.Android && window.Android.isFileExists) {
                exists = window.Android.isFileExists(`quran/audio/${reciterFolder}`, surahID);
            }

            // إذا لم يكن موجوداً، أضفه للطابور
            if (!exists) {
                this.bulkQueue.push(i);
            }
        }

        // 🔥 التعديل الجوهري هنا 🔥
        // بدلاً من جعل العدد الكلي يساوي حجم الطابور المتبقي
        // سنجعله دائماً 114، وبذلك يعرف الكود أن هناك سوراً قد انتهت بالفعل
        this.totalBulkCount = 114;

        // حساب عدد السور المنتهية مسبقاً
        const alreadyDone = 114 - this.bulkQueue.length;
        const startPercent = Math.round((alreadyDone / 114) * 100);

        // تحديث النصوص فوراً
        const countSpan = document.getElementById('bulk-count');
        if (countSpan) countSpan.innerText = `${alreadyDone}/114`;

        // تحديث الشريط بالنسبة الحالية (مثلاً يبدأ من 10% لو محمل 10 سور)
        const progressBar = document.getElementById('bulk-progress-bar');
        if (progressBar) progressBar.style.width = `${startPercent}%`;

        // 🔥 إظهار وتحديث الدائرة العائمة فوراً 🔥
        if (this.bulkQueue.length > 0) {
            const firstSurahIndex = this.bulkQueue[0];
            const firstSurahName = surahNames[firstSurahIndex];
            this.updateFloatingWidget(startPercent, `سورة ${firstSurahName}`);
        }

        if (this.bulkQueue.length === 0) {
            if (window.UI && window.UI.showToast) window.UI.showToast("المصحف محمل بالكامل مسبقاً ✅");
            this.finishBulkDownload();
            return;
        }

        this.isBulkDownloading = true;
        this.processBulkQueue(); // ابدأ التحميل
    },

    updateHeroUI() {
        const heroName = document.getElementById('hero-reciter-name');
        const heroImg = document.getElementById('hero-reciter-img');
        if (heroName) heroName.innerText = this.currentReciter.name;
        if (heroImg) {
            heroImg.src = this.currentReciter.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentReciter.name)}&background=1a1a2e&color=d4af37&size=200&font-size=0.4&bold=true`;
        }
    },

    updateDownloadUI(isDownloaded) {
        // لازم يكون عندك زرار في الـ HTML واخد ID="btn-download-surah"
        const btn = document.getElementById('btn-download-surah');
        if (!btn) return;

        if (isDownloaded) {
            // لو متحملة: زرار أخضر غير قابل للضغط (أو يمسح لو حبيت تطورها)
            btn.innerHTML = '<i class="fas fa-check-circle" style="color:#4ff0b7;"></i>';
            btn.onclick = null;
            btn.title = "موجودة على الجهاز";
            btn.style.opacity = "1";
        } else {
            // لو مش متحملة: زرار تحميل
            btn.innerHTML = '<i class="fas fa-download"></i>';
            btn.onclick = () => this.downloadCurrentSurah();
            btn.title = "تحميل للاستماع بدون نت";
            btn.disabled = false;
            btn.style.opacity = "0.7";
        }
    },

    // 2. دالة معالجة الطابور (بتشتغل تكرارياً)
    processBulkQueue() {
        if (this.bulkQueue.length === 0) {
            this.finishBulkDownload();
            return;
        }

        const surahIndex = this.bulkQueue[0];
        const currentSurahName = surahNames[surahIndex];

        // حساب النسبة الكلية
        const doneCount = this.totalBulkCount - this.bulkQueue.length;
        const percent = (doneCount / this.totalBulkCount) * 100;

        // 1. تحديث الويدجت العائم في التطبيق
        this.updateFloatingWidget(percent, `سورة ${currentSurahName}`);

        // 2. تحديث إشعار الأندرويد (الستارة) 🔥
        if (window.Android && window.Android.updateNotification) {
            window.Android.updateNotification(
                "جاري تحميل المصحف الشريف", // العنوان الرئيسي
                `سورة ${currentSurahName} (${Math.round(percent)}%)`, // النص التفصيلي
                Math.round(percent) // النسبة
            );
        }

        // تجهيز بيانات التحميل
        const surahID = String(surahIndex).padStart(3, '0');
        const fileName = `${surahID}.mp3`;
        const remoteUrl = `${this.currentReciter.server}${surahID}.mp3`;
        const localFolder = `quran/audio/${this.currentReciter.id}`;

        // إرسال الأمر للأندرويد
        if (window.Android && window.Android.downloadFile) {
            window.Android.downloadFile(remoteUrl, localFolder, fileName);
        } else {
            console.log("Simulation: Downloading " + fileName);
            // محاكاة للكمبيوتر
            setTimeout(() => window.onDownloadComplete(fileName), 500);
        }
    },

    // 3. دالة الإنهاء
    finishBulkDownload() {
        this.hideFloatingWidget(); // إخفاء الويدجت عند الانتهاء
        this.isBulkDownloading = false;
        this.bulkQueue = [];
        document.getElementById('bulk-status-text').innerText = "تم اكتمال التحميل بنجاح! 🎉";
        document.getElementById('bulk-progress-bar').style.width = "100%";

        // 🔥 تحديث زرار التحميل ليظهر أنه تم الانتهاء 🔥
        const btnBulk = document.getElementById('btn-bulk-download');
        if (btnBulk) {
            btnBulk.innerHTML = '<i class="fas fa-check-circle"></i> تم تحميل المصحف';
            btnBulk.style.borderColor = "#4ff0b7"; // اللون الأخضر
            btnBulk.style.color = "#4ff0b7";
            btnBulk.onclick = null; // تعطيل الزرار حتى ما يشتغل تاني
            btnBulk.classList.add('cursor-default', 'opacity-80');
        }

        setTimeout(() => {
            document.getElementById('bulk-progress-container').style.display = 'none';
            document.getElementById('btn-bulk-download').style.display = 'inline-block';
            if (typeof UI !== 'undefined' && UI.showToast) UI.showToast("تم تحميل المصحف كاملاً ✅");

            // تحديث زرار السورة الحالية لو كانت بتتحمل
            this.setAudioSrc();
        }, 3000);
    },

    // تحديث الدائرة العائمة
    updateFloatingWidget(percent, surahName) {
        console.log(`📊 Updating widget: ${percent}% - ${surahName}`); // Debug log
        const widget = document.getElementById('floating-download-widget');
        const ring = document.getElementById('widget-progress-ring');
        const img = document.getElementById('widget-reciter-img');

        // إظهار الويدجت لو مخفي
        if (widget && widget.classList.contains('translate-y-[-150%]')) {
            widget.classList.remove('translate-y-[-150%]');
            widget.classList.add('translate-y-0'); // explicitly add the visible class
            console.log("🔧 Floating widget shown"); // Debug log
            if (img && this.currentReciter && this.currentReciter.img) {
                img.src = this.currentReciter.img; // وضع صورة الشيخ
            }
        }

        // حساب الدائرة (المحيط = 2 * ط * نق = 2 * 3.14 * 45 ≈ 283)
        const circumference = 283;
        const offset = circumference - (percent / 100) * circumference;

        if (ring) {
            ring.style.strokeDashoffset = offset;
            // Fallback color if CSS variable doesn't work
            ring.style.stroke = "#4ff0b7"; // The actual accent color from CSS
            console.log(`🎨 Ring offset set to: ${offset} (percent: ${percent})`); // Debug log
            console.log(`🎨 Ring stroke color:`, ring.style.stroke); // Debug log
            // Force reflow to ensure the change takes effect
            ring.getBoundingClientRect();
        }

        const surahNameElement = document.getElementById('widget-surah-name');
        const percentElement = document.getElementById('widget-percent-text');

        if (surahNameElement) {
            surahNameElement.innerText = surahName;
        }
        if (percentElement) {
            percentElement.innerText = Math.round(percent) + "%";
        }
    },

    // إخفاء الويدجت عند الانتهاء
    hideFloatingWidget() {
        const widget = document.getElementById('floating-download-widget');
        widget.classList.add('translate-y-[-150%]');

        // إلغاء إشعار الأندرويد عند الانتهاء
        if (window.Android && window.Android.cancelNotification) {
            window.Android.cancelNotification();
        }
    },

    // دالة مساعدة لتحديث عنصر في الموبايل والديسكتوب
    _syncEl(baseId, action) {
        [baseId, baseId + '-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) action(el);
        });
    },

    updatePlayerUI() {
        // === الحالة الأولى: وضع القوائم (مود) ===
        if (this.isPlaylistMode && this.currentPlaylist[this.currentPlaylistIndex]) {
            const track = this.currentPlaylist[this.currentPlaylistIndex];
            this._syncEl('player-title', el => el.innerText = track.name);
            this._syncEl('player-reciter', el => el.innerText = "وضع الاستماع الخاص");

            if (this.currentMoodFolder) {
                const imgPath = `mode/${this.currentMoodFolder}/${track.imgIndex}.webp`;
                this._syncEl('player-img', el => { el.src = imgPath; el.classList.remove('opacity-0'); });
                this._syncEl('player-placeholder', el => el.style.opacity = '0');
            }

        } else {
            const surahName = surahNames[this.currentSurahIndex];
            this._syncEl('player-title', el => el.innerText = `سورة ${surahName}`);
            this._syncEl('player-reciter', el => el.innerText = this.currentReciter.name);

            const imgSrc = this.currentReciter.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentReciter.name)}&background=1a1a2e&color=d4af37&size=100&font-size=0.4&bold=true`;
            this._syncEl('player-img', el => { el.src = imgSrc; el.classList.remove('opacity-0'); });
            this._syncEl('player-placeholder', el => el.style.opacity = '0');

            this.highlightSurah(this.currentSurahIndex);
        }
    },
    updatePlayState(isPlaying) {
        this.isPlaying = isPlaying;

        const playIcon = '<img src="../assets/icon/svg/play-fill.svg" class="local-icon w-4 h-4" style="filter: brightness(0);">';
        const pauseIcon = '<img src="../assets/icon/svg/pause-fill.svg" class="local-icon w-4 h-4" style="filter: brightness(0);">';

        // تحديث كل أزرار التشغيل (موبايل + ديسكتوب + hidden)
        ['play-btn', 'play-btn-desktop', 'play-btn-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = isPlaying ? pauseIcon : playIcon;
        });

        // تحديث دوران الاسطوانة (موبايل + ديسكتوب)
        ['player-art-container', 'player-art-container-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });

        // 🔥 تشغيل المحلل الصوتي الحقيقي 🔥
        if (isPlaying) {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            this.animateBars();
        } else {
            cancelAnimationFrame(this.animationId);
        }
    },

    updateProgress() {
        if (typeof isDragging !== 'undefined' && isDragging) return;

        const { currentTime, duration } = this.audio;
        if (isNaN(duration) || !isFinite(duration) || duration === 0) return;

        const percent = (currentTime / duration) * 100;

        const progressBar = document.getElementById('progress-bar');
        const knob = document.getElementById('seek-knob');

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (knob) knob.style.right = `${percent}%`;

        // تحديث الشريط المصغر (موبايل + ديسكتوب)
        ['progress-bar-mini', 'progress-bar-mini-desktop'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.width = `${percent}%`;
        });

        const format = (t) => Math.floor(t / 60) + ':' + ('0' + Math.floor(t % 60)).slice(-2);
        this._syncEl('current-time', el => el.innerText = format(currentTime));

        this.updateTotalDuration();
    },

    updateTotalDuration() {
        const duration = this.audio.duration;
        if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
            const format = (t) => Math.floor(t / 60) + ':' + ('0' + Math.floor(t % 60)).slice(-2);
            this._syncEl('total-duration', el => el.innerText = format(duration));
        } else {
            this._syncEl('total-duration', el => el.innerText = '00:00');
        }
    },

    highlightSurah(index) {
        // 1. تلوين العنصر في القائمة الجانبية (Sidebar)
        document.querySelectorAll('.active-playing').forEach(el => el.classList.remove('active-playing'));
        const sidebarItem = document.getElementById(`surah-item-${index}`);
        if (sidebarItem) sidebarItem.classList.add('active-playing');

        // 2. تلوين البطاقة في الشبكة الرئيسية (Grid Card) 🔥 هذا هو الجديد

        // أولاً: إزالة التلوين من جميع الكروت (سواء سور أو مودات)
        document.querySelectorAll('.audio-card').forEach(el => {
            el.classList.remove('active-card');
        });

        // ثانياً: تلوين كارت السورة المطلوب (إذا كان موجوداً في الصفحة)
        const gridCard = document.getElementById(`card-surah-${index}`);
        if (gridCard) {
            gridCard.classList.add('active-card');
        }
    },

    buildSidebar() {
        const surahContainer = document.getElementById('surah-list-container');
        if (!surahContainer) return;
        surahContainer.innerHTML = '';

        surahNames.forEach((name, index) => {
            if (index === 0) return;
            let type = [2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 110].includes(index) ? "مدنية" : "مكية";

            const item = document.createElement('div');
            item.className = 'surah-item group';
            item.id = `surah-item-${index}`;
            item.onclick = () => Engine.playSurah(index);
            item.innerHTML = `
                        <div class="surah-badge">${index}</div>
                        <div class="surah-info">
                            <div class="surah-name">سورة ${name}</div>
                            <div class="surah-desc">${type} • استماع</div>
                        </div>
                    `;
            surahContainer.appendChild(item);
        });
    },

    buildReciterModal(query = '') {
        const container = document.getElementById('reciter-list-container');
        if (!container) return;
        container.innerHTML = '';

        // Filter reciters based on search query using enhanced search
        let filteredReciters = RECITERS_DB;
        if (query && query.trim() !== '') {
            // First try the enhanced search from our new search system
            if (typeof window.ENHANCED_SEARCH !== 'undefined' && typeof window.ENHANCED_SEARCH.enhancedSearchReciters === 'function') {
                const searchResults = window.ENHANCED_SEARCH.enhancedSearchReciters(query);
                const resultIds = searchResults.map(result => result.id);
                filteredReciters = RECITERS_DB.filter(r => 
                    resultIds.includes(r.id) ||
                    r.name.toLowerCase().includes(query.toLowerCase()) || 
                    (r.style && r.style.toLowerCase().includes(query.toLowerCase()))
                );
            } else {
                // Fallback to basic search
                const searchTerm = query.toLowerCase().trim();
                filteredReciters = RECITERS_DB.filter(r => 
                    r.name.toLowerCase().includes(searchTerm) || 
                    (r.style && r.style.toLowerCase().includes(searchTerm))
                );
            }
        }

        const oldReciters = filteredReciters.filter(r => !r.isNew);
        const newReciters = filteredReciters.filter(r => r.isNew);

        const buildCard = (reciter) => {
            const card = document.createElement('div');
            card.className = 'reciter-card' + (reciter.isNew ? ' reciter-new' : '');
            card.onclick = () => Engine.changeReciter(reciter);

            let iconHtml = '<div class="reciter-icon"><i class="fas fa-user-tie"></i></div>';
            if (reciter.img) {
                iconHtml = `<div class="reciter-icon"><img src="${reciter.img}" alt="${reciter.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-user-tie\\'></i>'"></div>`;
            }

            const newDot = reciter.isNew ? '<span class="new-reciter-dot"></span>' : '';

            card.innerHTML = `${newDot}${iconHtml}<div class="reciter-name">${reciter.name}</div><div class="reciter-style">${reciter.style || 'مصحف كامل'}</div>`;
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

    openReciterModal() {
        MobileNav.pushState('reciter');
        document.getElementById('reciter-modal').classList.add('visible');
        this.filterReciters('');
        document.getElementById('reciter-search-input').focus();
    },

    filterReciters(query) {
        this.buildReciterModal(query); // Re-render with filtered results
    },
    closeReciterModal() { document.getElementById('reciter-modal').classList.remove('visible'); },

    // --- متغيرات المحرك الفيزيائي الجديد ---
    audioContext: null,
    analyser: null,
    dataArray: null,
    source: null,
    animationId: null,
    visualizerCtx: null, // فرشاة الرسم
    activeCanvas: null,  // اللوحة النشطة حالياً
    barHeights: [],      // لتخزين الطول الحالي (لعمل تأثير الفيزيا)

    // إعداد المحلل (كما هو، لكن سنغير دقة التحليل)
    initAudioVisualizer() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();

        // 🔥 زيادة الدقة للحصول على تفاصيل أكثر
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.8; // تنعيم البيانات الخام

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        // مصفوفة لتخزين الارتفاعات الحالية لكل عمود (عشان الفيزيا)
        // سنرسم 5 أعمدة، فنحتاج 5 قيم ابتدائية
        this.barHeights = [0, 0, 0, 0, 0];

        try {
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (e) { console.log(e); }
    },

    animateBars() {
        this.animationId = requestAnimationFrame(() => this.animateBars());

        const activeCard = document.querySelector('.active-card');
        if (!activeCard) return;

        const canvas = activeCard.querySelector('.visualizer-canvas');
        if (!canvas) return;

        if (this.activeCanvas !== canvas) {
            this.activeCanvas = canvas;
            this.visualizerCtx = canvas.getContext('2d');
        }

        const ctx = this.visualizerCtx;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const isPlaying = !this.audio.paused;

        if (isPlaying) {
            this.analyser.getByteFrequencyData(this.dataArray);
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, "rgba(79, 240, 183, 0.2)");
            gradient.addColorStop(0.5, "rgba(79, 240, 183, 0.8)");
            gradient.addColorStop(1, "#ffffff");
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // رمادي واضح
        }

        const barCount = 5;
        const barWidth = 6;
        const gap = 4;
        const startX = 0;

        const freqIndexes = [5, 12, 20, 30, 45];

        for (let i = 0; i < barCount; i++) {
            let targetHeight;

            if (isPlaying) {
                const targetValue = this.dataArray[freqIndexes[i]];
                targetHeight = (targetValue / 255) * height;
                this.barHeights[i] = this.lerp(this.barHeights[i], Math.max(4, targetHeight), 0.2);
            } else {
                // 🔥 هنا التعديل: زدنا الأطوال عشان متبقاش نقط
                // كانت [6, 10, 14...] والآن كبرناها
                const idleHeights = [12, 18, 24, 18, 12];
                this.barHeights[i] = this.lerp(this.barHeights[i], idleHeights[i], 0.1);
            }

            const x = startX + (i * (barWidth + gap));
            const y = height - this.barHeights[i];

            // قللنا نصف القطر لـ 2 عشان الشكل يبقى "عمودي" أكتر
            this.roundRect(ctx, x, y, barWidth, this.barHeights[i], 2);
            ctx.fill();
        }
    },

    // دالة مساعدة للنعومة (Interpolation)
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    },

    // دالة رسم مستطيل بحواف دائرية (لأن الكانفاس لا يدعمها مباشرة بسهولة)
    roundRect(ctx, x, y, w, h, radius) {
        if (w < 2 * radius) radius = w / 2;
        if (h < 2 * radius) radius = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    },

    // --- دالة لرسم الأعمدة الرمادية فوراً عند التحميل ---
    drawStaticVisualizers() {
        // نختار كل الكانفاس الموجود في الصفحة
        const canvases = document.querySelectorAll('.visualizer-canvas');

        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // تنظيف
            ctx.clearRect(0, 0, width, height);

            // اللون الرمادي
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // جعلناه أفتح قليلاً ليظهر بوضوح

            const barCount = 5;
            const barWidth = 6;
            const gap = 4;
            const startX = 0; // محاذاة لليسار

            // أطوال "محترمة" عشان متبقاش نقط (أطول من السابق)
            const idleHeights = [12, 18, 24, 18, 12];

            for (let i = 0; i < barCount; i++) {
                const h = idleHeights[i];
                const x = startX + (i * (barWidth + gap));
                const y = height - h;

                // رسمنا نصف القطر 2 بدل 3 عشان يبان عمود مش كبسولة
                this.roundRect(ctx, x, y, barWidth, h, 2);
                ctx.fill();
            }
        });
    },

    // ====================================================
    // 🔥 نظام الفلترة الذكية (مفضلة + هيستوري + تحميل) 🔥
    // ====================================================

    activeFilter: null, // null | 'favorites' | 'history' | 'downloaded'

    // --- المفضلة ---
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('quran_favorites') || '[]');
        } catch { return []; }
    },

    saveFavorites(arr) {
        localStorage.setItem('quran_favorites', JSON.stringify(arr));
    },

    toggleFavorite(surahIndex, event) {
        if (event) { event.stopPropagation(); event.preventDefault(); }

        let favs = this.getFavorites();
        const idx = favs.indexOf(surahIndex);

        if (idx > -1) {
            favs.splice(idx, 1); // إزالة
        } else {
            favs.push(surahIndex); // إضافة
        }
        this.saveFavorites(favs);

        // تحديث شكل الزر
        const btn = document.querySelector(`[data-fav-surah="${surahIndex}"]`);
        if (btn) {
            const isFav = favs.includes(surahIndex);
            if (isFav) {
                btn.classList.add('is-favorite', 'heart-animate');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                setTimeout(() => btn.classList.remove('heart-animate'), 400);
            } else {
                btn.classList.remove('is-favorite');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        }

        // لو الفلتر النشط هو المفضلة، حدّث الكروت
        if (this.activeFilter === 'favorites') {
            this.applyFilter('favorites');
        }
    },

    isFavorite(surahIndex) {
        return this.getFavorites().includes(surahIndex);
    },

    // --- الهيستوري ---
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('quran_listen_history') || '[]');
        } catch { return []; }
    },

    addToHistory(surahIndex) {
        let history = this.getHistory();
        // حذف لو موجود سابقاً (عشان يروح للأول)
        history = history.filter(s => s !== surahIndex);
        // إضافة في الأول
        history.unshift(surahIndex);
        // نخلي بس آخر 10
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.setItem('quran_listen_history', JSON.stringify(history));
    },

    // --- التحميلات ---
    getDownloadedSurahs() {
        const downloaded = [];
        if (window.Android && window.Android.isFileExists) {
            const reciterFolder = this.currentReciter ? this.currentReciter.id : 'Alafasy';
            for (let i = 1; i <= 114; i++) {
                const surahID = String(i).padStart(3, '0') + '.mp3';
                if (window.Android.isFileExists(`quran/audio/${reciterFolder}`, surahID)) {
                    downloaded.push(i);
                }
            }
        }
        return downloaded;
    },

    // --- تبديل الفلتر ---
    toggleFilter(filterName) {
        if (this.activeFilter === filterName) {
            this.clearFilter();
        } else {
            this.applyFilter(filterName);
        }
    },

    // --- تطبيق الفلتر ---
    applyFilter(filterName) {
        this.activeFilter = filterName;

        // 1. تحديث شكل الأزرار
        this._updateFilterButtons();

        // 2. الحصول على السور المفلترة
        let filteredSurahs = [];
        let bannerIcon = '';
        let bannerText = '';
        let bannerColor = '';

        if (filterName === 'favorites') {
            filteredSurahs = this.getFavorites();
            bannerIcon = 'fas fa-heart';
            bannerText = 'سورك المفضلة';
            bannerColor = '#ef4444';
        } else if (filterName === 'history') {
            filteredSurahs = this.getHistory();
            bannerIcon = 'fas fa-history';
            bannerText = 'آخر السور المستمعة';
            bannerColor = '#3b82f6';
        } else if (filterName === 'downloaded') {
            filteredSurahs = this.getDownloadedSurahs();
            bannerIcon = 'fas fa-cloud-download-alt';
            bannerText = 'السور المحمّلة على جهازك';
            bannerColor = '#4ff0b7';
        }

        // 3. تحديث البانر
        const banner = document.getElementById('filter-status-banner');
        const iconEl = document.getElementById('filter-status-icon');
        const textEl = document.getElementById('filter-status-text');

        if (banner && iconEl && textEl) {
            if (filteredSurahs.length === 0) {
                // لو مفيش نتائج
                let emptyMsg = '';
                if (filterName === 'favorites') emptyMsg = 'لم تضف أي سورة للمفضلة بعد';
                else if (filterName === 'history') emptyMsg = 'لم تستمع لأي سورة بعد';
                else if (filterName === 'downloaded') emptyMsg = 'لم تحمّل أي سورة بعد';

                iconEl.className = bannerIcon;
                iconEl.style.color = bannerColor;
                textEl.textContent = emptyMsg;
                banner.classList.remove('hidden');
            } else {
                iconEl.className = bannerIcon;
                iconEl.style.color = bannerColor;
                textEl.textContent = bannerText;
                banner.classList.remove('hidden');
            }
        }

        // 4. إعادة بناء الكروت
        this._rebuildGrid(filteredSurahs, filterName);
    },

    // --- إلغاء الفلتر ---
    clearFilter() {
        this.activeFilter = null;
        this._updateFilterButtons();

        // إخفاء البانر
        const banner = document.getElementById('filter-status-banner');
        if (banner) banner.classList.add('hidden');

        // إعادة بناء الكروت الأصلية
        this._rebuildGrid(null, null);
    },

    // --- تحديث شكل أزرار الفلتر ---
    _updateFilterButtons() {
        const filters = ['favorites', 'history', 'downloaded'];
        filters.forEach(f => {
            const btn = document.getElementById(`btn-filter-${f}`);
            if (btn) {
                // إزالة كل الكلاسات النشطة
                btn.classList.remove('filter-active-favorites', 'filter-active-history', 'filter-active-downloaded');

                // إضافة الكلاس النشط لو ده الفلتر الحالي
                if (this.activeFilter === f) {
                    btn.classList.add(`filter-active-${f}`);
                }
            }
        });
    },

    // --- بيانات البطاقات الأصلية ---
    // === متغير تتبع الهيستوري (20 ثانية) ===
    _historyTracked: false,

    // === تحميل المدد عبر DurationLoader المستقل ===
    preloadDurations() {
        if (!this.currentReciter) return;

        // بدء التحميل عبر الملف المستقل
        DurationLoader.start(this.currentReciter.id, this.currentReciter.server);

        // 🔥 الاستماع لأحداث التحميل الريل تايم
        window.addEventListener('duration-loaded', (e) => {
            const { surahIndex, formatted } = e.detail;
            // تحديث الكارت فوراً بدون إعادة بناء الشبكة
            this._updateCardDuration(surahIndex);
        });
    },

    // --- نظام حفظ المدة الحقيقية ---
    _getDurationCache() {
        try {
            return JSON.parse(localStorage.getItem('quran_duration_cache') || '{}');
        } catch { return {}; }
    },

    cacheDuration(reciterId, surahIndex, durationSeconds) {
        const cache = this._getDurationCache();
        const key = `${reciterId}_${surahIndex}`;
        cache[key] = durationSeconds;
        localStorage.setItem('quran_duration_cache', JSON.stringify(cache));
    },

    getCachedDuration(surahIndex) {
        const cache = this._getDurationCache();
        const reciterId = this.currentReciter ? this.currentReciter.id : '';
        const key = `${reciterId}_${surahIndex}`;
        const seconds = cache[key];
        if (!seconds) return '';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    // تحديث مدة كارت معين مباشرة (بدون إعادة بناء الشبكة كلها)
    _updateCardDuration(surahIndex) {
        const card = document.getElementById(`card-surah-${surahIndex}`);
        if (!card) return;
        const realTime = this.getCachedDuration(surahIndex);
        if (!realTime) return;

        // البحث عن منطقة الوقت في الكارت
        const timeContainer = card.querySelector('.border-t .font-mono');
        if (!timeContainer) return;

        // لو مفيش ساعة موجودة، أضفها
        const existingClock = timeContainer.querySelector('.local-icon');
        if (!existingClock) {
            const clockImg = document.createElement('img');
            clockImg.src = '../assets/icon/svg/clock.svg';
            clockImg.className = 'local-icon w-4 h-4';
            clockImg.style.filter = 'invert(1)';
            // نضيف الساعة بعد زر القلب لو موجود
            const favBtn = timeContainer.querySelector('.card-fav-btn-inline');
            if (favBtn) {
                favBtn.after(clockImg);
                clockImg.after(document.createTextNode(` ${realTime}`));
            } else {
                timeContainer.prepend(document.createTextNode(`${realTime} `));
                timeContainer.prepend(clockImg);
            }
        }
    },

    // --- أسماء السور بالإنجليزي ---
    _surahEnglish: [
        '', 'Al-Fatiha', 'Al-Baqarah', 'Aal-e-Imran', 'An-Nisa', "Al-Ma'idah",
        "Al-An'am", "Al-A'raf", 'Al-Anfal', 'At-Tawbah', 'Yunus',
        'Hud', 'Yusuf', "Ar-Ra'd", 'Ibrahim', 'Al-Hijr',
        'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
        'Al-Anbiya', 'Al-Hajj', "Al-Mu'minun", 'An-Nur', 'Al-Furqan',
        "Ash-Shu'ara", 'An-Naml', 'Al-Qasas', "Al-'Ankabut", 'Ar-Rum',
        'Luqman', 'As-Sajdah', 'Al-Ahzab', "Saba'", 'Fatir',
        'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
        'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah',
        'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
        'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
        "Al-Waqi'ah", 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahina',
        'As-Saff', "Al-Jumu'ah", 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
        'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', "Al-Ma'arij",
        'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddathir', 'Al-Qiyamah',
        'Al-Insan', 'Al-Mursalat', "An-Naba'", "An-Nazi'at", "'Abasa",
        'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
        'At-Tariq', "Al-A'la", 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad',
        'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
        "Al-'Alaq", 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', "Al-'Adiyat",
        "Al-Qari'ah", 'At-Takathur', "Al-'Asr", 'Al-Humazah', 'Al-Fil',
        'Quraysh', "Al-Ma'un", 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
        'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
    ],

    // توليد بيانات كل الـ 114 سورة
    _getAllCards() {
        const cards = [];
        for (let i = 1; i <= 114; i++) {
            let tag = null;
            if (i === 2) tag = 'FEATURED';
            else if (i === 18) tag = 'FRIDAY';

            cards.push({
                index: i,
                name: `سورة ${surahNames[i] || ''}`,
                eng: this._surahEnglish[i] || '',
                tag
            });
        }
        return cards;
    },

    // --- نظام التحميل الكسول ---
    _lazyPageSize: 12, // عدد الكروت في كل دفعة
    _lazyRendered: 0,   // عدد الكروت المعروضة حالياً
    _lazyObserver: null, // المراقب
    _lazyAllCards: null,  // كل الكروت

    // إعادة بناء الشبكة مع تحميل كسول
    _rebuildGrid(filteredSurahs, filterName) {
        const grid = document.getElementById('main-grid');
        if (!grid) return;

        grid.innerHTML = '';
        grid.dir = 'rtl'; // ضمان الاتجاه العربي

        // === عرض بدون فلتر → تحميل كسول لكل الـ 114 ===
        if (!filteredSurahs) {
            this._lazyAllCards = this._getAllCards();
            this._lazyRendered = 0;
            this._destroyLazyObserver();
            this._loadMoreCards(grid);
            this._setupLazyObserver(grid);
            return;
        }

        // === عرض مع فلتر ===

        // لو الفلتر فاضي
        if (filteredSurahs.length === 0) {
            let emptyIcon = '❤️';
            let emptyTitle = 'لا توجد سور مفضلة';
            let emptyDesc = 'اضغط على ❤️ في أي بطاقة لإضافتها هنا';

            if (filterName === 'history') {
                emptyIcon = '🕐';
                emptyTitle = 'لا يوجد سجل استماع';
                emptyDesc = 'ابدأ بالاستماع وسيظهر سجلك هنا';
            } else if (filterName === 'downloaded') {
                emptyIcon = '📥';
                emptyTitle = 'لا توجد سور محمّلة';
                emptyDesc = 'حمّل السور للاستماع بدون إنترنت';
            }

            grid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <div class="text-4xl mb-4">${emptyIcon}</div>
                    <h3 class="text-lg font-kufi text-gray-400 mb-2">${emptyTitle}</h3>
                    <p class="text-sm text-gray-600 max-w-[280px]">${emptyDesc}</p>
                </div>
            `;
            return;
        }

        // عرض الكروت المفلترة (بدون lazy - عددهم قليل)
        filteredSurahs.forEach((surahIndex, i) => {
            const name = surahNames[surahIndex] || '';
            const card = {
                index: surahIndex,
                name: `سورة ${name}`,
                eng: this._surahEnglish[surahIndex] || '',
                tag: null,
            };
            grid.appendChild(this._buildCard(card, filterName, i));
        });

        this.drawStaticVisualizers();
        if (this.currentSurahIndex) this.highlightSurah(this.currentSurahIndex);
    },

    // تحميل دفعة جديدة من البطاقات
    _loadMoreCards(grid) {
        if (!grid) grid = document.getElementById('main-grid');
        if (!grid || !this._lazyAllCards) return;

        const start = this._lazyRendered;
        const end = Math.min(start + this._lazyPageSize, this._lazyAllCards.length);

        if (start >= this._lazyAllCards.length) return; // كل الكروت معروضة

        // إزالة السنتنل السفلي القديم إن وجد
        const oldSentinel = document.getElementById('lazy-sentinel');
        if (oldSentinel) oldSentinel.remove();

        // إضافة الكروت الجديدة
        for (let i = start; i < end; i++) {
            grid.appendChild(this._buildCard(this._lazyAllCards[i], 'normal'));
        }
        this._lazyRendered = end;

        // إضافة سنتنل سفلي جديد لو لسه في كروت لم تعرض
        if (this._lazyRendered < this._lazyAllCards.length) {
            const sentinel = document.createElement('div');
            sentinel.id = 'lazy-sentinel';
            sentinel.className = 'col-span-full h-4';
            grid.appendChild(sentinel);

            // إعادة مراقبة السنتنل الجديد
            if (this._lazyObserver) this._lazyObserver.observe(sentinel);
        }

        this.drawStaticVisualizers();
        if (this.currentSurahIndex) this.highlightSurah(this.currentSurahIndex);
    },

    // تقليم تدريجي للكروت البعيدة عن الشاشة
    _trimDistantCards(grid) {
        if (!grid || !this._lazyAllCards) return;

        const cards = grid.querySelectorAll('.audio-card');
        if (cards.length <= 24) return;

        const scrollContainer = document.querySelector('main');
        if (!scrollContainer) return;

        const viewportBottom = scrollContainer.scrollTop + scrollContainer.clientHeight;
        const trimThreshold = viewportBottom + 800; // 800px بعد الشاشة
        let removed = 0;

        // امسح الكروت من الآخر اللي بعيدة عن الشاشة
        for (let i = cards.length - 1; i >= 24; i--) {
            const card = cards[i];
            if (card.offsetTop > trimThreshold) {
                card.remove();
                removed++;
            } else {
                break;
            }
        }

        if (removed > 0) {
            this._lazyRendered -= removed;
            // تأكد إن السنتنل السفلي موجود عشان يقدر يحمل تاني
            if (!document.getElementById('lazy-sentinel') && this._lazyRendered < this._lazyAllCards.length) {
                const sentinel = document.createElement('div');
                sentinel.id = 'lazy-sentinel';
                sentinel.className = 'col-span-full h-4';
                grid.appendChild(sentinel);
                if (this._lazyObserver) this._lazyObserver.observe(sentinel);
            }
            console.log(`⬆️ تقليم ${removed} كارت. الموجود: ${this._lazyRendered}`);
        }
    },

    // إعداد المراقب للتحميل + مراقب السكرول للتقليم
    _setupLazyObserver(grid) {
        // 1. IntersectionObserver للتحميل الكسول عند النزول
        this._lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target.id === 'lazy-sentinel' && entry.isIntersecting) {
                    this._loadMoreCards(grid);
                }
            });
        }, { rootMargin: '200px' });

        const bottomSentinel = document.getElementById('lazy-sentinel');
        if (bottomSentinel) this._lazyObserver.observe(bottomSentinel);

        // 2. مراقب السكرول للتقليم التدريجي عند الطلوع
        const scrollContainer = document.querySelector('main');
        if (!scrollContainer) return;

        let lastScrollTop = scrollContainer.scrollTop;
        let trimTimer = null;

        this._scrollTrimHandler = () => {
            const currentScrollTop = scrollContainer.scrollTop;
            const scrolledUp = currentScrollTop < lastScrollTop - 50;
            lastScrollTop = currentScrollTop;

            if (!scrolledUp) return;

            clearTimeout(trimTimer);
            trimTimer = setTimeout(() => {
                this._trimDistantCards(grid);
            }, 300);
        };

        scrollContainer.addEventListener('scroll', this._scrollTrimHandler, { passive: true });
    },

    _destroyLazyObserver() {
        if (this._lazyObserver) {
            this._lazyObserver.disconnect();
            this._lazyObserver = null;
        }
        if (this._scrollTrimHandler) {
            const sc = document.querySelector('main');
            if (sc) sc.removeEventListener('scroll', this._scrollTrimHandler);
            this._scrollTrimHandler = null;
        }
    },

    // --- بناء بطاقة واحدة ---
    _buildCard(cardData, mode, positionIndex) {
        const { index, name, eng, tag } = cardData;
        const isFav = this.isFavorite(index);
        const realTime = this.getCachedDuration(index); // المدة الحقيقية

        const card = document.createElement('div');
        card.id = `card-surah-${index}`;
        card.className = 'audio-card group relative bg-quran-surface border border-white/5 rounded-2xl p-4 hover:border-quran-accent/30 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden shadow-lg flex flex-col justify-between h-[155px]';
        card.onclick = () => Engine.playSurah(index);

        // تاج البطاقة (FEATURED / FRIDAY)
        let tagHtml = '';
        if (tag) {
            tagHtml = `<span class="inline-block mt-2 text-[10px] border border-quran-gold/20 text-quran-gold bg-quran-gold/5 px-2 py-0.5 rounded-md font-sans font-bold tracking-wider">${tag}</span>`;
        }

        // الإضافة على البطاقة حسب النوع
        let overlayHtml = '';
        let favBtnHtml = '';

        if (mode === 'normal' || mode === 'favorites') {
            // زر القلب (هيتحط في الصف السفلي)
            favBtnHtml = `
                <button class="card-fav-btn-inline ${isFav ? 'is-favorite' : ''}"
                    data-fav-surah="${index}"
                    onclick="Engine.toggleFavorite(${index}, event)">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </button>
            `;
        } else if (mode === 'history') {
            // بادج "آخر استماع"
            overlayHtml = `
                <div class="card-filter-badge badge-history">
                    <i class="fas fa-history" style="font-size:8px"></i>
                    <span>آخر استماع</span>
                </div>
            `;
        } else if (mode === 'downloaded') {
            // بادج "محمّلة"
            overlayHtml = `
                <div class="card-filter-badge badge-downloaded">
                    <i class="fas fa-check-circle" style="font-size:8px"></i>
                    <span>محمّلة</span>
                </div>
            `;
        }

        // صورة السورة (لو موجودة)
        const imgSrc = `../assets/img/listen/surahs/${index}.webp`;

        card.innerHTML = `
            ${overlayHtml}
            <div class="absolute inset-0 bg-glow-radial opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div class="relative z-10 flex justify-between items-start">
                <div>
                    <h3 class="surah-title text-2xl text-white group-hover:text-quran-accent transition-colors mb-1">
                        ${name}</h3>
                    ${eng ? `<p class="text-xs text-gray-500 font-sans tracking-wide uppercase">${eng}</p>` : ''}
                    ${tagHtml}
                </div>
                <div class="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500 bg-black">
                    <img src="${imgSrc}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy"
                        onerror="this.style.display='none'">
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                        <i class="fas fa-play text-white text-lg"></i>
                    </div>
                </div>
            </div>
            <div class="relative z-10 flex items-end justify-between border-t border-white/5 pt-3">
                <div class="flex items-center gap-2 text-xs text-white/80 font-mono">
                    ${favBtnHtml}
                    ${realTime ? `<img src="../assets/icon/svg/clock.svg" class="local-icon w-4 h-4" style="filter: invert(1);"> ${realTime}` : ''}
                </div>
                <div class="relative w-24 h-8 flex items-end justify-start">
                    <canvas class="visualizer-canvas" width="100" height="40"></canvas>
                </div>
            </div>
        `;

        return card;
    },

    // --- دالة فتح/غلق قائمة المشاعر ---
    toggleMoodMenu(e) {
        if (e) e.stopPropagation(); // منع إغلاق القائمة فور الضغط عليها
        const menu = document.getElementById('mood-menu');

        // Check if this is a touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            // On touch devices, toggle the mobile menu
            menu.classList.toggle('hidden');
            // Add state only when menu becomes visible
            if (!menu.classList.contains('hidden')) {
                MobileNav.pushState('mood-menu');
            }
        } else {
            // On desktop, just ensure the menu is visible
            menu.classList.remove('hidden');
            MobileNav.pushState('mood-menu');
        }
    }
};

// --- 3. Sidebar Logic ---
function toggleGlobalNav() {
    document.getElementById('globalNavToggle').classList.toggle('active');
    document.getElementById('globalNavLinks').classList.toggle('collapsed');
}

function toggleSidebarLogic() {
    const sidebar = document.getElementById('sidebar');
    const player = document.getElementById('global-player'); // مسكنا البلاير
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        // Create or get the overlay element
        let overlay = document.getElementById('sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebar-overlay';
            // الحل: الـ overlay يبدأ من تحت الهيدر (top: 60px) وz-index: 1500
            // بحيث يكون تحت الـ sidebar (1600) وتحت الهيدر (2000)
            overlay.style.cssText = `
                position: fixed;
                top: 60px;
                left: 0;
                width: 100%;
                height: calc(100vh - 60px);
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(3px);
                z-index: 1500;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s ease;
                touch-action: none;
                overscroll-behavior: contain;
            `;

            document.body.appendChild(overlay);

            // Add click handler to close sidebar when clicking on overlay
            overlay.addEventListener('click', function () {
                toggleSidebarLogic();
            });
        }

        const isActive = !sidebar.classList.contains('translate-x-full');
        // 1. حركة القائمة (دخول/خروج)
        sidebar.classList.toggle('translate-x-full');

        // Handle overlay visibility + body/main scroll lock
        const mainEl = document.querySelector('main');
        if (overlay) {
            if (!isActive) {
                // القائمة هتفتح - نظهر الـ overlay ونقفل سكرول الـ body والـ main
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
                document.body.style.overflow = 'hidden';
                document.body.style.touchAction = 'none';
                if (mainEl) mainEl.style.overflow = 'hidden';
            } else {
                // القائمة هتقفل - نخفي الـ overlay ونفتح سكرول الـ body والـ main
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
                if (mainEl) mainEl.style.overflow = '';
            }
        }

        // === إضافة حالة التنقل ===
        if (!sidebar.classList.contains('translate-x-full')) {
            MobileNav.pushState('sidebar');
        }
        // ========================

        // 2. حركة البلاير الذكية (عكس القائمة)
        // لو القائمة فتحت (شيلنا كلاس الإخفاء)، نزل البلاير لتحت
        if (!sidebar.classList.contains('translate-x-full')) {
            player.classList.add('translate-y-[120%]'); // إخفاء للأسفل
        } else {
            player.classList.remove('translate-y-[120%]'); // إظهار للأعلى
        }
    } else {
        // منطق الكمبيوتر (كما هو)
        document.body.classList.toggle('mini-sidebar');
        if (document.body.classList.contains('mini-sidebar')) {
            player.classList.remove('lg:right-[280px]');
            player.classList.add('lg:right-[90px]');
        } else {
            player.classList.add('lg:right-[280px]');
            player.classList.remove('lg:right-[90px]');
        }
    }
}

function filterSurahs(query) {
    const items = document.querySelectorAll('.surah-item');
    items.forEach(item => {
        const text = item.innerText;
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// --- 4. Morphing Sticky Bar Logic ---
document.addEventListener('DOMContentLoaded', () => {
    Engine.init();

    const sentinel = document.getElementById('filter-sentinel');
    const stickyBar = document.getElementById('sticky-filter-bar');
    if (sentinel && stickyBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    stickyBar.classList.add('is-pinned');
                } else {
                    stickyBar.classList.remove('is-pinned');
                }
            });
        }, { threshold: 0, rootMargin: "-60px 0px 0px 0px" });
        observer.observe(sentinel);
    }
});

// إغلاق القائمة عند الضغط خارجها
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mood-menu');
    const moodButton = e.target.closest('button[onclick*="toggleMoodMenu"]');

    // Check if the click is outside the menu and the mood button
    if (!menu.contains(e.target) && !moodButton) {
        menu.classList.add('hidden');
    }
});

// نظام القائمة المحسن للجهاز المكتبي
const moodButton = document.querySelector('button[onclick*="toggleMoodMenu"]');
const moodMenu = document.getElementById('mood-menu');

if (moodButton && moodMenu) {
    let openTimeout, closeTimeout;

    // فتح القائمة
    moodButton.addEventListener('mouseenter', (e) => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            clearTimeout(closeTimeout);
            openTimeout = setTimeout(() => {
                moodMenu.classList.remove('hidden');
            }, 100); // تأخير بسيط لتفادي الفتح العشوائي
        }
    });

    // إغلاق القائمة (بشرط)
    moodButton.addEventListener('mouseleave', (e) => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            // التحقق إذا كان الماوس مش داخل القائمة
            setTimeout(() => {
                const isMouseOverMenu = moodMenu.matches(':hover');
                if (!isMouseOverMenu) {
                    moodMenu.classList.add('hidden');
                }
            }, 50); // تأخير صغير عشان نتأكد من مكان الماوس
        }
    });

    // منع الإغلاق لما المستخدم داخل القائمة
    moodMenu.addEventListener('mouseenter', (e) => {
        clearTimeout(closeTimeout);
    });

    // إغلاق القائمة لما المستخدم يطلع منها
    moodMenu.addEventListener('mouseleave', (e) => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            closeTimeout = setTimeout(() => {
                moodMenu.classList.add('hidden');
            }, 1500); // ثانية ونص بدل 300ms
        }
    });
}

// Global download completion handler
window.onDownloadComplete = function (fileName) {
    console.log("Download Done: " + fileName);

    // استخدام window.Engine للتأكد من الوصول للمحرك
    if (typeof window.Engine !== 'undefined') {
        const eng = window.Engine; // اختصار

        // لو كنا بنحمل المصحف كله
        if (eng.isBulkDownloading) {
            // شيل السورة اللي خلصت دي من الطابور
            eng.bulkQueue.shift();

            // تحديث العداد
            const remaining = eng.totalBulkCount - eng.bulkQueue.length;
            const countSpan = document.getElementById('bulk-count');
            if (countSpan) countSpan.innerText = `${remaining}/${eng.totalBulkCount}`;

            // شغل اللي بعدها
            setTimeout(() => eng.processBulkQueue(), 100);
        }
        // لو تحميل فردي عادي
        else {
            // ... (الكود القديم للتحميل الفردي) ...
            if (eng.currentSurahIndex) {
                const currentSurahID = String(eng.currentSurahIndex).padStart(3, '0') + ".mp3";
                if (fileName === currentSurahID) {
                    eng.updateDownloadUI(true);
                }
            }
        }
    }

    // --- تعديل كابتن يوسف: استخدام window.UI لتجنب ReferenceError ---
    if (typeof window.UI !== 'undefined' && window.UI.showToast) {
        // نظهر التوست فقط لو مش تحميل جماعي (عشان الإزعاج)
        if (window.Engine && !window.Engine.isBulkDownloading) {
            window.UI.showToast("تم التحميل بنجاح ✅");
        }
    }
};

// Make Engine and UI globally accessible for HTML onclick handlers
window.Engine = Engine;
window.UI = UI;

// =============================================================
// 🔥 دالة استقبال التقدم من الأندرويد (لنعومة الدائرة + الشريط) 🔥
// =============================================================
window.updateDownloadProgress = function (filePercent, downloadedBytes, totalBytes) {

    // تأكد أن المحرك في وضع التحميل الجماعي
    if (typeof Engine !== 'undefined' && Engine.isBulkDownloading && Engine.bulkQueue.length > 0) {

        // 1. حساب عدد الملفات التي انتهت كلياً (مثلاً 5 ملفات)
        // (114 ناقص اللي لسه في الطابور)
        // لاحظ: الطابور لسه فيه الملف الحالي، عشان كدة بنطرح 1 مؤقتاً للحساب الدقيق
        const pendingFiles = Engine.bulkQueue.length;
        const filesFullyDone = 114 - pendingFiles;

        // 2. نسبة الملف الحالي (مثلاً 50% يعني 0.5 ملف)
        const currentFileFraction = filePercent / 100;

        // 3. النسبة الكلية الدقيقة للمصحف
        // المعادلة: (السور الخلصانة + كسر السورة الحالية) / 114
        const totalProgressExact = ((filesFullyDone + currentFileFraction) / 114) * 100;

        // 4. اسم السورة الحالية
        const currentSurahIndex = Engine.bulkQueue[0];
        const surahName = surahNames[currentSurahIndex];

        // 5. 🔥 تحديث الدائرة العائمة (Widget) فوراً 🔥
        // هذا السطر هو الذي سيجعل الدائرة تمتلئ
        Engine.updateFloatingWidget(totalProgressExact, `سورة ${surahName}`);

        // 6. تحديث الشريط السفلي أيضاً ليكون ناعماً
        const progressBar = document.getElementById('bulk-progress-bar');
        const countSpan = document.getElementById('bulk-count');

        if (progressBar) {
            progressBar.style.width = `${totalProgressExact}%`;
        }
        if (countSpan) {
            // يظهر مثلاً: 5/114 (50%)
            countSpan.innerText = `${filesFullyDone}/114`;
        }
    }
};