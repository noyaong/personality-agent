# AI 기반 패턴 생성 전략 (v3 - 현행화)

> **최종 업데이트**: 2025-11-13
> **현재 상태**: Phase 1 구현 완료 (벡터 검색 기반 RAG)

## 📋 구현 현황

### ✅ 완료된 기능
1. **벡터 임베딩 시스템**
   - OpenAI `text-embedding-3-small` (1536차원) 사용
   - `lib/embeddings.ts`: 임베딩 생성 함수 구현
   - Persona 및 Pattern 임베딩 텍스트 생성

2. **pgvector 검색 인프라**
   - PostgreSQL vector extension 활성화
   - IVFFlat 인덱스 (lists=100) 생성
   - 코사인 유사도 기반 검색 함수
   - `search_similar_patterns()` RPC 함수 구현

3. **RAG 기반 대화 증강**
   - `enrichWithConversationPatterns()` 함수
   - 실시간 벡터 검색으로 유사 패턴 조회
   - 시스템 프롬프트에 컨텍스트 주입

4. **데이터베이스 스키마**
   - `conversation_patterns` 테이블 (Prisma 스키마)
   - RLS 정책 설정 완료
   - 벡터 임베딩 컬럼 (`pattern_embedding`)

### 🚧 진행 중 / 미구현
- [ ] 골든 데이터셋 생성 (현재 0개)
- [ ] 계층적 폴백 시스템
- [ ] Redis 캐싱
- [ ] 백그라운드 시딩
- [ ] 품질 점수 시스템

---

## 🎯 문제 정의

### 실제 조합의 폭발

```
MBTI: 16가지

DiSC: 16가지 ✅ 이미 정의됨 (psychology-profiles.json)
  기본형 (4가지): D, I, S, C
  조합형 (12가지):
    - DI, DC, DS (D 주도)
    - ID, IS, IC (I 주도)
    - SI, SC, SD (S 주도)
    - CI, CD, CS (C 주도)

애니어그램: 9가지 (기본 타입만, Phase 1)
  - 1, 2, 3, 4, 5, 6, 7, 8, 9
  ※ 날개 포함 18가지는 Phase 2

관계: 3가지
  - superior, peer, subordinate

16 × 16 × 9 × 3 = 6,912개 조합 (현재)

카테고리: 현재 미사용 (동적 컨텍스트 기반)

※ Phase 2에서 애니어그램 날개 추가 시:
  16 × 16 × 18 × 3 = 13,824개 조합
```

### 현실적 제약
- ❌ 수동 작성 불가능 (6,912개 조합)
- ✅ **현재 전략**: RAG 기반 동적 생성 (골든 데이터 기반)
- ✅ 벡터 검색으로 실시간 유사 패턴 활용
- ✅ DiSC 16가지 조합 이미 구현되어 있음

---

## 🎯 현재 구현: RAG 기반 벡터 검색

### 현재 아키텍처 (Phase 1)

```
사용자 메시지
    ↓
OpenAI Embedding (1536차원)
    ↓
pgvector 코사인 유사도 검색
    ↓
상위 5개 유사 패턴 (threshold >= 0.7)
    ↓
시스템 프롬프트에 컨텍스트 추가
    ↓
GPT-4o 대화 생성
```

### 향후 계획: 계층적 폴백 (Phase 2)

```
Level 1 (완전체): ISTJ + DC + 1w2 + superior
                 ↓ (없으면 폴백)
Level 2 (날개 생략): ISTJ + DC + 1 + superior  ← Phase 1 현재 레벨
                    ↓ (없으면 폴백)
Level 3 (DiSC 단순화): ISTJ + D + 1 + superior
                      ↓ (없으면 폴백)
Level 4 (기본): MBTI + 관계만 → RAG 검색
```

**참고**: 현재 DiSC 16가지 조합이 모두 정의되어 있으므로,
골든 패턴 생성 시 DC, DI, IS 등의 조합을 바로 활용할 수 있습니다.

---

## 📝 현재 데이터베이스 스키마

### Prisma Schema (실제 구현)

