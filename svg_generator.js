// V2.0 - 东方神秘主义风格SVG占卜卡片生成器
class SVGFortuneGenerator {
    constructor() {
        // 尺寸更适合在独立页面展示
        this.baseWidth = 1000;
        this.baseHeight = 1400; // 竖版构图
        this.padding = 50;
    }

    // 主函数，创建占卜卡片
    createFortuneCard(fortuneData, userName, userQuestion = '') {
        // 使用明确的基准宽度与实例内边距，避免未定义的 this.width/height
        const width = this.baseWidth;
        const padding = this.padding;
        const contentWidth = width - padding * 2;

        // 颜色主题: 深邃星空 + 古铜金 + 月光银
        const colors = {
            bg: 'url(#bgGradient)',
            frame: '#a88e6a', // 古铜金
            title: '#e0cda8', // 淡金色
            text: '#d8d8e0', // 月光银
            highlight: '#f0e68c', // 卡其色高亮
            divider: 'url(#dividerGradient)'
        };

        // 重新规划内容顺序和 emoji
        const orderedKeys = ['问题解答', '性格分析', '事业运势', '感情运势', '健康建议', '幸运指引'];
        const emojiMap = {
            '问题解答': '📜', '性格分析': '🎭', '事业运势': '📈', 
            '感情运势': '💞', '健康建议': '🌿', '幸运指引': '💎'
        };

        // 整合幸运数字和颜色
        if (fortuneData['幸运数字'] || fortuneData['幸运颜色']) {
            fortuneData['幸运指引'] = `数字: ${fortuneData['幸运数字'] || 'N/A'} | 颜色: ${fortuneData['幸运颜色'] || 'N/A'}`;
            delete fortuneData['幸运数字'];
            delete fortuneData['幸运颜色'];
        }

        let contentSVG = '';
        let currentY = 220; // 内容起始Y坐标

        // 绘制问题区域
        if (userQuestion) {
            const { svg, height: questionHeight } = this.createSection('您的问题', userQuestion, currentY, contentWidth, colors, emojiMap);
            contentSVG += svg;
            currentY += questionHeight + 20;
        }

        // 绘制各个运势部分
        orderedKeys.forEach(key => {
            if (fortuneData[key]) {
                const { svg, height: sectionHeight } = this.createSection(key, String(fortuneData[key]), currentY, contentWidth, colors, emojiMap);
                contentSVG += svg;
                currentY += sectionHeight + 15; // 各部分间距
            }
        });

        const dynamicHeight = Math.max(this.baseHeight, currentY + padding);

        return `
        <svg width="100%" viewBox="0 0 ${width} ${dynamicHeight}" xmlns="http://www.w3.org/2000/svg" style="font-family: 'KaiTi', 'STKaiti', 'serif';">
            ${this.defineFiltersAndGradients(colors)}
            
            <!-- 背景 -->
            <rect width="${width}" height="${dynamicHeight}" fill="${colors.bg}" />
            <rect width="${width}" height="${dynamicHeight}" fill="url(#starPattern)" opacity="0.5" />

            <!-- 东方云纹边框 -->
            ${this.createFrame(width, dynamicHeight, padding, colors)}
            
            <!-- 主标题 -->
            <text x="${width / 2}" y="100" text-anchor="middle" font-size="36" fill="${colors.title}" font-weight="bold" filter="url(#textGlow)">
                ${this.escapeXML(userName)}的命运星盘
            </text>
            <text x="${width / 2}" y="140" text-anchor="middle" font-size="16" fill="${colors.text}" opacity="0.8">
                - 星语占卜 AI 深度解析 -
            </text>
            
            <!-- 分隔符: 阴阳/太极符号 -->
            <g transform="translate(${width / 2}, 180) scale(0.08)">
                <path fill="${colors.text}" d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zm0 962.33c-248.69 0-450.33-201.64-450.33-450.33S263.31 61.67 512 61.67s450.33 201.64 450.33 450.33-201.64 450.33-450.33 450.33z"/>
                <path fill="${colors.text}" d="M512 61.67C396.95 61.67 301.32 157.3 301.32 272.35s95.63 210.68 210.68 210.68 210.68-95.63 210.68-210.68S627.05 61.67 512 61.67z"/>
                <path fill="${colors.bg}" d="M512 962.33c115.05 0 210.68-95.63 210.68-210.68s-95.63-210.68-210.68-210.68-210.68 95.63-210.68 210.68S396.95 962.33 512 962.33z"/>
                <path fill="${colors.text}" d="M512 61.67C396.95 61.67 301.32 157.3 301.32 272.35S396.95 483.03 512 483.03V61.67z"/>
            </g>

            <!-- 内容区域 -->
            ${contentSVG}
            
        </svg>
        `;
    }

