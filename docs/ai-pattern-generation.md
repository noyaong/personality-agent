# AI 기반 패턴 생성 전략 (v2)

## 🎯 정확한 문제 정의

### 실제 조합의 폭발

```
MBTI: 16가지
DiSC: 16가지 (2자릿수 세부 조합)
  - D, Di, DC, DS
  - I, ID, IS, IC
  - S, SI, SD, SC
  - C, CD, CI, CS

애니어그램: 18가지 (날개 포함)
  - 1w9, 1w2, 2w1, 2w3, 3w2, 3w4
  - 4w3, 4w5, 5w4, 5w6, 6w5, 6w7
  - 7w6, 7w8, 8w7, 8w9, 9w8, 9w1

관계: 3가지

16 × 16 × 18 × 3 = 13,824개 조합

카테고리: 7가지
- greeting, feedback, conflict, celebration
- stress_response, decision_making, information_sharing

총 패턴: 13,824 × 7 = 96,768개!
```

### 현실적 제약
- ❌ 수동 작성 불가능
- ❌ 전부 AI 생성도 비용 과다
- ❌ 모든 조합이 실제로 사용되지 않음

---

## 🎯 해결책: 계층적 폴백 시스템

### 핵심 아이디어

```
Level 1 (완전체): ISTJ + DC + 1w2 + superior
                 ↓ (없으면 폴백)
Level 2 (날개 생략): ISTJ + DC + 1 + superior
                    ↓ (없으면 폴백)
Level 3 (DiSC 단순화): ISTJ + D + 1 + superior
                      ↓ (없으면 폴백)
Level 4 (기본): MBTI + 관계만 → AI 전체 생성
```

---

## 📝 데이터베이스 스키마 개선

### 계층적 패턴 저장

```sql
CREATE TABLE conversation_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 기본 정보
  mbti VARCHAR(4) NOT NULL,
  disc VARCHAR(2) NOT NULL,           -- D, Di, DC 등
  enneagram VARCHAR(10) NOT NULL,     -- 1, 1w2 등
  relationship_type VARCHAR(20) NOT NULL,
  pattern_category VARCHAR(50) NOT NULL,
  
  -- 계층 레벨
  specificity_level INTEGER NOT NULL,
  /* 
    1: MBTI만 (예: ISTJ + superior + feedback)
    2: MBTI + DiSC 주 스타일 (ISTJ + D + superior)
    3: MBTI + DiSC 세부 + 애니어그램 기본 (ISTJ + DC + 1)
    4: 완전체 (ISTJ + DC + 1w2)
  */
  
  -- 상속 구조
  parent_pattern_id UUID REFERENCES conversation_patterns(id),
  delta_traits JSONB DEFAULT '{}',
  /* 부모 패턴과의 차이만 저장
     예: Level 3 → Level 4로 갈 때
     부모: ISTJ + DC + 1
     delta: { "wing_2_influence": ["타인 돕기", "봉사 정신"] }
  */
  
  -- 패턴 데이터
  pattern_text TEXT NOT NULL,
  example_responses JSONB DEFAULT '[]',
  pattern_embedding vector(1536),
  
  -- 품질 관리
  quality_score FLOAT DEFAULT 0.7,
  is_golden BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스 최적화를 위한 복합 인덱스
  CONSTRAINT unique_pattern UNIQUE (
    mbti, disc, enneagram, 
    relationship_type, pattern_category
  )
);

-- 계층별 인덱스
CREATE INDEX idx_pattern_level ON conversation_patterns(specificity_level);
CREATE INDEX idx_pattern_parent ON conversation_patterns(parent_pattern_id);
```

---

## 🔍 계층적 검색 로직

### 1. 스마트 폴백 구현

