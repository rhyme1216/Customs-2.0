// 多选下拉框组件功能
class MultiSelectComponent {
    constructor(container) {
        this.container = container;
        this.display = container.querySelector('.multi-select-display');
        this.dropdown = container.querySelector('.multi-select-dropdown');
        this.placeholder = container.querySelector('.multi-select-placeholder');
        this.arrow = container.querySelector('.multi-select-arrow');
        this.options = container.querySelectorAll('.multi-select-option');
        this.selectedValues = [];
        
        this.init();
    }
    
    init() {
        // 点击显示区域切换下拉框
        this.display.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // 绑定选项事件
        this.bindEvents();
        
        // 点击文档其他地方关闭下拉框
        document.addEventListener('click', () => {
            this.closeDropdown();
        });
        
        // 阻止下拉框内部点击事件冒泡
        this.dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    toggleDropdown() {
        const isOpen = this.dropdown.style.display === 'block';
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        this.dropdown.style.display = 'block';
        this.arrow.textContent = '▲';
        this.container.classList.add('open');
    }
    
    closeDropdown() {
        this.dropdown.style.display = 'none';
        this.arrow.textContent = '▼';
        this.container.classList.remove('open');
    }
    
    toggleOption(option) {
        const checkbox = option.querySelector('.multi-select-checkbox');
        const value = option.dataset.value;
        const text = option.querySelector('.multi-select-option-text').textContent;
        
        if (checkbox.classList.contains('checked')) {
            // 取消选中
            checkbox.classList.remove('checked');
            this.selectedValues = this.selectedValues.filter(item => item.value !== value);
        } else {
            // 选中
            checkbox.classList.add('checked');
            this.selectedValues.push({ value, text });
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        // 清除现有标签
        const existingTags = this.display.querySelectorAll('.multi-select-tag');
        existingTags.forEach(tag => tag.remove());
        
        if (this.selectedValues.length === 0) {
            this.placeholder.style.display = 'inline';
        } else {
            this.placeholder.style.display = 'none';
            
            // 添加选中项标签
            this.selectedValues.forEach(item => {
                const tag = document.createElement('span');
                tag.className = 'multi-select-tag';
                tag.innerHTML = `
                    ${item.text}
                    <span class="multi-select-tag-close" data-value="${item.value}">×</span>
                `;
                
                // 添加删除标签事件
                const closeBtn = tag.querySelector('.multi-select-tag-close');
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeValue(item.value);
                });
                
                this.display.insertBefore(tag, this.arrow);
            });
        }
    }
    
    removeValue(value) {
        // 从选中值中移除
        this.selectedValues = this.selectedValues.filter(item => item.value !== value);
        
        // 更新复选框状态
        const option = this.container.querySelector(`[data-value="${value}"]`);
        if (option) {
            const checkbox = option.querySelector('.multi-select-checkbox');
            checkbox.classList.remove('checked');
        }
        
        this.updateDisplay();
    }
    
    // 绑定选项事件
    bindEvents() {
        // 重新获取选项（支持动态更新）
        this.options = this.container.querySelectorAll('.multi-select-option');
        
        // 点击选项
        this.options.forEach(option => {
            // 移除旧的事件监听器（如果存在）
            option.removeEventListener('click', option._clickHandler);
            
            // 创建新的事件处理器
            option._clickHandler = (e) => {
                e.stopPropagation();
                this.toggleOption(option);
            };
            
            // 添加事件监听器
            option.addEventListener('click', option._clickHandler);
        });
    }
    
    // 获取选中的值
    getValues() {
        return this.selectedValues.map(item => item.value);
    }
    
    // 设置选中的值
    setValues(values) {
        // 清除所有选中状态
        this.selectedValues = [];
        this.options.forEach(option => {
            const checkbox = option.querySelector('.multi-select-checkbox');
            if (checkbox) {
                checkbox.classList.remove('checked');
            }
        });
        
        // 设置新的选中状态
        values.forEach(value => {
            const option = this.container.querySelector(`[data-value="${value}"]`);
            if (option) {
                const checkbox = option.querySelector('.multi-select-checkbox');
                const textElement = option.querySelector('.multi-select-option-text');
                if (checkbox && textElement) {
                    const text = textElement.textContent;
                    checkbox.classList.add('checked');
                    this.selectedValues.push({ value, text });
                }
            }
        });
        
        this.updateDisplay();
    }
    
    // 清除所有选中
    clear() {
        this.setValues([]);
    }
}

// 初始化所有多选下拉框
function initMultiSelectComponents() {
    const containers = document.querySelectorAll('.multi-select-container');
    containers.forEach(container => {
        // 创建实例并保存到容器元素上
        container.multiSelectInstance = new MultiSelectComponent(container);
    });
}

// 注释掉重复的初始化，统一在initializePage中处理
// document.addEventListener('DOMContentLoaded', function() {
//     initMultiSelectComponents();
// });
// 关务商品管理页面JavaScript功能

