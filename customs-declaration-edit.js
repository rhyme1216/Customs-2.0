// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializePage();
    loadOriginalDetails();
    bindEvents();
});

// 全局变量存储当前报关单状态
let currentDeclarationStatus = 'pending'; // 默认为待报关状态

// 初始化侧边栏功能
function initializeSidebar() {
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
}

// 初始化页面
function initializePage() {
    // 初始化TAB切换
    initializeTabs();
    
    // 根据URL参数设置状态
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const status = urlParams.get('status') || 'pending'; // 默认为待报关
    
    currentDeclarationStatus = status;
    
    if (id) {
        loadDeclarationData(id, status);
    }
    
    // 根据状态设置页面权限
    setPagePermissionsByStatus(status);
}

// 根据状态设置页面权限
function setPagePermissionsByStatus(status) {
    const isPending = status === 'pending'; // 待报关状态
    const isProcessing = status === 'processing'; // 报关中状态
    
    // 控制原始装箱SKU明细的编辑权限
    toggleOriginalDetailsEdit(isPending);
    
    // 控制自动拆合单按钮
    toggleAutoSplitButton(isPending);
    
    // 如果是报关中状态，自动执行拆合单
    if (isProcessing) {
        // 延迟执行，确保页面加载完成
        setTimeout(() => {
            performAutoSplitForProcessingStatus();
        }, 1000);
    }
    
    // 更新页面标题
    updatePageTitle(status);
}

// 控制原始装箱SKU明细的编辑权限
function toggleOriginalDetailsEdit(enabled) {
    const editableInputs = document.querySelectorAll('#original-details-table input');
    const editableSelects = document.querySelectorAll('#original-details-table select');
    
    editableInputs.forEach(input => {
        input.disabled = !enabled;
        if (!enabled) {
            input.classList.add('disabled');
        } else {
            input.classList.remove('disabled');
        }
    });
    
    editableSelects.forEach(select => {
        select.disabled = !enabled;
        if (!enabled) {
            select.classList.add('disabled');
        } else {
            select.classList.remove('disabled');
        }
    });
}

// 控制自动拆合单按钮
function toggleAutoSplitButton(enabled) {
    const autoSplitBtn = document.querySelector('.auto-split-btn');
    if (autoSplitBtn) {
        autoSplitBtn.disabled = !enabled;
        if (!enabled) {
            autoSplitBtn.classList.add('disabled');
            autoSplitBtn.textContent = '自动拆合单（不可用）';
        } else {
            autoSplitBtn.classList.remove('disabled');
            autoSplitBtn.textContent = '自动拆合单';
        }
    }
}

// 更新页面标题显示当前状态
function updatePageTitle(status) {
    const statusTexts = {
        'pending': '待报关',
        'processing': '报关中',
        'completed': '报关完成'
    };
    
    const breadcrumbElement = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = `编辑报关单（${statusTexts[status] || '未知状态'}）`;
    }
}

// 初始化TAB功能
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活跃状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 设置当前活跃状态
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// 绑定事件
function bindEvents() {
    // 监管方式变化事件
    const supervisionMode = document.getElementById('supervision-mode');
    supervisionMode.addEventListener('change', function() {
        validateSupervisionMode();
    });
}

// 验证监管方式
function validateSupervisionMode() {
    const supervisionMode = document.getElementById('supervision-mode');
    if (!supervisionMode.value) {
        supervisionMode.style.borderColor = '#ff4444';
        return false;
    } else {
        supervisionMode.style.borderColor = '#ddd';
        return true;
    }
}

// 加载报关单数据
function loadDeclarationData(id, status) {
    // 这里可以根据ID加载具体的报关单数据
    console.log('加载报关单数据，ID:', id, '状态:', status);
    
    // 模拟数据加载
    setTimeout(() => {
        const statusTexts = {
            'pending': '待报关',
            'processing': '报关中',
            'completed': '报关完成'
        };
        
        // 可以在这里设置具体的表单值
        showSuccessMessage(`报关单数据加载完成 - 状态：${statusTexts[status] || '未知状态'}`);
    }, 500);
}

