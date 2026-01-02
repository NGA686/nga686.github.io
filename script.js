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
    
    // 阻止默认滚动行为
    preventScroll: function(e) {
        if (e.target.closest('.stacked-cards-container') || 
            e.target.closest('.stacked-card')) {
            e.preventDefault();
        }
    }
};

// ==================== 轮播图模块 - 参数优化 ====================
const Carousel = {
    data: [
        { 
            url: "https://wp.mcyan.cn/view.php/9d3413034063038570b5758569ffb071.jpeg", 
            title: "NGA全防 - 专业级保护",
            subtitle: "全球领先的游戏安全解决方案",
            zoom: 1.08  // 图片缩放参数
        },
        { 
            url: "https://wp.mcyan.cn/view.php/83446ef89944511a636216938d16feed.jpeg", 
            title: "多服务器支持",
            subtitle: "全球服、日韩服、台湾服、越南服全面覆盖",
            zoom: 1.05
        },
        { 
            url: "https://wp.mcyan.cn/view.php/a33a8ff681ca1cecd7b8c816dca46247.jpeg", 
            title: "高级内存加密",
            subtitle: "实时保护游戏数据，防止检测",
            zoom: 1.1
        },
        { 
            url: "https://wp.mcyan.cn/view.php/86131cb378be166e8e3b402b318f92d4.jpeg", 
            title: "实时防护监控",
            subtitle: "24/7全天候保护您的游戏账号",
            zoom: 1.06
        },
        { 
            url: "https://wp.mcyan.cn/view.php/bf607ad1c7f64008aafaa1fbd5065094.jpeg", 
            title: "稳定更新保障",
            subtitle: "持续更新，应对各种检测机制",
            zoom: 1.07
        }
    ],
    
    // 可配置参数
    config: {
        slideDuration: 1000,        // 轮播过渡时间(ms)
        autoPlayDelay: 5000,        // 自动轮播延迟(ms)
        slideEasing: 'ease-in-out', // 过渡曲线
        indicatorActiveScale: 1.3,  // 指示器激活缩放
        imageZoomDuration: 8000,    // 图片缩放动画时间(ms)
        touchSensitivity: 50        // 触摸灵敏度(像素)
    },
    
    currentSlide: 0,
    interval: null,
    touchStartX: 0,
    touchEndX: 0,
    
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
        
        // 应用CSS自定义属性
        this.applyCustomProperties();
        
        // 自动轮播
        this.start();
        
        // 添加事件监听
        this.addEventListeners();
    },
    
    // 应用自定义属性
    applyCustomProperties: function() {
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.style.setProperty('--slide-duration', `${this.config.slideDuration}ms`);
            container.style.setProperty('--auto-play-delay', `${this.config.autoPlayDelay}ms`);
            container.style.setProperty('--slide-easing', this.config.slideEasing);
            container.style.setProperty('--indicator-active-size', this.config.indicatorActiveScale);
            container.style.setProperty('--image-zoom-duration', `${this.config.imageZoomDuration}ms`);
        }
    },
    
    // 创建轮播项HTML
    createSlideHTML: function(item, index) {
        return `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
                 style="transition-duration: ${this.config.slideDuration}ms; transition-timing-function: ${this.config.slideEasing};">
                <div class="carousel-image">
                    <img src="${item.url}" alt="${item.title}" 
                         style="transition-duration: ${this.config.imageZoomDuration}ms; transform: scale(${item.zoom});">
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
        return `<div class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                      onclick="Carousel.goTo(${index})"
                      style="transform: scale(${index === 0 ? this.config.indicatorActiveScale : 1});"></div>`;
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
            // 鼠标事件
            container.addEventListener('mouseenter', () => this.stop());
            container.addEventListener('mouseleave', () => this.start());
            
            // 触摸事件 - 优化滑动
            container.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.stop(); // 触摸时停止自动轮播
            }, { passive: true });
            
            container.addEventListener('touchmove', (e) => {
                e.preventDefault(); // 防止页面滚动
            }, { passive: false });
            
            container.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
                setTimeout(() => this.start(), 3000); // 3秒后恢复自动轮播
            });
        }
    },
    
    // 处理滑动
    handleSwipe: function() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > this.config.touchSensitivity) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    },
    
    // 开始自动轮播
    start: function() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.next(), this.config.autoPlayDelay);
    },
    
    // 停止自动轮播
    stop: function() {
        if (this.interval) clearInterval(this.interval);
    },
    
    // 下一张
    next: function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (slides.length === 0) return;
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].style.transform = 'scale(1)';
        
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].style.transform = `scale(${this.config.indicatorActiveScale})`;
    },
    
    // 上一张
    prev: function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (slides.length === 0) return;
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].style.transform = 'scale(1)';
        
        this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].style.transform = `scale(${this.config.indicatorActiveScale})`;
    },
    
    // 跳转到指定索引
    goTo: function(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (slides.length === 0 || index < 0 || index >= slides.length) return;
        
        slides[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].classList.remove('active');
        indicators[this.currentSlide].style.transform = 'scale(1)';
        
        this.currentSlide = index;
        
        slides[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].classList.add('active');
        indicators[this.currentSlide].style.transform = `scale(${this.config.indicatorActiveScale})`;
        
        this.start();
    }
};

// ==================== 堆叠卡片模块 - 改进版 ====================
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
    isTouching: false,
    
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
        
        // 初始化卡片位置
        this.updateCardsPosition();
        
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
        return `<div class="stacked-indicator ${index === 0 ? 'active' : ''}" 
                      onclick="StackedCards.goToCard(${index})"></div>`;
    },
    
    // 添加事件监听 - 防止网页滚动
    addEventListeners: function() {
        const cards = document.querySelectorAll('.stacked-card');
        const prevBtn = document.getElementById('stackedPrevBtn');
        const nextBtn = document.getElementById('stackedNextBtn');
        const container = document.querySelector('.stacked-cards-container');
        
        // 卡片触摸事件 - 阻止默认滚动行为
        cards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e);
                // 阻止事件冒泡，防止页面滚动
                e.stopPropagation();
            }, { passive: true });
            
            card.addEventListener('touchmove', (e) => {
                this.handleTouchMove(e);
                // 阻止事件冒泡和默认行为，防止页面滚动
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });
            
            card.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e);
                // 阻止事件冒泡
                e.stopPropagation();
            });
        });
        
        // 容器触摸事件 - 防止页面滚动
        if (container) {
            container.addEventListener('touchmove', (e) => {
                // 允许垂直滚动，但阻止水平滚动
                if (Math.abs(e.touches[0].clientX - this.startY) > 10) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
        
        // 按钮事件
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        
        // 鼠标滚轮事件
        if (container) {
            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY > 0) {
                    this.nextCard();
                } else {
                    this.prevCard();
                }
            }, { passive: false });
        }
    },
    
    // 触摸开始
    handleTouchStart: function(e) {
        if (this.isAnimating) return;
        this.isTouching = true;
        this.startY = e.touches[0].clientY;
        document.body.classList.add('prevent-scroll'); // 防止页面滚动
    },
    
    // 触摸移动
    handleTouchMove: function(e) {
        if (this.isAnimating || !this.isTouching) return;
        const currentCard = document.querySelector('.stacked-card.active');
        if (!currentCard) return;
        
        const deltaY = e.touches[0].clientY - this.startY;
        // 限制最大拖动距离
        const maxDelta = 100;
        const limitedDelta = Math.max(-maxDelta, Math.min(maxDelta, deltaY));
        
        currentCard.style.transform = `translateY(${limitedDelta}px) rotate(${limitedDelta * 0.05}deg)`;
    },
    
    // 触摸结束
    handleTouchEnd: function(e) {
        if (this.isAnimating || !this.isTouching) return;
        
        const deltaY = e.changedTouches[0].clientY - this.startY;
        const threshold = 50;
        
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
                currentCard.style.transform = '';
            }
        }
        
        this.isTouching = false;
        setTimeout(() => {
            document.body.classList.remove('prevent-scroll'); // 恢复页面滚动
        }, 100);
    },
    
    // 下一张卡片
    nextCard: function() {
        if (this.isAnimating || this.currentIndex >= this.data.length - 1) return;
        
        this.isAnimating = true;
        const oldIndex = this.currentIndex;
        this.currentIndex++;
        
        this.updateCardsPosition(oldIndex, this.currentIndex);
        
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
        
        this.updateCardsPosition(oldIndex, this.currentIndex);
        
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
        
        this.updateCardsPosition(oldIndex, this.currentIndex);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    },
    
    // 更新卡片位置
    updateCardsPosition: function(oldIndex, newIndex) {
        const cards = document.querySelectorAll('.stacked-card');
        const indicators = document.querySelectorAll('.stacked-indicator');
        
        // 移除旧的活动状态
        if (oldIndex !== undefined && cards[oldIndex]) {
            cards[oldIndex].classList.remove('active');
            cards[oldIndex].style.transform = '';
        }
        
        if (oldIndex !== undefined && indicators[oldIndex]) {
            indicators[oldIndex].classList.remove('active');
        }
        
        // 添加新的活动状态
        if (cards[this.currentIndex]) {
            cards[this.currentIndex].classList.add('active');
        }
        
        if (indicators[this.currentIndex]) {
            indicators[this.currentIndex].classList.add('active');
        }
        
        // 更新所有卡片的堆叠位置
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
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        });
    }
};

// ==================== 3D翻转卡片模块 ====================
const FlipCards = {
    // 翻转卡片数据
    data: [
        {
            frontImage: "https://wp.mcyan.cn/view.php/9d3413034063038570b5758569ffb071.jpeg",
            frontTitle: "内存保护技术",
            frontDesc: "点击查看详细技术参数",
            backTitle: "内存保护详解",
            backDesc: "采用多层内存加密技术，实时监控游戏进程，防止检测工具读取关键数据。",
            features: [
                "实时内存加密",
                "反调试保护",
                "进程隐藏技术",
                "内存混淆算法"
            ],
            badge: "独家"
        },
        {
            frontImage: "https://wp.mcyan.cn/view.php/83446ef89944511a636216938d16feed.jpeg",
            frontTitle: "多服务器支持",
            frontDesc: "点击查看服务器详情",
            backTitle: "服务器兼容性",
            backDesc: "全面支持PUBG所有主流服务器，针对不同地区进行优化适配。",
            features: [
                "全球服优化",
                "亚洲服专属",
                "低延迟连接",
                "实时适配更新"
            ],
            badge: "多服"
        },
        {
            frontImage: "https://wp.mcyan.cn/view.php/a33a8ff681ca1cecd7b8c816dca46247.jpeg",
            frontTitle: "安全稳定性",
            frontDesc: "点击查看安全数据",
            backTitle: "安全性能指标",
            backDesc: "经过严格测试，确保99.8%的安全率，持续监控和更新防护机制。",
            features: [
                "99.8%安全率",
                "24/7监控",
                "实时威胁检测",
                "自动更新防护"
            ],
            badge: "稳定"
        }
    ],
    
    // 初始化3D翻转卡片
    init: function() {
        // 创建翻转卡片容器
        const flipSection = document.createElement('section');
        flipSection.className = 'container';
        flipSection.innerHTML = `
            <h2 class="section-title">核心技术详解</h2>
            <div class="flip-card-container" id="flipCardContainer"></div>
        `;
        
        // 插入到特性网格之后
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && featuresGrid.parentNode) {
            featuresGrid.parentNode.insertBefore(flipSection, featuresGrid.nextSibling);
        }
        
        // 生成翻转卡片
        this.renderFlipCards();
    },
    
    // 渲染翻转卡片
    renderFlipCards: function() {
        const container = document.getElementById('flipCardContainer');
        if (!container) return;
        
        let cardsHTML = '';
        
        this.data.forEach((item, index) => {
            cardsHTML += this.createFlipCardHTML(item, index);
        });
        
        container.innerHTML = cardsHTML;
        
        // 添加点击事件
        this.addFlipCardListeners();
    },
    
    // 创建翻转卡片HTML
    createFlipCardHTML: function(item, index) {
        return `
            <div class="flip-card" data-index="${index}">
                ${item.badge ? `<div class="flip-card-badge">${item.badge}</div>` : ''}
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <div class="flip-card-image">
                            <img src="${item.frontImage}" alt="${item.frontTitle}">
                        </div>
                        <div class="flip-card-content">
                            <h3 class="flip-card-title">${item.frontTitle}</h3>
                            <p class="flip-card-desc">${item.frontDesc}</p>
                            <div style="margin-top: 15px; color: var(--primary-color); font-size: 0.8rem;">
                                <i class="fas fa-hand-pointer"></i> 点击翻转查看详情
                            </div>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="flip-card-content">
                            <h3 class="flip-card-title">${item.backTitle}</h3>
                            <p class="flip-card-desc">${item.backDesc}</p>
                            
                            <ul class="flip-card-features">
                                ${item.features.map(feature => 
                                    `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
                                ).join('')}
                            </ul>
                            
                            <button class="flip-card-btn" onclick="FlipCards.closeFlipCard(${index})">
                                <i class="fas fa-undo"></i> 返回正面
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // 添加翻转卡片事件监听
    addFlipCardListeners: function() {
        const flipCards = document.querySelectorAll('.flip-card');
        
        flipCards.forEach(card => {
            // 点击翻转
            card.addEventListener('click', (e) => {
                // 排除按钮点击
                if (e.target.closest('.flip-card-btn')) return;
                
                const index = parseInt(card.dataset.index);
                this.toggleFlipCard(index);
            });
            
            // 触摸事件
            card.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
            }, { passive: true });
        });
    },
    
    // 切换翻转卡片状态
    toggleFlipCard: function(index) {
        const card = document.querySelector(`.flip-card[data-index="${index}"]`);
        if (!card) return;
        
        card.classList.toggle('flipped');
        
        // 如果有其他翻转的卡片，先翻回来
        document.querySelectorAll('.flip-card').forEach((otherCard, otherIndex) => {
            if (otherIndex !== index && otherCard.classList.contains('flipped')) {
                otherCard.classList.remove('flipped');
            }
        });
    },
    
    // 关闭翻转卡片
    closeFlipCard: function(index) {
        const card = document.querySelector(`.flip-card[data-index="${index}"]`);
        if (card) {
            card.classList.remove('flipped');
        }
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
        
        // 防止下拉刷新和滚动冲突
        this.preventScrollConflicts();
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
    
    // 防止滚动冲突
    preventScrollConflicts: function() {
        // 阻止在特定元素上触发的默认滚动行为
        document.addEventListener('touchmove', function(e) {
            const target = e.target;
            const stackedContainer = target.closest('.stacked-cards-container');
            const stackedCard = target.closest('.stacked-card');
            
            if (stackedContainer || stackedCard) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 防止下拉刷新
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchY - touchStartY;
            
            // 如果正在下拉且页面在顶部，阻止默认行为
            if (touchDiff > 0 && window.pageYOffset === 0) {
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
window.toggleFlipCard = FlipCards.toggleFlipCard.bind(FlipCards);
window.closeFlipCard = FlipCards.closeFlipCard.bind(FlipCards);

// ==================== 页面加载完成 ====================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