```typescript
// src/lib/personas/hierarchical-search.ts

interface PatternQuery {
  mbti: string          // "ISTJ"
  disc: string          // "DC"
  enneagram: string     // "1w2"
  relationship: string  // "superior"
  category: string      // "feedback"
}

async function findPatternWithFallback(query: PatternQuery) {
  // Level 4: 완전 매칭 시도
  let pattern = await findExactPattern(query)
  if (pattern) {
    return { pattern, level: 4, source: 'exact_match' }
  }
  
  // Level 3: 애니어그램 날개 제거
  const baseEnneagram = query.enneagram.split('w')[0]
  pattern = await findExactPattern({
    ...query,
    enneagram: baseEnneagram
  })
  
  if (pattern) {
    // 날개 특성만 추가
    const enhanced = await enhanceWithWing(
      pattern, 
      query.enneagram
    )
    return { pattern: enhanced, level: 3, source: 'wing_enhanced' }
  }
  
  // Level 2: DiSC 단순화 (주 스타일만)
  const mainDisc = query.disc[0]
  pattern = await findExactPattern({
    ...query,
    disc: mainDisc,
    enneagram: baseEnneagram
  })
  
  if (pattern) {
    // DiSC 부 스타일 + 날개 추가
    const enhanced = await enhanceWithDiscAndWing(
      pattern,
      query.disc,
      query.enneagram
    )
    return { pattern: enhanced, level: 2, source: 'disc_wing_enhanced' }
  }
  
  // Level 1: MBTI + 관계만
  pattern = await findBasicPattern(
    query.mbti,
    query.relationship,
    query.category
  )
  
  if (pattern) {
    // 전체 특성 생성 (GPT-4o)
    const generated = await generateFromBase(pattern, query)
    return { pattern: generated, level: 1, source: 'full_generation' }
  }
  
  // Level 0: 완전히 새로 생성
  const newPattern = await generateFromScratch(query)
  return { pattern: newPattern, level: 0, source: 'scratch' }
}
```

### 2. 특성 증강 (Enhancement) 로직

```typescript
// 애니어그램 날개 특성 추가
async function enhanceWithWing(
  basePattern: Pattern,
  enneagram: string
): Promise<Pattern> {
  const [type, wing] = enneagram.split('w')
  
  // 날개 특성 로드
  const wingTraits = await getWingTraits(type, wing)
  
  // GPT-4o로 통합
  const prompt = `
기본 패턴:
${basePattern.pattern_text}

응답 예시:
${basePattern.example_responses.join('\n')}

애니어그램 ${type}번의 w${wing} 날개 특성을 반영하여
위 패턴을 자연스럽게 개선하세요.

날개 특성:
${wingTraits.join(', ')}

기존 패턴의 핵심은 유지하되, 날개의 미묘한 영향을 추가하세요.
  `
  
  const enhanced = await gpt4o.enhance(prompt)
  
  return {
    ...basePattern,
    pattern_text: enhanced.pattern_text,
    example_responses: enhanced.example_responses,
    specificity_level: 4,
    parent_pattern_id: basePattern.id,
    delta_traits: { wing_influence: wingTraits }
  }
}

// DiSC 부 스타일 + 날개 추가
async function enhanceWithDiscAndWing(
  basePattern: Pattern,
  disc: string,
  enneagram: string
): Promise<Pattern> {
  const mainStyle = disc[0]
  const subStyle = disc[1] || mainStyle
  
  const prompt = `
기본 패턴 (${basePattern.mbti} + ${mainStyle} + ${enneagram.split('w')[0]}):
${basePattern.pattern_text}

추가할 특성:
1. DiSC 부 스타일 ${subStyle}: ${getDiscTraits(subStyle)}
2. 애니어그램 날개 ${enneagram}: ${getWingTraits(enneagram)}

이 두 가지 특성을 자연스럽게 통합하세요.
  `
  
  const enhanced = await gpt4o.enhance(prompt)
  
  return {
    ...basePattern,
    ...enhanced,
    specificity_level: 4,
    parent_pattern_id: basePattern.id
  }
}
```

