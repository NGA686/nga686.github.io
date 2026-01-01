// script.js - NGA全防网站增强版功能

// ========== 微交互管理器 ==========
class MicroInteractions {
    constructor() {
        this.initClickEffects();
        this.initButtonEffects();
        this.initScrollEffects();
        this.initHoverEffects();
    }
    
    initClickEffects() {
        document.addEventListener('click', (e) => {
            // 创建涟漪效果
            this.createRipple(e);
            
            // 按钮按压效果
            if (e.target.closest('.btn')) {
                this.createButtonPress(e.target.closest('.btn'));
            }
            
            // 卡片点击效果
            if (e.target.closest('.card-3d')) {
                this.createCardClick(e.target.closest('.card-3d'));
            }
        });
    }
    
    createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    createButtonPress(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    createCardClick(card) {
        card.style.transform = 'perspective(1000px) translateZ(-10px)';
        setTimeout(() => {
            card.style.transform = card.classList.contains('flipped') 
                ? 'perspective(1000px) rotateY(180deg)'
                : 'perspective(1000px) rotateY(0deg)';
        }, 100);
    }
    
    initButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    
    initScrollEffects() {
        const header = document.getElementById('siteHeader');
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            width: 0%;
            z-index: 1001;
            transition: width 0.1s;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            // 头部滚动效果
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // 进度条效果
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
            
            // 视差效果
            this.updateParallax();
        });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed * 0.1);
            particle.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    initHoverEffects() {
        // 卡片悬停效果
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                if (!card.classList.contains('flipped')) {
                    card.style.transform = `
                        perspective(1000px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg)
                    `;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('flipped')) {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                }
            });
        });
        
        // 链接下划线效果
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-1px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }
}

// ========== 3D卡片翻转管理器 ==========
class Card3DManager {
    constructor() {
        this.cards = [];
        this.initCards();
    }
    
    initCards() {
        document.querySelectorAll('.card-3d').forEach(card => {
            this.cards.push(card);
            
            // 添加翻转按钮
            const flipBtn = card.querySelector('.card-flip-hint');
            if (flipBtn) {
                flipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.flipCard(card);
                });
            }
            
            // 卡片点击翻转
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-flip-hint') && !e.target.closest('.btn')) {
                    this.flipCard(card);
                }
            });
            
            // 双击重置
            card.addEventListener('dblclick', () => {
                card.classList.remove('flipped');
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
    
    flipCard(card) {
        card.classList.toggle('flipped');
        
        if (card.classList.contains('flipped')) {
            card.style.transform = 'perspective(1000px) rotateY(180deg)';
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
        
        // 添加翻转音效（可选）
        this.playFlipSound();
    }
    
    playFlipSound() {
        // 可以添加微妙的翻转音效
        const audio = new Audio();
        audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ=="; // 静音音频
        audio.volume = 0.1;
        audio.play().catch(() => {});
    }
    
    resetAllCards() {
        this.cards.forEach(card => {
            card.classList.remove('flipped');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
}

// ========== 轮播图管理器 ==========
class CarouselManager {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.interval = null;
        this.init();
    }
    
    init() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        
        if (this.slides.length === 0) return;
        
        // 初始化第一个slide
        this.slides[0].classList.add('active');
        this.indicators[0].classList.add('active');
        
        // 添加控制按钮事件
        document.querySelector('.carousel-prev')?.addEventListener('click', () => this.prevSlide());
        document.querySelector('.carousel-next')?.addEventListener('click', () => this.nextSlide());
        
        // 添加指示器事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 开始自动轮播
        this.startAutoPlay();
        
        // 鼠标悬停暂停
        const carousel = document.querySelector('.carousel-wrapper');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
    
    prevSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
    
    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        this.startAutoPlay();
    }
}

// ========== 模态框管理器 ==========
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }
    
    init() {
        // 初始化所有模态框
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            const id = modal.id || `modal-${Date.now()}`;
            modal.id = id;
            this.modals.set(id, modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(id));
            }
            
            // 点击外部关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(id);
                }
            });
        });
        
        // 初始化打开模态框的按钮
        document.querySelectorAll('[data-modal]').forEach(btn => {
            const modalId = btn.dataset.modal;
            btn.addEventListener('click', () => this.openModal(modalId));
        });
    }
    
    openModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // 添加打开动画
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }
    
    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }
}

// ========== 页面加载管理器 ==========
class PageLoadManager {
    constructor() {
        this.init();
    }
    
    init() {
        // 页面加载动画
        document.addEventListener('DOMContentLoaded', () => {
            this.animatePageLoad();
            this.initLazyLoad();
            this.initSmoothScroll();
        });
        
        // 窗口加载完成
        window.addEventListener('load', () => {
            this.removeLoadingState();
        });
    }
    
