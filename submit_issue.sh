#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "Missing GITHUB_TOKEN" >&2
  exit 1
fi

if [[ -z "${GITHUB_REPO:-}" ]]; then
  echo "Missing GITHUB_REPO (owner/repo)" >&2
  exit 1
fi

TITLE="${ISSUE_TITLE:-测试：Issue 提交流程是否正常}"
BODY="${ISSUE_BODY:-这是一个用于验证 issue 提交流程的简单测试。}"

API_URL="https://api.github.com/repos/${GITHUB_REPO}/issues"

curl -sS -X POST "$API_URL" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d "$(jq -nc --arg title "$TITLE" --arg body "$BODY" '{title: $title, body: $body}')"

echo
echo "Issue submit request sent to ${API_URL}"
