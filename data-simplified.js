// 简化版数据生成器

// 公共字段模板
const commonFields = {
    serviceProvider: '',
    dataSource: '',
    salesErp: 'lizimeng17',
    creator: 'lizimeng18',
    salesNote: '-',
    updater: 'lizimeng18'
};

// 公共列配置模板
const commonColumns = [
    { key: 'checkbox', title: '', fixed: 'left', width: 50, checkbox: true },
    { key: 'domesticSku', title: '国内SKU', fixed: 'left', width: 120 },
    { key: 'internationalSku', title: '国际SKU', width: 120 },
    { key: 'productName', title: '商品中文名称', width: 200 },
];

const commonEndColumns = [
    { key: 'isControlled', title: '是否管制', width: 80 },
    { key: 'controlInfo', title: '管制信息', width: 150 },
    { key: 'serviceProvider', title: '评估服务商', width: 100 },
    { key: 'dataSource', title: '数据来源', width: 100 },
    { key: 'salesErp', title: '采销ERP', width: 100 },
    { key: 'deadline', title: '评估截止时间', width: 120 },
    { key: 'customsStatus', title: '关务评估状态', width: 120 },
    { key: 'certStatus', title: '强制性认证状态', width: 140 },
    { key: 'productStatus', title: '商品评估状态', width: 120 },
    { key: 'hasOrder', title: '是否产生订单', width: 100 },
    { key: 'elementStatus', title: '要素状态', width: 100 },
    { key: 'creator', title: '创建人', width: 100 },
    { key: 'salesNote', title: '采销备注', width: 150 },
    { key: 'createTime', title: '创建时间', width: 120 },
    { key: 'updater', title: '更新人', width: 100 },
    { key: 'updateTime', title: '更新时间', width: 120 },
    { key: 'actions', title: '操作', fixed: 'right', width: 80 }
];

// 产品数据模板
const productTemplates = [
    {
        productName: 'Marluvas 工装鞋 PVC头 700349 CA41370 巴西码37',
        hscode: '3926909090'
    },
    {
        productName: 'Honeywell 防护耳罩 降噪型 H10A 工业级安全防护',
        hscode: '8518300000'
    },
    {
        productName: '3M 工业电缆 USB3.0 抗干扰型 M8连接器 IP67防护',
        hscode: '8544429000'
    },
    {
        productName: 'Schneider 工业UPS电源 24V 5000mAh 防爆认证 EX-i',
        hscode: '8507600000'
    },
    {
        productName: 'Siemens 工业无线充电模块 Qi标准 IP65防护 24V输出',
        hscode: '8504403000'
    }
];

// 状态选项
const statusOptions = {
    customsStatus: ['pending-submit', 'pending-confirm', 'confirmed'],
    certStatus: ['pending-submit', 'submitted', 'confirmed'],
    productStatus: ['inactive', 'active'],
    elementStatus: ['pending-submit', 'pending-confirm', 'confirmed'],
    hasOrder: ['是', '否'],
    isControlled: ['是', '否']
};

// 数据生成工厂函数
function generateProductData(countryConfig, count = 5) {
    return Array.from({ length: count }, (_, index) => {
        const template = productTemplates[index % productTemplates.length];
        const baseId = `10000${index + 1}234567${index}`;
        const intlId = `80000${index + 1}234567${index}`;
        
        const baseData = {
            domesticSku: baseId,
            internationalSku: intlId,
            productName: template.productName,
            hscode: template.hscode,
            isControlled: getRandomStatus('isControlled'),
            controlInfo: Math.random() > 0.7 ? '需要认证' : '',
            declarationElements: '-',
            declarationNameCn: '-',
            declarationNameEn: '-',
            deadline: `2024-0${3 + index}-${10 + index * 5}`,
            customsStatus: getRandomStatus('customsStatus'),
            certStatus: getRandomStatus('certStatus'),
            productStatus: getRandomStatus('productStatus'),
            hasOrder: getRandomStatus('hasOrder'),
            elementStatus: getRandomStatus('elementStatus'),
            createTime: `2024-01-${15 + index} 09:30:25`,
            updateTime: `2024-01-${20 + index} 14:25:30`,
            ...commonFields,
            ...countryConfig
        };

        return baseData;
    });
}

// 随机状态生成器
function getRandomStatus(type) {
    const options = statusOptions[type];
    return options[Math.floor(Math.random() * options.length)];
}

// 列配置生成器
function generateColumns(countrySpecificColumns, hscodeName) {
    return [
        ...commonColumns,
        { key: 'hscode', title: hscodeName, width: 120 },
        ...countrySpecificColumns,
        ...commonEndColumns
    ];
}

