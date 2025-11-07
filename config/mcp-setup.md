# MCP (Model Context Protocol) 설정 가이드

## 🔌 MCP란?

**Model Context Protocol**은 Claude가 외부 시스템과 직접 통합할 수 있게 하는 Anthropic의 프로토콜입니다.

### 주요 이점
- ✅ **직접 실행**: Claude Code가 GitHub/Supabase 직접 조작
- ✅ **실시간 확인**: 명령 실행 후 즉시 결과 확인
- ✅ **자동화**: 반복 작업을 Claude가 자동 처리
- ✅ **효율성**: 수동 복붙 없이 개발 진행

---

## 🐙 GitHub MCP 설정

### 1. GitHub Personal Access Token 생성

```
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 권한 선택:
   ✅ repo (전체)
   ✅ workflow
   ✅ admin:org (조직 사용 시)
5. 토큰 복사 (한 번만 표시됨)
```

### 2. MCP 서버 설치

```bash
# GitHub MCP 서버 (npx로 자동 설치)
npx @modelcontextprotocol/server-github
```

### 3. Claude Desktop 설정

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### 4. Claude Desktop 재시작

```bash
# Claude Desktop 완전 종료 후 재시작
```

### 5. MCP 연결 확인

Claude에게 물어보기:
```
"GitHub MCP가 연결되어 있나요?"
"persona-agent 레포지토리를 생성해주세요"
```

---

## 🗄 Supabase MCP 설정

### 1. Supabase 프로젝트 정보 확인

```
Supabase Dashboard → Settings → API
- Project URL
- anon public key
- service_role key (주의: 강력한 권한)
```

### 2. Supabase MCP 서버 설치

```bash
# Supabase MCP 서버
npm install -g @modelcontextprotocol/server-supabase
```

### 3. Claude Desktop 설정 추가

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://[PROJECT_ID].supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key"
      }
    }
  }
}
```

### 4. 연결 확인

Claude에게 물어보기:
```
"Supabase MCP가 연결되어 있나요?"
"profiles 테이블을 조회해주세요"
```

---

## 🚀 MCP 활용 워크플로우

### Phase 1: 인프라 구축

```typescript
// 1. GitHub 레포 생성
"persona-agent 레포지토리를 생성하고 초기화해주세요"

// 2. Supabase 스키마 실행
"database/schema.sql 파일의 내용을 Supabase에서 실행해주세요"

// 3. 테이블 생성 확인
"profiles, persona_profiles 테이블이 잘 생성되었는지 확인해주세요"

// 4. 초기 커밋
"schema 설정 완료를 커밋해주세요"
```

**Claude Code의 자동 실행:**
```
✅ GitHub: 레포 생성
✅ Supabase: schema.sql 실행
✅ Supabase: SELECT 쿼리로 확인
✅ GitHub: "feat: Setup database schema" 커밋
```

---

### Phase 2: 페르소나 개발

```typescript
// 1. 브랜치 생성
"feature/persona-system 브랜치를 생성해주세요"

// 2. 코드 작성 및 커밋
"페르소나 생성 폼 컴포넌트를 작성하고 커밋해주세요"

// 3. 샘플 데이터 삽입
"ISTJ+CS+1w2 페르소나 1개를 샘플로 삽입해주세요"

// 4. 데이터 확인
"persona_profiles 테이블의 첫 5개 row를 보여주세요"

// 5. PR 생성
"feature/persona-system → main PR을 생성해주세요"
```

---

### Phase 3: 대화 엔진

```typescript
// 1. conversation_patterns 시딩
"ISTJ+CS+1w2 상급자 관계 패턴 3개를 삽입해주세요"

// 2. 벡터 검색 테스트
"'일정이 지연되고 있어요' 메시지로 유사 패턴을 검색해주세요"

// 3. 실시간 대화 테스트
"샘플 대화 세션을 생성하고 메시지를 저장해주세요"

