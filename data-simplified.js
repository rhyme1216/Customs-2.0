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
    { key: 'productImage', title: '图片', width: 80 },
    { key: 'productName', title: '商品中文名称', width: 200 },
];

// 中国的列配置（包含要素状态，不包含强制性认证）
const chinaEndColumns = [
    { key: 'isControlled', title: '是否管制', width: 80 },
    { key: 'controlInfo', title: '管制信息', width: 150 },
    { key: 'serviceProvider', title: '评估服务商', width: 100 },
    { key: 'dataSource', title: '数据来源', width: 100 },
    { key: 'salesErp', title: '采销ERP', width: 100 },
    { key: 'deadline', title: '评估截止时间', width: 120 },
    { key: 'customsStatus', title: '关务评估状态', width: 120 },
    { key: 'productStatus', title: '商品评估状态', width: 120 },
    { key: 'hasOrder', title: '是否产生订单', width: 100 },
    { key: 'firstOrderTime', title: '首次产生订单时间', width: 140 },
    { key: 'declarationElements', title: '申报要素', width: 180 },
    { key: 'declarationNameCn', title: '申报中文品名', width: 150 },
    { key: 'elementStatus', title: '要素状态', width: 100 },
    { key: 'creator', title: '创建人', width: 100 },
    { key: 'salesNote', title: '采销备注', width: 150 },
    { key: 'createTime', title: '创建时间', width: 120 },
    { key: 'updater', title: '更新人', width: 100 },
    { key: 'updateTime', title: '更新时间', width: 120 },
    { key: 'actions', title: '操作', fixed: 'right', width: 80 }
];

// 其他国家的列配置（包含申报品名和要素状态）
const otherCountryEndColumns = [
    { key: 'isControlled', title: '是否管制', width: 80 },
    { key: 'controlInfo', title: '管制信息', width: 150 },
    { key: 'isMandatoryCert', title: '是否强制性认证', width: 120 },
    { key: 'mandatoryCertInfo', title: '强制性认证信息', width: 150 },
    { key: 'serviceProvider', title: '评估服务商', width: 100 },
    { key: 'dataSource', title: '数据来源', width: 100 },
    { key: 'salesErp', title: '采销ERP', width: 100 },
    { key: 'deadline', title: '评估截止时间', width: 120 },
    { key: 'customsStatus', title: '关务评估状态', width: 120 },
    { key: 'certStatus', title: '强制性认证状态', width: 140 },
    { key: 'productStatus', title: '商品评估状态', width: 120 },
    { key: 'hasOrder', title: '是否产生订单', width: 100 },
    { key: 'firstOrderTime', title: '首次产生订单时间', width: 140 },
    { key: 'declarationNameEn', title: '申报英文品名', width: 150 },
    { key: 'declarationNameLocal', title: '申报当地品名', width: 150 },
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
        productNameEn: 'Marluvas Work Shoes PVC Head 700349 CA41370 Brazil Size 37',
        hscode: '3926909090',
        brand: 'Marluvas',
        model: 'CA41370'
    },
    {
        productName: 'Honeywell 防护耳罩 降噪型 H10A 工业级安全防护',
        productNameEn: 'Honeywell Protective Earmuffs Noise Reduction H10A Industrial Safety',
        hscode: '8518300000',
        brand: 'Honeywell',
        model: 'H10A'
    },
    {
        productName: '3M 工业电缆 USB3.0 抗干扰型 M8连接器 IP67防护',
        productNameEn: '3M Industrial Cable USB3.0 Anti-interference M8 Connector IP67 Protection',
        hscode: '8544429000',
        brand: '3M',
        model: 'M8-USB3.0'
    },
    {
        productName: 'Schneider 工业UPS电源 24V 5000mAh 防爆认证 EX-i',
        productNameEn: 'Schneider Industrial UPS Power 24V 5000mAh Explosion-proof Certified EX-i',
        hscode: '8507600000',
        brand: 'Schneider',
        model: 'UPS-24V-5000'
    },
    {
        productName: 'Siemens 工业无线充电模块 Qi标准 IP65防护 24V输出',
        productNameEn: 'Siemens Industrial Wireless Charging Module Qi Standard IP65 Protection 24V Output',
        hscode: '8504403000',
        brand: 'Siemens',
        model: 'QI-24V'
    }
];

