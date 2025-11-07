# Supabase MCP 설정 체크리스트

## 📋 준비물

### 1️⃣ Supabase 프로젝트 생성 (아직 없는 경우)

**방법 A: 웹 대시보드** (권장)
```
1. https://supabase.com 방문
2. "Start your project" 클릭
3. 조직 선택 또는 생성
4. 프로젝트 이름: "personality-agent" (또는 원하는 이름)
5. Database Password 설정 (안전하게 보관!)
6. Region: Northeast Asia (Seoul) 또는 가까운 지역
7. "Create new project" 클릭
8. 프로젝트 생성 대기 (약 2분)
```

**방법 B: CLI** (선택)
```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 생성
supabase projects create personality-agent --region northeast-asia
```

---

### 2️⃣ Supabase API 키 확보

```
프로젝트 대시보드 → Settings → API

필요한 정보:
✅ Project URL: https://[PROJECT_ID].supabase.co
✅ anon public key: eyJhbGciOiJIUzI1... (클라이언트용)
✅ service_role key: eyJhbGciOiJIUzI1... (서버/MCP용, 비공개!)
```

**중요**: `service_role` 키는 RLS를 우회하므로 절대 클라이언트에 노출하지 마세요!

---

### 3️⃣ Claude Desktop 설정 파일 위치 확인

**MacOS**:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```bash
~/.config/Claude/claude_desktop_config.json
```

---

## 🔧 MCP 설정

### Step 1: 설정 파일 열기

```bash
# MacOS
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 또는 터미널 편집기 사용
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 2: Supabase MCP 추가

**기존 설정이 없는 경우** (파일이 비어있거나 `{}`인 경우):

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

**기존에 다른 MCP가 있는 경우** (GitHub 등):

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
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://[YOUR_PROJECT_ID].supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1..."
      }
    }
  }
}
```

**주의사항**:
- `[PROJECT_ID]` 를 실제 프로젝트 ID로 교체
- `service_role` 키는 Settings → API에서 복사
- JSON 문법 검증: https://jsonlint.com

### Step 3: Claude Desktop 재시작

```bash
# MacOS: Command + Q로 완전 종료 후 재시작
# Windows: 작업 관리자에서 Claude 프로세스 종료 후 재시작
# Linux: killall claude && claude
```

---

## ✅ 연결 테스트

### 테스트 1: MCP 서버 확인

Claude Code에서 다음 명령어 실행:

```
"Supabase MCP가 연결되어 있나요?"
```

**예상 응답**:
```
✅ Supabase MCP 서버가 연결되어 있습니다.
프로젝트 URL: https://[PROJECT_ID].supabase.co
```

### 테스트 2: 데이터베이스 연결 확인

```
"Supabase에서 현재 존재하는 테이블 목록을 보여주세요"
```

**예상 응답**:
```
현재 테이블 목록:
(비어있거나, auth.users 등 기본 테이블만 존재)
```

### 테스트 3: SQL 실행 테스트

```
"다음 SQL을 실행해주세요:
SELECT current_database(), version();
"
```

**예상 응답**:
```sql
current_database | postgres
version         | PostgreSQL 15.x ...
```

---

## 🚀 schema.sql 실행 준비

### 방법 A: MCP를 통한 실행 (권장)

Claude Code에서:

```
"database/schema.sql 파일의 내용을 읽어서 Supabase에 실행해주세요"
```

Claude가 자동으로:
1. ✅ schema.sql 파일 읽기
2. ✅ SQL 실행
3. ✅ 결과 확인
4. ✅ 에러 발생 시 디버깅

### 방법 B: Supabase 대시보드 (수동)

```
1. Supabase Dashboard → SQL Editor
2. "+ New query" 클릭
3. database/schema.sql 내용 복사/붙여넣기
4. "Run" (F5) 클릭
5. 성공 메시지 확인
```

### 방법 C: Supabase CLI

