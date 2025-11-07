# 🏠 로컬 환경 설정 가이드

> 새로운 환경(집, 회사, 다른 컴퓨터)에서 프로젝트를 설정하는 방법

## 📦 사전 준비물

- Node.js 18+ 설치
- Git 설치
- Claude Desktop 설치
- GitHub 계정
- Supabase 계정

---

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone https://github.com/noyaong/personality-agent.git
cd personality-agent
```

### 2. MCP 설정

#### 2.1 `.mcp.json` 파일 생성

```bash
cp .mcp.json.example .mcp.json
```

#### 2.2 토큰 발급 및 입력

**Supabase Access Token 발급:**
1. https://supabase.com/dashboard/account/tokens 접속
2. "Generate new token" 클릭
3. 이름: `personality-agent-local`
4. 토큰 복사

**GitHub Personal Access Token 발급:**
1. https://github.com/settings/tokens 접속
2. "Generate new token (classic)" 클릭
3. 이름: `personality-agent-local`
4. 권한 선택:
   - ✅ `repo` (전체)
   - ✅ `workflow`
5. 토큰 복사

#### 2.3 `.mcp.json` 편집

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=tscptdhwdpedngkpmwlm"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "여기에_발급받은_Supabase_토큰_붙여넣기"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "여기에_발급받은_GitHub_토큰_붙여넣기"
      }
    }
  }
}
```

### 3. Claude Desktop 재시작

1. Claude Desktop 완전 종료
2. 다시 실행
3. MCP 서버가 자동으로 로드됨

### 4. 연결 확인

Claude Code에서:
```
"Supabase MCP와 GitHub MCP가 연결되었나요?"
```

---

## 🔐 보안 주의사항

### ✅ DO (해야 할 것)

- `.mcp.json.example`을 템플릿으로 사용
- 각 환경마다 개별 토큰 발급
- 토큰에 최소 권한만 부여
- 토큰을 주기적으로 갱신 (90일 권장)

### ❌ DON'T (하지 말 것)

- `.mcp.json` 파일을 Git에 커밋하지 않기
- 토큰을 공개 채팅/이슈에 올리지 않기
- 스크린샷에 토큰 노출하지 않기
- 토큰을 다른 사람과 공유하지 않기

---

## 📋 체크리스트

### 초기 설정

- [ ] 프로젝트 클론 완료
- [ ] `.mcp.json` 파일 생성
- [ ] Supabase Access Token 발급 및 입력
- [ ] GitHub Personal Access Token 발급 및 입력
- [ ] Claude Desktop 재시작
- [ ] MCP 연결 확인

### 데이터베이스 확인

- [ ] Supabase Dashboard 접속 가능
- [ ] 테이블 5개 확인 (profiles, persona_profiles, etc.)
- [ ] 샘플 데이터 3개 확인 (conversation_patterns)

### Git 설정

- [ ] Git credential helper 설정 (`git config --global credential.helper osxkeychain`)
- [ ] GitHub 인증 테스트 (`git pull`)

---

## 🆘 문제 해결

### MCP 연결 안됨

**증상:** Claude Code에서 MCP 도구를 사용할 수 없음

**해결:**
1. `.mcp.json` 파일이 프로젝트 루트에 있는지 확인
2. JSON 문법 오류 확인 (콤마, 괄호 등)
3. 토큰이 올바르게 입력되었는지 확인
4. Claude Desktop 재시작

### Supabase 연결 오류

**증상:** `Error: Invalid token`

**해결:**
1. https://supabase.com/dashboard/account/tokens 에서 토큰 재발급
2. `.mcp.json`에서 토큰 업데이트
3. Claude Desktop 재시작

### GitHub 연결 오류

**증상:** `Error: Bad credentials`

**해결:**
1. https://github.com/settings/tokens 에서 토큰 재발급
2. `repo` 권한이 선택되었는지 확인
3. `.mcp.json`에서 토큰 업데이트
4. Claude Desktop 재시작

### Git Push 실패

**증상:** `Permission denied` 또는 `Authentication failed`

**해결:**
```bash
# Credential helper 설정
git config --global credential.helper osxkeychain

# SSH 사용하는 경우
git remote set-url origin git@github.com:noyaong/personality-agent.git

# HTTPS 사용하는 경우
git remote set-url origin https://github.com/noyaong/personality-agent.git
```

---

## 📚 추가 문서

- [MCP 설정 가이드](config/mcp-setup.md)
- [프로젝트 상태](PROJECT_STATUS.md)
- [개발 계획](docs/development-phases.md)

---

## 💡 팁

### macOS Keychain 사용

Git 자격증명을 Keychain에 저장하면 매번 입력하지 않아도 됩니다:

```bash
git config --global credential.helper osxkeychain
```

첫 번째 push/pull 시 한 번만 입력하면 Keychain에 저장됩니다.

### SSH 키 사용 (더 안전)

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub에 추가
cat ~/.ssh/id_ed25519.pub
# 복사 후 https://github.com/settings/keys 에 추가

# Remote URL을 SSH로 변경
git remote set-url origin git@github.com:noyaong/personality-agent.git
```

---

**마지막 업데이트:** 2025-11-07
