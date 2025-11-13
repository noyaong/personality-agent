# MCP (Model Context Protocol) 설정 가이드

## 🎯 개요

**Model Context Protocol (MCP)**은 Claude가 외부 시스템(GitHub, Supabase 등)과 직접 통합할 수 있게 하는 Anthropic의 프로토콜입니다.

### 주요 이점
- ✅ Claude Code가 GitHub/Supabase 직접 조작
- ✅ 명령 실행 후 즉시 결과 확인
- ✅ 반복 작업 자동화
- ✅ 수동 복붙 없이 개발 진행

---

## 📦 Supabase MCP 설정

### 1. Supabase 프로젝트 정보 확인

```
Supabase Dashboard → Settings → API
- Project URL: https://[PROJECT_ID].supabase.co
- anon public key: eyJhbGciOiJIUzI1...
- service_role key: eyJhbGciOiJIUzI1... (주의: 강력한 권한)
```

### 2. Claude Desktop 설정 파일 위치

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

### 3. MCP 설정 추가

설정 파일이 없으면 새로 생성:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://[PROJECT_ID].supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1..."
      }
    }
  }
}
```

기존에 다른 MCP(GitHub 등)가 있으면 추가:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://[PROJECT_ID].supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1..."
      }
    }
  }
}
```

### 4. Claude Desktop 재시작

```bash
# MacOS: Cmd + Q로 완전 종료 후 재시작
# Windows: 작업 관리자에서 Claude 프로세스 종료 후 재시작
```

### 5. 연결 확인

Claude Code에서 테스트:

```
"Supabase MCP가 연결되어 있나요?"
```

성공 시 응답:
```
✅ Supabase MCP 서버가 연결되어 있습니다.
프로젝트: https://[PROJECT_ID].supabase.co
```

---

## 🗄 GitHub MCP 설정 (선택사항)

### 1. GitHub Personal Access Token 생성

```
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 권한 선택:
   ✅ repo (전체)
   ✅ workflow
5. 토큰 복사 (한 번만 표시됨)
```

### 2. Claude Desktop 설정 추가

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

---

## 🚀 MCP로 할 수 있는 작업

### Supabase MCP

| 작업 | 명령 예시 |
|------|----------|
| **SQL 실행** | "schema.sql을 실행해주세요" |
| **테이블 조회** | "profiles 테이블의 모든 컬럼을 보여주세요" |
| **데이터 삽입** | "profiles에 테스트 사용자를 추가해주세요" |
| **데이터 조회** | "persona_profiles에서 사용 횟수 top 5를 조회해주세요" |
| **RLS 확인** | "profiles 테이블의 RLS 정책을 보여주세요" |
| **벡터 검색** | "유사 패턴을 검색해주세요" |

### GitHub MCP

| 작업 | 명령 예시 |
|------|----------|
| **레포 생성** | "persona-agent 레포를 생성해주세요" |
| **파일 생성** | "README.md 파일을 생성하고 커밋해주세요" |
| **브랜치 생성** | "develop 브랜치를 생성해주세요" |
| **커밋** | "현재 변경사항을 'feat: Add login' 메시지로 커밋해주세요" |
| **PR 생성** | "feature → main PR을 생성해주세요" |

---

## 🆘 트러블슈팅

### MCP 서버가 시작되지 않음

```bash
# Claude Desktop 로그 확인
# MacOS
tail -f ~/Library/Logs/Claude/mcp*.log

# 설정 파일 JSON 문법 검증
python3 -m json.tool ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Supabase 연결 오류

```bash
# URL 및 키 확인
curl https://[PROJECT_ID].supabase.co/rest/v1/ \
  -H "apikey: your_service_role_key"
```

### "pgvector extension not found"

Supabase Dashboard → Database → Extensions → pgvector 활성화

또는 SQL Editor에서:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 🔐 보안 주의사항

### ❌ 절대 하지 말 것
- 토큰을 Git에 커밋
- 토큰을 공개 공유
- service_role_key를 클라이언트에 노출

### ✅ 해야 할 것
- 토큰을 MCP 설정에만 저장
- 정기적으로 토큰 갱신
- 최소 권한 원칙 적용

⚠️ **service_role_key는 RLS를 우회합니다!**
→ 개발 환경에서만 사용
→ 프로덕션은 anon_key 사용

---

## ✅ 설정 체크리스트

- [ ] Supabase Project URL 및 Service Role Key 확보
- [ ] Claude Desktop 설정 파일 편집
- [ ] Claude Desktop 재시작
- [ ] Supabase MCP 연결 테스트
- [ ] 샘플 명령 실행 확인

---

**다음 단계**: MCP를 활용하여 schema.sql 실행 및 개발 시작!