```bash
# 프로젝트와 연결
supabase link --project-ref [PROJECT_ID]

# schema.sql 실행
supabase db push --db-url postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

---

## 🔍 실행 후 검증

### 검증 1: 테이블 생성 확인

Claude Code에서:

```
"다음 테이블이 존재하는지 확인해주세요:
- profiles
- persona_profiles
- conversation_patterns
- chat_sessions
- chat_messages
"
```

### 검증 2: RLS 활성화 확인

```
"persona_profiles 테이블의 RLS 정책 목록을 보여주세요"
```

**예상 결과**:
```
✅ View own, public, or official personas
✅ Users can create own personas
✅ Users can update own personas
✅ Users can delete own personas
✅ Admins can manage official personas
```

### 검증 3: 함수 생성 확인

```
"search_similar_patterns 함수가 존재하는지 확인해주세요"
```

### 검증 4: 인덱스 확인

```
"persona_profiles 테이블의 인덱스 목록을 보여주세요"
```

**예상 결과**:
```
✅ idx_persona_creator
✅ idx_persona_visibility
✅ idx_persona_embedding (pgvector)
✅ ...
```

### 검증 5: 샘플 데이터 확인

```
"conversation_patterns 테이블에 데이터가 있는지 확인해주세요"
```

**예상 결과**:
```sql
SELECT COUNT(*) FROM conversation_patterns;
-- 결과: 3 (ISTJ, ENTP, INFP 샘플)
```

---

## 🐛 트러블슈팅

### 오류 1: "MCP 서버가 연결되지 않음"

**해결방법**:
```bash
# 1. 설정 파일 경로 확인
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 2. JSON 문법 검증
# 3. Claude Desktop 완전 종료 후 재시작
# 4. 로그 확인
tail -f ~/Library/Logs/Claude/mcp*.log
```

### 오류 2: "pgvector extension not found"

**해결방법**:

Supabase Dashboard → Database → Extensions → pgvector 활성화

또는 SQL Editor에서:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 오류 3: "permission denied"

**원인**: `service_role` 키 대신 `anon` 키를 사용한 경우

**해결방법**:
- MCP 설정에서 `SUPABASE_SERVICE_ROLE_KEY` 확인
- Settings → API에서 올바른 키 복사

### 오류 4: "relation already exists"

**원인**: 테이블이 이미 존재함

**해결방법**:

Option A - 기존 테이블 삭제 후 재실행:
```sql
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS conversation_patterns CASCADE;
DROP TABLE IF EXISTS persona_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Option B - 새 데이터베이스 생성:
```
Supabase Dashboard → Settings → General → Pause project
→ Delete project → 새 프로젝트 생성
```

---

## 📊 다음 단계

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...

# OpenAI
OPENAI_API_KEY=sk-proj-...
```

### 2. Next.js 프로젝트 초기화

```bash
# Next.js 16 + TypeScript
npx create-next-app@latest personality-agent \
  --typescript \
  --tailwind \
  --app \
  --import-alias "@/*"
```

### 3. Supabase 클라이언트 설정

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## ✅ 최종 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] Project URL 및 API 키 확보
- [ ] Claude Desktop MCP 설정 파일 편집
- [ ] Claude Desktop 재시작
- [ ] MCP 연결 테스트 성공
- [ ] schema.sql 실행 완료
- [ ] 5개 테이블 생성 확인
- [ ] RLS 정책 활성화 확인
- [ ] pgvector extension 활성화 확인
- [ ] 샘플 데이터 3개 확인
- [ ] .env.local 파일 생성

---

## 🎯 준비 완료 시 다음 작업

```
"Phase 1이 완료되었는지 검증해주세요:
1. profiles 테이블 존재
2. persona_profiles 테이블 존재
3. RLS 정책 5개 활성화
4. search_similar_patterns 함수 존재
5. conversation_patterns에 샘플 데이터 3개
"
```

**모든 항목이 ✅이면 Phase 2 (Next.js 앱) 시작!**
