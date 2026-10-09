// === 1. 語言變數與切換邏輯 ===
let currentLang = localStorage.getItem('lavendr_lang') || 'zh';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key]; 
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const text = lang === 'zh' ? '電郵地址' : 'Email Address';
        el.setAttribute('placeholder', text);
    });
    
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.textContent = lang === 'zh' ? 'EN / 中文' : '中 / English';
    }
    localStorage.setItem('lavendr_lang', lang);
}

// === 2. 網頁互動主邏輯 ===
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page-section');
    const navItems = document.querySelectorAll('.nav-item');

    function navigateTo(hash) {
        if (!hash) hash = '#home';
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        const targetPage = document.querySelector(hash);
        const targetNav = document.querySelector(`.nav-item[href="${hash}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
        
        const listView = document.getElementById('shop-list-view');
        const detailView = document.getElementById('product-detail-view');
        if (hash === '#shop' && listView && detailView) {
            listView.style.display = 'block';
            detailView.style.display = 'none';
        }
        window.scrollTo(0, 0);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetHash = e.target.getAttribute('href');
            history.pushState(null, null, targetHash);
            navigateTo(targetHash);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-item')) {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHash = anchor.getAttribute('href');
                history.pushState(null, null, targetHash);
                navigateTo(targetHash);
            });
        }
    });

    window.addEventListener('popstate', () => navigateTo(window.location.hash));
    navigateTo(window.location.hash);

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            updateLanguage(currentLang);
        });
    }
    updateLanguage(currentLang);

    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const alertMsg = currentLang === 'zh' ? '已成功加入購物車！(目前為測試模式)' : 'Added to cart successfully! (Test mode)';
            alert(alertMsg);
        });
    });

    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 初始化調香問卷
    initQuiz();
});

// === 3. 商品切換邏輯 ===
const productData = {
    'p1': { moodImg: 'assets/mood-1.jpg', productImg: 'assets/product-1.jpg', noticeKey: 'notice_gift' },
    'p2': { moodImg: 'assets/mood-2.jpg', productImg: 'assets/product-2.jpg', noticeKey: 'notice_gift' },
    'p3': { moodImg: 'assets/mood-3.jpg', productImg: 'assets/product-3.jpg', noticeKey: 'notice_gift' },
    'p4': { productImg: 'assets/product-4.png', noticeKey: 'notice_sticks' }, 
    'p5': { productImg: 'assets/product-5.jpg', noticeKey: 'notice_refill' },
    'p6': { productImg: 'assets/product-6.jpg', noticeKey: 'notice_refill' },
    'p7': { productImg: 'assets/product-7.jpg', noticeKey: 'notice_refill' }
};

function openProduct(productId) {
    const data = productData[productId];
    if (!data) return;

    document.getElementById('detail-title').setAttribute('data-i18n', productId + '_title');
    document.getElementById('detail-desc').setAttribute('data-i18n', productId + '_desc');
    document.getElementById('detail-notice').setAttribute('data-i18n', data.noticeKey);
    updateLanguage(currentLang);

    const moodImg = document.getElementById('detail-mood-img');
    if (data.moodImg && moodImg) {
        moodImg.src = data.moodImg;
        moodImg.style.display = 'block'; 
    } else if (moodImg) {
        moodImg.style.display = 'none'; 
    }
    
    document.getElementById('detail-product-img').src = data.productImg;
    document.getElementById('shop-list-view').style.display = 'none';
    document.getElementById('product-detail-view').style.display = 'block';
    window.scrollTo(0, 0); 
}

function closeProduct() {
    document.getElementById('product-detail-view').style.display = 'none';
    document.getElementById('shop-list-view').style.display = 'block';
    window.scrollTo(0, 0);
}


/* =======================================================
   ★ 4. Lavend/r 調香系統大腦：完整版題目、分支與故事資料庫
   ======================================================= */
const scentQuizData = {
    baseQuestions: [
        {
            id: 'Q1', question: '推開 Lavend/r 的門，你希望今天帶走的這瓶香水，是為了誰而調製？',
            options: [
                { label: '「給現在的我」', value: 'A' }, { label: '「給理想中的我」', value: 'B' },
                { label: '「給特別的你」', value: 'C' }, { label: '「給某個瞬間」', value: 'D' }
            ]
        },
        {
            id: 'Q2', question: '當這股氣味與肌膚融合時，你希望它散發的是什麼樣感受？',
            options: [
                { label: '安靜而保有邊界：不過度熱情，帶點清冷與疏離感...', value: 'A', archetype: 'intellectual_woods' },
                { label: '充滿張力與生命力：打破沉悶，帶有反差感...', value: 'B', archetype: 'vibrant_awakening' },
                { label: '溫潤而包容：沒有攻擊性，像一個安全的避風港...', value: 'C', archetype: 'second_skin' },
                { label: '深邃且難以捉摸：充滿未說出口的潛台詞...', value: 'D', archetype: 'velvet_paradox' }
            ]
        },
        {
            id: 'Q3', question: '如果這瓶香水是一本小說，你認為哪一句話最適合印在扉頁呢?',
            options: [
                { label: '「在極致的克制與秩序中，往往藏著最深沉的熱愛。」', value: 'A', archetype: 'intellectual_woods' },
                { label: '「平靜的水面下，是旁人看不見的暗湧。」', value: 'B', archetype: 'velvet_paradox' },
                { label: '「那些沒有說出口的，都在空氣裡了。」', value: 'C', archetype: 'grounded_earth' },
                { label: '「故事從最精彩的半途開始，沒有起點，也沒有終點。」', value: 'D', archetype: 'vibrant_awakening' }
            ]
        },
        {
            id: 'Q4', question: '閉上眼睛想像，這段故事的「底色與質地」摸起來是什麼感覺？',
            options: [
                { label: '冰涼的拋光石材，或是雨後乾淨微冷的空氣。', value: 'A', archetype: 'mineral_horizon' },
                { label: '陽光曬過的棉麻布料，帶著體溫的柔軟。', value: 'B', archetype: 'second_skin' },
                { label: '帶有顆粒感的粗糙羊皮紙，或是乾燥的木柴。', value: 'C', archetype: 'intellectual_woods' },
                { label: '揉碎的綠色枝葉，與剛拂過果園的微風。', value: 'D', archetype: 'grounded_earth' }
            ]
        },
        {
            id: 'Q5', question: '這瓶香水中，你最「不可或缺」的核心靈魂是什麼？',
            options: [
                { label: '茶香與木質的沉穩（伯爵茶、檀香、雪松）', value: 'A', archetype: 'intellectual_woods' },
                { label: '花朵與果實的靈動（玫瑰、鈴蘭、無花果、柑橘）', value: 'B', archetype: 'vibrant_awakening' },
                { label: '辛香與皮革的微醺（粉紅胡椒、莎草、麂皮）', value: 'C', archetype: 'velvet_paradox' },
                { label: '乾淨皂香與草本的純粹（薰衣草、薄荷、白麝香）', value: 'D', archetype: 'second_skin' }
            ]
        },
        {
            id: 'Q6', question: '最後，有什麼氣味元素是你希望「絕對不要出現」的？(可多選)', multiple: true,
            options: [
                { label: '過於甜膩的糖果/香草味', value: 'A' }, 
                { label: '濃烈的白花香（如茉莉、晚香玉）', value: 'B' },
                { label: '帶有侵略性的辛香料味', value: 'C' }, 
                { label: '潮濕的泥土或苔蘚味', value: 'D' },
                { label: '毫無禁忌，請給我驚喜', value: 'E', exclusive: true } 
            ]
        }
    ],
    branches: {
        'A': [ 
            {
                id: 'A1', question: '哪一個瞬間最能讓你感到絕對的「愜意」與放鬆？',
                options: [
                    { label: '午後的一場大雨後，空氣充滿濕度，青草與土壤的氣味。', archetype: 'grounded_earth' },
                    { label: '早晨陽光透過亞麻窗簾，灑在剛洗淨的純白床單上。', archetype: 'second_skin' },
                    { label: '夜晚點起暖黃閱讀燈，窩在沙發裡翻閱舊書，喝著茶。', archetype: 'intellectual_woods' },
                    { label: '漫步在清晨薄霧的海灘，迎面吹來帶有鹽分的微風。', archetype: 'mineral_horizon' }
                ]
            },
            {
                id: 'A2', question: '當置身於人群中時，別人在第一時間感受到的你，最接近哪一種輪廓？',
                options: [
                    { label: '「打磨光滑的冷調大理石」', archetype: 'mineral_horizon' },
                    { label: '「透著微光的亞麻織物」', archetype: 'second_skin' },
                    { label: '「帶有解構剪裁的深色層次」', archetype: 'velvet_paradox' },
                    { label: '「折射著光線的流動稜鏡」', archetype: 'vibrant_awakening' }
                ]
            },
            {
                id: 'A3', question: '如果這瓶香水化作一句低語，那會是下列哪一句？',
                options: [
                    { label: '「世界再喧囂，我也能成為自己的避難所。」', archetype: 'intellectual_woods' },
                    { label: '「你不必總是那麼堅強，允許自己被溫柔地接住吧。」', archetype: 'second_skin' },
                    { label: '「無論好壞，所有的經歷都是為了迎來下一次的破曉。」', archetype: 'vibrant_awakening' },
                    { label: '「就讓心裡保留一片下雨的空間，陰影裡也有它的美意。」', archetype: 'grounded_earth' }
                ]
            }
        ],
        'B': [
            {
                id: 'B1', question: '當你步入一個陌生的空間，你希望空氣中率先為你傳遞出什麼樣的隱形訊息？',
                options: [
                    { label: '我沒有攻擊性，你可以安心降落。', archetype: 'second_skin' },
                    { label: '我清楚自己的方向，且擁有不容侵犯的界線。', archetype: 'intellectual_woods' },
                    { label: '我是一個謎團，等待懂得的人來翻閱。', archetype: 'velvet_paradox' },
                    { label: '這世界很好玩，而我無所畏懼。', archetype: 'vibrant_awakening' }
                ]
            },
            {
                id: 'B2', question: '為了成為理想的自己，你最想褪去、或者正在克服的舊習慣是什麼？',
                options: [
                    { label: '總是習慣先迎合他人，卻忘了為自己設立底線。', archetype: 'velvet_paradox' },
                    { label: '容易在眾多選項中反覆猶豫，渴望擁有更果決的行動力。', archetype: 'vibrant_awakening' },
                    { label: '害怕展露真實情緒與脆弱，習慣把心藏得很深。', archetype: 'second_skin' },
                    { label: '對『完美』的執念太深，不允許自己有任何失誤。', archetype: 'intellectual_woods' }
                ]
            },
            {
                id: 'B3', question: '未來是一張尚未完全攤開的地圖。迎接即將來臨的下一個篇章，哪句話最能帶給你力量？',
                options: [
                    { label: '「如果沒有路，就自己劈開一條；由我來改寫劇本。」', archetype: 'vibrant_awakening' },
                    { label: '「任憑時間在此緩步，沉澱出無可撼動的安定。」', archetype: 'mineral_horizon' },
                    { label: '「丟掉所有多餘的行囊，越是純粹透明，越能裝下無限可能。」', archetype: 'second_skin' },
                    { label: '「無論日月更迭，依然選擇用溫柔去愛、去相信。」', archetype: 'grounded_earth' }
                ]
            }
        ], 
        'C': [
            {
                id: 'C1', question: '當他在人群中出現，或當你閉上眼想起他時，哪種描述最符合他帶給你的樣貌呢？',
                options: [
                    { label: '早晨帶著涼意的霧氣，安靜、清冷，不輕易隨波逐流。', archetype: 'mineral_horizon' },
                    { label: '午後穿透亞麻窗簾的光，溫和、柔軟，讓人忍不住想靠近。', archetype: 'second_skin' },
                    { label: '像燃燒著木柴的微火，沉穩、可靠，有一種深邃的安定感。', archetype: 'intellectual_woods' },
                    { label: '像傍晚變幻莫測的天色，充滿生命力、靈動且難以捉摸。', archetype: 'velvet_paradox' }
                ]
            },
            {
                id: 'C2', question: '在你眼中，他藏在表象之下，最真實（或只有你懂）的特質是什麼？',
                options: [
                    { label: '看似堅強獨立，其實內心極度柔軟，渴望被溫柔接住。', archetype: 'second_skin' },
                    { label: '看似隨和好相處，其實內心有著極高的標準與不妥協的底線。', archetype: 'intellectual_woods' },
                    { label: '看似理智冷靜，但靈魂深處藏著對自由與冒險的浪漫渴望。', archetype: 'vibrant_awakening' },
                    { label: '看似充滿防備、像隻刺蝟，但其實對世界有著最細膩的共情。', archetype: 'velvet_paradox' }
                ]
            },
            {
                id: 'C3', question: '如果用一種「空間狀態」來形容你們之間的相處，那會是哪一種畫面？',
                options: [
                    { label: '「兩張並排的單人沙發」—— 不需要一直說話也覺得安心。', archetype: 'second_skin' },
                    { label: '「深夜裡的微光吧台」—— 總是能交換最深層的哲學與思辨。', archetype: 'velvet_paradox' },
                    { label: '「沒有邊界的曠野」—— 可以卸下所有包袱，是最純粹的自己。', archetype: 'mineral_horizon' }
                ]
            },
            {
                id: 'C4', question: '這瓶香水交到他手上的那一刻，你最希望氣味替你傳達哪一句話？',
                options: [
                    { label: '「世界很吵，但願你能一直保有你靈魂裡的安靜與清澈。」', archetype: 'intellectual_woods' },
                    { label: '「我知道你的刺是為了保護自己，但在我面前，你可以不用那麼堅強。」', archetype: 'second_skin' },
                    { label: '「這是不被任何人定義的你，也是我最欣賞的你。」', archetype: 'vibrant_awakening' },
                    { label: '「我們的故事還在繼續，這只是其中一個美好的分號。」', archetype: 'grounded_earth' }
                ]
            }
        ], 
        'D': [
            {
                id: 'D1', question: '如果這段記憶是一張照片，它罩著什麼樣的光線與濾鏡？',
                options: [
                    { label: '帶著灰藍調的清晨，空氣微冷，一切尚未甦醒。', archetype: 'mineral_horizon' },
                    { label: '飽滿的暖橘色夕陽，有一種熱烈卻即將消逝的悵然。', archetype: 'velvet_paradox' },
                    { label: '昏暗空間裡的一束微光，聚焦在某個安靜的物件上。', archetype: 'intellectual_woods' },
                    { label: '低飽和的灰綠色調，萬物被雨水洗刷過，帶著濕潤的重量。', archetype: 'grounded_earth' }
                ]
            },
            {
                id: 'D2', question: '當畫面逐漸淡出，這段記憶留在你腦海中的背景音是什麼？',
                options: [
                    { label: '筆尖劃過紙張的沙沙聲，或書頁翻動的微小聲響。', archetype: 'intellectual_woods' },
                    { label: '窗外樹葉被風吹動的摩挲聲，帶著某種遼闊與釋然。', archetype: 'grounded_earth' },
                    { label: '某個人低聲的呢喃，或是兩人之間連心跳都能聽見的寂靜。', archetype: 'second_skin' },
                    { label: '隔著厚重玻璃，城市遠方極其微弱的車流低頻嗡鳴。', archetype: 'mineral_horizon' }
                ]
            },
            {
                id: 'D3', question: '若以文學的視角來看，這個瞬間屬於故事的哪一個篇章？',
                options: [
                    { label: '沒有前因後果，直接從最深刻的那一秒切入。', archetype: 'vibrant_awakening' },
                    { label: '那是所有喧囂落下後，留下的最後一句未完的對白。', archetype: 'velvet_paradox' },
                    { label: '其實什麼都沒發生，但心裡知道，一切都不一樣了。', archetype: 'second_skin' }
                ]
            }
        ] 
    }
};

const fragranceProfiles = {
    'intellectual_woods': {
        name: '《冷調木質與茶 (The Intellectual Woods)》', quote: '「在極致的克制與秩序中，往往藏著最深沉的熱愛。」',
        storyTemplate: ['推開極簡純白的空間，大理石桌面乾淨無瑕，只放著一杯散發著裊裊熱氣的伯爵茶。','這是屬於理智者的氣息，外表看似高冷、保持著優雅的界線感，內心卻對世界有著最細膩而通透的解讀。','它的香氣俐落而有支撐力，是一件能在喧囂中維持自我秩序的隱形戰袍。']
    },
    'second_skin': {
        name: '《純淨皂香與柔白麝香 (The Second Skin)》', quote: '「你不必總是那麼堅強，允許自己被溫柔地接住吧。」',
        storyTemplate: ['早晨的陽光透過亞麻窗簾，輕輕灑落在剛洗淨的純白床單上。','這是不具任何攻擊性的溫柔，宛如第二層肌膚般的陪伴。','它不急於彰顯個性，而是在你疲憊時，用微溫的膚觸感卸下你所有的防備，給你一個最安穩、沒有評價的擁抱。']
    },
    'mineral_horizon': {
        name: '《海洋礦物與晨露 (The Mineral Horizon)》', quote: '「任憑時間在此緩步，沉澱出無可撼動的安定。」',
        storyTemplate: ['獨自漫步在清晨還帶著薄霧的灰藍色海灘，迎面而來的是帶有鹽分與冷空氣的微風。','獻給渴望抽離、嚮往絕對自由的靈魂。','這股帶有透明感與空間感的氣息，宛如將一切繁冗斷捨離，只留下最純粹的自己，是通往內在平靜的鑰匙。']
    },
    'grounded_earth': {
        name: '《大地草本與綠意 (The Grounded Earth)》', quote: '「就讓心裡保留一片下雨的空間，陰影裡也有它的美意。」',
        storyTemplate: ['午後的一場大雨，洗刷了森林裡的泥土與青草，空氣中帶著微濕潤的重量。','這是一款向下扎根的氣味，充滿生命經歷過風雨後的韌性。','適合那些內心豐富、懂得欣賞事物殘缺美感，並習慣在安靜與復古的氛圍中積蓄力量的敘事者。']
    },
    'velvet_paradox': {
        name: '《辛香微醺與皮革 (The Velvet Paradox)》', quote: '「平靜的水面下，是旁人看不見的暗湧。」',
        storyTemplate: ['深夜裡點著微光的吧台，或是翻閱到一半、散發著墨水味的陳年舊書。','帶有微微的辛辣與煙燻感，像是為了保護柔軟內心而長出的優雅刺。','氣味深邃且充滿未說出口的潛台詞，反差極大，需要時間一層層剝開，極具魅惑與知性的餘韻。']
    },
    'vibrant_awakening': {
        name: '《明亮柑橘與花果 (The Vibrant Awakening)》', quote: '「故事從最精彩的半途開始，沒有起點，也沒有終點。」',
        storyTemplate: ['折射著光線的流動稜鏡，將沉悶的空氣瞬間劃破。','跳躍的多汁果香與靈動的花朵，瓦解了過度的緊繃與猶豫不決。','這是破繭而出的生命力，帶有微氣泡般的明亮感，宣告著對未知的熱愛與無所畏懼，隨時準備好迎向下一場冒險。']
    }
};

// --- 問卷引擎 ---
let currentPhase = 'base'; 
let currentQIndex = 0;
let scores = {};
let chosenBranch = 'A';
let selectedMultiple = [];
let selectedNotes = []; // 新增：用來收集使用者點擊的專屬香材

function initQuiz() {
    currentPhase = 'base';
    currentQIndex = 0;
    scores = {};
    chosenBranch = 'A';
    selectedMultiple = [];
    selectedNotes = []; // 每次測驗重置香材收集器
    
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    renderQuestion();
}

function renderQuestion() {
    let q = null;
    
    // 判斷目前進度：先跑 Base 1~6 題，再跑對應分支的 3 題
    if (currentPhase === 'base') {
        if (currentQIndex < scentQuizData.baseQuestions.length) {
            q = scentQuizData.baseQuestions[currentQIndex];
        } else {
            currentPhase = 'branch';
            currentQIndex = 0;
            renderQuestion();
            return;
        }
    } else if (currentPhase === 'branch') {
        const branchQs = scentQuizData.branches[chosenBranch];
        if (currentQIndex < branchQs.length) {
            q = branchQs[currentQIndex];
        } else {
            showResult();
            return;
        }
    }

    document.getElementById('questionText').textContent = q.question;
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    // Q6 多選題的特殊處理
    if (q.multiple) {
        selectedMultiple = [];
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn multiple-opt';
            btn.textContent = opt.label;
            btn.dataset.val = opt.value;
            btn.dataset.exclusive = opt.exclusive ? "true" : "false";

            btn.onclick = function() {
                // 如果選了互斥選項 (例如: 毫無禁忌)，清空其他
                if (opt.exclusive) {
                    document.querySelectorAll('.multiple-opt').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedMultiple = [opt.value];
                } else {
                    // 如果選了一般選項，自動取消互斥選項
                    const exclusiveBtn = document.querySelector('.multiple-opt[data-exclusive="true"]');
                    if (exclusiveBtn) exclusiveBtn.classList.remove('selected');
                    
                    this.classList.toggle('selected');
                    
                    if (this.classList.contains('selected')) {
                        selectedMultiple.push(opt.value);
                        // 過濾掉互斥選項
                        selectedMultiple = selectedMultiple.filter(v => {
                            const optObj = q.options.find(o => o.value === v);
                            return optObj && !optObj.exclusive;
                        });
                    } else {
                        selectedMultiple = selectedMultiple.filter(v => v !== opt.value);
                    }
                }
            };
            optionsContainer.appendChild(btn);
        });

        // 多選題需要「下一步」按鈕
        const nextBtn = document.createElement('button');
        nextBtn.className = 'action-btn';
        nextBtn.style.marginTop = '2rem';
        nextBtn.textContent = currentLang === 'zh' ? '確認送出' : 'Confirm';
        nextBtn.onclick = () => {
            if (selectedMultiple.length === 0) {
                alert(currentLang === 'zh' ? '請至少選擇一個選項' : 'Please select at least one option');
                return;
            }
            currentQIndex++;
            renderQuestion();
        };
        optionsContainer.appendChild(nextBtn);

    } else {
        // 一般單選題
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.label;
            btn.onclick = () => {
                // 記錄分支路線
                if (q.id === 'Q1') chosenBranch = opt.value;
                // 計分
                if (opt.archetype) scores[opt.archetype] = (scores[opt.archetype] || 0) + 1;
                
                // --- 新增：收集該選項專屬的香材 (拆解並存入陣列) ---
                if (opt.note) {
                    opt.note.split('、').forEach(n => selectedNotes.push(n));
                }
                
                currentQIndex++;
                renderQuestion();
            };
            optionsContainer.appendChild(btn);
        });
    }
}

function showResult() {
    document.getElementById('quizContainer').style.display = 'none';
    
    // 1. 計算最高分的原型
    let highestScore = 0;
    let finalArchetype = 'second_skin'; 
    for (const [arch, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            finalArchetype = arch;
        }
    }
    
    // 2. 顯示故事文案
    const result = fragranceProfiles[finalArchetype];
    document.getElementById('resultName').textContent = result.name;
    document.getElementById('resultQuote').textContent = result.quote;
    document.getElementById('resultStory').innerHTML = result.storyTemplate.join('<br><br>');
    
    // 3. --- 新增：處理並顯示專屬香氣結構 ---
    // 利用 Set 過濾掉重複出現的香材，並用高質感的 ✦ 符號串接
    const uniqueNotes = [...new Set(selectedNotes)];
    const notesDisplay = uniqueNotes.length > 0 ? uniqueNotes.join(' ✦ ') : '純粹特調';
    
    document.getElementById('resultNotes').innerHTML = `
        <div style="font-size: 1.15rem; color: #8a7a8f; font-weight: 600; margin-bottom: 2rem; letter-spacing: 1.5px; line-height: 1.8;">
            ${notesDisplay}
        </div>
    `;
    
    // 4. 切換畫面並滑動
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('quizResult').scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    initQuiz();
}
