// 商品要素确认页面JavaScript功能
// 基于customs-product-management.js，专门针对要素确认功能

// 多选下拉框组件功能
class MultiSelectComponent {
    constructor(container) {
        console.log('=== 创建MultiSelectComponent实例 ===');
        console.log('容器ID:', container.id);
        
        this.container = container;
        this.display = container.querySelector('.multi-select-display');
        this.dropdown = container.querySelector('.multi-select-dropdown');
        this.placeholder = container.querySelector('.multi-select-placeholder');
        this.arrow = container.querySelector('.multi-select-arrow');
        this.options = container.querySelectorAll('.multi-select-option');
        this.selectedValues = [];
        
        // 验证必要元素
        console.log('元素检查:');
        console.log('- display:', !!this.display);
        console.log('- dropdown:', !!this.dropdown);
        console.log('- placeholder:', !!this.placeholder);
        console.log('- arrow:', !!this.arrow);
        console.log('- options数量:', this.options.length);
        
        if (!this.display || !this.dropdown) {
            console.error('❌ 缺少必要元素，初始化失败');
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log(`🔧 开始初始化组件: ${this.container.id}`);
        
        // 立即绑定显示区域点击事件
        this.display.onclick = (e) => {
            console.log('🖱️ 点击显示区域');
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        };
        
        // 阻止下拉框内部点击冒泡
        this.dropdown.onclick = (e) => {
            e.stopPropagation();
        };
        
        // 绑定选项点击事件
        this.bindOptionEvents();
        
        // 全局点击关闭下拉框
        const globalClickHandler = (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        };
        
        // 移除可能存在的旧监听器
        document.removeEventListener('click', this.globalClickHandler);
        this.globalClickHandler = globalClickHandler;
        document.addEventListener('click', this.globalClickHandler);
        
        console.log(`✅ 组件 ${this.container.id} 初始化完成`);
    }
    
    toggleDropdown() {
        console.log(`切换下拉框: ${this.container.id}`);
        const isOpen = this.container.classList.contains('open') ||
                      this.dropdown.style.display === 'block' ||
                      getComputedStyle(this.dropdown).display === 'block';
        console.log('当前状态:', isOpen ? '打开' : '关闭');
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    openDropdown() {
        console.log(`📂 打开下拉框: ${this.container.id}`);
        this.dropdown.style.display = 'block';
        if (this.arrow) this.arrow.textContent = '▲';
        this.container.classList.add('open');
        console.log('✅ 下拉框已打开');
    }
    
    closeDropdown() {
        console.log(`📁 关闭下拉框: ${this.container.id}`);
        this.dropdown.style.display = 'none';
        if (this.arrow) this.arrow.textContent = '▼';
        this.container.classList.remove('open');
        console.log('✅ 下拉框已关闭');
    }
    
    toggleOption(option) {
        console.log(`切换选项: ${option.dataset.value}`);
        const checkbox = option.querySelector('.multi-select-checkbox');
        const value = option.dataset.value;
        const textElement = option.querySelector('.multi-select-option-text');
        
        if (!checkbox || !textElement) {
            console.error('选项元素不完整:', { checkbox, textElement });
            return;
        }
        
        const text = textElement.textContent;
        console.log(`选项信息: value=${value}, text=${text}`);
        
        if (checkbox.classList.contains('checked')) {
            // 取消选中
            console.log('取消选中');
            checkbox.classList.remove('checked');
            this.selectedValues = this.selectedValues.filter(item => item.value !== value);
        } else {
            // 选中
            console.log('选中');
            checkbox.classList.add('checked');
            this.selectedValues.push({ value, text });
        }
        
        console.log('当前选中值:', this.selectedValues);
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
    
    // 绑定选项点击事件
    bindOptionEvents() {
        console.log(`🔗 绑定选项事件: ${this.container.id}`);
        
        // 重新获取选项
        this.options = this.container.querySelectorAll('.multi-select-option');
        console.log(`📋 找到选项数量: ${this.options.length}`);
        
        // 为每个选项绑定点击事件
        this.options.forEach((option, index) => {
            const value = option.dataset.value;
            console.log(`🔗 绑定选项 ${index + 1}: ${value}`);
            
            // 使用onclick直接绑定，避免addEventListener的潜在问题
            option.onclick = (e) => {
                console.log(`🖱️ 点击选项: ${value}`);
                e.preventDefault();
                e.stopPropagation();
                this.toggleOption(option);
            };
            
            // 添加鼠标悬停效果
            option.onmouseenter = () => {
                option.style.backgroundColor = '#f5f5f5';
            };
            
            option.onmouseleave = () => {
                if (!option.querySelector('.multi-select-checkbox').classList.contains('checked')) {
                    option.style.backgroundColor = '';
                }
            };
        });
        
        console.log(`✅ 选项事件绑定完成: ${this.container.id}`);
    }
    
    // 获取选中的值
    getSelectedValues() {
        return this.selectedValues.map(item => item.value);
    }
    
    // 获取选中的文本
    getSelectedTexts() {
        return this.selectedValues.map(item => item.text);
    }
    
    // 清空选择
    clearSelection() {
        this.selectedValues = [];
        this.options.forEach(option => {
            const checkbox = option.querySelector('.multi-select-checkbox');
            checkbox.classList.remove('checked');
        });
        this.updateDisplay();
    }
    
    // 设置选中值
    setSelectedValues(values) {
        this.clearSelection();
        values.forEach(value => {
            const option = this.container.querySelector(`[data-value="${value}"]`);
            if (option) {
                this.toggleOption(option);
            }
        });
    }
}

// 全局变量
let multiSelectComponents = {};
let currentEditingProduct = null;
let currentSimpleEditingProduct = null;
let currentCountry = 'china';
let currentPage = 1;
let totalPages = 1;
let totalRecords = 0;
const pageSize = 20;
let currentElementStatus = 'all'; // 当前选择的要素状态

// 海关编码对应的申报要素配置
const hsCodeElementsConfig = {
    'default': [
        { key: 'brandType', name: '品牌类型', type: 'select', required: true, options: ['0-无品牌', '1-境内自主品牌', '2-境内收购品牌', '3-境外品牌(贴牌生产)', '4-境外品牌(其它)'] },
        { key: 'customsBrand', name: '关务品牌', type: 'text', required: true, placeholder: '请输入关务品牌' },
        { key: 'customsModel', name: '关务型号', type: 'text', required: true, placeholder: '请输入关务型号' },
        { key: 'usage', name: '用途', type: 'text', required: true, placeholder: '请输入用途' }
    ],
    '8517120000': [
        { key: 'brandType', name: '品牌类型', type: 'select', required: true, options: ['0-无品牌', '1-境内自主品牌', '2-境内收购品牌', '3-境外品牌(贴牌生产)', '4-境外品牌(其它)'] },
        { key: 'customsBrand', name: '关务品牌', type: 'text', required: true, placeholder: '请输入关务品牌' },
        { key: 'customsModel', name: '关务型号', type: 'text', required: true, placeholder: '请输入关务型号' },
        { key: 'usage', name: '用途', type: 'text', required: true, placeholder: '请输入用途' },
        { key: 'material', name: '材质', type: 'text', required: false, placeholder: '请输入材质' }
    ]
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('商品要素确认页面初始化开始');
    
    // 初始化多选下拉框
    initMultiSelectComponents();
    
    // 初始化搜索功能
    initSearchFunctionality();
    
    // 初始化国家标签
    initCountryTabs();
    
    // 生成默认表头（中国）
    generateTableHeader();
    
    // 加载初始数据 - 默认显示要素确认相关的商品
    loadElementConfirmationData();
    
    // 初始化要素状态TAB
    initElementStatusTabs();
    
    // 更新国家TAB徽标
    updateCountryTabBadges();
    
    // 移除要素状态查询组件逻辑
    removeElementStatusQueryLogic();
    
    console.log('商品要素确认页面初始化完成');
// 初始化菜单导航
    initMenuNavigation();
});

// 初始化多选下拉框组件
function initMultiSelectComponents() {
    console.log('🔧 开始初始化多选下拉框组件');
    
    const containers = document.querySelectorAll('.multi-select-container');
    console.log(`📋 找到 ${containers.length} 个多选下拉框容器`);
    
    containers.forEach((container, index) => {
        console.log(`🔧 初始化第 ${index + 1} 个组件: ${container.id}`);
        try {
            const component = new MultiSelectComponent(container);
            multiSelectComponents[container.id] = component;
            console.log(`✅ 组件 ${container.id} 初始化成功`);
        } catch (error) {
            console.error(`❌ 组件 ${container.id} 初始化失败:`, error);
        }
    });
    
    console.log('✅ 多选下拉框组件初始化完成');
    console.log('📋 已初始化的组件:', Object.keys(multiSelectComponents));
}

// 初始化搜索功能
function initSearchFunctionality() {
    // 搜索条件展开/收起功能 - 与关务商品评估页面保持一致
    const searchToggle = document.getElementById('search-toggle');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSearchForm();
        });
    }
}

