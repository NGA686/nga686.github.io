// script.js - 添加新功能

// 设置面板功能
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsClose = document.getElementById('settingsClose');
const customImageGroup = document.getElementById('customImageGroup');
const customImageUrl = document.getElementById('customImageUrl');
const previewImageBtn = document.getElementById('previewImage');
const imagePreview = document.getElementById('imagePreview');
const resetSettingsBtn = document.getElementById('resetSettings');

// 主题按钮
const themeButtons = document.querySelectorAll('.theme-btn');
const colorOptions = document.querySelectorAll('.color-option');

// 切换按钮
const animationsToggle = document.getElementById('animationsToggle');
const flipEffectsToggle = document.getElementById('flipEffectsToggle');
const clickEffectsToggle = document.getElementById('clickEffectsToggle');

// 背景元素
const gridBackground = document.getElementById('gridBackground');
const customBackground = document.getElementById('customBackground');

// 预设背景图片
const backgroundImages = {
    image1: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    image2: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    image3: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
};

// 初始化设置
function initSettings() {
    // 从本地存储加载设置
    const settings = JSON.parse(localStorage.getItem('ngaSettings')) || {
        theme: 'grid',
        customImage: '',
        animations: true,
        flipEffects: true,
        clickEffects: true,
        colorTheme: 'default'
    };
    
    // 应用设置
    applyTheme(settings.theme, settings.customImage);
    animationsToggle.checked = settings.animations;
    flipEffectsToggle.checked = settings.flipEffects;
    clickEffectsToggle.checked = settings.clickEffects;
    
    // 激活对应的主题按钮
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === settings.theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 激活对应的颜色选项
    colorOptions.forEach(option => {
        if (option.dataset.color === settings.colorTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 如果是自定义主题，显示自定义图片输入
    if (settings.theme === 'custom') {
        customImageGroup.classList.add('show');
        if (settings.customImage) {
            customImageUrl.value = settings.customImage;
            updateImagePreview(settings.customImage);
        }
    }
    
    // 应用颜色主题
    applyColorTheme(settings.colorTheme);
}

// 应用主题
function applyTheme(theme, customImage = '') {
    // 隐藏所有背景
    gridBackground.style.display = 'none';
    customBackground.style.display = 'none';
    
    // 显示选中的背景
    if (theme === 'grid') {
        gridBackground.style.display = 'block';
    } else if (theme === 'custom' && customImage) {
        customBackground.style.display = 'block';
        customBackground.style.backgroundImage = `url("${customImage}")`;
    } else if (backgroundImages[theme]) {
        customBackground.style.display = 'block';
        customBackground.style.backgroundImage = `url("${backgroundImages[theme]}")`;
    }
    
    // 更新自定义图片组显示
    if (theme === 'custom') {
        customImageGroup.classList.add('show');
    } else {
        customImageGroup.classList.remove('show');
    }
}

// 应用颜色主题
function applyColorTheme(color) {
    const root = document.documentElement;
    
    switch(color) {
        case 'green':
            root.style.setProperty('--primary-color', '#10b981');
            root.style.setProperty('--secondary-color', '#0ea5e9');
            break;
        case 'purple':
            root.style.setProperty('--primary-color', '#8b5cf6');
            root.style.setProperty('--secondary-color', '#ec4899');
            break;
        case 'orange':
            root.style.setProperty('--primary-color', '#f59e0b');
            root.style.setProperty('--secondary-color', '#ef4444');
            break;
        case 'cyan':
            root.style.setProperty('--primary-color', '#06b6d4');
            root.style.setProperty('--secondary-color', '#3b82f6');
            break;
        default:
            root.style.setProperty('--primary-color', '#ff4757');
            root.style.setProperty('--secondary-color', '#3742fa');
    }
}

// 保存设置到本地存储
function saveSettings() {
    const settings = {
        theme: document.querySelector('.theme-btn.active')?.dataset.theme || 'grid',
        customImage: customImageUrl.value || '',
        animations: animationsToggle.checked,
        flipEffects: flipEffectsToggle.checked,
        clickEffects: clickEffectsToggle.checked,
        colorTheme: document.querySelector('.color-option.active')?.dataset.color || 'default'
    };
    
    localStorage.setItem('ngaSettings', JSON.stringify(settings));
}

// 更新图片预览
function updateImagePreview(url) {
    if (url) {
        imagePreview.innerHTML = `<img src="${url}" alt="预览图片" onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%231e2329\"/><text x=\"50\" y=\"50\" font-family=\"Arial\" font-size=\"14\" fill=\"%23a0a8b6\" text-anchor=\"middle\" dy=\".3em\">图片加载失败</text></svg>'; this.style.objectFit='contain'; this.style.padding='20px'">`;
    } else {
        imagePreview.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--gray-text);"><i class="fas fa-image" style="font-size: 2rem;"></i></div>';
    }
}

// 3D卡片翻转功能
function init3DCards() {
    const flipButtons = document.querySelectorAll('.flip-btn');
    
    flipButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const cardId = this.dataset.card;
            const card3d = document.querySelector(`.card-3d-container:nth-child(${cardId}) .card-3d`);
            
            if (card3d) {
                card3d.classList.toggle('flipped');
                
                // 添加微交互效果
                this.classList.add('btn-press');
                setTimeout(() => {
                    this.classList.remove('btn-press');
                }, 200);
            }
        });
    });
    
    // 卡片点击外部返回
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card-3d-container')) {
            const flippedCards = document.querySelectorAll('.card-3d.flipped');
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
}

