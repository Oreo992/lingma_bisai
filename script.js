// 星语占卜 JavaScript 代码
document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('fortune-form');
	// 不再使用右侧占位容器
	let globalLoading = null;
	let loadingTextInterval = null;
	
	// 添加输入验证和提示
	const inputs = form.querySelectorAll('input, select, textarea');
	inputs.forEach(input => {
		input.addEventListener('blur', validateInput);
		input.addEventListener('input', clearError);
	});
	
	function validateInput(e) {
		const input = e.target;
		const value = input.value.trim();
		
		// 清除之前的错误样式
		input.classList.remove('error');
		
		// 验证逻辑
		if (input.hasAttribute('required') && !value) {
			showInputError(input, '此字段为必填项');
		} else if (input.id === 'api_key' && value && value.length < 20) {
			showInputError(input, 'API密钥长度不足，请检查是否完整');
		} else if (input.id === 'name' && value && (value.length < 2 || value.length > 10)) {
			showInputError(input, '姓名长度应在2-10个字符之间');
		}
	}
	
	function showInputError(input, message) {
		input.classList.add('error');
		
		// 移除已存在的错误提示
		const existingError = input.parentNode.querySelector('.error-message');
		if (existingError) {
			existingError.remove();
		}
		
		// 添加错误提示
		const errorDiv = document.createElement('div');
		errorDiv.className = 'error-message';
		errorDiv.textContent = message;
		input.parentNode.appendChild(errorDiv);
	}
	
	function clearError(e) {
		const input = e.target;
		input.classList.remove('error');
		const errorMessage = input.parentNode.querySelector('.error-message');
		if (errorMessage) {
			errorMessage.remove();
		}
	}
	
	form.addEventListener('submit', async function(e) {
		e.preventDefault();
		
		// 验证所有必填字段
		let hasError = false;
		inputs.forEach(input => {
			if (input.hasAttribute('required') && !input.value.trim()) {
				showInputError(input, '此字段为必填项');
				hasError = true;
			}
		});
		
		if (hasError) {
			return;
		}
		
		// 显示加载状态
		showLoading();
		
		// 收集表单数据
		const formData = {
			api_key: document.getElementById('api_key').value.trim(),
			name: document.getElementById('name').value.trim(),
			birth_date: document.getElementById('birth_date').value,
			gender: document.getElementById('gender').value,
			question: document.getElementById('question').value.trim()
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
				// 将SVG结果与元信息存入sessionStorage
				sessionStorage.setItem('fortuneSVG', result.svg);
				sessionStorage.setItem('fortuneMeta', JSON.stringify({
					name: formData.name,
					gender: formData.gender,
					birth_date: formData.birth_date,
					question: formData.question
				}));
				// 跳转到新的结果页面
				window.location.href = 'result.html';
			} else {
				throw new Error(result.error || '未知错误');
			}
		} catch (error) {
			console.error('占卜失败:', error);
			showError('占卜失败: ' + error.message + '\n\n请检查：\n• API密钥是否正确\n• 网络连接是否正常\n• 阿里云服务是否可用');
		} finally {
			hideLoading();
		}
	});
	
	function showLoading() {
		if (!globalLoading) {
			globalLoading = document.createElement('div');
			globalLoading.style.position = 'fixed';
			globalLoading.style.top = '0';
			globalLoading.style.left = '0';
			globalLoading.style.width = '100%';
			globalLoading.style.height = '100%';
			globalLoading.style.background = 'rgba(0,0,0,0.7)';
			globalLoading.style.zIndex = '9999';
			globalLoading.style.display = 'flex';
			globalLoading.style.flexDirection = 'column';
			globalLoading.style.alignItems = 'center';
			globalLoading.style.justifyContent = 'center';
			globalLoading.innerHTML = `
				<div class="spinner"></div>
				<p id="loading-text">正在连接星域...请稍候</p>
			`;
			document.body.appendChild(globalLoading);
			
			const loadingTexts = [
				'正在连接星域...请稍候',
				'星辰正在为您排列命运...',
				'解读宇宙的奥秘中...',
				'AI正在分析您的运势...'
			];
			let textIndex = 0;
			const loadingTextElement = globalLoading.querySelector('#loading-text');
			loadingTextInterval = setInterval(() => {
				textIndex = (textIndex + 1) % loadingTexts.length;
				loadingTextElement.textContent = loadingTexts[textIndex];
			}, 2000);
		}
	}
	
	function hideLoading() {
		if (globalLoading) {
			if (loadingTextInterval) {
				clearInterval(loadingTextInterval);
				loadingTextInterval = null;
			}
			document.body.removeChild(globalLoading);
			globalLoading = null;
		}
	}
	
	function showError(message) {
		// 创建更友好的错误提示
		const errorDiv = document.createElement('div');
		errorDiv.className = 'error-popup';
		errorDiv.innerHTML = `
			<div class="error-content">
				<h3>🔮 占卜遇到了问题</h3>
				<p>${message.replace(/\n/g, '<br>')}</p>
				<button onclick="this.parentElement.parentElement.remove()">我知道了</button>
			</div>
		`;
		
		document.body.appendChild(errorDiv);
		
		// 8秒后自动移除错误提示
		setTimeout(() => {
			if (errorDiv.parentNode) {
				errorDiv.remove();
			}
		}, 8000);
	}
	
	// 添加表单重置功能
	const resetBtn = document.createElement('button');
	resetBtn.type = 'button';
	resetBtn.className = 'reset-btn';
	resetBtn.innerHTML = '🔄 重新开始';
	resetBtn.addEventListener('click', function() {
		form.reset();
		// 清除所有错误状态
		inputs.forEach(input => {
			input.classList.remove('error');
			const errorMessage = input.parentNode.querySelector('.error-message');
			if (errorMessage) {
				errorMessage.remove();
			}
		});
	});
	
	form.appendChild(resetBtn);
});