// 折叠功能 - 隐藏除基础4个组件外的所有组件，与关务商品评估页面保持一致
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
        toggleText.textContent = '展开';
        toggleIcon.textContent = '▼';
    }
}

// 初始化国家标签
function initCountryTabs() {
    const countryTabs = document.querySelectorAll('.tab-btn');

    countryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有active类
            countryTabs.forEach(t => t.classList.remove('active'));
            // 添加active类到当前点击的标签
            this.classList.add('active');

            // 更新当前国家
            currentCountry = this.dataset.country;
            console.log('切换到国家:', currentCountry);

            // 重新生成表头
            generateTableHeader();
            
            // 重新加载数据
            loadElementConfirmationData();
            
            // 更新模态弹窗标签（如果模态弹窗已打开）
            if (document.getElementById('simple-element-modal') &&
                document.getElementById('simple-element-modal').style.display === 'block') {
                updateSimpleModalLabels();
            }
        });
    });
}

// 注意：generateTableHeader函数已移至文件末尾，使用与关务商品评估页面相同的配置逻辑

// 加载要素确认相关数据
function loadElementConfirmationData() {
    console.log('加载要素确认数据，当前国家:', currentCountry);
    
    // 使用data-simplified.js中的真实数据
    const realData = getRealElementConfirmationData();
    
    // 渲染表格数据
    renderTableData(realData);
    
    // 更新分页信息
    updatePaginationInfo(realData.length);
    
    // 更新国家TAB徽标
    updateCountryTabBadges();
}

// 获取真实的要素确认数据
function getRealElementConfirmationData() {
    // 检查data-simplified.js是否已加载
    if (typeof window.staticMockData === 'undefined' || typeof window.generateColumns === 'undefined') {
        console.error('data-simplified.js未正确加载');
        return [];
    }
    
    // 获取当前国家的数据
    const countryData = window.staticMockData[currentCountry];
    if (!countryData) {
        console.error('未找到国家数据:', currentCountry);
        return [];
    }
    
    // 过滤出需要要素确认的商品
    let elementConfirmationData = countryData.filter(item => {
        return item.elementStatus === 'pending-submit' ||
               item.elementStatus === 'pending-confirm' ||
               item.elementStatus === 'confirmed';
    });
    
    // 根据当前选择的要素状态进行进一步筛选
    if (currentElementStatus !== 'all') {
        elementConfirmationData = elementConfirmationData.filter(item => {
            return item.elementStatus === currentElementStatus;
        });
    }
    
    console.log('要素确认数据 (状态筛选后):', elementConfirmationData);
    console.log('当前要素状态筛选:', currentElementStatus);
    return elementConfirmationData;
}

