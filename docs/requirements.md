# 기능 요구사항

## 🎯 핵심 기능

### 1. 인증 시스템

#### 요구사항
- ✅ 소셜 로그인 (Google, GitHub, Discord)
- ✅ Supabase Auth 기반 세션 관리
- ✅ 자동 프로필 생성 (profiles 테이블)
- ✅ 보호된 라우트 접근 제어 (middleware)

#### 제약사항
- ❌ 이메일/비밀번호 로그인 미지원 (Phase 1)
- ❌ 소셜 계정 연동 해제 미지원 (Phase 1)
- ❌ 다중 소셜 계정 연결 미지원

#### 인증 흐름
```
1. /login 페이지 접속
2. 소셜 로그인 버튼 클릭 (Google/GitHub/Discord)
3. OAuth Provider 리다이렉트
4. /auth/callback 처리
5. profiles 테이블 자동 생성 (첫 로그인 시)
6. 대시보드 이동
```

---

### 2. 페르소나 관리

#### 요구사항
- ✅ **페르소나 생성** (MBTI + DiSC + 애니어그램 모두 필수)
- ✅ 페르소나 목록 조회 (사용 횟수 순 정렬)
- ✅ 페르소나 상세 보기
- ✅ 페르소나 수정
- ✅ 페르소나 삭제
- ✅ 3가지 심리 프로필 조합 로직
- ✅ 프로필 텍스트 자동 생성
- ✅ 벡터 임베딩 자동 생성

#### 심리 프로필 시스템

**MBTI (16가지 - 필수)**
- 인지 기능: 어떻게 생각하고 판단하는가
- 예시: ISTJ, ENTP, INFP, ESFJ...
- 특성: 의사소통 방식, 의사결정 스타일, 정보 처리

**DiSC (4가지 조합 - 필수)**
- 행동 스타일: 어떻게 행동하는가
- D (주도형), I (사교형), S (안정형), C (신중형)
- 조합: DI, SC, CS, DC...

**애니어그램 (9가지 + 날개 - 필수)**
- 핵심 동기: 왜 그렇게 행동하는가
- 1-9번 유형 + 날개(w)
- 예시: 1w2, 5w6, 9w1...

#### 페르소나 생성 로직

```typescript
// 1. 사용자 입력
const input = {
  name: "김대리",
  mbti: "ISTJ",
  disc: "CS",
  enneagram: "1w2"
}

// 2. 특성 조합
const traits = combineTraits(input)
// {
//   core: ["책임감", "체계적", "신중함", "완벽주의"],
//   communication: "structured_and_careful",
//   decision: "logical_and_principled",
//   motivation: "perfection_and_helping"
// }

// 3. 프로필 텍스트 생성
const profileText = `
ISTJ 유형으로 체계적이고 책임감 있으며,
CS 스타일로 신중하고 분석적이며,
1w2 유형으로 원칙을 중시하면서 다른 사람을 돕고자 합니다.
`

// 4. 임베딩 생성
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: profileText
})

// 5. 저장
await supabase.from('persona_profiles').insert({
  user_id,
  persona_name: "김대리",
  mbti: "ISTJ",
  disc: "CS",
  enneagram: "1w2",
  traits,
  profile_embedding: embedding
})
```

#### UI/UX 요구사항
- 드롭다운으로 MBTI/DiSC/애니어그램 선택
- 선택 시 실시간 특성 미리보기
- 생성 완료 시 페르소나 카드로 표시
- 사용 횟수 표시 (usage_count)
- 마지막 사용 시간 표시 (last_used_at)

---

### 3. 대화 시스템

#### 요구사항
- ✅ 실시간 스트리밍 응답 (Vercel AI SDK useChat)
- ✅ 관계 선택 (상급자/동료/하급자)
- ✅ 관계에 따른 어조 자동 조정
- ✅ 메시지 히스토리 자동 저장
- ✅ 세션 통계 추적 (메시지 수, 토큰 사용량)
- ✅ 벡터 유사도 기반 패턴 검색