    animatePageLoad() {
        // 设置初始状态
        document.body.style.opacity = '0';
        
        // 渐入动画
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.6s ease';
            document.body.style.opacity = '1';
        }, 100);
        
        // 元素逐一切入
        const animateElements = [
            '.hero-title',
            '.hero-subtitle',
            '.hero-stats',
            '.section-header',
            '.card-3d',
            '.download-stat'
        ];
        
        animateElements.forEach((selector, index) => {
            setTimeout(() => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 50);
                });
            }, 200 + (index * 100));
        });
    }
    
    initLazyLoad() {
        // 图片懒加载
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    initSmoothScroll() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    removeLoadingState() {
        // 移除骨架屏
        document.querySelectorAll('.skeleton').forEach(skeleton => {
            skeleton.classList.remove('skeleton');
        });
    }
}

// ========== 主应用 ==========
class NGAApp {
    constructor() {
        this.microInteractions = null;
        this.cardManager = null;
        this.carouselManager = null;
        this.modalManager = null;
        this.pageLoadManager = null;
    }
    
    init() {
        console.log('🚀 NGA全防网站正在启动...');
        
        // 初始化所有管理器
        this.microInteractions = new MicroInteractions();
        this.cardManager = new Card3DManager();
        this.carouselManager = new CarouselManager();
        this.modalManager = new ModalManager();
        this.pageLoadManager = new PageLoadManager();
        
        // 初始化其他功能
        this.initDownloadEffects();
        this.initDynamicContent();
        this.initTheme();
        
        console.log('✅ NGA全防网站启动完成！');
    }
    
    initDownloadEffects() {
        // 下载按钮特效
        const downloadBtn = document.getElementById('mainDownloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 创建下载动画
                const originalText = downloadBtn.innerHTML;
                downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 下载中...';
                downloadBtn.disabled = true;
                
                // 模拟下载过程
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i class="fas fa-check"></i> 下载完成！';
                    downloadBtn.style.background = 'linear-gradient(135deg, var(--success-color), var(--accent-color))';
                    
                    // 3秒后恢复
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                        downloadBtn.style.background = '';
                        
                        // 打开下载确认模态框
                        this.modalManager?.openModal('downloadConfirmModal');
                    }, 3000);
                }, 1500);
            });
        }
    }
    
    initDynamicContent() {
        // 动态更新统计数据
        this.updateLiveStats();
        
        // 实时时间显示
        this.updateLiveTime();
    }
    
    updateLiveStats() {
        const stats = {
            users: 50000,
            safety: 99.8,
            support: 24
        };
        
        // 模拟实时增长
        setInterval(() => {
            stats.users += Math.floor(Math.random() * 10);
            
            const userElement = document.querySelector('.stat-number:first-child');
            if (userElement) {
                userElement.textContent = stats.users.toLocaleString() + '+';
            }
        }, 5000);
    }
    
    updateLiveTime() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const timeElements = document.querySelectorAll('.live-time');
            timeElements.forEach(el => {
                el.textContent = timeString;
            });
        };
        
        updateTime();
        setInterval(updateTime, 60000); // 每分钟更新一次
    }
    
    initTheme() {
        // 检测系统主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = () => {
            if (prefersDark.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        };
        
        updateTheme();
        prefersDark.addEventListener('change', updateTheme);
        
        // 主题切换按钮（如果需要）
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // 保存到localStorage
                localStorage.setItem('theme', newTheme);
            });
        }
    }
    
    // 工具方法
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--dark-card);
            color: var(--light-text);
            padding: 12px 20px;
            border-radius: var(--radius-md);
            border-left: 4px solid var(--${type}-color);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========== 初始化应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    const app = new NGAApp();
    app.init();
    
    // 全局错误处理
    window.addEventListener('error', (e) => {
        console.error('网站错误:', e.error);
        NGAApp.showToast('发生了一些小问题，正在修复中...', 'error');
    });
    
    // 防止意外离开
    window.addEventListener('beforeunload', (e) => {
        // 可以在这里添加离开确认
    });
});

// ========== 全局函数（为了向后兼容） ==========
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function joinTelegram() {
    showModal('telegramModal');
}

function downloadServer(serverType) {
    const serverNames = {
        'global': '全球服',
        'japan': '日韩服', 
        'taiwan': '台湾服',
        'vietnam': '越南服'
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'serverDownloadModal';
    modal.innerHTML = `
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
                    <button onclick="closeModal('serverDownloadModal')" class="btn btn-secondary">
                        取消
                    </button>
                    <a href="https://www.cccimg.com/down.php/3877cae42eff8da8ac4bd65cb5bcfde1.zip" class="btn btn-primary">
                        确认下载
                    </a>
                </div>
                <p style="color: var(--gray-text); font-size: 0.9rem; margin-top: 20px;">
                    注：当前所有服务器版本使用同一个安装包
                </p>
            </div>
        </div>
    `;
    
    const existing = document.getElementById('serverDownloadModal');
    if (existing) existing.remove();
    
    document.body.appendChild(modal);
    showModal('serverDownloadModal');
}

// 防止下拉刷新（移动端优化）
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
        e.preventDefault();
    }
}, { passive: false });

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // ESC关闭所有模态框
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // 空格键滚动
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        window.scrollBy(0, window.innerHeight * 0.8);
    }
});