// 渲染表格数据
function renderTableData(data) {
    const tableBody = document.getElementById('table-body');
    
    // 使用与generateTableHeader函数相同的动态列生成逻辑
    if (typeof window.generateColumns === 'undefined') {
        console.error('data-simplified.js未正确加载，generateColumns函数不存在');
        return;
    }
    
    const isChina = currentCountry === 'china' || currentCountry === 'gam';
    const countryName = currentCountry === 'china' ? '中国' :
                       currentCountry === 'thailand' ? '泰国' :
                       currentCountry === 'vietnam' ? '越南' :
                       currentCountry === 'malaysia' ? '马来' :
                       currentCountry === 'gam' ? 'GAM' :
                       currentCountry === 'indonesia' ? '印尼' :
                       currentCountry === 'hungary' ? '匈牙利' :
                       currentCountry === 'brazil' ? '巴西' : '泰国';
    
    const headers = window.generateColumns(isChina, countryName);
    
    if (!data || data.length === 0) {
        // 计算总列数：直接使用headers数组长度（已包含复选框和操作列）
        const totalColumns = headers.length;
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="${totalColumns}" class="empty-message">
                    <div class="empty-content">
                        <div class="empty-icon">📦</div>
                        <div class="empty-text">暂无数据</div>
                        <div class="empty-desc">请调整查询条件后重新搜索</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    data.forEach((row, index) => {
        html += '<tr>';
        
        // 根据列配置动态渲染所有数据（包括复选框和操作列）
        headers.forEach(column => {
            // 处理复选框列
            if (column.key === 'checkbox') {
                html += `<td data-key="checkbox" class="checkbox-column" style="position: sticky; left: 0; background-color: #fff; z-index: 15; width: 50px; min-width: 50px; max-width: 50px;">
                    <input type="checkbox" class="row-checkbox" data-sku="${row.domesticSku}">
                </td>`;
                return;
            }
            
            // 处理操作列
            if (column.key === 'actions') {
                html += `<td class="action-column" style="position: sticky; right: 0; background-color: #fff; z-index: 15;">
                    ${generateActionButtons(row)}
                </td>`;
                return;
            }
            
            // 处理普通数据列
            const value = getColumnValue(row, column);
            const className = column.className || '';
            let cellStyle = '';
            
            // 设置固定列样式
            if (column.key === 'domesticSku' && column.fixed === 'left') {
                cellStyle = 'style="position: sticky; left: 50px; background-color: #fff; z-index: 15; min-width: 120px;"';
            } else if (column.fixed === 'left') {
                cellStyle = 'style="position: sticky; left: 0; background-color: #fff; z-index: 10;"';
            } else if (column.fixed === 'right') {
                cellStyle = 'style="position: sticky; right: 0; background-color: #fff; z-index: 10;"';
            }
            
            if (column.key === 'domesticSku') {
                html += `<td data-key="domesticSku" class="${className}" ${cellStyle}>
                    <a href="javascript:void(0)" class="sku-link" onclick="viewProductDetail('${row.domesticSku}')">${row.domesticSku}</a>
                </td>`;
            } else if (column.key === 'internationalSku') {
                // 确保国际SKU符合8开头11位数字格式
                let internationalSku = value;
                if (!internationalSku || !/^8\d{10}$/.test(internationalSku)) {
                    // 基于国内SKU生成8开头11位数字的国际SKU
                    const domesticSkuSuffix = (row.domesticSku || '').slice(-6);
                    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                    internationalSku = `8${domesticSkuSuffix}${randomSuffix}`.slice(0, 11);
                    // 确保是11位数字
                    if (internationalSku.length < 11) {
                        internationalSku = internationalSku.padEnd(11, '0');
                    }
                }
                html += `<td data-key="internationalSku" class="${className}" ${cellStyle}>
                    <a href="javascript:void(0)" class="sku-link" onclick="viewInternationalSkuDetail('${internationalSku}')">${internationalSku}</a>
                </td>`;
            } else if (column.key === 'productImage') {
                html += `<td class="${className}" ${cellStyle}>
                    <div class="product-image-placeholder">
                        <div class="image-icon">🔍</div>
                        <div class="image-text">预览</div>
                    </div>
                </td>`;
            } else if (column.key === 'customsStatus' || column.key === 'productStatus' || column.key === 'elementStatus' || column.key === 'certStatus') {
                const statusText = getStatusText(column.key, value);
                html += `<td class="${className}" ${cellStyle}>
                    <span class="status-badge status-${value}">${statusText}</span>
                </td>`;
            } else if (column.key === 'declarationElements') {
                html += `<td class="${className} element-cell" ${cellStyle} title="${value || ''}">${value || '-'}</td>`;
            } else {
                html += `<td class="${className}" ${cellStyle}>${value || '-'}</td>`;
            }
        });
        
        html += '</tr>';
    });
    
    tableBody.innerHTML = html;
}

// 获取列值
function getColumnValue(row, column) {
    const key = column.key;
    
    // 处理特殊的数值格式
    if (key === 'exportTaxRate' || key === 'exportTariffRate') {
        const value = row[key];
        return value ? (typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value) : '-';
    }
    
    return row[key];
}

// 获取状态文本
function getStatusText(statusType, status) {
    switch (statusType) {
        case 'elementStatus':
            return getElementStatusText(status);
        case 'customsStatus':
            return getCustomsStatusText(status);
        case 'productStatus':
            return getProductStatusText(status);
        case 'certStatus':
            return getCertStatusText(status);
        default:
            return status;
    }
}

// 获取要素状态显示文本
function getElementStatusText(status) {
    const statusMap = {
        'submitted': '已提交',
        'pending-submit': '待提交',
        'pending-confirm': '待确认',
        'confirmed': '已确认'
    };
    return statusMap[status] || status;
}

// 获取关务状态显示文本
function getCustomsStatusText(status) {
    const statusMap = {
        'submitted': '已提交',
        'pending-submit': '待提交',
        'pending-confirm': '待确认',
        'confirmed': '已确认'
    };
    return statusMap[status] || status;
}

// 获取商品状态显示文本
function getProductStatusText(status) {
    const statusMap = {
        'inactive': '未生效',
        'active': '已生效'
    };
    return statusMap[status] || status;
}

// 获取强制性认证状态显示文本
function getCertStatusText(status) {
    const statusMap = {
        'pending-submit': '待提交',
        'submitted': '已提交',
        'pending-confirm': '待确认',
        'confirmed': '已确认'
    };
    return statusMap[status] || status;
}

// 生成操作按钮
function generateActionButtons(row) {
    let buttons = '';
    
    // 要素编辑按钮 - 蓝色链接样式
    if (currentCountry === 'china') {
        buttons += `<a href="javascript:void(0)" class="action-link" onclick="performElementEdit('${row.domesticSku}')">要素编辑</a>`;
    } else if (currentCountry === 'gam') {
        // GAM使用特殊的简化版编辑
        buttons += `<a href="javascript:void(0)" class="action-link" onclick="performSimpleElementEdit('${row.domesticSku}')">要素编辑</a>`;
    } else {
        buttons += `<a href="javascript:void(0)" class="action-link" onclick="performSimpleElementEdit('${row.domesticSku}')">要素编辑</a>`;
    }
    
    // 详情按钮 - 蓝色链接样式
    buttons += `<a href="javascript:void(0)" class="action-link" onclick="viewProductDetail('${row.domesticSku}')">详情</a>`;
    
    return buttons;
}

// 执行要素编辑操作
function performElementEdit(domesticSku, isSubsequent = false) {
    console.log('执行要素编辑操作，商品SKU:', domesticSku, '是否后续编辑:', isSubsequent);
    
    // 查找商品数据
    const productData = findProductByDomesticSku(domesticSku);
    if (!productData) {
        showErrorMessage('未找到商品信息');
        return;
    }
    
    if (isSubsequent) {
        // 后续编辑：已确认状态下重新编辑，必须填写调整原因
        const reason = showAdjustmentReasonDialog('要素编辑调整原因');
        if (!reason) {
            return;
        }
        
        // 显示要素编辑对话框，只允许确认提交
        showElementEditDialog(productData, reason, true);
    } else {
        // 初次编辑：待提交或待确认状态
        openElementEditModal(productData, false);
    }
}

// 执行简化版要素编辑（非中国国家用）
function performSimpleElementEdit(domesticSku, isSubsequent = false) {
    console.log(`执行简化版要素编辑: ${domesticSku}, 是否后续编辑: ${isSubsequent}`);
    
    // 查找商品数据
    const productData = findProductByDomesticSku(domesticSku);
    if (!productData) {
        showErrorMessage('未找到商品信息');
        return;
    }
    
    // 设置当前编辑的商品
    currentSimpleEditingProduct = {
        ...productData,
        isSubsequentEdit: isSubsequent
    };
    
    // 填充商品信息到简化版弹窗
    fillSimpleProductInfo(productData);
    
    // 显示弹窗
    document.getElementById('element-edit-modal-simple').style.display = 'flex';
}

// 根据国内SKU查找商品数据
function findProductByDomesticSku(domesticSku) {
    // 生成符合8开头11位数字格式的国际SKU
    const domesticSkuSuffix = domesticSku.slice(-6);
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    let internationalSku = `8${domesticSkuSuffix}${randomSuffix}`.slice(0, 11);
    // 确保是11位数字
    if (internationalSku.length < 11) {
        internationalSku = internationalSku.padEnd(11, '0');
    }
    
    // 这里应该从实际数据源查找，现在返回模拟数据
    return {
        domesticSku: domesticSku,
        internationalSku: internationalSku,
        productName: `测试商品${domesticSku.slice(-2)}`,
        productNameEn: `Test Product ${domesticSku.slice(-2)}`,
        productNameLocal: `Local Product ${domesticSku.slice(-2)}`,
        chinaHscode: '8517120000',
        brand: 'TestBrand',
        model: 'Model123',
        customsBrand: 'TestBrand', // 关务品牌默认与商品品牌相同
        customsModel: 'Model123', // 关务型号默认与商品型号相同
        brandAuth: '按项目授权 (一单一议)',
        brandType: '1',
        buyerErp: `buyer${domesticSku.slice(-3)}`, // 采销ERP
        productImage: null, // 商品主图，可以设置为实际图片URL
        declarationElements: '品牌类型:1|关务品牌:TestBrand|关务型号:Model123|用途:工业用',
        declarationNameCn: '测试申报中文品名',
        declarationNameEn: 'Test Declaration Name',
        elementStatus: 'pending-confirm'
    };
}

// ==================== 编辑报关要素信息弹窗功能 ====================

/**
 * 打开编辑报关要素信息弹窗
 * @param {Object} productData - 商品数据
 * @param {boolean} isSubsequentEdit - 是否是后续编辑
 * @param {string} adjustmentReason - 调整原因
 */
function openElementEditModal(productData, isSubsequentEdit = false, adjustmentReason = null) {
    console.log('打开编辑报关要素信息弹窗:', productData, '后续编辑:', isSubsequentEdit);
    
    // 设置当前编辑的商品
    currentEditingProduct = {
        ...productData,
        isSubsequentEdit: isSubsequentEdit,
        adjustmentReason: adjustmentReason
    };
    
    // 填充商品信息到弹窗
    fillProductInfo(productData);
    
    // 生成必填申报要素字段
    generateRequiredElementFields(productData.chinaHscode || productData.hscode);
    
    // 如果是后续编辑或已有申报要素数据，需要填充现有的申报要素到表单中
    if (productData.declarationElements && productData.declarationElements !== '' && productData.declarationElements !== '-') {
        fillExistingElementData(productData.declarationElements);
    }
    
    // 根据编辑类型调整弹窗按钮
    adjustModalButtons(isSubsequentEdit);
    
    // 初始化申报要素预览
    updateElementPreview();
    
    // 显示弹窗
    const modal = document.getElementById('element-edit-modal');
    modal.style.display = 'flex';
    
    // 绑定输入事件监听器
    bindElementInputEvents();
}

/**
 * 填充现有申报要素数据到表单
 * @param {string} elementString - 申报要素字符串
 */
function fillExistingElementData(elementString) {
    if (!elementString || elementString === '' || elementString === '-') {
        return;
    }
    
    try {
        // 解析申报要素字符串，格式：品牌类型:1|品牌名:Brand|型号:Model|用途:工业用
        const elements = elementString.split('|');
        
        elements.forEach(element => {
            const [key, value] = element.split(':');
            if (key && value) {
                // 根据key找到对应的表单元素并填充值
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                
                // 处理中文key到英文key的映射
                let fieldKey = trimmedKey;
                switch (trimmedKey) {
                    case '品牌类型':
                        fieldKey = 'brandType';
                        break;
                    case '品牌名':
                    case '品牌':
                    case '关务品牌':
                        fieldKey = 'customsBrand';
                        break;
                    case '型号':
                    case '关务型号':
                        fieldKey = 'customsModel';
                        break;
                    case '用途':
                        fieldKey = 'usage';
                        break;
                    case '材质':
                        fieldKey = 'material';
                        break;
                    case '规格':
                        fieldKey = 'specification';
                        break;
                }
                
                // 查找对应的表单元素
                const fieldElement = document.getElementById(`element-${fieldKey}`);
                if (fieldElement) {
                    fieldElement.value = trimmedValue;
                    console.log(`填充申报要素字段: ${fieldKey} = ${trimmedValue}`);
                }
            }
        });
    } catch (error) {
        console.error('解析申报要素字符串失败:', error);
    }
}

/**
 * 关闭编辑报关要素信息弹窗
 */
function closeElementEditModal() {
    const modal = document.getElementById('element-edit-modal');
    modal.style.display = 'none';
    currentEditingProduct = null;
    
    // 清空表单
    clearElementForm();
}

/**
 * 放弃编辑
 */
function abandonElementEdit() {
    closeElementEditModal();
}

/**
 * 保存待确认
 */
function savePendingConfirm() {
    if (!validateElementForm()) {
        return;
    }
    
    console.log('保存待确认');
    
    // 生成申报要素字符串
    const elementString = generateElementString();
    
    // 获取海关编码
    const hscode = document.getElementById('modal-hscode').value.trim();
    
    // 获取申报中文品名
    const declareNameCn = document.getElementById('modal-declare-name').value.trim();
    
    // 获取申报英文品名
    const declareNameEn = document.getElementById('modal-declare-name-en').value.trim();
    
    // 获取品牌授权情况
    const brandAuthSelect = document.getElementById('modal-brand-auth-select');
    const brandAuth = brandAuthSelect ? brandAuthSelect.value.trim() : '';
    
    // 获取备注信息
    const remarks = document.getElementById('element-remarks').value.trim();
    
    // 验证必填字段
    if (!declareNameCn) {
        alert('请填写申报中文品名');
        return;
    }
    
    if (!brandAuth) {
        alert('请选择品牌授权情况');
        return;
    }
    
    // 获取关务品牌和关务型号
    const customsBrand = document.getElementById('modal-customs-brand').value.trim();
    const customsModel = document.getElementById('modal-customs-model').value.trim();
    
    // 验证关务品牌和关务型号必填
    if (!customsBrand) {
        alert('请填写关务品牌');
        return;
    }
    
    if (!customsModel) {
        alert('请填写关务型号');
        return;
    }
    
    // 获取品牌类型
    const brandType = document.getElementById('element-brandType').value;
    
    console.log('保存待确认申报要素:', {
        domesticSku: currentEditingProduct.domesticSku,
        hscode: hscode,
        elementString: elementString,
        declareNameCn: declareNameCn,
        declareNameEn: declareNameEn,
        customsBrand: customsBrand,
        customsModel: customsModel,
        brandType: brandType,
        remarks: remarks
    });
    
    // 更新商品要素状态为待确认，并保存申报要素和申报中文品名
    updateProductElementStatus(currentEditingProduct.domesticSku, 'pending-confirm', {
        hscode: hscode,
        elementString: elementString,
        declareNameCn: declareNameCn,
        declareNameEn: declareNameEn,
        remarks: remarks
    });
    
    showSuccessMessage('已保存为待确认状态！');
    closeElementEditModal();
    refreshCurrentView();
}

/**
 * 验证申报要素表单
 */
function validateElementForm() {
    if (!currentEditingProduct) {
        showErrorMessage('没有找到当前编辑的商品信息');
        return false;
    }
    
    // 验证中国HSCODE
    const hscodeInput = document.getElementById('modal-hscode');
    if (!hscodeInput.value.trim()) {
        hscodeInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写中国HSCODE');
        return false;
    } else {
        hscodeInput.style.borderColor = '#d9d9d9';
    }
    
    // 验证申报中文品名
    const declareNameInput = document.getElementById('modal-declare-name');
    if (!declareNameInput.value.trim()) {
        declareNameInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写申报中文品名');
        return false;
    } else {
        declareNameInput.style.borderColor = '#d9d9d9';
    }
    
    // 验证关务品牌
    const customsBrandInput = document.getElementById('modal-customs-brand');
    if (!customsBrandInput.value.trim()) {
        customsBrandInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写关务品牌');
        return false;
    } else {
        customsBrandInput.style.borderColor = '#d9d9d9';
    }
    
    // 验证关务型号
    const customsModelInput = document.getElementById('modal-customs-model');
    if (!customsModelInput.value.trim()) {
        customsModelInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写关务型号');
        return false;
    } else {
        customsModelInput.style.borderColor = '#d9d9d9';
    }
    
    // 验证必填项
    const requiredFields = document.querySelectorAll('#required-fields input[required], #required-fields select[required]');
    let hasError = false;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4d4f';
            hasError = true;
        } else {
            field.style.borderColor = '#d9d9d9';
        }
    });
    
    if (hasError) {
        showErrorMessage('请填写所有必填项');
        return false;
    }
    
    return true;
}

