// 印尼进口报关单管理 JavaScript

// 全局变量
let currentPage = 1;
let pageSize = 20;
let totalCount = 5;
let currentStatus = 'all';
let tableData = [];

// 国家配置
const COUNTRY_CONFIG = {
    name: '印尼',
    code: 'indonesia',
    flag: '🇮🇩'
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
    // 全选checkbox
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBatchActions();
        });
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
            id: `ID${String(i + 1).padStart(6, '0')}`,
            batchNo: `BATCH-ID-${String(i + 1).padStart(4, '0')}`,
            declarationNo: `ID${new Date().getFullYear()}${String(i + 1).padStart(6, '0')}`,
            exportDeclarationNo: `EXP${new Date().getFullYear()}${String(i + 401).padStart(6, '0')}`,
            status: status,
            tradeTerms: ['FOB', 'CIF', 'CFR', 'DDU', 'DDP'][i % 5],
            foreignShipper: ['印尼ABC制造公司', '雅加达XYZ贸易', '泗水DEF工业', '万隆GHI出口商'][i % 4],
            domesticConsignee: ['上海进口贸易公司', '苏州国际物流', '无锡制造企业', '南京贸易集团'][i % 4],
            transportMode: ['海运', '空运', '公路', '快递'][i % 4],
            entryPort: ['上海港', '宁波港', '苏州港', '连云港'][i % 4],
            departurePort: ['雅加达港', '泗水港', '三宝垄港', '马卡萨港'][i % 4],
            declareDate: getRandomDate(),
            lastUpdater: ['张三', '李四', '王五', '赵六', '陈七'][i % 5],
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
                <input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateBatchActions()">
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
    
}

// 更新批量操作状态
function updateBatchActions() {
    const checkedItems = document.querySelectorAll('.row-checkbox:checked');
    const batchActionsDiv = document.querySelector('.batch-actions');
    
    if (checkedItems.length > 0) {
        if (!batchActionsDiv) {
            // 创建批量操作区域
            const batchActionsHtml = `
                <div class="batch-actions">
                    <span class="selected-count">已选中 <strong>${checkedItems.length}</strong> 项</span>
                    <button class="btn btn-primary" onclick="batchExport()">批量导出</button>
                    <button class="btn btn-danger" onclick="batchDelete()">批量删除</button>
                </div>
            `;
            // 插入到表格容器之前
            const tableContainer = document.querySelector('.table-container');
            tableContainer.insertAdjacentHTML('beforebegin', batchActionsHtml);
        } else {
            // 更新选中数量
            const selectedCount = batchActionsDiv.querySelector('.selected-count strong');
            if (selectedCount) {
                selectedCount.textContent = checkedItems.length;
            }
        }
    } else {
        // 移除批量操作区域
        if (batchActionsDiv) {
            batchActionsDiv.remove();
        }
    }
    
    // 更新全选checkbox状态
    const selectAllCheckbox = document.getElementById('select-all');
    const totalCheckboxes = document.querySelectorAll('.row-checkbox');
    if (selectAllCheckbox && totalCheckboxes.length > 0) {
        selectAllCheckbox.checked = checkedItems.length === totalCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < totalCheckboxes.length;
    }
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

// 显示导出弹窗
function showExportModal() {
    const modal = document.getElementById('export-modal');
    modal.style.display = 'block';
}

// 关闭导出弹窗
function closeExportModal() {
    const modal = document.getElementById('export-modal');
    modal.style.display = 'none';
}

// 确认导出
function confirmExport() {
    const form = document.getElementById('export-form');
    const formData = new FormData(form);
    
    const fileTypes = formData.getAll('fileType');
    const preferential = formData.get('preferential');
    
    if (!preferential) {
        alert('请选择是否享惠');
        return;
    }
    
    showSuccessMessage('导出任务已开始，请稍候...');
    closeExportModal();
    
    setTimeout(() => {
        showSuccessMessage('导出完成！');
    }, 2000);
}

// 批量导出
function batchExport() {
    const checkedItems = document.querySelectorAll('.row-checkbox:checked');
    if (checkedItems.length === 0) {
        alert('请先选择要导出的记录');
        return;
    }
    
    showExportModal();
}

// 批量删除
function batchDelete() {
    const checkedItems = document.querySelectorAll('.row-checkbox:checked');
    if (checkedItems.length === 0) {
        alert('请先选择要删除的记录');
        return;
    }
    
    if (!confirm(`确认删除选中的 ${checkedItems.length} 条记录吗？`)) {
        return;
    }
    
    showSuccessMessage('删除成功');
    loadDeclarationData();
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
window.indonesiaImportDeclaration = {
    loadDeclarationData,
    viewDeclaration,
    searchDeclarations,
    resetSearch,
    showExportModal,
    confirmExport,
    switchStatus
};