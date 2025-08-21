const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 处理静态文件
  if (req.method === 'GET') {
    let filePath = '.' + req.url;
    
    // 默认页面
    if (filePath === './') {
      filePath = './index.html';
    }
    
    // 获取文件扩展名
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // 文件未找到，返回404页面
          fs.readFile('./404.html', (err, content) => {
            if (err) {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <title>页面未找到</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white; }
                        h1 { color: #ffd166; }
                        a { color: #4ECDC4; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <h1>404 - 页面未找到</h1>
                    <p>抱歉，您访问的页面不存在。</p>
                    <a href="/">返回首页</a>
                </body>
                </html>
              `);
            } else {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(content, 'utf-8');
            }
          });
        } else {
          // 服务器错误
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        // 成功读取文件
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }

  // 处理API请求
  if (req.method === 'POST' && req.url === '/api/fortune') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const requestData = JSON.parse(body);
        const { api_key, name, birth_date, gender, question } = requestData;
        
        // 验证必要字段
        if (!api_key || !name || !birth_date || !gender) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: '请填写完整的个人信息（API密钥、姓名、生日、性别）'
          }));
          return;
        }
        
        // 验证API密钥格式（基本格式检查）
        if (api_key.length < 20) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'API密钥格式不正确，请检查您的阿里云API密钥'
          }));
          return;
        }
        
        // 调用阿里云API获取占卜结果
        const fortuneResult = await callAliyunAPI(api_key, { name, birth_date, gender, question });
        
        // 解析占卜结果
        const fortuneData = parseFortuneResult(fortuneResult);
        
        // 生成SVG内容
        const SVGFortuneGenerator = require('./svg_generator.js');
        const svgGenerator = new SVGFortuneGenerator();
        const svgContent = svgGenerator.createFortuneCard(fortuneData, name, question);
        
        // 返回结果
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          svg: svgContent,
          text: fortuneResult
        }));
      } catch (error) {
        console.error('算命API错误:', error);
        let errorMessage = '服务暂时不可用，请稍后重试';
        
        if (error.message.includes('API')) {
          errorMessage = 'API调用失败，请检查您的API密钥是否正确';
        } else if (error.message.includes('网络') || error.message.includes('连接')) {
          errorMessage = '网络连接异常，请检查网络后重试';
        }
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: errorMessage
        }));
      }
    });
  }
});

// 调用阿里云API
async function callAliyunAPI(apiKey, userData) {
  const { name, birth_date, gender, question } = userData;
  
  const prompt = `
请作为拥有30年经验的资深命理专家，根据以下信息为用户提供深度专业的占卜分析：

基本信息：
- 姓名：${name}
- 生日：${birth_date} 
- 性别：${gender}
${question ? `- 用户关注问题：${question}` : ''}

请按以下格式提供详细分析：

1. 性格分析：从八字命理角度深入分析性格特质、天赋才能、性格优劣势，给出性格发展建议（100-150字）
2. 事业运势：结合命盘分析事业发展轨迹、财运走向、最佳发展时机、适合的行业领域和职位类型（100-150字）
3. 感情运势：分析感情模式、桃花运势、婚姻状况、人际关系处理方式，给出情感建议（100-150字）  
4. 健康建议：从体质特点出发，分析健康薄弱环节，提供具体的养生方法、饮食建议和生活习惯调整（80-120字）
5. 幸运数字：推荐一个1-99之间的幸运数字，并说明选择理由
6. 幸运颜色：推荐一个有助运势的颜色，并解释其对运势的帮助
${question ? `7. 问题解答：针对用户问题"${question}"深入分析，结合命理学原理给出专业指导，包括：问题根源分析、具体解决方案、时间节点建议、注意事项和后续发展预测（150-200字）` : ''}

分析要求：
- 每项分析必须具体详实，避免模糊表述
- 结合传统命理学理论，但用现代语言表达
- ${question ? '问题解答必须直击要害，提供可执行的具体方案' : ''}
- 给出的建议要有时效性和可操作性
- 语言专业权威，体现深厚的命理功底
  `.trim();
  
  const postData = JSON.stringify({
    model: "qwen-plus",
    messages: [
      {
        role: "system",
        content: "你是一位拥有30年经验的资深命理专家，精通八字、风水、占卜等多种命理学说。你的分析准确深入，建议实用有效，深受客户信赖。你善于将复杂的命理知识用通俗易懂的语言解释，并能针对用户的具体问题给出切实可行的解决方案。"
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const options = {
    hostname: 'dashscope.aliyuncs.com',
    port: 443,
    path: '/compatible-mode/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices.length > 0) {
            resolve(response.choices[0].message.content);
          } else {
            reject(new Error('API返回格式不正确'));
          }
        } catch (error) {
          reject(new Error('解析API响应失败: ' + error.message));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error('请求阿里云API失败: ' + error.message));
    });
    
    req.write(postData);
    req.end();
  });
}

// 解析AI返回的文本结果
function parseFortuneResult(text) {
  const result = {};

  // 默认值，确保总是有内容显示
  const defaultValues = {
    '性格分析': '您具有独特的个性特质，内心丰富，善于思考，具备很强的洞察力和适应能力',
    '事业运势': '事业发展整体向好，把握当前机遇，发挥自身优势，将在专业领域取得突破',
    '感情运势': '感情运势平稳上升，真诚待人将获得美好情缘，现有关系需要用心经营',
    '健康建议': '整体健康状况良好，注意劳逸结合，保持规律作息，适当运动增强体质',
    '幸运数字': Math.floor(Math.random() * 99) + 1,
    '幸运颜色': ['金色', '蓝色', '绿色', '紫色', '红色'][Math.floor(Math.random() * 5)]
  };

  console.log('AI回复原文:', text);

  // 规范化文本，移除Markdown标记但保留标点
  const normalize = (s) => s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\r/g, '')
    .trim();

  const doc = normalize(text);

  const keys = ['性格分析', '事业运势', '感情运势', '健康建议', '幸运数字', '幸运颜色', '问题解答'];
  const headingRegex = new RegExp('(^|\\n)\\s*(?:[#\\-\\*]+\\s*)?(?:[一二三四五六七八九十]+、|[0-9]+[\\.|、]?\\s*)?(' + keys.join('|') + ')[：:]?.*', 'g');

  // 提取所有小节的起止位置
  const sections = [];
  let match;
  while ((match = headingRegex.exec(doc)) !== null) {
    const headingStart = match.index + match[1].length; // 实际标题起点
    const contentStart = headingRegex.lastIndex;        // 标题行之后即为内容开始
    sections.push({ key: match[2], headingStart, contentStart });
  }

  // 根据下一个标题定位当前小节的结束
  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].contentStart;
    const end = i + 1 < sections.length ? sections[i + 1].headingStart : doc.length;
    const raw = doc.slice(start, end).trim();
    if (!raw) continue;

    const key = sections[i].key;
    const cleaned = raw
      .replace(/^[-–—]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (key === '幸运数字') {
      // 先找“推荐数字/幸运数字：XX”，否则取第一个1-3位数字
      const m = cleaned.match(/(?:推荐数字|幸运数字)[：: ]*([0-9]{1,3})/);
      const n = m ? m[1] : ((cleaned.match(/\b([0-9]{1,3})\b/) || [])[1]);
      if (n) result['幸运数字'] = Number(n);
    } else if (key === '幸运颜色') {
      // 找“推荐颜色/幸运颜色：XXXX”，否则从颜色列表里取第一个命中的词
      let c = ((cleaned.match(/(?:推荐颜色|幸运颜色)[：: ]*([^\n。；，,\s]+)/) || [])[1]) || '';
      if (!c) {
        const candidates = ['深蓝色','金色','蓝色','绿色','紫色','红色','黑色','白色','棕色','银色','灰色','粉色','青色','橙色'];
        for (const item of candidates) {
          if (cleaned.includes(item)) { c = item; break; }
        }
      }
      if (c) result['幸运颜色'] = c;
    } else {
      result[key] = cleaned;
    }
  }

  // 填充缺失字段
  Object.keys(defaultValues).forEach(key => {
    if (!result[key] || String(result[key]).length < 2) {
      result[key] = defaultValues[key];
      console.log('使用默认值:', key);
    }
  });

  console.log('最终解析结果:', result);
  return result;
}

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`星语占卜服务器运行在端口 ${PORT}`);
});