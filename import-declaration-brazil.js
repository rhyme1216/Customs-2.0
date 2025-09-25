// 巴西进口报关单管理 JavaScript

// 全局变量
let currentPage = 1;
let pageSize = 20;
let totalCount = 5;
let currentStatus = 'all';
let tableData = [];

// 国家配置
const COUNTRY_CONFIG = {
    name: '巴西',
    code: 'brazil',
    flag: '🇧🇷'
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadDeclarationData();
    bindEvents();
});

// 初始化页面
function initializePage() {
    initializeSidebar();
    initializeStatusTabs();
    document.title = `${COUNTRY_CONFIG.name}进口报关单管理`;
    updateBreadcrumb();
}

// 初始化侧边栏功能
function initializeSidebar() {
    const menuTitles = document.querySelectorAll('.menu-title');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    menuTitles.forEach(function(menuTitle) {
        menuTitle.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
            const submenu = document.getElementById(menuType + '-submenu');
            
            if (submenu.classList.contains('open')) {
                submenu.classList.remove('open');
                this.classList.add('collapsed');
                this.classList.remove('active');
            } else {
                closeAllSubmenus();
                submenu.classList.add('open');
                this.classList.remove('collapsed');
                this.classList.add('active');
            }
        });
    });
    
    submenuItems.forEach(function(submenuItem) {
        submenuItem.addEventListener('click', function(event) {
            event.stopPropagation();
            submenuItems.forEach(function(item) {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
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
}

// 初始化状态TAB
function initializeStatusTabs() {
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            switchStatus(status);
        });
    });
}

// 切换状态
function switchStatus(status) {
    currentStatus = status;
    currentPage = 1;
    
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    statusTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-status') === status) {
            tab.classList.add('active');
        }
    });
    
    loadDeclarationData();
}

// 绑定事件
function bindEvents() {
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    const pageSizeSelect = document.getElementById('page-size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', changePageSize);
    }
}

// 加载报关单数据
function loadDeclarationData() {
    showLoading();
    
    setTimeout(() => {
        const mockData = generateMockData();
        tableData = mockData.data;
        totalCount = mockData.total;
        
        renderTable(tableData);
        updatePagination();
        hideLoading();
    }, 800);
}

// 生成模拟数据
function generateMockData() {
    const statuses = ['pending', 'processing', 'completed'];
    const statusCounts = { all: 5, pending: 1, processing: 2, completed: 2 };
    const data = [];
    
    let count = statusCounts[currentStatus] || statusCounts.all;
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize, count);
    
    for (let i = startIndex; i < endIndex; i++) {
        const statusIndex = currentStatus === 'all' ? i % 3 : statuses.indexOf(currentStatus);
        const status = statuses[statusIndex];
        
        data.push({
            id: `BR${String(i + 1).padStart(6, '0')}`,
            batchNo: `BATCH-BR-${String(i + 1).padStart(4, '0')}`,
            declarationNo: `BR${new Date().getFullYear()}${String(i + 1).padStart(6, '0')}`,
            exportDeclarationNo: `EXP${new Date().getFullYear()}${String(i + 501).padStart(6, '0')}`,
            status: status,
            tradeTerms: ['FOB', 'CIF', 'CFR', 'DDU', 'DDP', 'FCA'][i % 6],
            foreignShipper: ['巴西ABC农业公司', '圣保罗XYZ制造', '里约DEF出口商', '巴西利亚GHI贸易'][i % 4],
            domesticConsignee: ['青岛进口贸易公司', '天津国际物流', '大连制造企业', '烟台贸易集团'][i % 4],
            transportMode: ['海运', '空运', '公路', '铁路'][i % 4],
            entryPort: ['青岛港', '天津港', '大连港', '烟台港'][i % 4],
            departurePort: ['桑托斯港', '里约港', '伊塔瓜伊港', '巴拉那瓜港'][i % 4],
            declareDate: getRandomDate(),
            lastUpdater: ['张三', '李四', '王五', '赵六', '陈七', '钱八'][i % 6],
            lastUpdateTime: getRandomDateTime()
        });
    }
    
    return {
        data: data,
        total: count
    };
}

// 获取随机日期
function getRandomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