---

## 📊 골든 데이터셋 전략

### 계층별 데이터 분배

```typescript
// Level 1: MBTI + 관계 (기본 골든)
// 16 MBTI × 3 관계 × 7 카테고리 = 336개
// → 수동 작성 (최고 품질)

const level1Golden = [
  { mbti: "ISTJ", relationship: "superior", category: "feedback" },
  { mbti: "ISTJ", relationship: "peer", category: "greeting" },
  // ... 336개
]

// Level 2: MBTI + DiSC 주 + 관계
// 16 MBTI × 4 DiSC(D,I,S,C) × 3 관계 = 192개 조합
// 각 카테고리 1개씩만 = 192 × 7 = 1,344개
// → 50-100개만 선별 작성

const level2Representative = [
  { mbti: "ISTJ", disc: "C", relationship: "superior" },
  { mbti: "ENTP", disc: "D", relationship: "peer" },
  // ... 100개 정도
]

// Level 3: MBTI + DiSC 세부 + 애니어그램 기본
// 자주 사용되는 조합 20-30개만
// → 나머지는 Level 2에서 자동 생성

const level3Popular = [
  { mbti: "ISTJ", disc: "CS", enneagram: "1" },
  { mbti: "ENTP", disc: "DI", enneagram: "7" },
  // ... 30개
]

// Level 4: 완전체
// → 모두 온디맨드 생성
```

### 통계 기반 우선순위

```typescript
// 실제 MBTI 분포 (한국 기준)
const mbtiDistribution = {
  "ISTJ": 0.13,  // 13%
  "ISFJ": 0.11,
  "ESTJ": 0.10,
  "ESFJ": 0.09,
  // ... 
  "INFJ": 0.02,  // 2% (희소)
  "INTJ": 0.02
}

// DiSC 일반적 분포
const discDistribution = {
  "D": 0.10,
  "I": 0.30,
  "S": 0.35,
  "C": 0.25
}

// 조합 확률 계산
function calculateCombinationPriority(combo) {
  const mbtiProb = mbtiDistribution[combo.mbti]
  const discProb = discDistribution[combo.disc[0]]
  
  // 확률이 높은 조합 우선
  return mbtiProb * discProb
}

// 우선순위 순으로 생성
const sortedCombos = allCombinations
  .map(c => ({ ...c, priority: calculateCombinationPriority(c) }))
  .sort((a, b) => b.priority - a.priority)
  .slice(0, 500) // 상위 500개만
```

---

## 🚀 점진적 확장 전략

### Phase 1: 핵심 골든 데이터 (Week 1)
```typescript
목표: 400개 패턴
- Level 1: 336개 (MBTI + 관계 전체)
- Level 2: 64개 (자주 쓰이는 조합)

커버리지: 0.4% (400 / 96,768)
하지만 실제 요청의 60%는 커버 가능 (빈도 기반)
```

### Phase 2: 자동 확장 (Week 2-4)
```typescript
목표: 2,000개 패턴
- Level 2: 200개 (통계 기반)
- Level 3: 1,400개 (온디맨드 생성)

커버리지: 2% 
실제 커버: 85%
```

### Phase 3: 롱테일 대응 (Month 2-3)
```typescript
목표: 10,000개 패턴
- 사용자 요청 기반 생성
- 백그라운드 시딩

커버리지: 10%
실제 커버: 95%+
```

---

## 💻 캐싱 및 성능 최적화

### 3단계 캐싱

