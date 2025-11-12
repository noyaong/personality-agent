# Changelog

프로젝트의 모든 주요 변경 사항을 기록합니다.

형식: [날짜] - 카테고리: 변경 내용

---

## [2025-11-12] - UI/UX: 페르소나 관리 페이지 라이트 모드 적용

### 🎭 페르소나 관리 시스템 디자인 통일

**전체 페르소나 페이지에 라이트 모드 디자인 시스템 적용 완료**

#### 페르소나 목록 페이지 ([personas/page.tsx](project/app/(protected)/personas/page.tsx))
- **Color Bends 배경** 적용
- **Glass 효과 헤더** (투명 + 블러)
- **검색 바** 디자인 유지
- **탭 네비게이션** (내 페르소나 / 공개 / 공식)

**페르소나 카드 디자인**
- 배경: `bg-white/90 shadow-sm hover:shadow-lg`
- 제목: `gradient-text` 적용
- 공식 배지: `gradient-bg text-white shadow-md`
- 성격 유형 배지: 각기 다른 파스텔 컬러
  - MBTI: `bg-purple-50 text-purple-700 border-purple-200`
  - DiSC: `bg-cyan-50 text-cyan-700 border-cyan-200`
  - 애니어그램: `bg-pink-50 text-pink-700 border-pink-200`
- 공개 설정 배지: 이모지 추가 (🔒 🔗 🌍)
- 대화 시작 버튼: 호버 시 그라데이션 배경

**빈 상태 카드**
- 배경: `bg-white/90 shadow-sm`
- 버튼: `gradient-bg text-white shadow-md hover:shadow-lg`

#### 페르소나 생성 페이지 ([personas/new/page.tsx](project/app/(protected)/personas/new/page.tsx))
- **Color Bends 배경** 적용
- **Glass 효과 헤더**
- **메인 카드**: `shadow-lg bg-white/90`

**단계별 선택 UI**
- MBTI/DiSC/애니어그램 버튼에 `transition-all` 추가
- 선택된 프로필 정보 카드:
  - MBTI: `from-purple-50/50 to-purple-100/30 border-purple-200`
  - DiSC: `from-cyan-50/50 to-cyan-100/30 border-cyan-200`
  - 애니어그램: `from-pink-50/50 to-pink-100/30 border-pink-200`
- 각 프로필 제목에 `gradient-text` 적용

**요약 카드 리디자인**
- 배경: `from-white/90 to-accent/10 shadow-lg`
- 제목: `gradient-text`
- 각 항목별 그라데이션 배경:
  - 이름/MBTI: `from-purple-50/30 to-purple-100/20`
  - DiSC: `from-cyan-50/30 to-cyan-100/20`
  - 애니어그램: `from-pink-50/30 to-pink-100/20`
  - 공개 설정: `from-indigo-50/30 to-indigo-100/20`
- 배지에 이모지 추가 (🔒 🔗 🌍)

#### 페르소나 상세 페이지 ([personas/[id]/page.tsx](project/app/(protected)/personas/[id]/page.tsx))
- **Color Bends 배경** 적용
- **Glass 효과 헤더**
- **메인 카드**: `shadow-lg bg-white/90 border-2`
- 제목: `gradient-text`
- 공식 배지: `gradient-bg text-white shadow-md`
- 공개 설정 배지: `bg-white shadow-sm`

**심리 프로필 섹션**
- MBTI 배지: `bg-purple-50 text-purple-700 border-purple-200 shadow-sm`
- DiSC 배지: `bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm`
- 애니어그램 배지: `bg-pink-50 text-pink-700 border-pink-200 shadow-sm`

**대화 시작 버튼**
- 스타일: `gradient-bg text-white shadow-md hover:shadow-lg`
- 크기: `text-lg py-6`

**설명 카드**
- 배경: `shadow-lg bg-white/90 border-2`

**오류 화면**
- Color Bends 배경
- 카드: `border-destructive/20 bg-white/90 shadow-lg`
- 버튼: `gradient-bg text-white shadow-md hover:shadow-lg`

#### 페르소나 수정 페이지 ([personas/[id]/edit/page.tsx](project/app/(protected)/personas/[id]/edit/page.tsx))
- **페르소나 생성 페이지와 동일한 디자인** 적용
- Color Bends 배경
- Glass 효과 헤더
- 모든 프로필 선택 카드에 그라데이션 적용
- 요약 카드 리디자인
- 수정 완료 버튼: `gradient-bg text-white shadow-md hover:shadow-lg`

### 🎨 디자인 일관성

**전체 페르소나 관리 시스템 통일**
1. **배경**: Color Bends 애니메이션 (보라 ↔ 청록)
2. **헤더**: Glass 효과 + 그림자
3. **카드**: 흰 배경 + 그림자 + 호버 효과
4. **배지**: 파스텔 컬러 시스템
   - 💜 보라 (MBTI)
   - 🩵 청록 (DiSC)
   - 🩷 핑크 (애니어그램)
5. **버튼**: 그라데이션 배경 + 그림자
6. **이모지**: 공개 설정에 아이콘 추가

### 📊 변경 통계
- 수정된 파일: 4개
  - [personas/page.tsx](project/app/(protected)/personas/page.tsx)
  - [personas/new/page.tsx](project/app/(protected)/personas/new/page.tsx)
  - [personas/[id]/page.tsx](project/app/(protected)/personas/[id]/page.tsx)
  - [personas/[id]/edit/page.tsx](project/app/(protected)/personas/[id]/edit/page.tsx)
- 새로운 디자인 패턴: 그라데이션 배지, 요약 카드
- 추가된 애니메이션: 호버 효과, transition-all

### 🔄 Before & After
**Before**: 기본 다크 모드 느낌, 단조로운 배경
**After**: 라이트 모드, Color Bends 배경, 파스텔 그라데이션