// 加载原始装箱SKU明细
function loadOriginalDetails() {
    const mockData = [
        {
            id: 1,
            domesticSku: 'D001-AP-001',
            internationalSku: 'I001-AP-001',
            domesticOrderNo: 'DOM2024001',
            internationalOrderNo: 'INT2024001',
            containerNo: 'MSKU1234567',
            packageNo: 'PKG001',
            length: 0.15,
            width: 0.08,
            height: 0.01,
            hsCode: '8517120000',
            declareElements: '品牌类型;出口享惠情况;用途;品牌;型号',
            chineseName: '手机',
            brand: 'Apple',
            model: 'iPhone 15',
            quantity: 100,
            unit: '台',
            amount: 50000,
            supplier: '苹果公司',
            netWeight: 0.2,
            enterpriseCode: 'ENT001',
            enterpriseName: '苹果制造有限公司',
            contactPerson: '张三',
            contactPhone: '13800138000'
        },
        {
            id: 2,
            domesticSku: 'D002-DL-002',
            internationalSku: 'I002-DL-002',
            domesticOrderNo: 'DOM2024002',
            internationalOrderNo: 'INT2024002',
            containerNo: 'MSKU1234567',
            packageNo: 'PKG002',
            length: 0.32,
            width: 0.22,
            height: 0.02,
            hsCode: '8471300000',
            declareElements: '品牌类型;出口享惠情况;用途;品牌;型号',
            chineseName: '便携式电脑',
            brand: 'Dell',
            model: 'XPS 13',
            quantity: 50,
            unit: '台',
            amount: 75000,
            supplier: '戴尔公司',
            netWeight: 1.2,
            enterpriseCode: 'ENT002',
            enterpriseName: '戴尔制造有限公司',
            contactPerson: '李四',
            contactPhone: '13900139000'
        },
        {
            id: 3,
            domesticSku: 'D003-SM-003',
            internationalSku: 'I003-SM-003',
            domesticOrderNo: 'DOM2024003',
            internationalOrderNo: 'INT2024003',
            containerNo: 'MSKU1234568',
            packageNo: 'PKG003',
            length: 0.6,
            width: 0.4,
            height: 0.08,
            hsCode: '8528721000',
            declareElements: '品牌类型;出口享惠情况;用途;品牌;型号;屏幕尺寸',
            chineseName: '液晶显示器',
            brand: 'Samsung',
            model: 'S24E450',
            quantity: 30,
            unit: '台',
            amount: 15000,
            supplier: '三星公司',
            netWeight: 3.5,
            enterpriseCode: 'ENT003',
            enterpriseName: '三星制造有限公司',
            contactPerson: '王五',
            contactPhone: '13700137000'
        }
    ];
    
    renderOriginalDetails(mockData);
}

