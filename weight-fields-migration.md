# 总毛重和总净重字段迁移说明

## 更改概述

将总毛重和总净重字段从基本信息区域迁移到自动拆合单结果的报关信息中，并设置为非必填项。

## 具体更改

### 1. HTML结构调整

**删除了基本信息中的总毛重和总净重**
```html
<!-- 删除前的基本信息 -->
<div class="info-row">
    <div class="form-group">
        <label>总毛重：</label>
        <input type="text" id="total-gross-weight" value="1250.5 KG" readonly>
    </div>
    <div class="form-group">
        <label>总净重：</label>
        <input type="text" id="total-net-weight" value="1180.3 KG" readonly>
    </div>
    <div class="form-group required">
        <label>监管方式：<span class="required-mark">*</span></label>
        <!-- ... -->
    </div>
</div>

<!-- 删除后的基本信息 -->
<div class="info-row">
    <div class="form-group required">
        <label>监管方式：<span class="required-mark">*</span></label>
        <!-- ... -->
    </div>
</div>
```

### 2. JavaScript渲染逻辑更新

**在报关信息中添加总毛重和总净重字段**
```javascript
// 在 renderSplitResult 函数中添加
<div class="form-group">
    <label>总毛重：</label>
    <input type="text" id="total-gross-weight-${declarationId}" 
           value="${declaration.totalGrossWeight || '1250.5 KG'}" 
           placeholder="请输入总毛重">
</div>
<div class="form-group">
    <label>总净重：</label>
    <input type="text" id="total-net-weight-${declarationId}" 
           value="${declaration.totalNetWeight || '1180.3 KG'}" 
           placeholder="请输入总净重">
</div>
```

### 3. 模拟数据更新

**为每个报关单添加总毛重和总净重属性**
```javascript
// performAutoSplit 函数中的模拟数据
{
    id: 1,
    name: '报关单1',
    // ... 其他字段
    totalGrossWeight: '625.2 KG',
    totalNetWeight: '590.1 KG',
    items: [...]
},
{
    id: 2,
    name: '报关单2',
    // ... 其他字段
    totalGrossWeight: '625.3 KG',
    totalNetWeight: '590.2 KG',
    items: [...]
}

// performAutoSplitForProcessingStatus 函数中的模拟数据也同样更新
```

## 字段特性

### 位置变更
- **原位置**：基本信息区域（页面顶部）
- **新位置**：自动拆合单结果 → 报关信息（非必填项）

### 字段属性
- **字段类型**：文本输入框
- **是否必填**：否（非必填项）
- **默认值**：
  - 总毛重：625.2 KG / 625.3 KG（根据报关单不同）
  - 总净重：590.1 KG / 590.2 KG（根据报关单不同）
- **占位符**：请输入总毛重 / 请输入总净重

### 字段ID命名
- **总毛重**：`total-gross-weight-${declarationId}`
- **总净重**：`total-net-weight-${declarationId}`

每个报关单都有独立的ID，避免字段冲突。

## 用户体验变化

### 流程调整
1. **原流程**：用户在页面顶部基本信息中看到只读的总毛重和总净重
2. **新流程**：用户需要点击"自动拆合单"或在"报关中"状态下自动生成拆合单结果，然后在报关信息中编辑总毛重和总净重

### 编辑权限
- **原来**：只读字段，不可编辑
- **现在**：可编辑字段，用户可以修改

### 显示时机
- **原来**：页面加载时立即显示
- **现在**：生成拆合单结果后显示

## 业务逻辑影响

### 数据验证
- 总毛重和总净重不再是必填项
- 字段验证需要在拆合单结果的上下文中进行

### 数据提交
- 数据提交时需要从拆合单结果中收集总毛重和总净重信息
- 每个报关单都有独立的重量信息

### 状态控制
- 在不同状态下（待报关/报关中），总毛重和总净重字段的编辑权限保持一致（可编辑）
- 字段显示受拆合单结果生成状态影响

## 测试建议

1. **基本信息验证**：确认基本信息区域不再显示总毛重和总净重
2. **拆合单结果验证**：确认报关信息中正确显示总毛重和总净重字段
3. **数据显示验证**：确认默认值正确显示
4. **编辑功能验证**：确认字段可以正常编辑
5. **多报关单验证**：确认多个报关单的重量字段独立工作