/**
 * 要素确认
 */
function confirmElement() {
    if (!validateElementForm()) {
        return;
    }
    
    // 检查是否是后续编辑，如果是，需要调整原因
    if (currentEditingProduct && currentEditingProduct.isSubsequentEdit && !currentEditingProduct.adjustmentReason) {
        showErrorMessage('后续编辑必须填写调整原因');
        return;
    }
    
    console.log('要素确认');
    
    // 生成申报要素字符串
    const elementString = generateElementString();
    
    // 获取海关编码
    const hscode = document.getElementById('modal-hscode').value.trim();
    
    // 获取申报中文品名
    const declareNameCn = document.getElementById('modal-declare-name').value.trim();
    
    // 获取申报英文品名
    const declareNameEn = document.getElementById('modal-declare-name-en').value.trim();
    
    // 获取关务品牌和关务型号
    const customsBrand = document.getElementById('modal-customs-brand').value.trim();
    const customsModel = document.getElementById('modal-customs-model').value.trim();
    
    // 获取品牌类型
    const brandType = document.getElementById('element-brandType').value;
    
    console.log('保存申报要素:', {
        domesticSku: currentEditingProduct.domesticSku,
        hscode: hscode,
        elementString: elementString,
        declareNameCn: declareNameCn,
        declareNameEn: declareNameEn,
        customsBrand: customsBrand,
        customsModel: customsModel,
        brandType: brandType,
        isSubsequentEdit: currentEditingProduct.isSubsequentEdit,
        adjustmentReason: currentEditingProduct.adjustmentReason
    });
    
    // 更新商品要素状态为已确认
    updateProductElementStatus(currentEditingProduct.domesticSku, 'confirmed', {
        hscode: hscode,
        elementString: elementString,
        declareNameCn: declareNameCn,
        declareNameEn: declareNameEn
    });
    
    showSuccessMessage('要素确认成功！');
    closeElementEditModal();
    refreshCurrentView();
}

/**
 * 调整弹窗按钮显示
 * @param {boolean} isSubsequentEdit - 是否是后续编辑
 */
function adjustModalButtons(isSubsequentEdit) {
    const abandonBtn = document.querySelector('button[onclick="abandonElementEdit()"]');
    const savePendingBtn = document.querySelector('button[onclick="savePendingConfirm()"]');
    const confirmBtn = document.querySelector('button[onclick="confirmElement()"]');
    
    if (isSubsequentEdit) {
        // 后续编辑：只显示【放弃编辑】和【要素确认】
        if (savePendingBtn) savePendingBtn.style.display = 'none';
        if (confirmBtn) confirmBtn.textContent = '要素确认';
    } else {
        // 初次编辑：显示所有按钮
        if (savePendingBtn) savePendingBtn.style.display = 'inline-block';
        if (confirmBtn) confirmBtn.textContent = '要素确认';
    }
}

/**
 * 填充商品信息到弹窗
 * @param {Object} productData - 商品数据
 */
