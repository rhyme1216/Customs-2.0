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
        // 更准确的状态检查：检查容器是否有open类或下拉框是否可见
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
    console.log('开始初始化多选组件...');
    
    // 等待一小段时间确保DOM完全加载
    setTimeout(() => {
        const containers = document.querySelectorAll('.multi-select-container');
        console.log('找到多选容器数量:', containers.length);
        
        containers.forEach((container, index) => {
            console.log(`初始化容器 ${index + 1}:`, container.id);
            
            // 检查容器是否已经初始化过
            if (container.multiSelectInstance) {
                console.log(`容器 ${container.id} 已经初始化过，跳过`);
                return;
            }
            
            try {
                // 创建实例并保存到容器元素上
                container.multiSelectInstance = new MultiSelectComponent(container);
                console.log(`✓ 容器 ${container.id} 初始化成功`);
            } catch (error) {
                console.error(`✗ 容器 ${container.id} 初始化失败:`, error);
            }
        });
        
        console.log('多选组件初始化完成');
    }, 100);
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
        toggleText.textContent = '展开';
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
    console.log(`设置多选下拉框 ${selectId} 的默认值:`, values);
    const container = document.getElementById(selectId);
    console.log(`找到容器:`, container);
    if (container && container.classList.contains('multi-select-container')) {
        console.log(`容器有效，开始设置默认值，用户仍可点击修改`);
        
        // 如果有MultiSelectComponent实例，直接使用实例的方法
        if (container.multiSelectInstance) {
            console.log('使用MultiSelectComponent实例设置值');
            container.multiSelectInstance.setValues(values);
            return;
        }
        
        // 如果没有实例，则手动操作DOM（兼容性处理）
        console.log('手动操作DOM设置值');
        
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
    }
}




