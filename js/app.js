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

// 定義商品香氛介紹資料
const productData = {
    'p1': {
        title: '【茶香】留白 (Blank Space) 禮盒 100ml',
        moodImg: './mood-1.jpg',     // 有情境圖
        productImg: './product-1.jpg', 
        desc: '這是一段專屬於清晨的靜謐時光。彷彿在灑滿微光的木地板上，安靜地翻開一本散文集。時間在這裡慢了下來，微冷的白茶香氣伴隨著雪松的溫潤，撫平了所有的躁動。這款香氣不爭不搶，為擁擠的日常騰出了一處能夠深呼吸的空白角落。'
    },
    'p2': {
        title: '【花香】織眠 (Woven Sleep) 禮盒 100ml',
        moodImg: './mood-2.jpg',     // 有情境圖
        productImg: './product-2.jpg',
        desc: '如同剛洗淨的棉麻布料，揉合了微風與陽光曝曬後的乾燥氣息。宛如被厚實的羊毛毯輕輕包裹，純粹且柔軟。輕盈的小蒼蘭在空氣中交織出一張隱形的網，接住了所有的疲憊，給人無比溫柔的安全感。'
    },
    'p3': {
        title: '【咖啡】隅間 (The Corner) 禮盒 100ml',
        moodImg: './mood-3.jpg',     // 有情境圖
        productImg: './product-3.jpg',
        desc: '在城市邊緣的木造老屋裡，沒有過多的喧囂，只有淺焙咖啡豆的微苦，與乾燥香根草沉澱下來的木質底蘊。這是一抹屬於創作者的香氣，伴隨你在案前書寫、思考，沉浸在自己專屬角落之時。'
    },
    'p4': {
        title: '擴香棒禮盒 10根+2朵裝飾紙花',
        // 拿掉 moodImg，只保留實體圖
        productImg: './product-4. png',
        desc: '精選高孔隙率擴香纖維棒，搭配手工細緻紙花。能完美吸附香氛精華並均勻釋放，為您的專屬空間增添優雅的視覺與嗅覺層次。'
    },
    'p5': {
        title: '【茶香】留白 (Blank Space) 補充包 100ml',
        productImg: './product-5.jpg',
        desc: '【茶香】留白 (Blank Space) 補充包。這是一段專屬於清晨的靜謐時光。彷彿在灑滿微光的木地板上，安靜地翻開一本散文集。時間在這裡慢了下來，微冷的白茶香氣伴隨著雪松的溫潤，撫平了所有的躁動。'
    },
    'p6': {
        title: '【花香】織眠 (Woven Sleep) 補充包 100ml',
        productImg: './product-6.jpg',
        desc: '【花香】織眠 (Woven Sleep) 補充包。如同剛洗淨的棉麻布料，揉合了微風與陽光曝曬後的乾燥氣息。宛如被厚實的羊毛毯輕輕包裹，純粹且柔軟。'
    },
    'p7': {
        title: '【咖啡】隅間 (The Corner) 補充包 100ml',
        productImg: './product-7.jpg',
        desc: '【咖啡】隅間 (The Corner) 補充包。在城市邊緣的木造老屋裡，沒有過多的喧囂，只有淺焙咖啡豆的微苦，與乾燥香根草沉澱下來的木質底蘊。'
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