```typescript
// L1: 메모리 캐시 (자주 사용되는 100개)
const memoryCache = new LRU<string, Pattern>({ max: 100 })

// L2: Redis (Level 3-4 패턴, TTL 7일)
const redisCache = new Redis(process.env.REDIS_URL)

// L3: PostgreSQL (영구 저장)
const db = supabase

async function getPatternCached(query: PatternQuery) {
  const key = generateCacheKey(query)
  
  // L1: 메모리
  let pattern = memoryCache.get(key)
  if (pattern) return pattern
  
  // L2: Redis
  const cached = await redisCache.get(key)
  if (cached) {
    pattern = JSON.parse(cached)
    memoryCache.set(key, pattern)
    return pattern
  }
  
  // L3: DB + 계층적 폴백
  pattern = await findPatternWithFallback(query)
  
  // 캐싱
  await redisCache.setex(key, 7 * 24 * 3600, JSON.stringify(pattern))
  memoryCache.set(key, pattern)
  
  return pattern
}
```

---

## 📈 예상 성능

### 응답 시간

| 케이스 | 시간 | 히트율 |
|--------|------|--------|
| **L1 캐시 히트** | < 1ms | 20% |
| **L2 캐시 히트** | < 50ms | 40% |
| **Level 4 매칭** | < 100ms | 15% |
| **Level 3 폴백** | < 500ms | 15% |
| **Level 2 폴백** | < 2s | 8% |
| **Level 1 생성** | < 5s | 2% |

### 누적 커버리지

```
Day 1:   400 패턴 (60% 요청 커버)
Week 1:  1,000 패턴 (75% 요청 커버)
Month 1: 5,000 패턴 (90% 요청 커버)
Month 3: 15,000 패턴 (97% 요청 커버)
```

---

## 🎯 구현 우선순위

### 필수 (Phase 1)
- ✅ Level 1-2 골든 데이터 400개
- ✅ 계층적 폴백 로직
- ✅ GPT-4o 증강 로직
- ✅ Redis 캐싱

### 권장 (Phase 2)
- ⭐ 통계 기반 우선순위
- ⭐ 백그라운드 시딩
- ⭐ 품질 점수 시스템

### 선택 (Phase 3)
- 💡 A/B 테스팅
- 💡 사용자 피드백 루프
- 💡 자동 품질 개선

---

**핵심**: 13,824개 조합을 모두 준비하지 않고도,
계층적 폴백으로 95%+ 요청을 고품질로 처리 가능!

---

## 🤖 해결 전략: 하이브리드 RAG

### 핵심 원리

```
골든 데이터셋 (50-100개)
    ↓
pgvector 유사도 검색
    ↓
GPT-4o 맥락 기반 생성
    ↓
품질 검증 및 저장
    ↓
점진적 학습 (새 골든 데이터)
```

---

## 📝 구현 설계

### 1. 골든 데이터셋 설계

#### 선정 기준
```typescript
// 대표성: 각 심리 프로필의 전형적 조합
const goldenCombinations = [
  // MBTI 각 유형 대표
  { mbti: "ISTJ", disc: "CS", enneagram: "1w2" },  // 완벽주의 관리자
  { mbti: "ENTP", disc: "DI", enneagram: "7w8" },  // 혁신적 도전자
  { mbti: "INFP", disc: "IS", enneagram: "4w5" },  // 이상주의 예술가
  
  // DiSC 각 스타일 대표
  { mbti: "ESTJ", disc: "DC", enneagram: "8w7" },  // 주도적 리더
  { mbti: "ESFJ", disc: "IS", enneagram: "2w1" },  // 사교적 조력자
  { mbti: "ISFJ", disc: "SC", enneagram: "6w5" },  // 안정적 지원자
  
  // 애니어그램 각 유형 대표
  { mbti: "INTJ", disc: "CD", enneagram: "5w6" },  // 전략적 분석가
  { mbti: "ENFJ", disc: "ID", enneagram: "3w2" },  // 카리스마 성취자
  { mbti: "ISTP", disc: "DC", enneagram: "9w8" },  // 평화로운 실용가
  
  // ... 총 50-100개
]

// 각 조합마다 관계 3가지 × 카테고리 7가지 = 21개 패턴
// 총 50개 조합 × 21개 패턴 = 1,050개 골든 패턴
```