// 4. 통계 확인
"chat_sessions 테이블의 총 세션 수와 메시지 수를 조회해주세요"
```

---

## 📊 MCP로 할 수 있는 작업

### GitHub MCP

| 작업 | 명령 예시 |
|------|----------|
| **레포 생성** | "persona-agent 레포를 생성해주세요" |
| **파일 생성** | "README.md 파일을 생성하고 커밋해주세요" |
| **브랜치 생성** | "develop 브랜치를 생성해주세요" |
| **커밋** | "현재 변경사항을 'feat: Add login' 메시지로 커밋해주세요" |
| **PR 생성** | "feature → main PR을 생성해주세요" |
| **이슈 생성** | "'벡터 검색 최적화' 이슈를 생성해주세요" |
| **코드 조회** | "src/app/api/chat/route.ts 파일을 보여주세요" |

### Supabase MCP

| 작업 | 명령 예시 |
|------|----------|
| **SQL 실행** | "schema.sql을 실행해주세요" |
| **테이블 조회** | "profiles 테이블의 모든 컬럼을 보여주세요" |
| **데이터 삽입** | "profiles에 테스트 사용자를 추가해주세요" |
| **데이터 조회** | "persona_profiles에서 사용 횟수 top 5를 조회해주세요" |
| **RLS 확인** | "profiles 테이블의 RLS 정책을 보여주세요" |
| **벡터 검색** | "유사 패턴을 검색해주세요" |
| **통계 조회** | "총 세션 수와 메시지 수를 보여주세요" |

---

## 🎯 MCP 활용 시나리오

### 시나리오 1: 빠른 프로토타이핑

```
You: "persona-agent 프로젝트를 완전히 새로 시작하고 싶어요"

Claude: 
1. ✅ GitHub: 기존 레포 백업
2. ✅ GitHub: 새 레포 생성
3. ✅ Supabase: 기존 테이블 백업
4. ✅ Supabase: schema.sql 재실행
5. ✅ GitHub: 초기 구조 커밋
→ "완료! 새 프로젝트가 준비되었습니다."
```

### 시나리오 2: 데이터 검증

```
You: "Phase 2가 완료되었는지 확인해주세요"

Claude:
1. ✅ Supabase: persona_profiles 테이블 존재 확인
2. ✅ Supabase: 샘플 데이터 1개 이상 확인
3. ✅ Supabase: profile_embedding 값 존재 확인
4. ✅ GitHub: PersonaForm.tsx 파일 존재 확인
→ "Phase 2 완료 ✅"
```

### 시나리오 3: 버그 수정

```
You: "벡터 검색이 작동하지 않아요"

Claude:
1. ✅ Supabase: search_similar_patterns 함수 존재 확인
2. ✅ Supabase: 테스트 쿼리 실행
3. ✅ Supabase: 에러 로그 확인
4. ✅ GitHub: 수정된 코드 커밋
→ "수정 완료! 테스트 결과: [...]"
```

---

## 🔐 보안 주의사항

### 토큰 관리

```bash
# ❌ 절대 하지 말 것
- 토큰을 Git에 커밋
- 토큰을 공개 공유
- service_role_key를 클라이언트에 노출

# ✅ 해야 할 것
- 토큰을 MCP 설정에만 저장
- 정기적으로 토큰 갱신
- 최소 권한 원칙 적용
```

### GitHub Token 권한

```
권장 권한:
✅ repo (private 레포 접근 필요 시)
✅ public_repo (public 레포만 사용 시)
✅ workflow

불필요한 권한:
❌ admin:org (조직 관리 불필요)
❌ delete_repo (삭제 권한 불필요)
```

### Supabase Service Role Key

```
⚠️ service_role_key는 RLS를 우회합니다!
→ 개발 환경에서만 사용
→ 프로덕션은 anon_key 사용
```

---

## 🆘 트러블슈팅

### MCP 서버가 시작되지 않음

```bash
# Claude Desktop 로그 확인
# MacOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
type %LOCALAPPDATA%\Claude\logs\mcp*.log
```

### GitHub 연결 오류

```bash
# 토큰 권한 확인
curl -H "Authorization: token ghp_your_token" \
  https://api.github.com/user

# 토큰 재생성 및 설정 업데이트
```

### Supabase 연결 오류

```bash
# URL 및 키 확인
curl https://[PROJECT_ID].supabase.co/rest/v1/ \
  -H "apikey: your_service_role_key"
```

### Claude Desktop이 MCP를 인식하지 못함

```bash
# 1. 설정 파일 경로 확인
# 2. JSON 포맷 검증 (https://jsonlint.com)
# 3. Claude Desktop 완전 종료 후 재시작
# 4. MCP 서버 수동 실행으로 에러 확인

npx @modelcontextprotocol/server-github
```

---

## 📚 추가 자료

- **MCP 공식 문서**: https://modelcontextprotocol.io
- **GitHub MCP**: https://github.com/modelcontextprotocol/servers
- **Supabase API**: https://supabase.com/docs/reference/api

---

## ✅ 설정 체크리스트

- [ ] GitHub Personal Access Token 생성
- [ ] Supabase Project URL 및 Service Role Key 확보
- [ ] Claude Desktop 설정 파일 편집
- [ ] Claude Desktop 재시작
- [ ] GitHub MCP 연결 테스트
- [ ] Supabase MCP 연결 테스트
- [ ] 샘플 명령 실행 확인

---

**다음 단계**: MCP를 활용하여 Phase 1 시작!