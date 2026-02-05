// 测试日期计算
const startDate = '2025-01'; // 2025年1月
const durationDays = 1715; // 预计封顶期限

console.log('=== 测试日期计算 ===');
console.log(`起投时间：${startDate}`);
console.log(`预计封顶期限：${durationDays} 天`);
console.log('');

const start = new Date(startDate + '-01');
console.log(`起投日期：${start.toLocaleDateString('zh-CN')}`);

const end = new Date(start);
end.setDate(end.getDate() + Math.ceil(durationDays));

const endYear = end.getFullYear();
const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');
const endDateString = `${endYear}年${endMonth}月`;

console.log(`封顶日期：${end.toLocaleDateString('zh-CN')}`);
console.log(`预计封顶时间：${endDateString}`);
console.log('');
console.log(`总天数：${Math.ceil(durationDays)} 天`);
console.log(`约等于：${(durationDays / 30).toFixed(1)} 月 或 ${(durationDays / 365).toFixed(1)} 年`);
