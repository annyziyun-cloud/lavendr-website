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

    // 如果問卷正在進行中或顯示結果，即時更新問卷語言
    if (document.getElementById('quizContainer') && document.getElementById('quizContainer').style.display === 'block') {
        renderQuestion();
    } else if (document.getElementById('quizResult') && document.getElementById('quizResult').style.display === 'block') {
        showResult();
    }
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

    // 監聽 Logo 點擊回首頁
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState(null, null, '#home');
            navigateTo('#home');
        });
    }

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
            const alertMsg = currentLang === 'zh' ? '已成功加入購物車！' : 'Added to cart successfully!';
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
   ★ 4. Lavend/r 調香系統大腦 (全雙語版 + 香材收集)
   ======================================================= */
const scentQuizData = {
    baseQuestions: [
        {
            id: 'Q1', 
            question: { zh: '你希望今天帶走的這瓶香氛，是為了誰而調製？', en: 'Opening the door to Lavend/r, who is this fragrance for?' },
            options: [
                { label: { zh: '「給現在的我」', en: '"For my present self"' }, value: 'A' }, 
                { label: { zh: '「給理想中的我」', en: '"For my ideal self"' }, value: 'B' },
                { label: { zh: '「給特別的你」', en: '"For someone special"' }, value: 'C' }, 
                { label: { zh: '「給某個瞬間」', en: '"For a specific moment"' }, value: 'D' }
            ]
        },
        {
            id: 'Q2', 
            question: { zh: '當這股氣味與空間融合時，你希望它散發的是什麼樣的感受？', en: 'When this scent blends with the space, what feeling do you want it to evoke?' },
            options: [
                { label: { zh: '安靜而保有邊界：不過度熱情，帶點清冷與疏離感', en: 'Quiet with boundaries: Not overly enthusiastic, a bit cool and detached' }, archetype: 'intellectual_woods' },
                { label: { zh: '充滿張力與生命力：打破沉悶，帶有反差感', en: 'Full of vitality: Breaking the dullness, with a sense of contrast' }, archetype: 'vibrant_awakening' },
                { label: { zh: '溫潤而包容：沒有攻擊性，像一個安全的避風港', en: 'Warm and inclusive: Non-aggressive, like a safe haven' }, archetype: 'second_skin' },
                { label: { zh: '深邃且難以捉摸：充滿未說出口的潛台詞', en: 'Profound and elusive: Full of unspoken subtext' }, archetype: 'velvet_paradox' }
            ]
        },
        {
            id: 'Q3', 
            question: { zh: '如果這瓶香氛是一本小說，你認為哪一句話最適合印在扉頁？', en: 'If this fragrance were a novel, which quote would best suit the title page?' },
            options: [
                { label: { zh: '「在極致的克制與秩序中，往往藏著最深沉的熱愛。」', en: '"In ultimate restraint and order hides the deepest passion."' }, archetype: 'intellectual_woods' },
                { label: { zh: '「平靜的水面下，是旁人看不見的暗湧。」', en: '"Beneath the calm surface lies an undercurrent unseen by others."' }, archetype: 'velvet_paradox' },
                { label: { zh: '「就讓心裡保留一片下雨的空間，陰影裡也有它的美意。」', en: '"Leave a space for rain in your heart; shadows have their own beauty."' }, archetype: 'grounded_earth' },
                { label: { zh: '「故事從最精彩的半途開始，沒有起點，也沒有終點。」', en: '"The story begins brilliantly in the middle, with no start and no end."' }, archetype: 'vibrant_awakening' }
            ]
        },
        {
            id: 'Q4', 
            question: { zh: '閉上眼睛想像，這段故事的「底色與質地」摸起來是什麼感覺？', en: 'Close your eyes and imagine: what does the "base color and texture" of this story feel like?' },
            options: [
                { label: { zh: '冰涼的拋光石材，或是雨後乾淨微冷的空氣。', en: 'Cold polished stone, or the clean, crisp air after the rain.' }, archetype: 'mineral_horizon' },
                { label: { zh: '陽光曬過的棉麻布料，帶著體溫的柔軟。', en: 'Sun-dried linen, soft with the warmth of body temperature.' }, archetype: 'second_skin' },
                { label: { zh: '帶有顆粒感的粗糙羊皮紙，或是乾燥的木柴。', en: 'Textured rough parchment, or dry firewood.' }, archetype: 'intellectual_woods' },
                { label: { zh: '揉碎的綠色枝葉，與剛拂過果園的微風。', en: 'Crushed green leaves and a breeze sweeping through an orchard.' }, archetype: 'grounded_earth' }
            ]
        },
        {
            id: 'Q5', 
            question: { zh: '這瓶香氛中，你最「不可或缺」的核心靈魂是什麼？', en: 'What is the "indispensable" core soul of this fragrance?' },
            options: [
                { label: { zh: '茶香與木質的沉穩（伯爵茶、檀香、雪松）', en: 'The composure of tea and woods (Earl Grey, Sandalwood, Cedar)' }, archetype: 'intellectual_woods', notes: { zh: ['伯爵茶', '檀香', '雪松'], en: ['Earl Grey', 'Sandalwood', 'Cedarwood'] } },
                { label: { zh: '花朵與果實的靈動（玫瑰、鈴蘭、無花果）', en: 'The agility of florals and fruits (Rose, Lily of the Valley, Fig)' }, archetype: 'vibrant_awakening', notes: { zh: ['千葉玫瑰', '水蜜桃', '無花果'], en: ['Centifolia Rose', 'Peach', 'Fig'] } },
                { label: { zh: '辛香與皮革的微醺（粉紅胡椒、莎草、麂皮）', en: 'The slight intoxication of spices and leather (Pink Pepper, Cypriol, Suede)' }, archetype: 'velvet_paradox', notes: { zh: ['粉紅胡椒', '莎草', '麂皮'], en: ['Pink Pepper', 'Cypriol', 'Suede'] } },
                { label: { zh: '乾淨皂香與草本的純粹（薰衣草、白麝香）', en: 'The purity of clean soap and herbs (Lavender, White Musk)' }, archetype: 'second_skin', notes: { zh: ['薰衣草', '白麝香', '純淨皂香'], en: ['Lavender', 'White Musk', 'Clean Soap'] } }
            ]
        },
        {
            id: 'Q6', 
            question: { zh: '最後，有什麼氣味元素是你希望「絕對不要出現」的？(可多選)', en: 'Finally, what scent elements do you "absolutely want to avoid"? (Multiple choice)' },
            multiple: true,
            options: [
                { label: { zh: '過於甜膩的糖果/香草味', en: 'Overly sweet candy/vanilla scents' }, value: 'A' }, 
                { label: { zh: '濃烈的白花香（如茉莉、晚香玉）', en: 'Strong white florals (e.g., Jasmine, Tuberose)' }, value: 'B' },
                { label: { zh: '帶有侵略性的辛香料味', en: 'Aggressive spicy notes' }, value: 'C' }, 
                { label: { zh: '潮濕的泥土或苔蘚味', en: 'Damp earth or mossy scents' }, value: 'D' },
                { label: { zh: '毫無禁忌，請給我驚喜', en: 'No taboos, surprise me' }, value: 'E', exclusive: true } 
            ]
        }
    ],
    branches: {
        'A': [ 
            {
                id: 'A1', 
                question: { zh: '哪一個瞬間最能讓你感到絕對的「愜意」與放鬆？', en: 'Which moment makes you feel absolutely "at ease" and relaxed?' },
                options: [
                    { label: { zh: '午後的一場大雨後，空氣充滿濕度，青草與土壤的氣味。', en: 'After a heavy afternoon rain, the humid air with scents of grass and soil.' }, archetype: 'grounded_earth', notes: { zh: ['橡木苔', '岩蘭草', '苦橙葉'], en: ['Oakmoss', 'Vetiver', 'Petitgrain'] } },
                    { label: { zh: '早晨陽光透過亞麻窗簾，灑在剛洗淨的純白床單上。', en: 'Morning sunlight through linen curtains, falling on freshly washed white sheets.' }, archetype: 'second_skin', notes: { zh: ['鈴蘭', '鳶尾花', '純淨皂香'], en: ['Lily of the Valley', 'Iris', 'Clean Soap'] } },
                    { label: { zh: '夜晚點起暖黃閱讀燈，窩在沙發裡翻閱舊書，喝著茶。', en: 'Lighting a warm reading lamp at night, curling up on the sofa reading an old book with tea.' }, archetype: 'intellectual_woods', notes: { zh: ['伯爵茶', '雪松', '琥珀'], en: ['Earl Grey', 'Cedarwood', 'Amber'] } },
                    { label: { zh: '漫步在清晨薄霧的海灘，迎面吹來帶有鹽分的微風。', en: 'Strolling on a misty morning beach, greeted by a salty breeze.' }, archetype: 'mineral_horizon', notes: { zh: ['海鹽', '鼠尾草', '冰涼醛香'], en: ['Sea Salt', 'Sage', 'Cool Aldehydes'] } }
                ]
            },
            {
                id: 'A2', 
                question: { zh: '當置身於人群中時，別人在第一時間感受到的你，最接近哪一種輪廓？', en: 'When in a crowd, what is the first impression you project to others?' },
                options: [
                    { label: { zh: '「打磨光滑的冷調大理石」', en: '"Smooth, cold-toned marble"' }, archetype: 'mineral_horizon', notes: { zh: ['柏樹', '微苦的冷木質'], en: ['Cypress', 'Cool Bitter Woods'] } },
                    { label: { zh: '「透著微光的亞麻織物」', en: '"Linen fabric filtering a soft glow"' }, archetype: 'second_skin', notes: { zh: ['羊絨木', '洋甘菊'], en: ['Cashmere Wood', 'Chamomile'] } },
                    { label: { zh: '「帶有解構剪裁的深色層次」', en: '"Dark layers with deconstructed tailoring"' }, archetype: 'velvet_paradox', notes: { zh: ['帶煙燻感的木質', '沉香'], en: ['Smoky Woods', 'Oud'] } },
                    { label: { zh: '「折射著光線的流動稜鏡」', en: '"A flowing prism refracting light"' }, archetype: 'vibrant_awakening', notes: { zh: ['杜松子', '乾淨雪松'], en: ['Juniper Berry', 'Clean Cedar'] } }
                ]
            },
            {
                id: 'A3', 
                question: { zh: '如果這瓶香氛化作一句低語，那會是下列哪一句？', en: 'If this fragrance turned into a whisper, which would it be?' },
                options: [
                    { label: { zh: '「世界再喧囂，我也能成為自己的避難所。」', en: '"No matter how noisy the world gets, I can be my own sanctuary."' }, archetype: 'intellectual_woods' },
                    { label: { zh: '「你不必總是那麼堅強，允許自己被溫柔地接住吧。」', en: '"You don\'t always have to be so strong; allow yourself to be caught gently."' }, archetype: 'second_skin' },
                    { label: { zh: '「無論好壞，所有的經歷都是為了迎來下一次的破曉。」', en: '"Good or bad, all experiences pave the way for the next dawn."' }, archetype: 'vibrant_awakening' },
                    { label: { zh: '「就讓心裡保留一片下雨的空間，陰影裡也有它的美意。」', en: '"Leave a space for rain in your heart; shadows have their own beauty."' }, archetype: 'grounded_earth' }
                ]
            }
        ],
        'B': [
            {
                id: 'B1', 
                question: { zh: '當你步入一個陌生的空間，你希望空氣中率先為你傳遞出什麼樣的隱形訊息？', en: 'When entering a new space, what invisible message do you want the air to convey for you?' },
                options: [
                    { label: { zh: '我沒有攻擊性，你可以安心降落。', en: 'I am non-aggressive; you can land safely.' }, archetype: 'second_skin', notes: { zh: ['白茶', '洋甘菊', '棉花籽'], en: ['White Tea', 'Chamomile', 'Cotton Seed'] } },
                    { label: { zh: '我清楚自己的方向，且擁有不容侵犯的界線。', en: 'I know my direction and have inviolable boundaries.' }, archetype: 'intellectual_woods', notes: { zh: ['苦橙葉', '雪松', '香根草'], en: ['Petitgrain', 'Cedarwood', 'Vetiver'] } },
                    { label: { zh: '我是一個謎團，等待懂得的人來翻閱。', en: 'I am a mystery, waiting for someone who understands to unravel.' }, archetype: 'velvet_paradox', notes: { zh: ['玫瑰', '琥珀', '粉紅胡椒'], en: ['Rose', 'Amber', 'Pink Pepper'] } },
                    { label: { zh: '這世界很好玩，而我無所畏懼。', en: 'The world is fun, and I am fearless.' }, archetype: 'vibrant_awakening', notes: { zh: ['甜橙', '水蜜桃', '小蒼蘭'], en: ['Sweet Orange', 'Peach', 'Freesia'] } }
                ]
            },
            {
                id: 'B2', 
                question: { zh: '為了成為理想的自己，你最想褪去、或者正在克服的舊習慣是什麼？', en: 'To become your ideal self, what old habit do you most want to shed or overcome?' },
                options: [
                    { label: { zh: '總是習慣先迎合他人，卻忘了為自己設立底線。', en: 'Always catering to others, forgetting to set boundaries for myself.' }, archetype: 'velvet_paradox', notes: { zh: ['莎草', '黑胡椒', '雪松'], en: ['Cypriol', 'Black Pepper', 'Cedarwood'] } },
                    { label: { zh: '容易在眾多選項中反覆猶豫，渴望擁有更果決的行動力。', en: 'Constantly hesitating among options, craving more decisive action.' }, archetype: 'vibrant_awakening', notes: { zh: ['香根草', '葡萄柚', '苦橙'], en: ['Vetiver', 'Grapefruit', 'Bitter Orange'] } },
                    { label: { zh: '害怕展露真實情緒與脆弱，習慣把心藏得很深。', en: 'Afraid of showing true emotions and vulnerability, hiding my heart deeply.' }, archetype: 'second_skin', notes: { zh: ['千葉玫瑰', '琥珀', '安息香'], en: ['Centifolia Rose', 'Amber', 'Benzoin'] } },
                    { label: { zh: '對『完美』的執念太深，不允許自己有任何失誤。', en: 'Too obsessed with "perfection", not allowing myself any mistakes.' }, archetype: 'intellectual_woods', notes: { zh: ['薰衣草', '白茶', '快樂鼠尾草'], en: ['Lavender', 'White Tea', 'Clary Sage'] } }
                ]
            },
            {
                id: 'B3', 
                question: { zh: '未來是一張尚未完全攤開的地圖。迎接即將來臨的下一個篇章，哪句話最能帶給你力量？', en: 'The future is an unrolled map. Which quote gives you the most strength for the next chapter?' },
                options: [
                    { label: { zh: '「如果沒有路，就自己劈開一條；由我來改寫劇本。」', en: '"If there is no path, forge one; I will rewrite the script."' }, archetype: 'vibrant_awakening' },
                    { label: { zh: '「任憑時間在此緩步，沉澱出無可撼動的安定。」', en: '"Let time slow down here, precipitating an unshakable stability."' }, archetype: 'mineral_horizon' },
                    { label: { zh: '「丟掉所有多餘的行囊，越是純粹透明，越能裝下無限可能。」', en: '"Shed all excess baggage; the purer and more transparent, the more infinite possibilities it holds."' }, archetype: 'second_skin' },
                    { label: { zh: '「無論日月更迭，依然選擇用溫柔去愛、去相信。」', en: '"No matter how days pass, I still choose to love and believe with gentleness."' }, archetype: 'grounded_earth' }
                ]
            }
        ], 
        'C': [
            {
                id: 'C1', 
                question: { zh: '當這個人在人群中出現，或當你閉上眼想起他時，哪種描述最符合他帶給你的樣貌？', en: 'When this person appears in a crowd, or when you close your eyes and think of them, which description fits best?' },
                options: [
                    { label: { zh: '早晨帶著涼意的霧氣，安靜、清冷，不輕易隨波逐流。', en: 'Cool morning mist, quiet and detached, not easily swayed by the crowd.' }, archetype: 'mineral_horizon', notes: { zh: ['柑橘', '薄荷', '醛香'], en: ['Citrus', 'Mint', 'Aldehydes'] } },
                    { label: { zh: '午後穿透亞麻窗簾的光，溫和、柔軟，讓人忍不住想靠近。', en: 'Afternoon light through linen curtains, warm, soft, and inviting.' }, archetype: 'second_skin', notes: { zh: ['白茶', '佛手柑', '無花果'], en: ['White Tea', 'Bergamot', 'Fig'] } },
                    { label: { zh: '像燃燒著木柴的微火，沉穩、可靠，有一種深邃的安定感。', en: 'Like a low fire burning firewood, steady, reliable, with a profound sense of security.' }, archetype: 'intellectual_woods', notes: { zh: ['黑胡椒', '苦橙葉', '雪松'], en: ['Black Pepper', 'Petitgrain', 'Cedarwood'] } },
                    { label: { zh: '像傍晚變幻莫測的天色，充滿生命力、靈動且難以捉摸。', en: 'Like the unpredictable evening sky, full of vitality, dynamic and elusive.' }, archetype: 'velvet_paradox', notes: { zh: ['粉紅胡椒', '莓果', '微醺酒香'], en: ['Pink Pepper', 'Berries', 'Boozy Notes'] } }
                ]
            },
            {
                id: 'C2', 
                question: { zh: '在你眼中，他藏在表象之下，最真實（或只有你懂）的特質是什麼？', en: 'In your eyes, what is their truest trait hidden beneath the surface (that perhaps only you understand)?' },
                options: [
                    { label: { zh: '看似堅強獨立，其實內心極度柔軟，渴望被溫柔接住。', en: 'Seems strong and independent, but internally extremely soft and yearning to be gently held.' }, archetype: 'second_skin', notes: { zh: ['白麝香', '羊絨木'], en: ['White Musk', 'Cashmere Wood'] } },
                    { label: { zh: '看似隨和好相處，其實內心有著極高的標準與不妥協的底線。', en: 'Seems easygoing, but holds incredibly high standards and uncompromising boundaries inside.' }, archetype: 'intellectual_woods', notes: { zh: ['香根草'], en: ['Vetiver'] } },
                    { label: { zh: '看似理智冷靜，但靈魂深處藏著對自由與冒險的浪漫渴望。', en: 'Seems rational and calm, but deeply harbors a romantic craving for freedom and adventure.' }, archetype: 'vibrant_awakening', notes: { zh: ['廣藿香', '皮革'], en: ['Patchouli', 'Leather'] } },
                    { label: { zh: '看似充滿防備、像隻刺蝟，但其實對世界有著最細膩的共情。', en: 'Seems guarded like a hedgehog, but actually possesses the most delicate empathy for the world.' }, archetype: 'velvet_paradox', notes: { zh: ['琥珀'], en: ['Amber'] } }
                ]
            },
            {
                id: 'C3', 
                question: { zh: '如果用一種「空間狀態」來形容你們之間的相處，那會是哪一種畫面？', en: 'If you were to describe your interaction as a "spatial state," which scene would it be?' },
                options: [
                    { label: { zh: '「兩張並排的單人沙發」—— 不需要一直說話也覺得安心。', en: '"Two armchairs side by side" — feeling secure without needing to talk constantly.' }, archetype: 'second_skin', notes: { zh: ['皂香', '棉花'], en: ['Soap Notes', 'Cotton'] } },
                    { label: { zh: '「深夜裡的微光吧台」—— 總是能交換最深層的哲學與思辨。', en: '"A dimly lit bar late at night" — always able to exchange the deepest philosophy and debates.' }, archetype: 'velvet_paradox', notes: { zh: ['伯爵茶', '菸草', '玫瑰'], en: ['Earl Grey', 'Tobacco', 'Rose'] } },
                    { label: { zh: '「沒有邊界的曠野」—— 可以卸下所有包袱，是最純粹的自己。', en: '"A boundless wilderness" — able to drop all burdens and be our purest selves.' }, archetype: 'mineral_horizon', notes: { zh: ['海洋氣息', '鼠尾草', '鈴蘭'], en: ['Oceanic Notes', 'Sage', 'Lily of the Valley'] } }
                ]
            },
            {
                id: 'C4', 
                question: { zh: '這瓶香氛交到他手上的那一刻，你最希望氣味替你傳達哪一句話？', en: 'The moment this fragrance is handed to them, what whisper do you want the scent to convey?' },
                options: [
                    { label: { zh: '「世界很吵，但願你能一直保有你靈魂裡的安靜與清澈。」', en: '"The world is loud, but I hope you always keep the quiet and clarity in your soul."' }, archetype: 'intellectual_woods' },
                    { label: { zh: '「我知道你的刺是為了保護自己，但在我面前，你可以不用那麼堅強。」', en: '"I know your thorns are to protect yourself, but in front of me, you don\'t have to be so strong."' }, archetype: 'second_skin' },
                    { label: { zh: '「這是不被任何人定義的你，也是我最欣賞的你。」', en: '"This is you, undefined by anyone, and the you I admire the most."' }, archetype: 'vibrant_awakening' },
                    { label: { zh: '「我們的故事還在繼續，這只是其中一個美好的分號。」', en: '"Our story continues; this is just one beautiful semicolon."' }, archetype: 'grounded_earth' }
                ]
            }
        ], 
        'D': [
            {
                id: 'D1', 
                question: { zh: '如果這段記憶是一張照片，它罩著什麼樣的光線與濾鏡？', en: 'If this memory were a photograph, what kind of lighting and filter covers it?' },
                options: [
                    { label: { zh: '帶著灰藍調的清晨，空氣微冷，一切尚未甦醒。', en: 'A grayish-blue early morning, the air is crisp, and nothing has awakened yet.' }, archetype: 'mineral_horizon', notes: { zh: ['海鹽', '薄荷', '杜松子'], en: ['Sea Salt', 'Mint', 'Juniper Berry'] } },
                    { label: { zh: '飽滿的暖橘色夕陽，有一種熱烈卻即將消逝的悵然。', en: 'A rich warm-orange sunset, carrying a passionate yet fleeting melancholy.' }, archetype: 'velvet_paradox', notes: { zh: ['甜橙', '肉桂', '菸草'], en: ['Sweet Orange', 'Cinnamon', 'Tobacco'] } },
                    { label: { zh: '昏暗空間裡的一束微光，聚焦在某個安靜的物件上。', en: 'A glimmer of light in a dim space, focusing on a quiet object.' }, archetype: 'intellectual_woods', notes: { zh: ['乾燥木柴', '莎草', '廣藿香'], en: ['Dry Firewood', 'Cypriol', 'Patchouli'] } },
                    { label: { zh: '低飽和的灰綠色調，萬物被雨水洗刷過，帶著濕潤的重量。', en: 'A desaturated grey-green tone, everything washed by rain, carrying a moist weight.' }, archetype: 'grounded_earth', notes: { zh: ['橡木苔', '苦橙葉', '無花果葉'], en: ['Oakmoss', 'Petitgrain', 'Fig Leaf'] } }
                ]
            },
            {
                id: 'D2', 
                question: { zh: '當畫面逐漸淡出，這段記憶留在你腦海中的背景音是什麼？', en: 'As the scene fades out, what is the background sound of this memory left in your mind?' },
                options: [
                    { label: { zh: '筆尖劃過紙張的沙沙聲，或書頁翻動的微小聲響。', en: 'The rustling of a pen across paper, or the faint sound of turning pages.' }, archetype: 'intellectual_woods', notes: { zh: ['廣藿香', '皮革', '莎草'], en: ['Patchouli', 'Leather', 'Cypriol'] } },
                    { label: { zh: '窗外樹葉被風吹動的摩挲聲，帶著某種遼闊與釋然。', en: 'The rustle of leaves blown by the wind outside, carrying a sense of vastness and relief.' }, archetype: 'grounded_earth', notes: { zh: ['雪松', '橡木苔', '扁柏'], en: ['Cedarwood', 'Oakmoss', 'Hinoki'] } },
                    { label: { zh: '某個人低聲的呢喃，或是兩人之間連心跳都能聽見的寂靜。', en: 'Someone\'s low murmur, or a silence between two people where you can even hear a heartbeat.' }, archetype: 'second_skin', notes: { zh: ['白麝香', '香草', '琥珀'], en: ['White Musk', 'Vanilla', 'Amber'] } },
                    { label: { zh: '隔著厚重玻璃，城市遠方極其微弱的車流低頻嗡鳴。', en: 'Through heavy glass, the extremely faint low-frequency hum of distant city traffic.' }, archetype: 'mineral_horizon', notes: { zh: ['龍涎香'], en: ['Ambergris'] } }
                ]
            },
            {
                id: 'D3', 
                question: { zh: '若以文學的視角來看，這個瞬間屬於故事的哪一個篇章？', en: 'From a literary perspective, to which chapter of the story does this moment belong?' },
                options: [
                    { label: { zh: '沒有前因後果，直接從最深刻的那一秒切入。', en: 'No cause and effect, cutting directly into the most profound second.' }, archetype: 'vibrant_awakening' },
                    { label: { zh: '那是所有喧囂落下後，留下的最後一句未完的對白。', en: 'It is the last unfinished line of dialogue left after all the noise has settled.' }, archetype: 'velvet_paradox' },
                    { label: { zh: '其實什麼都沒發生，但心裡知道，一切都不一樣了。', en: 'Actually, nothing happened, but in my heart, I knew everything had changed.' }, archetype: 'second_skin' }
                ]
            }
        ] 
    }
};