// 全局变量
let currentPage = 1;
let totalPages = 1;
let totalRecords = 0;
let pageSize = 20;
let currentCountry = 'china';
let currentStatus = 'all';
let searchParams = {};

// 全局数据存储 - 解决数据持久化问题
let globalDataStore = {};

// 折叠功能 - 隐藏除基础4个组件外的所有组件
function toggleSearchForm() {
    const toggleText = document.getElementById('toggle-text');
    const toggleIcon = document.getElementById('toggle-icon');
    
    if (!toggleText || !toggleIcon) return;
    
    const isCollapsed = toggleText.textContent.trim() === '展开';
    
    // 获取所有查询行
    const searchRows = document.querySelectorAll('.search-form .search-row');
    
    if (isCollapsed) {
        // 展开：显示所有行
        searchRows.forEach(row => {
            row.style.display = '';
        });
        toggleText.textContent = '收起';
        toggleIcon.textContent = '▲';
    } else {
        // 收起：只保留第一行（包含基础4个组件）
        searchRows.forEach((row, index) => {
            if (index === 0) {
                // 第一行保持显示
                row.style.display = '';
            } else {
                // 其他行隐藏
                row.style.display = 'none';
            }
        });
        toggleText.textContent = '收起';
        toggleIcon.textContent = '▼';
    }
}

// 状态TAB切换联动功能
function handleStatusTabChange() {
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            console.log('TAB切换事件触发，状态:', status);
            
            // 调用统一的状态切换函数
            switchStatusTab(status);
        });
    });
    
    // 页面初始化时设置默认状态TAB（全部TAB）
    console.log('初始化状态TAB，设置默认状态为: all');
    switchStatusTab('all');
}

// 显示所有查询条件组件
function showAllQueryComponents() {
    const queryComponentGroups = [
        'data-source',
        'service-provider-group',
        'customs-status-group',
        'cert-status-group',
        'element-status-group',
        'has-order-group',
        'first-order-time-group',
        'creator-erp-group',
        'create-time-group',
        'evaluation-deadline-group'
    ];
    
    queryComponentGroups.forEach(groupId => {
        const formGroup = document.getElementById(groupId);
        if (formGroup) {
            formGroup.style.display = 'block';
            console.log(`显示组件: ${groupId}`);
        }
    });
}

// 隐藏指定的查询条件组件
function hideQueryComponents(componentIds) {
    componentIds.forEach(groupId => {
        const formGroup = document.getElementById(groupId);
        if (formGroup) {
            formGroup.style.display = 'none';
            console.log(`隐藏组件: ${groupId}`);
        }
    });
}

// 清除所有查询条件的选中状态
function clearAllSelections() {
    const multiSelects = document.querySelectorAll('.search-form .multi-select-container');
    multiSelects.forEach(container => {
        // 清除所有复选框的选中状态
        const checkboxes = container.querySelectorAll('.multi-select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.classList.remove('checked');
        });
        
        // 清除显示区域的标签
        const tags = container.querySelectorAll('.multi-select-tag');
        tags.forEach(tag => tag.remove());
        
        // 显示占位符
        const placeholder = container.querySelector('.multi-select-placeholder');
        if (placeholder) {
            placeholder.style.display = 'inline';
        }
        
        // 如果有对应的MultiSelectComponent实例，也清除其数据
        if (container.multiSelectInstance) {
            container.multiSelectInstance.clear();
        }
    });
}

// 设置多选下拉框的值
function setMultiSelectValues(selectId, values) {
    console.log(`设置多选下拉框 ${selectId} 的值:`, values);
    const container = document.getElementById(selectId);
    console.log(`找到容器:`, container);
    if (container && container.classList.contains('multi-select-container')) {
        console.log(`容器有效，开始设置值`);
        // 先清除所有选中状态
        const checkboxes = container.querySelectorAll('.multi-select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.classList.remove('checked');
        });
        
        // 清除现有标签
        const existingTags = container.querySelectorAll('.multi-select-tag');
        existingTags.forEach(tag => tag.remove());
        
        const placeholder = container.querySelector('.multi-select-placeholder');
        const display = container.querySelector('.multi-select-display');
        const arrow = container.querySelector('.multi-select-arrow');
        
        if (values.length === 0) {
            // 没有选中值，显示占位符
            if (placeholder) placeholder.style.display = 'inline';
        } else {
            // 有选中值，隐藏占位符并设置选中状态
            if (placeholder) placeholder.style.display = 'none';
            
            values.forEach(value => {
                // 设置对应选项的选中状态
                const option = container.querySelector(`[data-value="${value}"]`);
                if (option) {
                    const checkbox = option.querySelector('.multi-select-checkbox');
                    const textElement = option.querySelector('.multi-select-option-text');
                    
                    if (checkbox && textElement) {
                        const text = textElement.textContent;
                        checkbox.classList.add('checked');
                        
                        // 创建标签
                        const tag = document.createElement('span');
                        tag.className = 'multi-select-tag';
                        tag.innerHTML = `
                            ${text}
                            <span class="multi-select-tag-close" data-value="${value}">×</span>
                        `;
                        
                        // 添加删除标签事件
                        const closeBtn = tag.querySelector('.multi-select-tag-close');
                        closeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 移除这个值 - 获取当前实际选中的值
                            const currentCheckboxes = container.querySelectorAll('.multi-select-checkbox.checked');
                            const currentValues = Array.from(currentCheckboxes).map(cb => {
                                const option = cb.closest('.multi-select-option');
                                return option ? option.getAttribute('data-value') : null;
                            }).filter(v => v && v !== value);
                            setMultiSelectValues(selectId, currentValues);
                        });
                        
                        // 插入到箭头前面
                        if (display && arrow) {
                            display.insertBefore(tag, arrow);
                        }
                    }
                }
            });
        }
        
        // 如果有对应的MultiSelectComponent实例，也更新其数据
        if (container.multiSelectInstance) {
            container.multiSelectInstance.setValues(values);
        }
    }
}




