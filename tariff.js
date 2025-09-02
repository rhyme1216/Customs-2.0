// 全局变量
let currentCountry = 'china';
let currentPage = 1;
let itemsPerPage = 20;
let allData = {};
let filteredData = [];

// 各国税则数据结构定义
const countryConfig = {
    china: {
        name: '中国关务税则维护',
        columns: [
            { key: 'hscode', title: '中国HSCODE', fixed: true },
            { key: 'tax_rate', title: '中国退税率', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'declaration_elements', title: '申报要素' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    thailand: {
        name: '泰国关务税则维护',
        columns: [
            { key: 'hscode', title: '泰国HSCODE', fixed: true },
            { key: 'mfn_rate', title: '最惠国关税MFN', type: 'percentage' },
            { key: 'form_e', title: 'Form E%', type: 'percentage' },
            { key: 'vat', title: '增值税VAT%', type: 'percentage' },
            { key: 'excise_tax', title: '消费税率excise tax%', type: 'percentage' },
            { key: 'local_tax', title: '本地税Local Tax', type: 'percentage' },
            { key: 'anti_dumping', title: '反倾销税率', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    vietnam: {
        name: '越南关务税则维护',
        columns: [
            { key: 'hscode', title: '越南HSCODE', fixed: true },
            { key: 'mfn_rate', title: '最惠国关税MFN', type: 'percentage' },
            { key: 'form_e', title: 'Form E%', type: 'percentage' },
            { key: 'vat', title: '增值税VAT%', type: 'percentage' },
            { key: 'anti_dumping', title: '反倾销税率', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    malaysia: {
        name: '马来关务税则维护',
        columns: [
            { key: 'hscode', title: '马来HSCODE', fixed: true },
            { key: 'mfn_rate', title: '最惠国关税MFN', type: 'percentage' },
            { key: 'form_e', title: 'Form E%', type: 'percentage' },
            { key: 'sst', title: 'SST', type: 'percentage' },
            { key: 'anti_dumping', title: '反倾销税率', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    indonesia: {
        name: '印尼关务税则维护',
        columns: [
            { key: 'hscode', title: '关税BM', fixed: true },
            { key: 'form_e', title: 'FormE关税', type: 'percentage' },
            { key: 'ppn', title: '增值税PPN', type: 'percentage' },
            { key: 'pph', title: '预扣税PPH', type: 'percentage' },
            { key: 'ppnbm', title: '奢侈品税PPnBM', type: 'percentage' },
            { key: 'bmt', title: '保护关税BMT', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    hungary: {
        name: '匈牙利关务税则维护',
        columns: [
            { key: 'hscode', title: 'Taric', fixed: true },
            { key: 'import_duty', title: '进口关税', type: 'percentage' },
            { key: 'anti_dumping', title: '反倾销税率', type: 'percentage' },
            { key: 'countervailing', title: '反补贴税率', type: 'percentage' },
            { key: 'vat', title: '增值税', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    },
    brazil: {
        name: '巴西关务税则维护',
        columns: [
            { key: 'hscode', title: 'NCM', fixed: true },
            { key: 'ii', title: 'II', type: 'percentage' },
            { key: 'ipi', title: '工业产品税IPI', type: 'percentage' },
            { key: 'pis', title: '社会一体化费PIS', type: 'percentage' },
            { key: 'confins', title: '社会保险融资税CONFINS', type: 'percentage' },
            { key: 'icms', title: '流转税ICMS', type: 'percentage' },
            { key: 'anti_dumping', title: '反倾销税率Anti-dumping', type: 'percentage' },
            { key: 'is_controlled', title: '是否管制', type: 'control' },
            { key: 'control_info', title: '管制信息' },
            { key: 'updated_by', title: '最后更新人' },
            { key: 'updated_time', title: '最后更新时间' },
            { key: 'action', title: '操作', fixed: true }
        ]
    }
};

// 模拟数据（基于CSV文件内容）
const mockData = {
    china: [
        {hscode: '8515900090', tax_rate: '13.0', tariff_rate: '0.0', is_controlled: '否', control_info: '', remarks: '', declaration_elements: '1:品牌类型;2:出口享惠情况;3:是否改良种用;4:品种;5:GTIN;6:CAS;7:其他', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:32:15'},
        {hscode: '7326901990', tax_rate: '13.0', tariff_rate: '5.0', is_controlled: '否', control_info: '', remarks: '', declaration_elements: '1:品牌类型;2:出口享惠情况;5:GTIN;6:CAS;7:其他', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:32:16'},
        {hscode: '8425190000', tax_rate: '13.0', tariff_rate: '0.0', is_controlled: '否', control_info: '', remarks: '特殊商品', declaration_elements: '1:品牌类型;2:出口享惠情况;5:GTIN;6:CAS;7:其他', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:32:17'},
        {hscode: '8205400090', tax_rate: '13.0', tariff_rate: '10.0', is_controlled: '否', control_info: '', remarks: '', declaration_elements: '1:品牌类型;2:出口享惠情况;3:是否改良种用;4:品种;5:GTIN;6:CAS;7:其他', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:32:18'},
        {hscode: '3919909090', tax_rate: '13.0', tariff_rate: '15.0', is_controlled: '是', control_info: '禁止出口！', remarks: '需要特殊审批', declaration_elements: '1:品牌类型;2:出口享惠情况;5:GTIN;6:CAS;7:其他', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:32:19'}
    ],
    thailand: [
        {hscode: '84671100000', mfn_rate: '0', form_e: '0', vat: '7.0', excise_tax: '0', local_tax: '0', anti_dumping: '0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:33:10'},
        {hscode: '39231090000', mfn_rate: '10.0', form_e: '0', vat: '7.0', excise_tax: '0', local_tax: '0', anti_dumping: '0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:33:11'},
        {hscode: '69141000000', mfn_rate: '30.0', form_e: '5.0', vat: '7.0', excise_tax: '0', local_tax: '0', anti_dumping: '0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:33:12'},
        {hscode: '73063099090', mfn_rate: '30.0', form_e: '5.0', vat: '7.0', excise_tax: '0', local_tax: '0', anti_dumping: '66.01', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:33:12'},
        {hscode: '42032910000', mfn_rate: '0.2', form_e: '0.0', vat: '0.07', excise_tax: '0.0', local_tax: '0.0', anti_dumping: '0.0', is_controlled: '是', control_info: '禁止进口！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:33:13'}
    ],
    vietnam: [
        {hscode: '84671900', mfn_rate: '0.0', form_e: '0.0', vat: '10.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:34:05'},
        {hscode: '85318090', mfn_rate: '5.0', form_e: '0.0', vat: '8.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:34:06'},
        {hscode: '82079000', mfn_rate: '5.0', form_e: '0.0', vat: '8.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:34:06'},
        {hscode: '94036090', mfn_rate: '0.0', form_e: '0.0', vat: '10.0', anti_dumping: '15.0', is_controlled: '是', control_info: '越南管制！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:34:07'},
        {hscode: '96170010', mfn_rate: '0.0', form_e: '0.0', vat: '10.0', anti_dumping: '15.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:34:07'}
    ],
    malaysia: [
        {hscode: '8472909000', mfn_rate: '0.0', form_e: '0.0', sst: '10.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:35:20'},
        {hscode: '4820100000', mfn_rate: '20.0', form_e: '0.0', sst: '0.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:35:21'},
        {hscode: '7017900000', mfn_rate: '20.0', form_e: '0.0', sst: '0.0', anti_dumping: '0.0', is_controlled: '是', control_info: '马来管制！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:35:21'},
        {hscode: '3923309000', mfn_rate: '0.0', form_e: '0.0', sst: '10.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:35:20'},
        {hscode: '4823209000', mfn_rate: '0.0', form_e: '0.0', sst: '10.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:35:20'}
    ],
    indonesia: [
        {hscode: '84145999', form_e: '0.0', ppn: '11.0', pph: '2.5', ppnbm: '0.0', bmt: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:36:30'},
        {hscode: '48232010', form_e: '0.0', ppn: '11.0', pph: '2.5', ppnbm: '0.0', bmt: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:36:30'},
        {hscode: '70179000', form_e: '0.0', ppn: '11.0', pph: '2.5', ppnbm: '0.0', bmt: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:36:30'},
        {hscode: '70172000', form_e: '0.0', ppn: '11.0', pph: '2.5', ppnbm: '0.0', bmt: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:36:30'},
        {hscode: '90268000', form_e: '0.0', ppn: '11.0', pph: '2.5', ppnbm: '0.0', bmt: '0.0', is_controlled: '是', control_info: '印尼管制！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:36:31'}
    ],
    hungary: [
        {hscode: '8412310090', import_duty: '4.2', anti_dumping: '0.0', countervailing: '0.0', vat: '27.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:37:45'},
        {hscode: '4503900000', import_duty: '4.2', anti_dumping: '0.0', countervailing: '0.0', vat: '27.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:37:45'},
        {hscode: '3926909790', import_duty: '4.2', anti_dumping: '0.0', countervailing: '0.0', vat: '27.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:37:45'},
        {hscode: '7017900000', import_duty: '4.2', anti_dumping: '0.0', countervailing: '0.0', vat: '27.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:37:45'},
        {hscode: '9017809000', import_duty: '2.7', anti_dumping: '0.0', countervailing: '0.0', vat: '27.0', is_controlled: '是', control_info: '匈牙利管制！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:37:46'}
    ],
    brazil: [
        {hscode: '82075011', ii: '16.2', ipi: '5.2', pis: '2.1', confins: '9.65', icms: '19.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:38:56'},
        {hscode: '39173290', ii: '16.2', ipi: '5.2', pis: '2.1', confins: '9.65', icms: '19.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:38:56'},
        {hscode: '39173300', ii: '16.2', ipi: '5.2', pis: '2.1', confins: '9.65', icms: '19.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:38:56'},
        {hscode: '82075012', ii: '16.2', ipi: '5.2', pis: '2.1', confins: '9.65', icms: '19.0', anti_dumping: '0.0', is_controlled: '否', control_info: '', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:38:56'},
        {hscode: '73269090', ii: '18.0', ipi: '9.75', pis: '2.1', confins: '9.65', icms: '19.0', anti_dumping: '0.0', is_controlled: '是', control_info: '巴西管制！', updated_by: 'lizimeng16', updated_time: '2025-8-25 14:38:57'}
    ]
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    allData = mockData;
    
    // 绑定国家标签切换事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            switchCountry(country);
        });
    });
    
    // 绑定侧边栏关务税则维护菜单项点击事件（保持选中状态，不做跳转）
    document.querySelectorAll('.submenu-item[data-tariff]').forEach(item => {
        item.addEventListener('click', function(event) {
            event.stopPropagation();
            // 保持选中状态，因为我们已经在税则库页面了
            this.classList.add('active');
        });
    });
    
    // 绑定侧边栏其他菜单项点击事件（非税务管理）
    document.querySelectorAll('.submenu-item:not([data-tariff])').forEach(item => {
        item.addEventListener('click', function(event) {
            event.stopPropagation();
            
            // 跳转回首页并传递菜单参数
            const menuText = this.textContent;
            window.location.href = `index.html?menu=${encodeURIComponent(menuText)}`;
        });
    });
    
    // 获取URL参数来确定显示哪个国家
    const urlParams = new URLSearchParams(window.location.search);
    const countryParam = urlParams.get('country') || 'china';
    
    // 绑定页码输入框回车键事件
    document.getElementById('page-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            jumpToPage();
        }
    });
    
    // 初始化显示对应国家数据
    switchCountry(countryParam);
    
    console.log('税则库页面已初始化');
});

// 切换国家
function switchCountry(country) {
    currentCountry = country;
    currentPage = 1;
    
    // 更新标签状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-country="${country}"]`).classList.add('active');
    
    // 面包屑导航保持固定显示"关务税则维护"，不需要更新
    
    // 重新渲染表格
    renderTable();
    updatePagination();
}

// 渲染表格
function renderTable() {
    const config = countryConfig[currentCountry];
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    
    // 渲染表头
    let headerHTML = '<tr>';
    config.columns.forEach(col => {
        let className = '';
        if (col.fixed) {
            if (col.key === 'hscode') {
                className = 'fixed-column hscode-column';
            } else if (col.key === 'action') {
                className = 'fixed-column action-column';
            }
        }
        headerHTML += `<th class="${className}">${col.title}</th>`;
    });
    headerHTML += '</tr>';
    tableHeader.innerHTML = headerHTML;
    
    // 获取当前页数据
    filteredData = allData[currentCountry] || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // 渲染表格数据
    let bodyHTML = '';
    pageData.forEach((row, index) => {
        bodyHTML += '<tr>';
        config.columns.forEach(col => {
            let className = '';
            let content = '';
            
            if (col.fixed) {
                if (col.key === 'hscode') {
                    className = 'fixed-column hscode-column';
                } else if (col.key === 'action') {
                    className = 'fixed-column action-column';
                }
            }
            
            if (col.key === 'action') {
                content = '<a href="#" class="edit-btn" onclick="editRow(' + (startIndex + index) + ')">编辑</a>';
            } else if (col.type === 'percentage') {
                const value = parseFloat(row[col.key] || '0');
                content = `<span class="numeric${value > 0 ? ' percentage' : ''}">${value}</span>`;
            } else if (col.type === 'control') {
                const isControlled = row[col.key] === '是';
                content = `<span class="control-status ${isControlled ? 'control-yes' : 'control-no'}">${row[col.key] || '否'}</span>`;
            } else if (col.key === 'declaration_elements') {
                // 申报要素字段特殊处理，将分号分隔的内容格式化显示
                const elements = row[col.key] || '';
                if (elements) {
                    const elementList = elements.split(';').map(item => item.trim()).filter(item => item);
                    content = `<div class="declaration-elements">${elementList.join('<br>')}</div>`;
                } else {
                    content = '-';
                }
            } else {
                content = row[col.key] || '';
            }
            
            bodyHTML += `<td class="${className}">${content}</td>`;
        });
        bodyHTML += '</tr>';
    });
    
    if (pageData.length === 0) {
        bodyHTML = `<tr><td colspan="${config.columns.length}" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>`;
    }
    
    tableBody.innerHTML = bodyHTML;
}

// 更新分页信息
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    document.getElementById('page-info').textContent = `第${currentPage}页，共${totalPages}页`;
    document.getElementById('total-records').textContent = filteredData.length;
    
    document.getElementById('prev-btn').disabled = currentPage <= 1;
    document.getElementById('next-btn').disabled = currentPage >= totalPages;
    
    // 更新页码输入框的最大值
    const pageInput = document.getElementById('page-input');
    pageInput.max = totalPages;
    pageInput.value = '';
}

// 搜索功能
function searchTariff() {
    const input = document.getElementById('hscode-input').value.trim();
    if (!input) {
        filteredData = allData[currentCountry] || [];
    } else {
        const searchTerms = input.split('\n').map(term => term.trim()).filter(term => term);
        const originalData = allData[currentCountry] || [];
        
        filteredData = originalData.filter(row => {
            const hscode = row.hscode || '';
            return searchTerms.some(term => hscode.includes(term));
        });
    }
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

// 重置搜索
function resetSearch() {
    document.getElementById('hscode-input').value = '';
    filteredData = allData[currentCountry] || [];
    currentPage = 1;
    renderTable();
    updatePagination();
}

// 新增记录
function addTariff() {
    alert('新增功能待开发');
}

// 批量操作
function batchOperation() {
    alert('批量操作功能待开发');
}

// 编辑记录
function editRow(index) {
    const row = filteredData[index];
    if (currentCountry === 'china') {
        openChinaEditModal(row);
    } else {
        alert(`编辑记录: ${row.hscode}`);
    }
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
    }
}

// 下一页
function nextPage() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
    }
}

// 跳转到指定页
function jumpToPage() {
    const pageInput = document.getElementById('page-input');
    const targetPage = parseInt(pageInput.value);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderTable();
        updatePagination();
        pageInput.value = '';
    } else {
        alert(`请输入1-${totalPages}之间的页码`);
        pageInput.focus();
    }
}

// 中国HSCODE编辑相关功能
let currentEditingRow = null;
let currentDeclarationElements = [];

// 打开中国HSCODE编辑弹窗
function openChinaEditModal(row) {
    currentEditingRow = row;
    
    // 填充基本信息
    document.getElementById('edit-hscode').textContent = row.hscode;
    document.getElementById('edit-update-time').textContent = row.updated_time;
    
    // 填充税率信息
    document.getElementById('edit-tax-rate').value = row.tax_rate || '';
    document.getElementById('edit-tariff-rate').value = row.tariff_rate || '';
    
    // 填充管制信息
    document.getElementById('edit-is-controlled').value = row.is_controlled || '否';
    document.getElementById('edit-control-info').value = row.control_info || '';
    document.getElementById('edit-remarks').value = row.remarks || '';
    
    // 处理管制信息显示逻辑
    toggleControlInfo();
    
    // 初始化申报要素配置
    initDeclarationElements(row.declaration_elements || '');
    
    // 显示弹窗
    document.getElementById('china-edit-modal').style.display = 'flex';
}

// 关闭中国HSCODE编辑弹窗
function closeChinaEditModal() {
    document.getElementById('china-edit-modal').style.display = 'none';
    currentEditingRow = null;
    currentDeclarationElements = [];
}

// 切换管制信息显示
function toggleControlInfo() {
    const isControlled = document.getElementById('edit-is-controlled').value;
    const controlInfoGroup = document.getElementById('control-info-group');
    
    if (isControlled === '是') {
        controlInfoGroup.style.display = 'block';
        document.getElementById('edit-control-info').required = true;
    } else {
        controlInfoGroup.style.display = 'none';
        document.getElementById('edit-control-info').required = false;
        document.getElementById('edit-control-info').value = '';
    }
}

// 初始化申报要素配置
function initDeclarationElements(elementsString) {
    // 固定的前两项和后三项
    const fixedElements = [
        { id: 1, name: '品牌类型', required: true, fixed: true },
        { id: 2, name: '出口享惠情况', required: true, fixed: true },
        { id: -3, name: 'GTIN', required: false, fixed: true },
        { id: -2, name: 'CAS', required: false, fixed: true },
        { id: -1, name: '其他', required: false, fixed: true }
    ];
    
    // 解析现有的申报要素
    const existingElements = [];
    if (elementsString) {
        const elements = elementsString.split(';');
        elements.forEach(element => {
            const [idPart, name] = element.split(':');
            const id = parseInt(idPart);
            if (id > 2 && id < 5) { // 中间可配置的项目
                existingElements.push({
                    id: id,
                    name: name,
                    required: true, // 默认必填
                    fixed: false
                });
            }
        });
    }
    
    // 合并固定项和可配置项
    currentDeclarationElements = [
        ...fixedElements.slice(0, 2), // 前两项固定
        ...existingElements, // 中间可配置项
        ...fixedElements.slice(2) // 后三项固定
    ];
    
    renderDeclarationElements();
}

// 渲染申报要素配置列表
function renderDeclarationElements() {
    const tbody = document.getElementById('declaration-elements-tbody');
    let html = '';
    
    currentDeclarationElements.forEach((element, index) => {
        const isFixed = element.fixed;
        const sortOrder = element.id > 0 ? element.id : element.id + 1000; // 负数转换为正数排序
        
        html += `
            <tr data-index="${index}">
                <td>${sortOrder}</td>
                <td>
                    ${isFixed ? 
                        `<span>${element.name}</span>` : 
                        `<input type="text" value="${element.name}" onchange="updateElementName(${index}, this.value)">`
                    }
                </td>
                <td>
                    <select ${isFixed ? 'disabled' : ''} onchange="updateElementRequired(${index}, this.value)">
                        <option value="true" ${element.required ? 'selected' : ''}>是</option>
                        <option value="false" ${!element.required ? 'selected' : ''}>否</option>
                    </select>
                </td>
                <td>
                    ${!isFixed ? 
                        `<button onclick="removeElement(${index})" class="btn-remove">删除</button>
                         <button onclick="moveElementUp(${index})" ${index <= 2 ? 'disabled' : ''} class="btn-move">↑</button>
                         <button onclick="moveElementDown(${index})" ${index >= currentDeclarationElements.length - 4 ? 'disabled' : ''} class="btn-move">↓</button>` : 
                        `<span class="fixed-item">固定项</span>`
                    }
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// 添加申报要素项
function addDeclarationElement() {
    const newElement = {
        id: getNextAvailableId(),
        name: '新要素项',
        required: true,
        fixed: false
    };
    
    // 插入到倒数第三项之前（GTIN之前）
    const insertIndex = currentDeclarationElements.length - 3;
    currentDeclarationElements.splice(insertIndex, 0, newElement);
    
    renderDeclarationElements();
}

// 获取下一个可用的ID（排序递增+1）
function getNextAvailableId() {
    // 获取中间部分（非固定）要素项的最大ID
    // 固定要素项：1,2（前两项），-3,-2,-1（最后三项）
    const middleElements = currentDeclarationElements.filter(el => !el.fixed && el.id > 2 && el.id > 0);
    if (middleElements.length === 0) {
        return 3; // 如果没有中间要素项，从3开始
    }
    
    // 找到最大的ID并+1
    const maxId = Math.max(...middleElements.map(el => el.id));
    return maxId + 1;
}

// 更新要素项名称
function updateElementName(index, name) {
    currentDeclarationElements[index].name = name;
}

// 更新要素项必填状态
function updateElementRequired(index, required) {
    currentDeclarationElements[index].required = required === 'true';
}

// 删除要素项
function removeElement(index) {
    if (!currentDeclarationElements[index].fixed) {
        currentDeclarationElements.splice(index, 1);
        renderDeclarationElements();
    }
}

// 上移要素项
function moveElementUp(index) {
    if (index > 2 && index < currentDeclarationElements.length - 3) {
        [currentDeclarationElements[index], currentDeclarationElements[index - 1]] = 
        [currentDeclarationElements[index - 1], currentDeclarationElements[index]];
        renderDeclarationElements();
    }
}

// 下移要素项
function moveElementDown(index) {
    if (index >= 2 && index < currentDeclarationElements.length - 4) {
        [currentDeclarationElements[index], currentDeclarationElements[index + 1]] = 
        [currentDeclarationElements[index + 1], currentDeclarationElements[index]];
        renderDeclarationElements();
    }
}

// 保存中国HSCODE编辑
function saveChinaEdit() {
    // 验证必填字段
    const taxRate = document.getElementById('edit-tax-rate').value;
    const isControlled = document.getElementById('edit-is-controlled').value;
    const controlInfo = document.getElementById('edit-control-info').value;
    
    if (!taxRate) {
        alert('请填写出口退税率');
        return;
    }
    
    if (isControlled === '是' && !controlInfo) {
        alert('请填写管制信息');
        return;
    }
    
    // 生成申报要素字符串
    const declarationElementsString = currentDeclarationElements
        .map((el, index) => `${index + 1}:${el.name}`)
        .join(';');
    
    // 更新数据
    currentEditingRow.tax_rate = taxRate;
    currentEditingRow.tariff_rate = document.getElementById('edit-tariff-rate').value;
    currentEditingRow.is_controlled = isControlled;
    currentEditingRow.control_info = controlInfo;
    currentEditingRow.remarks = document.getElementById('edit-remarks').value;
    currentEditingRow.declaration_elements = declarationElementsString;
    currentEditingRow.updated_time = new Date().toLocaleString('zh-CN');
    currentEditingRow.updated_by = 'current_user'; // 实际使用时应该是当前用户
    
    // 重新渲染表格
    renderTable();
    
    // 关闭弹窗
    closeChinaEditModal();
    
    alert('保存成功！');
}
