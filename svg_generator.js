# 创建package.json文件
echo '{
  "name": "svg-fortune-generator",
  "version": "1.0.0",
  "description": "高级SVG占卜卡片生成器",
  "main": "svg_generator.js",
  "scripts": {
    "test": "echo \"No tests yet\""
  },
  "keywords": ["svg", "fortune", "generator", "horoscope"],
  "author": "Your Name",
  "license": "MIT"
}' > package.json
// 高级SVG占卜卡片生成器
class SVGFortuneGenerator {
    constructor() {
        this.width = 800;
        this.height = 600;
    }

    createFortuneCard(fortuneData, user_name) {
        // 生成随机星座符号
        const zodiacSigns = ['♈ 白羊座', '♉ 金牛座', '♊ 双子座', '♋ 巨蟹座', '♌ 狮子座', '♍ 处女座', 
                           '♎ 天秤座', '♏ 天蝎座', '♐ 射手座', '♑ 摩羯座', '♒ 水瓶座', '♓ 双鱼座'];
        const randomZodiac = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
        
        // 生成随机幸运颜色
        const luckyColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const randomColor = luckyColors[Math.floor(Math.random() * luckyColors.length)];

        return `
        <svg width="100%" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- 背景渐变 -->
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0f0c29;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#302b63;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#24243e;stop-opacity:1" />
                </linearGradient>
                
                <!-- 卡片渐变 -->
                <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
                </linearGradient>
                
                <!-- 光晕效果 -->
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                    <feFlood flood-color="#fff" flood-opacity="0.6" result="glowColor"/>
                    <feComposite in="glowColor" in2="blur" operator="in" result="glow"/>
                    <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <!-- 星星图案 -->
                <pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" opacity="0.7"/>
                </pattern>
            </defs>
            
            <!-- 背景 -->
            <rect width="${this.width}" height="${this.height}" fill="url(#bgGradient)"/>
            
            <!-- 星空背景 -->
            <rect width="${this.width}" height="${this.height}" fill="url(#stars)" opacity="0.5"/>
            
            <!-- 装饰性星星 -->
            ${this.generateStars(50)}
            
            <!-- 主卡片 -->
            <rect x="50" y="50" width="700" height="500" rx="25" fill="url(#cardGradient)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            
            <!-- 标题 -->
            <text x="${this.width/2}" y="110" text-anchor="middle" font-size="32" fill="#FFD700" font-weight="bold" filter="url(#glow)" font-family="Arial, sans-serif">
                ${user_name}的星座运势
            </text>
            
            <!-- 星座符号 -->
            <text x="${this.width/2}" y="160" text-anchor="middle" font-size="48" fill="${randomColor}" filter="url(#glow)" font-family="Arial, sans-serif">
                ${randomZodiac}
            </text>
            
            <!-- 分隔线 -->
            <line x1="100" y1="180" x2="700" y2="180" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="5,5"/>
            
            <!-- 运势内容 -->
            <text x="100" y="220" font-size="18" fill="#fff" font-family="Arial, sans-serif">
                ${this.formatFortuneContent(fortuneData)}
            </text>
            
            <!-- 装饰元素 -->
            <circle cx="680" cy="110" r="30" fill="none" stroke="#FFD700" stroke-width="2" stroke-dasharray="5,5" filter="url(#glow)"/>
            <circle cx="120" cy="480" r="25" fill="none" stroke="${randomColor}" stroke-width="2" stroke-dasharray="4,4" filter="url(#glow)"/>
            <path d="M250 500 Q400 530 550 500" fill="none" stroke="#4ECDC4" stroke-width="2" filter="url(#glow)"/>
            
            <!-- 底部装饰 -->
            <text x="${this.width/2}" y="${this.height-30}" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif">
                © 星语占卜系统 - AI星座运势预测
            </text>
        </svg>
        `;
    }

    generateStars(count) {
        let stars = '';
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radius = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.8 + 0.2;
            stars += `<circle cx="${x}" cy="${y}" r="${radius}" fill="#fff" opacity="${opacity}"/>`;
        }
        return stars;
    }

    formatFortuneContent(fortuneData) {
        const lines = [];
        let yPos = 220;
        
        // 格式化运势内容
        Object.entries(fortuneData).forEach(([key, value], index) => {
            const emojiMap = {
                '性格分析': '🔮',
                '事业运势': '💼',
                '感情运势': '❤️',
                '健康建议': '🏥',
                '幸运数字': '🍀',
                '幸运颜色': '🎨'
            };
            
            const emoji = emojiMap[key] || '✨';
            lines.push(`<tspan x="100" dy="${index === 0 ? '0' : '1.4em'}">${emoji} ${key}: ${value}</tspan>`);
        });
        
        return lines.join('');
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SVGFortuneGenerator: SVGFortuneGenerator
    };
}