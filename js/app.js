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