// 各国语种名称映射
const localizedProductNames = {
    thailand: [
        'รองเท้าทำงาน Marluvas หัว PVC 700349 CA41370 ไซส์บราซิล 37',
        'ที่ปิดหูป้องกัน Honeywell ลดเสียงรบกวน H10A ระดับอุตสาหกรรม',
        'สายเคเบิลอุตสาหกรรม 3M USB3.0 ป้องกันสัญญาณรบกวน ขั้วต่อ M8 ป้องกัน IP67',
        'แหล่งจ่ายไฟ UPS อุตสาหกรรม Schneider 24V 5000mAh ได้รับการรับรองป้องกันการระเบิด EX-i',
        'โมดูลชาร์จไร้สาย Siemens อุตสาหกรรม มาตรฐาน Qi ป้องกัน IP65 เอาท์พุท 24V'
    ],
    indonesia: [
        'Sepatu Kerja Marluvas Kepala PVC 700349 CA41370 Ukuran Brasil 37',
        'Penutup Telinga Pelindung Honeywell Peredam Bising H10A Tingkat Industri',
        'Kabel Industri 3M USB3.0 Anti Interferensi Konektor M8 Perlindungan IP67',
        'Sumber Daya UPS Industri Schneider 24V 5000mAh Bersertifikat Tahan Ledakan EX-i',
        'Modul Pengisian Nirkabel Industri Siemens Standar Qi Perlindungan IP65 Output 24V'
    ],
    hungary: [
        'Marluvas Munkacipő PVC Fejjel 700349 CA41370 Brazil Méret 37',
        'Honeywell Védő Fülvédő Zajcsökkentő H10A Ipari Szintű',
        '3M Ipari Kábel USB3.0 Interferencia Ellen M8 Csatlakozó IP67 Védelem',
        'Schneider Ipari UPS Tápegység 24V 5000mAh Robbanásbiztos Tanúsított EX-i',
        'Siemens Ipari Vezeték Nélküli Töltő Modul Qi Szabvány IP65 Védelem 24V Kimenet'
    ],
    brazil: [
        'Sapato de Trabalho Marluvas Cabeça PVC 700349 CA41370 Tamanho Brasil 37',
        'Protetor Auricular Honeywell Redutor de Ruído H10A Nível Industrial',
        'Cabo Industrial 3M USB3.0 Anti Interferência Conector M8 Proteção IP67',
        'Fonte UPS Industrial Schneider 24V 5000mAh Certificado à Prova de Explosão EX-i',
        'Módulo de Carregamento Sem Fio Industrial Siemens Padrão Qi Proteção IP65 Saída 24V'
    ],
    vietnam: [
        'Giày Công Việc Marluvas Đầu PVC 700349 CA41370 Cỡ Brazil 37',
        'Nút Tai Bảo Vệ Honeywell Giảm Tiếng Ồn H10A Cấp Công Nghiệp',
        'Cáp Công Nghiệp 3M USB3.0 Chống Nhiễu Kết Nối M8 Bảo Vệ IP67',
        'Nguồn UPS Công Nghiệp Schneider 24V 5000mAh Chứng Nhận Chống Nổ EX-i',
        'Module Sạc Không Dây Công Nghiệp Siemens Tiêu Chuẩn Qi Bảo Vệ IP65 Đầu Ra 24V'
    ],
    malaysia: [
        'Kasut Kerja Marluvas Kepala PVC 700349 CA41370 Saiz Brazil 37',
        'Penutup Telinga Pelindung Honeywell Pengurangan Bunyi H10A Gred Industri',
        'Kabel Industri 3M USB3.0 Anti Gangguan Penyambung M8 Perlindungan IP67',
        'Bekalan Kuasa UPS Industri Schneider 24V 5000mAh Diperakui Kalis Letupan EX-i',
        'Modul Pengecasan Tanpa Wayar Industri Siemens Piawaian Qi Perlindungan IP65 Output 24V'
    ]
};

// 状态选项
const statusOptions = {
    customsStatus: ['pending-submit', 'pending-confirm', 'confirmed'],
    certStatus: ['pending-submit', 'submitted'],
    productStatus: ['inactive', 'active'],
    elementStatus: ['pending-submit', 'pending-confirm', 'confirmed'],
    hasOrder: ['是', '否'],
    isControlled: ['是', '否'],
    isMandatoryCert: ['是', '否'],
    brandAuth: ['按项目授权（一单一议）', '按时间授权(期间)', '无需出口授权']
};

