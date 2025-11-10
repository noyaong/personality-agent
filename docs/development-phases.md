# 개발 단계 (Phases)

## 📋 전체 로드맵

```
Phase 1 (Day 1)    → 기초 인프라
Phase 2 (Day 2-3)  → 페르소나 시스템  
Phase 3 (Day 4-5)  → 대화 엔진
Phase 4 (Day 6)    → 대화 패턴 시딩
Phase 5 (Day 7)    → UI/UX 개선
Phase 6 (Future)   → 고급 기능
```

---

## Phase 1: 기초 인프라 (Day 1)

### 🎯 목표
Supabase + Next.js 16 + Auth 구축

### 🔌 MCP 활용 (권장)

#### GitHub MCP로 레포 초기화
```
Claude에게 요청:
"persona-agent 레포지토리를 생성하고 다음 구조로 초기화해주세요:
- README.md
- .gitignore (Next.js)
- MIT 라이선스"

→ Claude가 자동 실행:
✅ 레포 생성
✅ 기본 파일 생성
✅ 초기 커밋
```

#### Supabase MCP로 DB 구축
```
Claude에게 요청:
"database/schema.sql 파일을 Supabase에서 실행해주세요"

→ Claude가 자동 실행:
✅ SQL 파일 읽기
✅ Supabase에서 실행
✅ 결과 확인
✅ 에러 시 자동 수정
```

### ✅ 체크리스트

#### 1. 환경 설정
- [ ] Node.js 24 설치 확인
- [ ] Supabase 프로젝트 생성
- [ ] Next.js 16 프로젝트 초기화
- [ ] shadcn/ui 초기화
- [ ] 환경 변수 설정 (.env.local)

```bash
# 참조 문서
📄 config/environment.md
```

#### 2. 데이터베이스 구축
- [ ] pgvector extension 활성화
- [ ] 테이블 생성 (profiles, persona_profiles, etc.)
- [ ] 인덱스 생성 (벡터 인덱스 포함)
- [ ] RLS 정책 설정
- [ ] Database Functions 생성

```bash
# Supabase SQL Editor에서 실행
📄 database/schema.sql
```

#### 3. Supabase 클라이언트 설정
- [ ] 브라우저 클라이언트 (`lib/supabase/client.ts`)
- [ ] 서버 클라이언트 (`lib/supabase/server.ts`)
- [ ] 타입 생성 (`database.types.ts`)

```bash
# 타입 자동 생성
supabase gen types typescript --project-id [PROJECT_ID] > src/lib/supabase/database.types.ts
```

#### 4. 인증 시스템
- [ ] Auth 미들웨어 구성 (`middleware.ts`)
- [ ] 로그인 페이지 (`app/(auth)/login/page.tsx`)
- [ ] OAuth 콜백 핸들러 (`app/(auth)/callback/page.tsx`)
- [ ] Google 소셜 로그인 설정
- [ ] GitHub 소셜 로그인 설정
- [ ] 보호된 라우트 테스트

#### 5. 기본 레이아웃
- [ ] 루트 레이아웃 (`app/layout.tsx`)
- [ ] 대시보드 레이아웃 (`app/(dashboard)/layout.tsx`)
- [ ] 네비게이션 컴포넌트
- [ ] 사용자 프로필 드롭다운

### 📦 산출물
- Supabase 프로젝트 (DB + Auth)
- Next.js 16 프로젝트 골격
- 소셜 로그인 동작
- 기본 UI 컴포넌트

### 🧪 테스트
```bash
# 1. 로그인 테스트
- Google 계정으로 로그인
- profiles 테이블에 자동 생성 확인

# 2. Auth 미들웨어 테스트
- /chat 직접 접근 시 /login으로 리다이렉트
- 로그인 후 접근 가능
```

---

## Phase 2: 페르소나 시스템 (Day 2-3)

### 🎯 목표
페르소나 CRUD + 심리 프로필 조합 로직

### ✅ 체크리스트

#### 1. 심리 프로필 데이터 준비
- [ ] MBTI 16가지 특성 매핑 정의
- [ ] DiSC 4가지 스타일 매핑 정의
- [ ] 애니어그램 9+날개 매핑 정의
- [ ] 조합 로직 설계

```bash
# 참조 데이터
📄 data/psychology-profiles.json
```

#### 2. 페르소나 생성 로직
- [ ] 특성 조합 함수 (`lib/personas/traits.ts`)
- [ ] 프로필 텍스트 생성 (`lib/personas/builder.ts`)
- [ ] Vercel AI SDK Embedding 생성 (`lib/ai/embeddings.ts`)
  - `embed({ model: openai.textEmbeddingModel('text-embedding-3-small'), value })` 사용
  - ⚠️ OpenAI SDK 직접 사용 불필요
- [ ] 페르소나 저장 (with vector)

#### 3. API 구현
- [ ] POST `/api/personas` - 생성
- [ ] GET `/api/personas` - 목록 (사용 횟수 순)
- [ ] GET `/api/personas/[id]` - 상세
- [ ] PUT `/api/personas/[id]` - 수정
- [ ] DELETE `/api/personas/[id]` - 삭제