// 渲染原始装箱SKU明细
function renderOriginalDetails(data) {
    const tbody = document.getElementById('original-details-table-body');
    tbody.innerHTML = '';
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.domesticSku || '-'}</td>
            <td>${item.internationalSku || '-'}</td>
            <td>${item.domesticOrderNo || '-'}</td>
            <td>${item.internationalOrderNo || '-'}</td>
            <td>${item.containerNo || '-'}</td>
            <td>${item.packageNo || '-'}</td>
            <td>${item.length || '-'}</td>
            <td>${item.width || '-'}</td>
            <td>${item.height || '-'}</td>
            <td>${item.hsCode}</td>
            <td>${item.declareElements}</td>
            <td>${item.chineseName}</td>
            <td><input type="text" value="${item.brand}" data-field="brand" data-id="${item.id}"></td>
            <td><input type="text" value="${item.model}" data-field="model" data-id="${item.id}"></td>
            <td>${item.quantity}</td>
            <td><input type="text" value="${item.unit}" data-field="unit" data-id="${item.id}"></td>
            <td>${item.amount.toLocaleString()}</td>
            <td>${item.supplier}</td>
            <td><input type="text" value="${item.netWeight}" data-field="netWeight" data-id="${item.id}"></td>
            <td><input type="text" value="${item.enterpriseCode}" data-field="enterpriseCode" data-id="${item.id}"></td>
            <td><input type="text" value="${item.enterpriseName}" data-field="enterpriseName" data-id="${item.id}"></td>
            <td><input type="text" value="${item.contactPerson}" data-field="contactPerson" data-id="${item.id}"></td>
            <td><input type="text" value="${item.contactPhone}" data-field="contactPhone" data-id="${item.id}"></td>
        `;
        tbody.appendChild(row);
    });
    
    // 绑定输入框变化事件
    bindInputEvents();
}

// 绑定输入框事件
function bindInputEvents() {
    const inputs = document.querySelectorAll('#original-details-table-body input');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const field = this.getAttribute('data-field');
            const value = this.value;
            
            console.log(`更新商品 ${id} 的 ${field} 为: ${value}`);
            // 这里可以添加数据更新逻辑
        });
    });
}

// 计算CBM（立方米）
function calculateCBM(items) {
    let totalCBM = 0;
    items.forEach(item => {
        if (item.length && item.width && item.height && item.quantity) {
            const itemCBM = item.length * item.width * item.height * item.quantity;
            totalCBM += itemCBM;
        }
    });
    return totalCBM.toFixed(3); // 保留3位小数
}

// 根据装箱明细计算总CBM
function calculateTotalCBMFromDetails() {
    // 这里需要从当前表格或数据源获取明细数据
    // 简化演示，直接使用模拟数据
    const mockData = [
        {
            length: 0.15,
            width: 0.08,
            height: 0.01,
            quantity: 100
        },
        {
            length: 0.32,
            width: 0.22,
            height: 0.02,
            quantity: 50
        },
        {
            length: 0.6,
            width: 0.4,
            height: 0.08,
            quantity: 30
        }
    ];
    
    return calculateCBM(mockData);
}

// 获取运输方式
function getTransportMode() {
    const transportModeElement = document.getElementById('transport-mode');
    return transportModeElement ? transportModeElement.value : '水路运输';
}

// 更新车号字段状态
function updateVehicleNumberFields() {
    const transportMode = getTransportMode();
    const isRoadTransport = transportMode === '公路运输';
    
    // 查找所有车号字段并更新状态
    for (let i = 1; i <= 10; i++) {
        const vehicleNumberField = document.getElementById(`vehicle-number-${i}`);
        if (vehicleNumberField) {
            vehicleNumberField.readonly = !isRoadTransport;
            vehicleNumberField.placeholder = isRoadTransport ? '请输入车号' : '此时非必填';
            if (!isRoadTransport) {
                vehicleNumberField.value = '';
            } else {
                // 如果是公路运输，可以填入示例车号
                vehicleNumberField.value = `GD${12345 + i - 1}`;
            }
        }
    }
    
    // 如果已经生成了拆合单结果，需要重新生成以反映运输方式的改变
    const splitResultTab = document.querySelector('[data-tab="split-result"]');
    const splitResultContent = document.getElementById('declaration-content');
    if (splitResultTab && splitResultContent && splitResultContent.children.length > 0) {
        // 如果有拆合单结果，提示用户重新生成
        if (confirm('运输方式已改变，是否重新生成拆合单结果以更新车号信息？')) {
            performAutoSplit();
        }
    }
}

// 执行自动拆合单
function performAutoSplit() {
    showSuccessMessage('正在执行自动拆合单...');
    
    // 模拟拆合单过程
    setTimeout(() => {
        const mockSplitResult = [
            {
                id: 1,
                name: '报关单1',
                declarationNo: '',
                declareDate: '',
                clearanceDate: '',
                isInspection: '',
                isAbnormal: '',
                abnormalReason: '',
                serviceProvider: '',
                totalGrossWeight: '625.2 KG',
                totalNetWeight: '590.1 KG',
                totalCBM: '0.120 CBM',
                vehicleNumber: getTransportMode() === '公路运输' ? 'GD12345' : '',
                items: [
                    {
                        seq: 1,
                        hsCode: '8517120000',
                        chineseName: '手机',
                        brand: 'Apple',
                        model: 'iPhone 15',
                        quantity: 100,
                        unit: '台',
                        amount: 50000,
                        supplier: '苹果公司',
                        totalNetWeight: 20,
                        length: 0.15,
                        width: 0.08,
                        height: 0.01
                    }
                ]
            },
            {
                id: 2,
                name: '报关单2',
                declarationNo: '',
                declareDate: '',
                clearanceDate: '',
                isInspection: '',
                isAbnormal: '',
                abnormalReason: '',
                serviceProvider: '',
                totalGrossWeight: '625.3 KG',
                totalNetWeight: '590.2 KG',
                totalCBM: '2.056 CBM',
                vehicleNumber: getTransportMode() === '公路运输' ? 'GD67890' : '',
                items: [
                    {
                        seq: 1,
                        hsCode: '8471300000',
                        chineseName: '便携式电脑',
                        brand: 'Dell',
                        model: 'XPS 13',
                        quantity: 50,
                        unit: '台',
                        amount: 75000,
                        supplier: '戴尔公司',
                        totalNetWeight: 60,
                        length: 0.32,
                        width: 0.22,
                        height: 0.02
                    },
                    {
                        seq: 2,
                        hsCode: '8528721000',
                        chineseName: '液晶显示器',
                        brand: 'Samsung',
                        model: 'S24E450',
                        quantity: 30,
                        unit: '台',
                        amount: 15000,
                        supplier: '三星公司',
                        totalNetWeight: 105,
                        length: 0.6,
                        width: 0.4,
                        height: 0.08
                    }
                ]
            }
        ];
        
        renderSplitResult(mockSplitResult);
        
        // 切换到拆合单结果TAB
        document.querySelector('[data-tab="split-result"]').click();
        
        showSuccessMessage('自动拆合单完成！');
    }, 2000);
}

// 报关中状态自动执行拆合单
function performAutoSplitForProcessingStatus() {
    // 检查是否已经有拆合单结果，避免重复执行
    const existingResult = document.querySelector('#split-result-content .declaration-card');
    if (existingResult) {
        // 如果已有结果，直接切换到拆合单结果TAB
        const splitResultTab = document.querySelector('[data-tab="split-result"]');
        if (splitResultTab) {
            splitResultTab.click();
        }
        return;
    }
    
    // 显示自动执行提示
    showInfoMessage('系统正在自动生成拆合单结果...');
    
        // 模拟自动拆合单过程（比手动执行更快）
    setTimeout(() => {
        const mockSplitResult = [
            {
                id: 1,
                name: '报关单1',
                declarationNo: '',
                declareDate: '',
                clearanceDate: '',
                isInspection: '',
                isAbnormal: '',
                abnormalReason: '',
                serviceProvider: '',
                totalGrossWeight: '625.2 KG',
                totalNetWeight: '590.1 KG',
                totalCBM: '0.120 CBM',
                vehicleNumber: getTransportMode() === '公路运输' ? 'GD12345' : '',
                items: [
                    {
                        seq: 1,
                        hsCode: '8517120000',
                        chineseName: '手机',
                        brand: 'Apple',
                        model: 'iPhone 15',
                        quantity: 100,
                        unit: '台',
                        amount: 50000,
                        supplier: '苹果公司',
                        totalNetWeight: 20,
                        length: 0.15,
                        width: 0.08,
                        height: 0.01
                    }
                ]
            },
            {
                id: 2,
                name: '报关单2',
                declarationNo: '',
                declareDate: '',
                clearanceDate: '',
                isInspection: '',
                isAbnormal: '',
                abnormalReason: '',
                serviceProvider: '',
                totalGrossWeight: '625.3 KG',
                totalNetWeight: '590.2 KG',
                totalCBM: '2.056 CBM',
                vehicleNumber: getTransportMode() === '公路运输' ? 'GD67890' : '',
                items: [
                    {
                        seq: 1,
                        hsCode: '8471300000',
                        chineseName: '便携式电脑',
                        brand: 'Dell',
                        model: 'XPS 13',
                        quantity: 50,
                        unit: '台',
                        amount: 75000,
                        supplier: '戴尔公司',
                        totalNetWeight: 60,
                        length: 0.32,
                        width: 0.22,
                        height: 0.02
                    },
                    {
                        seq: 2,
                        hsCode: '8528721000',
                        chineseName: '液晶显示器',
                        brand: 'Samsung',
                        model: 'S24E450',
                        quantity: 30,
                        unit: '台',
                        amount: 15000,
                        supplier: '三星公司',
                        totalNetWeight: 105,
                        length: 0.6,
                        width: 0.4,
                        height: 0.08
                    }
                ]
            }
        ];
        
        renderSplitResult(mockSplitResult);
        
        // 自动切换到拆合单结果TAB
        const splitResultTab = document.querySelector('[data-tab="split-result"]');
        if (splitResultTab) {
            splitResultTab.click();
        }
        
        showSuccessMessage('自动拆合单已生成！');
    }, 1500); // 比手动执行更快
}

// 渲染拆合单结果
function renderSplitResult(data) {
    const tabNav = document.getElementById('declaration-tab-nav');
    const content = document.getElementById('declaration-content');
    
    // 清空现有内容
    tabNav.innerHTML = '';
    content.innerHTML = '';
    
    // 生成TAB按钮
    data.forEach((declaration, index) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `declaration-tab-btn ${index === 0 ? 'active' : ''}`;
        tabBtn.textContent = declaration.name;
        tabBtn.setAttribute('data-declaration-id', declaration.id);
        tabBtn.addEventListener('click', () => showDeclarationDetail(declaration.id, data));
        tabNav.appendChild(tabBtn);
    });
    
    // 显示第一个报关单详情
    if (data.length > 0) {
        showDeclarationDetail(data[0].id, data);
    }
}

// 显示报关单详情
function showDeclarationDetail(declarationId, allData) {
    const declaration = allData.find(d => d.id === declarationId);
    if (!declaration) return;
    
    // 更新TAB状态
    const tabBtns = document.querySelectorAll('.declaration-tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-declaration-id') == declarationId) {
            btn.classList.add('active');
        }
    });
    
    // 根据当前状态决定字段是否必填
    const isProcessing = currentDeclarationStatus === 'processing';
    const requiredMark = isProcessing ? '<span class="required-mark">*</span>' : '';
    const requiredAttr = isProcessing ? 'required' : '';
    const placeholder = isProcessing ? '' : '此时非必填';
    
    // 生成详情内容
    const content = document.getElementById('declaration-content');
    content.innerHTML = `
        <div class="declaration-detail active">
            <div class="declaration-info-header">
                <h4>报关信息${isProcessing ? '（必填项）' : '（非必填项）'}</h4>
                ${isProcessing ? '<div class="confirm-customs-btn-container"><button class="btn-confirm-customs" onclick="confirmCustomsDeclaration(' + declarationId + ')">确认报关</button></div>' : ''}
            </div>
            <div class="detail-form">
                <div class="form-group">
                    <label>报关单号：${requiredMark}</label>
                    <input type="text" id="declaration-no-${declarationId}" value="${declaration.declarationNo}" placeholder="${placeholder}" ${requiredAttr}>
                </div>
                <div class="form-group">
                    <label>申报日期：${requiredMark}</label>
                    <input type="date" id="declare-date-${declarationId}" value="${declaration.declareDate}" ${requiredAttr}>
                </div>
                <div class="form-group">
                    <label>结关日期：${requiredMark}</label>
                    <input type="date" id="clearance-date-${declarationId}" value="${declaration.clearanceDate}" ${requiredAttr}>
                </div>
                <div class="form-group">
                    <label>是否查验：${requiredMark}</label>
                    <select id="is-inspection-${declarationId}" onchange="toggleDeclarationInspectionFields(${declarationId})" ${requiredAttr}>
                        <option value="">${placeholder || '请选择'}</option>
                        <option value="yes" ${declaration.isInspection === 'yes' ? 'selected' : ''}>是</option>
                        <option value="no" ${declaration.isInspection === 'no' ? 'selected' : ''}>否</option>
                    </select>
                </div>
                <div class="form-group inspection-dependent" id="inspection-abnormal-group-${declarationId}" style="display: ${declaration.isInspection === 'yes' ? 'block' : 'none'};">
                    <label>查验是否异常：${isProcessing && declaration.isInspection === 'yes' ? '<span class="required-mark">*</span>' : ''}</label>
                    <select id="inspection-abnormal-${declarationId}" onchange="toggleDeclarationAbnormalReasonField(${declarationId})" ${isProcessing && declaration.isInspection === 'yes' ? 'required' : ''}>
                        <option value="">${placeholder || '请选择'}</option>
                        <option value="yes" ${declaration.isAbnormal === 'yes' ? 'selected' : ''}>是</option>
                        <option value="no" ${declaration.isAbnormal === 'no' ? 'selected' : ''}>否</option>
                    </select>
                </div>
                <div class="form-group abnormal-dependent" id="abnormal-reason-group-${declarationId}" style="display: ${declaration.isAbnormal === 'yes' ? 'block' : 'none'};">
                    <label>异常原因：${isProcessing && declaration.isAbnormal === 'yes' ? '<span class="required-mark">*</span>' : ''}</label>
                    <textarea id="abnormal-reason-${declarationId}" placeholder="${placeholder}" rows="2" ${isProcessing && declaration.isAbnormal === 'yes' ? 'required' : ''}>${declaration.abnormalReason}</textarea>
                </div>
                <div class="form-group">
                    <label>报关服务商：${requiredMark}</label>
                    <select id="service-provider-${declarationId}" ${requiredAttr}>
                        <option value="">${placeholder || '请选择报关服务商'}</option>
                        <option value="provider1" ${declaration.serviceProvider === 'provider1' ? 'selected' : ''}>华南国际物流有限公司</option>
                        <option value="provider2" ${declaration.serviceProvider === 'provider2' ? 'selected' : ''}>深圳市跨境通关服务有限公司</option>
                        <option value="provider3" ${declaration.serviceProvider === 'provider3' ? 'selected' : ''}>广州港口报关有限公司</option>
                        <option value="provider4" ${declaration.serviceProvider === 'provider4' ? 'selected' : ''}>东莞市国际贸易服务有限公司</option>
                        <option value="provider5" ${declaration.serviceProvider === 'provider5' ? 'selected' : ''}>中外运报关有限公司</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>总毛重：</label>
                    <input type="text" id="total-gross-weight-${declarationId}" value="${declaration.totalGrossWeight || '1250.5 KG'}" placeholder="请输入总毛重">
                </div>
                <div class="form-group">
                    <label>总净重：</label>
                    <input type="text" id="total-net-weight-${declarationId}" value="${declaration.totalNetWeight || '1180.3 KG'}" placeholder="请输入总净重">
                </div>
                <div class="form-group">
                    <label>CBM：</label>
                    <input type="text" id="total-cbm-${declarationId}" value="${declaration.totalCBM || '0.000 CBM'}" placeholder="自动计算" readonly>
                </div>
                <div class="form-group">
                    <label>车号：</label>
                    <input type="text" id="vehicle-number-${declarationId}" value="${declaration.vehicleNumber || ''}" placeholder="${getTransportMode() === '公路运输' ? '请输入车号' : '此时非必填'}" ${getTransportMode() !== '公路运输' ? 'readonly' : ''}>
                </div>
            </div>
            
            <div class="detail-table-container">
                <div class="table-header-actions">
                    <h4>商品明细列表（不可编辑）</h4>
                    <button class="upload-btn" onclick="uploadFile(${declarationId})">上传文件</button>
                </div>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>HSCode</th>
                            <th>申报中文名</th>
                            <th>品牌</th>
                            <th>型号</th>
                            <th>数量</th>
                            <th>成交单位</th>
                            <th>金额</th>
                            <th>供应商名称</th>
                            <th>总净重</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${declaration.items.map(item => `
                            <tr>
                                <td>${item.seq}</td>
                                <td>${item.hsCode}</td>
                                <td>${item.chineseName}</td>
                                <td>${item.brand}</td>
                                <td>${item.model}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unit}</td>
                                <td>${item.amount.toLocaleString()}</td>
                                <td>${item.supplier}</td>
                                <td>${item.totalNetWeight}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 切换报关单中查验相关字段的显示
function toggleDeclarationInspectionFields(declarationId) {
    const isInspection = document.getElementById(`is-inspection-${declarationId}`).value;
    const inspectionAbnormalGroup = document.getElementById(`inspection-abnormal-group-${declarationId}`);
    const inspectionAbnormalSelect = document.getElementById(`inspection-abnormal-${declarationId}`);
    
    if (isInspection === 'yes') {
        inspectionAbnormalGroup.style.display = 'block';
        if (currentDeclarationStatus === 'processing') {
            inspectionAbnormalSelect.required = true;
        }
    } else {
        inspectionAbnormalGroup.style.display = 'none';
        inspectionAbnormalSelect.required = false;
        inspectionAbnormalSelect.value = '';
        // 同时隐藏异常原因字段
        toggleDeclarationAbnormalReasonField(declarationId);
    }
}

// 切换报关单中异常原因字段的显示
function toggleDeclarationAbnormalReasonField(declarationId) {
    const inspectionAbnormal = document.getElementById(`inspection-abnormal-${declarationId}`).value;
    const abnormalReasonGroup = document.getElementById(`abnormal-reason-group-${declarationId}`);
    const abnormalReasonTextarea = document.getElementById(`abnormal-reason-${declarationId}`);
    
    if (inspectionAbnormal === 'yes') {
        abnormalReasonGroup.style.display = 'block';
        if (currentDeclarationStatus === 'processing') {
            abnormalReasonTextarea.required = true;
        }
    } else {
        abnormalReasonGroup.style.display = 'none';
        abnormalReasonTextarea.required = false;
        abnormalReasonTextarea.value = '';
    }
}

// 确认报关功能
function confirmCustomsDeclaration(declarationId) {
    // 验证当前报关单的必填字段
    if (!validateDeclarationRequiredFields(declarationId)) {
        return;
    }
    
    if (!confirm('确认进行报关操作？确认后状态将变为"报关中"，原始装箱SKU明细将不可编辑。')) {
        return;
    }
    
    // 更新状态为报关中
    currentDeclarationStatus = 'processing';
    
    // 重新设置页面权限
    setPagePermissionsByStatus('processing');
    
    // 刷新当前报关单详情显示
    const allData = getCurrentSplitResultData(); // 需要实现这个函数来获取当前数据
    if (allData) {
        showDeclarationDetail(declarationId, allData);
    }
    
    showSuccessMessage('报关确认成功！状态已更新为"报关中"');
}

// 验证报关单必填字段
function validateDeclarationRequiredFields(declarationId) {
    if (currentDeclarationStatus !== 'processing') {
        return true; // 非报关中状态不需要验证这些字段
    }
    
    const requiredFields = [
        { id: `declaration-no-${declarationId}`, name: '报关单号' },
        { id: `declare-date-${declarationId}`, name: '申报日期' },
        { id: `clearance-date-${declarationId}`, name: '结关日期' },
        { id: `is-inspection-${declarationId}`, name: '是否查验' },
        { id: `service-provider-${declarationId}`, name: '报关服务商' }
    ];
    
    const missingFields = [];
    
    // 检查基本必填字段
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && (!element.value || element.value.trim() === '')) {
            missingFields.push(field.name);
        }
    });
    
    // 检查条件必填字段
    const isInspection = document.getElementById(`is-inspection-${declarationId}`).value;
    if (isInspection === 'yes') {
        const inspectionAbnormal = document.getElementById(`inspection-abnormal-${declarationId}`).value;
        if (!inspectionAbnormal) {
            missingFields.push('查验是否异常');
        }
        
        if (inspectionAbnormal === 'yes') {
            const abnormalReason = document.getElementById(`abnormal-reason-${declarationId}`).value;
            if (!abnormalReason || abnormalReason.trim() === '') {
                missingFields.push('异常原因');
            }
        }
    }
    
    if (missingFields.length > 0) {
        alert('请填写以下必填字段：\n' + missingFields.join('\n'));
        return false;
    }
    
    return true;
}

// 获取当前拆合单结果数据（临时实现）
function getCurrentSplitResultData() {
    // 这里应该返回当前的拆合单数据，暂时返回null
    // 在实际应用中，可以将数据存储在全局变量中
    return null;
}

// 返回上一页
function goBack() {
    window.location.href = 'customs-declaration-management.html';
}

// 保存报关单
function saveDeclaration() {
    if (!validateForm()) {
        return;
    }
    
    showSuccessMessage('正在保存...');
    
    // 模拟保存过程
    setTimeout(() => {
        showSuccessMessage('保存成功！');
    }, 1000);
}

// 提交报关单
function submitDeclaration() {
    if (!validateForm()) {
        return;
    }
    
    if (!confirm('确认提交报关单？提交后将无法修改。')) {
        return;
    }
    
    showSuccessMessage('正在提交...');
    
    // 模拟提交过程
    setTimeout(() => {
        showSuccessMessage('提交成功！');
        // 可以跳转回列表页面
        setTimeout(() => {
            goBack();
        }, 1500);
    }, 1500);
}

// 表单验证
function validateForm() {
    // 验证监管方式
    if (!validateSupervisionMode()) {
        alert('请选择监管方式！');
        return false;
    }
    
    // 验证可编辑字段
    const editableInputs = document.querySelectorAll('#original-details-table-body input');
    let hasError = false;
    
    editableInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ff4444';
            hasError = true;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (hasError) {
        alert('请填写所有必填的商品信息！');
        return false;
    }
    
    return true;
}

// 工具函数
function showSuccessMessage(message) {
    alert('✅ ' + message);
}

function showErrorMessage(message) {
    alert('❌ ' + message);
}

function showInfoMessage(message) {
    alert('ℹ️ ' + message);
}

// 上传文件功能
function uploadFile(declarationId) {
    // 创建文件类型选择弹窗
    showFileUploadModal(declarationId);
}

// 显示文件上传选择弹窗
function showFileUploadModal(declarationId) {
    // 创建遮罩层
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.innerHTML = `
        <div class="upload-modal-content">
            <div class="upload-modal-header">
                <h3>上传文件</h3>
                <button class="upload-modal-close" onclick="closeUploadModal()">&times;</button>
            </div>
            <div class="upload-modal-body">
                <div class="file-type-section">
                    <h4>请选择文件类型：</h4>
                    <div class="file-type-list">
                        <div class="file-type-item" data-required="false">
                            <input type="checkbox" id="file-type-42" value="42" onchange="toggleFileUpload(this)">
                            <label for="file-type-42">42电子授权委托协议（非必填）</label>
                            <div class="file-upload-area" id="upload-area-42" style="display: none;">
                                <input type="file" id="file-input-42" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '42')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-42').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-42" style="display: none;"></div>
                            </div>
                        </div>
                        
                        <div class="file-type-item required" data-required="true">
                            <input type="checkbox" id="file-type-48" value="48" onchange="toggleFileUpload(this)">
                            <label for="file-type-48">48出口报关底单（必填）<span class="required-mark">*</span></label>
                            <div class="file-upload-area" id="upload-area-48" style="display: none;">
                                <input type="file" id="file-input-48" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '48')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-48').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-48" style="display: none;"></div>
                            </div>
                        </div>
                        
                        <div class="file-type-item required" data-required="true">
                            <input type="checkbox" id="file-type-49" value="49" onchange="toggleFileUpload(this)">
                            <label for="file-type-49">49通关无纸化放行通知书（必填）<span class="required-mark">*</span></label>
                            <div class="file-upload-area" id="upload-area-49" style="display: none;">
                                <input type="file" id="file-input-49" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '49')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-49').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-49" style="display: none;"></div>
                            </div>
                        </div>
                        
                        <div class="file-type-item" data-required="false">
                            <input type="checkbox" id="file-type-50" value="50" onchange="toggleFileUpload(this)">
                            <label for="file-type-50">50产地证（非必填）</label>
                            <div class="file-upload-area" id="upload-area-50" style="display: none;">
                                <input type="file" id="file-input-50" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '50')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-50').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-50" style="display: none;"></div>
                            </div>
                        </div>
                        
                        <div class="file-type-item" data-required="false">
                            <input type="checkbox" id="file-type-51" value="51" onchange="toggleFileUpload(this)">
                            <label for="file-type-51">51出口许可证件（非必填）</label>
                            <div class="file-upload-area" id="upload-area-51" style="display: none;">
                                <input type="file" id="file-input-51" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '51')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-51').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-51" style="display: none;"></div>
                            </div>
                        </div>
                        
                        <div class="file-type-item" data-required="false">
                            <input type="checkbox" id="file-type-52" value="52" onchange="toggleFileUpload(this)">
                            <label for="file-type-52">52其他（非必填）</label>
                            <div class="file-upload-area" id="upload-area-52" style="display: none;">
                                <input type="file" id="file-input-52" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="handleSingleFileUpload(this, '52')" style="display: none;">
                                <div class="upload-placeholder" onclick="document.getElementById('file-input-52').click()">
                                    <span class="upload-text">点击选择文件</span>
                                    <span class="upload-hint">支持PDF、图片、Word文档，最大10MB</span>
                                </div>
                                <div class="uploaded-file" id="uploaded-file-52" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-modal-footer">
                <button class="btn-cancel" onclick="closeUploadModal()">取消</button>
                <button class="btn-confirm" onclick="confirmFileUpload(${declarationId})">确认上传</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 关闭上传弹窗
