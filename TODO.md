# TODO

프로젝트 할 일 목록

> 마지막 업데이트: 2025-11-14

---

## 🎯 현재 상태

### ✅ 완료된 Phase
- **Phase 1-6**: 기초 인프라, Next.js 앱, 페르소나 시스템, 대화 엔진, UI/UX, 벡터 검색
- **Phase 7**: 골든 데이터셋 (123개 패턴), 벡터 검색 최적화

### 🚀 현재 진행
- **Phase 8**: 패턴 품질 향상 및 모니터링

---

## 📋 남은 작업 (우선순위별)

### 1️⃣ 즉시 가능 - 품질 테스트

- [ ] **실제 대화 품질 테스트**
  - 다양한 페르소나로 대화 테스트 (INTJ, ESFP, ISFJ 등)
  - 관계별 어조 적절성 검증 (상급자/동료/하급자)
  - 페르소나 일관성 확인
  - 벡터 검색 품질 평가

- [ ] **패턴 활용도 분석**
  - 실제 사용된 패턴 추적
  - 사용 빈도 높은 패턴 vs 낮은 패턴
  - threshold/limit 파라미터 재조정

### 2️⃣ 중간 우선순위 - 모니터링

- [ ] **패턴 사용 로깅 시스템**
  ```sql
  CREATE TABLE pattern_usage_logs (
    id UUID PRIMARY KEY,
    chat_session_id UUID,
    pattern_id UUID,
    similarity_score FLOAT,
    used_in_prompt BOOLEAN,
    user_message TEXT,
    created_at TIMESTAMPTZ
  );
  ```

- [ ] **품질 검증 자동화**
  - `scripts/validate-pattern-quality.ts` - 필수 필드 검증
  - `scripts/check-embedding-quality.ts` - 자기 유사도 체크
  - `scripts/verify-coverage.ts` - MBTI/관계 커버리지 확인

### 3️⃣ 낮은 우선순위 - 기능 추가

- [ ] **패턴 증강**
  - 사용 빈도 높은 조합 패턴 추가 (5-10개로 확대)
  - 특수 상황 패턴 (crisis, celebration, daily)
  - 저품질 패턴 개선 (사용률 하위 10%)

- [ ] **검색 알고리즘 최적화**
  - 관계별 threshold 차별화 (subordinate: 0.35, peer: 0.30, superior: 0.25)
  - Re-ranking 로직 (유사도 × 0.7 + effectiveness × 0.2 + 빈도 × 0.1)
  - 계층적 폴백 시스템 (선택사항)

### 4️⃣ 선택사항 - 개발 환경

- [ ] TypeScript 타입 자동 생성 (`prisma generate`)
- [ ] 모니터링 설정 (Vercel Analytics, Sentry)
- [ ] 배포 최적화

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
- [ ] 사용 통계 대시보드
- [ ] 패턴 효과성 추적

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

### 소셜 기능
- [ ] 공개 페르소나 마켓플레이스
- [ ] 페르소나 좋아요/북마크
- [ ] 페르소나 평점 시스템
- [ ] 커뮤니티 페이지

---

## 📈 Phase 8: 패턴 품질 향상 (진행 중)

### 목표
1. 🔥 실제 대화 품질 테스트 (30회 이상)
2. 🔥 패턴 사용 모니터링 시스템 구축
3. 🔥 패턴 품질 체크 자동화
4. 🔥 저품질 패턴 개선 및 증강

### 성공 지표
- [ ] 모든 패턴 자기 유사도 > 90%
- [ ] 평균 effectiveness_score > 0.85
- [ ] 패턴 사용률 > 70% (1주일 기준)
- [ ] MBTI × 관계 조합 48개 전체 커버

### 예상 소요 시간
3-5일

---

## 📝 완료 이력

### 2025-11-13 (Phase 7 완료)
- ✅ 골든 패턴 123개 생성
- ✅ 벡터 검색 버그 수정 (JSON → vector 변환)
- ✅ threshold 최적화 (0.7 → 0.3)
- ✅ 애니어그램 필터링 추가
- ✅ MBTI 16개 전체 커버리지 달성

### 2025-11-11
- ✅ 로그인/회원가입 페이지 라이트 모드
- ✅ 채팅 히스토리 페이지 구현
- ✅ Production 배포 완료

### 2025-11-10
- ✅ 벡터 검색 인프라 구현
- ✅ OpenAI 임베딩 통합
- ✅ RLS 정책 설정

---

**다음 단계**: Phase 8 시작 - 실제 대화 품질 테스트 및 패턴 모니터링 시스템 구축

**최종 업데이트**: 2025-11-14
**현재 진행률**: Phase 7 완료, Phase 8 준비 중
