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
          // 文件未找到
          fs.readFile('./404.html', (err, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
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
            error: '缺少必要字段'
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
        const svgContent = svgGenerator.createFortuneCard(fortuneData, name);
        
        // 返回结果
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          svg: svgContent,
          text: fortuneResult
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  }
});

// 调用阿里云API
async function callAliyunAPI(apiKey, userData) {
  const { name, birth_date, gender, question } = userData;
  
  const prompt = `
请根据以下信息为用户算命：
姓名：${name}
生日：${birth_date}
性别：${gender}
问题：${question || '请为我算命'}

请提供：
1. 性格分析
2. 事业运势
3. 感情运势
4. 健康建议
5. 幸运数字
6. 幸运颜色
  `.trim();
  
  const postData = JSON.stringify({
    model: "qwen-plus",
    messages: [
      {
        role: "system",
        content: "你是一位专业的占卜师，擅长根据用户的个人信息进行占卜和运势预测。请以专业占卜师的身份提供运势分析。"
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
  const lines = text.trim().split('\n');
  const result = {};
  
  for (const line of lines) {
    if (line.includes(':') && !line.startsWith('请提供')) {
      const parts = line.split(':', 2);
      const key = parts[0].trim().replace(/:$/, '');
      const value = parts[1] ? parts[1].trim() : "";
      // 只保留我们需要的键值对
      if (['性格分析', '事业运势', '感情运势', '健康建议', '幸运数字', '幸运颜色'].includes(key)) {
        result[key] = value;
      }
    }
  }
  
  return result;
}

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`星语占卜服务器运行在端口 ${PORT}`);
});