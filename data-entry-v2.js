// 数据登记系统 JavaScript v2 - 支持编辑和删除
let allRecords = [];
let filteredRecords = [];
let editingId = null;

// RBO投资总额配置（实际投资数据 - 税费前）
// 显示顺序：浦东 -> 西安 -> 南京 -> 澳尔
const RBO_INVESTMENTS = {
    'RT-CN3101-SHWS0001-I': { name: '浦东机场（DRC）', investment: 2900000, order: 1 },
    'OT-CN0100-PAWSV0002': { name: '西安机场', investment: 1700000, order: 2 },
    'RT-CN0100-PAWSV0001': { name: '南京机场', investment: 2650000, order: 3 },
    'SV-CN0100-AURABJYX0001': { name: '澳尔医院', investment: 1980000, order: 4 }
};

// 加载数据
async function loadData() {
    try {
        const response = await fetch('rbo-data.json');
        const data = await response.json();
        allRecords = data.records;
        
        // 从localStorage加载可能的更新
        const savedRecords = localStorage.getItem('rbo_records_updated');
        if (savedRecords) {
            allRecords = JSON.parse(savedRecords);
        }
        
        filteredRecords = [...allRecords];
        console.log(`✅ 加载了 ${allRecords.length} 条记录`);
        
        updateStatistics();
        renderTable();
        updateRBOStats();
    } catch (error) {
        console.error('加载数据失败:', error);
        alert('加载数据失败，请刷新页面重试');
    }
}

// 保存到localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('rbo_records_updated', JSON.stringify(allRecords));
        console.log('✅ 数据已保存到本地');
    } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请检查浏览器存储空间');
    }
}

