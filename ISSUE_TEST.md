# Test Issue Submission

## 直接提交到 GitHub（推荐）

在仓库根目录运行：

```bash
export GITHUB_TOKEN=你的令牌
export GITHUB_REPO=owner/repo
export ISSUE_TITLE='测试：Issue 提交流程是否正常'
export ISSUE_BODY='这是一个用于验证 issue 提交流程的简单测试。'
./submit_issue.sh
```

## 本地测试记录

- Title: 测试：Issue 提交流程是否正常
- Type: test
- Description: 这是一个用于验证 issue 提交流程的简单测试。
- Expected: 能成功记录并追踪该问题。
- Date: 2026-04-27

> 说明：如果未配置 `GITHUB_TOKEN` 或 `GITHUB_REPO`，脚本会直接报错并退出。
