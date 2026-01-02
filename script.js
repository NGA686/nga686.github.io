// script.js - NGA全防网站功能 - 改进版

// ==================== 工具函数 ====================
const Utils = {
    // 创建点击特效
    createRipple: function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    },
    
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 防止默认滚动行为
    preventScroll: function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
};

// ==================== 轮播图模块 ====================
const Carousel = {
    data: [
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
    ],
    
    currentSlide: 0,
    interval: null,
    
    // 初始化轮播图
    init: function() {
        const container = document.getElementById('carousel');
        const indicators = document.getElementById('carouselIndicators');
        
        if (!container || !indicators) return;
        
        // 创建轮播图HTML
        let carouselHTML = '';
        let indicatorsHTML = '';
        
        this.data.forEach((item, index) => {
            carouselHTML += this.createSlideHTML(item, index);
            indicatorsHTML += this.createIndicatorHTML(index);
        });
        
        carouselHTML += this.createControlsHTML();
        
        container.innerHTML = carouselHTML;
        indicators.innerHTML = indicatorsHTML;
        
        // 自动轮播
        this.start();
        
        // 添加事件监听
        this.addEventListeners();
    },
    
    // 创建轮播项HTML
    createSlideHTML: function(item, index) {
        return `
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
    },
    
    // 创建指示器HTML
    createIndicatorHTML: function(index) {
        return `<div class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="Carousel.goTo(${index})"></div>`;
    },
    
    // 创建控制按钮HTML
    createControlsHTML: function() {
        return `
            <div class="carousel-controls">
                <button class="carousel-prev" onclick="Carousel.prev()">‹</button>
                <button class="carousel-next" onclick="Carousel.next()">›</button>
            </div>
        `;
    },
    
    // 添加事件监听
    addEventListeners: function() {
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stop());
            container.addEventListener('mouseleave', () => this.start());
        }
    },
    
    // 开始自动轮播
    start: function() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.next(), 5000);
    },
    
    // 停止自动轮播
    stop: function() {
        if (this.interval) clearInterval(this.interval);
    },
    
    // 下一张
    next: function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
    },
    
    // 上一张
    prev: function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
    },
    
    // 跳转到指定索引
    goTo: function(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
        
        this.start();
    }
};

// ==================== 堆叠卡片模块 ====================
const StackedCards = {
    data: [
        {
            image: "https://wp.mcyan.cn/view.php/9d3413034063038570b5758569ffb071.jpeg",
            title: "NGA全防核心技术",
            description: "采用先进的动态内存保护技术，实时加密游戏数据"
        },
        {
            image: "https://wp.mcyan.cn/view.php/83446ef89944511a636216938d16feed.jpeg",
            title: "多服务器兼容",
            description: "支持全球服、台湾服、日韩服、越南服"
        },
        {
            image: "https://wp.mcyan.cn/view.php/a33a8ff681ca1cecd7b8c816dca46247.jpeg",
            title: "实时更新保障",
            description: "24小时监控游戏更新，第一时间适配"
        },
        {
            image: "https://wp.mcyan.cn/view.php/86131cb378be166e8e3b402b318f92d4.jpeg",
            title: "安全稳定",
            description: "超过99.8%的安全率，保障账号安全"
        }
    ],
    
    currentIndex: 0,
    isAnimating: false,
    startY: 0,
    isDragging: false,
    dragStartY: 0,
    dragCurrentY: 0,
    
    // 初始化堆叠卡片
    init: function() {
        const container = document.getElementById('stackedCardsContainer');
        if (!container) return;
        
        let cardsHTML = '';
        let indicatorsHTML = '';
        
        this.data.forEach((item, index) => {
            cardsHTML += this.createCardHTML(item, index);
            indicatorsHTML += this.createStackedIndicatorHTML(index);
        });
        
        container.innerHTML = cardsHTML;
        document.getElementById('stackedIndicators').innerHTML = indicatorsHTML;
        
        // 初始更新卡片位置
        this.updateCardPositions();
        
        // 添加事件监听
        this.addEventListeners();
    },
    
    // 创建卡片HTML
    createCardHTML: function(item, index) {
        return `
            <div class="stacked-card ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="stacked-card-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="stacked-card-content">
                    <h3 class="stacked-card-title">${item.title}</h3>
                    <p class="stacked-card-desc">${item.description}</p>
                </div>
            </div>
        `;
    },
    
    // 创建指示器HTML
    createStackedIndicatorHTML: function(index) {
        return `<div class="stacked-indicator ${index === 0 ? 'active' : ''}" onclick="StackedCards.goToCard(${index})"></div>`;
    },
    
    // 添加事件监听
    addEventListeners: function() {
        const cards = document.querySelectorAll('.stacked-card');
        const prevBtn = document.getElementById('stackedPrevBtn');
        const nextBtn = document.getElementById('stackedNextBtn');
        
        // 卡片触摸事件 - 改进版本
        cards.forEach(card => {
            card.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            card.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            card.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        });
        
        // 鼠标事件
        cards.forEach(card => {
            card.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            card.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
        
        // 按钮事件
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        
        // 防止页面滚动
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        }, { passive: false });
    },
    
    // 触摸开始
    handleTouchStart: function(e) {
        if (this.isAnimating || e.touches.length > 1) return;
        this.isDragging = true;
        this.dragStartY = e.touches[0].clientY;
        this.dragCurrentY = this.dragStartY;
        e.preventDefault();
    },
    
    // 触摸移动
    handleTouchMove: function(e) {
        if (!this.isDragging || e.touches.length > 1) return;
        
        const currentCard = document.querySelector('.stacked-card.active');
        if (!currentCard) return;
        
        this.dragCurrentY = e.touches[0].clientY;
        const deltaY = this.dragCurrentY - this.dragStartY;
        
        // 只在垂直方向有显著移动时才处理
        if (Math.abs(deltaY) > 5) {
            e.preventDefault();
            currentCard.style.transform = `translateY(${deltaY}px)`;
        }
    },
    
    // 触摸结束
    handleTouchEnd: function(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const deltaY = this.dragCurrentY - this.dragStartY;
        const threshold = 80; // 提高阈值
        
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                this.prevCard();
            } else {
                this.nextCard();
            }
        } else {
            // 复位
            const currentCard = document.querySelector('.stacked-card.active');
            if (currentCard) {
                currentCard.style.transition = 'transform 0.3s ease';
                currentCard.style.transform = '';
                setTimeout(() => {
                    currentCard.style.transition = '';
                }, 300);
            }
        }
    },
    
    // 鼠标按下
    handleMouseDown: function(e) {
        if (this.isAnimating) return;
        this.isDragging = true;
        this.dragStartY = e.clientY;
        this.dragCurrentY = this.dragStartY;
    },
    
    // 鼠标移动
    handleMouseMove: function(e) {
        if (!this.isDragging) return;
        
        const currentCard = document.querySelector('.stacked-card.active');
        if (!currentCard) return;
        
        this.dragCurrentY = e.clientY;
        const deltaY = this.dragCurrentY - this.dragStartY;
        
        if (Math.abs(deltaY) > 5) {
            currentCard.style.transform = `translateY(${deltaY}px)`;
        }
    },
    
    // 鼠标松开
    handleMouseUp: function(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const deltaY = this.dragCurrentY - this.dragStartY;
        const threshold = 80;
        
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                this.prevCard();
            } else {
                this.nextCard();
            }
        } else {
            // 复位
            const currentCard = document.querySelector('.stacked-card.active');
            if (currentCard) {
                currentCard.style.transition = 'transform 0.3s ease';
                currentCard.style.transform = '';
                setTimeout(() => {
                    currentCard.style.transition = '';
                }, 300);
            }
        }
    },
    
    // 鼠标离开
    handleMouseLeave: function(e) {
        if (this.isDragging) {
            this.handleMouseUp(e);
        }
    },
    
    // 下一张卡片
    nextCard: function() {
        if (this.isAnimating || this.currentIndex >= this.data.length - 1) return;
        
        this.isAnimating = true;
        const oldIndex = this.currentIndex;
        this.currentIndex++;
        
        this.updateCards(oldIndex, this.currentIndex);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    },
    
    // 上一张卡片
    prevCard: function() {
        if (this.isAnimating || this.currentIndex <= 0) return;
        
        this.isAnimating = true;
        const oldIndex = this.currentIndex;
        this.currentIndex--;
        
        this.updateCards(oldIndex, this.currentIndex);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    },
    
    // 跳转到指定卡片
    goToCard: function(index) {
        if (this.isAnimating || index === this.currentIndex || index < 0 || index >= this.data.length) return;
        
        this.isAnimating = true;
        const oldIndex = this.currentIndex;
        this.currentIndex = index;
        
        this.updateCards(oldIndex, this.currentIndex);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    },
    
    // 更新卡片显示
    updateCards: function(oldIndex, newIndex) {
        const cards = document.querySelectorAll('.stacked-card');
        const indicators = document.querySelectorAll('.stacked-indicator');
        
        // 移除旧的活动状态
        cards[oldIndex].classList.remove('active');
        indicators[oldIndex].classList.remove('active');
        
        // 添加新的活动状态
        cards[newIndex].classList.add('active');
        indicators[newIndex].classList.add('active');
        
        // 更新所有卡片的堆叠位置
        this.updateCardPositions();
    },
    
    // 更新卡片位置
    updateCardPositions: function() {
        const cards = document.querySelectorAll('.stacked-card');
        
        cards.forEach((card, index) => {
            const cardIndex = parseInt(card.dataset.index);
            const zIndex = this.data.length - Math.abs(cardIndex - this.currentIndex);
            const offset = Math.abs(cardIndex - this.currentIndex) * 20;
            const scale = 1 - (Math.abs(cardIndex - this.currentIndex) * 0.05);
            const blur = Math.abs(cardIndex - this.currentIndex) * 2;
            const opacity = 1 - (Math.abs(cardIndex - this.currentIndex) * 0.2);
            
            card.style.zIndex = zIndex;
            card.style.transform = `translateY(${offset}px) scale(${scale})`;
            card.style.filter = `blur(${blur}px)`;
            card.style.opacity = opacity;
            
            // 确保当前卡片没有过渡动画干扰
            if (cardIndex === this.currentIndex) {
                card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            } else {
                card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            }
        });
    }
};

// ==================== 模态框模块 ====================
const Modal = {
    // 显示模态框
    show: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },
    
    // 关闭模态框
    close: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },
    
    // 创建下载确认模态框
    createDownloadModal: function(serverType, serverName) {
        const modal = document.createElement('div');
        modal.id = 'serverDownloadModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">下载${serverName}版本</h3>
                    <button class="modal-close" onclick="Modal.close('serverDownloadModal')">&times;</button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <div style="font-size: 4rem; color: var(--primary-color); margin: 20px 0;">
                        <i class="fas fa-download"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">NGA全防 ${serverName}版</h3>
                    <p style="color: var(--gray-text); margin-bottom: 20px;">版本: 2.1.5 | 大小: 58.7 MB</p>
                    <p style="margin-bottom: 30px;">该版本专门为${serverName}优化，点击确认开始下载</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="Modal.close('serverDownloadModal')" style="padding: 12px 30px; background: var(--dark-card); border: 1px solid var(--border-color); color: var(--light-text); border-radius: 25px; cursor: pointer; font-weight: 600;">
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
        
        document.body.appendChild(modal);
        this.show('serverDownloadModal');
    },
    
    // 创建主下载确认模态框
    createMainDownloadModal: function() {
        const modal = document.createElement('div');
        modal.id = 'downloadConfirmModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">下载确认</h3>
                    <button class="modal-close" onclick="Modal.close('downloadConfirmModal')">&times;</button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <div style="font-size: 4rem; color: var(--primary-color); margin: 20px 0;">
                        <i class="fas fa-download"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">NGA全防 V2.1.5</h3>
                    <p style="color: var(--gray-text); margin-bottom: 20px;">文件大小: 58.7 MB | APK格式</p>
                    <p style="margin-bottom: 30px;">点击确认开始下载安装包</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="Modal.close('downloadConfirmModal')" style="padding: 12px 30px; background: var(--dark-card); border: 1px solid var(--border-color); color: var(--light-text); border-radius: 25px; cursor: pointer; font-weight: 600;">
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
        
        document.body.appendChild(modal);
        this.show('downloadConfirmModal');
    }
};

// ==================== 导航模块 ====================
const Navigation = {
    // 初始化导航栏滚动效果
    initHeaderScroll: function() {
        const header = document.getElementById('mainHeader');
        if (!header) return;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100));
    },
    
    // 初始化平滑滚动
    initSmoothScroll: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    // 加入Telegram
    joinTelegram: function() {
        Modal.show('telegramModal');
    }
};

// ==================== 下载功能模块 ====================
const Download = {
    serverNames: {
        'global': '全球服',
        'japan': '日韩服', 
        'taiwan': '台湾服',
        'vietnam': '越南服'
    },
    
    // 下载服务器版本
    server: function(serverType) {
        const serverName = this.serverNames[serverType] || serverType;
        Modal.createDownloadModal(serverType, serverName);
    },
    
    // 主下载功能
    main: function() {
        Modal.createMainDownloadModal();
    },
    
    // 初始化下载按钮事件
    initDownloadButtons: function() {
        const mainBtn = document.getElementById('mainDownloadBtn');
        if (mainBtn) {
            mainBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.main();
            });
        }
    }
};

// ==================== 3D翻转功能模块 ====================
const FlipCards = {
    // 初始化所有翻转卡片
    init: function() {
        // 监听所有翻转卡片点击事件
        document.addEventListener('click', (e) => {
            // 如果点击的是翻转触发器，翻转父卡片
            if (e.target.classList.contains('flip-trigger') || 
                e.target.closest('.flip-trigger')) {
                const trigger = e.target.classList.contains('flip-trigger') ? 
                    e.target : e.target.closest('.flip-trigger');
                const card = trigger.closest('.flip-card');
                if (card) {
                    card.classList.toggle('flipped');
                }
            }
        });
        
        // 为卡片添加翻转动画结束事件
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // 如果点击的是按钮或链接，不触发翻转
                if (e.target.tagName === 'BUTTON' || 
                    e.target.tagName === 'A' ||
                    e.target.closest('button') ||
                    e.target.closest('a')) {
                    return;
                }
                
                // 如果点击的是翻转卡片本身，不触发（避免重复触发）
                if (e.target.classList.contains('flip-card') || 
                    e.target.classList.contains('flip-card-inner')) {
                    this.classList.toggle('flipped');
                }
            });
        });
    }
};

// ==================== 页面初始化 ====================
const App = {
    // 初始化所有模块
    init: function() {
        // 初始化点击特效
        document.addEventListener('click', Utils.createRipple);
        
        // 初始化导航
        Navigation.initHeaderScroll();
        Navigation.initSmoothScroll();
        
        // 初始化轮播图
        Carousel.init();
        
        // 初始化堆叠卡片
        StackedCards.init();
        
        // 初始化3D翻转卡片
        FlipCards.init();
        
        // 初始化下载功能
        Download.initDownloadButtons();
        
        // 添加页面加载动画
        this.addPageAnimations();
        
        // 添加视差效果
        this.addParallaxEffect();
        
        // 防止下拉刷新
        this.preventPullToRefresh();
    },
    
    // 添加页面加载动画
    addPageAnimations: function() {
        // 页面淡入
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        // 元素渐入动画
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
    },
    
    // 添加视差效果
    addParallaxEffect: function() {
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const float1 = document.querySelector('.float-1');
            const float2 = document.querySelector('.float-2');
            const float3 = document.querySelector('.float-3');
            
            if (float1 && float2 && float3) {
                float1.style.transform = `translateY(${scrolled * 0.05}px) rotate(${scrolled * 0.02}deg)`;
                float2.style.transform = `translateY(${scrolled * 0.03}px) rotate(${scrolled * 0.01}deg)`;
                float3.style.transform = `translateY(${scrolled * 0.04}px) rotate(${scrolled * 0.015}deg)`;
            }
        }, 16));
    },
    
    // 防止下拉刷新
    preventPullToRefresh: function() {
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
};

// ==================== 全局函数导出 ====================
// 为了使HTML中的onclick事件正常工作，将关键函数导出到全局作用域
window.showModal = Modal.show;
window.closeModal = Modal.close;
window.joinTelegram = Navigation.joinTelegram;
window.downloadServer = Download.server.bind(Download);
window.prevSlide = Carousel.prev.bind(Carousel);
window.nextSlide = Carousel.next.bind(Carousel);
window.goToSlide = Carousel.goTo.bind(Carousel);
window.prevCard = StackedCards.prevCard.bind(StackedCards);
window.nextCard = StackedCards.nextCard.bind(StackedCards);
window.goToCard = StackedCards.goToCard.bind(StackedCards);

// ==================== 页面加载完成 ====================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
