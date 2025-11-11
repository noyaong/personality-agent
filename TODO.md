# TODO

프로젝트 전체 할 일 목록

> 마지막 업데이트: 2025-11-07

---

## 🔥 긴급 (지금 당장)

- [ ] **Claude Desktop 재시작**
  - MCP 설정 적용을 위해 필수
  - 재시작 후 MCP 연결 테스트

- [ ] **Supabase MCP 연결 확인**
  ```
  "Supabase MCP가 연결되어 있나요?"
  ```

- [ ] **schema.sql 실행**
  - Supabase에서 SQL 실행
  - 5개 테이블 생성
  - RLS 정책 활성화

- [ ] **테이블 생성 검증**
  - profiles
  - persona_profiles
  - conversation_patterns
  - chat_sessions
  - chat_messages

---

## 📋 Phase 1: 기초 인프라 (Day 1)

### 데이터베이스
- [x] Schema 설계 및 재작성
- [x] persona-sharing-architecture 반영
- [x] 문법 오류 수정
- [ ] **schema.sql 실행** ← 현재 여기
- [ ] 테이블 생성 검증
- [ ] RLS 정책 확인
- [ ] pgvector extension 확인
- [ ] 샘플 데이터 확인 (3개)

### MCP 설정
- [x] .mcp.json 생성
- [x] .mcp.json.example 생성
- [x] .gitignore 설정
- [ ] MCP 연결 테스트
- [ ] SQL 실행 테스트