#### 대화 흐름

**Step 1: 세션 시작**
```typescript
// 1. 페르소나 선택
// 2. 관계 선택 (상급자/동료/하급자)
// 3. chat_sessions 테이블에 새 세션 생성

await supabase.from('chat_sessions').insert({
  user_id,
  persona_profile_id,
  relationship_type: 'superior'
})
```

**Step 2: 메시지 전송**
```typescript
// useChat 훅 사용
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
  body: {
    personaId,
    sessionId,
    relationship: 'superior'
  }
})
```

**Step 3: 서버 처리**
```typescript
// 1. 사용자 메시지 임베딩
const userEmbedding = await createEmbedding(message)

// 2. 유사 패턴 검색 (pgvector)
const patterns = await supabase.rpc('search_similar_patterns', {
  query_embedding: userEmbedding,
  target_mbti: persona.mbti,
  target_disc: persona.disc,
  target_enneagram: persona.enneagram,
  target_relationship: 'superior',
  match_threshold: 0.7,
  match_count: 5
})

// 3. 시스템 프롬프트 구성
const systemPrompt = buildPrompt(persona, relationship, patterns)

// 4. GPT-4o 스트리밍
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  stream: true,
  messages: [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
  ]
})

// 5. Vercel AI SDK 스트리밍
return new StreamingTextResponse(stream)
```

**Step 4: 메시지 저장**
```typescript
// 자동 저장 (useChat onFinish 콜백)
await supabase.from('chat_messages').insert([
  { session_id, role: 'user', content: userMessage },
  { session_id, role: 'assistant', content: aiResponse }
])
```

#### 관계별 대화 가이드

**상급자 (Superior)**
```
격식: 높음
호칭: 존댓말 필수 ("~습니다", "~요")
어조: 정중하고 존중하는
거리감: 적절한 거리 유지
예시: "보고드린 내용에 대해 검토 부탁드립니다."
```

**동료 (Peer)**
```
격식: 보통
호칭: 편안한 존댓말 또는 반말
어조: 친근하고 편안한
거리감: 가까움
예시: "이 부분 같이 논의해볼까요?"
```

**하급자 (Subordinate)**
```
격식: 낮음
호칭: 반말 가능
어조: 지도하고 이끄는
거리감: 멘토 관계
예시: "이 부분은 이렇게 접근해보는 게 어때?"
```

#### 프롬프트 구조

```
[시스템 프롬프트]

당신은 [페르소나명]입니다.

## 심리 프로필
- MBTI: [ISTJ] - 체계적, 책임감, 실용적
- DiSC: [CS] - 신중함, 정확성 추구
- 애니어그램: [1w2] - 완벽주의, 타인 돕기
- 핵심 특성: [책임감, 체계적, 신중함, 완벽주의]

## 대화 상대와의 관계
- 관계: 상급자 (당신은 부하직원과 대화 중)
- 격식: 높음
- 호칭: 존댓말 필수
- 어조: 정중하고 존중하는

## 대화 스타일
- 의사소통: 구조화되고 신중함 (ISTJ + CS)
- 의사결정: 논리적이고 원칙 중심 (ISTJ + 1w2)
- 스트레스 대응: 체계화와 계획 (ISTJ 특성)

## 참고할 대화 패턴
[벡터 검색으로 찾은 유사 패턴 3개]
1. "일정이 지연될 때 ISTJ+CS+1w2 상급자의 반응"
2. "부하 직원에게 피드백할 때의 표현"
3. "완벽주의 성향 반영한 검토 요청"

## 중요 지침
1. 위 심리 프로필에 일관되게 대화하세요
2. 애니어그램 핵심 동기(완벽 추구)를 반영하세요
3. 관계에 맞는 존중과 거리감을 유지하세요
4. 자연스럽고 인간적인 대화를 하세요
```

