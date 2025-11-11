# Persona Agent - 심리성향 기반 대화형 AI

> MBTI + DiSC + 애니어그램 기반 AI 페르소나와의 실시간 대화 시뮬레이션

## 🎯 프로젝트 개요

**3가지 심리 프로필**(MBTI + DiSC + 애니어그램)을 조합한 AI 페르소나와 대화하며, 상급자/동료/하급자 관계에 따른 현실적인 커뮤니케이션을 경험하는 서비스입니다.

### 핵심 기술
- **Frontend**: Next.js 16 + shadcn/ui + Vercel AI SDK
- **Backend**: Supabase (PostgreSQL + pgvector + Auth)
- **AI**: OpenAI GPT-4o + text-embedding-3-small
- **Deployment**: Vercel

## 🚀 빠른 시작

### 1. 프로젝트 이해 (5분)
```bash
# 1. 시스템 아키텍처 확인
📄 docs/architecture.md

# 2. 기능 요구사항 확인  
📄 docs/requirements.md
```

### 2. 환경 설정 (10분)
```bash
# 환경 변수 및 패키지 설정
📄 config/environment.md
```

### 3. 데이터베이스 구축 (20분)
```bash
# Supabase SQL Editor에서 실행
📄 database/schema.sql
```

### 4. 개발 시작
```bash
# Phase별 개발 가이드
📄 docs/development-phases.md
```

## 📋 Phase별 참조 문서

### Phase 1: 기초 인프라 (Day 1)
**목표**: Supabase + Next.js 16 + Auth

**필수 문서**:
- 📄 `config/environment.md` - 환경 설정
- 📄 `database/schema.sql` - DB 스키마
- 📄 `docs/architecture.md` - 인증 흐름

### Phase 2: 페르소나 시스템 (Day 2-3)
**목표**: 페르소나 CRUD + 심리 프로필 조합

**필수 문서**:
- 📄 `data/psychology-profiles.json` - MBTI, DiSC, 애니어그램 데이터
- 📄 `docs/requirements.md` - 페르소나 관리 요구사항

### Phase 3: 대화 엔진 (Day 4-5)
**목표**: 실시간 스트리밍 대화 + 벡터 검색

**필수 문서**:
- 📄 `docs/chat-implementation-guide.md` - 채팅 구현 가이드 (React 클로저 문제 해결)
- 📄 `docs/requirements.md` - 대화 시스템 요구사항
- 📄 `data/relationship-guides.json` - 관계별 프롬프트 가이드
- 📄 `database/schema.sql` - 벡터 검색 함수

### Phase 4: 대화 패턴 시딩 (Day 6)
**목표**: 초기 대화 패턴 데이터

**필수 문서**:
- 📄 `data/psychology-profiles.json` - 유형별 특성 참조

## 📁 파일 구조

```
persona-agent-spec/
├── README.md                          ← 지금 보는 파일 (시작점)
│
├── docs/                              ← 설계 문서
│   ├── architecture.md                   시스템 아키텍처, 데이터 흐름
│   ├── requirements.md                   기능/비기능 요구사항
│   └── development-phases.md             Phase별 상세 개발 계획
│
├── database/                          ← 데이터베이스
│   └── schema.sql                        전체 스키마 (테이블, RLS, 함수)
│
├── data/                              ← 구조화된 데이터
│   ├── psychology-profiles.json          MBTI/DiSC/애니어그램 매핑
│   └── relationship-guides.json          관계별 대화 가이드
│
└── config/                            ← 설정
    └── environment.md                    환경 변수, 패키지, 초기화
```

## 🎓 문서 읽는 순서

### 처음 시작하는 경우
```
1. README.md (이 파일)              ← 전체 파악
2. docs/architecture.md             ← 시스템 이해
3. docs/requirements.md             ← 무엇을 만들지
4. docs/development-phases.md       ← 어떻게 만들지
```

### 구현 시작하는 경우
```
Phase 1 → config/environment.md + database/schema.sql
Phase 2 → data/psychology-profiles.json + docs/requirements.md
Phase 3 → data/relationship-guides.json + database/schema.sql
```

## 💡 컨텍스트 효율화 전략

### Claude Code 사용 시
```typescript
// Phase 1: DB 설정
await readFiles([
  'README.md',              // 3KB
  'database/schema.sql'     // 10KB
])
// 총 13KB만 로드

// Phase 2: 페르소나 개발
await readFiles([
  'README.md',                        // 3KB
  'data/psychology-profiles.json',    // 6KB
  'docs/requirements.md'              // 8KB (페르소나 섹션)
])
// 총 17KB만 로드

// Phase 3: 대화 엔진
await readFiles([
  'README.md',                        // 3KB
  'data/relationship-guides.json',    // 2KB
  'docs/requirements.md'              // 8KB (대화 섹션)
])
// 총 13KB만 로드
```

**효과**: 기존 50KB → Phase별 13-17KB (65-70% 감소)

---

## 🔌 MCP (Model Context Protocol) 활용

### MCP로 더 강력한 개발

Claude Code는 **MCP 서버**를 통해 GitHub와 Supabase에 직접 접근할 수 있습니다.

#### GitHub MCP
```typescript
// Claude Code가 직접 실행 가능
✅ 레포지토리 생성 및 초기화
✅ 코드 커밋 및 푸시
✅ 브랜치 생성 및 관리
✅ PR 생성 및 리뷰
✅ 이슈 추적
```

#### Supabase MCP
```typescript
// Claude Code가 직접 실행 가능
✅ SQL 쿼리 직접 실행
✅ 테이블 생성 및 확인
✅ 데이터 삽입/조회
✅ RLS 정책 테스트
✅ 실시간 데이터 모니터링
```

### MCP 활용 예시
```
Phase 1 시작
→ GitHub MCP: 레포 생성
→ Supabase MCP: schema.sql 실행
→ Supabase MCP: "SELECT * FROM profiles" 확인
→ GitHub MCP: "feat: Setup database" 커밋
→ ✅ Phase 1 완료
```

### MCP 설정
```bash
# 상세 설정 가이드
📄 config/mcp-setup.md
```

## 🔗 핵심 링크

- **Supabase Docs**: https://supabase.com/docs
- **Next.js 16**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Vercel AI SDK**: https://sdk.vercel.ai/docs

## 🆘 빠른 참조

### 환경 변수가 필요한가?
→ `config/environment.md`

### 데이터베이스 스키마는?
→ `database/schema.sql`

### MBTI 특성 매핑은?
→ `data/psychology-profiles.json`

### 대화 프롬프트 구조는?
→ `data/relationship-guides.json`

### API 요구사항은?
→ `docs/requirements.md`

### 시스템 아키텍처는?
→ `docs/architecture.md`

---

**시작하기**: 먼저 `docs/architecture.md`를 읽어 시스템 전체를 이해하세요!