const fragranceProfiles = {
    'intellectual_woods': {
        name: { zh: '《冷調木質與茶 (The Intellectual Woods)》', en: '《Cold Woods & Tea (The Intellectual Woods)》' }, 
        quote: { zh: '「在極致的克制與秩序中，往往藏著最深沉的熱愛。」', en: '"In ultimate restraint and order hides the deepest passion."' },
        story: { 
            zh: ['推開極簡純白的空間，大理石桌面乾淨無瑕，只放著一杯散發著裊裊熱氣的伯爵茶。','這是屬於理智者的氣息，外表看似高冷、保持著優雅的界線感，內心卻對世界有著最細膩而通透的解讀。','它的香氣俐落而有支撐力，是一件能在喧囂中維持自我秩序的隱形戰袍。'], 
            en: ['Opening the minimalist, pure white space, the marble table is flawless, holding only a steaming cup of Earl Grey tea.', 'This is the scent of a rationalist—appearing aloof and maintaining elegant boundaries on the outside, while possessing the most delicate and lucid understanding of the world inside.', 'Its aroma is sharp yet supportive, an invisible armor that maintains your inner order amidst the noise.'] 
        }
    },
    'second_skin': {
        name: { zh: '《純淨皂香與柔白麝香 (The Second Skin)》', en: '《Pure Soap & Soft White Musk (The Second Skin)》' }, 
        quote: { zh: '「你不必總是那麼堅強，允許自己被溫柔地接住吧。」', en: '"You don\'t always have to be so strong; allow yourself to be caught gently."' },
        story: { 
            zh: ['早晨的陽光透過亞麻窗簾，輕輕灑落在剛洗淨的純白床單上。','這是不具任何攻擊性的溫柔，宛如第二層肌膚般的陪伴。','它不急於彰顯個性，而是在你疲憊時，用微溫的膚觸感卸下你所有的防備，給你一個最安穩、沒有評價的擁抱。'], 
            en: ['Morning sunlight filters through linen curtains, gently falling on freshly washed pure white sheets.', 'This is a tenderness devoid of aggression, accompanying you like a second skin.', 'It is in no rush to show off its personality; instead, when you are tired, it uses a lukewarm touch to disarm all your defenses, giving you the most secure, non-judgmental embrace.'] 
        }
    },
    'mineral_horizon': {
        name: { zh: '《海洋礦物與晨露 (The Mineral Horizon)》', en: '《Ocean Minerals & Morning Dew (The Mineral Horizon)》' }, 
        quote: { zh: '「任憑時間在此緩步，沉澱出無可撼動的安定。」', en: '"Let time slow down here, precipitating an unshakable stability."' },
        story: { 
            zh: ['獨自漫步在清晨還帶著薄霧的灰藍色海灘，迎面而來的是帶有鹽分與冷空氣的微風。','獻給渴望抽離、嚮往絕對自由的靈魂。','這股帶有透明感與空間感的氣息，宛如將一切繁冗斷捨離，只留下最純粹的自己，是通往內在平靜的鑰匙。'], 
            en: ['Walking alone on a grayish-blue beach in the misty early morning, greeted by a breeze carrying salt and crisp air.', 'Dedicated to souls yearning to detach and longing for absolute freedom.', 'This transparent and spacious scent is like discarding all clutter, leaving only the purest self—a key to inner peace.'] 
        }
    },
    'grounded_earth': {
        name: { zh: '《大地草本與綠意 (The Grounded Earth)》', en: '《Earthy Herbs & Greenery (The Grounded Earth)》' }, 
        quote: { zh: '「就讓心裡保留一片下雨的空間，陰影裡也有它的美意。」', en: '"Leave a space for rain in your heart; shadows have their own beauty."' },
        story: { 
            zh: ['午後的一場大雨，洗刷了森林裡的泥土與青草，空氣中帶著微濕潤的重量。','這是一款向下扎根的氣味，充滿生命經歷過風雨後的韌性。','適合那些內心豐富、懂得欣賞事物殘缺美感，並習慣在安靜與復古的氛圍中積蓄力量的敘事者。'], 
            en: ['A heavy afternoon rain washes the soil and grass in the forest, leaving a slightly moist weight in the air.', 'This is a deeply rooted scent, full of the resilience of life that has weathered the storm.', 'Suitable for storytellers with rich inner lives, who appreciate the beauty of imperfection and are accustomed to gathering strength in quiet, vintage atmospheres.'] 
        }
    },
    'velvet_paradox': {
        name: { zh: '《辛香微醺與皮革 (The Velvet Paradox)》', en: '《Spicy Intoxication & Leather (The Velvet Paradox)》' }, 
        quote: { zh: '「平靜的水面下，是旁人看不見的暗湧。」', en: '"Beneath the calm surface lies an undercurrent unseen by others."' },
        story: { 
            zh: ['深夜裡點著微光的吧台，或是翻閱到一半、散發著墨水味的陳年舊書。','帶有微微的辛辣與煙燻感，像是為了保護柔軟內心而長出的優雅刺。','氣味深邃且充滿未說出口的潛台詞，反差極大，需要時間一層層剝開，極具魅惑與知性的餘韻。'], 
            en: ['A dimly lit bar late at night, or an old, ink-scented book flipped halfway through.', 'Carrying a slight spiciness and smokiness, like elegant thorns grown to protect a soft heart.', 'The scent is profound and full of unspoken subtext, highly contrasting, requiring time to peel back layer by layer, leaving an intensely alluring and intellectual lingering trail.'] 
        }
    },
    'vibrant_awakening': {
        name: { zh: '《明亮柑橘與花果 (The Vibrant Awakening)》', en: '《Bright Citrus & Florals (The Vibrant Awakening)》' }, 
        quote: { zh: '「故事從最精彩的半途開始，沒有起點，也沒有終點。」', en: '"The story begins brilliantly in the middle, with no start and no end."' },
        story: { 
            zh: ['折射著光線的流動稜鏡，將沉悶的空氣瞬間劃破。','跳躍的多汁果香與靈動的花朵，瓦解了過度的緊繃與猶豫不決。','這是破繭而出的生命力，帶有微氣泡般的明亮感，宣告著對未知的熱愛與無所畏懼，隨時準備好迎向下一場冒險。'], 
            en: ['A flowing prism refracting light, instantly piercing through the dull air.', 'Jumping, juicy fruity notes and agile florals dissolve excessive tension and hesitation.', 'This is the vitality of breaking out of a cocoon, with a sparkling brightness that declares a love for the unknown and fearlessness, always ready for the next adventure.'] 
        }
    }
};

