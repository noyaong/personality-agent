# Golden Patterns Seeding Scripts

이 디렉토리에는 골든 대화 패턴을 데이터베이스에 시딩하는 스크립트가 포함되어 있습니다.

## 📁 파일 구조

```
scripts/
├── README.md                    # 이 파일
├── golden-patterns-data.ts      # 골든 패턴 데이터 정의
└── seed-golden-patterns.ts      # 시딩 스크립트
```

## 🎯 골든 패턴 전략

### 우선순위 50개 조합

6,912개의 가능한 조합 중, 실제 사용 빈도와 특성의 뚜렷함을 기준으로 50개 핵심 조합을 선정했습니다.

**조합 구성**:
- MBTI: 16가지
- DiSC: 16가지 (기본 4개 + 조합 12개)
- 애니어그램: 9가지 (기본 타입)
- 관계: 3가지 (superior, peer, subordinate)

### 티어 시스템

#### Tier 1: 매우 흔한 조합 (15개)
- MBTI 빈도 높음 + 뚜렷한 특성
- 조합당 평균 3개 패턴
- 예상 패턴 수: 45개

#### Tier 2: 흔한 조합 (15개)
- 중간 빈도 + 특색있는 조합
- 조합당 평균 2.5개 패턴
- 예상 패턴 수: 38개

#### Tier 3: 특색있는 조합 (20개)
- 낮은 빈도지만 고유한 특성
- 조합당 평균 2개 패턴
- 예상 패턴 수: 40개

**총 목표**: 50개 조합 × 평균 2.5개 = **약 123개 골든 패턴**

## 📊 현재 상태 ✅ 완료!

### 시딩 완료 (2025-11-13)

```typescript
// golden-patterns-data.ts 통계
tier1Patterns.length = 29  // Tier 1: 29/45 (64%)
tier2Patterns.length = 18  // Tier 2: 18/38 (47%)
tier3Patterns.length = 4   // Tier 3: 4/40 (10%)
allGoldenPatterns.length = 51  // 전체: 51/123 (41%)
```

### 진행 상황

- ✅ **인프라**: 벡터 검색 시스템 완성
- ✅ **스크립트**: 시딩 스크립트 작성 완료
- ✅ **데이터**: 51개 골든 패턴 작성 완료
- ✅ **실행**: 시딩 성공! (2025-11-13)
- ✅ **데이터베이스**: 51개 패턴 + 임베딩 저장 완료

## 🚀 사용 방법

### 시딩 완료! ✅

**51개 패턴이 이미 시딩되었습니다!** (2025-11-13)

추가 패턴을 시딩하려면:

### 1. 환경 변수 설정 (이미 완료)

`.env.local` 파일에 필요한 변수들:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Admin key
OPENAI_API_KEY=your-openai-api-key
```

### 2. 추가 골든 패턴 작성

`golden-patterns-data.ts` 파일을 편집하여 패턴을 추가합니다:

```typescript
export const tier1Patterns: GoldenPattern[] = [
  {
    mbti: 'ISTJ',
    disc: 'DC',
    enneagram: '1',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '프로젝트 진행 상황 보고',
    emotional_context: '체계적이고 정확하며 책임감 있는',
    pattern_text: '상급자에게 프로젝트 진행 상황을 보고할 때...',
    example_responses: [
      '프로젝트 진행률은 현재 87%입니다.',
      '데이터를 분석한 결과...',
    ],
    effectiveness_score: 0.92
  },
  // ... 더 많은 패턴
]
```

### 3. 시딩 실행 (추가 패턴이 있을 경우)

```bash
cd project
npm run seed:patterns
```

또는:

```bash
npx tsx scripts/seed-golden-patterns.ts
```

### 4. 실행 결과 (2025-11-13 시딩 결과)

✅ **51개 패턴 시딩 성공!**

```
🌱 Golden Patterns Seeding Script
============================================================
✅ Environment variables validated
✅ Supabase admin client initialized

📊 Pattern Statistics:
   Tier 1: 29/45 patterns
   Tier 2: 18/38 patterns
   Tier 3: 4/40 patterns
   Total: 51/123 patterns

🔍 Checking existing patterns...
   Found 0 existing patterns in database

🚀 Starting seeding process...
============================================================

[1/51] Processing: ISTJ+DC+1 (superior)
   Category: reporting
   Topic: 프로젝트 진행 상황 보고
   ⏳ Generating embedding...
   ✅ Embedding generated (1536 dimensions)
   ⏳ Inserting into database...
   ✅ Pattern inserted (ID: uuid)
   ⏳ Storing embedding vector...
   ✅ Embedding stored successfully
   ✅ Pattern 1/51 completed

... (50 more patterns) ...

============================================================
📊 Seeding Summary:
   ✅ Succeeded: 51/51
   ❌ Failed: 0/51

📈 Database Statistics:
   Before: 0 patterns
   After: 51 patterns
   Added: 51 patterns

