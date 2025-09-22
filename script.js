document.addEventListener('DOMContentLoaded', function() {
    // 获取所有菜单标题
    const menuTitles = document.querySelectorAll('.menu-title');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    // 为每个一级菜单添加点击事件
    menuTitles.forEach(function(menuTitle) {
        menuTitle.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
            const submenu = document.getElementById(menuType + '-submenu');
            
            // 切换当前菜单的展开状态
            if (submenu.classList.contains('open')) {
                // 如果当前菜单已展开，则收起
                submenu.classList.remove('open');
                this.classList.add('collapsed');
                this.classList.remove('active');
            } else {
                // 先收起所有其他菜单
                closeAllSubmenus();
                
                // 展开当前菜单
                submenu.classList.add('open');
                this.classList.remove('collapsed');
                this.classList.add('active');
            }
        });
    });
    
    // 为每个二级菜单项添加点击事件
    submenuItems.forEach(function(submenuItem) {
        submenuItem.addEventListener('click', function(event) {
            event.stopPropagation(); // 防止事件冒泡
            
            // 移除所有二级菜单的选中状态
            submenuItems.forEach(function(item) {
                item.classList.remove('active');
            });
            
            // 添加当前项的选中状态
            this.classList.add('active');
            
            // 更新主内容区域
            updateMainContent(this.textContent);
        });
    });
    
    // 关闭所有子菜单的函数
    function closeAllSubmenus() {
        const allSubmenus = document.querySelectorAll('.submenu');
        const allMenuTitles = document.querySelectorAll('.menu-title');
        
        allSubmenus.forEach(function(submenu) {
            submenu.classList.remove('open');
        });
        
        allMenuTitles.forEach(function(title) {
            title.classList.add('collapsed');
            title.classList.remove('active');
        });
    }
    
    // 更新主内容区域的函数
    function updateMainContent(selectedMenu) {
        // 如果是关务税则维护，跳转到税则库页面
        if (selectedMenu === '关务税则维护') {
            // 跳转到税则库页面，默认显示中国数据
            window.location.href = 'tariff.html?country=china';
            return;
        }
        
        // 如果是关务商品评估，跳转到关务商品评估页面
        if (selectedMenu === '关务商品评估') {
            window.location.href = 'customs-product-management.html';
            return;
        }
        
        // 如果是商品要素确认，跳转到商品要素确认页面
        if (selectedMenu === '商品要素确认') {
            window.location.href = 'product-element-confirmation.html';
            return;
        }
        
        // 如果是关务商品管理（旧菜单项，保持兼容性）
        if (selectedMenu === '关务商品管理') {
            window.location.href = 'customs-product-management.html';
            return;
        }
        
        // 如果是报关单管理，跳转到报关单管理页面
        if (selectedMenu === '报关单管理') {
            window.location.href = 'customs-declaration-management.html';
            return;
        }
        
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <h1>${selectedMenu}</h1>
            <p>您当前选择的功能模块是：${selectedMenu}</p>
            <p>此处将显示 ${selectedMenu} 的具体功能界面。</p>
        `;
    }
    
    // 初始化：所有菜单都处于收起状态
    menuTitles.forEach(function(title) {
        title.classList.add('collapsed');
    });
    
    // 检查URL参数，如果有menu参数则自动选择对应菜单
    const urlParams = new URLSearchParams(window.location.search);
    const menuParam = urlParams.get('menu');
    if (menuParam) {
        // 查找对应的菜单项并自动点击
        const targetMenuItem = Array.from(submenuItems).find(item => 
            item.textContent === decodeURIComponent(menuParam)
        );
        if (targetMenuItem) {
            // 展开对应的一级菜单
            const parentSubmenu = targetMenuItem.closest('.submenu');
            const parentMenuTitle = parentSubmenu.previousElementSibling;
            
            parentSubmenu.classList.add('open');
            parentMenuTitle.classList.remove('collapsed');
            parentMenuTitle.classList.add('active');
            
            // 选中对应的二级菜单
            targetMenuItem.classList.add('active');
            updateMainContent(targetMenuItem.textContent);
        }
    }
    
    // 页面加载完成后的提示
    console.log('关务管理系统侧边栏已加载完成');
});