// --- 問卷引擎 (支援雙語與香材蒐集) ---
let currentPhase = 'base'; 
let currentQIndex = 0;
let scores = {};
let chosenBranch = 'A';
let selectedMultiple = [];
let selectedNotes = []; // 收集的是包含 {zh: [], en: []} 的物件陣列

function initQuiz() {
    currentPhase = 'base';
    currentQIndex = 0;
    scores = {};
    chosenBranch = 'A';
    selectedMultiple = [];
    selectedNotes = []; 
    
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    renderQuestion();
}

function renderQuestion() {
    let q = null;
    
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

    // 根據當前語言顯示題目
    document.getElementById('questionText').innerHTML = q.question[currentLang];
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    if (q.multiple) {
        selectedMultiple = [];
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn multiple-opt';
            btn.innerHTML = opt.label[currentLang];
            btn.dataset.val = opt.value;
            btn.dataset.exclusive = opt.exclusive ? "true" : "false";

            btn.onclick = function() {
                if (opt.exclusive) {
                    document.querySelectorAll('.multiple-opt').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedMultiple = [opt.value];
                } else {
                    const exclusiveBtn = document.querySelector('.multiple-opt[data-exclusive="true"]');
                    if (exclusiveBtn) exclusiveBtn.classList.remove('selected');
                    
                    this.classList.toggle('selected');
                    if (this.classList.contains('selected')) {
                        selectedMultiple.push(opt.value);
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
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = opt.label[currentLang];
            btn.onclick = () => {
                if (q.id === 'Q1') chosenBranch = opt.value;
                if (opt.archetype) scores[opt.archetype] = (scores[opt.archetype] || 0) + 1;
                
                // 收集專屬香材
                if (opt.notes) {
                    selectedNotes.push(opt.notes);
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
    
    let highestScore = 0;
    let finalArchetype = 'second_skin'; 
    for (const [arch, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            finalArchetype = arch;
        }
    }
    
    const result = fragranceProfiles[finalArchetype];
    
    // 雙語顯示結果故事
    document.getElementById('resultName').textContent = result.name[currentLang];
    document.getElementById('resultQuote').textContent = result.quote[currentLang];
    document.getElementById('resultStory').innerHTML = result.story[currentLang].join('<br><br>');
    
    // 處理動態香精名稱 (雙語去重)
    let uniqueZh = [...new Set(selectedNotes.flatMap(n => n.zh))];
    let uniqueEn = [...new Set(selectedNotes.flatMap(n => n.en))];
    
    let notesDisplay = '';
    if (currentLang === 'zh') {
        notesDisplay = uniqueZh.length > 0 ? uniqueZh.join(' ✦ ') : '純粹特調';
    } else {
        notesDisplay = uniqueEn.length > 0 ? uniqueEn.join(' ✦ ') : 'Pure Blend';
    }
    
    document.getElementById('resultNotes').innerHTML = `
        <div style="font-size: 1.15rem; color: #8a7a8f; font-weight: 600; margin-bottom: 2rem; letter-spacing: 1.5px; line-height: 1.8;">
            ${notesDisplay}
        </div>
    `;
    
    document.getElementById('quizResult').style.display = 'block';
    
    // 滑動對齊 (避免卷動過頭，可選用)
    const resultHeader = document.querySelector('.result-label');
    if(resultHeader) {
        const topPos = resultHeader.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
}

function resetQuiz() {
    initQuiz();
}