function fillProductInfo(productData) {
    // 国内SKU显示为蓝色链接样式
    const domesticSkuElement = document.getElementById('modal-domestic-sku');
    domesticSkuElement.textContent = productData.domesticSku || '-';
    domesticSkuElement.className = 'sku-link';
    domesticSkuElement.href = 'javascript:void(0)';
    domesticSkuElement.onclick = function() {
        // 这里可以添加SKU点击跳转逻辑，比如跳转到商品详情页
        console.log('点击SKU链接:', productData.domesticSku);
    };
    
    // 国际SKU显示为蓝色链接样式，生成8开头11位数字格式
    const internationalSkuElement = document.getElementById('modal-international-sku');
    let internationalSku = productData.internationalSku;
    
    // 如果国际SKU不符合8开头11位数字格式，则生成一个
    if (!internationalSku || !/^8\d{10}$/.test(internationalSku)) {
        // 基于国内SKU生成8开头11位数字的国际SKU
        const domesticSkuSuffix = (productData.domesticSku || '').slice(-6);
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        internationalSku = `8${domesticSkuSuffix}${randomSuffix}`.slice(0, 11);
        // 确保是11位数字
        if (internationalSku.length < 11) {
            internationalSku = internationalSku.padEnd(11, '0');
        }
    }
    
    internationalSkuElement.textContent = internationalSku;
    internationalSkuElement.className = 'sku-link';
    internationalSkuElement.href = 'javascript:void(0)';
    internationalSkuElement.onclick = function() {
        // 这里可以添加国际SKU点击跳转逻辑
        console.log('点击国际SKU链接:', internationalSku);
    };
    
    document.getElementById('modal-product-name').textContent = productData.productName || productData.productTitle || '-';
    document.getElementById('modal-hscode').value = productData.chinaHscode || productData.hscode || '';
    
    // 填充商品主图
    const productImage = document.getElementById('modal-product-image');
    const productImagePlaceholder = document.getElementById('modal-product-image-placeholder');
    if (productData.productImage) {
        productImage.src = productData.productImage;
        productImage.style.display = 'block';
        productImagePlaceholder.style.display = 'none';
    } else {
        productImage.style.display = 'none';
        productImagePlaceholder.style.display = 'inline';
    }
    
    // 填充采销ERP
    document.getElementById('modal-buyer-erp').textContent = productData.buyerErp || '-';
    
    // 填充新增字段
    document.getElementById('modal-function').textContent = productData.function || '-';
    document.getElementById('modal-usage').textContent = productData.usage || '-';
    document.getElementById('modal-material').textContent = productData.material || '-';
    document.getElementById('modal-principle').textContent = productData.principle || '-';
    
    // 填充商品品牌和商品型号（只展示）
    document.getElementById('modal-product-brand').textContent = productData.brand || '-';
    document.getElementById('modal-product-model').textContent = productData.model || '-';
    
    // 填充关务品牌和关务型号（可编辑，默认值与商品品牌/型号相同）
    const customsBrandInput = document.getElementById('modal-customs-brand');
    const customsModelInput = document.getElementById('modal-customs-model');
    
    // 设置默认值为商品品牌和型号
    customsBrandInput.value = productData.customsBrand || productData.brand || '';
    customsModelInput.value = productData.customsModel || productData.model || '';
    
    // 为关务品牌和关务型号输入框添加事件监听，同步到申报要素字段
    customsBrandInput.addEventListener('input', function() {
        const elementCustomsBrand = document.getElementById('element-customsBrand');
        if (elementCustomsBrand) {
            elementCustomsBrand.value = this.value;
            updateElementPreview();
        }
    });
    
    customsModelInput.addEventListener('input', function() {
        const elementCustomsModel = document.getElementById('element-customsModel');
        if (elementCustomsModel) {
            elementCustomsModel.value = this.value;
            updateElementPreview();
        }
    });
    
    // 品牌授权显示为蓝色链接样式
    const brandAuthElements = document.querySelectorAll('#modal-brand-auth');
    brandAuthElements.forEach(element => {
        if (element.tagName === 'A') {
            element.textContent = productData.brandAuth || '-';
            element.className = 'sku-link';
            element.href = 'javascript:void(0)';
            element.onclick = function() {
                // 这里可以添加品牌授权点击跳转逻辑，比如查看授权书详情
                console.log('点击品牌授权链接:', productData.brandAuth);
            };
        }
    });
    
    // 申报中文品名设置输入框的值
    const declareNameInput = document.getElementById('modal-declare-name');
    declareNameInput.value = productData.declarationNameCn || '';
    
    // 申报英文品名设置输入框的值
    const declareNameEnInput = document.getElementById('modal-declare-name-en');
    declareNameEnInput.value = productData.declarationNameEn || '';
}

/**
 * 填充简化版商品信息到弹窗
 * @param {Object} productData - 商品数据
 */
function fillSimpleProductInfo(productData) {
    // 国内SKU显示为蓝色链接样式
    const domesticSkuElement = document.getElementById('simple-modal-domestic-sku');
    domesticSkuElement.textContent = productData.domesticSku || '-';
    domesticSkuElement.className = 'sku-link';
    domesticSkuElement.href = 'javascript:void(0)';
    domesticSkuElement.onclick = function() {
        console.log('点击SKU链接:', productData.domesticSku);
    };
    
    // 国际SKU显示为蓝色链接样式，生成8开头11位数字格式
    const internationalSkuElement = document.getElementById('simple-modal-international-sku');
    let internationalSku = productData.internationalSku;
    
    // 如果国际SKU不符合8开头11位数字格式，则生成一个
    if (!internationalSku || !/^8\d{10}$/.test(internationalSku)) {
        // 基于国内SKU生成8开头11位数字的国际SKU
        const domesticSkuSuffix = (productData.domesticSku || '').slice(-6);
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        internationalSku = `8${domesticSkuSuffix}${randomSuffix}`.slice(0, 11);
        // 确保是11位数字
        if (internationalSku.length < 11) {
            internationalSku = internationalSku.padEnd(11, '0');
        }
    }
    
    internationalSkuElement.textContent = internationalSku;
    internationalSkuElement.className = 'sku-link';
    internationalSkuElement.href = 'javascript:void(0)';
    internationalSkuElement.onclick = function() {
        console.log('点击国际SKU链接:', internationalSku);
    };
    
    document.getElementById('simple-modal-product-name').textContent = productData.productName || '-';
    document.getElementById('simple-modal-product-name-en').textContent = productData.productNameEn || '-';
    document.getElementById('simple-modal-product-name-local').textContent = productData.productNameLocal || '-';
    
    // 根据当前国家获取正确的海关编码数据
    let hscodeValue = '-';
    if (currentCountry === 'china') {
        hscodeValue = productData.chinaHscode || '-';
    } else if (currentCountry === 'thailand') {
        hscodeValue = productData.thailandHscode || '-';
    } else if (currentCountry === 'indonesia') {
        hscodeValue = productData.indonesiaHscode || '-';
    } else if (currentCountry === 'hungary') {
        hscodeValue = productData.hungaryHscode || '-';
    } else if (currentCountry === 'brazil') {
        hscodeValue = productData.brazilHscode || '-';
    } else if (currentCountry === 'vietnam') {
        hscodeValue = productData.vietnamHscode || '-';
    } else if (currentCountry === 'malaysia') {
        hscodeValue = productData.malaysiaHscode || '';
    } else if (currentCountry === 'gam') {
        // GAM使用中国海关编码
        hscodeValue = productData.chinaHscode || '';
    }
    // 只有当hscodeValue不是'-'时才设置值
    const hscodeInput = document.getElementById('simple-modal-hscode');
    if (hscodeInput) {
        hscodeInput.value = hscodeValue === '-' ? '' : hscodeValue;
    }
    
    // 填充商品主图
    const simpleProductImage = document.getElementById('simple-modal-product-image');
    const simpleProductImagePlaceholder = document.getElementById('simple-modal-product-image-placeholder');
    if (productData.productImage) {
        simpleProductImage.src = productData.productImage;
        simpleProductImage.style.display = 'block';
        simpleProductImagePlaceholder.style.display = 'none';
    } else {
        simpleProductImage.style.display = 'none';
        simpleProductImagePlaceholder.style.display = 'inline';
    }
    
    // 填充采销ERP
    document.getElementById('simple-modal-buyer-erp').textContent = productData.buyerErp || '-';
    
    document.getElementById('simple-modal-brand').textContent = productData.brand || '-';
    document.getElementById('simple-modal-model').textContent = productData.model || '-';
    
    // 填充关务品牌和关务型号（不可编辑，仅展示）
    document.getElementById('simple-modal-customs-brand-display').textContent = productData.customsBrand || productData.brand || '-';
    document.getElementById('simple-modal-customs-model-display').textContent = productData.customsModel || productData.model || '-';
    
    document.getElementById('simple-modal-brand-auth-display').textContent = productData.brandAuth || '-';
    document.getElementById('simple-modal-brand-type-display').textContent = productData.brandType || '-';
    
    // 填充申报品名
    document.getElementById('simple-modal-declare-name-en').value = productData.declarationNameEn || '';
    document.getElementById('simple-modal-declare-name-local').value = productData.declarationNameLocal || '';
    
    // 动态更新字段标签
    updateSimpleModalLabels();
}

/**
 * 根据当前选择的国家更新简化版模态弹窗的字段标签
 */