// 生成操作按钮
function generateActionButtons(row) {
    const buttons = [];
    
    // 根据状态决定显示哪些按钮
    const customsStatus = row.customsStatus;
    const certStatus = row.certStatus;
    const productStatus = row.productStatus;
    
    // 关务评估按钮逻辑
    if (customsStatus === 'pending-submit') {
        // 待提交状态：显示关务评估按钮
        buttons.push(`<a href="javascript:void(0)" class="action-btn customs-btn" onclick="performCustomsEvaluation(getCurrentRowData('${row.domesticSku}'))">关务评估</a>`);
    } else if (customsStatus === 'confirmed') {
        // 已确认状态：可以重新评估，需要填写调整原因
        buttons.push(`<a href="javascript:void(0)" class="action-btn customs-btn" onclick="performCustomsEvaluation(getCurrentRowData('${row.domesticSku}'))">重新关务评估</a>`);
    }
    
    // 关务确认按钮（只有在关务评估状态为待确认时显示）
    if (customsStatus === 'pending-confirm') {
        buttons.push(`<a href="javascript:void(0)" class="action-btn confirm-btn" onclick="performCustomsConfirmation(getCurrentRowData('${row.domesticSku}'))">关务确认</a>`);
    }
    
    // 认证评估按钮逻辑
    if (certStatus === 'pending-submit') {
        buttons.push(`<a href="javascript:void(0)" class="action-btn cert-btn" onclick="performCertEvaluation(getCurrentRowData('${row.domesticSku}'))">认证评估</a>`);
    } else if (certStatus === 'submitted') {
        // 已提交状态：可以重新评估，需要填写调整原因
        buttons.push(`<a href="javascript:void(0)" class="action-btn cert-btn" onclick="performCertEvaluation(getCurrentRowData('${row.domesticSku}'))">重新认证评估</a>`);
    }
    
    // 分配服务商按钮
    buttons.push(`<a href="javascript:void(0)" class="action-btn assign-btn" onclick="performAssignProvider('${row.domesticSku}')">分配服务商</a>`);
    
    // 详情按钮
    buttons.push(`<a href="javascript:void(0)" class="action-btn detail-btn" onclick="viewProductDetail('${row.domesticSku}')">详情</a>`);
    
    // 删除按钮
    buttons.push(`<a href="javascript:void(0)" class="action-btn delete-btn" onclick="deleteProduct('${row.domesticSku}')">删除</a>`);
    
    // 将按钮分成两行，每行最多3个按钮
    const firstRow = buttons.slice(0, 3);
    const secondRow = buttons.slice(3);
    
    let html = '<div class="action-buttons">';
    if (firstRow.length > 0) {
        html += '<div class="action-row">' + firstRow.join('') + '</div>';
    }
    if (secondRow.length > 0) {
        html += '<div class="action-row">' + secondRow.join('') + '</div>';
    }
    html += '</div>';
    
    return html;
}

