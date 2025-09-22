// 报关单管理页面JavaScript

// 全局变量
let currentPage = 1;
let pageSize = 20;
let totalPages = 8;
let currentStatus = 'all';
let currentDeclarationData = [];

// 模拟报关单数据
const mockDeclarationData = [
    {
        id: 1,
        batchNo: 'B202401001',
        declarationNo: '518120240001',
        status: 'completed',
        statusText: '报关完成',
        tradeTerms: 'FOB',
        domesticShipper: '深圳某贸易有限公司',
        foreignConsignee: '香港ABC贸易公司',
        transportMode: '航空',
        departurePort: '香港',
        destinationPort: '深圳',
        lastUpdater: '张三',
        lastUpdateTime: '2024-01-15 14:30:25'
    },
    {
        id: 2,
        batchNo: 'B202401002',
        declarationNo: '518120240002',
        status: 'processing',
        statusText: '报关中',
        tradeTerms: 'CIF',
        domesticShipper: '广州进出口贸易公司',
        foreignConsignee: '美国DEF公司',
        transportMode: '海运',
        departurePort: '上海港',
        destinationPort: '广州港',
        lastUpdater: '李四',
        lastUpdateTime: '2024-01-16 09:15:42'
    },
    {
        id: 3,
        batchNo: 'B202401003',
        declarationNo: '518120240003',
        status: 'processing',
        statusText: '报关中',
        tradeTerms: 'CFR',
        domesticShipper: '北京科技发展有限公司',
        foreignConsignee: '韩国GHI集团',
        transportMode: '航空',
        departurePort: '首尔',
        destinationPort: '北京',
        lastUpdater: '王五',
        lastUpdateTime: '2024-01-17 16:45:18'
    },
    {
        id: 4,
        batchNo: 'B202401004',
        declarationNo: '518120240004',
        status: 'pending',
        statusText: '待报关',
        tradeTerms: 'EXW',
        domesticShipper: '杭州电子商务有限公司',
        foreignConsignee: '日本JKL株式会社',
        transportMode: '其他',
        departurePort: '宁波港',
        destinationPort: '杭州',
        lastUpdater: '赵六',
        lastUpdateTime: '2024-01-18 11:20:33'
    },
    {
        id: 5,
        batchNo: 'B202401005',
        declarationNo: '518120240005',
        status: 'completed',
        statusText: '报关完成',
        tradeTerms: 'DDP',
        domesticShipper: '成都跨境电商公司',
        foreignConsignee: '新加坡MNO贸易',
        transportMode: '航空',
        departurePort: '东京',
        destinationPort: '成都',
        lastUpdater: '孙七',
        lastUpdateTime: '2024-01-19 13:55:07'
    }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initStatusTabs();
    loadDeclarationData();
    bindEvents();
});

// 初始化状态标签页
function initStatusTabs() {
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有active类
            statusTabs.forEach(t => t.classList.remove('active'));
            // 添加active类到当前点击的标签
            this.classList.add('active');
            
            // 更新当前状态
            currentStatus = this.dataset.status;
            console.log('切换到状态:', currentStatus);
            
            // 重新加载数据
            loadDeclarationData();
        });
    });
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
        });
    }
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('declaration-detail-modal');
        if (event.target === modal) {
            closeDeclarationDetailModal();
        }
    });
}

// 加载报关单数据
function loadDeclarationData() {
    console.log('加载报关单数据，当前状态:', currentStatus);
    
    // 根据状态筛选数据
    let filteredData = mockDeclarationData;
    if (currentStatus !== 'all') {
        filteredData = mockDeclarationData.filter(item => item.status === currentStatus);
    }
    
    currentDeclarationData = filteredData;
    
    // 渲染表格数据
    renderTableData(filteredData);
    
    // 更新分页信息
    updatePaginationInfo(filteredData.length);
    
    // 更新状态TAB徽标
    updateStatusTabBadges();
}

