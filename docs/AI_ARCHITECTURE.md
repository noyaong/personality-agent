# AI 활용 아키텍처

## 🎯 개요

이 프로젝트는 **페르소나 기반 AI 대화 시스템**으로, 심리 프로필(MBTI + DiSC + 애니어그램)과 관계(상급자/동료/하급자)를 반영한 자연스러운 대화를 제공합니다.

---

## 🏗 AI 시스템 아키텍처

```
사용자 메시지
    ↓
┌────────────────────────────────────────┐
│  1. 임베딩 생성 (OpenAI)                │
│  text-embedding-3-small (1536d)        │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  2. 벡터 검색 (pgvector)                │
│  - 유사 대화 패턴 검색                   │
│  - MBTI + 관계 필터링                   │
│  - 코사인 유사도 > 0.3                  │
│  - 상위 3개 패턴 선택                   │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  3. 시스템 프롬프트 구성                 │
│  - 페르소나 특성 (MBTI+DiSC+에니어그램)  │
│  - 관계별 가이드 (존댓말/반말)          │
│  - 유사 패턴 컨텍스트                   │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│  4. 대화 생성 (GPT-4o)                  │
│  - 스트리밍 응답                        │
│  - 페르소나 일관성 유지                 │
└────────────┬───────────────────────────┘
             ↓
         AI 응답
```

---

## 🤖 주요 AI 컴포넌트

### 1. 임베딩 시스템

**기술**: OpenAI `text-embedding-3-small` (1536차원)

**임베딩 대상**:
- 사용자 메시지 (실시간)
- 대화 패턴 (사전 생성)
- 페르소나 프로필 (생성 시)

**코드**: `lib/embeddings.ts`

```typescript
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })
  return embedding
}
```

---

### 2. 벡터 검색 (RAG)

**기술**: PostgreSQL pgvector + IVFFlat 인덱스

**검색 파라미터**:
- `query_embedding`: 사용자 메시지 임베딩
- `mbti_filter`: 페르소나 MBTI (예: "INTJ")
- `relationship_filter`: 관계 타입 (superior/peer/subordinate)
- `enneagram_filter`: 애니어그램 타입 (예: "5")
- `match_threshold`: 0.3 (30% 이상 유사도)
- `match_count`: 3 (상위 3개)

**PostgreSQL 함수**:

```sql
CREATE FUNCTION search_similar_patterns(
  query_embedding TEXT,  -- JSON.stringify(number[])
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 3,
  mbti_filter VARCHAR(4) DEFAULT NULL,
  relationship_filter VARCHAR(50) DEFAULT NULL,
  enneagram_filter VARCHAR(3) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  similarity FLOAT,
  pattern_text TEXT,
  relationship_type VARCHAR(50),
  mbti VARCHAR(4),
  disc VARCHAR(4),
  enneagram VARCHAR(3),
  pattern_category VARCHAR(100)
);
```

**검색 과정**:
1. 사용자 메시지 → 임베딩 생성
2. 페르소나 MBTI + 관계 타입 + 애니어그램으로 필터링
3. 코사인 유사도 계산 (pgvector)
4. threshold 이상인 패턴만 선택
5. 유사도 순으로 정렬 → 상위 3개 반환

---

### 3. 프롬프트 엔지니어링

**구조**:

```
[시스템 프롬프트]

당신은 [페르소나명]입니다.

## 심리 프로필
- MBTI: [INTJ] - 전략적, 독립적, 논리적
- DiSC: [DC] - 주도적이고 신중함
- 애니어그램: [5w6] - 탐구자, 지식 추구
- 핵심 특성: [분석적, 독립적, 전략적, 지식 추구]

## 대화 상대와의 관계
- 관계: 부하 직원 (당신이 상급자)
- 어조: 정중하되 지시적
- 존댓말 사용

## 대화 스타일
- 의사소통: 논리적이고 체계적 (INTJ + DC)
- 의사결정: 데이터 기반, 전략적 (INTJ + 5w6)
- 스트레스 대응: 문제 분석 및 솔루션 제시

## 참고할 대화 패턴 (벡터 검색 결과)
1. [패턴 1 텍스트] (유사도: 45%)
2. [패턴 2 텍스트] (유사도: 38%)
3. [패턴 3 텍스트] (유사도: 35%)

## 중요 지침
1. 위 심리 프로필에 일관되게 대화하세요
2. 애니어그램 핵심 동기를 반영하세요
3. 관계에 맞는 어조를 유지하세요
4. 자연스럽고 인간적인 대화를 하세요

[대화 히스토리]
User: ...
Assistant: ...
```

**코드**: `app/api/chat/route.ts`

```typescript
const systemPrompt = buildSystemPrompt(
  persona,
  relationshipType,
  similarPatterns
)

const stream = await streamText({
  model: openai('gpt-4o'),
  system: systemPrompt,
  messages: conversationHistory,
})
```

---

### 4. 대화 생성 (LLM)

**모델**: OpenAI GPT-4o

**특징**:
- 실시간 스트리밍 응답 (토큰 단위)
- 페르소나 일관성 유지
- 컨텍스트 이해 (대화 히스토리)

**Vercel AI SDK 활용**:

```typescript
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages, personaId, relationshipType } = await req.json()

  // 1. 페르소나 로드
  const persona = await loadPersona(personaId)

  // 2. 벡터 검색
  const patterns = await searchSimilarPatterns(...)

  // 3. 시스템 프롬프트 생성
  const systemPrompt = buildSystemPrompt(persona, relationshipType, patterns)

  // 4. 스트리밍 응답
  const stream = await streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  })

  return stream.toDataStreamResponse()
}
```

---

## 📊 골든 데이터셋 전략