// 渲染表格数据
function renderTableData(response) {
    const tableBody = document.getElementById('table-body');
    const headers = countryTableHeaders[currentCountry] || countryTableHeaders.china;
    
    if (!response.data || response.data.length === 0) {
        // 显示空数据状态
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="${headers.length}" class="empty-message">
                    <div class="empty-content">
                        <div class="empty-icon">📦</div>
                        <div class="empty-text">暂无数据</div>
                        <div class="empty-desc">请调整查询条件后重新搜索</div>
                    </div>
                </td>
            </tr>
        `;
        
        // 更新统计信息
        totalRecords = 0;
        totalPages = 1;
        currentPage = 1;
        return;
    }
    
    // 渲染数据行
    let bodyHtml = '';
    response.data.forEach(row => {
        bodyHtml += '<tr>';
        headers.forEach(header => {
            let classes = [];
            let cellContent = row[header.key] || '';
            
            if (header.fixed) {
                classes.push('fixed-column');
                if (header.checkbox) {
                    classes.push('checkbox-column');
                } else if (header.fixed === 'left') {
                    classes.push('sku-column');
                } else if (header.fixed === 'right') {
                    classes.push('action-column');
                }
            }
            if (header.numeric) {
                classes.push('numeric');
            }
            
            // 特殊处理某些列的显示
            if (header.checkbox) {
                cellContent = `<input type="checkbox" class="row-checkbox" value="${row.domesticSku}">`;
            } else if (header.key === 'actions') {
                cellContent = generateActionButtons(row);
            } else if (header.key === 'isControlled') {
                cellContent = cellContent === '是' ?
                    '<span class="control-status control-yes">是</span>' :
                    '<span class="control-status control-no">否</span>';
            } else if (header.key === 'hasOrder') {
                // 处理"是否产生订单"字段的中文显示
                if (cellContent === '是') {
                    cellContent = '<span class="order-status order-yes">是</span>';
                } else if (cellContent === '否') {
                    cellContent = '<span class="order-status order-no">否</span>';
                } else {
                    cellContent = '<span class="order-status order-unknown">-</span>';
                }
            } else if (header.key.includes('Status')) {
                cellContent = `<span class="status-badge status-${cellContent}">${getStatusText(cellContent)}</span>`;
            }
            
            bodyHtml += `<td class="${classes.join(' ')}">${cellContent}</td>`;
        });
        bodyHtml += '</tr>';
    });
    
    tableBody.innerHTML = bodyHtml;
    
    // 更新统计信息
    totalRecords = response.total;
    totalPages = Math.ceil(totalRecords / pageSize);
    currentPage = response.page;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        // 关务评估状态
        'pending-submit': '待提交',
        'pending-confirm': '待确认',
        'confirmed': '已确认',
        
        // 认证评估状态
        'pending': '待提交',
        'submitted': '已提交',
        
        // 商品评估状态
        'active': '已生效',
        'inactive': '未生效',
        
        // 其他状态
        'processing': '处理中',
        'rejected': '已拒绝'
    };
    return statusMap[status] || status;
}

// 商品评估状态联动逻辑
function updateProductStatus(row) {
    const customsStatus = row.customsStatus;
    const certStatus = row.certStatus;
    
    // 商品评估状态联动规则：所有国家都需要关务评估状态为已确认 且 认证评估状态为已提交
    if (customsStatus === 'confirmed' && certStatus === 'submitted') {
        return 'active'; // 已生效
    }
    
    return 'inactive'; // 未生效
}

// 检查是否可以进行商品评估状态更新
function canUpdateProductStatus(customsStatus, certStatus, country) {
    // 所有国家都需要关务评估状态为已确认 且 认证评估状态为已提交
    return customsStatus === 'confirmed' && certStatus === 'submitted';
}

// 状态流转操作函数
function performCustomsEvaluation(row) {
    console.log('执行关务评估操作，商品SKU:', row.domesticSku);
    
    if (row.customsStatus === 'pending-submit') {
        // 初次关务评估：待提交 -> 待确认
        row.customsStatus = 'pending-confirm';
        console.log('关务评估已提交，状态变更为待确认');
    } else if (row.customsStatus === 'confirmed') {
        // 重新关务评估：已确认 -> 已确认（需要填写调整原因）
        const reason = prompt('请填写调整原因：');
        if (reason && reason.trim()) {
            row.adjustmentReason = reason.trim();
            // 直接触发商品评估状态生效
            row.productStatus = updateProductStatus(row);
            console.log('重新关务评估完成，商品评估状态已更新');
        } else {
            console.log('未填写调整原因，操作取消');
            return;
        }
    }
    
    // 重新渲染当前数据
    switchCountryTab(currentCountry);
}

function performCustomsConfirmation(row) {
    console.log('执行关务确认操作，商品SKU:', row.domesticSku);
    
    if (row.customsStatus === 'pending-confirm') {
        // 关务确认：待确认 -> 已确认
        row.customsStatus = 'confirmed';
        
        // 更新商品评估状态
        row.productStatus = updateProductStatus(row);
        
        console.log('关务确认完成，商品评估状态已更新');
        
        // 重新渲染当前数据
        switchCountryTab(currentCountry);
    }
}

function performCertEvaluation(row) {
    console.log('执行认证评估操作，商品SKU:', row.domesticSku);
    
    if (row.certStatus === 'pending-submit') {
        // 初次认证评估：待提交 -> 已提交
        row.certStatus = 'submitted';
        console.log('认证评估已提交');
    } else if (row.certStatus === 'submitted') {
        // 重新认证评估：需要填写调整原因
        const reason = prompt('请填写调整原因：');
        if (reason && reason.trim()) {
            row.adjustmentReason = reason.trim();
            console.log('重新认证评估完成');
        } else {
            console.log('未填写调整原因，操作取消');
            return;
        }
    }
    
    // 更新商品评估状态
    row.productStatus = updateProductStatus(row);
    
    // 重新渲染当前数据
    switchCountryTab(currentCountry);
}

// 获取指定SKU的行数据
function getCurrentRowData(domesticSku) {
    const currentData = window.staticMockData[currentCountry];
    return currentData.find(row => row.domesticSku === domesticSku);
}

// 国家TAB切换功能
// 切换国家TAB - 简化版本使用静态数据
function switchCountryTab(country) {
    console.log('switchCountryTab called with country:', country);
    currentCountry = country;
    console.log('currentCountry updated to:', currentCountry);
    setActiveCountryTab(country);
    
    // 更新表格头部
    const tableHeader = document.getElementById('table-header');
    if (tableHeader) {
        const headers = countryTableHeaders[currentCountry] || countryTableHeaders.china;
        
        let headerHtml = '<tr>';
        headers.forEach(header => {
            let classes = [];
            if (header.fixed) {
                classes.push('fixed-column');
                if (header.checkbox) {
                    classes.push('checkbox-column');
                } else if (header.fixed === 'left') {
                    classes.push('sku-column');
                } else if (header.fixed === 'right') {
                    classes.push('action-column');
                }
            }
            if (header.numeric) {
                classes.push('numeric');
            }
            
            // 特殊处理复选框列
            if (header.checkbox) {
                headerHtml += `<th class="${classes.join(' ')}">
                    <input type="checkbox" id="select-all" onchange="toggleSelectAll(this)">
                </th>`;
            } else {
                headerHtml += `<th class="${classes.join(' ')}">${header.title}</th>`;
            }
        });
        headerHtml += '</tr>';
        
        tableHeader.innerHTML = headerHtml;
    }
    
    // 直接获取静态数据并渲染
    let data = window.staticMockData[country] || [];
    
    // 根据查询条件过滤数据
    if (searchParams && Object.keys(searchParams).length > 0) {
        data = data.filter(item => {
            for (let key in searchParams) {
                if (searchParams[key] && searchParams[key] !== '') {
                    const itemValue = String(item[key] || '').toLowerCase();
                    const searchValue = String(searchParams[key]).toLowerCase();
                    if (!itemValue.includes(searchValue)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    
    // 根据状态TAB过滤数据
    if (currentStatus !== 'all') {
        data = data.filter(item => {
            switch (currentStatus) {
                case 'pending-submit':
                    return item.customsStatus === 'pending-submit';
                case 'pending-confirm':
                    return item.customsStatus === 'pending-confirm';
                case 'confirmed':
                    return item.customsStatus === 'confirmed';
                case 'cert-pending':
                    return item.certStatus === 'pending-submit';
                case 'element-pending':
                    return item.hasOrder === '是' && item.elementStatus === 'pending';
                default:
                    return true;
            }
        });
    }
    
    const total = data.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = data.slice(startIndex, endIndex);
    
    const mockData = {
        data: pageData,
        total: total,
        page: currentPage,
        pageSize: pageSize
    };
    
    renderTableData(mockData);
    updatePagination();
}

// 根据搜索参数过滤数据
function filterDataBySearchParams(data, params) {
    if (!params || Object.keys(params).length === 0) {
        return data;
    }
    
    return data.filter(item => {
        for (let key in params) {
            if (params[key] && item[key]) {
                if (item[key].toString().toLowerCase().indexOf(params[key].toLowerCase()) === -1) {
                    return false;
                }
            }
        }
        return true;
    });
}

// 根据状态过滤数据
function filterDataByStatus(data, status) {
    if (!status || status === 'all') {
        return data;
    }
    
    return data.filter(item => {
        if (status === 'pending') {
            return item.status === '待审核' || item.status === 'Pending Review';
        } else if (status === 'approved') {
            return item.status === '已通过' || item.status === 'Approved';
        } else if (status === 'rejected') {
            return item.status === '已拒绝' || item.status === 'Rejected';
        }
        return true;
    });
}

// 设置活跃国家TAB
function setActiveCountryTab(country) {
    const countryTabs = document.querySelectorAll('.tab-btn');
    countryTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-country') === country) {
            tab.classList.add('active');
        }
    });
}

// Select placeholder功能
function initSelectPlaceholders() {
    const selects = document.querySelectorAll('select[data-placeholder]');
    
    selects.forEach(select => {
        const placeholder = select.getAttribute('data-placeholder');
        
        // 确保select没有选中任何值
        select.value = '';
        
        // 设置placeholder样式和文本显示
        function updatePlaceholderDisplay() {
            if (select.value === '') {
                // 显示placeholder样式
                select.style.color = '#999';
                select.setAttribute('data-showing-placeholder', 'true');
            } else {
                // 显示正常选中值样式
                select.style.color = '#333';
                select.removeAttribute('data-showing-placeholder');
            }
        }
        
        // 监听变化事件
        select.addEventListener('change', updatePlaceholderDisplay);
        select.addEventListener('focus', function() {
            if (this.value === '') {
                this.style.color = '#666'; // 焦点时稍微深一点的颜色
            }
        });
        select.addEventListener('blur', updatePlaceholderDisplay);
        
        // 初始化显示
        updatePlaceholderDisplay();
        
        // 添加CSS类用于样式控制
        select.classList.add('select-with-placeholder');
    });
}


// 更新多选组件选项（保留未勾选的枚举项）
function updateMultiSelectOptions(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container || !container.classList.contains('multi-select-container')) return;
    
    const dropdown = container.querySelector('.multi-select-dropdown');
    if (!dropdown) return;
    
    // 获取当前所有选项的完整列表
    const component = container.multiSelectInstance;
    let allOptions = [];
    
    // 定义默认的完整选项列表
    const defaultOptions = {
        'customs-status': [
            {value: 'pending-submit', text: '待提交'},
            {value: 'pending-confirm', text: '待确认'},
            {value: 'confirmed', text: '已确认'}
        ],
        'cert-status': [
            {value: 'pending-submit', text: '待提交'},
            {value: 'submitted', text: '已提交'}
        ],
        'has-order': [
            {value: 'yes', text: '是'},
            {value: 'no', text: '否'}
        ],
        'element-status': [
            {value: 'pending-edit', text: '待编辑'},
            {value: 'pending-confirm', text: '待确认'},
            {value: 'confirmed', text: '已确认'}
        ]
    };
    
    // 使用默认选项或从DOM获取
    if (defaultOptions[containerId]) {
        allOptions = [...defaultOptions[containerId]];
    } else if (component && component.options) {
        allOptions = [...component.options];
    } else {
        // 从当前DOM获取
        const currentOptions = dropdown.querySelectorAll('.multi-select-option');
        currentOptions.forEach(optionEl => {
            const textEl = optionEl.querySelector('.multi-select-option-text');
            if (textEl && optionEl.dataset.value) {
                allOptions.push({
                    value: optionEl.dataset.value,
                    text: textEl.textContent
                });
            }
        });
    }
    
    // 清空现有选项
    dropdown.innerHTML = '';
    
    // 添加所有选项（包括未勾选的）
    allOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'multi-select-option';
        optionDiv.dataset.value = option.value;
        
        // 检查是否应该被自动勾选
        const shouldBeChecked = options.some(targetOption => targetOption.value === option.value);
        
        optionDiv.innerHTML = `
            <div class="multi-select-checkbox ${shouldBeChecked ? 'checked' : ''}"></div>
            <span class="multi-select-option-text">${option.text}</span>
        `;
        dropdown.appendChild(optionDiv);
    });
    
    // 重新绑定事件
    if (component) {
        component.bindEvents();
        // 更新显示
        component.updateDisplay();
    }
}


// 触发状态TAB联动逻辑
function triggerStatusTabLinkage(status) {
    console.log('触发状态TAB联动逻辑，状态:', status);
    
    // 清除所有查询条件的选中状态
    clearAllSelections();
    
    // 显示所有查询条件组件（重置状态）
    showAllQueryComponents();
    
    // 根据状态设置对应的查询条件和隐藏不相关组件
    switch(status) {
        case 'customs-pending':
            // 关务评估TAB：隐藏认证状态、要素状态、是否产生订单、首次产生订单时间
            hideQueryComponents(['cert-status-group', 'element-status-group', 'has-order-group', 'first-order-time-group']);
            console.log('设置关务状态:', ['pending-submit', 'pending-confirm']);
            // 使用延迟确保DOM准备就绪
            setTimeout(() => {
                setMultiSelectValues('customs-status', ['pending-submit', 'pending-confirm']);
            }, 300);
            break;
            
        case 'cert-pending':
            // 认证评估TAB：隐藏关务状态、要素状态、是否产生订单、服务商、首次产生订单时间
            hideQueryComponents(['customs-status-group', 'element-status-group', 'has-order-group', 'service-provider-group', 'first-order-time-group']);
            console.log('设置认证状态:', ['pending-submit']);
            setTimeout(() => {
                setMultiSelectValues('cert-status', ['pending-submit']);
            }, 300);
            break;
            
        case 'element-pending':
            // 要素确认TAB：隐藏数据来源、服务商、要素状态、创建人ERP、创建时间、评估截止时间、关务状态、认证状态
            hideQueryComponents([
                'data-source',
                'service-provider-group',
                'element-status-group',
                'creator-erp-group',
                'create-time-group',
                'evaluation-deadline-group',
                'customs-status-group',
                'cert-status-group'
            ]);
            console.log('设置是否产生订单:', ['yes']);
            setTimeout(() => {
                setMultiSelectValues('has-order', ['yes']);
            }, 300);
            break;
            
        default:
            // 全部状态，显示所有查询条件，清除所有选择
            console.log('全部状态，显示所有查询条件');
            break;
    }
}

// 静态模拟数据 - 使用data-simplified.js生成
// 注意：data-simplified.js会在window对象上导出staticMockData和tableColumns


// 模拟数据 - 不同国家的表头配置
const countryTableHeaders = window.tableColumns || {};

// 初始化页面
function initializePage() {
    console.log('关务商品管理页面初始化中...');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化表格
    initializeTable();
    
    // 初始化多选组件
    initMultiSelectComponents();
    
    // 绑定展开/收起按钮事件
    bindToggleEvents();
    
    // 绑定查询表单事件
    bindSearchFormEvents();
    
    // 绑定分页事件
    bindPaginationEvents();
    
    // 初始化状态TAB联动
    handleStatusTabChange();
    
    // 更新状态徽标
    updateStatusBadges();
    
    console.log('关务商品管理页面初始化完成');
}

// 更新状态徽标
function updateStatusBadges() {
    // 这里应该从API获取实际的统计数据
    const badges = {
        'all': 150,
        'customs-pending': 45,
        'cert-pending': 32,
        'element-pending': 28
    };
    
    Object.keys(badges).forEach(status => {
        const badge = document.querySelector(`[data-status="${status}"] .badge`);
        if (badge) {
            badge.textContent = badges[status];
        }
    });
}

// 绑定事件监听器
function bindEventListeners() {
    // 国家TAB点击事件
    const countryTabs = document.querySelectorAll('.tab-btn');
    countryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            switchCountryTab(country);
        });
    });
}

// 绑定展开/收起按钮事件
function bindToggleEvents() {
    const toggleBtn = document.getElementById('search-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSearchForm);
    }
}

// 查询功能
function searchProducts() {
    // 收集查询参数
    searchParams = {};
    
    const formElements = document.querySelectorAll('.search-form input, .search-form select');
    formElements.forEach(element => {
        if (element.value && element.value !== '') {
            searchParams[element.name || element.id] = element.value;
        }
    });
    
    console.log('查询参数:', searchParams);
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新加载数据
    switchCountryTab(currentCountry);
}

// 重置查询
function resetSearch() {
    // 清空所有表单字段
    const formElements = document.querySelectorAll('.search-form input, .search-form select');
    formElements.forEach(element => {
        element.value = '';
        if (element.tagName === 'SELECT') {
            element.style.color = '#999';
        }
    });
    
    // 清空查询参数
    searchParams = {};
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新加载数据
    switchCountryTab(currentCountry);
}

// 绑定查询表单事件
function bindSearchFormEvents() {
    // 查询按钮
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchProducts);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSearch);
    }
}

// 分页函数定义
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        switchCountryTab(currentCountry);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        switchCountryTab(currentCountry);
    }
}

function jumpToPage() {
    const pageInput = document.getElementById('page-input');
    const page = parseInt(pageInput.value);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        switchCountryTab(currentCountry);
    } else {
        alert(`请输入1-${totalPages}之间的页码`);
        pageInput.value = currentPage;
    }
}

// 绑定分页事件
function bindPaginationEvents() {
    // 上一页按钮
    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    
    // 下一页按钮
    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
    // 跳转按钮
    const jumpBtn = document.getElementById('jump-page');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', jumpToPage);
    }
    
    // 页码输入框回车事件
    const pageInput = document.getElementById('page-input');
    if (pageInput) {
        pageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                jumpToPage();
            }
        });
    }
}

// 切换状态TAB
function switchStatusTab(status) {
    console.log('switchStatusTab called with status:', status);
    currentStatus = status;
    setActiveStatusTab(status);
    
    // 触发状态TAB联动逻辑（统一处理所有联动功能）
    triggerStatusTabLinkage(status);
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新加载数据
    switchCountryTab(currentCountry);
}

// 设置活跃状态TAB
function setActiveStatusTab(status) {
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    statusTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-status') === status) {
            tab.classList.add('active');
        }
    });
}

// 控制要素状态组件的显示/隐藏
function toggleElementStatusComponent(status) {
    const elementStatusGroup = document.getElementById('element-status-group');
    if (elementStatusGroup) {
        if (status === 'element-pending' || status === 'all') {
            elementStatusGroup.style.display = 'block';
        } else {
            elementStatusGroup.style.display = 'none';
        }
    }
}

// 控制查询条件组的显示/隐藏
function toggleSearchConditionGroups(status) {
    // 需要隐藏的查询条件组：数据来源、创建人ERP、创建时间
    const groupsToHide = ['data-source', 'creator-erp', 'create-time-start'];
    
    groupsToHide.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            if (status === 'element-pending') {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        }
    });
}

// 控制表格列的显示/隐藏
function toggleTableColumns(status) {
    // 需要隐藏的列：数据来源、创建人、创建时间
    const columnsToHide = ['dataSource', 'creator', 'createTime'];
    
    if (status === 'element-pending') {
        hideTableColumns(columnsToHide);
    } else {
        showTableColumns(columnsToHide);
    }
}

// 隐藏表格列
function hideTableColumns(columnKeys) {
    const headers = countryTableHeaders[currentCountry] || countryTableHeaders.china;
    
    columnKeys.forEach(key => {
        // 隐藏表头
        const headerIndex = headers.findIndex(h => h.key === key);
        if (headerIndex !== -1) {
            const headerCell = document.querySelector(`#table-header th:nth-child(${headerIndex + 1})`);
            if (headerCell) {
                headerCell.style.display = 'none';
            }
        }
        
        // 隐藏数据列
        const dataCells = document.querySelectorAll(`#table-body td:nth-child(${headerIndex + 1})`);
        dataCells.forEach(cell => {
            cell.style.display = 'none';
        });
    });
}

