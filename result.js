document.addEventListener('DOMContentLoaded', function() {
    const resultDisplay = document.getElementById('result-display');
    const backBtn = document.getElementById('back-btn');
    const downloadBtn = document.getElementById('download-btn');
    const metaPanel = document.getElementById('meta-panel');

    // 从sessionStorage中获取SVG与元数据
    const svgContent = sessionStorage.getItem('fortuneSVG');
    const metaRaw = sessionStorage.getItem('fortuneMeta');
    let meta = null;
    try {
        meta = metaRaw ? JSON.parse(metaRaw) : null;
    } catch (e) { meta = null; }

    if (svgContent) {
        resultDisplay.innerHTML = svgContent;
        // 移除临时的存储，防止刷新页面时重复加载
        sessionStorage.removeItem('fortuneSVG');
    } else {
        // 如果没有数据，显示提示信息
        resultDisplay.innerHTML = '<p style="color: #ffdddd; padding: 12px;">未能加载占卜结果，请返回重试。</p>';
    }

    if (meta && metaPanel) {
        const nameEl = document.getElementById('meta-name');
        const genderEl = document.getElementById('meta-gender');
        const birthEl = document.getElementById('meta-birth');
        const questionEl = document.getElementById('meta-question');
        if (nameEl) nameEl.textContent = meta.name || '-';
        if (genderEl) genderEl.textContent = meta.gender || '-';
        if (birthEl) birthEl.textContent = meta.birth_date || '-';
        if (questionEl) questionEl.textContent = meta.question || '-';
        // meta可保留以便用户刷新查看
    } else if (metaPanel) {
        metaPanel.style.display = 'none';
    }

    // 返回按钮事件
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 下载按钮事件
    downloadBtn.addEventListener('click', function() {
        if (svgContent) {
            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `星语占卜结果-${new Date().toISOString().slice(0,10)}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('没有可供下载的占卜结果！');
        }
    });
});