// 智能状态生成器 - 根据业务逻辑生成合理的状态组合
function generateSmartStatuses(isChina = false, forceElementPending = false) {
    const customsStatus = getRandomStatus('customsStatus');
    let certStatus = 'pending-submit';
    let productStatus = 'inactive';
    let elementStatus = getRandomStatus('elementStatus');
    
    // 如果需要强制生成要素待确认状态的数据
    if (forceElementPending) {
        elementStatus = Math.random() > 0.5 ? 'pending-submit' : 'pending-confirm';
    }
    
    // 中国TAB的逻辑：没有认证评估
    if (isChina) {
        certStatus = 'confirmed'; // 中国默认认证已确认（因为不需要认证评估）
        // 商品状态只依赖关务状态
        if (customsStatus === 'confirmed') {
            productStatus = 'active';
        }
    } else {
        // 其他国家的逻辑：需要认证评估
        certStatus = getRandomStatus('certStatus');
        // 商品状态依赖关务和认证状态
        if (customsStatus === 'confirmed' && certStatus === 'submitted') {
            productStatus = 'active';
        }
    }
    
    return {
        customsStatus,
        certStatus,
        productStatus,
        elementStatus
    };
}

// 生成当地语言申报品名
function getLocalizedDeclarationName(countryKey, template) {
    const localizedNames = {
        thailand: `อุปกรณ์อุตสาหกรรม ${template.brand} ${template.model}`,
        indonesia: `Peralatan Industri ${template.brand} ${template.model}`,
        hungary: `Ipari Berendezés ${template.brand} ${template.model}`,
        brazil: `Equipamento Industrial ${template.brand} ${template.model}`,
        vietnam: `Thiết bị Công nghiệp ${template.brand} ${template.model}`,
        malaysia: `Peralatan Industri ${template.brand} ${template.model}`
    };
    
    return localizedNames[countryKey] || `${template.brand} ${template.model} Industrial Equipment`;
}