// 显示表格列
function showTableColumns(columnKeys) {
    const headers = countryTableHeaders[currentCountry] || countryTableHeaders.china;
    
    columnKeys.forEach(key => {
        // 显示表头
        const headerIndex = headers.findIndex(h => h.key === key);
        if (headerIndex !== -1) {
            const headerCell = document.querySelector(`#table-header th:nth-child(${headerIndex + 1})`);
            if (headerCell) {
                headerCell.style.display = '';
            }
        }
        
        // 显示数据列
        const dataCells = document.querySelectorAll(`#table-body td:nth-child(${headerIndex + 1})`);
        dataCells.forEach(cell => {
            cell.style.display = '';
        });
    });
}

// 根据状态设置查询条件
function setSearchParamsByStatus(status) {
    const customsStatusSelect = document.getElementById('customs-status');
    const certStatusSelect = document.getElementById('cert-status');
    const hasOrderSelect = document.getElementById('has-order');
    
    // 清空之前的选择
    if (customsStatusSelect) customsStatusSelect.value = '';
    if (certStatusSelect) certStatusSelect.value = '';
    if (hasOrderSelect) hasOrderSelect.value = '';
    
    // 根据状态设置默认查询条件
    switch(status) {
        case 'customs-pending':
            // 关务未评估：关务评估状态为待提交或待确认
            break;
        case 'cert-pending':
            // 认证未评估：强制性认证评估状态为待提交
            if (certStatusSelect) {
                certStatusSelect.value = 'pending-submit';
            }
            break;
        case 'element-pending':
            // 要素未确认：是否产生订单为是
            if (hasOrderSelect) {
                hasOrderSelect.value = 'yes';
            }
            break;
    }
}