---

## [2025-11-12] - UI/UX: 라이트 모드 디자인 시스템 전환

### 🎨 디자인 시스템 전면 개편
**컨셉**: 심리검사 서비스 정체성에 맞는 밝고 아기자기한 모던 디자인

#### 색상 팔레트 변경 ([globals.css](project/app/globals.css))
- **다크 모드 → 라이트 모드 전환**
  - 배경: `hsl(210, 40%, 98%)` - 부드러운 라이트 톤
  - Primary: `hsl(280, 80%, 62%)` - 활기찬 보라-핑크
  - Accent: `hsl(173, 80%, 60%)` - 밝은 민트-청록
  - Secondary: `hsl(270, 60%, 95%)` - 부드러운 라벤더
  - Destructive: `hsl(0, 80%, 63%)` - 산호색

#### Color Bends 배경 효과
- 라이트 모드 버전으로 재설계
- 보라와 청록색의 부드러운 그라데이션 블러
- 애니메이션으로 움직이는 배경 요소 (20초, 18초 주기)
- 투명도 0.35로 은은한 느낌

#### 유틸리티 클래스 업데이트
- `.gradient-bg`: 보라→청록 그라데이션
- `.gradient-text`: 텍스트 그라데이션
- `.glass`: 투명 화이트 배경 + 12px 블러
- `.card-hover`: 부드러운 호버 효과
- `.persona-btn`: 라이트 모드 페르소나 버튼

### 🏠 대시보드 리뉴얼 ([dashboard/page.tsx](project/app/(protected)/dashboard/page.tsx))

#### 레이아웃
- Color Bends 배경 전역 적용
- Glass 효과 헤더 (투명 + 블러)
- z-index 계층 구조로 배경/콘텐츠 분리

#### 메인 기능 카드
1. **내 페르소나**
   - 아이콘 배경: `from-purple-100 to-purple-200`
   - 호버 시 아이콘 스케일 확대 (110%)

2. **대화 시작** (강조)
   - 배경: `from-white/90 to-accent/10`
   - 아이콘: `from-cyan-100 to-teal-200`
   - "인기" 배지: 그라데이션 배경

3. **대화 기록**
   - 아이콘 배경: `from-pink-100 to-rose-200`

#### 정보 섹션
**계정 정보**
- 각 항목별 그라데이션 배경
  - 이메일: `purple-50 → purple-100`
  - 가입일: `cyan-50 → cyan-100`
  - 사용자 ID: `pink-50 → pink-100`

**시작하기 가이드**
- 그라데이션 배지 (1, 2, 3)
- 호버 시 파스텔 그라데이션 배경

### 💬 채팅 페이지 대폭 개선 ([chat/page.tsx](project/app/(protected)/chat/page.tsx))

#### 메시지 로딩 스켈레톤 UI
- **3가지 스켈레톤 패턴**
  1. AI 메시지 (아바타 포함, 3줄)
  2. 사용자 메시지 (3줄)
  3. AI 메시지 (아바타 포함, 4줄)

- **특징**
  - `animate-pulse` 효과
  - 실제 메시지와 동일한 레이아웃
  - 투명도로 자연스러운 표현

#### 자동 스크롤 개선
```typescript
// 메시지 로드 완료 후 자동 스크롤
if (messages && messages.length > 0) {
  chat.setMessages(uiMessages);
  setTimeout(() => {
    scrollToBottom(false); // 즉시 하단으로
  }, 100);
}
```
- 기존 대화 로드 시 자동 최신 메시지로 이동
- 긴 대화 내역도 부드럽게 처리

#### 페르소나 헤더 디자인
- 아바타: 그라데이션 배경 + 흰색 텍스트
- 페르소나 이름: 그라데이션 텍스트
- 성격 유형 배지: 각기 다른 파스텔 컬러
  - MBTI: `purple-50/200/700`
  - DiSC: `cyan-50/200/700`
  - 애니어그램: `pink-50/200/700`

#### 메시지 버블 리디자인
**사용자 메시지**
- 그라데이션 배경 (보라→청록)
- 흰색 텍스트
- `rounded-2xl` + `shadow-sm`

**AI 메시지**
- 흰 배경 + 보더
- 그라데이션 아바타

**스트리밍 로딩**
- 3개 점 애니메이션
- Primary/Accent 색상 교차
- 각기 다른 딜레이 (0s, 0.1s, 0.2s)

#### 입력 영역
- 그라데이션 배경: `from-purple-50/30 to-cyan-50/30`
- 전송 버튼: 그라데이션 + 호버 시 그림자 확대

### 📱 로딩 화면 통일 ([page.tsx](project/app/page.tsx))
- Color Bends 배경
- Primary 색상 스피너
- z-index로 콘텐츠 레이어링

### 🎯 디자인 철학

#### 심리검사 서비스 정체성
1. **밝고 친근한**: 라이트 모드로 접근성 향상
2. **아기자기한**: 파스텔 + 그라데이션
3. **모던한**: 둥근 모서리, 그림자, 애니메이션
4. **전문적**: 일관된 시스템

#### 컬러 스토리
- 💜 **보라**: 창의성, 심리, 성찰
- 🩵 **청록**: 차분함, 신뢰, 소통
- 🩷 **핑크**: 감성, 따뜻함, 친근함

### 📊 변경 통계
- 수정된 파일: 4개
- 새로운 CSS 클래스: 8개
- 컬러 토큰 변경: 10개
- 추가된 애니메이션: 스켈레톤 UI

### 🔄 Before & After
**Before**: 다크 모드, 무거운 느낌, 강한 대비
**After**: 라이트 모드, 경쾌한 느낌, 부드러운 그라데이션

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