// 数据生成工厂函数
function generateProductData(countryConfig, count = 5, isChina = false, countryKey = '') {
    return Array.from({ length: count }, (_, index) => {
        const template = productTemplates[index % productTemplates.length];
        const baseId = `10000${index + 1}234567${index}`;
        const intlId = `80000${index + 1}234567${index}`;
        
        const isControlled = getRandomStatus('isControlled');
        // 为中国TAB生成更多要素待确认状态的数据
        const forceElementPending = isChina && index < 3; // 前3条数据强制生成要素待确认状态
        const statuses = generateSmartStatuses(isChina, forceElementPending);
        
        const baseData = {
            domesticSku: baseId,
            internationalSku: intlId,
            productImage: `placeholder-${index + 1}.jpg`, // 添加图片占位符
            productName: template.productName,
            hscode: template.hscode,
            brand: template.brand || '未知品牌',
            model: template.model || 'M' + baseId.slice(-3),
            brandType: Math.floor(Math.random() * 5), // 随机生成0-4的品牌类型
            brandAuth: getRandomStatus('brandAuth'), // 从4个枚举值中随机选择
            isControlled: isControlled,
            controlInfo: isControlled === '是' ? '存在管制' : '',
            declarationElements: (statuses.elementStatus === 'confirmed' || statuses.elementStatus === 'pending-confirm') ? 
                `品牌类型:${Math.floor(Math.random() * 5)}|英文品牌名:${template.brand}|型号:${template.model}|用途:工业用` : '',
            declarationNameCn: (statuses.elementStatus === 'confirmed' || statuses.elementStatus === 'pending-confirm') ? 
                `工业品` : '',
            declarationNameEn: (statuses.elementStatus === 'confirmed' || statuses.elementStatus === 'pending-confirm') ? 
                `${template.brand} ${template.model} Industrial Equipment` : '',
            declarationNameLocal: (statuses.elementStatus === 'confirmed' || statuses.elementStatus === 'pending-confirm') ? 
                getLocalizedDeclarationName(countryKey, template) : '',
            deadline: `2024-0${3 + index}-${10 + index * 5}`,
            customsStatus: statuses.customsStatus,
            certStatus: statuses.certStatus,
            productStatus: statuses.productStatus,
        };
        
        // 为非中国TAB添加英文和当地语种名称
        if (!isChina) {
            baseData.productNameEn = template.productNameEn || `${template.brand} ${template.model} Product`;
            if (countryKey && localizedProductNames[countryKey]) {
                baseData.productNameLocal = localizedProductNames[countryKey][index % localizedProductNames[countryKey].length];
            } else {
                baseData.productNameLocal = template.productNameEn || `${template.brand} ${template.model} Product`;
            }
        }
        
        // 先确定是否产生订单
        const hasOrderValue = forceElementPending ? '是' : getRandomStatus('hasOrder');
        baseData.hasOrder = hasOrderValue;
        
        // 根据是否产生订单来生成首次产生订单时间
        baseData.firstOrderTime = hasOrderValue === '是' ? 
            `2024-0${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 28) + 1} ${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
            '-';
            
        baseData.elementStatus = statuses.elementStatus;
        baseData.createTime = `2024-01-${15 + index} 09:30:25`;
        baseData.updateTime = `2024-01-${20 + index} 14:25:30`;
        
        // 合并公共字段和国家配置
        Object.assign(baseData, commonFields, countryConfig);
        
        // 只有非中国TAB才添加强制性认证字段
        if (!isChina) {
            const isMandatoryCert = getRandomStatus('isMandatoryCert');
            baseData.isMandatoryCert = isMandatoryCert;
            baseData.mandatoryCertInfo = isMandatoryCert === '是' ?
                ['CE认证', '3C认证', 'FCC认证', 'UL认证', 'ISO认证'][Math.floor(Math.random() * 5)] : '';
        }

        return baseData;
    });
}

// 随机状态生成器
function getRandomStatus(type) {
    const options = statusOptions[type];
    return options[Math.floor(Math.random() * options.length)];
}

// 列配置生成器
function generateColumns(countrySpecificColumns, hscodeName, isChina = false, countryName = '') {
    let endColumns;
    if (isChina) {
        endColumns = chinaEndColumns;
    } else {
        // 为非中国国家动态创建列配置，申报当地品名根据国家命名
        endColumns = [
            { key: 'isControlled', title: '是否管制', width: 80 },
            { key: 'controlInfo', title: '管制信息', width: 150 },
            { key: 'isMandatoryCert', title: '是否强制性认证', width: 120 },
            { key: 'mandatoryCertInfo', title: '强制性认证信息', width: 150 },
            { key: 'serviceProvider', title: '评估服务商', width: 100 },
            { key: 'dataSource', title: '数据来源', width: 100 },
            { key: 'salesErp', title: '采销ERP', width: 100 },
            { key: 'deadline', title: '评估截止时间', width: 120 },
            { key: 'customsStatus', title: '关务评估状态', width: 120 },
            { key: 'certStatus', title: '强制性认证状态', width: 140 },
            { key: 'productStatus', title: '商品评估状态', width: 120 },
            { key: 'hasOrder', title: '是否产生订单', width: 100 },
            { key: 'firstOrderTime', title: '首次产生订单时间', width: 140 },
            { key: 'declarationNameEn', title: '申报英文品名', width: 150 },
            { key: 'declarationNameLocal', title: `申报${countryName}品名`, width: 150 },
            { key: 'elementStatus', title: '要素状态', width: 100 },
            { key: 'creator', title: '创建人', width: 100 },
            { key: 'salesNote', title: '采销备注', width: 150 },
            { key: 'createTime', title: '创建时间', width: 120 },
            { key: 'updater', title: '更新人', width: 100 },
            { key: 'updateTime', title: '更新时间', width: 120 },
            { key: 'actions', title: '操作', fixed: 'right', width: 80 }
        ];
    }
    
    // 为非中国TAB添加商品英文名称和当地语种名称列
    const nameColumns = isChina ? [] : [
        { key: 'productNameEn', title: '商品英文名称', width: 180 },
        { key: 'productNameLocal', title: `商品${countryName}名称`, width: 180 }
    ];
    
    return [
        ...commonColumns,
        ...nameColumns,
        { key: 'hscode', title: hscodeName, width: 120 },
        ...countrySpecificColumns,
        ...endColumns
    ];
}

// 国家特定配置
const countryConfigs = {
    china: {
        exportTaxRate: 13,
        exportTariffRate:  () => Math.floor(Math.random() * 20),
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

// 国家名称映射
const countryNameMap = {
    china: '中文',
    thailand: '泰语',
    indonesia: '印尼语',
    hungary: '匈牙利语', 
    brazil: '葡萄牙语',
    vietnam: '越南语',
    malaysia: '马来语'
};

Object.keys(countryConfigs).forEach(country => {
    const config = processConfig(countryConfigs[country]);
    const isChina = country === 'china';
    
    // 传递isChina和countryKey参数给数据生成函数
    staticMockData[country] = generateProductData(config, 5, isChina, country);
    
    const hscodeName = {
        china: '中国HSCODE',
        thailand: '泰国HSCODE',
        indonesia: '印尼HSCODE',
        hungary: 'TARIC',
        brazil: 'NCM',
        vietnam: '越南HSCODE',
        malaysia: '马来HSCODE'
    }[country];
    
    // 中国使用包含要素状态的列配置，其他国家不包含要素状态
    tableColumns[country] = generateColumns(
        countrySpecificColumns[country] || [],
        hscodeName,
        isChina,
        countryNameMap[country] || '当地语种'
    );
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { staticMockData, tableColumns };
} else {
    window.staticMockData = staticMockData;
    window.tableColumns = tableColumns;
}