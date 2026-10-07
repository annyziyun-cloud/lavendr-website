document.addEventListener('DOMContentLoaded', () => {
    // === 1. 處理頁面切換邏輯 (SPA Routing) ===
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-section');

    function navigateTo(hash) {
        if (!hash) hash = '#home'; // 預設首頁
        
        // 移除所有啟動狀態
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));

        // 啟動目標頁面與對應導覽按鈕
        const targetPage = document.querySelector(hash);
        const targetNav = document.querySelector(`.nav-item[href="${hash}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
    }

    // 監聽導覽列點擊
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetHash = e.target.getAttribute('href');
            history.pushState(null, null, targetHash); // 更改網址但不重載
            navigateTo(targetHash);
        });
    });

    // 處理瀏覽器上一頁/下一頁
    window.addEventListener('popstate', () => {
        navigateTo(window.location.hash);
    });

    // 初始化載入當前 Hash
    navigateTo(window.location.hash);


    // === 2. 處理中英文切換邏輯 ===
    const langBtn = document.getElementById('lang-btn');
    // 從 localStorage 讀取之前的語言設定，預設為中文
    let currentLang = localStorage.getItem('lavendr_lang') || 'zh';

    function updateLanguage(lang) {
        // 找出所有帶有 data-i18n 屬性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        // 更新按鈕文字狀態
        langBtn.textContent = lang === 'zh' ? 'EN / 中文' : '中 / English';
        
        // 儲存狀態，確保跨頁面或重整都不會跑掉
        localStorage.setItem('lavendr_lang', lang);
    }

    // 監聽語言切換按鈕
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage(currentLang);
    });

    // 初始化語言
    updateLanguage(currentLang);
});