// 生成操作按钮 - 重新设计的业务逻辑
function generateActionButtons(row) {
    const buttons = [];
    
    // 获取当前状态
    const customsStatus = row.customsStatus;
    const certStatus = row.certStatus;
    const productStatus = row.productStatus;
    const elementStatus = row.elementStatus;
    const isChina = currentCountry === 'china';
    
    console.log(`生成操作按钮 - SKU: ${row.domesticSku}, 关务状态: ${customsStatus}, 认证状态: ${certStatus}, 商品状态: ${productStatus}, 要素状态: ${elementStatus}, 是否中国: ${isChina}`);
    
    // 1. 关务评估按钮逻辑
    if (customsStatus === 'pending-submit') {
        // 初始状态：显示关务评估按钮
        buttons.push(`<a href="javascript:void(0)" class="action-btn customs-btn" onclick="performCustomsEvaluation('${row.domesticSku}')">关务评估</a>`);
    } else if (customsStatus === 'confirmed') {
        // 已确认状态：可以重新评估（后续评估，需要调整原因）
        buttons.push(`<a href="javascript:void(0)" class="action-btn customs-btn secondary" onclick="performCustomsEvaluation('${row.domesticSku}', true)">关务评估</a>`);
    }
    
    // 2. 关务确认按钮逻辑
    if (customsStatus === 'pending-confirm') {
        // 待确认状态：显示关务确认按钮
        buttons.push(`<a href="javascript:void(0)" class="action-btn confirm-btn" onclick="performCustomsConfirmation('${row.domesticSku}')">关务确认</a>`);
    }
    
    // 3. 认证评估按钮逻辑（中国TAB不显示认证评估）
    if (!isChina) {
        if (certStatus === 'pending-submit') {
            // 初始状态：显示认证评估按钮
            buttons.push(`<a href="javascript:void(0)" class="action-btn cert-btn" onclick="performCertEvaluation('${row.domesticSku}')">认证评估</a>`);
        } else if (certStatus === 'submitted') {
            // 已提交状态：可以重新评估（后续评估，需要调整原因）
            buttons.push(`<a href="javascript:void(0)" class="action-btn cert-btn secondary" onclick="performCertEvaluation('${row.domesticSku}', true)">认证评估</a>`);
        } else if (certStatus === 'confirmed') {
            // 已确认状态：可以重新评估（后续评估，需要调整原因）
            buttons.push(`<a href="javascript:void(0)" class="action-btn cert-btn secondary" onclick="performCertEvaluation('${row.domesticSku}', true)">认证评估</a>`);
        }
    }
    
    // 4. 要素编辑按钮逻辑
    if (isChina) {
        // 中国TAB：显示完整版编辑要素功能
        if (elementStatus === 'pending-submit' || elementStatus === 'pending-confirm') {
            // 待提交或待确认状态：显示编辑要素按钮
            buttons.push(`<a href="javascript:void(0)" class="action-btn element-btn" onclick="performElementEdit('${row.domesticSku}')">编辑要素</a>`);
        } else if (elementStatus === 'confirmed') {
            // 已确认状态：可以重新编辑（后续编辑，需要调整原因）
            buttons.push(`<a href="javascript:void(0)" class="action-btn element-btn secondary" onclick="performElementEdit('${row.domesticSku}', true)">编辑要素</a>`);
        }
    } else {
        // 非中国TAB：显示简化版编辑要素功能
        if (elementStatus === 'pending-submit' || elementStatus === 'pending-confirm') {
            // 待提交或待确认状态：显示编辑要素按钮
            buttons.push(`<a href="javascript:void(0)" class="action-btn element-btn" onclick="performSimpleElementEdit('${row.domesticSku}')">编辑要素</a>`);
        } else if (elementStatus === 'confirmed') {
            // 已确认状态：可以重新编辑（后续编辑，需要调整原因）
            buttons.push(`<a href="javascript:void(0)" class="action-btn element-btn secondary" onclick="performSimpleElementEdit('${row.domesticSku}', true)">编辑要素</a>`);
        }
    }
    
    // 5. 分配服务商按钮（始终显示）
    buttons.push(`<a href="javascript:void(0)" class="action-btn assign-btn" onclick="performAssignProvider('${row.domesticSku}')">分配服务商</a>`);
    
    // 6. 详情按钮（始终显示）
    buttons.push(`<a href="javascript:void(0)" class="action-btn detail-btn" onclick="viewProductDetail('${row.domesticSku}')">详情</a>`);
    
    // 7. 删除按钮（始终显示）
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
    
    console.log(`生成的按钮HTML:`, html);
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
            
            // 为商品英文名称和当地语种名称列添加特殊样式类
            if (header.key === 'productNameEn') {
                classes.push('product-name-en');
            } else if (header.key === 'productNameLocal') {
                classes.push('product-name-local');
            }
            
            // 特殊处理某些列的显示
            if (header.checkbox) {
                cellContent = `<input type="checkbox" class="row-checkbox" value="${row.domesticSku}">`;
            } else if (header.key === 'domesticSku') {
                // 国内SKU显示为蓝色链接样式
                cellContent = `<a href="javascript:void(0)" class="sku-link" onclick="viewProductDetail('${row.domesticSku}')">${cellContent}</a>`;

            } else if (header.key === 'productImage') {
                // 图片列显示预览占位符
                cellContent = `<div class="product-image-placeholder">
                    <div class="image-icon">🔍</div>
                    <div class="image-text">预览</div>
                </div>`;
            } else if (header.key === 'actions') {
                cellContent = generateActionButtons(row);
            } else if (header.key === 'isControlled') {
                cellContent = cellContent === '是' ?
                    '<span class="control-status control-yes">是</span>' :
                    '<span class="control-status control-no">否</span>';
            } else if (header.key === 'isMandatoryCert') {
                cellContent = cellContent === '是' ?
                    '<span class="cert-status cert-yes">是</span>' :
                    '<span class="cert-status cert-no">否</span>';
            } else if (header.key === 'hasOrder') {
                // 处理"是否产生订单"字段的中文显示
                if (cellContent === '是') {
                    cellContent = '<span class="order-status order-yes">是</span>';
                } else if (cellContent === '否') {
                    cellContent = '<span class="order-status order-no">否</span>';
                } else {
                    cellContent = '<span class="order-status order-unknown">-</span>';
                }
            } else if (header.key === 'declarationElements') {
                // 申报要素：要素状态为已确认或待确认时才显示
                if ((row.elementStatus === 'confirmed' || row.elementStatus === 'pending-confirm') && cellContent && cellContent !== '-') {
                    cellContent = `<span class="declaration-elements">${cellContent}</span>`;
                } else {
                    cellContent = '-';
                }
            } else if (header.key === 'declarationNameCn') {
                // 申报中文品名：要素状态为已确认或待确认时才显示
                if ((row.elementStatus === 'confirmed' || row.elementStatus === 'pending-confirm') && cellContent && cellContent !== '-') {
                    cellContent = `<span class="declaration-name">${cellContent}</span>`;
                } else {
                    cellContent = '-';
                }
            } else if (header.key === 'declarationNameEn') {
                // 申报英文品名：要素状态为已确认或待确认时才显示
                if ((row.elementStatus === 'confirmed' || row.elementStatus === 'pending-confirm') && cellContent && cellContent !== '-') {
                    cellContent = `<span class="declaration-name">${cellContent}</span>`;
                } else {
                    cellContent = '-';
                }
            } else if (header.key === 'declarationNameLocal') {
                // 申报当地品名：要素状态为已确认或待确认时才显示
                if ((row.elementStatus === 'confirmed' || row.elementStatus === 'pending-confirm') && cellContent && cellContent !== '-') {
                    cellContent = `<span class="declaration-name">${cellContent}</span>`;
                } else {
                    cellContent = '-';
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

// 商品评估状态联动逻辑 - 重新设计
function updateProductStatusAutomatically(row) {
    const customsStatus = row.customsStatus;
    const certStatus = row.certStatus;
    const isChina = currentCountry === 'china';
    
    console.log(`更新商品评估状态 - 关务状态: ${customsStatus}, 认证状态: ${certStatus}, 是否中国: ${isChina}`);
    
    let newProductStatus = 'inactive'; // 默认未生效
    
    if (isChina) {
        // 中国TAB：只需要关务评估状态为已确认
        if (customsStatus === 'confirmed') {
            newProductStatus = 'active'; // 已生效
        }
    } else {
        // 其他国家：需要关务评估状态为已确认 且 认证评估状态为已提交
        if (customsStatus === 'confirmed' && certStatus === 'submitted') {
            newProductStatus = 'active'; // 已生效
        }
    }
    
    // 更新商品评估状态
    const oldStatus = row.productStatus;
    row.productStatus = newProductStatus;
    
    if (oldStatus !== newProductStatus) {
        console.log(`商品评估状态已更新: ${oldStatus} -> ${newProductStatus}`);
        row.statusUpdateTime = new Date().toLocaleString();
    }
    
    return newProductStatus;
}

// 检查是否可以进行商品评估状态更新
function canUpdateProductStatus(customsStatus, certStatus, country) {
    if (country === 'china') {
        // 中国TAB：只需要关务评估状态为已确认
        return customsStatus === 'confirmed';
    } else {
        // 其他国家：需要关务评估状态为已确认 且 认证评估状态为已提交
        return customsStatus === 'confirmed' && certStatus === 'submitted';
    }
}

// 显示调整原因输入对话框
function showAdjustmentReasonDialog(title) {
    const reason = prompt(`${title}\n\n请填写调整原因（必填）：`);
    
    if (!reason || !reason.trim()) {
        return null; // 用户取消或未填写
    }
    
    return reason.trim();
}

// 显示要素编辑对话框
function showElementEditDialog(row, adjustmentReason, isSubsequentEdit) {
    console.log('显示要素编辑对话框', {
        sku: row.domesticSku,
        adjustmentReason,
        isSubsequentEdit
    });
    
    // 设置当前编辑状态
    currentEditingProduct = row;
    currentEditingProduct.isSubsequentEdit = isSubsequentEdit;
    currentEditingProduct.adjustmentReason = adjustmentReason;
    
    // 使用新的弹窗模式
    openElementEditModal(row, isSubsequentEdit, adjustmentReason);
}

// 刷新当前视图
function refreshCurrentView() {
    switchCountryTab(currentCountry);
}

// 显示成功消息
function showSuccessMessage(message) {
    // 简单的成功提示，可以后续改为更美观的提示框
    alert('✅ ' + message);
}

// 显示错误消息
function showErrorMessage(message) {
    // 简单的错误提示，可以后续改为更美观的提示框
    alert('❌ ' + message);
}

// 状态流转操作函数 - 重新设计的业务逻辑

// 1. 关务评估操作
function performCustomsEvaluation(domesticSku, isSubsequent = false) {
    console.log('执行关务评估操作，商品SKU:', domesticSku, '是否后续评估:', isSubsequent);
    
    const row = getCurrentRowData(domesticSku);
    if (!row) {
        console.error('未找到商品数据:', domesticSku);
        return;
    }
    
    if (isSubsequent) {
        // 后续评估：已确认状态下重新评估，必须填写调整原因
        const reason = showAdjustmentReasonDialog('关务评估调整原因');
        if (!reason) {
            console.log('未填写调整原因，操作取消');
            return;
        }
        
        // 记录调整原因
        row.adjustmentReason = reason;
        row.adjustmentTime = new Date().toLocaleString();
        
        // 直接触发商品评估状态生效（无需关务确认）
        updateProductStatusAutomatically(row);
        
        console.log('后续关务评估完成，商品评估状态已更新');
        showSuccessMessage('关务评估完成，商品评估状态已更新');
    } else {
        // 初次评估：待提交 -> 待确认
        if (row.customsStatus === 'pending-submit') {
            row.customsStatus = 'pending-confirm';
            console.log('关务评估已提交，状态变更为待确认');
            showSuccessMessage('关务评估已提交，等待确认');
        }
    }
    
    // 重新渲染当前数据
    refreshCurrentView();
}

// 2. 关务确认操作
function performCustomsConfirmation(domesticSku) {
    console.log('执行关务确认操作，商品SKU:', domesticSku);
    
    const row = getCurrentRowData(domesticSku);
    if (!row) {
        console.error('未找到商品数据:', domesticSku);
        return;
    }
    
    if (row.customsStatus === 'pending-confirm') {
        // 关务确认：待确认 -> 已确认
        row.customsStatus = 'confirmed';
        
        // 更新商品评估状态
        updateProductStatusAutomatically(row);
        
        console.log('关务确认完成，商品评估状态已更新');
        showSuccessMessage('关务确认完成');
        
        // 重新渲染当前数据
        refreshCurrentView();
    }
}

// 3. 认证评估操作
function performCertEvaluation(domesticSku, isSubsequent = false) {
    console.log('执行认证评估操作，商品SKU:', domesticSku, '是否后续评估:', isSubsequent);
    
    const row = getCurrentRowData(domesticSku);
    if (!row) {
        console.error('未找到商品数据:', domesticSku);
        return;
    }
    
    // 中国TAB不应该有认证评估
    if (currentCountry === 'china') {
        console.warn('中国TAB不支持认证评估');
        showErrorMessage('中国TAB不支持认证评估');
        return;
    }
    
    if (isSubsequent) {
        // 后续评估：已提交状态下重新评估，必须填写调整原因
        const reason = showAdjustmentReasonDialog('认证评估调整原因');
        if (!reason) {
            console.log('未填写调整原因，操作取消');
            return;
        }
        
        // 记录调整原因
        row.adjustmentReason = reason;
        row.adjustmentTime = new Date().toLocaleString();
        
        // 直接触发商品评估状态生效
        updateProductStatusAutomatically(row);
        
        console.log('后续认证评估完成，商品评估状态已更新');
        showSuccessMessage('认证评估完成，商品评估状态已更新');
    } else {
        // 初次评估：待提交 -> 已提交
        if (row.certStatus === 'pending-submit') {
            row.certStatus = 'submitted';
            
            // 更新商品评估状态
            updateProductStatusAutomatically(row);
            
            console.log('认证评估已提交');
            showSuccessMessage('认证评估已提交');
        }
    }
    
    // 重新渲染当前数据
    refreshCurrentView();
}

// 4. 要素编辑操作
function performElementEdit(domesticSku, isSubsequent = false) {
    console.log('执行要素编辑操作，商品SKU:', domesticSku, '是否后续编辑:', isSubsequent);
    
    const row = getCurrentRowData(domesticSku);
    if (!row) {
        console.error('未找到商品数据:', domesticSku);
        return;
    }
    
    if (isSubsequent) {
        // 后续编辑：已确认状态下重新编辑，必须填写调整原因
        const reason = showAdjustmentReasonDialog('要素编辑调整原因');
        if (!reason) {
            console.log('未填写调整原因，操作取消');
            return;
        }
        
        // 显示要素编辑对话框，只允许确认提交
        showElementEditDialog(row, reason, true);
    } else {
        // 初次编辑或待确认状态下的编辑
        showElementEditDialog(row, null, false);
    }
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
            
            // 为商品英文名称和当地语种名称列添加特殊样式类
            if (header.key === 'productNameEn') {
                classes.push('product-name-en');
            } else if (header.key === 'productNameLocal') {
                classes.push('product-name-local');
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
            {value: 'pending-submit', text: '待提交'},
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
            console.log('设置关务状态默认值（用户可修改）:', ['pending-submit', 'pending-confirm']);
            // 使用延迟确保DOM准备就绪，并重新绑定事件
            setTimeout(() => {
                setMultiSelectValues('customs-status', ['pending-submit', 'pending-confirm']);
                // 确保事件绑定正常
                ensureMultiSelectEvents();
            }, 300);
            break;
            
        case 'cert-pending':
            // 认证评估TAB：隐藏关务状态、要素状态、是否产生订单、服务商、首次产生订单时间
            hideQueryComponents(['customs-status-group', 'element-status-group', 'has-order-group', 'service-provider-group', 'first-order-time-group']);
            console.log('设置认证状态默认值（用户可修改）:', ['pending-submit']);
            setTimeout(() => {
                setMultiSelectValues('cert-status', ['pending-submit']);
                // 确保事件绑定正常
                ensureMultiSelectEvents();
            }, 300);
            break;
            
        case 'element-pending':
            // 要素确认TAB：隐藏数据来源、服务商、创建人ERP、创建时间、评估截止时间、关务状态、认证状态
            // 注意：要素状态组件需要显示，因为要自动勾选
            hideQueryComponents([
                'data-source',
                'service-provider-group',
                'creator-erp-group',
                'create-time-group',
                'evaluation-deadline-group',
                'customs-status-group',
                'cert-status-group'
            ]);
            console.log('设置是否产生订单默认值（用户可修改）:', ['yes']);
            console.log('设置要素状态默认值（用户可修改）:', ['pending-submit', 'pending-confirm']);
            setTimeout(() => {
                setMultiSelectValues('has-order', ['yes']);
                // 自动勾选要素状态：待提交和待确认，但用户仍可修改
                setMultiSelectValues('element-status', ['pending-submit', 'pending-confirm']);
                // 确保事件绑定正常
                ensureMultiSelectEvents();
            }, 300);
            break;
            
        default:
            // 全部状态，显示所有查询条件，清除所有选择
            console.log('全部状态，显示所有查询条件');
            // 确保事件绑定正常
            setTimeout(() => {
                ensureMultiSelectEvents();
            }, 100);
            break;
    }
}

// 确保多选组件事件绑定正常
function ensureMultiSelectEvents() {
    console.log('🔧 强制确保多选组件事件绑定正常');
    const containers = document.querySelectorAll('.multi-select-container');
    
    containers.forEach(container => {
        console.log(`检查容器: ${container.id}`);
        
        // 强制重新初始化
        if (container.multiSelectInstance) {
            console.log(`重新绑定事件: ${container.id}`);
            container.multiSelectInstance.bindEvents();
            container.multiSelectInstance.bindOptionEvents();
        } else {
            // 如果实例不存在，重新创建
            console.log(`重新创建实例: ${container.id}`);
            try {
                container.multiSelectInstance = new MultiSelectComponent(container);
            } catch (error) {
                console.error(`重新创建实例失败: ${container.id}`, error);
            }
        }
    });
    
    // 额外的强制事件绑定 - 直接绑定到DOM元素
    setTimeout(() => {
        console.log('🔧 强制绑定点击事件到DOM元素');
        const options = document.querySelectorAll('.multi-select-option');
        options.forEach(option => {
            const container = option.closest('.multi-select-container');
            if (container && container.multiSelectInstance) {
                // 强制绑定点击事件
                option.onclick = (e) => {
                    console.log(`🖱️ 强制绑定的点击事件触发: ${option.dataset.value}`);
                    e.preventDefault();
                    e.stopPropagation();
                    container.multiSelectInstance.toggleOption(option);
                };
            }
        });
        
        // 强制绑定显示区域点击事件
        const displays = document.querySelectorAll('.multi-select-display');
        displays.forEach(display => {
            const container = display.closest('.multi-select-container');
            if (container && container.multiSelectInstance) {
                display.onclick = (e) => {
                    console.log(`🖱️ 强制绑定的显示区域点击事件触发`);
                    e.preventDefault();
                    e.stopPropagation();
                    container.multiSelectInstance.toggleDropdown();
                };
            }
        });
    }, 100);
}

// 调试函数 - 手动测试多选组件
function debugMultiSelect() {
    console.log('=== 多选组件调试信息 ===');
    const containers = document.querySelectorAll('.multi-select-container');
    console.log('找到容器数量:', containers.length);
    
    containers.forEach(container => {
        console.log(`\n容器 ${container.id}:`);
        console.log('- 实例存在:', !!container.multiSelectInstance);
        console.log('- 显示区域存在:', !!container.querySelector('.multi-select-display'));
        console.log('- 下拉框存在:', !!container.querySelector('.multi-select-dropdown'));
        console.log('- 选项数量:', container.querySelectorAll('.multi-select-option').length);
        
        if (container.multiSelectInstance) {
            console.log('- 实例状态:', {
                selectedValues: container.multiSelectInstance.selectedValues,
                options: container.multiSelectInstance.options.length
            });
        }
    });
    
    // 手动触发强制绑定
    console.log('\n手动触发强制绑定...');
    ensureMultiSelectEvents();
}

// 在全局暴露调试函数
window.debugMultiSelect = debugMultiSelect;

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
    
    // 强制确保多选组件事件正常
    setTimeout(() => {
        ensureMultiSelectEvents();
    }, 500);
    
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
    
    // 收集普通表单元素的值
    const formElements = document.querySelectorAll('.search-form input, .search-form select');
    formElements.forEach(element => {
        if (element.value && element.value !== '') {
            searchParams[element.name || element.id] = element.value;
        }
    });
    
    // 收集多选组件的值
    const multiSelectContainers = document.querySelectorAll('.search-form .multi-select-container');
    multiSelectContainers.forEach(container => {
        if (container.multiSelectInstance) {
            const values = container.multiSelectInstance.getValues();
            if (values && values.length > 0) {
                searchParams[container.id] = values;
            }
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
    
    // 清空多选组件的选中状态
    const multiSelectContainers = document.querySelectorAll('.search-form .multi-select-container');
    multiSelectContainers.forEach(container => {
        if (container.multiSelectInstance) {
            container.multiSelectInstance.clear();
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
        
        // 为商品英文名称和当地语种名称列添加特殊样式类
        if (header.key === 'productNameEn') {
            classes.push('product-name-en');
        } else if (header.key === 'productNameLocal') {
            classes.push('product-name-local');
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

// 初始化多选组件
function initMultiSelectComponents() {
    console.log('初始化多选组件...');
    const containers = document.querySelectorAll('.multi-select-container');
    
    containers.forEach(container => {
        const containerId = container.id;
        console.log('初始化多选组件:', containerId);
        
        // 创建多选组件实例
        try {
            const multiSelect = new MultiSelectComponent(containerId);
            console.log('多选组件创建成功:', containerId);
        } catch (error) {
            console.error('创建多选组件失败:', containerId, error);
        }
    });
    
    console.log('多选组件初始化完成');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    // 注意：handleStatusTabChange()已在initializePage()中调用，无需重复调用
});

// ==================== 编辑报关要素信息弹窗功能 ====================

// 当前编辑的商品数据
let currentEditingProduct = null;

// HSCODE对应的必填申报要素配置
const hsCodeElementsConfig = {
    '3926909090': [
        { name: '品牌类型', key: 'brandType', type: 'select', required: true, options: ['0-无品牌', '1-境内自主品牌', '2-境内收购品牌', '3-境外品牌(贴牌生产)', '4-境外品牌(其它)'] },
        { name: '用途', key: 'usage', type: 'input', required: true, placeholder: '请输入用途' },
        { name: '材质', key: 'material', type: 'input', required: true, placeholder: '请输入材质' },
        { name: '品牌', key: 'brand', type: 'input', required: true, placeholder: '请输入品牌' },
        { name: '型号', key: 'model', type: 'input', required: true, placeholder: '请输入型号' }
    ],
    '8471309000': [
        { name: '品牌类型', key: 'brandType', type: 'select', required: true, options: ['0-无品牌', '1-境内自主品牌', '2-境内收购品牌', '3-境外品牌(贴牌生产)', '4-境外品牌(其它)'] },
        { name: '用途', key: 'usage', type: 'input', required: true, placeholder: '请输入用途' },
        { name: '品牌', key: 'brand', type: 'input', required: true, placeholder: '请输入品牌' },
        { name: '型号', key: 'model', type: 'input', required: true, placeholder: '请输入型号' },
        { name: '规格', key: 'specification', type: 'input', required: true, placeholder: '请输入规格' }
    ],
    // 默认配置
    'default': [
        { name: '品牌类型', key: 'brandType', type: 'select', required: true, options: ['0-无品牌', '1-境内自主品牌', '2-境内收购品牌', '3-境外品牌(贴牌生产)', '4-境外品牌(其它)'] },
        { name: '用途', key: 'usage', type: 'input', required: true, placeholder: '请输入用途' },
        { name: '材质', key: 'material', type: 'input', required: true, placeholder: '请输入材质' },
        { name: '品牌', key: 'brand', type: 'input', required: true, placeholder: '请输入品牌' },
        { name: '型号', key: 'model', type: 'input', required: true, placeholder: '请输入型号' }
    ]
};

/**
 * 打开编辑报关要素信息弹窗
 * @param {Object} productData - 商品数据
 * @param {boolean} isSubsequentEdit - 是否是后续编辑
 * @param {string} adjustmentReason - 调整原因
 */
function openElementEditModal(productData, isSubsequentEdit = false, adjustmentReason = null) {
    console.log('打开编辑报关要素信息弹窗:', productData, '后续编辑:', isSubsequentEdit);
    
    currentEditingProduct = productData;
    currentEditingProduct.isSubsequentEdit = isSubsequentEdit;
    currentEditingProduct.adjustmentReason = adjustmentReason;
    
    // 填充商品信息
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
        // 解析申报要素字符串，格式：品牌类型:1|英文品牌名:Brand|型号:Model|用途:工业用
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
                    case '英文品牌名':
                    case '品牌':
                        fieldKey = 'brand';
                        break;
                    case '型号':
                        fieldKey = 'model';
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
    
    // 获取申报中文品名
    const declareNameCn = document.getElementById('modal-declare-name').value.trim();
    
    // 获取品牌授权情况
    const brandAuth = document.getElementById('modal-brand-auth').value.trim();
    
    // 验证必填字段
    if (!declareNameCn) {
        alert('请填写申报中文品名');
        return;
    }
    
    if (!brandAuth) {
        alert('请选择品牌授权情况');
        return;
    }
    
    // 获取品牌类型
    const brandType = document.getElementById('element-brandType').value;
    
    // 获取选中的享惠国家
    const selectedCountries = [];
    const countryCheckboxes = document.querySelectorAll('input[name="preferential-country"]:checked');
    countryCheckboxes.forEach(checkbox => {
        selectedCountries.push(checkbox.value);
    });
    
    console.log('保存待确认申报要素:', {
        domesticSku: currentEditingProduct.domesticSku,
        elementString: elementString,
        declareNameCn: declareNameCn,
        brandType: brandType,
        preferentialCountries: selectedCountries
    });
    
    // 更新商品要素状态为待确认，并保存申报要素和申报中文品名
    updateProductElementStatus(currentEditingProduct.domesticSku, 'pending-confirm', {
        elementString: elementString,
        declareNameCn: declareNameCn
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
    
    // 验证申报中文品名
    const declareNameInput = document.getElementById('modal-declare-name');
    if (!declareNameInput.value.trim()) {
        declareNameInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写申报中文品名');
        return false;
    } else {
        declareNameInput.style.borderColor = '#d9d9d9';
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
    
    // 获取申报中文品名
    const declareNameCn = document.getElementById('modal-declare-name').value.trim();
    
    // 获取品牌类型
    const brandType = document.getElementById('element-brandType').value;
    
    // 获取选中的享惠国家
    const selectedCountries = [];
    const countryCheckboxes = document.querySelectorAll('input[name="preferential-country"]:checked');
    countryCheckboxes.forEach(checkbox => {
        selectedCountries.push(checkbox.value);
    });
    
    console.log('保存申报要素:', {
        domesticSku: currentEditingProduct.domesticSku,
        elementString: elementString,
        declareNameCn: declareNameCn,
        brandType: brandType,
        preferentialCountries: selectedCountries,
        isSubsequentEdit: currentEditingProduct.isSubsequentEdit,
        adjustmentReason: currentEditingProduct.adjustmentReason
    });
    
    // 更新商品要素状态为已确认
    updateProductElementStatus(currentEditingProduct.domesticSku, 'confirmed', {
        elementString: elementString,
        declareNameCn: declareNameCn
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
    
    document.getElementById('modal-international-sku').textContent = productData.internationalSku || '-';
    document.getElementById('modal-product-name').textContent = productData.productName || productData.productTitle || '-';
    document.getElementById('modal-hscode').textContent = productData.chinaHscode || productData.hscode || '-';
    document.getElementById('modal-brand').textContent = productData.brand || '-';
    document.getElementById('modal-model').textContent = productData.model || '-';
    
    // 品牌授权显示为蓝色链接样式
    const brandAuthElement = document.getElementById('modal-brand-auth');
    brandAuthElement.textContent = productData.brandAuth || '-';
    brandAuthElement.className = 'sku-link';
    brandAuthElement.href = 'javascript:void(0)';
    brandAuthElement.onclick = function() {
        // 这里可以添加品牌授权点击跳转逻辑，比如查看授权书详情
        console.log('点击品牌授权链接:', productData.brandAuth);
    };
    
    // 品牌类型显示映射
    const brandTypeMapping = {
        '0': '0-无品牌',
        '1': '1-境内自主品牌', 
        '2': '2-境内收购品牌',
        '3': '3-境外品牌(贴牌生产)',
        '4': '4-境外品牌(其它)'
    };
    
    // 设置品牌类型显示文本 - 商品信息展示为只读文本
    const brandTypeDisplay = document.getElementById('modal-brand-type-display');
    if (productData.brandType !== undefined && productData.brandType !== null) {
        brandTypeDisplay.textContent = brandTypeMapping[productData.brandType.toString()] || productData.brandType.toString();
    } else {
        // 如果商品信息中没有品牌类型，默认显示"0-无品牌"
        brandTypeDisplay.textContent = brandTypeMapping['0'];
    }
    
    // 申报中文品名设置输入框的值
    const declareNameInput = document.getElementById('modal-declare-name');
    declareNameInput.value = productData.declarationNameCn || '';
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
            
            // 如果是品牌类型字段，默认关联商品信息的品牌类型
            if (field.key === 'brandType' && currentEditingProduct && currentEditingProduct.brandType !== undefined) {
                // 根据商品信息的品牌类型设置默认值
                const brandTypeValue = currentEditingProduct.brandType.toString();
                const matchingOption = field.options.find(option => option.startsWith(brandTypeValue + '-'));
                if (matchingOption) {
                    input.value = matchingOption;
                } else {
                    // 如果找不到匹配项，设置为"0-无品牌"
                    input.value = field.options.find(option => option.startsWith('0-')) || '';
                }
            }
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.id = `element-${field.key}`;
            input.placeholder = field.placeholder || `请输入${field.name}`;
        }
        
        if (field.required) {
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
    
    // 绑定享惠国家复选框事件
    const countryCheckboxes = modal.querySelectorAll('input[name="preferential-country"]');
    countryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateElementPreview);
    });
}

/**
 * 更新申报要素预览
 */
function updateElementPreview() {
    const previewElement = document.getElementById('element-preview');
    const elementString = generateElementString();
    previewElement.textContent = elementString || '请填写申报要素信息...';
}

/**
 * 生成申报要素字符串
 * @returns {string} 申报要素字符串
 */
function generateElementString() {
    const modal = document.getElementById('element-edit-modal');
    const elements = [];
    
    // 获取必填项
    const requiredFields = modal.querySelectorAll('#required-fields input, #required-fields select');
    requiredFields.forEach(field => {
        const label = modal.querySelector(`label[for="${field.id}"]`);
        if (label) {
            const fieldName = label.textContent.replace('：', '').replace('*', '');
            const fieldValue = field.value.trim();
            elements.push(`${fieldName}:${fieldValue}`);
        }
    });
    
    // 获取非必填项
    const optionalFields = [
        { id: 'element-gtin', name: 'GTIN' },
        { id: 'element-cas', name: 'CAS' },
        { id: 'element-other', name: '其他' }
    ];
    
    optionalFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            const value = input.value.trim();
            elements.push(`${field.name}:${value}`);
        }
    });
    
    // 处理末尾空值：移除末尾的空项，但保留中间的空项
    while (elements.length > 0 && elements[elements.length - 1].split(':')[1] === '') {
        elements.pop();
    }
    
    return elements.join('|');
}

/**
 * 保存申报要素编辑
 */
function saveElementEdit() {
    if (!currentEditingProduct) {
        showErrorMessage('没有找到当前编辑的商品信息');
        return;
    }
    
    // 验证申报中文品名
    const declareNameInput = document.getElementById('modal-declare-name');
    if (!declareNameInput.value.trim()) {
        declareNameInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请填写申报中文品名');
        return;
    } else {
        declareNameInput.style.borderColor = '#d9d9d9';
    }
    
    // 验证品牌授权情况
    const brandAuthInput = document.getElementById('modal-brand-auth');
    if (!brandAuthInput.value.trim()) {
        brandAuthInput.style.borderColor = '#ff4d4f';
        showErrorMessage('请选择品牌授权情况');
        return;
    } else {
        brandAuthInput.style.borderColor = '#d9d9d9';
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
        return;
    }
    
    // 生成申报要素字符串
    const elementString = generateElementString();
    
    // 获取申报中文品名
    const declareNameCn = document.getElementById('modal-declare-name').value.trim();
    
    // 获取品牌类型
    const brandType = document.getElementById('element-brandType').value;
    
    // 获取选中的享惠国家
    const selectedCountries = [];
    const countryCheckboxes = document.querySelectorAll('input[name="preferential-country"]:checked');
    countryCheckboxes.forEach(checkbox => {
        selectedCountries.push(checkbox.value);
    });
    
    console.log('保存申报要素:', {
        domesticSku: currentEditingProduct.domesticSku,
        elementString: elementString,
        declareNameCn: declareNameCn,
        brandAuth: brandAuth,
        brandType: brandType,
        preferentialCountries: selectedCountries
    });
    
    // 模拟保存成功
    showSuccessMessage('申报要素保存成功！');
    
    // 更新当前商品的要素状态为已确认
    updateProductElementStatus(currentEditingProduct.domesticSku, 'confirmed', {
        elementString: elementString,
        declareNameCn: declareNameCn
    });
    
    // 关闭弹窗
    closeElementEditModal();
    
    // 刷新当前视图
    refreshCurrentView();
}

/**
 * 更新商品要素状态
 * @param {string} domesticSku - 国内SKU
 * @param {string} status - 新状态
 */
function updateProductElementStatus(domesticSku, status, elementData = null) {
    // 在实际应用中，这里应该调用API更新数据库
    // 这里只是模拟更新本地数据
    const currentData = getCurrentTableData();
    const product = currentData.find(item => item.domesticSku === domesticSku);
    if (product) {
        product.elementStatus = status;
        
        // 如果有要素数据，则保存申报要素和申报中文品名（无论是确认状态还是待确认状态）
        if (elementData) {
            product.declarationElements = elementData.elementString || '';
            product.declarationNameCn = elementData.declareNameCn || '';
        }
        
        console.log(`商品 ${domesticSku} 要素状态已更新为: ${status}`, elementData);
    }
}

/**
 * 清空申报要素表单
 */
function clearElementForm() {
    const modal = document.getElementById('element-edit-modal');
    
    // 清空申报中文品名输入框
    const declareNameInput = document.getElementById('modal-declare-name');
    if (declareNameInput) {
        declareNameInput.value = '';
        declareNameInput.style.borderColor = '#d9d9d9';
    }
    
    // 清空所有输入框
    const inputs = modal.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '#d9d9d9';
    });
    
    // 清空复选框
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 清空预览
    document.getElementById('element-preview').textContent = '请填写申报要素信息...';
}

/**
 * 获取当前表格数据
 * @returns {Array} 当前表格数据
 */
function getCurrentTableData() {
    // 返回当前国家的静态数据
    return window.staticMockData && window.staticMockData[currentCountry] ? 
           window.staticMockData[currentCountry] : [];
}

// 修改原有的performElementEdit函数，使其调用新的弹窗
function performElementEdit(domesticSku, isSubsequent = false) {
    console.log(`执行要素编辑: ${domesticSku}, 是否后续编辑: ${isSubsequent}`);
    
    // 获取商品数据
    const productData = getCurrentRowData(domesticSku);
    if (!productData) {
        showErrorMessage('未找到商品数据');
        return;
    }
    
    // 打开编辑弹窗
    openElementEditModal(productData);
}

// ==================== 简化版编辑要素功能（用于非中国国家） ====================

/**
 * 获取当前选中的国家
 */
function getCurrentSelectedCountry() {
    return currentCountry;
}

/**
 * 执行简化版要素编辑（非中国国家用）
 */
function performSimpleElementEdit(domesticSku, isSubsequent = false) {
    console.log(`执行简化版要素编辑: ${domesticSku}, 是否后续编辑: ${isSubsequent}`);
    
    // 获取商品数据
    const productData = getCurrentRowData(domesticSku);
    if (!productData) {
        console.error('未找到商品数据:', domesticSku);
        return;
    }
    
    // 打开简化版编辑要素弹窗
    showSimpleElementEditModal(productData, isSubsequent);
}

/**
 * 显示简化版编辑要素弹窗
 */
function showSimpleElementEditModal(productData, isSubsequent = false) {
    // 获取当前选中的国家
    const currentCountry = getCurrentSelectedCountry();
    const countryNames = {
        'thailand': '泰语',
        'indonesia': '印尼语',
        'vietnam': '越南语',
        'malaysia': '马来语',
        'hungary': '匈牙利语',
        'brazil': '葡萄牙语'
    };
    
    const localLanguageName = countryNames[currentCountry] || '当地语';
    
    // 填充商品信息
    document.getElementById('simple-modal-domestic-sku').textContent = productData.domesticSku;
    document.getElementById('simple-modal-international-sku').textContent = productData.internationalSku || '-';
    document.getElementById('simple-modal-product-name').textContent = productData.productNameCn || '-';
    document.getElementById('simple-modal-product-name-en').textContent = productData.productNameEn || '-';
    document.getElementById('simple-modal-product-name-local').textContent = productData.productNameLocal || '-';
    document.getElementById('simple-modal-hscode').textContent = productData.chinaHscode || '-';
    document.getElementById('simple-modal-brand').textContent = productData.brand || '-';
    document.getElementById('simple-modal-model').textContent = productData.model || '-';
    document.getElementById('simple-modal-brand-auth-display').textContent = productData.brandAuth || '-';
    document.getElementById('simple-modal-brand-type-display').textContent = productData.brandType || '-';
    
    // 动态更新当地品名标签和占位符
    const localNameLabel = document.querySelector('label[for="simple-modal-declare-name-local"]');
    const localNameInput = document.getElementById('simple-modal-declare-name-local');
    if (localNameLabel) {
        localNameLabel.textContent = `申报${localLanguageName}品名：`;
    }
    if (localNameInput) {
        localNameInput.placeholder = `请输入申报${localLanguageName}品名`;
    }
    
    // 清空输入框
    document.getElementById('simple-modal-declare-name-en').value = '';
    document.getElementById('simple-modal-declare-name-local').value = '';
    
    // 设置当前编辑的商品数据
    window.currentSimpleEditingProduct = productData;
    window.currentSimpleEditingIsSubsequent = isSubsequent;
    
    // 显示弹窗
    document.getElementById('element-edit-modal-simple').style.display = 'flex';
}

/**
 * 关闭简化版编辑要素弹窗
 */
function closeSimpleElementEditModal() {
    document.getElementById('element-edit-modal-simple').style.display = 'none';
    window.currentSimpleEditingProduct = null;
    window.currentSimpleEditingIsSubsequent = false;
}

/**
 * 放弃简化版要素编辑
 */
function abandonSimpleElementEdit() {
    if (confirm('确定要放弃编辑吗？')) {
        closeSimpleElementEditModal();
    }
}

/**
 * 保存简化版待确认
 */
function saveSimplePendingConfirm() {
    if (!window.currentSimpleEditingProduct) {
        alert('没有找到当前编辑的商品信息');
        return;
    }
    
    // 获取输入的品名信息
    const declareNameEn = document.getElementById('simple-modal-declare-name-en').value.trim();
    const declareNameLocal = document.getElementById('simple-modal-declare-name-local').value.trim();
    
    console.log('保存简化版待确认:', {
        domesticSku: window.currentSimpleEditingProduct.domesticSku,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal
    });
    
    // 更新当前数据中的申报品名
    const currentData = getCurrentData();
    const targetProduct = currentData.find(item => item.domesticSku === window.currentSimpleEditingProduct.domesticSku);
    if (targetProduct) {
        targetProduct.declarationNameEn = declareNameEn;
        targetProduct.declarationNameLocal = declareNameLocal;
        targetProduct.elementStatus = 'pending-confirm'; // 更新要素状态为待确认
    }
    
    // 模拟保存成功
    alert('保存待确认成功！');
    closeSimpleElementEditModal();
    
    // 刷新表格显示
    refreshCurrentView();
}

/**
 * 确认简化版要素
 */
function confirmSimpleElement() {
    if (!window.currentSimpleEditingProduct) {
        alert('没有找到当前编辑的商品信息');
        return;
    }
    
    // 获取输入的品名信息
    const declareNameEn = document.getElementById('simple-modal-declare-name-en').value.trim();
    const declareNameLocal = document.getElementById('simple-modal-declare-name-local').value.trim();
    
    console.log('确认简化版要素:', {
        domesticSku: window.currentSimpleEditingProduct.domesticSku,
        declareNameEn: declareNameEn,
        declareNameLocal: declareNameLocal
    });
    
    // 更新当前数据中的申报品名
    const currentData = getCurrentData();
    const targetProduct = currentData.find(item => item.domesticSku === window.currentSimpleEditingProduct.domesticSku);
    if (targetProduct) {
        targetProduct.declarationNameEn = declareNameEn;
        targetProduct.declarationNameLocal = declareNameLocal;
        targetProduct.elementStatus = 'confirmed'; // 更新要素状态为已确认
    }
    
    // 模拟确认成功
    alert('要素确认成功！');
    closeSimpleElementEditModal();
    
    // 刷新表格显示
    refreshCurrentView();
}