```prisma
model ConversationPattern {
  id                   String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  mbti                 String   @db.VarChar(4)
  disc                 String?  @db.VarChar(4)
  enneagram            String?  @db.VarChar(3)
  relationshipType     String   @map("relationship_type") @db.VarChar(50)
  patternCategory      String   @map("pattern_category") @db.VarChar(100)
  conversationTopic    String?  @map("conversation_topic")
  emotionalContext     String?  @map("emotional_context")
  patternText          String   @map("pattern_text")
  exampleResponses     Json?    @map("example_responses")
  effectivenessScore   Float?   @map("effectiveness_score")
  usageFrequency       Int      @default(0) @map("usage_frequency")
  createdAt            DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  // Vector embedding (1536차원, pgvector)
  // ⚠️ Prisma가 지원하지 않으므로 Supabase RPC로 관리

  @@map("conversation_patterns")
}
```

### PostgreSQL Functions (실제 구현)

```sql
-- 패턴 임베딩 업데이트
CREATE FUNCTION update_pattern_embedding(
  pattern_id UUID,
  embedding_vector TEXT -- JSON.stringify(number[])
) RETURNS void;

-- 유사 패턴 검색
CREATE FUNCTION search_similar_patterns(
  query_embedding TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  mbti_filter VARCHAR(4) DEFAULT NULL,
  relationship_filter VARCHAR(50) DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  similarity FLOAT,
  pattern_text TEXT
);

-- IVFFlat 인덱스
CREATE INDEX idx_pattern_embedding ON conversation_patterns
USING ivfflat (pattern_embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## 🔍 현재 검색 로직 (실제 구현)

### 1. RAG 기반 패턴 증강

**파일**: `app/api/chat/route.ts`

```typescript
async function enrichWithConversationPatterns(
  userMessage: string,
  persona: any,
  relationshipType?: string
): Promise<string> {
  try {
    // 1. 사용자 메시지 임베딩 생성
    const embedding = await generateEmbedding(userMessage);

    // 2. 벡터 검색으로 유사 패턴 조회
    const similarPatterns = await searchSimilarPatterns(
      embedding,
      persona.mbti,
      relationshipType,
      5,    // 상위 5개
      0.7   // 70% 이상 유사도
    );

    if (similarPatterns.length === 0) {
      return ''; // 유사 패턴 없으면 기본 프롬프트만 사용
    }

    // 3. 시스템 프롬프트에 추가할 컨텍스트 생성
    const context = `\n\n## 참고할 대화 패턴\n` +
      similarPatterns.map((p, i) =>
        `${i + 1}. ${p.pattern_text} (유사도: ${(p.similarity * 100).toFixed(1)}%)`
      ).join('\n');

    return context;
  } catch (error) {
    console.error('Pattern enrichment failed:', error);
    return '';
  }
}
```

### 2. 벡터 검색 함수

**파일**: `lib/supabase/vector.ts`

```typescript
export async function searchSimilarPatterns(
  embedding: number[],
  mbti?: string,
  relationshipType?: string,
  limit: number = 10,
  threshold: number = 0.7
): Promise<Array<{ id: string; similarity: number; pattern_text: string }>> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc('search_similar_patterns', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: limit,
    mbti_filter: mbti || null,
    relationship_filter: relationshipType || null,
  })

  if (error) {
    console.error('Failed to search similar patterns:', error)
    throw new Error('Failed to search similar patterns')
  }

  return data || []
}
```

---

## 📊 골든 데이터셋 전략 (진행 필요)

### 현재 상태
- ❌ **골든 패턴 수**: 0개 (미생성)
- ✅ **인프라**: 벡터 검색 준비 완료
- ✅ **스키마**: conversation_patterns 테이블 설정 완료

### Phase 1 목표 (긴급)

**최소 골든 데이터셋**: 50-100개

```typescript
// 우선순위 조합 (실제 사용 빈도 기반)
const priorityCombinations = [
  // 1. 가장 흔한 MBTI (한국 기준)
  { mbti: "ISTJ", disc: "C", enneagram: "1", relationships: ["superior", "peer"] },
  { mbti: "ISFJ", disc: "S", enneagram: "2", relationships: ["peer", "subordinate"] },
  { mbti: "ESTJ", disc: "D", enneagram: "8", relationships: ["superior"] },

  // 2. 대표적인 대비 성향
  { mbti: "ENTP", disc: "D", enneagram: "7", relationships: ["peer"] },
  { mbti: "INFP", disc: "I", enneagram: "4", relationships: ["peer"] },

  // ... 총 50개 조합 × 다양한 상황 = 100-200개 패턴
]
```

### 골든 패턴 예시 구조

```json
{
  "mbti": "ISTJ",
  "disc": "C",
  "enneagram": "1",
  "relationship_type": "superior",
  "pattern_category": "feedback",
  "conversation_topic": "부하 직원의 실수 지적",
  "emotional_context": "진지하고 체계적",
  "pattern_text": "부하 직원의 실수에 대해 건설적 피드백을 제공합니다. 사실에 기반하여 문제점을 명확히 지적하되, 개선 방안을 구체적으로 제시합니다.",
  "example_responses": [
    "이번 실수를 통해 배운 점이 있다면 무엇인가요?",
    "다음부터는 체크리스트를 활용해보는 것이 어떨까요?",
    "정확성을 높이기 위한 프로세스를 같이 만들어봅시다."
  ],
  "effectiveness_score": 0.9,
  "usage_frequency": 0
}
```

---

## 💻 현재 성능 특성

### 응답 시간 (실측 기반)

| 단계 | 시간 | 설명 |
|-----|------|------|
| **임베딩 생성** | ~200-500ms | OpenAI API 호출 |
| **벡터 검색** | ~50-100ms | pgvector + IVFFlat 인덱스 |
| **GPT-4o 응답** | ~2-5s | 스트리밍 응답 |
| **총 시간** | ~2.5-6s | 골든 패턴 있을 때 |

### 패턴 없을 때
- 벡터 검색 결과 0개 → 기본 프롬프트만 사용
- 시간: ~2-5s (GPT-4o 응답만)

---

## 🎯 다음 단계 (우선순위)

### 긴급 (Week 1)
1. **골든 데이터셋 생성**
   - [ ] 50개 핵심 조합 선정
   - [ ] 조합당 2-5개 상황별 패턴 작성
   - [ ] 총 100-200개 골든 패턴 생성
   - [ ] Supabase에 임베딩과 함께 저장

2. **품질 검증**
   - [ ] 실제 대화에서 패턴 활용 테스트
   - [ ] 유사도 threshold 조정 (현재 0.7)
   - [ ] 검색 결과 개수 최적화 (현재 5개)

### 중요 (Week 2-3)
3. **자동 패턴 생성 파이프라인**
   - [ ] 누락된 조합 자동 탐지
   - [ ] GPT-4o 기반 패턴 생성 스크립트
   - [ ] 생성된 패턴 품질 검증 로직

4. **성능 최적화**
   - [ ] Redis 캐싱 (선택사항)
   - [ ] 임베딩 배치 생성
   - [ ] 벡터 인덱스 튜닝

### 향후 (Phase 2)
5. **계층적 폴백 시스템**
   - ✅ DiSC 세부 조합 이미 지원됨 (DC, DI, IS, SC 등 12가지)
   - [ ] 애니어그램 날개 지원 (1w2, 1w9 등)
   - [ ] Level별 폴백 로직 구현

---

## 📝 골든 데이터 생성 가이드

### 1. 조합 선정 기준

**MBTI 분포 우선순위** (한국 기준)
- High: ISTJ, ISFJ, ESTJ, ESFJ (13-10%)
- Medium: ISTP, ISFP, ESTP, ESFP (8-6%)
- Low: INTJ, INFJ, ENTJ, ENFJ (4-2%)

**DiSC 16가지** ✅ 모두 사용 가능
- 기본형 (4): D, I, S, C
- 조합형 (12): DI, DC, DS, ID, IS, IC, SI, SC, SD, CI, CD, CS

**애니어그램 기본형** (Phase 1)
- 1-9 (날개 없이)

**관계 타입**
- superior, peer, subordinate

**우선순위 조합 예시**:
```typescript
// High Priority (빈도 높음 + 뚜렷한 특성)
{ mbti: "ISTJ", disc: "DC", enneagram: "1" },  // 주도적 신중형 완벽주의자
{ mbti: "ESFJ", disc: "IS", enneagram: "2" },  // 사교적 안정형 조력자
{ mbti: "ESTJ", disc: "DI", enneagram: "8" },  // 주도적 사교형 도전자