// 根据状态获取操作按钮
function getActionButtons(item) {
    let buttons = '';
    
    switch(item.status) {
        case 'pending': // 待报关
            buttons = `
                <button class="action-btn action-btn-edit" onclick="editDeclaration(${item.id})">编辑</button>
                <button class="action-btn action-btn-confirm" onclick="confirmDeclaration(${item.id})">确认报关</button>
                <button class="action-btn action-btn-view" onclick="viewDeclaration(${item.id})">详情</button>
            `;
            break;
        case 'processing': // 报关中
            buttons = `
                <button class="action-btn action-btn-edit" onclick="editDeclaration(${item.id})">编辑</button>
                <button class="action-btn action-btn-cancel" onclick="cancelDeclaration(${item.id})">取消确认</button>
                <button class="action-btn action-btn-complete" onclick="completeDeclaration(${item.id})">报关完成</button>
                <button class="action-btn action-btn-view" onclick="viewDeclaration(${item.id})">详情</button>
            `;
            break;
        case 'completed': // 报关完成
            buttons = `
                <button class="action-btn action-btn-cancel" onclick="cancelDeclaration(${item.id})">取消确认</button>
                <button class="action-btn action-btn-view" onclick="viewDeclaration(${item.id})">详情</button>
            `;
            break;
        default:
            buttons = `
                <button class="action-btn action-btn-view" onclick="viewDeclaration(${item.id})">详情</button>
            `;
    }
    
    return buttons;
}