✅ Seeding completed!
============================================================
```

## 📝 패턴 작성 가이드

### 패턴 카테고리

각 조합당 다양한 상황의 패턴을 작성합니다:

1. **feedback** - 피드백 제공/수용
2. **support** - 지원 요청/제공
3. **conflict** - 갈등 상황 대응
4. **decision_making** - 의사 결정
5. **problem_solving** - 문제 해결
6. **delegation** - 업무 위임
7. **reporting** - 보고
8. **collaboration** - 협업
9. **encouraging** - 격려 및 동기 부여
10. **requesting** - 요청
11. **conflict_resolution** - 갈등 조정

### 관계 타입별 가이드

#### superior (상급자에게)
- 정중하고 존중하는 어조
- 간결하고 명확한 보고
- 데이터 기반 설명
- 예시 카테고리: reporting, requesting, problem_reporting

#### peer (동료)
- 친근하고 협력적인 어조
- 수평적 의사소통
- 솔직한 의견 교환
- 예시 카테고리: collaboration, support, conflict_resolution

#### subordinate (하급자에게)
- 지도하고 이끄는 어조
- 명확한 방향 제시
- 격려와 건설적 피드백
- 예시 카테고리: delegation, feedback, encouraging

### 작성 체크리스트

패턴 작성 시 확인 사항:

- [ ] MBTI, DiSC, 애니어그램 특성이 잘 반영되었는가?
- [ ] 관계 타입에 맞는 어조와 거리감인가?
- [ ] pattern_text가 구체적이고 실용적인가?
- [ ] example_responses가 3-5개 포함되었는가?
- [ ] emotional_context가 조합의 특성을 잘 표현하는가?
- [ ] effectiveness_score가 적절한가? (0.8-0.95 권장)

## 🔧 문제 해결

### 환경 변수 오류

```
❌ Missing required environment variables:
   - SUPABASE_SERVICE_ROLE_KEY
```

**해결**: `.env.local` 파일에 `SUPABASE_SERVICE_ROLE_KEY` 추가

### OpenAI API 오류

```
❌ Failed to generate embedding: 429 Too Many Requests
```

**해결**: 스크립트에 rate limiting이 포함되어 있습니다 (500ms). API 제한에 걸렸다면 잠시 후 재시도하거나 코드의 `setTimeout` 값을 늘리세요.

### Supabase RPC 오류

```
❌ Failed to store embedding: function update_pattern_embedding does not exist
```

**해결**:
1. Supabase 마이그레이션 확인: `prisma/migrations/vector_search_functions.sql`
2. RPC 함수가 생성되었는지 Supabase Dashboard에서 확인
3. 필요시 마이그레이션 재실행

### 임베딩 저장 실패

```
❌ Failed to store pattern embedding
```

**해결**:
1. `pattern_embedding` 컬럼이 존재하는지 확인
2. pgvector extension이 활성화되었는지 확인
3. RPC 함수 권한 확인

## 📈 다음 단계

### ✅ 완료된 작업 (2025-11-13)

1. **골든 패턴 작성** ✅
   - Tier 1: 29개 작성 (64% 완료)
   - Tier 2: 18개 작성 (47% 완료)
   - Tier 3: 4개 작성 (10% 완료)
   - **총 51개 패턴 완성!**

2. **시딩 실행** ✅
   ```bash
   npm run seed:patterns  # 성공!
   ```

3. **품질 검증** (진행 필요)
   - [ ] 실제 대화에서 패턴 활용 테스트
   - [ ] 유사도 threshold 조정 (현재 0.7)
   - [ ] 검색 결과 개수 최적화 (현재 5개)

### 선택사항 (추가 작업)

1. **나머지 패턴 작성** (선택)
   - Tier 1: 16개 더 작성하여 45개 목표 달성
   - Tier 2: 20개 더 작성하여 38개 목표 달성
   - Tier 3: 36개 더 작성하여 40개 목표 달성
   - 총 72개 더 작성 → 123개 목표 달성

### 향후 계획

4. **자동 패턴 생성 파이프라인**
   - 누락된 조합 자동 탐지
   - GPT-4o 기반 패턴 생성
   - 품질 검증 로직

5. **성능 최적화**
   - Redis 캐싱 (선택사항)
   - 임베딩 배치 생성
   - 벡터 인덱스 튜닝

## 🔗 관련 문서

- [AI Pattern Generation Guide](../../docs/ai-pattern-generation.md)
- [Vector Search Guide](../../docs/VECTOR_GUIDE.md)
- [Psychology Profiles](../data/psychology-profiles.json)
- [Relationship Guides](../data/relationship-guides.json)

## 📊 통계 확인

시딩 후 데이터베이스에서 통계 확인:

```sql
-- 전체 패턴 수
SELECT COUNT(*) FROM conversation_patterns;

-- MBTI별 패턴 수
SELECT mbti, COUNT(*)
FROM conversation_patterns
GROUP BY mbti
ORDER BY COUNT(*) DESC;

-- 관계 타입별 패턴 수
SELECT relationship_type, COUNT(*)
FROM conversation_patterns
GROUP BY relationship_type;

-- 카테고리별 패턴 수
SELECT pattern_category, COUNT(*)
FROM conversation_patterns
GROUP BY pattern_category
ORDER BY COUNT(*) DESC;
```

## 💡 팁

1. **점진적 시딩**: 모든 패턴을 한 번에 작성하지 말고, Tier 1부터 작성하고 시딩하여 테스트하세요.

2. **품질 우선**: 개수보다는 품질이 중요합니다. 잘 작성된 50개 패턴이 대충 작성된 100개보다 효과적입니다.

3. **실제 테스트**: 패턴 시딩 후 실제 대화에서 테스트하여 효과를 검증하세요.

4. **반복 개선**: 사용자 피드백을 바탕으로 패턴을 지속적으로 개선하세요.

---

**마지막 업데이트**: 2025-11-13
