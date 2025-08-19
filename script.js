// 星语占卜 JavaScript 代码
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fortune-form');
    const resultContainer = document.getElementById('fortune-result');
    const loadingElement = document.getElementById('loading');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 显示加载状态
        loadingElement.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        
        // 收集表单数据
        const formData = {
            api_key: document.getElementById('api_key').value,
            name: document.getElementById('name').value,
            birth_date: document.getElementById('birth_date').value,
            gender: document.getElementById('gender').value,
            question: document.getElementById('question').value
        };
        
        try {
            // 调用后端API
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                resultContainer.innerHTML = result.svg;
                resultContainer.classList.remove('hidden');
            } else {
                throw new Error(result.error || '未知错误');
            }
        } catch (error) {
            alert('占卜失败: ' + error.message);
        } finally {
            loadingElement.classList.add('hidden');
        }
    });
});