    // 创建内容区块
    createSection(title, text, y, width, colors, emojiMap) {
        const x = this.padding;
        const wrappedLines = this.wrapText(text, 50);
        const lineHeight = 28;
        const contentHeight = wrappedLines.length * lineHeight;
        const sectionHeight = 60 + contentHeight; // 标题高度 + 内容高度

        const titleText = `${emojiMap[title] || '✨'} ${title}`;

        const svg = `
            <g transform="translate(${x}, ${y})">
                <!-- 标题 -->
                <text x="10" y="25" font-size="22" fill="${colors.title}" font-weight="bold">${this.escapeXML(titleText)}</text>
                
                <!-- 文本内容 -->
                ${wrappedLines.map((line, i) => `
                    <text x="20" y="${60 + i * lineHeight}" font-size="16" fill="${colors.text}">
                        ${this.escapeXML(line)}
            </text>
                `).join('')}
                
                <!-- 分隔线 -->
                <line x1="0" y1="${sectionHeight + 5}" x2="${width}" y2="${sectionHeight + 5}" stroke="${colors.divider}" stroke-width="1.5" stroke-dasharray="5,5" />
            </g>
        `;
        return { svg, height: sectionHeight };
    }
    
    // 文本换行
    wrapText(text, maxLength) {
        if (!text) return [''];
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 检查添加一个字符后是否会超长
            if (currentLine.length >= maxLength && char !== '。' && char !== '，' && char !== '！' && char !== '？') {
                lines.push(currentLine);
                currentLine = '';
            }
            
            currentLine += char;
            
            // 如果是句子结束的标点，则强制换行
            if (char === '。' || char === '！' || char === '？') {
                lines.push(currentLine);
                currentLine = '';
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }

        // 不再限制为 8 行；设置一个宽松上限防止极端情况
        return lines.slice(0, 120);
    }

    // 定义SVG滤镜和渐变
    defineFiltersAndGradients(colors) {
        return `
            <defs>
                <!-- 背景渐变: 深空紫 -->
                <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stop-color="#2a213f" />
                    <stop offset="100%" stop-color="#0c0918" />
                </radialGradient>
                
                <!-- 分隔线渐变 -->
                <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${colors.frame}" stop-opacity="0" />
                    <stop offset="50%" stop-color="${colors.frame}" stop-opacity="1" />
                    <stop offset="100%" stop-color="${colors.frame}" stop-opacity="0" />
                </linearGradient>

                <!-- 文字发光效果 -->
                <filter id="textGlow" x="-0.5" y="-0.5" width="2" height="2">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <!-- 星空图案 -->
                <pattern id="starPattern" patternUnits="userSpaceOnUse" width="200" height="200">
                    <circle cx="20" cy="20" r="1" fill="#fff" opacity="0.8">
                       <animate attributeName="opacity" values="0.2;1;0.2" dur="5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="150" cy="70" r="0.8" fill="#fff" opacity="0.6">
                        <animate attributeName="opacity" values="0.1;0.7;0.1" dur="7s" repeatCount="indefinite"/>
                    </circle>
                     <circle cx="80" cy="150" r="1.2" fill="#fff" opacity="0.9">
                         <animate attributeName="opacity" values="0.3;1;0.3" dur="6s" repeatCount="indefinite"/>
                    </circle>
                </pattern>
            </defs>
        `;
    }

    // 绘制边框
    createFrame(width, height, padding, colors) {
        const cornerSize = 80; // 角落装饰大小
        const p = padding;
        const w = width;
        const h = height;

        return `
            <path d="
                M ${p + cornerSize},${p} L ${w - p - cornerSize},${p}
                Q ${w - p},${p} ${w - p},${p + cornerSize}
                L ${w - p},${h - p - cornerSize}
                Q ${w - p},${h - p} ${w - p - cornerSize},${h - p}
                L ${p + cornerSize},${h - p}
                Q ${p},${h - p} ${p},${h - p - cornerSize}
                L ${p},${p + cornerSize}
                Q ${p},${p} ${p + cornerSize},${p}
                Z"
                fill="none" stroke="${colors.frame}" stroke-width="3" />
            
            <!-- 四个角落的装饰 -->
            ${this.createCorner(p, p, 0, colors.frame)}
            ${this.createCorner(w - p, p, 90, colors.frame)}
            ${this.createCorner(w - p, h - p, 180, colors.frame)}
            ${this.createCorner(p, h - p, 270, colors.frame)}
        `;
    }
    
    // 创建角落装饰
    createCorner(x, y, rotation, color) {
        return `
            <g transform="translate(${x}, ${y}) rotate(${rotation})">
                <path d="M 0,0 L 40,0 M 0,0 L 0,40" fill="none" stroke="${color}" stroke-width="4"/>
                <path d="M 20,0 A 20,20 0 0 1 0,20" fill="none" stroke="${color}" stroke-width="2"/>
            </g>
        `;
    }

    // XML转义
    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// 导出类
module.exports = SVGFortuneGenerator;