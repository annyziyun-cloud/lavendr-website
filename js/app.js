document.addEventListener('DOMContentLoaded', () => {
    // === 1. 處理頁面切換邏輯 (SPA Routing) ===
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-section');

    function navigateTo(hash) {
        if (!hash) hash = '#home';
        
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        const targetPage = document.querySelector(hash);
        const targetNav = document.querySelector(`.nav-item[href="${hash}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
        
        // 切換頁面時自動回到頂部
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

    window.addEventListener('popstate', () => {
        navigateTo(window.location.hash);
    });

    navigateTo(window.location.hash);

    // === 2. 處理中英文切換邏輯 ===
    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('lavendr_lang') || 'zh';

    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        langBtn.textContent = lang === 'zh' ? 'EN / 中文' : '中 / English';
        localStorage.setItem('lavendr_lang', lang);
    }

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage(currentLang);
    });

    updateLanguage(currentLang);
});

// === 3. 處理彈窗 (Modal) 邏輯 ===
function openModal(eventId) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');
    
    // 依據傳入的 ID 設定假資料，後續可串接真實內容
    if(eventId === 'event1') {
        title.textContent = '滿千免運 限定優惠';
    } else if (eventId === 'event2') {
        title.textContent = '首次加入會員贈 $100 購物金';
    }
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.remove('show');
}

// 點擊彈窗外部背景也能關閉
window.onclick = function(event) {
    const modal = document.getElementById('event-modal');
    if (event.target == modal) {
        modal.classList.remove('show');
    }
}

// === 4. 處理商品頁切換與資料庫 ===

// 定義商品香氛介紹資料 (雙語更新版)
const productData = {
    'p1': {
        title: '【茶香】留白 (Blank Space) 禮盒 100ml',
        moodImg: './mood-1.jpg',
        productImg: './product-1.jpg', 
        desc: '這是只屬於清晨的靜謐時刻。彷彿坐在沐浴著柔和光線的木地板上，輕輕翻開一本散文集。時間在這裡彷彿慢了下來。清爽的白茶香氣與溫暖舒適的雪松木質香交織融合，撫慰所有的躁動。這是一種毫不費力、低調的香氛——在忙碌的一天中，悄悄開闢出一片寧靜的空白，讓你可以好好深呼吸。'
    },
    'p2': {
        title: '【花香】織眠 (Woven Sleep) 禮盒 100ml',
        moodImg: './mood-2.jpg',
        productImg: './product-2.jpg',
        desc: '如同剛洗過的亞麻布一樣，散發著微風拂過後陽光晾曬的清新氣息。感覺就像被厚厚的羊毛毯輕輕包裹——純淨而無比柔軟。小蒼蘭的輕盈香氣如同無形的網子般環繞著你，帶走你所有的疲憊，帶來深深的慰藉和安全感。'
    },
    'p3': {
        title: '【咖啡】隅間 (The Corner) 禮盒 100ml',
        moodImg: './mood-3.jpg',
        productImg: './product-3.jpg',
        desc: '在城郊一棟古老的木屋裡，喧囂漸漸遠去。只有淡淡的烘焙咖啡的微苦，被乾香根草深沉的木質氣息所襯托。這是創作者的氣息──伴你寫作、思考，讓你徹底沉浸這完全屬於自己的角落。'
    },
    'p4': {
        title: '擴香棒禮盒 10根+2朵裝飾紙花',
        productImg: './product-4.jpg',
        desc: '精選高孔隙率擴香纖維棒，搭配手工細緻紙花。能完美吸附香氛精華並均勻釋放，為您的專屬空間增添優雅的視覺與嗅覺層次。'
    },
    'p5': {
        title: '【茶香】留白 (Blank Space) 補充包 100ml',
        productImg: './product-5.jpg',
        desc: '（補充包）這是只屬於清晨的靜謐時刻。彷彿坐在沐浴著柔和光線的木地板上，輕輕翻開一本散文集。時間在這裡彷彿慢了下來。清爽的白茶香氣與溫暖舒適的雪松木質香交織融合，撫慰所有的躁動。'
    },
    'p6': {
        title: '【花香】織眠 (Woven Sleep) 補充包 100ml',
        productImg: './product-6.jpg',
        desc: '（補充包）如同剛洗過的亞麻布一樣，散發著微風拂過後陽光晾曬的清新氣息。感覺就像被厚厚的羊毛毯輕輕包裹——純淨而無比柔軟。'
    },
    'p7': {
        title: '【咖啡】隅間 (The Corner) 補充包 100ml',
        productImg: './product-7.jpg',
        desc: '（補充包）在城郊一棟古老的木屋裡，喧囂漸漸遠去。只有淡淡的烘焙咖啡的微苦，被乾香根草深沉的木質氣息所襯托。'
    }
};

// 開啟商品專屬介紹
function openProduct(productId) {
    const data = productData[productId];
    if (!data) return;

    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-desc').textContent = data.desc;
    
    // 抓取兩張圖片的 DOM 元素
    const moodImgElement = document.getElementById('detail-mood-img');
    const productImgElement = document.getElementById('detail-product-img');

    // 自動判斷邏輯：如果這個商品有 moodImg，就顯示並載入圖片；如果沒有，就隱藏這個 img 標籤
    if (data.moodImg) {
        moodImgElement.src = data.moodImg;
        moodImgElement.style.display = 'block'; 
    } else {
        moodImgElement.style.display = 'none'; 
    }

    // 實體商品圖則是每個商品都有，直接載入
    productImgElement.src = data.productImg;

    document.getElementById('shop-list-view').style.display = 'none';
    document.getElementById('product-detail-view').style.display = 'block';
    window.scrollTo(0, 0); 
}

// 關閉商品專屬介紹，返回列表
function closeProduct() {
    document.getElementById('product-detail-view').style.display = 'none';
    document.getElementById('shop-list-view').style.display = 'block';
    window.scrollTo(0, 0);
}

// 監聽所有的「加入購物車」按鈕
document.addEventListener('DOMContentLoaded', () => {
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            alert('已成功加入購物車！(目前為測試模式)');
        });
    });
});