function updateSimpleModalLabels() {
    // 获取国家名称映射
    const countryNameMap = {
        'china': '中国',
        'thailand': '泰国',
        'indonesia': '印尼',
        'hungary': '匈牙利',
        'brazil': '巴西',
        'vietnam': '越南',
        'malaysia': '马来',
        'gam': 'GAM'
    };
    
    // 获取海关编码名称映射
    const hscodeNameMap = {
        'china': 'HS Code',
        'thailand': 'HS Code',
        'vietnam': 'HS Code',
        'malaysia': 'HS Code',
        'indonesia': 'HS Code',
        'hungary': 'TARIC Code',
        'brazil': 'NCM Code',
        'gam': '中国海关编码'
    };
    
    const countryName = countryNameMap[currentCountry] || '当地';
    const hscodeName = hscodeNameMap[currentCountry] || 'HS Code';
    
    // GAM特殊处理：隐藏商品小语种名称和申报小语种品名
    const productNameLocalRow = document.getElementById('simple-modal-product-name-local-label')?.closest('.info-item');
    const declareNameLocalRow = document.getElementById('simple-modal-declare-name-local-label')?.closest('.info-item');
    
    if (currentCountry === 'gam') {
        // GAM国家：隐藏商品小语种名称和申报小语种品名
        if (productNameLocalRow) {
            productNameLocalRow.style.display = 'none';
        }
        if (declareNameLocalRow) {
            declareNameLocalRow.style.display = 'none';
        }
        
        // 海关编码设置为不可编辑
        const hscodeInput = document.getElementById('simple-modal-hscode');
        if (hscodeInput) {
            hscodeInput.readOnly = true;
            hscodeInput.style.backgroundColor = '#f5f5f5';
            hscodeInput.style.cursor = 'not-allowed';
        }
    } else {
        // 其他国家：显示这些字段
        if (productNameLocalRow) {
            productNameLocalRow.style.display = '';
        }
        if (declareNameLocalRow) {
            declareNameLocalRow.style.display = '';
        }
        
        // 海关编码设置为可编辑
        const hscodeInput = document.getElementById('simple-modal-hscode');
        if (hscodeInput) {
            hscodeInput.readOnly = false;
            hscodeInput.style.backgroundColor = '';
            hscodeInput.style.cursor = '';
        }
    }
    
    // 更新商品当地语种名称标签
    const productNameLocalLabel = document.getElementById('simple-modal-product-name-local-label');
    if (productNameLocalLabel) {
        productNameLocalLabel.textContent = `商品${countryName}名称：`;
    }
    
    // 更新海关编码标签
    const hscodeLabel = document.getElementById('simple-modal-hscode-label');
    if (hscodeLabel) {
        if (currentCountry === 'gam') {
            hscodeLabel.innerHTML = `${hscodeName}：`;  // GAM不可编辑，去掉必填标识
        } else {
            hscodeLabel.innerHTML = `${hscodeName}：<span class="required" style="color: red;">*</span>`;
        }
    }
    
    // 更新海关编码输入框的placeholder
    const hscodeInput = document.getElementById('simple-modal-hscode');
    if (hscodeInput) {
        if (currentCountry === 'gam') {
            hscodeInput.placeholder = `显示中国海关编码`;
        } else {
            hscodeInput.placeholder = `请输入${hscodeName}`;
        }
    }
    
    // 更新申报当地品名标签
    const declareNameLocalLabel = document.getElementById('simple-modal-declare-name-local-label');
    if (declareNameLocalLabel) {
        declareNameLocalLabel.textContent = `申报${countryName}品名：`;
    }
    
    // 更新申报当地品名输入框的placeholder
    const declareNameLocalInput = document.getElementById('simple-modal-declare-name-local');
    if (declareNameLocalInput) {
        declareNameLocalInput.placeholder = `请输入申报${countryName}品名`;
    }
}

/**
 * 根据HSCODE生成必填申报要素字段
 * @param {string} hscode - 海关编码
 */
function generateRequiredElementFields(hscode) {
    const requiredFieldsContainer = document.getElementById('required-fields');
    requiredFieldsContainer.innerHTML = '';
    
    // 获取对应的字段配置
    const config = hsCodeElementsConfig[hscode] || hsCodeElementsConfig['default'];
    
    config.forEach(field => {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        
        const label = document.createElement('label');
        label.textContent = `${field.name}：`;
        label.setAttribute('for', `element-${field.key}`);
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.id = `element-${field.key}`;
            
            // 添加默认选项
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '请选择...';
            input.appendChild(defaultOption);
            
            // 添加选项
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
            
            // 如果是品牌类型字段，根据商品信息智能设置默认值
            if (field.key === 'brandType') {
                // 在1-境内自主品牌和4-境外品牌(其它)之间随机默认选择一个
                const randomBrandTypes = ['1-境内自主品牌', '4-境外品牌(其它)'];
                let defaultBrandType = randomBrandTypes[Math.floor(Math.random() * randomBrandTypes.length)];
                
                // 如果商品信息中有明确的品牌类型，则使用该值
                if (currentEditingProduct && currentEditingProduct.brandType !== undefined) {
                    const brandTypeValue = currentEditingProduct.brandType.toString();
                    const matchingOption = field.options.find(option => option.startsWith(brandTypeValue + '-'));
                    if (matchingOption) {
                        defaultBrandType = matchingOption;
                    }
                } else {
                    // 根据品牌信息判断：如果是中文品牌或者为空，默认为境内自主品牌；如果是英文品牌，默认为境外品牌
                    const brand = currentEditingProduct ? (currentEditingProduct.brand || '') : '';
                    const hasChineseChars = /[\u4e00-\u9fa5]/.test(brand);
                    const hasOnlyEnglish = /^[a-zA-Z\s]*$/.test(brand) && brand.trim() !== '';
                    
                    if (hasOnlyEnglish && !hasChineseChars) {
                        defaultBrandType = '4-境外品牌(其它)';
                    } else {
                        defaultBrandType = '1-境内自主品牌';
                    }
                }
                
                input.value = defaultBrandType;
            }
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.id = `element-${field.key}`;
            input.placeholder = field.placeholder || `请输入${field.name}`;
            
            // 如果是关务品牌或关务型号字段，从弹窗中的输入框获取默认值
            if (field.key === 'customsBrand') {
                const customsBrandInput = document.getElementById('modal-customs-brand');
                if (customsBrandInput) {
                    input.value = customsBrandInput.value || '';
                    // 添加事件监听，同步到弹窗输入框
                    input.addEventListener('input', function() {
                        customsBrandInput.value = this.value;
                    });
                }
            } else if (field.key === 'customsModel') {
                const customsModelInput = document.getElementById('modal-customs-model');
                if (customsModelInput) {
                    input.value = customsModelInput.value || '';
                    // 添加事件监听，同步到弹窗输入框
                    input.addEventListener('input', function() {
                        customsModelInput.value = this.value;
                    });
                }
            }
        }
        
        // 检查是否为必填字段或材质字段
        const isRequired = field.required || field.key === 'material' || field.name === '材质';
        if (isRequired) {
            input.setAttribute('required', 'required');
            label.innerHTML += '<span style="color: red;">*</span>';
        }
        
        fieldGroup.appendChild(label);
        fieldGroup.appendChild(input);
        requiredFieldsContainer.appendChild(fieldGroup);
    });
}

/**
 * 绑定申报要素输入事件
 */
function bindElementInputEvents() {
    // 绑定所有输入框的change和input事件
    const modal = document.getElementById('element-edit-modal');
    const inputs = modal.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', updateElementPreview);
        input.addEventListener('change', updateElementPreview);
    });
}

/**
 * 更新申报要素预览
 */
function updateElementPreview() {
    const elementString = generateElementString();
    const previewElement = document.getElementById('element-preview');
    if (previewElement) {
        previewElement.textContent = elementString || '请填写申报要素信息';
    }
}

/**
 * 生成申报要素字符串
 */
function generateElementString() {
    const modal = document.getElementById('element-edit-modal');
    const elements = [];
    
    // 获取必填项
    const requiredInputs = modal.querySelectorAll('#required-fields input, #required-fields select');
    requiredInputs.forEach(input => {
        if (input.value.trim()) {
            const fieldKey = input.id.replace('element-', '');
            let fieldName = fieldKey;
            
            // 映射字段名
            switch (fieldKey) {
                case 'brandType':
                    fieldName = '品牌类型';
                    break;
                case 'customsBrand':
                    fieldName = '关务品牌';
                    break;
                case 'customsModel':
                    fieldName = '关务型号';
                    break;
                case 'usage':
                    fieldName = '用途';
                    break;
                case 'material':
                    fieldName = '材质';
                    break;
                case 'specification':
                    fieldName = '规格';
                    break;
            }
            
            elements.push(`${fieldName}:${input.value.trim()}`);
        }
    });
    
    // 获取非必填项
    const optionalInputs = modal.querySelectorAll('.optional-elements input');
    optionalInputs.forEach(input => {
        if (input.value.trim()) {
            const fieldKey = input.id.replace('element-', '');
            let fieldName = fieldKey.toUpperCase();
            elements.push(`${fieldName}:${input.value.trim()}`);
        }
    });
    
    return elements.join('|');
}

