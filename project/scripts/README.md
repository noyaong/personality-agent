# Golden Patterns Scripts

골든 대화 패턴 관리 및 시딩 스크립트 모음

> 마지막 업데이트: 2025-11-14

---

## 📁 파일 구조

```
scripts/
├── README.md                    # 이 파일
│
├── golden-patterns-data.ts      # 골든 패턴 데이터 (123개)
├── seed-golden-patterns.ts      # 메인 시딩 스크립트
│
├── analyze-patterns.ts          # 기존 패턴 분석
├── verify-patterns.ts           # 패턴 개수 검증
├── verify-all.ts                # 전체 검증
├── find-gaps.ts                 # 누락된 조합 탐지
│
└── regenerate-embeddings.ts     # 임베딩 재생성
    remove-duplicates.ts         # 중복 패턴 제거
```

### 스크립트 분류

#### 데이터
- **golden-patterns-data.ts** - 123개 골든 패턴 정의 (Tier 1/2/3)

#### 시딩
- **seed-golden-patterns.ts** - 메인 시딩 스크립트
  ```bash
  npm run seed:patterns
  ```

#### 분석/검증
- **analyze-patterns.ts** - 기존 패턴 통계 및 분석
- **verify-patterns.ts** - 패턴 개수 검증 (목표 대비)
- **verify-all.ts** - 전체 품질 검증 (필수 필드, 임베딩 등)
- **find-gaps.ts** - 누락된 MBTI × 관계 조합 탐지

#### 유틸리티
- **regenerate-embeddings.ts** - 기존 패턴의 임베딩 재생성
- **remove-duplicates.ts** - 중복 패턴 제거

---

## 🎯 골든 패턴 전략

### 최종 목표: 123개 패턴 ✅ 완료!

**조합 구성**:
- MBTI: 16가지
- DiSC: 16가지 (기본 4개 + 조합 12개)
- 애니어그램: 9가지 (기본 타입)
- 관계: 3가지 (superior, peer, subordinate)

### 티어 시스템

#### Tier 1: 매우 흔한 조합 (45개 패턴)
- MBTI 빈도 높음 + 뚜렷한 특성
- 우선순위: 최상

#### Tier 2: 흔한 조합 (38개 패턴)
- 중간 빈도 + 특색있는 조합
- 우선순위: 중간

#### Tier 3: 특색있는 조합 (40개 패턴)
- 낮은 빈도지만 고유한 특성
- 우선순위: 낮음

---

## 📊 현재 상태 ✅ 123개 완료!

### 시딩 완료 (2025-11-13)

```
✅ Tier 1: 45개 패턴 (100%)
✅ Tier 2: 38개 패턴 (100%)
✅ Tier 3: 40개 패턴 (100%)
✅ 전체: 123개 패턴 (100%)
```

### 벡터 검색 최적화

- ✅ threshold: 0.7 → **0.3** (최적화 완료)
- ✅ 애니어그램 필터링 추가
- ✅ MBTI × 관계 조합 48개 전체 커버리지 달성

---

## 🚀 사용 방법

### 1. 메인 시딩 스크립트

**123개 패턴이 이미 시딩되었습니다!** (2025-11-13)

재시딩 또는 추가 시딩이 필요한 경우:

```bash
cd project
npm run seed:patterns
```

또는:

```bash
npx tsx scripts/seed-golden-patterns.ts
```

### 2. 패턴 분석

기존 패턴 통계 확인:

```bash
npx tsx scripts/analyze-patterns.ts
```

### 3. 검증 스크립트

패턴 개수 검증:

```bash
npx tsx scripts/verify-patterns.ts
```

전체 품질 검증:

```bash
npx tsx scripts/verify-all.ts
```

누락된 조합 탐지:

```bash
npx tsx scripts/find-gaps.ts
```

### 4. 유틸리티

임베딩 재생성 (필요시):

```bash
npx tsx scripts/regenerate-embeddings.ts
```

중복 패턴 제거:

```bash
npx tsx scripts/remove-duplicates.ts
```

---

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

---

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
1. Supabase 마이그레이션 확인
2. RPC 함수가 생성되었는지 Supabase Dashboard에서 확인
3. 필요시 마이그레이션 재실행

---

## 📈 품질 검증

### 자기 유사도 체크

각 패턴의 임베딩 자기 유사도가 90% 이상인지 확인:

```sql
SELECT
  id,
  mbti,
  relationship_type,
  1 - (pattern_embedding <=> pattern_embedding) as self_similarity
FROM conversation_patterns
WHERE 1 - (pattern_embedding <=> pattern_embedding) < 0.9;
```

### MBTI × 관계 커버리지

48개 조합이 모두 커버되었는지 확인:

```sql
SELECT
  mbti,
  relationship_type,
  COUNT(*) as pattern_count
FROM conversation_patterns
GROUP BY mbti, relationship_type
ORDER BY mbti, relationship_type;
```

### 패턴 품질 통계

```sql
-- 평균 effectiveness_score
SELECT AVG(effectiveness_score) FROM conversation_patterns;

-- 카테고리별 패턴 수
SELECT pattern_category, COUNT(*)
FROM conversation_patterns
GROUP BY pattern_category
ORDER BY COUNT(*) DESC;
```

---

## 🔗 관련 문서

- [AI Architecture](../../docs/AI_ARCHITECTURE.md) - AI 시스템 아키텍처
- [AI Pattern Generation Guide](../../docs/ai-pattern-generation.md) - 패턴 생성 전략
- [Psychology Profiles](../data/psychology-profiles.json) - 심리 프로필 정의
- [Relationship Guides](../data/relationship-guides.json) - 관계별 가이드

---

## 💡 팁

1. **점진적 시딩**: 모든 패턴을 한 번에 작성하지 말고, Tier 1부터 작성하고 시딩하여 테스트하세요.

2. **품질 우선**: 개수보다는 품질이 중요합니다. 잘 작성된 50개 패턴이 대충 작성된 100개보다 효과적입니다.

3. **실제 테스트**: 패턴 시딩 후 실제 대화에서 테스트하여 효과를 검증하세요.

4. **반복 개선**: 사용자 피드백을 바탕으로 패턴을 지속적으로 개선하세요.

---

**마지막 업데이트**: 2025-11-14
