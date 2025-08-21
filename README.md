# 星语占卜 - AI算命SVG生成系统

一个结合阿里云AI技术和SVG图形生成的算命系统，用户输入个人信息后，AI分析生成算命结果，并通过SVG技术将结果以美观的图形化方式呈现。

## ✨ 功能特点

- 🌟 **精美的星座主题界面设计**
- 🤖 **阿里云AI驱动的智能算命分析**
- 🎨 **高质量SVG图形化结果展示**
- 🔐 **用户自定义API密钥（数据不存储）**
- 📱 **完全响应式设计，支持所有设备**
- ⚡ **实时输入验证和错误提示**
- 🎭 **动画效果和交互体验优化**
- 🛡️ **安全可靠的数据处理**

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）

#### Windows用户
```bash
# 双击运行启动脚本
start.bat
```

#### Linux/Mac用户
```bash
# 给脚本添加执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

### 方法二：手动启动

#### 1. 获取阿里云API密钥

访问 [阿里云DashScope](https://dashscope.aliyuncs.com/) 注册账号并获取API密钥。

#### 2. 确保Node.js环境

确保您的系统已安装Node.js（建议版本14+）：
```bash
node --version
npm --version
```

#### 3. 启动服务

```bash
# 进入项目目录
cd ai-fortune-telling-svg

# 启动服务
node server.js
```

服务默认运行在 `http://localhost:3000`

### 3. 使用系统

1. 打开浏览器访问 `http://localhost:3000`
2. 输入你的阿里云API密钥
3. 填写个人信息（姓名、生日、性别等）
4. 点击"✨ 揭示我的命运 ✨"按钮
5. 等待AI生成算命结果并以精美的SVG形式展示

## 🏗️ 技术架构

```
用户界面 (HTML/CSS/JS)
    ↓
后端服务 (Node.js)
    ↓
阿里云AI服务 (DashScope/Qwen)
    ↓
SVG图形生成器
```

### 技术栈详情

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **后端**：Node.js (原生HTTP模块)
- **AI引擎**：阿里云DashScope API (Qwen模型)
- **图形化**：SVG + CSS动画
- **字体**：Google Fonts (Noto Sans SC, ZCOOL KuaiLe)

## 🔧 项目结构

```
ai-fortune-telling-svg/
├── server.js              # 后端服务器主文件
├── index.html             # 主页面
├── script.js              # 前端JavaScript逻辑
├── style.css              # 样式表
├── svg_generator.js       # SVG生成器模块
├── 404.html               # 404错误页面
├── package.json           # 项目配置
├── start.bat              # Windows启动脚本
├── start.sh               # Linux/Mac启动脚本
└── README.md              # 项目说明文档
```

## 🛡️ 安全说明

- **隐私保护**：用户的API密钥仅用于当前请求，不会存储在服务器上
- **数据安全**：所有通信通过HTTPS进行（生产环境）
- **信息保护**：个人信息不会被保存或用于其他用途
- **输入验证**：完善的前后端数据验证机制

## 🎨 自定义开发

### 修改SVG样式

编辑 `svg_generator.js` 文件来自定义SVG输出样式：

```javascript
// 修改颜色主题
const luckyColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', /* 添加更多颜色 */];

// 修改卡片尺寸
this.width = 800;  // 修改宽度
this.height = 600; // 修改高度
```

### 修改AI提示词

在 `server.js` 中修改 `callAliyunAPI` 函数中的提示词来调整AI输出内容：

```javascript
const prompt = `
请根据以下信息为用户算命：
// 在这里修改提示词
`;
```

### 修改界面样式

编辑 `style.css` 文件来自定义界面外观：

```css
:root {
  --primary-color: #6a11cb;     /* 主色调 */
  --secondary-color: #2575fc;   /* 次色调 */
  --accent-color: #ff6b6b;      /* 强调色 */
  /* 修改更多变量 */
}
```

## 🚀 部署指南

### 本地部署
项目无需额外依赖，直接运行即可。

### 云服务器部署

#### 阿里云ECS
```bash
# 上传项目文件
scp -r ./ai-fortune-telling-svg user@your-server:/path/to/project

# SSH连接服务器
ssh user@your-server

# 进入项目目录并启动
cd /path/to/project
nohup node server.js &
```

#### Heroku部署
```bash
# 安装Heroku CLI并登录
heroku login

# 创建应用
heroku create your-app-name

# 部署
git push heroku main
```

#### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 🐛 故障排除

### 常见问题

1. **API密钥错误**
   - 确保API密钥来自阿里云DashScope
   - 检查密钥是否有足够的余额
   - 确认密钥权限设置正确

2. **网络连接问题**
   - 检查服务器网络连接
   - 确认防火墙设置
   - 验证DNS解析是否正常

3. **端口占用**
   ```bash
   # 查找占用3000端口的进程
   netstat -ano | findstr :3000
   
   # 杀死进程（Windows）
   taskkill /PID <进程ID> /F
   ```

4. **Node.js版本问题**
   - 推荐使用Node.js 14.0.0或更高版本
   - 使用nvm管理Node.js版本

### 性能优化建议

1. **生产环境配置**
   - 使用PM2进行进程管理
   - 配置NGINX反向代理
   - 启用GZIP压缩

2. **缓存优化**
   - 添加静态资源缓存
   - 实现API响应缓存

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交Bug报告、功能请求或代码贡献！

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 📧 联系我们

- 项目维护者：Developer
- 问题反馈：[GitHub Issues](https://github.com/your-username/ai-fortune-telling-svg/issues)

## 🙏 致谢

- 感谢阿里云提供强大的AI服务
- 感谢Google Fonts提供美观的字体
- 感谢所有贡献者的支持

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！