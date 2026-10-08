// === 1. 將語言變數與函數拉到最外層 ===
let currentLang = localStorage.getItem('lavendr_lang') || 'zh';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // 改用 innerHTML 以支援粗體與換行等 HTML 標籤
            el.innerHTML = translations[lang][key]; 
        }
    });

    // 替換 input placeholder
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


// === 2. 頁面載入完成後執行的主邏輯 ===
document.addEventListener('DOMContentLoaded', () => {
    
    const pages = document.querySelectorAll('.page-section');
    const navItems = document.querySelectorAll('.nav-item');

    // 處理頁面切換邏輯
    function navigateTo(hash) {
        if (!hash) hash = '#home';
        
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        const targetPage = document.querySelector(hash);
        const targetNav = document.querySelector(`.nav-item[href="${hash}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
        
        // 如果切換到商品頁，確保是顯示列表而非單一商品介紹
        const listView = document.getElementById('shop-list-view');
        const detailView = document.getElementById('product-detail-view');
        if (hash === '#shop' && listView && detailView) {
            listView.style.display = 'block';
            detailView.style.display = 'none';
        }

        window.scrollTo(0, 0);
    }

    // 監聽導覽列點擊
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetHash = e.target.getAttribute('href');
            history.pushState(null, null, targetHash);
            navigateTo(targetHash);
        });
    });

    // 監聽所有其他超連結 (例如：首頁活動的"探索更多"、Footer連結)
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

    window.addEventListener('popstate', () => {
        navigateTo(window.location.hash);
    });

    navigateTo(window.location.hash);

    // 監聽語言切換按鈕
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            updateLanguage(currentLang);
        });
    }
    updateLanguage(currentLang);

    // 監聽「加入購物車」按鈕
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const alertMsg = currentLang === 'zh' ? '已成功加入購物車！(目前為測試模式)' : 'Added to cart successfully! (Test mode)';
            alert(alertMsg);
        });
    });

    // 處理客服與政策摺疊面板 (Accordion)
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
});


// === 3. 商品資料與切換邏輯 (放在最外層) ===
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

    const titleElement = document.getElementById('detail-title');
    const descElement = document.getElementById('detail-desc');
    const noticeElement = document.getElementById('detail-notice');
    const moodImgElement = document.getElementById('detail-mood-img');
    const productImgElement = document.getElementById('detail-product-img');
    
    if (!titleElement || !descElement || !noticeElement) return;

    titleElement.setAttribute('data-i18n', productId + '_title');
    descElement.setAttribute('data-i18n', productId + '_desc');
    noticeElement.setAttribute('data-i18n', data.noticeKey);
    
    updateLanguage(currentLang);

    if (data.moodImg && moodImgElement) {
        moodImgElement.src = data.moodImg;
        moodImgElement.style.display = 'block'; 
    } else if (moodImgElement) {
        moodImgElement.style.display = 'none'; 
    }
    
    if (productImgElement) productImgElement.src = data.productImg;

    document.getElementById('shop-list-view').style.display = 'none';
    document.getElementById('product-detail-view').style.display = 'block';
    window.scrollTo(0, 0); 
}

function closeProduct() {
    document.getElementById('product-detail-view').style.display = 'none';
    document.getElementById('shop-list-view').style.display = 'block';
    window.scrollTo(0, 0);
}
