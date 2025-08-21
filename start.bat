@echo off
echo ================================
echo      星语占卜系统启动脚本
echo ================================
echo.

echo 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [成功] Node.js环境检查通过

echo.
echo 启动星语占卜服务器...
echo 服务将运行在: http://localhost:3000
echo 按 Ctrl+C 停止服务
echo.

node server.js

pause