// 初始化表格
function initializeTable() {
    updateTableHeader();
    loadTableData();
}

// 更新表格表头
function updateTableHeader() {
    const tableHeader = document.getElementById('table-header');
    if (!tableHeader) return;
    
    const headers = countryTableHeaders[currentCountry] || countryTableHeaders.china;
    
    let headerHtml = '<tr>';
    headers.forEach(header => {
        let classes = [];
        if (header.fixed) {
            classes.push('fixed-column');
            if (header.checkbox) {
                classes.push('checkbox-column');
            } else if (header.fixed === 'left') {
                classes.push('sku-column');
            } else if (header.fixed === 'right') {
                classes.push('action-column');
            }
        }
        if (header.numeric) {
            classes.push('numeric');
        }
        
        // 特殊处理复选框列
        if (header.checkbox) {
            headerHtml += `<th class="${classes.join(' ')}">
                <input type="checkbox" id="select-all" onchange="toggleSelectAll(this)">
            </th>`;
        } else {
            headerHtml += `<th class="${classes.join(' ')}">${header.title}</th>`;
        }
    });
    headerHtml += '</tr>';
    
    tableHeader.innerHTML = headerHtml;
}

// 加载表格数据
function loadTableData() {
    // 显示加载状态
    showLoadingState();
    
    // 模拟异步加载
    setTimeout(() => {
        switchCountryTab(currentCountry);
    }, 100);
}