**⚠️ Embedding 저장 전략 (Phase 4)**:
Phase 4에서 Supabase Edge Function + Database Trigger 방식으로 구현:
- INSERT/UPDATE 시 자동으로 Edge Function 호출
- Edge Function에서 Vercel AI SDK로 embedding 생성
- Database에 자동 저장

#### 4. UI 컴포넌트
- [ ] 페르소나 생성 폼 (`components/personas/PersonaForm.tsx`)
  - MBTI 선택 드롭다운 (16가지)
  - DiSC 선택 드롭다운 (12 표준 유형: D, I, S, C + 8 조합, 모두 대문자)
  - 애니어그램 선택 드롭다운 (날개 포함)
  - 실시간 특성 미리보기
- [ ] 페르소나 카드 (`components/personas/PersonaCard.tsx`)
  - 이름, 심리 프로필 뱃지
  - 사용 횟수, 최근 사용 시간
  - 대화 시작 버튼
- [ ] 페르소나 목록 페이지 (`app/(dashboard)/personas/page.tsx`)
- [ ] 페르소나 생성 페이지 (`app/(dashboard)/personas/new/page.tsx`)

#### 5. 데이터 검증
- [ ] Zod 스키마 정의
- [ ] 클라이언트 유효성 검사
- [ ] 서버 유효성 검사

### 📦 산출물
- 페르소나 CRUD 완전 동작
- 심리 프로필 조합 로직
- 벡터 임베딩 생성

### 🧪 테스트
```bash
# 1. 페르소나 생성
- ISTJ + CS + 1w2 선택
- 특성 미리보기 확인
- 생성 후 persona_profiles 테이블 확인
- profile_embedding 값 존재 확인

# 2. 페르소나 목록
- 사용 횟수 순 정렬 확인
- 카드 UI 렌더링 확인

# 3. 페르소나 수정/삭제
- 수정 후 반영 확인
- 삭제 후 RLS로 본인 것만 삭제되는지 확인
```

---

## Phase 3: 대화 엔진 (Day 4-5)

### 🎯 목표
실시간 스트리밍 대화 + 벡터 검색

### ✅ 체크리스트

#### 1. AI SDK 설치 및 Chat API 구현
- [ ] Vercel AI SDK 설치: `npm install ai @ai-sdk/openai`
- [ ] Edge Runtime 설정
- [ ] 페르소나 로드
- [ ] 메시지 임베딩 생성 (Vercel AI SDK `embed`)
- [ ] pgvector 유사 패턴 검색 (Supabase Client)
- [ ] 시스템 프롬프트 빌더 (`lib/ai/prompts.ts`)
- [ ] GPT-4o 스트리밍 호출 (Vercel AI SDK `streamText`)
- [ ] 메시지 자동 저장 (onFinish callback)

```typescript
// src/app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  // 1. 인증 확인
  // 2. 페르소나 로드
  // 3. 임베딩 생성 (embed)
  // 4. 벡터 검색 (Supabase Client)
  // 5. 프롬프트 구성
  // 6. 스트리밍 (streamText)
}
```

#### 2. 대화 UI 컴포넌트
- [ ] ChatInterface (`components/chat/ChatInterface.tsx`)
  - useChat 훅 통합
  - 페르소나 정보 헤더
  - 관계 선택 드롭다운
- [ ] MessageList (`components/chat/MessageList.tsx`)
  - 메시지 렌더링 (user/assistant 구분)
  - 스크롤 자동 하단
  - 로딩 애니메이션
- [ ] MessageInput (`components/chat/MessageInput.tsx`)
  - Textarea (Shift+Enter 줄바꿈)
  - 전송 버튼
  - 로딩 상태
- [ ] RelationshipSelector (`components/chat/RelationshipSelector.tsx`)
  - 상급자/동료/하급자 선택
  - 선택 시 즉시 반영

#### 3. 세션 관리
- [ ] 세션 생성 (chat_sessions)
- [ ] 세션 목록 조회
- [ ] 세션 통계 업데이트 (메시지 수)
- [ ] 세션 종료

#### 4. 관계별 프롬프트
- [ ] 관계 가이드 데이터 (`data/relationship-guides.json`)
- [ ] 동적 프롬프트 생성

```bash
# 참조 데이터
📄 data/relationship-guides.json
```

#### 5. 성능 최적화
- [ ] 벡터 검색 캐싱
- [ ] 메시지 저장 비동기 처리
- [ ] Edge Runtime 최적화

### 📦 산출물
- 실시간 스트리밍 대화 완전 동작
- 관계별 어조 자동 조정
- 벡터 기반 패턴 매칭

### 🧪 테스트
```bash
# 1. 대화 흐름
- 페르소나 선택
- 관계 선택 (상급자)
- 메시지 입력 → 스트리밍 응답 확인
- 존댓말 어조 확인

# 2. 벡터 검색
- 유사 패턴 3-5개 찾는지 확인
- 프롬프트에 패턴 포함 확인

# 3. 메시지 저장
- chat_messages 테이블 확인
- user, assistant 모두 저장 확인

# 4. 관계 변경
- 동료로 변경 → 어조 변화 확인
- 하급자로 변경 → 반말 가능 확인
```

