# Personality Agent

AI 페르소나 기반 대화 시스템

> MBTI + DiSC + 애니어그램 기반 AI 페르소나와의 실시간 대화

## 🎯 개요

심리 프로필(MBTI + DiSC + 애니어그램)과 관계(상급자/동료/하급자)를 반영한 자연스러운 대화를 제공하는 웹 애플리케이션입니다.

### 핵심 기술
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + pgvector + Auth + RLS)
- **AI**: OpenAI GPT-4o, text-embedding-3-small, Vercel AI SDK
- **Deployment**: Vercel

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Database (Prisma)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

상세 가이드: [config/environment.md](config/environment.md)

### 2. MCP 설정 (Supabase)

Claude Desktop에서 Supabase MCP 설정:

상세 가이드: [config/MCP_SETUP.md](config/MCP_SETUP.md)

### 3. 데이터베이스 설정

Supabase 프로젝트 생성 후 schema.sql 실행

### 4. 의존성 설치 및 시딩

```bash
cd project
npm install
npm run seed:patterns  # 골든 패턴 123개 시딩
```

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

## 🎯 주요 기능

### 1. 페르소나 생성
- MBTI 16가지 유형
- DiSC 16가지 조합 (D, I, S, C + 12가지 조합)
- 애니어그램 9가지 기본 타입
- 심리 프로필 자동 조합 및 설명 생성

### 2. AI 대화
- **GPT-4o 기반** 실시간 스트리밍 대화
- **관계별 어조 조정** (상급자/동료/하급자)
- **벡터 검색 (RAG)** 기반 컨텍스트 증강
- 123개 골든 대화 패턴 활용

### 3. 대화 히스토리
- 세션별 대화 내용 저장
- 검색 및 필터링 (상태, 페르소나)
- 사용 통계 추적

## 📂 프로젝트 구조

```
personality/
├── project/              # Next.js 앱
│   ├── app/             # 페이지 및 API 라우트
│   ├── components/      # React 컴포넌트
│   ├── lib/             # 유틸리티 및 클라이언트
│   ├── data/            # 심리 프로필 정의
│   └── scripts/         # 시딩 스크립트
├── docs/                # 문서
│   ├── ARCHITECTURE.md       # 시스템 아키텍처
│   ├── AI_ARCHITECTURE.md    # AI 시스템 상세
│   ├── requirements.md       # 기능 요구사항
│   └── ...
├── config/              # 환경 설정
│   ├── MCP_SETUP.md          # Supabase MCP 설정 가이드
│   └── environment.md
├── database/            # 데이터베이스
│   └── schema.sql            # PostgreSQL 스키마
└── TODO.md              # 할 일 목록
```

## 📚 문서

### 핵심 문서
- **[TODO.md](TODO.md)** - 할 일 목록 및 진행 상황
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - 전체 시스템 아키텍처
- **[docs/AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md)** - AI 시스템 상세 (벡터 검색, 프롬프트, RAG)
- **[docs/requirements.md](docs/requirements.md)** - 기능 요구사항

### 설정 가이드
- **[config/MCP_SETUP.md](config/MCP_SETUP.md)** - Supabase MCP 설정
- **[config/environment.md](config/environment.md)** - 환경 변수 설정

### 개발 가이드
- **[docs/chat-implementation-guide.md](docs/chat-implementation-guide.md)** - 채팅 구현 가이드
- **[docs/ai-pattern-generation.md](docs/ai-pattern-generation.md)** - AI 패턴 생성 전략

---

## 🤖 AI 시스템 개요

### 벡터 검색 기반 RAG

```
사용자 메시지
    ↓
임베딩 생성 (OpenAI)
    ↓
벡터 검색 (pgvector)
- MBTI + 관계 필터링
- 코사인 유사도 > 0.3
- 상위 3개 패턴 선택
    ↓
시스템 프롬프트 구성
- 페르소나 특성
- 관계별 가이드
- 유사 패턴 컨텍스트
    ↓
GPT-4o 대화 생성
    ↓
스트리밍 응답
```

상세 설명: [docs/AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md)

---

## 📊 현재 상태

### ✅ 완료
- Phase 1-6: 인프라, 앱, 페르소나, 대화, UI, 벡터 검색
- Phase 7: 골든 데이터셋 (123개 패턴), 검색 최적화

### 🚀 진행 중
- Phase 8: 패턴 품질 향상 및 모니터링

상세 내역: [TODO.md](TODO.md)

---

**마지막 업데이트**: 2025-11-14