/**
 * 清空申报要素表单
 */
function clearElementForm() {
    const modal = document.getElementById('element-edit-modal');
    const inputs = modal.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'textarea') {
            input.value = '';
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
        input.style.borderColor = '#d9d9d9';
    });
    
    // 清空关务品牌和关务型号输入框
    const customsBrandInput = document.getElementById('modal-customs-brand');
    const customsModelInput = document.getElementById('modal-customs-model');
    if (customsBrandInput) customsBrandInput.value = '';
    if (customsModelInput) customsModelInput.value = '';
    
    // 清空申报英文品名输入框
    const declareNameEnInput = document.getElementById('modal-declare-name-en');
    if (declareNameEnInput) declareNameEnInput.value = '';
    
    // 清空预览
    const previewElement = document.getElementById('element-preview');
    if (previewElement) {
        previewElement.textContent = '请填写申报要素信息';
    }
}

// ==================== 简化版要素编辑弹窗功能 ====================

/**
 * 关闭简化版要素编辑弹窗
 */
function closeSimpleElementEditModal() {
    document.getElementById('element-edit-modal-simple').style.display = 'none';
    currentSimpleEditingProduct = null;
}

/**
 * 放弃简化版要素编辑
 */
function abandonSimpleElementEdit() {
    closeSimpleElementEditModal();
}

/**
 * 保存简化版待确认
 */
function saveSimplePendingConfirm() {
    const declareNameEn = document.getElementById('simple-modal-declare-name-en').value.trim();
    const declareNameLocal = document.getElementById('simple-modal-declare-name-local').value.trim();
    const hscode = document.getElementById('simple-modal-hscode').value.trim();
    
    // GAM国家不需要验证海关编码（不可编辑），其他国家需要验证
    if (currentCountry !== 'gam' && !hscode) {
        showErrorMessage('请填写海关编码');
        return;
    }
    
    // 验证申报英文品名必填
    if (!declareNameEn) {
        showErrorMessage('请填写申报英文品名');
        return;
    }
    
    // 获取关务品牌和关务型号的显示值（不可编辑）
    const customsBrand = document.getElementById('simple-modal-customs-brand-display').textContent;
    const customsModel = document.getElementById('simple-modal-customs-model-display').textContent;
    
    console.log('保存简化版待确认:', {
        domesticSku: currentSimpleEditingProduct.domesticSku,
        hscode: hscode,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal,
        customsBrand: customsBrand,
        customsModel: customsModel
    });
    
    updateProductElementStatus(currentSimpleEditingProduct.domesticSku, 'pending-confirm', {
        hscode: hscode,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal,
        customsBrand: customsBrand,
        customsModel: customsModel
    });
    
    showSuccessMessage('已保存为待确认状态！');
    closeSimpleElementEditModal();
    refreshCurrentView();
}

/**
 * 确认简化版要素
 */
function confirmSimpleElement() {
    const declareNameEn = document.getElementById('simple-modal-declare-name-en').value.trim();
    const declareNameLocal = document.getElementById('simple-modal-declare-name-local').value.trim();
    const hscode = document.getElementById('simple-modal-hscode').value.trim();
    
    // 获取备注信息
    const remarks = document.getElementById('simple-element-remarks').value.trim();
    
    // GAM国家不需要验证海关编码（不可编辑），其他国家需要验证
    if (currentCountry !== 'gam' && !hscode) {
        showErrorMessage('请填写海关编码');
        return;
    }
    
    // 验证申报英文品名必填
    if (!declareNameEn) {
        showErrorMessage('请填写申报英文品名');
        return;
    }
    
    // 获取关务品牌和关务型号的显示值（不可编辑）
    const customsBrand = document.getElementById('simple-modal-customs-brand-display').textContent;
    const customsModel = document.getElementById('simple-modal-customs-model-display').textContent;
    
    console.log('确认简化版要素:', {
        domesticSku: currentSimpleEditingProduct.domesticSku,
        hscode: hscode,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal,
        customsBrand: customsBrand,
        customsModel: customsModel,
        remarks: remarks
    });
    
    updateProductElementStatus(currentSimpleEditingProduct.domesticSku, 'confirmed', {
        hscode: hscode,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal,
        customsBrand: customsBrand,
        customsModel: customsModel,
        remarks: remarks
    });
    
    showSuccessMessage('要素确认成功！');
    closeSimpleElementEditModal();
    refreshCurrentView();
}

// ==================== 通用功能函数 ====================

/**
 * 更新商品要素状态
 */
function updateProductElementStatus(domesticSku, status, data) {
    console.log('更新商品要素状态:', domesticSku, status, data);
    // 这里应该调用API更新数据
    // 现在只是模拟更新
}

/**
 * 刷新当前视图
 */
function refreshCurrentView() {
    loadElementConfirmationData();
}

/**
 * 显示成功消息
 */
function showSuccessMessage(message) {
    alert('✅ ' + message);
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    alert('❌ ' + message);
}

/**
 * 显示调整原因对话框
 */
function showAdjustmentReasonDialog(title) {
    const reason = prompt(title + '：\n请输入调整原因');
    return reason && reason.trim() ? reason.trim() : null;
}

/**
 * 查看商品详情
 */
function viewProductDetail(domesticSku) {
    console.log('查看商品详情:', domesticSku);
    // 这里可以实现跳转到商品详情页的逻辑
}

/**
 * 查看国际SKU详情
 */
function viewInternationalSkuDetail(internationalSku) {
    console.log('查看国际SKU详情:', internationalSku);
    // 这里可以实现跳转到国际SKU详情页的逻辑
}

/**
 * 更新分页信息
 */
function updatePaginationInfo(dataLength) {
    totalRecords = dataLength;
    totalPages = Math.ceil(totalRecords / pageSize);
    
    document.getElementById('page-info').textContent = `第${currentPage}页，共${totalPages}页`;
    document.getElementById('total-records').textContent = totalRecords;
    
    // 更新按钮状态
    document.getElementById('prev-btn').disabled = currentPage <= 1;
    document.getElementById('next-btn').disabled = currentPage >= totalPages;
}

// ==================== 搜索和操作功能 ====================

/**
 * 搜索商品
 */
function searchProducts() {
    console.log('执行搜索');
    
    // 获取搜索条件
    const searchParams = {
        domesticSku: document.getElementById('domestic-sku').value.trim(),
        internationalSku: document.getElementById('international-sku').value.trim(),
        hscode: document.getElementById('hscode').value.trim(),
        productTitle: document.getElementById('product-title').value.trim(),
        dataSource: multiSelectComponents['data-source-select']?.getSelectedValues() || [],
        serviceProvider: multiSelectComponents['service-provider']?.getSelectedValues() || [],
        elementStatus: multiSelectComponents['element-status']?.getSelectedValues() || [],
        creatorErp: document.getElementById('creator-erp-input').value.trim(),
        createTimeStart: document.getElementById('create-time-start-input').value,
        createTimeEnd: document.getElementById('create-time-end-input').value,
        updaterErp: document.getElementById('updater-erp').value.trim(),
        updateTimeStart: document.getElementById('update-time-start').value,
        updateTimeEnd: document.getElementById('update-time-end').value
    };
    
    console.log('搜索参数:', searchParams);
    
    // 重新加载数据
    loadElementConfirmationData();
}

/**
 * 重置搜索条件
 */
function resetSearch() {
    console.log('重置搜索条件');
    
    // 清空输入框
    document.getElementById('domestic-sku').value = '';
    document.getElementById('international-sku').value = '';
    document.getElementById('hscode').value = '';
    document.getElementById('product-title').value = '';
    document.getElementById('creator-erp-input').value = '';
    document.getElementById('create-time-start-input').value = '';
    document.getElementById('create-time-end-input').value = '';
    document.getElementById('updater-erp').value = '';
    document.getElementById('update-time-start').value = '';
    document.getElementById('update-time-end').value = '';
    
    // 清空多选下拉框
    Object.values(multiSelectComponents).forEach(component => {
        if (component && typeof component.clearSelection === 'function') {
            component.clearSelection();
        }
    });
    
    // 重新加载数据
    loadElementConfirmationData();
}

/**
 * 导出数据
 */
