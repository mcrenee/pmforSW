// ==========================================
// Loading Screen
// ==========================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 800);
    }
});

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }
    });
}

// ==========================================
// Back to Top Button
// ==========================================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard support (Enter key)
    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = 80;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const navbar = document.querySelector('.nav-bar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// 创建电竞产业趋势图表 - 优化版
function createEsportsChart() {
    const ctx = document.getElementById('esportsChart');
    if (!ctx) {
        console.warn('Chart canvas not found: esportsChart');
        return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
        const revenue = [238.5, 254.3, 267.8, 275.7, 283.9, 293.31];
        const users = [4.44, 4.59, 4.72, 4.82, 4.89, 4.95];

        // 创建渐变色
        const revenueGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        revenueGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        revenueGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        revenueGradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        const usersGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        usersGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        usersGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
        usersGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '产业收入',
                    data: revenue,
                    borderColor: '#6366f1',
                    backgroundColor: revenueGradient,
                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#6366f1',
                    pointHoverBorderWidth: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: '用户规模',
                    data: users,
                    borderColor: '#10b981',
                    backgroundColor: usersGradient,
                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#10b981',
                    pointHoverBorderWidth: 4,
                    yAxisID: 'y1',
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 25,
                        font: {
                            size: 15,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.95)',
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    padding: 20,
                    titleFont: {
                        size: 16,
                        weight: '700',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        weight: '600',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    cornerRadius: 16,
                    displayColors: true,
                    boxPadding: 10,
                    boxWidth: 20,
                    boxHeight: 20,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    caretSize: 8,
                    caretPadding: 10,
                    callbacks: {
                        title: function(context) {
                            return `${context[0].label}年`;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y + ' 亿元';
                                    const prevValue = context.dataIndex > 0 ? revenue[context.dataIndex - 1] : revenue[0];
                                    const growth = ((context.parsed.y - prevValue) / prevValue * 100).toFixed(2);
                                    if (context.dataIndex > 0) {
                                        label += ` (${growth > 0 ? '+' : ''}${growth}%)`;
                                    }
                                } else {
                                    label += context.parsed.y + ' 亿人';
                                    const prevValue = context.dataIndex > 0 ? users[context.dataIndex - 1] : users[0];
                                    const growth = ((context.parsed.y - prevValue) / prevValue * 100).toFixed(2);
                                    if (context.dataIndex > 0) {
                                        label += ` (${growth > 0 ? '+' : ''}${growth}%)`;
                                    }
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '产业收入 (亿元)',
                        font: {
                            size: 14,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: {top: 0, bottom: 10}
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 10,
                        callback: function(value) {
                            return value + '亿';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        drawBorder: false,
                        lineWidth: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '用户规模 (亿人)',
                        font: {
                            size: 14,
                            family: "'Inter', 'Noto Sans SC', sans-serif",
                            weight: '700'
                        },
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: {top: 0, bottom: 10}
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 10,
                        callback: function(value) {
                            return value + '亿';
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                            size: 14,
                            weight: '700'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        lineWidth: 1
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    } catch (error) {
        console.error('Error creating esports chart:', error);
    }
}

// 创建投资成本分解图表 - 优化版（无图例）
function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) {
        console.warn('Chart canvas not found: investmentChart');
        return;
    }

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        const investmentData = {
        labels: ['电竞设备投入', '加盟成本', '装修投入', '其他费用'],
        data: [35.64, 8.8, 5.88, 0.35],
        colors: [
            '#6366f1', // 紫色 - 电竞设备（最大投入）
            '#f59e0b', // 橙色 - 加盟成本
            '#10b981', // 绿色 - 装修投入
            '#8b5cf6'  // 淡紫 - 其他费用
        ],
        descriptions: [
            '设备28台+服务器+外设',
            '加盟费+设计费+指导费',
            '弱电改造+主题房+前台',
            'OTA铺排+串流系统'
        ]
    };

    // 计算百分比
    const total = investmentData.data.reduce((a, b) => a + b, 0);
    const percentages = investmentData.data.map(val => ((val / total) * 100).toFixed(1));

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: investmentData.labels,
            datasets: [{
                data: investmentData.data,
                backgroundColor: investmentData.colors.map(color => color + '30'),
                borderColor: investmentData.colors,
                borderWidth: 4,
                hoverOffset: 20,
                hoverBorderWidth: 5,
                spacing: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 20
            },
            plugins: {
                legend: {
                    display: false // 隐藏默认图例
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    padding: 20,
                    titleFont: {
                        size: 16,
                        weight: '700',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        weight: '500',
                        family: "'Inter', 'Noto Sans SC', sans-serif",
                        lineHeight: 1.8
                    },
                    footerFont: {
                        size: 13,
                        weight: '600',
                        family: "'Inter', 'Noto Sans SC', sans-serif"
                    },
                    cornerRadius: 16,
                    displayColors: true,
                    boxPadding: 10,
                    boxWidth: 20,
                    boxHeight: 20,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    caretSize: 8,
                    caretPadding: 10,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = percentages[context.dataIndex];
                            const desc = investmentData.descriptions[context.dataIndex];
                            return [
                                `投资金额: ${value}万元`,
                                `占比: ${percentage}%`,
                                `说明: ${desc}`
                            ];
                        },
                        footer: function(context) {
                            return `\n总投资: ${total.toFixed(2)}万元`;
                        }
                    }
                }
            },
            cutout: '65%',
            radius: '90%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();

                const centerX = width / 2;
                const centerY = height / 2;

                // 绘制中心文字 - 总金额
                ctx.font = `900 ${Math.min(width, height) / 8}px 'Inter', sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.fillText(`${total.toFixed(2)}`, centerX, centerY - 20);

                // 绘制单位
                ctx.font = `600 ${Math.min(width, height) / 16}px 'Inter', sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText('万元', centerX, centerY + 20);

                // 绘制标签
                ctx.font = `500 ${Math.min(width, height) / 20}px 'Inter', sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fillText('总投资', centerX, centerY + 50);

                ctx.save();
            }
        }]
    });
    } catch (error) {
        console.error('Error creating investment chart:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Chart.js to load before creating charts
    if (typeof Chart !== 'undefined') {
        createEsportsChart();
        createInvestmentChart();
    } else {
        console.warn('Chart.js not loaded yet, retrying...');
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                createEsportsChart();
                createInvestmentChart();
            } else {
                console.error('Failed to load Chart.js library');
            }
        }, 1000);
    }
    
    createParticles();
    
    // Initialize calculator
    if (typeof calculate === 'function') {
        calculate();
    }
});

// 创建漂浮粒子效果
// 创建闪烁的漂浮粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        console.warn('Particles container not found');
        return;
    }
    
    const particleCount = 60; // 增加粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小 (2-5px)
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机水平位置
        particle.style.left = `${Math.random() * 100}%`;
        
        // 随机动画时长 (15-30秒)
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // 随机延迟
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    console.log(`Created ${particleCount} twinkling particles`);
}

// 鼠标移动视差效果
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const glowOrbs = document.querySelectorAll('.glow-orb');
    glowOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// 观察器用于触发滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.stat-card, .esports-card, .chart-card, .financial-table-wrapper').forEach(el => {
    observer.observe(el);
});

// 数字递增动画
function animateValue(element, start, end, duration, decimals = 2) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = value.toFixed(decimals);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 为统计数字添加递增动画
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const number = entry.target;
            const targetValue = parseFloat(number.textContent.replace(',', ''));
            const decimals = number.textContent.includes('.') ? 2 : 0;
            animateValue(number, 0, targetValue, 2000, decimals);
        }
    });
}, { threshold: 0.5 });

// 观察所有数字元素
setTimeout(() => {
    document.querySelectorAll('.stat-number, .esports-number').forEach(el => {
        statObserver.observe(el);
    });
}, 500);

// 返回顶部按钮
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="18 15 12 9 6 15"/>
    </svg>
`;
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
`;

scrollTopBtn.querySelector('svg').style.cssText = `
    width: 24px;
    height: 24px;
`;

document.body.appendChild(scrollTopBtn);

// 显示/隐藏返回顶部按钮
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// 点击返回顶部
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 悬停效果
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1) translateY(-3px)';
    scrollTopBtn.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.5)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1) translateY(0)';
    scrollTopBtn.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)';
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: 滚动到顶部
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

console.log('%c电竞酒店可行性研究报告 %c已加载完成 ✓', 
    'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #10b981; color: white; padding: 8px 16px; border-radius: 0 4px 4px 0; font-weight: bold;'
);

// ==========================================
// 财务计算器功能
// ==========================================

// 默认值（根据原始财务模型）
const defaultValues = {
    roomCount: 16,
    deviceCount: 28,
    occupancyRate: 93,
    avgPrice: 280,
    commissionRate: 10,
    profitShareRate: 30,
    renovationCost: 58800,
    equipmentCost: 356400,
    franchiseCost: 88000,
    otherCost: 3500,
    annualOperatingCost: 7000
};

// 计算财务指标
function calculate() {
    // 获取输入值
    const roomCount = parseFloat(document.getElementById('roomCount')?.value || 0);
    const deviceCount = parseFloat(document.getElementById('deviceCount')?.value || 0);
    const occupancyRate = parseFloat(document.getElementById('occupancyRate')?.value || 0) / 100;
    const avgPrice = parseFloat(document.getElementById('avgPrice')?.value || 0);
    const commissionRate = parseFloat(document.getElementById('commissionRate')?.value || 0) / 100;
    const profitShareRate = parseFloat(document.getElementById('profitShareRate')?.value || 0) / 100;
    
    const renovationCost = parseFloat(document.getElementById('renovationCost')?.value || 0);
    const equipmentCost = parseFloat(document.getElementById('equipmentCost')?.value || 0);
    const franchiseCost = parseFloat(document.getElementById('franchiseCost')?.value || 0);
    const otherCost = parseFloat(document.getElementById('otherCost')?.value || 0);
    const annualOperatingCost = parseFloat(document.getElementById('annualOperatingCost')?.value || 0);
    
    // 根据竞盛品牌方视角计算
    // 商业模式：竞盛投资设备，获得30%营收分成；加盟商酒店投资装修，获得70%营收分成
    
    // 1. RevPAR（每间房每天实际收入）
    const revPAR = avgPrice * occupancyRate; // 260.4元
    
    // 2. RevPAR（扣除OTA佣金）
    const revPARAfterOTA = revPAR * (1 - commissionRate); // 234.36元
    
    // 3. 年营收（扣除OTA后）= RevPAR(扣OTA) × 房间数 × 365天
    const annualRevenueAfterOTA = revPARAfterOTA * roomCount * 365; // 1,368,662元
    
    // 4. 日/月营收（显示用，基于原价）
    const dailyRevenue = roomCount * avgPrice * occupancyRate;
    const monthlyRevenue = dailyRevenue * 30;
    const yearlyRevenueGross = dailyRevenue * 365;
    
    // 5. 竞盛年收入 = 年营收 × 竞盛分成比例（30%）
    const jingShengIncome = annualRevenueAfterOTA * profitShareRate; // 410,599元
    
    // 6. 加盟商年收入 = 年营收 × (1 - 竞盛分成比例) = 70%
    const franchiseeIncome = annualRevenueAfterOTA * (1 - profitShareRate); // 958,063元
    
    // 7. 竞盛年净利润 = 竞盛年收入 - 竞盛年经营成本
    const jingShengProfit = jingShengIncome - annualOperatingCost; // 403,599元
    
    // 8. 竞盛月净利润
    const monthlyProfit = jingShengProfit / 12; // 33,633元
    
    // 9. 竞盛总投资（主要是电竞设备+加盟成本）
    const totalInvestment = renovationCost + equipmentCost + franchiseCost + otherCost; // 506,700元
    
    // 10. 竞盛回本周期（月）
    const paybackPeriod = totalInvestment / monthlyProfit; // 15.07个月
    
    // 11. 竞盛投资回报率
    const roi = (jingShengProfit / totalInvestment) * 100;
    
    // 调试输出
    console.log('=== 竞盛品牌方财务计算 ===');
    console.log('1. RevPAR:', revPAR.toFixed(2), '元');
    console.log('2. RevPAR(扣OTA):', revPARAfterOTA.toFixed(2), '元');
    console.log('3. 年营收(扣OTA):', annualRevenueAfterOTA.toFixed(2), '元');
    console.log('4. 竞盛收入(30%):', jingShengIncome.toFixed(2), '元');
    console.log('5. 加盟商收入(70%):', franchiseeIncome.toFixed(2), '元');
    console.log('6. 竞盛经营成本:', annualOperatingCost, '元');
    console.log('7. 竞盛年利润:', jingShengProfit.toFixed(2), '元');
    console.log('8. 竞盛月利润:', monthlyProfit.toFixed(2), '元');
    console.log('9. 竞盛总投资:', totalInvestment, '元');
    console.log('10. 竞盛回本周期:', paybackPeriod.toFixed(2), '个月');
    console.log('11. 竞盛ROI:', roi.toFixed(2), '%');
    
    // 更新显示
    updateDisplay({
        dailyRevenue: dailyRevenue.toFixed(0),
        monthlyRevenue: monthlyRevenue.toFixed(0),
        yearlyRevenue: (yearlyRevenueGross / 10000).toFixed(2),
        profitShare: (jingShengIncome / 10000).toFixed(2),
        franchiseeIncome: (franchiseeIncome / 10000).toFixed(2),
        netProfit: (jingShengProfit / 10000).toFixed(2),
        totalInvestment: (totalInvestment / 10000).toFixed(2),
        paybackPeriod: paybackPeriod.toFixed(2),
        roi: roi.toFixed(2)
    });
}

// 更新显示
function updateDisplay(values) {
    // 更新详细结果
    document.getElementById('dailyRevenue').textContent = values.dailyRevenue;
    document.getElementById('monthlyRevenue').textContent = values.monthlyRevenue;
    document.getElementById('yearlyRevenue').textContent = values.yearlyRevenue;
    document.getElementById('profitShare').textContent = values.profitShare;
    document.getElementById('franchiseeIncome').textContent = values.franchiseeIncome;
    document.getElementById('netProfit').textContent = values.netProfit;
    document.getElementById('totalInvest').textContent = values.totalInvestment;
    document.getElementById('paybackMonths').textContent = values.paybackPeriod;
    document.getElementById('roi').textContent = values.roi;
    
    // 更新顶部关键指标
    document.getElementById('paybackPeriod').textContent = values.paybackPeriod;
    document.getElementById('totalInvestment').textContent = values.totalInvestment;
    document.getElementById('annualRevenue').textContent = values.yearlyRevenue;
    document.getElementById('annualProfit').textContent = values.netProfit;
}

// 重置为默认值
function resetCalculator() {
    Object.keys(defaultValues).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = defaultValues[key];
        }
    });
    calculate();
    
    // 添加重置动画
    const calculator = document.querySelector('.calculator-section');
    calculator.style.animation = 'none';
    setTimeout(() => {
        calculator.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

// 页面加载时初始化计算
window.addEventListener('DOMContentLoaded', () => {
    calculate();
});