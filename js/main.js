// ==========================================
// 滴灌投资决策平台 - JavaScript
// ==========================================

// ==========================================
// 页面初始化
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 滴灌投资决策平台已加载');
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化导航高亮
    initNavigation();
});

// ==========================================
// 投资回报计算器
// ==========================================

function calculateROI() {
    const investAmount = parseFloat(document.getElementById('investAmount').value);
    const monthlyRevenue = parseFloat(document.getElementById('monthlyRevenue').value);
    const shareRatio = parseFloat(document.getElementById('shareRatio').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const startDate = document.getElementById('startDate').value;
    
    if (!investAmount || !monthlyRevenue || !shareRatio || !annualRate) {
        alert('请填写所有必填信息');
        return;
    }
    
    if (investAmount <= 0 || monthlyRevenue <= 0 || shareRatio <= 0 || annualRate <= 0) {
        alert('请输入正确的数值');
        return;
    }
    
    if (!startDate) {
        alert('请选择起投时间');
        return;
    }
    
    // 新计算逻辑（基于日息）
    // 公式：投资金额 × (1 + 预期收益率/100/360×预计联营期限) = 月营业额/30 × 预计联营期限 × 分成比例/100
    // 注：预计联营期限单位为天
    
    const I = investAmount;
    const M = monthlyRevenue;
    const R = shareRatio;
    const A = annualRate;
    
    // 1. 计算预计封顶期限（天）
    // 公式推导：D = I / (M×R/3000 - I×A/36000)
    const denominator = (M * R / 3000) - (I * A / 36000);
    
    if (denominator <= 0) {
        alert('无法计算：月分成收入不足以覆盖投资收益要求，请调整参数');
        return;
    }
    
    const durationDays = I / denominator;
    
    // 2. 预计封顶金额 = 投资金额 × (1 + 预期收益率/100/360×预计封顶期限)
    const cappedAmount = I * (1 + (A / 100 / 360) * durationDays);
    
    // 3. 计算预计封顶时间
    const start = new Date(startDate + '-01'); // 添加日期部分
    const end = new Date(start);
    end.setDate(end.getDate() + Math.ceil(durationDays));
    
    const endYear = end.getFullYear();
    const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');
    const endDateString = `${endYear}年${endMonth}月`;
    
    // 显示结果
    document.getElementById('durationDays').textContent = Math.ceil(durationDays) + '天';
    document.getElementById('endDate').textContent = endDateString;
    document.getElementById('cappedAmount').textContent = cappedAmount.toFixed(2) + '万';
    
    document.getElementById('calculatorResults').classList.remove('hidden');
    document.getElementById('calculatorResults').scrollIntoView({ behavior: 'smooth' });
}

function resetCalculator() {
    document.getElementById('calculatorForm').reset();
    document.getElementById('calculatorResults').classList.add('hidden');
}

// ==========================================
// 企业筛选评估
// ==========================================

function calculateScore() {
    const enterpriseName = document.getElementById('enterpriseName').value;
    if (!enterpriseName) {
        alert('请输入企业名称');
        return;
    }
    
    // 收集评分
    let totalScore = 0;
    let hasEmpty = false;
    
    for (let i = 1; i <= 8; i++) {
        const value = document.getElementById(`criteria${i}`).value;
        if (value === '') {
            hasEmpty = true;
            break;
        }
        totalScore += parseInt(value);
    }
    
    if (hasEmpty) {
        alert('请完成所有评分项');
        return;
    }
    
    // 确定评级和建议
    let rating, ratingClass, recommendation, riskControl;
    
    if (totalScore >= 92) {  // 92-100分
        rating = '优秀';
        ratingClass = 'excellent';
        recommendation = `<strong>${enterpriseName}</strong>综合评分<strong class="text-primary">${totalScore}分</strong>，属于<strong class="text-primary">优秀级别</strong>。<br><br>
            <strong>投资建议：强烈推荐投资</strong><br>
            建议投资规模：400-600万元<br>
            建议年化收益：18%<br>
            建议分成比例：35%<br>
            联营期限：18个月`;
        riskControl = `${enterpriseName}具备优质点位获取能力，历史履约记录良好，AI技术应用成熟，品牌资源丰富。建议重点关注：1）招商进度按时完成；2）每月数据及时报送；3）分成款项准时支付。`;
    } else if (totalScore >= 77) {  // 77-91分
        rating = '良好';
        ratingClass = 'good';
        recommendation = `<strong>${enterpriseName}</strong>综合评分<strong class="text-primary">${totalScore}分</strong>，属于<strong class="text-primary">良好级别</strong>。<br><br>
            <strong>投资建议：可以投资</strong><br>
            建议投资规模：200-400万元<br>
            建议年化收益：16-18%<br>
            建议分成比例：40%<br>
            联营期限：12-15个月`;
        riskControl = `${enterpriseName}整体能力较强，但仍有提升空间。建议重点关注：1）点位资源质量；2）品牌招商能力；3）运营数据真实性；4）团队稳定性。建议增加月度运营审核频次。`;
    } else if (totalScore >= 62) {  // 62-76分
        rating = '一般';
        ratingClass = 'fair';
        recommendation = `<strong>${enterpriseName}</strong>综合评分<strong class="text-primary">${totalScore}分</strong>，属于<strong class="text-primary">一般级别</strong>。<br><br>
            <strong>投资建议：谨慎投资</strong><br>
            建议投资规模：100-200万元<br>
            建议年化收益：14-16%<br>
            建议分成比例：50%<br>
            联营期限：6-12个月`;
        riskControl = `${enterpriseName}存在较多不确定因素。建议重点关注：1）点位资源是否稳定；2）品牌招商是否达标；3）收入是否达到预期；4）履约能力是否可靠。建议设置更严格的退出条款和风控措施。`;
    } else {  // 0-61分
        rating = '不推荐';
        ratingClass = 'poor';
        recommendation = `<strong>${enterpriseName}</strong>综合评分<strong class="text-primary">${totalScore}分</strong>，低于投资标准。<br><br>
            <strong>投资建议：不建议投资</strong><br>
            综合能力不足，风险较高，建议观望或要求企业提升能力后再评估。`;
        riskControl = `${enterpriseName}综合能力较弱，不符合当前投资标准。主要风险：点位资源质量差、运营能力不足、品牌资源匮乏、团队经验不足。建议暂不投资，待企业提升能力后再行评估。`;
    }
    
    // 更新显示
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('scoreRating').textContent = rating;
    document.getElementById('scoreRating').className = `score-rating ${ratingClass}`;
    document.getElementById('scoreRecommendation').innerHTML = recommendation;
    document.getElementById('riskControl').innerHTML = riskControl;
    
    document.getElementById('screeningResults').classList.remove('hidden');
    document.getElementById('screeningResults').scrollIntoView({ behavior: 'smooth' });
}

function resetScreening() {
    document.getElementById('screeningForm').reset();
    document.getElementById('screeningResults').classList.add('hidden');
}

// ==========================================
// 返回顶部
// ==========================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==========================================
// 导航高亮
// ==========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 更新活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 滚动时更新高亮
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}
