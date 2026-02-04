// 测试投资计算器逻辑
const I = 100; // 投资金额（万元）
const M = 30;  // 月营业额（万元）
const R = 10;  // 分成比例（%）
const A = 15;  // 预期收益率（%）

console.log('=== 测试投资计算器逻辑 ===');
console.log('输入参数：');
console.log(`投资金额：${I} 万元`);
console.log(`月营业额：${M} 万元`);
console.log(`分成比例：${R}%`);
console.log(`预期收益率：${A}%`);
console.log('');

// 1. 计算预计联营期限（天）
const denominator = (M * R / 3000) - (I * A / 36000);
console.log(`分母计算：(${M} × ${R} / 3000) - (${I} × ${A} / 36000)`);
console.log(`= (${M * R} / 3000) - (${I * A} / 36000)`);
console.log(`= ${M * R / 3000} - ${I * A / 36000}`);
console.log(`= ${denominator}`);
console.log('');

if (denominator <= 0) {
    console.log('❌ 无法计算：月分成收入不足以覆盖投资收益要求');
    process.exit(1);
}

const D = I / denominator;
console.log(`预计联营期限 D = ${I} / ${denominator} = ${D} 天`);
console.log(`向上取整：${Math.ceil(D)} 天`);
console.log('');

// 2. 预计月分成金额
const monthlyShare = M * (R / 100);
console.log(`预计月分成金额 = ${M} × (${R} / 100) = ${monthlyShare} 万元`);
console.log('');

// 3. 封顶金额
const cappedAmount = I * (1 + (A / 100 / 360) * D);
console.log(`封顶金额 = ${I} × (1 + (${A} / 100 / 360) × ${D})`);
console.log(`= ${I} × (1 + ${(A / 100 / 360) * D})`);
console.log(`= ${I} × ${1 + (A / 100 / 360) * D}`);
console.log(`= ${cappedAmount.toFixed(2)} 万元`);
console.log('');

console.log('=== 最终结果 ===');
console.log(`✅ 预计月分成金额：${monthlyShare.toFixed(2)} 万元`);
console.log(`✅ 封顶金额：${cappedAmount.toFixed(2)} 万元`);
console.log(`✅ 预计联营期限：${Math.ceil(D)} 天`);