### 현재 상태
- **골든 패턴 수**: 123개
- **MBTI 커버리지**: 16개 전체 (평균 7.7개/MBTI)
- **관계 타입 분포**:
  - peer: 68개 (55.3%)
  - subordinate: 31개 (25.2%)
  - superior: 24개 (19.5%)

### 패턴 구조

```typescript
interface ConversationPattern {
  mbti: string              // "INTJ"
  disc: string              // "DC" (16가지 조합 사용)
  enneagram: string         // "5" (기본 타입)
  relationship_type: string // "superior" | "peer" | "subordinate"
  pattern_category: string  // "feedback", "support", "conflict" 등
  conversation_topic: string
  emotional_context: string
  pattern_text: string      // 핵심 패턴 설명
  example_responses: string[] // 예시 응답 3-5개
  effectiveness_score: number // 0.82~0.92
  pattern_embedding: number[] // 1536차원 벡터
}
```

### 패턴 생성 프로세스

```
1. 우선순위 조합 선정
   ↓
2. 각 조합별 상황 정의
   - feedback, support, conflict, decision_making 등
   ↓
3. 패턴 텍스트 작성
   - MBTI + DiSC + 애니어그램 특성 반영
   - 관계별 어조 고려
   ↓
4. 임베딩 생성
   - OpenAI text-embedding-3-small
   ↓
5. DB 저장
   - conversation_patterns 테이블
   - pattern_embedding 컬럼 (vector)
```

**시딩 스크립트**: `project/scripts/seed-golden-patterns.ts`

---

## 🔍 검색 품질 최적화

### Threshold 조정

**초기 설정**: 0.7 (70% 유사도)
**문제**: 실제 사용자 쿼리는 30-41% 수준
**최적화**: 0.3 (30% 유사도)

**근거**:
- 사용자 메시지는 짧고 구어체
- 골든 패턴은 상세하고 공식적
- 의미적 유사도가 높아도 표현 방식 차이 존재

### 애니어그램 필터링

**문제**: Wing 정보 (`5w6`) vs 기본 타입 (`5`)

**해결**:
```typescript
// Wing 제거하여 기본 타입으로 변환
const enneagramBase = persona.enneagram.split('w')[0] // "5w6" → "5"
```

### 결과 개수 최적화

**초기**: 5개
**최적화**: 3개

**근거**:
- 프롬프트 길이 최적화
- GPT-4o 컨텍스트 윈도우 효율성
- 품질 vs 양 트레이드오프

---

## 💾 데이터 흐름

### 대화 세션 생성

```typescript
// 1. 세션 생성
const session = await supabase
  .from('chat_sessions')
  .insert({
    user_id,
    persona_profile_id,
    relationship_type: 'superior',
  })

// 2. 메시지 저장
await supabase.from('chat_messages').insert([
  { session_id, role: 'user', content: userMessage },
  { session_id, role: 'assistant', content: aiResponse },
])
```

### 메시지 저장 전략

**문제**: React 클로저로 인한 stale state
**해결**: `useRef` 사용

```typescript
const sessionIdRef = useRef<string | null>(null)

const handleSaveMessage = async (message: Message) => {
  const currentSessionId = sessionIdRef.current

  if (!currentSessionId) {
    const newSession = await createChatSession(...)
    sessionIdRef.current = newSession.id
  }

  await saveChatMessage(sessionIdRef.current, message)
}
```

---

## 📈 성능 특성

### 응답 시간

| 단계 | 시간 | 최적화 |
|-----|------|--------|
| **임베딩 생성** | ~200ms | OpenAI API |
| **벡터 검색** | ~50ms | IVFFlat 인덱스 |
| **GPT-4o 첫 토큰** | ~500ms | Edge Runtime |
| **전체 응답** | ~3-5s | 스트리밍 |

### 벡터 인덱스

```sql
CREATE INDEX idx_pattern_embedding
ON conversation_patterns
USING ivfflat (pattern_embedding vector_cosine_ops)
WITH (lists = 100);
```

- 선형 검색 대비 10배 빠름
- 10,000 rows까지 최적화
- 코사인 유사도 연산자 사용

---

## 🔮 향후 개선 사항

### Phase 8: 품질 향상

1. **패턴 사용 모니터링**
   - 패턴별 사용 빈도 추적
   - 효과성 점수 업데이트
   - 사용되지 않는 패턴 식별

2. **자동 패턴 생성**
   - GPT-4o 기반 패턴 생성
   - 누락된 조합 자동 탐지
   - 품질 검증 로직

3. **계층적 폴백** (선택)
   - Level 1: MBTI + DiSC + 애니어그램 + 관계
   - Level 2: MBTI + 관계
   - Level 3: 관계만
   - Level 4: 일반 패턴

4. **Re-ranking**
   - 벡터 유사도 × 0.7
   - effectiveness_score × 0.2
   - 사용 빈도 × 0.1

---

## 🔗 관련 파일

**AI 로직**
- [lib/embeddings.ts](../lib/embeddings.ts) - 임베딩 생성
- [lib/supabase/vector.ts](../lib/supabase/vector.ts) - 벡터 검색
- [app/api/chat/route.ts](../app/api/chat/route.ts) - 대화 API

**데이터**
- [project/data/psychology-profiles.json](../project/data/psychology-profiles.json) - 심리 프로필 정의
- [project/scripts/seed-golden-patterns.ts](../project/scripts/seed-golden-patterns.ts) - 골든 패턴 시딩

**문서**
- [docs/ARCHITECTURE.md](ARCHITECTURE.md) - 전체 시스템 아키텍처
- [docs/ai-pattern-generation.md](ai-pattern-generation.md) - 패턴 생성 상세 가이드

---

**마지막 업데이트**: 2025-11-14