// Medium Priority (특색있는 조합)
{ mbti: "ENTP", disc: "DI", enneagram: "7" },  // 주도적 사교형 열정가
{ mbti: "INFP", disc: "IS", enneagram: "4" },  // 사교적 안정형 개인주의자
{ mbti: "INTJ", disc: "CD", enneagram: "5" },  // 신중한 주도형 탐구자
```

---

### 2. 패턴 작성 템플릿

```typescript
// scripts/create-golden-pattern.ts

interface GoldenPattern {
  mbti: string
  disc: string
  enneagram: string
  relationship_type: string
  pattern_category: string
  conversation_topic: string
  emotional_context: string
  pattern_text: string
  example_responses: string[]
  effectiveness_score: number
}

// 예시 1: ISTJ + DC + 1 + superior (DiSC 조합 활용)
const examplePattern1: GoldenPattern = {
  mbti: "ISTJ",
  disc: "DC",  // 주도적 신중형 (조합)
  enneagram: "1",
  relationship_type: "superior",
  pattern_category: "feedback",
  conversation_topic: "업무 실수 지적 및 개선 요청",
  emotional_context: "진지하고 체계적이며 건설적",
  pattern_text: "부하 직원의 업무 실수를 발견했을 때, 데이터를 분석하여 정확하고 빠른 결정을 내립니다. 완벽주의 성향으로 인해 디테일에 민감하며, 전략적이고 체계적인 프로세스 개선을 중요시합니다.",
  example_responses: [
    "이 부분에서 정확히 어떤 단계를 놓쳤는지 확인해 주시겠어요?",
    "데이터를 보니 이 프로세스에 개선이 필요합니다. 같이 개선안을 만들어봅시다.",
    "다음에는 체크리스트를 활용하면 이런 실수를 방지할 수 있을 것 같습니다.",
    "이번 경험을 토대로 표준 절차를 문서화하면 좋겠어요."
  ],
  effectiveness_score: 0.9
}