### 환경 설정
- [ ] .env.local 파일 생성
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  OPENAI_API_KEY=
  ```
- [ ] Supabase API 키 확보
- [ ] OpenAI API 키 확보

### 문서화
- [x] PROJECT_STATUS.md
- [x] CHANGELOG.md
- [x] TODO.md (이 파일)
- [x] mcp-setup 가이드
- [x] validate_schema.md

---

## 📱 Phase 2: Next.js 앱 구조 (Day 2-3)

### 프로젝트 초기화
- [ ] Next.js 16 프로젝트 생성
  ```bash
  npx create-next-app@latest personality-agent \
    --typescript \
    --tailwind \
    --app \
    --import-alias "@/*"
  ```
- [ ] 프로젝트 구조 정리
  ```
  src/
  ├── app/
  ├── components/
  ├── lib/
  └── types/
  ```

### 패키지 설치
- [ ] Supabase 클라이언트
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] shadcn/ui 설치
  ```bash
  npx shadcn@latest init
  ```
- [ ] 필요한 컴포넌트 추가
  ```bash
  npx shadcn@latest add button
  npx shadcn@latest add form
  npx shadcn@latest add input
  npx shadcn@latest add select
  npx shadcn@latest add card
  npx shadcn@latest add dialog
  ```
- [ ] Vercel AI SDK
  ```bash
  npm install ai @ai-sdk/openai
  ```

### Supabase 클라이언트 설정
- [ ] `lib/supabase/client.ts` 생성
- [ ] `lib/supabase/server.ts` 생성
- [ ] `lib/supabase/middleware.ts` 생성
- [ ] 타입 생성 스크립트
  ```bash
  npx supabase gen types typescript \
    --project-id tscptdhwdpedngkpmwlm > types/database.types.ts
  ```

### 인증 플로우
- [ ] 로그인 페이지 (`app/login/page.tsx`)
- [ ] 소셜 로그인 버튼 (Google, GitHub)
- [ ] Auth 콜백 처리 (`app/auth/callback/route.ts`)
- [ ] 미들웨어 설정 (`middleware.ts`)
- [ ] 프로필 자동 생성 로직

---

## 👤 Phase 3: 페르소나 시스템 (Day 3-4)

### 페르소나 CRUD
- [ ] 페르소나 목록 페이지 (`app/personas/page.tsx`)
- [ ] 페르소나 생성 폼 (`components/PersonaForm.tsx`)
- [ ] MBTI 선택 컴포넌트
- [ ] DiSC 선택 컴포넌트
- [ ] 애니어그램 선택 컴포넌트
- [ ] 공개 설정 라디오 버튼
- [ ] 페르소나 카드 컴포넌트 (`components/PersonaCard.tsx`)
- [ ] 페르소나 상세 페이지 (`app/personas/[id]/page.tsx`)
- [ ] 페르소나 수정 기능
- [ ] 페르소나 삭제 기능

### API Routes
- [ ] `app/api/personas/route.ts` - 목록 조회, 생성
- [ ] `app/api/personas/[id]/route.ts` - 상세, 수정, 삭제
- [ ] OpenAI 임베딩 생성 로직
- [ ] 특성 조합 로직 (MBTI + DiSC + 애니어그램)

### 데이터
- [ ] `data/psychology-profiles.json` 활용
- [ ] MBTI 16개 유형 데이터
- [ ] DiSC 스타일 데이터
- [ ] 애니어그램 유형 데이터

---

## 💬 Phase 3: 대화 엔진 (Day 4-6)

### 대화 UI
- [x] 대화 페이지 (`app/chat/page.tsx`)
- [ ] 페르소나 선택 모달
- [ ] 관계 선택 (상급자/동료/하급자)
- [x] 메시지 입력 폼
- [x] 메시지 리스트 컴포넌트
- [x] 스트리밍 응답 표시
- [x] 스크롤 동작 최적화 (스트리밍 중/완료 후)
- [x] 한글 입력(IME) 처리
- [x] 입력 포커스 자동화

### 대화 API
- [x] `app/api/chat/route.ts` - 스트리밍 응답
- [x] Vercel AI SDK `useChat` 훅 활용
- [x] OpenAI GPT-4o 통합
- [x] 시스템 프롬프트 생성 로직
  - [x] 페르소나 특성 (MBTI + DiSC + 애니어그램)
  - [x] 관계별 가이드 (`data/relationship-guides.json`)
  - [ ] 유사 패턴 검색 결과

### 벡터 검색
- [ ] OpenAI 임베딩 생성
- [ ] `search_similar_patterns` 함수 호출
- [ ] 유사도 기반 패턴 매칭
- [ ] 계층적 폴백 (MBTI → DiSC → 애니어그램)

### 세션 관리
- [x] 대화 세션 생성
- [x] 메시지 저장 (user + assistant)
- [x] React 클로저 문제 해결 (useRef)
- [x] 대화 히스토리 로딩
- [ ] 사용 통계 업데이트

### 문서화
- [x] 채팅 구현 가이드 작성
  - [x] React 클로저 문제 해결 패턴
  - [x] IME 처리 베스트 프랙티스
  - [x] 메시지 저장 아키텍처
  - [x] 스크롤 동작 최적화
  - [x] 트러블슈팅 가이드
- [x] CHANGELOG 업데이트

---

## 🎨 UI/UX 개선

- [ ] 다크 모드 지원
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 로딩 상태 표시
- [ ] 에러 처리 및 토스트 알림
- [ ] 애니메이션 (Framer Motion)
- [ ] 접근성 (a11y) 개선

---

## 🧪 테스트

- [ ] 단위 테스트 (Jest + React Testing Library)
- [ ] E2E 테스트 (Playwright)
- [ ] API 테스트
- [ ] RLS 정책 테스트
- [ ] 벡터 검색 성능 테스트

---

## 📊 모니터링 및 분석

- [ ] Vercel Analytics 설정
- [ ] Sentry 에러 추적
- [ ] Supabase Realtime 구독
- [ ] 사용 통계 대시보드

---

## 🚀 배포

- [ ] Vercel 프로젝트 연결
- [ ] 환경 변수 설정 (Vercel)
- [ ] 도메인 설정
- [ ] SSL 인증서
- [ ] CI/CD 파이프라인

---

## 🔮 향후 기능 (Nice to Have)

### 고급 기능
- [ ] 음성 대화 (Whisper API)
- [ ] 감정 분석
- [ ] 대화 분석 리포트
- [ ] 페르소나 추천 시스템
- [ ] 대화 패턴 학습 (사용자 피드백)

### 소셜 기능
- [ ] 공개 페르소나 마켓플레이스
- [ ] 페르소나 좋아요/북마크
- [ ] 페르소나 평점 시스템
- [ ] 커뮤니티 페이지

### 관리자 기능
- [ ] 관리자 대시보드
- [ ] 공식 페르소나 관리
- [ ] 사용자 관리
- [ ] 통계 및 분석

---

## 📝 체크리스트 템플릿

새로운 기능 추가 시 체크:

- [ ] 기능 설계 및 문서화
- [ ] DB 스키마 변경 (필요 시)
- [ ] API 구현
- [ ] UI 구현
- [ ] 테스트 작성
- [ ] 문서 업데이트
- [ ] CHANGELOG 업데이트
- [ ] Git 커밋 및 푸시

---

## 🏁 마일스톤 달성 기준

### Phase 1 완료 조건
- [x] schema.sql 작성
- [x] MCP 설정
- [ ] schema.sql 실행 완료
- [ ] 5개 테이블 생성 확인
- [ ] RLS 정책 활성화 확인
- [ ] 샘플 데이터 3개 확인

### Phase 2 완료 조건
- [ ] Next.js 16 앱 실행 가능
- [ ] Supabase 클라이언트 연결
- [ ] 소셜 로그인 작동
- [ ] 프로필 자동 생성

### Phase 3 완료 조건
- [ ] 페르소나 생성 가능
- [ ] MBTI + DiSC + 애니어그램 선택
- [ ] 공개/비공개 설정 작동
- [ ] 페르소나 목록 조회

### Phase 4 완료 조건
- [ ] 페르소나와 실시간 대화 가능
- [ ] 스트리밍 응답 작동
- [ ] 벡터 검색 작동
- [ ] 관계별 프롬프트 적용

---

**최종 업데이트**: 2025-11-07
**다음 작업**: Claude Desktop 재시작 → MCP 연결 → schema.sql 실행
