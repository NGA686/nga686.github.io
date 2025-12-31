// 修复点击特效
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
});

// 滚动时改变导航栏样式
window.addEventListener('scroll', function() {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 轮播图配置 - 使用可靠的图片
const carouselData = [
    { 
        url: "https://wp.mcyan.cn/view.php/9d3413034063038570b5758569ffb071.jpeg", 
        title: "NGA全防 - 专业级保护",
        subtitle: "全球领先的游戏安全解决方案"
    },
    { 
        url: "https://wp.mcyan.cn/view.php/83446ef89944511a636216938d16feed.jpeg", 
        title: "多服务器支持",
        subtitle: "全球服、日韩服、台湾服、越南服全面覆盖"
    },
    { 
        url: "https://wp.mcyan.cn/view.php/a33a8ff681ca1cecd7b8c816dca46247.jpeg", 
        title: "高级内存加密",
        subtitle: "实时保护游戏数据，防止检测"
    },
    { 
        url: "https://wp.mcyan.cn/view.php/86131cb378be166e8e3b402b318f92d4.jpeg", 
        title: "实时防护监控",
        subtitle: "24/7全天候保护您的游戏账号"
    },
    { 
        url: "https://wp.mcyan.cn/view.php/bf607ad1c7f64008aafaa1fbd5065094.jpeg", 
        title: "稳定更新保障",
        subtitle: "持续更新，应对各种检测机制"
    }
];

let currentSlide = 0;
let carouselInterval;

// 初始化轮播图
function initCarousel() {
    const carouselContainer = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (!carouselContainer || !indicatorsContainer) return;
    
    // 创建轮播图HTML
    let carouselHTML = '';
    let indicatorsHTML = '';
    
    carouselData.forEach((item, index) => {
        carouselHTML += `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                <div class="carousel-image">
                    <img src="${item.url}" alt="${item.title}">
                </div>
                <div class="carousel-info">
                    <div class="carousel-title">${item.title}</div>
                    <div class="carousel-subtitle">${item.subtitle}</div>
                </div>
            </div>
        `;
        
        indicatorsHTML += `
            <div class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
        `;
    });
    
    carouselHTML += `
        <div class="carousel-controls">
            <button class="carousel-prev" onclick="prevSlide()">‹</button>
            <button class="carousel-next" onclick="nextSlide()">›</button>
        </div>
    `;
    
    carouselContainer.innerHTML = carouselHTML;
    indicatorsContainer.innerHTML = indicatorsHTML;
    
    // 自动轮播
    startCarousel();
}

function startCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // 重置自动轮播
    startCarousel();
}

// 鼠标悬停时暂停轮播
document.querySelector('.carousel-container')?.addEventListener('mouseenter', stopCarousel);
document.querySelector('.carousel-container')?.addEventListener('mouseleave', startCarousel);

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// 关闭模态框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 加入Telegram
function joinTelegram() {
    showModal('telegramModal');
}

// 下载服务器版本
function downloadServer(serverType) {
    const serverNames = {
        'global': '全球服',
        'japan': '日韩服', 
        'taiwan': '台湾服',
        'vietnam': '越南服'
    };
    
    const confirmModal = document.createElement('div');
    confirmModal.id = 'serverDownloadModal';
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">下载${serverNames[serverType]}版本</h3>
                <button class="modal-close" onclick="closeModal('serverDownloadModal')">&times;</button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <div style="font-size: 4rem; color: var(--primary-color); margin: 20px 0;">
                    <i class="fas fa-download"></i>
                </div>
                <h3 style="margin-bottom: 10px;">NGA全防 ${serverNames[serverType]}版</h3>
                <p style="color: var(--gray-text); margin-bottom: 20px;">版本: 2.1.5 | 大小: 58.7 MB</p>
                <p style="margin-bottom: 30px;">该版本专门为${serverNames[serverType]}优化，点击确认开始下载</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeModal('serverDownloadModal')" style="padding: 12px 30px; background: var(--dark-card); border: 1px solid var(--border-color); color: var(--light-text); border-radius: 25px; cursor: pointer; font-weight: 600;">
                        取消
                    </button>
                    <a href="https://www.cccimg.com/down.php/3877cae42eff8da8ac4bd65cb5bcfde1.zip" style="padding: 12px 30px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border-radius: 25px; text-decoration: none; font-weight: 600;">
                        确认下载
                    </a>
                </div>
                <p style="color: var(--gray-text); font-size: 0.9rem; margin-top: 20px;">
                    注：当前所有服务器版本使用同一个安装包
                </p>
            </div>
        </div>
    `;
    
    // 如果已经存在，先移除
    const existing = document.getElementById('serverDownloadModal');
    if (existing) existing.remove();
    
    document.body.appendChild(confirmModal);
    showModal('serverDownloadModal');
}

// 下载按钮点击事件
document.getElementById('mainDownloadBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const downloadModal = document.createElement('div');
    downloadModal.id = 'downloadConfirmModal';
    downloadModal.className = 'modal';
    downloadModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">下载确认</h3>
                <button class="modal-close" onclick="closeModal('downloadConfirmModal')">&times;</button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <div style="font-size: 4rem; color: var(--primary-color); margin: 20px 0;">
                    <i class="fas fa-download"></i>
                </div>
                <h3 style="margin-bottom: 10px;">NGA全防 V2.1.5</h3>
                <p style="color: var(--gray-text); margin-bottom: 20px;">文件大小: 58.7 MB | APK格式</p>
                <p style="margin-bottom: 30px;">点击确认开始下载安装包</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeModal('downloadConfirmModal')" style="padding: 12px 30px; background: var(--dark-card); border: 1px solid var(--border-color); color: var(--light-text); border-radius: 25px; cursor: pointer; font-weight: 600;">
                        取消
                    </button>
                    <a href="https://www.cccimg.com/down.php/3877cae42eff8da8ac4bd65cb5bcfde1.zip" style="padding: 12px 30px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border-radius: 25px; text-decoration: none; font-weight: 600;">
                        确认下载
                    </a>
                </div>
                <p style="color: var(--gray-text); font-size: 0.9rem; margin-top: 20px;">
                    请确保您已阅读并同意我们的使用条款
                </p>
            </div>
        </div>
    `;
    
    const existing = document.getElementById('downloadConfirmModal');
    if (existing) existing.remove();
    
    document.body.appendChild(downloadModal);
    showModal('downloadConfirmModal');
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    initCarousel();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const float1 = document.querySelector('.float-1');
        const float2 = document.querySelector('.float-2');
        const float3 = document.querySelector('.float-3');
        
        if(float1 && float2 && float3) {
            float1.style.transform = `translateY(${scrolled * 0.05}px) rotate(${scrolled * 0.02}deg)`;
            float2.style.transform = `translateY(${scrolled * 0.03}px) rotate(${scrolled * 0.01}deg)`;
            float3.style.transform = `translateY(${scrolled * 0.04}px) rotate(${scrolled * 0.015}deg)`;
        }
    });
    
    // 初始化页面不透明度
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // 添加加载动画
    const elements = document.querySelectorAll('.feature-item, .horizontal-card, .vertical-card, .stat-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});

// 防止下拉刷新
document.addEventListener('touchmove', function(e) {
    if(e.touches.length > 1 || (e.scale && e.scale !== 1)) {
        e.preventDefault();
    }
}, { passive: false });