function exportData() {
    console.log('导出数据');
    showSuccessMessage('导出功能开发中...');
}

/**
 * 导入商品
 */
function importProducts() {
    console.log('导入商品');
    showSuccessMessage('导入功能开发中...');
}

/**
 * 批量要素编辑
 */
function batchElementEdit() {
    const selectedSkus = getSelectedSkus();
    if (selectedSkus.length === 0) {
        showErrorMessage('请先选择要编辑的商品');
        return;
    }
    
    console.log('批量要素编辑:', selectedSkus);
    showSuccessMessage('批量要素编辑功能开发中...');
}

/**
 * 批量要素确认
 */
function batchElementConfirm() {
    const selectedSkus = getSelectedSkus();
    if (selectedSkus.length === 0) {
        showErrorMessage('请先选择要确认的商品');
        return;
    }
    
    console.log('批量要素确认:', selectedSkus);
    showSuccessMessage('批量要素确认功能开发中...');
}

/**
 * 获取选中的SKU列表
 */
function getSelectedSkus() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.sku);
}

/**
 * 全选/取消全选
 */
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// ==================== 分页功能 ====================

/**
 * 上一页
 */
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadElementConfirmationData();
    }
}

/**
 * 下一页
 */
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadElementConfirmationData();
    }
}

/**
 * 跳转到指定页
 */
function jumpToPage() {
    const pageInput = document.getElementById('page-input');
    const targetPage = parseInt(pageInput.value);
    
    if (targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        loadElementConfirmationData();
    } else {
        showErrorMessage(`请输入1-${totalPages}之间的页码`);
        pageInput.value = currentPage;
    }
}

// 生成表头
function generateTableHeader() {
    console.log('生成表头，当前国家:', currentCountry);
    
    // 检查data-simplified.js是否已加载
    if (typeof window.generateColumns === 'undefined') {
        console.error('data-simplified.js未正确加载，generateColumns函数不存在');
        return;
    }
    
    const tableHeader = document.querySelector('#product-table thead tr');
    if (!tableHeader) {
        console.error('找不到表头元素');
        return;
    }
    
    // 使用与关务商品评估页面完全相同的动态列生成逻辑
    const isChina = currentCountry === 'china' || currentCountry === 'gam';
    const countryName = currentCountry === 'china' ? '中国' :
                       currentCountry === 'thailand' ? '泰国' :
                       currentCountry === 'vietnam' ? '越南' :
                       currentCountry === 'malaysia' ? '马来' :
                       currentCountry === 'gam' ? 'GAM' :
                       currentCountry === 'indonesia' ? '印尼' :
                       currentCountry === 'hungary' ? '匈牙利' :
                       currentCountry === 'brazil' ? '巴西' : '泰国';
    
    const headers = window.generateColumns(isChina, countryName);
    
    // 清空现有表头
    tableHeader.innerHTML = '';
    
    // 直接使用headers数组生成表头，因为它已经包含了所有列（包括复选框和操作列）
    headers.forEach(column => {
        const th = document.createElement('th');
        
        // 处理复选框列
        if (column.checkbox) {
            th.innerHTML = '<input type="checkbox" id="select-all" onchange="toggleSelectAll(this)">';
        } else {
            th.textContent = column.title;
        }
        
        th.setAttribute('data-key', column.key);
        
        // 设置固定列样式
        if (column.fixed === 'left') {
            if (column.key === 'checkbox') {
                th.style.position = 'sticky';
                th.style.left = '0';
                th.style.top = '0';
                th.style.backgroundColor = '#f8f9fa';
                th.style.zIndex = '25';
                th.style.width = '50px';
                th.style.minWidth = '50px';
                th.style.maxWidth = '50px';
            } else if (column.key === 'domesticSku') {
                th.style.position = 'sticky';
                th.style.left = '50px';
                th.style.top = '0';
                th.style.backgroundColor = '#f8f9fa';
                th.style.zIndex = '25';
                th.style.minWidth = '120px';
            } else {
                th.style.position = 'sticky';
                th.style.left = '0';
                th.style.top = '0';
                th.style.backgroundColor = '#f8f9fa';
                th.style.zIndex = '20';
            }
        } else if (column.fixed === 'right') {
            th.style.position = 'sticky';
            th.style.right = '0';
            th.style.top = '0';
            th.style.backgroundColor = '#f8f9fa';
            th.style.zIndex = '20';
        }
        
        if (column.width) {
            th.style.width = column.width + 'px';
        }
        
        tableHeader.appendChild(th);
    });
    
    console.log('表头生成完成，列数:', headers.length);
}
// 初始化要素状态TAB
function initElementStatusTabs() {
    const statusTabs = document.querySelectorAll('.status-tab-btn');
    
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有active类
            statusTabs.forEach(t => t.classList.remove('active'));
            // 添加active类到当前点击的tab
            this.classList.add('active');
            
            // 更新当前状态
            currentElementStatus = this.getAttribute('data-status');
            
            // 重新加载数据
            currentPage = 1;
            loadElementConfirmationData();
            
            console.log('切换要素状态TAB:', currentElementStatus);
        });
    });
    
    // 更新TAB数字徽标
    updateElementStatusBadges();
}

// 更新要素状态TAB的数字徽标
function updateElementStatusBadges() {
    if (!window.staticMockData || !window.staticMockData.products) {
        return;
    }
    
    const products = window.staticMockData.products;
    const statusCounts = {
        all: products.length,
        'pending-submit': 0,
        'pending-confirm': 0,
        'confirmed': 0
    };
    
    // 统计各状态数量
    products.forEach(product => {
        const status = product.elementStatus || 'pending-submit';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });
    
    // 更新徽标显示
    Object.keys(statusCounts).forEach(status => {
        const tab = document.querySelector(`[data-status="${status}"]`);
        if (tab) {
            const badge = tab.querySelector('.badge');
            if (badge) {
                badge.textContent = statusCounts[status].toLocaleString();
            }
        }
    });
}

// 移除要素状态查询组件的相关逻辑
function removeElementStatusQueryLogic() {
    // 从多选组件中移除要素状态组件
    if (multiSelectComponents['element-status']) {
        delete multiSelectComponents['element-status'];
        console.log('已移除要素状态查询组件逻辑');
    }
}
// 初始化菜单导航功能
function initMenuNavigation() {
    // 初始化菜单展开/收起功能
    const menuTitles = document.querySelectorAll('.menu-title');
    
    menuTitles.forEach(title => {
        title.addEventListener('click', function() {
            const menuItem = this.parentElement;
            const submenu = menuItem.querySelector('.submenu');
            
            if (submenu) {
                // 所有一级菜单点击后都展开所有二级菜单
                submenu.classList.add('open');
                this.classList.add('active');
                
                // 为所有二级菜单项添加点击事件
                const submenuItems = submenu.querySelectorAll('.submenu-item');
                submenuItems.forEach(item => {
                    if (!item.hasAttribute('data-nav-initialized')) {
                        item.setAttribute('data-nav-initialized', 'true');
                        item.addEventListener('click', function(e) {
                            e.stopPropagation(); // 阻止事件冒泡
                            
                            // 移除同级菜单项的active状态
                            submenuItems.forEach(sibling => sibling.classList.remove('active'));
                            // 激活当前菜单项
                            this.classList.add('active');
                        });
                    }
                });
            }
        });
    });
    
    console.log('菜单导航功能初始化完成');
}

// 更新国家TAB的数字徽标
function updateCountryTabBadges() {
    if (!window.staticMockData) {
        console.log('staticMockData未加载，无法更新国家TAB徽标');
        return;
    }
    
    // 国家列表
    const countries = ['china', 'thailand', 'indonesia', 'hungary', 'brazil', 'vietnam', 'malaysia', 'gam'];
    
    countries.forEach(country => {
        const countryData = window.staticMockData[country];
        if (countryData) {
            // 过滤出需要要素确认的商品（待提交、待确认、已确认状态）
            const elementConfirmationData = countryData.filter(item => {
                return item.elementStatus === 'pending-submit' ||
                       item.elementStatus === 'pending-confirm' ||
                       item.elementStatus === 'confirmed';
            });
            
            // 通过data-country属性找到对应的TAB按钮和徽标
            const tabBtn = document.querySelector(`[data-country="${country}"]`);
            if (tabBtn) {
                const badge = tabBtn.querySelector('.badge');
                if (badge) {
                    badge.textContent = elementConfirmationData.length.toLocaleString();
                }
            }
        }
    });
    
    console.log('国家TAB徽标更新完成');
}