#### 성능 요구사항
- 스트리밍 첫 토큰: < 500ms
- 벡터 검색: < 100ms
- 메시지 저장: 비동기 처리 (응답 지연 없음)

---

### 4. 벡터 검색 시스템

#### 요구사항
- ✅ 대화 패턴 유사도 검색 (코사인 유사도)
- ✅ 심리 프로필 필터링 (MBTI + DiSC + 애니어그램)
- ✅ 관계 필터링 (상급자/동료/하급자)
- ✅ 유사도 임계값 설정 (기본 0.7)
- ✅ 결과 개수 제한 (기본 5개)

#### 검색 로직

```sql
-- database/schema.sql에 정의됨
SELECT * FROM search_similar_patterns(
  query_embedding := [1536차원 벡터],
  target_mbti := 'ISTJ',
  target_disc := 'CS',
  target_enneagram := '1w2',
  target_relationship := 'superior',
  match_threshold := 0.7,
  match_count := 5
)

-- 반환:
-- id, pattern_text, example_responses, similarity
```

#### 검색 최적화
- ivfflat 인덱스 사용
- lists = 100 (10,000 rows까지 최적)
- 벡터 차원: 1536 (OpenAI text-embedding-3-small)

---

## 🔒 비기능 요구사항

### 성능
- **페이지 로드**: LCP < 2.5s
- **스트리밍 첫 토큰**: < 500ms
- **벡터 검색**: < 100ms
- **API 응답**: < 1s (비스트리밍)

### 보안
- **RLS 정책**: 모든 테이블 적용
- **환경 변수**: Service Role Key는 서버 전용
- **CORS**: Vercel 도메인만 허용
- **SQL Injection**: Parameterized queries 사용

### 확장성
- **Edge Runtime**: Chat API
- **벡터 인덱스**: 10,000 rows 최적화
- **세션 관리**: 메시지 별도 테이블
- **Serverless**: 자동 스케일링

### 사용성
- **다크 모드**: 지원
- **반응형**: 모바일 최적화
- **로딩 상태**: 스켈레톤 UI
- **에러 처리**: Toast 알림

---

## 📊 데이터 요구사항

### 초기 시딩 데이터

**conversation_patterns 테이블**
- MBTI 16가지 × DiSC 4가지 × 애니어그램 9가지 × 관계 3가지
- 이론적 조합: 1,728개
- 실용적 접근: **핵심 조합 50-100개 선정**

**패턴 카테고리**
- greeting: 인사, 첫 대화
- feedback: 피드백, 평가
- conflict: 갈등, 문제 해결
- celebration: 축하, 긍정 표현
- stress_response: 스트레스 상황 대응
- decision_making: 의사결정 과정
- information_sharing: 정보 전달

**패턴 예시**
```json
{
  "mbti": "ISTJ",
  "disc": "CS",
  "enneagram": "1w2",
  "relationship_type": "superior",
  "pattern_category": "feedback",
  "pattern_text": "부하 직원의 실수에 대해 피드백",
  "example_responses": [
    "이 부분은 다음부터 이렇게 개선하면 좋겠습니다.",
    "정확성을 위해 한 번 더 검토하는 습관을 들이세요.",
    "체크리스트를 만들어 사용하면 실수를 줄일 수 있습니다."
  ]
}
```

---

## 🎯 우선순위

### Must Have (Phase 1-3)
- ✅ 소셜 로그인
- ✅ 페르소나 CRUD
- ✅ 실시간 대화
- ✅ 벡터 검색
- ✅ 관계별 어조 조정

### Should Have (Phase 4-5)
- ⚪ 다크 모드
- ⚪ 대화 히스토리 검색
- ⚪ 페르소나 통계 대시보드
- ⚪ 모바일 최적화

### Nice to Have (Phase 6+)
- ⚪ 페르소나 공유 기능
- ⚪ 대화 내보내기 (PDF)
- ⚪ 음성 대화
- ⚪ 다국어 지원

---

**다음**: `docs/development-phases.md`에서 Phase별 구현 계획 확인