#### 골든 패턴 예시
```json
{
  "id": "uuid",
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
  "quality_score": 1.0,  // 수동 작성 = 최고 품질
  "is_golden": true,
  "pattern_embedding": [0.123, -0.456, ...],
  "created_by": "manual"
}
```

---

### 2. 유사 패턴 검색 로직

```typescript
// src/lib/personas/similarity.ts

interface PersonaInput {
  mbti: string
  disc: string
  enneagram: string
  relationship: string
  category: string
}

async function findSimilarPatterns(input: PersonaInput) {
  // 1. 입력을 텍스트로 변환
  const queryText = `
    MBTI ${input.mbti}: ${getMBTIDescription(input.mbti)}
    DiSC ${input.disc}: ${getDiSCDescription(input.disc)}
    애니어그램 ${input.enneagram}: ${getEnneagramDescription(input.enneagram)}
    관계: ${input.relationship}
    카테고리: ${input.category}
  `
  
  // 2. 임베딩 생성
  const embedding = await createEmbedding(queryText)
  
  // 3. pgvector 유사도 검색
  const { data: similar } = await supabase.rpc('search_similar_patterns', {
    query_embedding: embedding,
    target_mbti: input.mbti,
    target_disc: input.disc,
    target_enneagram: input.enneagram,
    target_relationship: input.relationship,
    match_threshold: 0.7,
    match_count: 5
  })
  
  // 4. 품질 점수 순으로 정렬
  return similar
    .sort((a, b) => b.quality_score - a.quality_score)
    .slice(0, 3) // 상위 3개만
}
```

---

### 3. AI 기반 패턴 생성

```typescript
// src/lib/personas/generator.ts

async function generatePattern(input: PersonaInput) {
  // 1. 유사 패턴 검색
  const similarPatterns = await findSimilarPatterns(input)
  
  if (similarPatterns.length === 0) {
    // 유사 패턴 없음 → 기본 매핑 사용
    return generateFromBaseMapping(input)
  }
  
  // 2. GPT-4o 프롬프트 구성
  const prompt = buildGenerationPrompt(input, similarPatterns)
  
  // 3. GPT-4o 호출
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: PATTERN_GENERATION_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  })
  
  // 4. 결과 파싱 및 검증
  const generated = JSON.parse(response.choices[0].message.content)
  
  // 5. 품질 검증
  const qualityScore = await validateQuality(generated, similarPatterns)
  
  // 6. 임베딩 생성
  const embedding = await createEmbedding(generated.pattern_text)
  
  // 7. DB 저장
  const { data: saved } = await supabase
    .from('conversation_patterns')
    .insert({
      ...input,
      pattern_text: generated.pattern_text,
      example_responses: generated.example_responses,
      pattern_embedding: embedding,
      quality_score: qualityScore,
      is_golden: false,
      created_by: "ai_generated"
    })
    .select()
    .single()
  
  return saved
}
```

---

### 4. 프롬프트 설계

```typescript
const PATTERN_GENERATION_SYSTEM_PROMPT = `
당신은 심리학 전문가이자 대화 패턴 생성 전문가입니다.

역할:
1. MBTI, DiSC, 애니어그램 이론을 깊이 이해
2. 각 심리 프로필 조합의 특성을 정확히 분석
3. 관계(상급자/동료/하급자)에 맞는 대화 패턴 생성
4. 자연스럽고 일관된 한국어 대화 예시 작성

출력 형식:
{
  "pattern_text": "상황 설명",
  "example_responses": ["응답1", "응답2", "응답3"],
  "rationale": "이 패턴이 적절한 이유"
}
`

function buildGenerationPrompt(
  input: PersonaInput, 
  similar: SimilarPattern[]
) {
  return `
다음 심리 프로필 조합에 대한 대화 패턴을 생성하세요:

[대상 프로필]
- MBTI: ${input.mbti}
  특성: ${getMBTITraits(input.mbti).join(', ')}
  
- DiSC: ${input.disc}
  행동: ${getDiSCBehavior(input.disc)}
  
- 애니어그램: ${input.enneagram}
  동기: ${getEnneagramMotivation(input.enneagram)}

[관계 및 상황]
- 관계: ${input.relationship} (${getRelationshipDescription(input.relationship)})
- 카테고리: ${input.category}
- 상황: ${getCategoryContext(input.category)}

[참고할 유사 패턴]
${similar.map((p, i) => `
패턴 ${i + 1}: ${p.mbti}+${p.disc}+${p.enneagram} (유사도: ${p.similarity.toFixed(2)})
- 상황: ${p.pattern_text}
- 예시: ${p.example_responses.slice(0, 2).join(' / ')}
`).join('\n')}

[생성 지침]
1. 대상 프로필의 고유한 특성을 정확히 반영하세요
2. MBTI는 사고/판단 방식에, DiSC는 행동 스타일에, 애니어그램은 근본 동기에 영향을 줍니다
3. 관계에 맞는 언어(존댓말/반말)와 거리감을 유지하세요
4. 자연스럽고 현실적인 대화 예시를 작성하세요
5. 유사 패턴을 참고하되, 대상 프로필만의 독특함을 표현하세요

JSON 형식으로 출력하세요.
`
}
```

---

### 5. 품질 검증 로직

```typescript
async function validateQuality(
  generated: GeneratedPattern,
  similarPatterns: SimilarPattern[]
): Promise<number> {
  let score = 0.5 // 기본 점수
  
  // 1. 응답 개수 확인 (3개 이상)
  if (generated.example_responses.length >= 3) {
    score += 0.1
  }
  
  // 2. 응답 길이 확인 (너무 짧거나 길지 않은지)
  const avgLength = generated.example_responses
    .map(r => r.length)
    .reduce((a, b) => a + b, 0) / generated.example_responses.length
  
  if (avgLength >= 10 && avgLength <= 100) {
    score += 0.1
  }
  
  // 3. 유사 패턴과의 일관성 (너무 비슷하지도, 다르지도 않게)
  const similarities = await Promise.all(
    similarPatterns.map(async (p) => {
      const genEmbed = await createEmbedding(generated.pattern_text)
      return cosineSimilarity(genEmbed, p.pattern_embedding)
    })
  )
  
  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
  
  if (avgSimilarity >= 0.6 && avgSimilarity <= 0.85) {
    score += 0.2 // 적절한 유사도
  }
  
  // 4. 키워드 포함 확인
  const requiredKeywords = extractKeywords(generated.pattern_text)
  const hasKeywords = requiredKeywords.some(kw => 
    generated.example_responses.some(r => r.includes(kw))
  )
  
  if (hasKeywords) {
    score += 0.1
  }
  
  return Math.min(score, 1.0)
}
```

---

### 6. 캐싱 전략

```typescript
// src/lib/cache/redis.ts

import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function getCachedPattern(key: string) {
  const cached = await redis.get(`pattern:${key}`)
  return cached ? JSON.parse(cached) : null
}

async function setCachedPattern(key: string, pattern: any) {
  // TTL: 7일 (자주 사용되면 자동 갱신)
  await redis.setex(
    `pattern:${key}`, 
    7 * 24 * 60 * 60, 
    JSON.stringify(pattern)
  )
}

// 페르소나 생성 시 캐시 활용
async function createPersonaWithCache(input: PersonaInput) {
  const cacheKey = `${input.mbti}:${input.disc}:${input.enneagram}:${input.relationship}:${input.category}`
  
  // 1. 캐시 확인
  let pattern = await getCachedPattern(cacheKey)
  
  if (pattern) {
    // 캐시 히트 → 즉시 반환
    return pattern
  }
  
  // 2. 캐시 미스 → 생성
  pattern = await generatePattern(input)
  
  // 3. 캐시 저장
  await setCachedPattern(cacheKey, pattern)
  
  return pattern
}
```