// 예시 2: ESFJ + IS + 2 + peer
const examplePattern2: GoldenPattern = {
  mbti: "ESFJ",
  disc: "IS",  // 사교적 안정형 (조합)
  enneagram: "2",
  relationship_type: "peer",
  pattern_category: "support",
  conversation_topic: "동료의 어려움 공감 및 지원",
  emotional_context: "따뜻하고 우호적이며 지지적",
  pattern_text: "동료가 어려움을 겪을 때, 사람들과 조화롭게 일하며 안정적인 관계를 만듭니다. 타인을 돕고 필요한 존재가 되고자 하며, 팀워크와 감정이입을 중시합니다.",
  example_responses: [
    "많이 힘들었겠어요. 제가 도울 수 있는 게 있을까요?",
    "걱정하지 마세요. 우리가 함께 해결해나갈 수 있어요.",
    "필요하면 언제든지 말씀해 주세요. 제가 옆에서 도와드릴게요.",
    "이런 상황에서는 누구나 어려울 수 있어요. 같이 방법을 찾아봐요."
  ],
  effectiveness_score: 0.85
}
```

---

### 3. 골든 패턴 생성 스크립트

```typescript
// scripts/seed-golden-patterns.ts

import { generateEmbedding } from '@/lib/embeddings'
import { storePatternEmbedding } from '@/lib/supabase/vector'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key
)