function closeUploadModal() {
    const modal = document.querySelector('.upload-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// 切换文件上传区域显示
function toggleFileUpload(checkbox) {
    const uploadArea = document.getElementById(`upload-area-${checkbox.value}`);
    if (checkbox.checked) {
        uploadArea.style.display = 'block';
    } else {
        uploadArea.style.display = 'none';
        // 清除已上传的文件
        const fileInput = document.getElementById(`file-input-${checkbox.value}`);
        const uploadedFile = document.getElementById(`uploaded-file-${checkbox.value}`);
        fileInput.value = '';
        uploadedFile.style.display = 'none';
        uploadedFile.innerHTML = '';
    }
}

// 处理单个文件上传
function handleSingleFileUpload(input, fileType) {
    const file = input.files[0];
    if (!file) return;
    
    // 检查文件大小（10MB限制）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('文件大小不能超过10MB');
        input.value = '';
        return;
    }
    
    // 显示已上传文件
    const uploadedFileDiv = document.getElementById(`uploaded-file-${fileType}`);
    const uploadPlaceholder = uploadedFileDiv.previousElementSibling;
    
    uploadedFileDiv.innerHTML = `
        <div class="file-info">
            <span class="file-name">${file.name}</span>
            <span class="file-size">(${formatFileSize(file.size)})</span>
            <button class="remove-file-btn" onclick="removeUploadedFile('${fileType}')" title="删除文件">&times;</button>
        </div>
    `;
    
    uploadPlaceholder.style.display = 'none';
    uploadedFileDiv.style.display = 'block';
}

// 删除已上传文件
function removeUploadedFile(fileType) {
    const fileInput = document.getElementById(`file-input-${fileType}`);
    const uploadedFile = document.getElementById(`uploaded-file-${fileType}`);
    const uploadPlaceholder = uploadedFile.previousElementSibling;
    
    fileInput.value = '';
    uploadedFile.style.display = 'none';
    uploadedFile.innerHTML = '';
    uploadPlaceholder.style.display = 'block';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 确认文件上传
function confirmFileUpload(declarationId) {
    const uploadedFiles = [];
    const requiredTypes = ['48', '49'];
    const missingRequired = [];
    
    // 检查所有勾选的文件类型
    const checkboxes = document.querySelectorAll('.upload-modal input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const fileType = checkbox.value;
        const fileInput = document.getElementById(`file-input-${fileType}`);
        
        if (fileInput.files.length > 0) {
            uploadedFiles.push({
                type: fileType,
                typeName: checkbox.nextElementSibling.textContent,
                file: fileInput.files[0]
            });
        }
    });
    
    // 检查必填文件类型
    requiredTypes.forEach(type => {
        const checkbox = document.getElementById(`file-type-${type}`);
        const fileInput = document.getElementById(`file-input-${type}`);
        
        if (checkbox.checked && fileInput.files.length === 0) {
            missingRequired.push(checkbox.nextElementSibling.textContent);
        }
    });
    
    if (missingRequired.length > 0) {
        alert('请上传以下必填文件：\n' + missingRequired.join('\n'));
        return;
    }
    
    if (uploadedFiles.length === 0) {
        alert('请至少选择一个文件类型并上传文件');
        return;
    }
    
    // 模拟上传过程
    showSuccessMessage(`正在上传 ${uploadedFiles.length} 个文件...`);
    
    setTimeout(() => {
        const uploadResults = uploadedFiles.map(item => ({
            type: item.type,
            typeName: item.typeName,
            name: item.file.name,
            size: item.file.size,
            uploadTime: new Date().toLocaleString(),
            status: 'success'
        }));
        
        console.log(`报关单 ${declarationId} 上传文件结果:`, uploadResults);
        
        // 显示上传成功消息
        const fileNames = uploadResults.map(f => `${f.typeName}: ${f.name}`).join('\n');
        showSuccessMessage(`文件上传成功:\n${fileNames}`);
        
        // 关闭弹窗
        closeUploadModal();
        
        // 这里可以添加更多逻辑，比如更新界面显示已上传的文件列表
        
    }, 1500);
}

// 导出函数供其他页面使用
window.declarationEdit = {
    loadDeclarationData,
    performAutoSplit,
    saveDeclaration,
    submitDeclaration,
    goBack,
    uploadFile,
    confirmCustomsDeclaration,
    toggleDeclarationInspectionFields,
    toggleDeclarationAbnormalReasonField,
    validateDeclarationRequiredFields,
    updateVehicleNumberFields
};