// 渲染表格数据
function renderTableData(data) {
    const tableBody = document.getElementById('declaration-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const pageData = data.slice(startIndex, endIndex);
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fixed-column checkbox-column">
                <input type="checkbox" value="${item.id}">
            </td>
            <td class="fixed-column batch-column">${item.batchNo}</td>
            <td class="scrollable-column">${item.declarationNo}</td>
            <td class="scrollable-column">
                <span class="status-badge status-${item.status}">${item.statusText}</span>
            </td>
            <td class="scrollable-column">${item.tradeTerms}</td>
            <td class="scrollable-column">${item.domesticShipper}</td>
            <td class="scrollable-column">${item.foreignConsignee}</td>
            <td class="scrollable-column">${item.transportMode}</td>
            <td class="scrollable-column">${item.departurePort}</td>
            <td class="scrollable-column">${item.destinationPort}</td>
            <td class="scrollable-column">${item.lastUpdater}</td>
            <td class="scrollable-column">${item.lastUpdateTime}</td>
            <td class="fixed-column action-column">
                <div class="action-buttons">
                    ${getActionButtons(item)}
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 更新分页信息
function updatePaginationInfo(totalCount) {
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('current-page').textContent = currentPage;
    
    totalPages = Math.ceil(totalCount / pageSize);
    document.getElementById('total-pages').textContent = totalPages;
    
    // 更新分页按钮状态
    updatePaginationButtons();
}

// 更新分页按钮状态
function updatePaginationButtons() {
    const prevBtn = document.querySelector('.page-btn[onclick="previousPage()"]');
    const nextBtn = document.querySelector('.page-btn[onclick="nextPage()"]');
    const firstBtn = document.querySelector('.page-btn[onclick="goToPage(1)"]');
    const lastBtn = document.querySelector('.page-btn[onclick="goToPage(-1)"]');
    
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    if (firstBtn) firstBtn.disabled = currentPage <= 1;
    if (lastBtn) lastBtn.disabled = currentPage >= totalPages;
}

// 更新状态TAB徽标
function updateStatusTabBadges() {
    const statusCounts = {
        all: mockDeclarationData.length,
        pending: mockDeclarationData.filter(item => item.status === 'pending').length,
        processing: mockDeclarationData.filter(item => item.status === 'processing').length,
        completed: mockDeclarationData.filter(item => item.status === 'completed').length
    };
    
    Object.keys(statusCounts).forEach(status => {
        const tab = document.querySelector(`[data-status="${status}"] .badge`);
        if (tab) {
            tab.textContent = statusCounts[status];
        }
    });
}

// 查询报关单
function searchDeclarations() {
    const batchNo = document.getElementById('batch-no').value.trim();
    const declarationNo = document.getElementById('declaration-no').value.trim();
    const tradeTerms = document.getElementById('trade-terms').value;
    const supervisionMode = document.getElementById('supervision-mode').value;
    const transportMode = document.getElementById('transport-mode').value;
    const voyageNo = document.getElementById('voyage-no').value.trim();
    const billOfLading = document.getElementById('bill-of-lading').value.trim();
    const declarationDate = document.getElementById('declaration-date').value;
    
    console.log('查询条件:', {
        batchNo,
        declarationNo,
        tradeTerms,
        supervisionMode,
        transportMode,
        voyageNo,
        billOfLading,
        declarationDate
    });
    
    // 这里应该调用API进行查询
    // 现在只是模拟查询
    alert('查询功能已触发！');
}

// 重置查询条件
function resetSearch() {
    document.getElementById('batch-no').value = '';
    document.getElementById('declaration-no').value = '';
    document.getElementById('trade-terms').value = '';
    document.getElementById('supervision-mode').value = '';
    document.getElementById('transport-mode').value = '';
    document.getElementById('voyage-no').value = '';
    document.getElementById('bill-of-lading').value = '';
    document.getElementById('declaration-date').value = '';
    
    // 重新加载数据
    loadDeclarationData();
}

// 新建报关单
function createDeclaration() {
    alert('新建报关单功能开发中...');
}

// 查看报关单详情
function viewDeclaration(id) {
    const declaration = mockDeclarationData.find(item => item.id === id);
    if (!declaration) return;
    
    // 填充弹窗数据
    document.getElementById('detail-batch-no').textContent = declaration.batchNo;
    document.getElementById('detail-declaration-no').textContent = declaration.declarationNo;
    document.getElementById('detail-status').textContent = declaration.statusText;
    document.getElementById('detail-trade-terms').textContent = declaration.tradeTerms;
    document.getElementById('detail-domestic-shipper').textContent = declaration.domesticShipper;
    document.getElementById('detail-foreign-consignee').textContent = declaration.foreignConsignee;
    document.getElementById('detail-transport-mode').textContent = declaration.transportMode;
    document.getElementById('detail-departure-port').textContent = declaration.departurePort;
    document.getElementById('detail-destination-port').textContent = declaration.destinationPort;
    document.getElementById('detail-last-updater').textContent = declaration.lastUpdater;
    document.getElementById('detail-last-update-time').textContent = declaration.lastUpdateTime;
    
    // 显示弹窗
    document.getElementById('declaration-detail-modal').style.display = 'block';
}

// 编辑报关单
function editDeclaration(id) {
    if (id) {
        const declaration = mockDeclarationData.find(item => item.id === id);
        console.log('编辑报关单:', declaration);
        
        if (declaration) {
            // 根据报关单状态传递不同的参数
            const status = declaration.status || 'pending';
            window.location.href = `customs-declaration-edit.html?id=${id}&status=${status}`;
        } else {
            alert('找不到指定的报关单');
        }
    } else {
        alert('报关单ID无效');
    }
}

// 确认报关单 (pending -> processing)
function confirmDeclaration(id) {
    if (id) {
        const declaration = mockDeclarationData.find(item => item.id === id);
        if (declaration) {
            if (declaration.status !== 'pending') {
                showErrorMessage('只有待报关状态的报关单才能确认报关！');
                return;
            }
            
            if (confirm(`确定要确认报关单 ${declaration.declarationNo} 吗？`)) {
                // 更新状态为报关中
                declaration.status = 'processing';
                declaration.statusText = '报关中';
                declaration.lastUpdateTime = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                console.log('确认报关成功:', declaration);
                showSuccessMessage('报关单确认成功，状态已更新为报关中！');
                
                // 重新加载数据以刷新页面
                loadDeclarationData();
            }
        }
    }
}

// 取消确认报关单 (processing -> pending 或 completed -> pending)
function cancelDeclaration(id) {
    if (id) {
        const declaration = mockDeclarationData.find(item => item.id === id);
        if (declaration) {
            if (declaration.status === 'pending') {
                showErrorMessage('该报关单已经是待报关状态！');
                return;
            }
            
            let confirmMessage = '';
            if (declaration.status === 'processing') {
                confirmMessage = `确定要取消确认报关单 ${declaration.declarationNo} 吗？状态将变为待报关。`;
            } else if (declaration.status === 'completed') {
                confirmMessage = `确定要取消确认报关单 ${declaration.declarationNo} 吗？状态将变为待报关。`;
            }
            
            if (confirm(confirmMessage)) {
                // 更新状态为待报关
                declaration.status = 'pending';
                declaration.statusText = '待报关';
                declaration.lastUpdateTime = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                console.log('取消确认成功:', declaration);
                showSuccessMessage('取消确认成功，状态已更新为待报关！');
                
                // 重新加载数据以刷新页面
                loadDeclarationData();
            }
        }
    }
}

// 报关完成 (processing -> completed)
function completeDeclaration(id) {
    if (id) {
        const declaration = mockDeclarationData.find(item => item.id === id);
        if (declaration) {
            if (declaration.status !== 'processing') {
                showErrorMessage('只有报关中状态的报关单才能标记为报关完成！');
                return;
            }
            
            if (confirm(`确定要将报关单 ${declaration.declarationNo} 标记为报关完成吗？`)) {
                // 更新状态为报关完成
                declaration.status = 'completed';
                declaration.statusText = '报关完成';
                declaration.lastUpdateTime = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                console.log('报关完成:', declaration);
                showSuccessMessage('报关单已标记为完成！');
                
                // 重新加载数据以刷新页面
                loadDeclarationData();
            }
        }
    }
}

// 删除报关单
function deleteDeclaration(id) {
    if (confirm('确定要删除这条报关单记录吗？')) {
        console.log('删除报关单 ID:', id);
        alert('删除功能开发中...');
    }
}

// 关闭报关单详情弹窗
function closeDeclarationDetailModal() {
    document.getElementById('declaration-detail-modal').style.display = 'none';
}

// 分页功能
function goToPage(page) {
    if (page === -1) {
        currentPage = totalPages;
    } else {
        currentPage = page;
    }
    
    loadDeclarationData();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadDeclarationData();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadDeclarationData();
    }
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // 重置到第一页
    loadDeclarationData();
}

// 工具函数
function showSuccessMessage(message) {
    alert('✅ ' + message);
}

function showErrorMessage(message) {
    alert('❌ ' + message);
}

// 导出函数供其他页面使用
window.declarationManagement = {
    loadDeclarationData,
    searchDeclarations,
    resetSearch,
    createDeclaration,
    viewDeclaration,
    editDeclaration,
    confirmDeclaration,
    cancelDeclaration,
    completeDeclaration,
    deleteDeclaration,
    showExportModal,
    closeExportModal,
    confirmExport
};
// 导出相关函数
function showExportModal() {
    document.getElementById('export-modal').style.display = 'block';
}

function closeExportModal() {
    document.getElementById('export-modal').style.display = 'none';
    // 重置表单
    document.getElementById('export-form').reset();
    // 重新勾选所有文件类型复选框（默认全选）
    const checkboxes = document.querySelectorAll('input[name="fileType"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function confirmExport() {
    // 获取选中的文件类型
    const selectedFileTypes = [];
    const fileTypeCheckboxes = document.querySelectorAll('input[name="fileType"]:checked');
    fileTypeCheckboxes.forEach(checkbox => {
        selectedFileTypes.push({
            value: checkbox.value,
            label: checkbox.parentElement.textContent.trim()
        });
    });

    // 获取是否享惠选项
    const preferentialRadio = document.querySelector('input[name="preferential"]:checked');
    
    // 验证必填项
    if (!preferentialRadio) {
        alert('请选择是否享惠！');
        return;
    }

    if (selectedFileTypes.length === 0) {
        alert('请至少选择一种文件类型！');
        return;
    }

    // 构建导出参数
    const exportParams = {
        fileTypes: selectedFileTypes,
        preferential: preferentialRadio.value,
        preferentialLabel: preferentialRadio.parentElement.textContent.trim()
    };

    // 执行导出逻辑
    performExport(exportParams);
}

function performExport(params) {
    // 显示导出进度
    showSuccessMessage('正在准备导出文件...');
    
    // 模拟导出过程
    setTimeout(() => {
        const fileTypeLabels = params.fileTypes.map(ft => ft.label).join('、');
        const message = `导出成功！\n文件类型：${fileTypeLabels}\n是否享惠：${params.preferentialLabel}`;
        
        showSuccessMessage(message);
        
        // 关闭弹窗
        closeExportModal();
        
        // 这里可以添加实际的文件下载逻辑
        // 例如：window.open('download-url') 或创建下载链接
        
    }, 1500);
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('export-modal');
    if (event.target === modal) {
        closeExportModal();
    }
}