// 获取随机时间
function getRandomDateTime() {
    const randomDate = getRandomDate();
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${randomDate} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// 渲染表格
function renderTable(data) {
    const tbody = document.getElementById('declaration-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="15" class="empty-state">
                    <div class="empty-icon">📦</div>
                    <div class="empty-text">暂无数据</div>
                    <div class="empty-hint">请调整查询条件后重试</div>
                </td>
            </tr>
        `;
        return;
    }
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fixed-column checkbox-column">
                <input type="checkbox" class="row-checkbox" value="${item.id}">
            </td>
            <td class="fixed-column batch-column">${item.batchNo}</td>
            <td class="scrollable-column">${item.declarationNo}</td>
            <td class="scrollable-column">${item.exportDeclarationNo}</td>
            <td class="scrollable-column">${getStatusBadge(item.status)}</td>
            <td class="scrollable-column">${item.tradeTerms}</td>
            <td class="scrollable-column">${item.foreignShipper}</td>
            <td class="scrollable-column">${item.domesticConsignee}</td>
            <td class="scrollable-column">${item.transportMode}</td>
            <td class="scrollable-column">${item.entryPort}</td>
            <td class="scrollable-column">${item.departurePort}</td>
            <td class="scrollable-column">${item.declareDate}</td>
            <td class="scrollable-column">${item.lastUpdater}</td>
            <td class="scrollable-column">${item.lastUpdateTime}</td>
            <td class="fixed-column action-column">
                <button class="action-btn view" onclick="viewDeclaration('${item.id}')">查看</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    bindRowCheckboxEvents();
}

// 获取状态徽章
function getStatusBadge(status) {
    const statusMap = {
        'pending': { text: '待报关', class: 'status-pending' },
        'processing': { text: '报关中', class: 'status-processing' },
        'completed': { text: '报关完成', class: 'status-completed' }
    };
    
    const statusInfo = statusMap[status] || { text: '未知', class: 'status-unknown' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// 绑定行选择事件
function bindRowCheckboxEvents() {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectAllState);
    });
}

// 更新全选状态
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
    
    if (checkedCount === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedCount === rowCheckboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// 更新面包屑
function updateBreadcrumb() {
    const breadcrumbLast = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbLast) {
        breadcrumbLast.textContent = `${COUNTRY_CONFIG.name}进口报关单管理`;
    }
}

// 查看报关单详情
function viewDeclaration(id) {
    const declaration = tableData.find(item => item.id === id);
    if (!declaration) return;
    
    showDeclarationDetailModal(declaration);
}

// 显示报关单详情弹窗
function showDeclarationDetailModal(declaration) {
    document.getElementById('detail-batch-no').textContent = declaration.batchNo;
    document.getElementById('detail-declaration-no').textContent = declaration.declarationNo;
    document.getElementById('detail-export-declaration-no').textContent = declaration.exportDeclarationNo;
    document.getElementById('detail-status').innerHTML = getStatusBadge(declaration.status);
    document.getElementById('detail-trade-terms').textContent = declaration.tradeTerms;
    document.getElementById('detail-foreign-shipper').textContent = declaration.foreignShipper;
    document.getElementById('detail-domestic-consignee').textContent = declaration.domesticConsignee;
    document.getElementById('detail-transport-mode').textContent = declaration.transportMode;
    document.getElementById('detail-entry-port').textContent = declaration.entryPort;
    document.getElementById('detail-departure-port').textContent = declaration.departurePort;
    document.getElementById('detail-last-updater').textContent = declaration.lastUpdater;
    document.getElementById('detail-last-update-time').textContent = declaration.lastUpdateTime;
    
    const modal = document.getElementById('declaration-detail-modal');
    modal.style.display = 'block';
}

// 关闭报关单详情弹窗
function closeDeclarationDetailModal() {
    const modal = document.getElementById('declaration-detail-modal');
    modal.style.display = 'none';
}

// 查询报关单
function searchDeclarations() {
    const searchParams = {
        batchNo: document.getElementById('batch-no').value,
        declarationNo: document.getElementById('declaration-no').value,
        exportDeclarationNo: document.getElementById('export-declaration-no').value,
        tradeTerms: document.getElementById('trade-terms').value,
        transportMode: document.getElementById('transport-mode').value,
        voyageNo: document.getElementById('voyage-no').value,
        billNo: document.getElementById('bill-no').value,
        declarationDate: document.getElementById('declaration-date').value
    };
    
    console.log('查询条件:', searchParams);
    
    currentPage = 1;
    loadDeclarationData();
    showSuccessMessage('查询完成');
}

// 重置查询条件
function resetSearch() {
    document.getElementById('batch-no').value = '';
    document.getElementById('declaration-no').value = '';
    document.getElementById('export-declaration-no').value = '';
    document.getElementById('trade-terms').value = '';
    document.getElementById('transport-mode').value = '';
    document.getElementById('voyage-no').value = '';
    document.getElementById('bill-no').value = '';
    document.getElementById('declaration-date').value = '';
    
    currentPage = 1;
    loadDeclarationData();
    showSuccessMessage('查询条件已重置');
}

// 分页相关函数
function updatePagination() {
    const totalPages = Math.ceil(totalCount / pageSize);
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    document.getElementById('total-count').textContent = totalCount;
}

function changePageSize() {
    const newPageSize = parseInt(document.getElementById('page-size').value);
    pageSize = newPageSize;
    currentPage = 1;
    loadDeclarationData();
}

function goToPage(page) {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page === -1) page = totalPages;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    currentPage = page;
    loadDeclarationData();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadDeclarationData();
    }
}

function nextPage() {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        loadDeclarationData();
    }
}

// 工具函数
function showLoading() {
    const tableBody = document.getElementById('declaration-table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="15" class="loading" style="text-align: center; padding: 40px;">
                    <div>正在加载数据...</div>
                </td>
            </tr>
        `;
    }
}

function hideLoading() {
    // 加载完成后数据会自动填充
}

function showSuccessMessage(message) {
    alert('✅ ' + message);
}

function showErrorMessage(message) {
    alert('❌ ' + message);
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const detailModal = document.getElementById('declaration-detail-modal');
    const exportModal = document.getElementById('export-modal');
    
    if (event.target === detailModal) {
        closeDeclarationDetailModal();
    }
    if (event.target === exportModal) {
        closeExportModal();
    }
}

// 导出函数供其他模块使用
window.brazilImportDeclaration = {
    loadDeclarationData,
    viewDeclaration,
    searchDeclarations,
    resetSearch,
    showExportModal,
    confirmExport,
    switchStatus
};