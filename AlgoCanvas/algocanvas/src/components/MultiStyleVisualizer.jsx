import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const MultiStyleVisualizer = ({ codeDNA, style = 'galaxy' }) => {
  const sketchRef = useRef();
  const p5Ref = useRef();
  const [currentStyle, setCurrentStyle] = useState(style);

  // 切换艺术风格
  const changeStyle = (newStyle) => {
    setCurrentStyle(newStyle);
    // 重新渲染
    if (p5Ref.current) {
      p5Ref.current.remove();
      initSketch();
    }
  };

  useEffect(() => {
    if (!codeDNA) return;

    // 初始化 p5 sketch
    initSketch();

    // 清理函数
    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
      }
    };
  }, [codeDNA, currentStyle]);

  const initSketch = () => {
    const sketch = (p) => {
      p.setup = () => {
        const container = sketchRef.current;
        const containerRect = container.getBoundingClientRect();
        p.createCanvas(containerRect.width, containerRect.height);
        p.colorMode(p.HSB, 360, 100, 100, 100);
      };

      p.draw = () => {
        // 根据当前风格选择渲染方法
        switch (currentStyle) {
          case 'galaxy':
            renderGalaxyStyle(p);
            break;
          case 'tree':
            renderTreeStyle(p);
            break;
          case 'city':
            renderCityStyle(p);
            break;
          default:
            renderGalaxyStyle(p);
        }
      };

      p.windowResized = () => {
        const container = sketchRef.current;
        const containerRect = container.getBoundingClientRect();
        p.resizeCanvas(containerRect.width, containerRect.height);
      };

      // 代码星系风格渲染
      const renderGalaxyStyle = (p) => {
        p.background(0, 0, 10);
        
        if (!codeDNA) return;
        
        // 星系中心
        p.fill(200, 100, 100, 80);
        p.noStroke();
        p.ellipse(p.width/2, p.height/2, 30 + p.sin(p.frameCount * 0.05) * 10);
        
        // 基于文件统计创建星球
        codeDNA.structure.fileStats.forEach((file, index) => {
          const angle = p.map(index, 0, codeDNA.structure.fileStats.length, 0, p.TWO_PI);
          const distance = 100 + index * 10;
          const size = p.map(file.lines, 0, 1000, 5, 50);
          const brightness = p.map(file.complexity, 0, 10, 50, 100);
          
          const x = p.width/2 + p.cos(angle + p.frameCount * 0.01 * (index % 3 + 1)) * distance;
          const y = p.height/2 + p.sin(angle + p.frameCount * 0.01 * (index % 3 + 1)) * distance;
          
          // 星球颜色基于文件类型
          let color;
          if (file.name.endsWith('.js')) {
            color = p.color(60, 90, 90);
          } else if (file.name.endsWith('.ts')) {
            color = p.color(180, 90, 90);
          } else if (file.name.endsWith('.py')) {
            color = p.color(120, 90, 90);
          } else if (file.name.endsWith('.java')) {
            color = p.color(30, 90, 90);
          } else {
            color = p.color(280, 90, 90);
          }
          
          p.fill(color);
          p.noStroke();
          p.ellipse(x, y, size);
          
          // 光晕效果
          p.fill(color, brightness/4);
          p.ellipse(x, y, size * 2);
        });
      };

      // 生命之树风格渲染
      const renderTreeStyle = (p) => {
        p.background(0, 0, 10);
        
        if (!codeDNA) return;
        
        p.stroke(120, 80, 50);
        p.strokeWeight(2);
        p.noFill();
        
        // 绘制树干和主要分支
        const drawBranch = (x, y, angle, length, depth) => {
          if (depth <= 0 || length < 5) return;
          
          const x2 = x + p.cos(angle) * length;
          const y2 = y + p.sin(angle) * length;
          
          p.line(x, y, x2, y2);
          
          // 递归绘制子分支
          drawBranch(x2, y2, angle - p.random(0.3, 0.7), length * 0.7, depth - 1);
          drawBranch(x2, y2, angle + p.random(0.3, 0.7), length * 0.7, depth - 1);
          
          // 在末端绘制叶子（基于文件）
          if (depth <= 2) {
            p.noStroke();
            p.fill(120, 80, 90, 70);
            codeDNA.structure.fileStats.forEach((file, index) => {
              if (file.functions > 0) {
                const leafX = x2 + p.cos(p.frameCount * 0.02 + index) * 20;
                const leafY = y2 + p.sin(p.frameCount * 0.02 + index) * 20;
                const leafSize = file.functions * 2;
                p.ellipse(leafX, leafY, leafSize);
              }
            });
          }
        };
        
        // 从底部开始绘制树
        drawBranch(p.width/2, p.height - 50, -p.HALF_PI, 100, codeDNA.structure.maxDepth);
      };

      // 赛博城市风格渲染
      const renderCityStyle = (p) => {
        p.background(0, 0, 10);
        
        if (!codeDNA) return;
        
        // 绘制地平线
        p.stroke(220, 100, 50, 50);
        p.strokeWeight(1);
        p.line(0, p.height - 30, p.width, p.height - 30);
        
        // 基于文件创建建筑物
        const buildingCount = Math.min(codeDNA.totalFiles, 50);
        const buildingWidth = p.width / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
          const file = codeDNA.structure.fileStats[i % codeDNA.structure.fileStats.length];
          const buildingHeight = p.map(file.lines, 0, 1000, 30, p.height * 0.7);
          const x = i * buildingWidth;
          
          // 建筑物主体
          let buildingColor;
          if (file.name.endsWith('.js')) {
            buildingColor = p.color(200, 80, 80);
          } else if (file.name.endsWith('.ts')) {
            buildingColor = p.color(220, 80, 80);
          } else if (file.name.endsWith('.py')) {
            buildingColor = p.color(120, 80, 80);
          } else {
            buildingColor = p.color(280, 80, 80);
          }
          
          p.noStroke();
          p.fill(buildingColor);
          p.rect(x, p.height - buildingHeight - 30, buildingWidth - 2, buildingHeight);
          
          // 建筑物顶部灯光
          p.fill(40, 100, 100);
          p.ellipse(x + buildingWidth/2, p.height - buildingHeight - 30, 5);
        }
        
        // 绘制天空中的光点
        p.stroke(200, 100, 100);
        p.strokeWeight(2);
        for (let i = 0; i < 50; i++) {
          const x = p.random(p.width);
          const y = p.random(p.height * 0.6);
          p.point(x, y);
        }
      };
    };

    // 创建 p5 实例
    p5Ref.current = new p5(sketch, sketchRef.current);
  };

  return (
    <div className="multi-style-visualizer">
      <div className="style-selector">
        <button 
          className={currentStyle === 'galaxy' ? 'active' : ''}
          onClick={() => changeStyle('galaxy')}
        >
          代码星系
        </button>
        <button 
          className={currentStyle === 'tree' ? 'active' : ''}
          onClick={() => changeStyle('tree')}
        >
          生命之树
        </button>
        <button 
          className={currentStyle === 'city' ? 'active' : ''}
          onClick={() => changeStyle('city')}
        >
          赛博城市
        </button>
      </div>
      <div ref={sketchRef} className="visualization-canvas" />
    </div>
  );
};

export default MultiStyleVisualizer;