// 显示加载状态
function showLoadingState() {
    const tableBody = document.getElementById('table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" class="loading-message">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">数据加载中...</div>
                    </div>
                </td>
            </tr>
        `;
    }
}

// 分页功能
function updatePagination() {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInput = document.getElementById('page-input');
    
    if (pageInfo) {
        const startRecord = (currentPage - 1) * pageSize + 1;
        const endRecord = Math.min(currentPage * pageSize, totalRecords);
        pageInfo.textContent = `第 ${startRecord}-${endRecord} 条，共 ${totalRecords} 条`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    if (pageInput) {
        pageInput.value = currentPage;
        pageInput.setAttribute('max', totalPages);
    }
}

// 操作按钮功能
function exportData() {
    console.log('导出数据');
}

function importProducts() {
    console.log('导入商品');
}

function importCustomsAssessment() {
    console.log('导入关务评估');
}

function customsAssessment() {
    console.log('关务评估');
}

function assignServiceProvider() {
    console.log('分配服务商');
}

function customsConfirm() {
    console.log('关务确认');
}

function certificationAssessment() {
    console.log('认证评估');
}

// 获取当前选中的国家
function getCurrentCountry() {
    return currentCountry || 'china';
}

// 执行分配服务商
function performAssignProvider(domesticSku) {
    console.log('分配服务商:', domesticSku);
}

// 查看商品详情
function viewProductDetail(domesticSku) {
    console.log('查看商品详情:', domesticSku);
}

// 删除商品
function deleteProduct(domesticSku) {
    console.log('删除商品:', domesticSku);
}

// 复选框功能
function toggleSelectAll(checkbox) {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

// 注意：状态TAB联动功能已在handleStatusTabChange()函数中实现
// 该函数使用正确的多选组件逻辑，无需重复实现

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    // 注意：handleStatusTabChange()已在initializePage()中调用，无需重复调用
});
