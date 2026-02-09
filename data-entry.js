// 数据登记系统 JavaScript
let allRecords = [];
let filteredRecords = [];

// RBO投资总额配置（实际投资数据 - 税费前）
const RBO_INVESTMENTS = {
    'RT-CN3101-SHWS0001-I': { name: '浦东机场（DRC）', investment: 2900000 },
    'RT-CN0100-PAWSV0001': { name: '南京机场', investment: 2650000 },
    'OT-CN0100-PAWSV0002': { name: '西安机场', investment: 1700000 },
    'SV-CN0100-AURABJYX0001': { name: '澳尔医院', investment: 1980000 }
};

// 加载数据
async function loadData() {
    try {
        const response = await fetch('rbo-data.json');
        const data = await response.json();
        allRecords = data.records;
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

// 更新RBO投资统计
function updateRBOStats() {
    const rboStats = {};
    
    // 按RBO编码分组统计
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
    
    // 渲染RBO统计卡片
    const container = document.getElementById('rboStats');
    container.innerHTML = '';
    
    Object.entries(rboStats).forEach(([code, stats]) => {
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

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="15" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px;"></i>
                    <div>暂无数据</div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredRecords.forEach(record => {
        const tr = document.createElement('tr');
        
        // 状态样式
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