---

## Phase 4: 대화 패턴 시딩 (Day 6)

### 🎯 목표
품질 높은 초기 대화 패턴 데이터 생성

### ✅ 체크리스트

#### 1. 패턴 조합 선정
- [ ] MBTI 16가지 중 핵심 8개 선정
- [ ] DiSC 4가지 조합
- [ ] 애니어그램 9가지 중 핵심 5개 선정
- [ ] 관계 3가지
- [ ] 총 조합: 8 × 4 × 5 × 3 = **480개**
- [ ] 실용적 접근: **50-100개 우선 작성**

#### 2. 패턴 카테고리 정의
- [ ] greeting (인사, 첫 대화)
- [ ] feedback (피드백, 평가)
- [ ] conflict (갈등, 문제 해결)
- [ ] celebration (축하, 긍정 표현)
- [ ] stress_response (스트레스 대응)
- [ ] decision_making (의사결정)
- [ ] information_sharing (정보 전달)

#### 3. 패턴 작성
```json
{
  "mbti": "ISTJ",
  "disc": "CS",
  "enneagram": "1w2",
  "relationship_type": "superior",
  "pattern_category": "feedback",
  "pattern_text": "부하 직원의 실수에 대해 건설적 피드백 제공",
  "example_responses": [
    "이번 실수를 통해 배운 점이 있다면 무엇인가요?",
    "다음부터는 체크리스트를 활용해보세요.",
    "정확성을 높이기 위한 프로세스를 만들어봅시다."
  ],
  "effectiveness_score": 0.8
}
```

#### 4. 임베딩 생성 스크립트
- [ ] 배치 임베딩 생성 (`scripts/seed-patterns.ts`)
- [ ] Supabase 저장
- [ ] 벡터 인덱스 최적화 확인

#### 5. 품질 검증
- [ ] 각 조합별 최소 3개 패턴 확인
- [ ] 예시 응답 품질 검증
- [ ] 벡터 검색 동작 테스트

### 📦 산출물
- conversation_patterns 테이블 50-100개 row
- 각 패턴별 임베딩
- 벡터 검색 동작 확인

### 🧪 테스트
```bash
# 1. 패턴 검색
- "일정이 지연되고 있어요" 입력
- ISTJ+CS+1w2 패턴 검색
- 유사도 > 0.7 확인

# 2. 프롬프트 반영
- 검색된 패턴이 시스템 프롬프트에 포함
- 응답에 패턴 스타일 반영 확인
```

---

## Phase 5: UI/UX 개선 (Day 7)

### 🎯 목표
사용성 향상 및 품질 개선

### ✅ 체크리스트

#### 1. 다크 모드
- [ ] next-themes 설정
- [ ] 테마 전환 버튼
- [ ] shadcn/ui 다크 모드 변수

#### 2. 반응형 디자인
- [ ] 모바일 레이아웃 (< 768px)
- [ ] 태블릿 레이아웃 (768-1024px)
- [ ] 데스크톱 레이아웃 (> 1024px)

#### 3. 로딩 상태
- [ ] 페르소나 목록 스켈레톤
- [ ] 대화 로딩 애니메이션
- [ ] 버튼 로딩 상태

#### 4. 에러 처리
- [ ] Toast 알림 (sonner)
- [ ] Error Boundary
- [ ] 네트워크 에러 재시도

#### 5. 최적화
- [ ] 이미지 최적화 (next/image)
- [ ] 코드 스플리팅
- [ ] 번들 크기 분석

### 📦 산출물
- 완성도 높은 UI/UX
- 에러 처리
- 성능 최적화

---

## Phase 6: 고급 기능 (Future)

### 🎯 목표
차별화 기능 추가

### 💡 아이디어
- [ ] 페르소나 공유 기능
- [ ] 대화 내보내기 (PDF, Text)
- [ ] 통계 대시보드
- [ ] 페르소나 추천 시스템
- [ ] 음성 대화 (Whisper)
- [ ] 감정 분석
- [ ] 다국어 지원

---

## 🎯 개발 가이드라인

### 코딩 컨벤션
```typescript
// 파일명: kebab-case
chat-interface.tsx

// 컴포넌트: PascalCase
export function ChatInterface() {}

// 함수: camelCase
function buildSystemPrompt() {}

// 상수: UPPER_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 1000
```

### 커밋 메시지
```bash
# Feature
feat: 페르소나 생성 기능 구현

# Fix
fix: 벡터 검색 임계값 버그 수정

# Docs
docs: README 업데이트

# Style
style: 코드 포맷팅

# Refactor
refactor: 프롬프트 빌더 로직 개선
```

### 테스트 전략
- 각 Phase 완료 시 기능 테스트
- Edge Case 확인
- 성능 측정 (Lighthouse)

---

**참조 문서**:
- 📄 `data/psychology-profiles.json` - 심리 프로필 데이터
- 📄 `data/relationship-guides.json` - 관계별 가이드
- 📄 `database/schema.sql` - DB 스키마