async function seedGoldenPattern(pattern: GoldenPattern) {
  // 1. 패턴 텍스트로 임베딩 생성
  const embeddingText = `
    MBTI: ${pattern.mbti}
    DISC: ${pattern.disc}
    Enneagram: ${pattern.enneagram}
    Relationship: ${pattern.relationship_type}
    Category: ${pattern.pattern_category}
    Topic: ${pattern.conversation_topic}
    Context: ${pattern.emotional_context}
    Pattern: ${pattern.pattern_text}
  `.trim()

  const embedding = await generateEmbedding(embeddingText)

  // 2. DB에 패턴 저장
  const { data, error } = await supabase
    .from('conversation_patterns')
    .insert({
      mbti: pattern.mbti,
      disc: pattern.disc,
      enneagram: pattern.enneagram,
      relationship_type: pattern.relationship_type,
      pattern_category: pattern.pattern_category,
      conversation_topic: pattern.conversation_topic,
      emotional_context: pattern.emotional_context,
      pattern_text: pattern.pattern_text,
      example_responses: pattern.example_responses,
      effectiveness_score: pattern.effectiveness_score,
      usage_frequency: 0,
    })
    .select()
    .single()

  if (error) throw error

  // 3. 임베딩 저장 (RPC 함수 사용)
  await storePatternEmbedding(data.id, embedding)

  console.log(`✅ Created golden pattern: ${pattern.mbti}+${pattern.disc}+${pattern.enneagram} (${pattern.relationship_type})`)
}

// 골든 패턴 배치 생성
async function seedAllGoldenPatterns() {
  const patterns: GoldenPattern[] = [
    // TODO: 50-100개 패턴 정의
    examplePattern,
    // ... 추가 패턴
  ]

  for (const pattern of patterns) {
    await seedGoldenPattern(pattern)
    await new Promise(resolve => setTimeout(resolve, 500)) // Rate limiting
  }

  console.log(`✅ Seeded ${patterns.length} golden patterns`)
}

seedAllGoldenPatterns().catch(console.error)
```

---

## 📊 향후 개선 사항 (Phase 2+)

### 자동 패턴 생성 파이프라인 (미구현)

```typescript
// 향후 구현 예정 - scripts/auto-generate-patterns.ts

/**
 * GPT-4o를 사용하여 누락된 조합의 패턴을 자동 생성
 */
async function autoGeneratePattern(input: {
  mbti: string
  disc: string
  enneagram: string
  relationship: string
  category: string
}) {
  // 1. 유사 골든 패턴 검색
  const similarPatterns = await searchSimilarPatterns(...)

  // 2. GPT-4o로 새 패턴 생성
  const generated = await generatePatternWithGPT4o(input, similarPatterns)

  // 3. 품질 검증 후 저장
  if (validateQuality(generated) > 0.7) {
    await savePattern(generated)
  }
}
```

### 캐싱 시스템 (미구현)

```typescript
// 향후 구현 예정 - lib/cache/pattern-cache.ts

/**
 * Redis를 사용한 패턴 캐싱
 * 자주 사용되는 조합을 메모리에 캐시
 */
const patternCache = new LRU({ max: 100 })
```

---

## 📝 요약

### ✅ 현재 완료
1. pgvector 벡터 검색 인프라
2. 임베딩 생성 함수
3. RAG 기반 대화 증강 로직
4. RLS 정책 설정

### 🚧 진행 필요 (긴급)
1. **골든 데이터셋 생성** (50-100개)
   - 우선순위 조합 선정
   - 패턴 작성 및 임베딩 생성
   - Supabase 저장

2. **품질 검증**
   - 실제 대화 테스트
   - 파라미터 튜닝 (threshold, limit)

### 🔮 향후 계획 (Phase 2)
1. 계층적 폴백 시스템
2. 자동 패턴 생성 파이프라인
3. Redis 캐싱
4. 백그라운드 시딩

---

## 🔗 관련 파일

**구현 파일**
- `lib/embeddings.ts` - 임베딩 생성
- `lib/supabase/vector.ts` - 벡터 검색
- `app/api/chat/route.ts` - RAG 증강 로직
- `prisma/schema.prisma` - 데이터 스키마
- `prisma/migrations/vector_search_functions.sql` - pgvector 함수

**문서**
- `docs/VECTOR_GUIDE.md` - 벡터 검색 가이드
- `docs/requirements.md` - 전체 요구사항

---

**다음 작업**: 골든 패턴 50개 작성 및 시딩 스크립트 실행