// 国家特定配置
const countryConfigs = {
    china: {
        exportTaxRate: 13,
        exportTariffRate: 0
    },
    thailand: {
        mfnRate: () => Math.floor(Math.random() * 20),
        formE: () => Math.floor(Math.random() * 20),
        vat: () => Math.floor(Math.random() * 20),
        exciseTax: () => Math.floor(Math.random() * 20),
        localTax: () => Math.floor(Math.random() * 20),
        antiDumping: () => Math.floor(Math.random() * 20),
    },
    indonesia: {
        formE: () => Math.floor(Math.random() * 10),
        ppn: () => Math.floor(Math.random() * 15) + 5,
        pph: () => Math.floor(Math.random() * 10),
        ppnbm: () => Math.floor(Math.random() * 20),
        bmt: () => Math.floor(Math.random() * 25)
    },
    hungary: {
        importDuty: () => Math.floor(Math.random() * 15),
        antiDumping: () => Math.floor(Math.random() * 10),
        countervailing: () => Math.floor(Math.random() * 5),
        vat: () => Math.floor(Math.random() * 10) + 15
    },
    brazil: {
        ii: () => Math.floor(Math.random() * 20),
        ipi: () => Math.floor(Math.random() * 15),
        pis: () => Math.floor(Math.random() * 5),
        confins: () => Math.floor(Math.random() * 10),
        icms: () => Math.floor(Math.random() * 20),
        antiDumping: () => Math.floor(Math.random() * 15)
    },
    vietnam: {
        mfnRate: () => Math.floor(Math.random() * 25),
        vat: () => Math.floor(Math.random() * 5) + 5,
        exciseTax: () => Math.floor(Math.random() * 10),
        environmentTax: () => Math.floor(Math.random() * 8)
    },
    malaysia: {
        importDuty: () => Math.floor(Math.random() * 30),
        salesTax: () => Math.floor(Math.random() * 10),
        serviceTax: () => Math.floor(Math.random() * 6),
        exciseDuty: () => Math.floor(Math.random() * 15)
    }
};

// 国家特定列配置
const countrySpecificColumns = {
    china: [
        { key: 'exportTaxRate', title: '出口退税率%', width: 120, numeric: true },
        { key: 'exportTariffRate', title: '出口关税率%', width: 120, numeric: true }
    ],
    thailand: [
        { key: 'mfnRate', title: 'MFN税率%', width: 100, numeric: true },
        { key: 'formE', title: 'Form E%', width: 100, numeric: true },
        { key: 'vat', title: '增值税VAT%', width: 100, numeric: true },
        { key: 'exciseTax', title: '消费税%', width: 100, numeric: true },
        { key: 'localTax', title: '地方税%', width: 100, numeric: true },
        { key: 'antiDumping', title: '反倾销税率', width: 120, numeric: true }
    ],
    indonesia: [
        { key: 'formE', title: 'Form E%', width: 100, numeric: true },
        { key: 'ppn', title: '增值税PPN%', width: 100, numeric: true },
        { key: 'pph', title: '所得税PPH%', width: 100, numeric: true },
        { key: 'ppnbm', title: '奢侈品税PPNBM%', width: 120, numeric: true },
        { key: 'bmt', title: '进口税BMT%', width: 120, numeric: true }
    ],
    hungary: [
        { key: 'importDuty', title: '进口关税Import Duty%', width: 140, numeric: true },
        { key: 'antiDumping', title: '反倾销税率', width: 120, numeric: true },
        { key: 'countervailing', title: '反补贴税率', width: 120, numeric: true },
        { key: 'vat', title: '增值税VAT%', width: 100, numeric: true }
    ],
    brazil: [
        { key: 'ii', title: '进口税II%', width: 100, numeric: true },
        { key: 'ipi', title: '工业产品税IPI%', width: 120, numeric: true },
        { key: 'pis', title: '社会一体化税PIS%', width: 140, numeric: true },
        { key: 'confins', title: '社会保障融资税COFINS%', width: 160, numeric: true },
        { key: 'icms', title: '商品流通税ICMS%', width: 120, numeric: true },
        { key: 'antiDumping', title: '反倾销税率', width: 120, numeric: true }
    ],
    vietnam: [
        { key: 'mfnRate', title: 'MFN税率%', width: 100, numeric: true },
        { key: 'vat', title: '增值税VAT%', width: 100, numeric: true },
        { key: 'exciseTax', title: '消费税%', width: 100, numeric: true },
        { key: 'environmentTax', title: '环境保护税%', width: 120, numeric: true }
    ],
    malaysia: [
        { key: 'importDuty', title: '进口关税%', width: 100, numeric: true },
        { key: 'salesTax', title: '销售税SST%', width: 100, numeric: true },
        { key: 'serviceTax', title: '服务税%', width: 100, numeric: true },
        { key: 'exciseDuty', title: '消费税%', width: 100, numeric: true }
    ]
};

// 处理动态值
function processConfig(config) {
    const processed = {};
    for (const [key, value] of Object.entries(config)) {
        processed[key] = typeof value === 'function' ? value() : value;
    }
    return processed;
}

// 生成最终数据
const staticMockData = {};
const tableColumns = {};

Object.keys(countryConfigs).forEach(country => {
    const config = processConfig(countryConfigs[country]);
    staticMockData[country] = generateProductData(config);
    
    const hscodeName = {
        china: '中国HSCODE',
        thailand: '泰国HSCODE',
        indonesia: '印尼HSCODE',
        hungary: 'TARIC',
        brazil: 'NCM',
        vietnam: '越南HSCODE',
        malaysia: '马来HSCODE'
    }[country];
    
    tableColumns[country] = generateColumns(
        countrySpecificColumns[country] || [],
        hscodeName
    );
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { staticMockData, tableColumns };
} else {
    window.staticMockData = staticMockData;
    window.tableColumns = tableColumns;
}