// 微交互优化
function initMicroInteractions() {
    // 按钮按压效果
    const allButtons = document.querySelectorAll('button, .btn, .card-btn, .download-btn, .theme-btn, .btn-small, .btn-reset');
    
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.classList.add('btn-press');
        });
        
        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.classList.remove('btn-press');
            }, 200);
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('btn-press');
        });
    });
    
    // 悬停提升效果
    const hoverElements = document.querySelectorAll('.feature-item, .horizontal-card, .vertical-card, .stat-item');
    
    hoverElements.forEach(element => {
        element.classList.add('hover-lift');
    });
    
    // 表单输入效果
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// 设置面板事件监听
settingsBtn.addEventListener('click', function() {
    settingsPanel.classList.add('open');
    this.classList.add('btn-press');
    setTimeout(() => {
        this.classList.remove('btn-press');
    }, 200);
});

settingsClose.addEventListener('click', function() {
    settingsPanel.classList.remove('open');
});

// 主题选择
themeButtons.forEach(button => {
    button.addEventListener('click', function() {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const theme = this.dataset.theme;
        const customImage = customImageUrl.value;
        
        applyTheme(theme, customImage);
        saveSettings();
    });
});

// 颜色主题选择
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        applyColorTheme(this.dataset.color);
        saveSettings();
    });
});

// 自定义图片预览
previewImageBtn.addEventListener('click', function() {
    const url = customImageUrl.value.trim();
    if (url) {
        updateImagePreview(url);
        applyTheme('custom', url);
        saveSettings();
    }
});

// 切换按钮变化保存
[animationsToggle, flipEffectsToggle, clickEffectsToggle].forEach(toggle => {
    toggle.addEventListener('change', function() {
        saveSettings();
        
        // 应用动画设置
        if (this.id === 'animationsToggle') {
            document.body.style.animationPlayState = this.checked ? 'running' : 'paused';
        }
        
        if (this.id === 'clickEffectsToggle') {
            // 点击特效已经通过全局事件控制
            // 这里可以添加额外的控制逻辑
        }
    });
});

// 重置设置
resetSettingsBtn.addEventListener('click', function() {
    if (confirm('确定要恢复默认设置吗？')) {
        localStorage.removeItem('ngaSettings');
        initSettings();
        
        // 添加确认动画
        this.classList.add('shake-animation');
        setTimeout(() => {
            this.classList.remove('shake-animation');
        }, 500);
    }
});

// 自定义图片输入框变化
customImageUrl.addEventListener('input', function() {
    saveSettings();
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化原有功能
    initCarousel();
    
    // 初始化新功能
    initSettings();
    init3DCards();
    initMicroInteractions();
    
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
