// === 將語言變數與函數拉到最外層，讓所有功能都能共用 ===
let currentLang = localStorage.getItem('lavendr_lang') || 'zh';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.textContent = lang === 'zh' ? 'EN / 中文' : '中 / English';
    }
    localStorage.setItem('lavendr_lang', lang);
}


// === 頁面載入完成後執行的主邏輯 ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. 處理頁面切換邏輯 (SPA Routing)
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

    // 2. 監聽語言切換按鈕
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            updateLanguage(currentLang);
        });
    }

    // 初始化語言
    updateLanguage(currentLang);

    // 3. 監聽所有的「加入購物車」按鈕
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const alertMsg = currentLang === 'zh' ? '已成功加入購物車！(目前為測試模式)' : 'Added to cart successfully! (Test mode)';
            alert(alertMsg);
            
    // === 5. 處理客服與政策摺疊面板 (Accordion) ===
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            // 點擊時，關閉其他已展開的面板 (保持畫面極簡)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // 切換當前面板的狀態
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                // 自動計算內容高度並展開
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
});


// === 4. 處理商品頁切換與資料庫 (這裡現在只管圖片，不管文字) ===
const productData = {
    'p1': { moodImg: 'assets/mood-1.jpg', productImg: 'assets/product-1.jpg', noticeKey: 'notice_main'},
    'p2': { moodImg: 'assets/mood-2.jpg', productImg: 'assets/product-2.jpg', noticeKey: 'notice_main' },
    'p3': { moodImg: 'assets/mood-3.jpg', productImg: 'assets/product-3.jpg', noticeKey: 'notice_main' },
    'p4': { productImg: 'assets/product-4.png', noticeKey: 'notice_sticks' }, // 無情境圖
    'p5': { productImg: 'assets/product-5.jpg', noticeKey: 'notice_refill' },
    'p6': { productImg: 'assets/product-6.jpg', noticeKey: 'notice_refill' },
    'p7': { productImg: 'assets/product-7.jpg', noticeKey: 'notice_refill' }
};

// 開啟商品專屬介紹
function openProduct(productId) {
    const data = productData[productId];
    if (!data) return;

    // 抓取元素
    const titleElement = document.getElementById('detail-title');
    const descElement = document.getElementById('detail-desc');
    const noticeElement = document.getElementById('detail-notice');
    const moodImgElement = document.getElementById('detail-mood-img');
    const productImgElement = document.getElementById('detail-product-img');
    
    // 【關鍵步驟】動態替換這個商品專屬的翻譯標籤 (例如：變成 p1_title, p1_desc)
    titleElement.setAttribute('data-i18n', productId + '_title');
    descElement.setAttribute('data-i18n', productId + '_desc');
    noticeElement.setAttribute('data-i18n', data.noticeKey);
    // 呼叫翻譯函數，讓標題跟內文立刻顯示為目前的語言 (中文或英文)
    updateLanguage(currentLang);

    // 處理圖片邏輯
    if (data.moodImg) {
        moodImgElement.src = data.moodImg;
        moodImgElement.style.display = 'block'; 
    } else {
        moodImgElement.style.display = 'none'; 
    }
    productImgElement.src = data.productImg;

    // 切換視角
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
