# Changelog

프로젝트의 모든 주요 변경 사항을 기록합니다.

형식: [날짜] - 카테고리: 변경 내용

---

## [2025-11-11] - Phase 3: 채팅 기능 안정화

### 💬 채팅 시스템
- **채팅 메시지 저장 문제 해결**
  - React 클로저 문제로 인한 assistant 메시지 미저장 이슈 해결
  - `useRef`를 사용하여 `sessionId` 참조 안정화
  - `onFinish` 콜백에서 `sessionIdRef.current` 사용
  - 상세: [project/app/(protected)/chat/page.tsx:27, 196, 52](project/app/(protected)/chat/page.tsx#L27)

- **스크롤 동작 개선**
  - 스트리밍 중: 즉시 스크롤 (smooth: false)
  - 스트리밍 완료 후: 부드러운 스크롤 (smooth: true)
  - 단일 `useEffect`로 통합하여 자연스러운 동작 구현
  - 상세: [project/app/(protected)/chat/page.tsx:132-138](project/app/(protected)/chat/page.tsx#L132-L138)

- **한글 입력(IME) 처리 개선**
  - IME 조합 중 중복 전송 방지
  - `isComposing` 이벤트 체크 추가
  - 한글, 일본어, 중국어 입력 지원
  - 상세: [project/app/(protected)/chat/page.tsx:232-235](project/app/(protected)/chat/page.tsx#L232-L235)

- **입력 포커스 자동화**
  - 메시지 전송 후 자동 포커스
  - `useRef`로 Input 컴포넌트 참조
  - AI 응답 완료 후 100ms 지연 후 포커스
  - 상세: [project/app/(protected)/chat/page.tsx:115-117, 397](project/app/(protected)/chat/page.tsx#L115-L117)

- **메시지 히스토리 로딩 수정**
  - `chat.messages.splice()` → `chat.setMessages()` 변경
  - React 상태 관리 규칙 준수
  - 페이지 재진입 시 히스토리 올바르게 표시
  - 상세: [project/app/(protected)/chat/page.tsx:215](project/app/(protected)/chat/page.tsx#L215)

### 🐛 버그 수정
- **React 클로저 문제**
  - 문제: `useChat` 초기화 시 `sessionId`가 `null`로 클로저에 캡처됨
  - 해결: `useRef`로 가변 참조 사용하여 항상 최신 값 참조
  - 영향: assistant 메시지가 DB에 저장되지 않던 문제 완전 해결

### 📝 기술 문서
- **Chat Implementation Guide 작성 예정**
  - useChat hook 사용법
  - React 클로저 문제 해결 패턴
  - IME 처리 베스트 프랙티스
  - 메시지 저장 아키텍처

---

## [2025-11-07] - Phase 1: 기초 인프라 구축

### 🗄 데이터베이스
- **schema.sql 완전 재작성** (1591 lines → 548 lines, 65% 감소)
  - 중복 테이블 정의 4개 제거
  - CHECK 제약조건 문법 오류 수정
  - 페르소나 공유 아키텍처 반영
  - 백업: `database/schema.sql.backup`

- **persona_profiles 테이블 개선**
  - `user_id` → `creator_id` (NULL = 관리자)
  - `visibility` 컬럼 추가 (private/public/unlisted)
  - `is_official` 컬럼 추가 (관리자 검증 마크)
  - `persona_description` 추가
  - `creator_usage_count`, `public_usage_count` 추가

- **RLS 정책 업데이트**
  - "View own, public, or official personas" 정책 추가
  - "Admins can manage official personas" 정책 추가
  - 본인 + 공개 + 공식 페르소나 조회 지원

- **트리거 함수 개선**
  - `update_persona_usage()`: 생성자/타인 사용 구분
  - 사용 통계 자동 업데이트

- **뷰 개선**
  - `active_persona_stats`: 공유 정보 포함
  - 생성자 이름 조인

### 🔧 MCP 설정
- **프로젝트별 MCP 설정 파일 생성**
  - `.mcp.json` - Supabase MCP 설정 (Git ignored)
  - `.mcp.json.example` - 템플릿 파일
  - Package: `@supabase/mcp-server-supabase@latest`
  - Mode: Full Access
  - Project Ref: `tscptdhwdpedngkpmwlm`

- **.gitignore 생성**
  - `.mcp.json` 보호
  - `.env*.local` 보호
  - 민감한 토큰 정보 Git 커밋 방지

### 📚 문서화
- **설정 가이드**
  - `config/mcp-setup.md` - MCP 설정 가이드
  - `config/mcp-setup-checklist.md` - 단계별 체크리스트
  - `config/claude-code-mcp-setup.md` - Claude Code 전용 가이드

- **검증 문서**
  - `database/validate_schema.md` - 스키마 변경 사항 상세 기록

- **프로젝트 관리**
  - `PROJECT_STATUS.md` - 프로젝트 현재 상태 스냅샷
  - `CHANGELOG.md` - 변경 이력 (이 파일)
  - `TODO.md` - 할 일 목록

### 🎯 아키텍처
- **페르소나 공유 시스템 설계**
  - `docs/persona-sharing-architecture.md` 작성
  - 하이브리드 공유 모델 (개인/공개/공식)
  - 사용 시나리오 4가지 정의
  - RLS 정책 상세 설계

---

## [예정] - Phase 2: Next.js 앱 구조

### 계획
- Next.js 16 프로젝트 초기화
- shadcn/ui 설치 및 설정
- Supabase 클라이언트 설정
- 인증 플로우 구현

---

## [예정] - Phase 3: 페르소나 시스템

### 계획
- 페르소나 CRUD UI 구현
- MBTI + DiSC + 애니어그램 선택 폼
- 공개/비공개 설정 UI
- 페르소나 목록 및 상세 페이지

---

## [예정] - Phase 4: 대화 엔진

### 계획
- 실시간 스트리밍 대화 구현
- 벡터 검색 통합
- 관계별 프롬프트 적용
- 대화 히스토리 관리

---

## 버전 관리 규칙

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Type
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/설정 변경

### Scope
- `db`: 데이터베이스
- `mcp`: MCP 설정
- `auth`: 인증
- `persona`: 페르소나 시스템
- `chat`: 대화 엔진
- `ui`: UI/UX

### 예시
```bash
feat(db): Add persona sharing architecture

- persona_profiles 테이블에 visibility 컬럼 추가
- RLS 정책 업데이트 (공개 페르소나 지원)
- creator_usage_count, public_usage_count 추가

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 마일스톤

- [x] **2025-11-07**: Phase 1 시작 - 데이터베이스 스키마 설계
- [ ] **예정**: Phase 1 완료 - Schema 실행 및 검증
- [ ] **예정**: Phase 2 시작 - Next.js 앱 구조
- [ ] **예정**: Phase 2 완료 - 인증 플로우
- [ ] **예정**: Phase 3 완료 - 페르소나 CRUD
- [ ] **예정**: Phase 4 완료 - 대화 엔진
- [ ] **예정**: MVP 배포

---

**최종 업데이트**: 2025-11-07
**작업자**: Claude Code
