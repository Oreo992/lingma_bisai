# 星语占卜 - AI算命SVG生成系统

一个结合阿里云AI技术和SVG图形生成的算命系统，用户输入个人信息后，AI分析生成算命结果，并通过SVG技术将结果以美观的图形化方式呈现。

## 功能特点

- 🌟 星座主题界面设计
- 🤖 阿里云AI驱动的算命分析
- 🎨 SVG图形化结果展示
- 🔐 用户自定义API密钥（数据不存储）
- 📱 响应式设计，支持多设备

## 技术栈

- 前端：HTML5 + CSS3 + JavaScript
- 后端：Node.js
- AI引擎：阿里云DashScope API (Qwen模型)
- 图形化：SVG

## 快速开始

### 1. 获取阿里云API密钥

访问 [阿里云DashScope](https://dashscope.aliyuncs.com/) 注册账号并获取API密钥。

### 2. 运行服务

```bash
# 克隆项目
git clone <项目地址>

# 进入项目目录
cd ai-fortune-telling-svg

# 安装依赖（如果有的话）
npm install

# 启动服务
node server.js
```

服务默认运行在 `http://localhost:3000`

### 3. 使用系统

1. 打开浏览器访问 `http://localhost:3000`
2. 输入你的阿里云API密钥
3. 填写个人信息（姓名、生日、性别等）
4. 点击"揭示我的命运"按钮
5. 等待AI生成算命结果并以SVG形式展示

## 系统架构

```
用户界面 (HTML/CSS/JS)
    ↓
后端服务 (Node.js)
    ↓
阿里云AI服务 (DashScope/Qwen)
    ↓
SVG图形生成器
```

## 安全说明

- 用户的API密钥仅用于当前请求，不会存储在服务器上
- 所有通信通过HTTPS进行
- 个人信息不会被保存或用于其他用途

## 自定义开发

### 修改SVG样式

编辑 [svg_generator.js](svg_generator.js) 文件来自定义SVG输出样式。

### 修改提示词

在 [server.js](server.js) 中修改 `callAliyunAPI` 函数中的提示词来调整AI输出内容。

## 部署

可以部署到任何支持Node.js的服务器平台，如：
- 阿里云ECS
- 腾讯云CVM
- Heroku
- Vercel (需要配置)

## 许可证

MIT License