---

### 7. 백그라운드 시딩 (선택사항)

```typescript
// scripts/background-seeding.ts

/**
 * 사용 빈도가 높은 조합을 백그라운드에서 미리 생성
 * Vercel Cron 또는 Supabase Edge Functions로 주기 실행
 */

export async function seedPopularCombinations() {
  // 1. 사용 통계 조회
  const { data: stats } = await supabase
    .from('persona_profiles')
    .select('mbti, disc, enneagram')
    .order('usage_count', { ascending: false })
    .limit(100)
  
  // 2. 아직 패턴이 없는 조합 찾기
  const missingCombinations = await findMissingPatterns(stats)
  
  // 3. 배치 생성 (한 번에 10개씩)
  for (let i = 0; i < missingCombinations.length; i += 10) {
    const batch = missingCombinations.slice(i, i + 10)
    
    await Promise.all(
      batch.map(combo => 
        generateAllPatternsForCombination(combo)
      )
    )
    
    console.log(`Seeded ${i + batch.length} / ${missingCombinations.length}`)
  }
}

async function generateAllPatternsForCombination(combo: Combination) {
  const relationships = ['superior', 'peer', 'subordinate']
  const categories = [
    'greeting', 'feedback', 'conflict', 
    'celebration', 'stress_response', 
    'decision_making', 'information_sharing'
  ]
  
  for (const rel of relationships) {
    for (const cat of categories) {
      await generatePattern({
        ...combo,
        relationship: rel,
        category: cat
      })
    }
  }
}
```

---

## 📊 성능 최적화

### 생성 시간 목표

| 시나리오 | 목표 시간 | 전략 |
|---------|----------|------|
| **캐시 히트** | < 100ms | Redis 캐싱 |
| **유사 패턴 있음** | < 3초 | GPT-4o 1회 호출 |
| **유사 패턴 없음** | < 5초 | 기본 매핑 + GPT-4o |
| **백그라운드 시딩** | 비동기 | 사용자 영향 없음 |

### 비용 최적화

```typescript
// 1. 토큰 사용량 제한
const MAX_PROMPT_TOKENS = 2000
const MAX_COMPLETION_TOKENS = 500

// 2. 캐싱으로 중복 생성 방지
// 3. 배치 처리로 API 호출 최소화
```

---

## 🎯 단계별 구현 계획

### Phase 1: 기본 시스템 (Week 1)
- [ ] 골든 데이터셋 50개 작성
- [ ] 유사 패턴 검색 구현
- [ ] 기본 생성 로직 구현

### Phase 2: 품질 개선 (Week 2)
- [ ] GPT-4o 프롬프트 최적화
- [ ] 품질 검증 로직 구현
- [ ] 테스트 및 개선

### Phase 3: 최적화 (Week 3)
- [ ] Redis 캐싱 구현
- [ ] 백그라운드 시딩 구현
- [ ] 성능 모니터링

### Phase 4: 학습 루프 (Week 4)
- [ ] 사용자 피드백 수집
- [ ] 낮은 품질 패턴 재생성
- [ ] 점진적 품질 개선

---

## 📈 예상 효과

### 커버리지
```
Week 1: 50개 조합 (골든 데이터)
Week 2: 200개 조합 (인기 조합 생성)
Week 3: 500개 조합 (온디맨드 생성)
Week 4: 1000+ 조합 (지속적 확장)
```

### 품질
```
골든 데이터: 1.0 (수동 작성)
AI 생성 (유사 패턴 있음): 0.8-0.9
AI 생성 (유사 패턴 없음): 0.6-0.7
개선 후: 0.85+ (피드백 반영)
```

---

**다음 단계**: `docs/requirements.md`에 AI 생성 로직 추가