// script.js - NGA全防网站功能 - 增强版包含3D交互

// 粒子背景初始化
function initParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-background';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小和位置
        const size = Math.random() * 60 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // 随机动画延迟
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

// 触觉反馈效果
function addHapticFeedback(element) {
    element.addEventListener('touchstart', function() {
        this.classList.add('haptic-feedback');
    });
    
    element.addEventListener('touchend', function() {
        this.classList.remove('haptic-feedback');
    });
}

// 修复点击特效 - 增强版
document.addEventListener('click', function(e) {
    // 避免在移动设备上频繁触发
    if (window.innerWidth <= 768 && e.target.tagName === 'A') return;
    
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    // 添加声音模拟（可选）
    if (window.innerWidth > 768) {
        try {
            // 创建一个微弱的点击声音（使用Web Audio API）
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 200;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // 忽略音频错误
        }
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
});

// 滚动视差效果
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .stat-item, .section-title');
        
        elements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) translateZ(0)`;
        });
    });
}

// 滚动时改变导航栏样式
window.addEventListener('scroll', function() {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // 添加滚动进度指示器
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercentage}%`);
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
let isAutoPlaying = true;

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
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                </div>
                <div class="carousel-info">
                    <div class="carousel-title">${item.title}</div>
                    <div class="carousel-subtitle">${item.subtitle}</div>
                </div>
            </div>
        `;
        
        indicatorsHTML += `
            <div class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                 onclick="goToSlide(${index})"
                 aria-label="切换到第 ${index + 1} 张幻灯片"></div>
        `;
    });
    
    carouselHTML += `
        <div class="carousel-controls">
            <button class="carousel-prev" onclick="prevSlide()" aria-label="上一张">
                ‹
            </button>
            <button class="carousel-next" onclick="nextSlide()" aria-label="下一张">
                ›
            </button>
        </div>
    `;
    
    carouselContainer.innerHTML = carouselHTML;
    indicatorsContainer.innerHTML = indicatorsHTML;
    
    // 添加触摸滑动支持
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopCarousel();
    });
    
    carouselContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', () => {
        const threshold = 50;
        
        if (startX - endX > threshold) {
            nextSlide();
        } else if (endX - startX > threshold) {
            prevSlide();
        }
        
        startCarousel();
    });
    
    // 自动轮播
    startCarousel();
}

function startCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        if (isAutoPlaying) nextSlide();
    }, 5000);
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
document.querySelector('.carousel-container')?.addEventListener('mouseenter', () => {
    isAutoPlaying = false;
    stopCarousel();
});

document.querySelector('.carousel-container')?.addEventListener('mouseleave', () => {
    isAutoPlaying = true;
    startCarousel();
});

// 3D卡片翻转效果增强
function init3DCards() {
    const cards = document.querySelectorAll('.flip-card, .horizontal-card, .vertical-card, .feature-item');
    
    cards.forEach(card => {
        // 添加触摸反馈
        addHapticFeedback(card);
        
        // 3D悬停效果
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        // 移动端触摸效果
        card.addEventListener('touchstart', () => {
            if (window.innerWidth <= 768) {
                card.style.transform = 'scale(0.98)';
            }
        });
        
        card.addEventListener('touchend', () => {
            if (window.innerWidth <= 768) {
                card.style.transform = 'scale(1)';
            }
        });
    });
    
    // 专门的翻转卡片
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // 移动端使用更简单的翻转
                this.style.transform = this.style.transform.includes('rotateY(180deg)') 
                    ? 'rotateY(0)' 
                    : 'rotateY(180deg)';
            }
        });
    });
}

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 添加触觉反馈
        addHapticFeedback(modal);
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
document.getElementById('mainDownloadBtn')?.addEventListener('click', function(e) {
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
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种效果
    initParticles();
    initParallax();
    initCarousel();
    init3DCards();
    
    // 为所有交互元素添加触觉反馈
    const interactiveElements = document.querySelectorAll('button, a, .card-btn, .feature-item, .horizontal-card, .vertical-card');
    interactiveElements.forEach(addHapticFeedback);
    
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
    document.body.style.transition = 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // 添加加载动画
    const elements = document.querySelectorAll('.feature-item, .horizontal-card, .vertical-card, .stat-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, 100 + (index * 80));
    });
    
    // 添加滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-item, .horizontal-card, .vertical-card, .stat-item, .section-title');
    animatedElements.forEach(el => observer.observe(el));
});

// 防止下拉刷新和双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 禁用双击缩放
document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

// 性能优化：在滚动时暂停动画
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // 在滚动时暂停一些动画以提高性能
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.animationPlayState = 'paused';
            });
            
            setTimeout(() => {
                document.querySelectorAll('.particle').forEach(particle => {
                    particle.style.animationPlayState = 'running';
                });
            }, 100);
            
            ticking = false;
        });
        ticking = true;
    }
});

// 设备检测和优化
function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.documentElement.classList.add('mobile-device');
    }
    
    if (isTablet) {
        document.documentElement.classList.add('tablet-device');
    }
}

// 初始化设备检测
detectDevice();
