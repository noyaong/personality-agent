# TODO

프로젝트 전체 할 일 목록

> 마지막 업데이트: 2025-11-13

---

## 🔥 남은 작업 (우선순위별)

### 1️⃣ 즉시 가능 - UI 개선
- [x] **로그인 페이지 라이트 모드 적용** ✅ 완료! (2025-11-13)
  - Color Bends 배경
  - Glass 효과 카드
  - 그라데이션 버튼
- [x] **회원가입 페이지 라이트 모드 적용** ✅ 완료! (2025-11-13)

### 2️⃣ 중간 우선순위 - 기능 추가
- [x] **채팅 히스토리 페이지 구현 (/history)** ✅ 완료! (2025-11-13)
  - 과거 대화 세션 목록 조회
  - 세션별 대화 내용 보기
  - 세션 삭제 기능
  - 상태 필터 (전체/진행 중/종료/보관)
  - 검색 기능 (페르소나 이름, 메시지 내용)

### 3️⃣ 낮은 우선순위 - 성능 최적화
- [x] **벡터 검색 구현** ✅ 완료! (2025-11-13)
  - OpenAI 임베딩 활용
  - 유사 대화 패턴 검색
  - pgvector 코사인 유사도
  - 채팅 API에 통합

### 4️⃣ 선택사항
- [ ] TypeScript 타입 자동 생성
- [ ] 모니터링 설정
- [ ] 배포 준비

---

## 📋 Phase 1: 기초 인프라 (Day 1) ✅ 완료!

### 데이터베이스
- [x] Schema 설계 및 재작성
- [x] persona-sharing-architecture 반영
- [x] 문법 오류 수정
- [x] schema.sql 실행
- [x] 테이블 생성 검증
- [x] RLS 정책 확인
- [x] pgvector extension 확인
- [x] 샘플 데이터 확인 (3개)

### MCP 설정
- [x] .mcp.json 생성
- [x] .mcp.json.example 생성
- [x] .gitignore 설정
- [x] MCP 연결 테스트
- [x] SQL 실행 테스트

### 환경 설정
- [x] .env.local 파일 생성
- [x] Supabase API 키 설정
- [x] OpenAI API 키 설정
- [x] DATABASE_URL 설정 (Prisma)

### 문서화
- [x] PROJECT_STATUS.md
- [x] CHANGELOG.md
- [x] TODO.md (이 파일)
- [x] mcp-setup 가이드
- [x] validate_schema.md

---

## 📱 Phase 2: Next.js 앱 구조 (Day 2-3) ✅ 완료!

### 프로젝트 초기화
- [x] Next.js 16 프로젝트 생성
- [x] 프로젝트 구조 정리 (project/ 폴더)
- [x] Prisma ORM 통합

### 패키지 설치
- [x] Supabase 클라이언트
- [x] shadcn/ui 설치 (10개 컴포넌트)
- [x] Vercel AI SDK (`ai @ai-sdk/openai`)

### Supabase 클라이언트 설정
- [x] `lib/supabase/client.ts` 생성
- [x] `lib/supabase/server.ts` 생성
- [x] `lib/supabase/middleware.ts` 생성
- [x] 타입 생성 완료

### 인증 플로우
- [x] 로그인 페이지
- [x] 회원가입 페이지
- [x] Auth 콜백 처리
- [x] proxy.ts 미들웨어 (라우트 보호)
- [x] AuthContext 구현

---

## 👤 Phase 3: 페르소나 시스템 (Day 3-4) ✅ 완료!

### 페르소나 CRUD
- [x] 페르소나 목록 페이지
- [x] 페르소나 생성 폼 (4단계 위저드)
- [x] MBTI 선택 컴포넌트
- [x] DiSC 선택 컴포넌트
- [x] 애니어그램 선택 컴포넌트
- [x] 공개 설정 (private/unlisted/public)
- [x] 페르소나 카드 컴포넌트
- [x] 페르소나 상세 페이지
- [x] 페르소나 수정 기능
- [x] 페르소나 삭제 기능
- [x] 검색 기능
- [x] 복제 기능

### API Routes
- [x] `app/api/personas/route.ts` - GET, POST
- [x] `app/api/personas/[id]/route.ts` - GET, PUT, DELETE

### 데이터
- [x] `data/psychology-profiles.json` 활용
- [x] MBTI 16개 유형
- [x] DiSC 16개 표준 유형
- [x] 애니어그램 9개 + Wing

---

## 💬 Phase 4: 대화 엔진 (Day 5-6) ✅ 완료!

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
- [x] OpenAI 임베딩 생성 ✅
- [x] `search_similar_patterns` 함수 호출 ✅
- [x] 유사도 기반 패턴 매칭 ✅
- [x] 채팅 API에 통합 ✅
- [ ] 계층적 폴백 (MBTI → DiSC → 애니어그램) (선택)

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

## 🎨 Phase 5: UI/UX 개선 (Day 7) ✅ 95% 완료!

- [x] 라이트 모드 디자인 시스템 전환
- [x] Color Bends 배경 효과
- [x] Glass 효과 헤더
- [x] 파스텔 그라데이션 카드
- [x] 스켈레톤 로딩 UI
- [x] 전체 페이지 디자인 통일 (10개 페이지)
- [x] **로그인/회원가입 페이지 라이트 모드** ✅ 완료!
- [ ] 반응형 디자인 (모바일/태블릿)
- [ ] 에러 처리 및 토스트 알림
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

### Phase 1 완료 조건 ✅ 100%
- [x] schema.sql 작성
- [x] MCP 설정
- [x] schema.sql 실행 완료
- [x] 5개 테이블 생성 확인
- [x] RLS 정책 활성화 확인
- [x] 샘플 데이터 3개 확인

### Phase 2 완료 조건 ✅ 100%
- [x] Next.js 16 앱 실행 가능
- [x] Supabase 클라이언트 연결
- [x] 로그인 작동
- [x] AuthContext 구현

### Phase 3 완료 조건 ✅ 100%
- [x] 페르소나 생성 가능
- [x] MBTI + DiSC + 애니어그램 선택
- [x] 공개/비공개 설정 작동
- [x] 페르소나 목록 조회
- [x] 검색/복제 기능

### Phase 4 완료 조건 ✅ 100%
- [x] 페르소나와 실시간 대화 가능
- [x] 스트리밍 응답 작동
- [x] 페르소나 기반 프롬프트 적용
- [x] 벡터 검색 ✅

### Phase 5 완료 조건 ✅ 100%
- [x] 라이트 모드 디자인 시스템
- [x] 전체 페이지 디자인 통일 (10개 페이지)
- [x] 로그인/회원가입 페이지 라이트 모드 ✅
- [x] 채팅 히스토리 페이지 ✅

### Phase 6 완료 조건 ✅ 100%
- [x] Vector Search 구현 ✅
- [x] OpenAI 임베딩 생성 ✅
- [x] pgvector 검색 함수 ✅
- [x] 채팅 API 통합 ✅
- [x] 문서화 완료 ✅

---

**최종 업데이트**: 2025-11-13
**현재 진행률**: 100% (Phase 6 완료!)
**완료된 작업**:
1. ✅ 로그인/회원가입 페이지 라이트 모드
2. ✅ 채팅 히스토리 페이지 구현
3. ✅ 벡터 검색 구현

**다음 단계**:
- SQL 마이그레이션 실행 필요 (prisma/migrations/vector_search_functions.sql)
- 기존 페르소나에 대한 임베딩 생성 (POST /api/embeddings)