// 更新RBO投资统计
function updateRBOStats() {
    const rboStats = {};
    
    allRecords.forEach(record => {
        const code = record.rboCode.trim();
        const amount = parseFloat(record.actualAmount) || 0;
        
        if (!rboStats[code]) {
            rboStats[code] = {
                name: RBO_INVESTMENTS[code]?.name || record.shortName || '未知项目',
                investment: RBO_INVESTMENTS[code]?.investment || 0,
                paid: 0,
                count: 0
            };
        }
        
        rboStats[code].paid += amount;
        rboStats[code].count++;
    });
    
    const container = document.getElementById('rboStats');
    container.innerHTML = '';
    
    const sortedEntries = Object.entries(rboStats).sort((a, b) => {
        const orderA = RBO_INVESTMENTS[a[0]]?.order || 999;
        const orderB = RBO_INVESTMENTS[b[0]]?.order || 999;
        return orderA - orderB;
    });
    
    sortedEntries.forEach(([code, stats]) => {
        const remaining = stats.investment - stats.paid;
        const percentage = stats.investment > 0 ? ((stats.paid / stats.investment) * 100).toFixed(1) : 0;
        
        const card = document.createElement('div');
        card.className = 'rbo-card';
        card.innerHTML = `
            <h4>${code}</h4>
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">${stats.name}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px;">投资总额</span>
                <span class="rbo-amount" style="font-size: 14px;">¥${stats.investment.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px;">已打款</span>
                <span class="rbo-amount" style="font-size: 14px;">¥${stats.paid.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 12px;">剩余</span>
                <span class="rbo-amount" style="font-size: 14px;">¥${remaining.toLocaleString()}</span>
            </div>
            <div class="rbo-progress">
                <div class="rbo-progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div style="font-size: 11px; margin-top: 6px; opacity: 0.8;">
                ${percentage}% (${stats.count}笔记录)
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 更新统计信息
function updateStatistics() {
    document.getElementById('totalRecords').textContent = allRecords.length;
    document.getElementById('completedRecords').textContent = 
        allRecords.filter(r => r.status === '已完成').length;
    document.getElementById('processingRecords').textContent = 
        allRecords.filter(r => r.status === '处理中').length;
    
    const totalPaid = allRecords.reduce((sum, r) => 
        sum + (parseFloat(r.actualAmount) || 0), 0);
    document.getElementById('totalPaid').textContent = 
        '¥' + totalPaid.toLocaleString();
}

// 筛选记录
function filterRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const systemFilter = document.getElementById('systemFilter').value;
    
    filteredRecords = allRecords.filter(record => {
        const matchSearch = !searchTerm || 
            Object.values(record).some(val => 
                String(val).toLowerCase().includes(searchTerm)
            );
        const matchStatus = !statusFilter || record.status === statusFilter;
        const matchSystem = !systemFilter || record.system === systemFilter;
        
        return matchSearch && matchStatus && matchSystem;
    });
    
    renderTable();
}

// 显示编辑表单
function showEditForm(recordId) {
    const record = allRecords.find(r => r.id === recordId);
    if (!record) return;
    
    editingId = recordId;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 显示编辑表单
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('formTitle').textContent = '编辑记录';
    
    // 填充表单
    document.getElementById('editProcessDate').value = record.processDate || '';
    document.getElementById('editStatus').value = record.status || '';
    document.getElementById('editSystem').value = record.system || '';
    document.getElementById('editRboCode').value = record.rboCode || '';
    document.getElementById('editInternalRboCode').value = record.internalRboCode || '';
    document.getElementById('editShortName').value = record.shortName || '';
    document.getElementById('editTradingAccount').value = record.tradingAccount || '';
    document.getElementById('editCycleStartDate').value = record.cycleStartDate || '';
    document.getElementById('editCycleEndDate').value = record.cycleEndDate || '';
    document.getElementById('editInfoFlowOA').value = record.infoFlowOA || '';
    document.getElementById('editInfoFlowDate').value = record.infoFlowDate || '';
    document.getElementById('editPayableAmount').value = record.payableAmount || '';
    document.getElementById('editActualAmount').value = record.actualAmount || '';
    document.getElementById('editCapitalFlowOA').value = record.capitalFlowOA || '';
    document.getElementById('editCapitalFlowDate').value = record.capitalFlowDate || '';
}

// 显示新增表单
function showAddForm() {
    editingId = null;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('formTitle').textContent = '新增记录';
    
    // 清空表单
    document.getElementById('editRecordForm').reset();
}

// 隐藏表单
function hideEditForm() {
    document.getElementById('editForm').style.display = 'none';
    editingId = null;
}

// 保存记录
function saveRecord() {
    const formData = {
        processDate: document.getElementById('editProcessDate').value,
        status: document.getElementById('editStatus').value,
        system: document.getElementById('editSystem').value,
        rboCode: document.getElementById('editRboCode').value,
        internalRboCode: document.getElementById('editInternalRboCode').value,
        shortName: document.getElementById('editShortName').value,
        tradingAccount: document.getElementById('editTradingAccount').value,
        cycleStartDate: document.getElementById('editCycleStartDate').value,
        cycleEndDate: document.getElementById('editCycleEndDate').value,
        infoFlowOA: document.getElementById('editInfoFlowOA').value,
        infoFlowDate: document.getElementById('editInfoFlowDate').value,
        payableAmount: document.getElementById('editPayableAmount').value,
        actualAmount: document.getElementById('editActualAmount').value,
        capitalFlowOA: document.getElementById('editCapitalFlowOA').value,
        capitalFlowDate: document.getElementById('editCapitalFlowDate').value
    };
    
    if (editingId) {
        // 更新现有记录
        const index = allRecords.findIndex(r => r.id === editingId);
        if (index !== -1) {
            allRecords[index] = { ...allRecords[index], ...formData };
        }
    } else {
        // 新增记录
        const newId = Date.now().toString();
        allRecords.push({ id: newId, ...formData });
    }
    
    saveToLocalStorage();
    filteredRecords = [...allRecords];
    updateStatistics();
    updateRBOStats();
    renderTable();
    hideEditForm();
    
    alert('保存成功！');
}

// 删除记录
function deleteRecord(recordId) {
    if (!confirm('确定要删除这条记录吗？此操作无法撤销！')) {
        return;
    }
    
    allRecords = allRecords.filter(r => r.id !== recordId);
    filteredRecords = filteredRecords.filter(r => r.id !== recordId);
    
    saveToLocalStorage();
    updateStatistics();
    updateRBOStats();
    renderTable();
    
    alert('删除成功！');
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="16" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px;"></i>
                    <div>暂无数据</div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredRecords.forEach(record => {
        const tr = document.createElement('tr');
        
        const statusClass = {
            '已完成': 'status-completed',
            '处理中': 'status-processing',
            '待处理': 'status-pending'
        }[record.status] || 'status-pending';
        
        tr.innerHTML = `
            <td>${record.processDate || '-'}</td>
            <td><span class="status-badge ${statusClass}">${record.status || '-'}</span></td>
            <td>${record.system || '-'}</td>
            <td>${record.rboCode || '-'}</td>
            <td>${record.internalRboCode || '-'}</td>
            <td>${record.shortName || '-'}</td>
            <td>${record.tradingAccount || '-'}</td>
            <td>${record.cycleStartDate || '-'}</td>
            <td>${record.cycleEndDate || '-'}</td>
            <td>${record.infoFlowOA || '-'}</td>
            <td>${record.infoFlowDate || '-'}</td>
            <td>${record.payableAmount ? '¥' + parseFloat(record.payableAmount).toLocaleString() : '-'}</td>
            <td style="font-weight: 700; color: #667eea;">
                ${record.actualAmount ? '¥' + parseFloat(record.actualAmount).toLocaleString() : '-'}
            </td>
            <td>${record.capitalFlowOA || '-'}</td>
            <td>${record.capitalFlowDate || '-'}</td>
            <td style="white-space: nowrap;">
                <button onclick="showEditForm('${record.id}')" class="btn-icon edit" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRecord('${record.id}')" class="btn-icon delete" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// 导出到Excel
function exportToExcel() {
    const exportData = filteredRecords.map(record => ({
        '处理日期': record.processDate || '',
        '状态': record.status || '',
        '系统': record.system || '',
        'RBO编码': record.rboCode || '',
        '内部RBO编码': record.internalRboCode || '',
        '简称': record.shortName || '',
        '交易账号': record.tradingAccount || '',
        '分成周期开始日': record.cycleStartDate || '',
        '分成周期结束日': record.cycleEndDate || '',
        '信息流OA': record.infoFlowOA || '',
        '信息流处理日期': record.infoFlowDate || '',
        '应打款金额': record.payableAmount || '',
        '实际打款金额': record.actualAmount || '',
        '资金流OA单': record.capitalFlowOA || '',
        '资金流处理日期': record.capitalFlowDate || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RBO数据');
    
    const fileName = `RBO数据_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', loadData);
