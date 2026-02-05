// Data storage
let records = [];
let editingIndex = -1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderTable();
    updateStats();

    // Search functionality
    document.getElementById('search-input').addEventListener('input', filterTable);
    document.getElementById('status-filter').addEventListener('change', filterTable);
    document.getElementById('date-filter').addEventListener('change', filterTable);
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('siwa_rbo_records');
    if (savedData) {
        records = JSON.parse(savedData);
    } else {
        // Sample data
        records = [
            {
                processDate: '2025-08-06',
                status: '已完成',
                system: '二合一',
                rboCode: 'RT-CN0100-PAWSV0001',
                internalCode: 'R0000000003',
                shortName: '上海肆瓦南京机场（二合一）',
                periodStart: '2025-07-30',
                periodEnd: '2025-07-31',
                infoOA: 'IT06-20250801001',
                infoDate: '2025-08-06',
                expectedAmount: '0.00',
                actualAmount: '0.00',
                fundOA: '/',
                fundDate: '2025-08-06'
            }
        ];
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('siwa_rbo_records', JSON.stringify(records));
}

// Render table
function renderTable(filteredRecords = null) {
    const dataToRender = filteredRecords || records;
    const tableContent = document.getElementById('table-content');

    if (dataToRender.length === 0) {
        tableContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>暂无记录</p>
                <button class="btn btn-primary" onclick="addRecord()">
                    <i class="fas fa-plus"></i>
                    添加第一条记录
                </button>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>处理日期</th>
                    <th>状态</th>
                    <th>系统</th>
                    <th>RBO编码</th>
                    <th>内部RBO编码</th>
                    <th>简称</th>
                    <th>分成周期开始</th>
                    <th>分成周期结束</th>
                    <th>信息流OA</th>
                    <th>信息流处理日期</th>
                    <th>应打款金额</th>
                    <th>实际打款金额</th>
                    <th>资金流OA单</th>
                    <th>资金流处理日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;

    dataToRender.forEach((record, index) => {
        const statusClass = record.status === '已完成' ? 'status-completed' : 
                          record.status === '处理中' ? 'status-processing' : 
                          'status-pending';

        tableHTML += `
            <tr>
                <td>${record.processDate}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>${record.system}</td>
                <td>${record.rboCode}</td>
                <td>${record.internalCode}</td>
                <td>${record.shortName}</td>
                <td>${record.periodStart}</td>
                <td>${record.periodEnd}</td>
                <td>${record.infoOA || '-'}</td>
                <td>${record.infoDate || '-'}</td>
                <td>¥${parseFloat(record.expectedAmount).toFixed(2)}</td>
                <td>¥${parseFloat(record.actualAmount).toFixed(2)}</td>
                <td>${record.fundOA || '-'}</td>
                <td>${record.fundDate || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn action-btn-edit" onclick="editRecord(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" onclick="deleteRecord(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContent.innerHTML = tableHTML;
}

// Update statistics
function updateStats() {
    const totalCount = records.length;
    const completedCount = records.filter(r => r.status === '已完成').length;
    const processingCount = records.filter(r => r.status === '处理中').length;
    const totalAmount = records.reduce((sum, r) => sum + parseFloat(r.actualAmount || 0), 0);

    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('processing-count').textContent = processingCount;
    document.getElementById('total-amount').textContent = `¥${totalAmount.toFixed(2)}`;
}

// Filter table
function filterTable() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;

    let filtered = records;

    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.rboCode.toLowerCase().includes(searchTerm) ||
            r.shortName.toLowerCase().includes(searchTerm) ||
            r.internalCode.toLowerCase().includes(searchTerm)
        );
    }

    if (statusFilter) {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (dateFilter) {
        filtered = filtered.filter(r => r.processDate === dateFilter);
    }

    renderTable(filtered);
}

// Add record
function addRecord() {
    editingIndex = -1;
    document.getElementById('modal-title').textContent = '新增RBO记录';
    document.getElementById('record-form').reset();
    document.getElementById('record-modal').classList.add('show');
}

// Edit record
function editRecord(index) {
    editingIndex = index;
    const record = records[index];
    
    document.getElementById('modal-title').textContent = '编辑RBO记录';
    const form = document.getElementById('record-form');
    
    form.elements['processDate'].value = record.processDate;
    form.elements['status'].value = record.status;
    form.elements['system'].value = record.system;
    form.elements['rboCode'].value = record.rboCode;
    form.elements['internalCode'].value = record.internalCode;
    form.elements['shortName'].value = record.shortName;
    form.elements['periodStart'].value = record.periodStart;
    form.elements['periodEnd'].value = record.periodEnd;
    form.elements['infoOA'].value = record.infoOA || '';
    form.elements['infoDate'].value = record.infoDate || '';
    form.elements['expectedAmount'].value = record.expectedAmount;
    form.elements['actualAmount'].value = record.actualAmount;
    form.elements['fundOA'].value = record.fundOA || '';
    form.elements['fundDate'].value = record.fundDate || '';

    document.getElementById('record-modal').classList.add('show');
}

// Delete record
function deleteRecord(index) {
    if (confirm('确定要删除这条记录吗？')) {
        records.splice(index, 1);
        saveData();
        renderTable();
        updateStats();
    }
}

// Save record
function saveRecord(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const record = {
        processDate: formData.get('processDate'),
        status: formData.get('status'),
        system: formData.get('system'),
        rboCode: formData.get('rboCode'),
        internalCode: formData.get('internalCode'),
        shortName: formData.get('shortName'),
        periodStart: formData.get('periodStart'),
        periodEnd: formData.get('periodEnd'),
        infoOA: formData.get('infoOA'),
        infoDate: formData.get('infoDate'),
        expectedAmount: formData.get('expectedAmount'),
        actualAmount: formData.get('actualAmount'),
        fundOA: formData.get('fundOA'),
        fundDate: formData.get('fundDate')
    };

    if (editingIndex >= 0) {
        records[editingIndex] = record;
    } else {
        records.unshift(record);
    }

    saveData();
    closeModal();
    renderTable();
    updateStats();
}

// Close modal
function closeModal() {
    document.getElementById('record-modal').classList.remove('show');
    document.getElementById('record-form').reset();
    editingIndex = -1;
}

// Export to Excel
function exportToExcel() {
    const data = records.map(r => ({
        '处理日期': r.processDate,
        '状态': r.status,
        '系统': r.system,
        'RBO编码': r.rboCode,
        '内部RBO编码': r.internalCode,
        '简称': r.shortName,
        '对应分成周期开始日': r.periodStart,
        '对应分成周期结束日': r.periodEnd,
        '信息流OA': r.infoOA,
        '信息流处理日期': r.infoDate,
        '应打款金额': `¥${parseFloat(r.expectedAmount).toFixed(2)}`,
        '实际打款金额': `¥${parseFloat(r.actualAmount).toFixed(2)}`,
        '资金流OA单': r.fundOA,
        '资金流处理日期': r.fundDate
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RBO记录');
    
    const fileName = `肆瓦RBO登记记录_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// Import from Excel trigger
function importFromExcel() {
    document.getElementById('import-file').click();
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            // Convert imported data to our format
            const importedRecords = jsonData.map(row => ({
                processDate: row['处理日期'] || '',
                status: row['状态'] || '待处理',
                system: row['系统'] || '',
                rboCode: row['RBO编码'] || '',
                internalCode: row['内部RBO编码'] || '',
                shortName: row['简称'] || '',
                periodStart: row['对应分成周期开始日'] || '',
                periodEnd: row['对应分成周期结束日'] || '',
                infoOA: row['信息流OA'] || '',
                infoDate: row['信息流处理日期'] || '',
                expectedAmount: (row['应打款金额'] || '0').toString().replace(/[¥,]/g, ''),
                actualAmount: (row['实际打款金额'] || '0').toString().replace(/[¥,]/g, ''),
                fundOA: row['资金流OA单'] || '',
                fundDate: row['资金流处理日期'] || ''
            }));

            if (confirm(`将导入 ${importedRecords.length} 条记录，是否继续？`)) {
                records = [...importedRecords, ...records];
                saveData();
                renderTable();
                updateStats();
                alert('导入成功！');
            }
        } catch (error) {
            alert('导入失败：' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    event.target.value = '';
}

// Close modal when clicking outside
document.getElementById('record-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
