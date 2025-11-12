# 벡터 검색 구현 가이드

## 개요

이 프로젝트는 **pgvector**를 사용하여 페르소나와 대화 패턴의 시맨틱 검색을 수행합니다. 벡터 임베딩은 Vercel AI SDK를 통해 OpenAI의 `text-embedding-3-small` 모델(1536차원)로 생성됩니다.

## 아키텍처

### 구성 요소

1. **임베딩 생성** (`lib/embeddings.ts`)
   - OpenAI text-embedding-3-small 모델로 임베딩 생성
   - 페르소나 프로필과 패턴을 검색 가능한 텍스트로 변환하는 유틸리티
   - 배치 임베딩 생성 지원

2. **벡터 저장** (`lib/supabase/vector.ts`)
   - pgvector extension을 사용하여 PostgreSQL에 임베딩 저장
   - 유사한 페르소나 및 대화 패턴 검색 함수
   - Supabase RPC 함수를 통한 벡터 작업

3. **API 엔드포인트**
   - `POST /api/embeddings` - 페르소나 임베딩 생성
   - `POST /api/chat` - 대화 패턴 벡터 검색 통합

4. **데이터베이스 함수** (`prisma/migrations/vector_search_functions.sql`)
   - `update_persona_embedding` - 페르소나 임베딩 저장
   - `update_pattern_embedding` - 패턴 임베딩 저장
   - `search_similar_personas` - 코사인 유사도로 유사 페르소나 검색
   - `search_similar_patterns` - 유사한 대화 패턴 검색

## 설정 방법

### 1. SQL 마이그레이션 실행

데이터베이스 함수와 인덱스를 생성하기 위한 SQL 마이그레이션을 실행합니다:

```bash
# Supabase CLI 사용
supabase db push

# 또는 Supabase Dashboard에서 수동 실행
# prisma/migrations/vector_search_functions.sql 파일 내용 복사
```

마이그레이션 실행 내용:
- pgvector extension 활성화
- 임베딩 저장 및 검색용 RPC 함수 생성
- 빠른 벡터 검색을 위한 IVFFlat 인덱스 생성 (코사인 유사도)
- 인증된 사용자에게 실행 권한 부여

### 2. 기존 페르소나에 대한 임베딩 생성

마이그레이션 실행 후, 기존 페르소나 프로필에 대한 임베딩을 생성합니다:

```bash
# API 엔드포인트 사용 (인증 필요)
curl -X POST http://localhost:3000/api/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

또는 애플리케이션에서 API를 호출하여 임베딩이 없는 모든 페르소나에 대해 생성할 수 있습니다.

### 3. 대화 패턴 추가 (선택사항)

`conversation_patterns` 테이블에 학습 데이터를 채우려면:

1. 실제 채팅 로그를 기반으로 대화 패턴 생성
2. 각 패턴에 대한 임베딩 생성
3. 데이터베이스에 저장

패턴 구조 예시:
```typescript
{
  mbti: "INTJ",
  disc: "D",
  enneagram: "5w6",
  relationshipType: "peer",
  patternCategory: "problem_solving",
  conversationTopic: "technical_discussion",
  emotionalContext: "analytical",
  patternText: "기술적 문제를 논의할 때, 문제를 논리적 구성요소로 나누는 것을 선호합니다...",
  exampleResponses: ["단계별로 분석해보겠습니다...", "근본 원인을 살펴보면..."]
}
```

## 작동 방식

### 페르소나 생성 흐름

1. 사용자가 `POST /api/personas`를 통해 새 페르소나 생성
2. 시스템이 MBTI, DISC, 애니어그램 데이터에서 성격 특성 생성
3. 페르소나 프로필에서 임베딩 자동 생성
4. `persona_profiles.profile_embedding` 컬럼에 임베딩 저장

### 벡터 검색이 포함된 채팅 흐름

1. 사용자가 `POST /api/chat`을 통해 메시지 전송
2. 시스템이 사용자 메시지에 대한 임베딩 생성
3. 벡터 검색으로 상위 5개 유사 대화 패턴 찾기
4. 유사한 패턴을 시스템 프롬프트에 컨텍스트로 추가
5. GPT-4o가 다음을 사용하여 응답 생성:
   - 페르소나의 심리 프로필
   - 유사한 대화 패턴 (발견된 경우)
   - 채팅 기록

### 벡터 검색 파라미터

- **유사도 임계값**: 0.7 (70% 유사도)
- **매칭 개수**: 상위 5개 결과
- **거리 측정**: 코사인 유사도 (`<=>` 연산자 사용)
- **인덱스 타입**: IVFFlat (lists=100)

## API 사용법

### 임베딩 생성

```typescript
POST /api/embeddings
Content-Type: application/json

{
  "personaId": "uuid" // 선택사항 - 생략 시 모든 페르소나 대상
}
```

응답:
```json
{
  "message": "Embedding generation completed",
  "results": [
    {
      "personaId": "uuid",
      "personaName": "Alice",
      "status": "success"
    }
  ],
  "total": 10,
  "successful": 10,
  "failed": 0
}
```

### 벡터 검색이 통합된 채팅

채팅 API는 자동으로 벡터 검색을 사용합니다:

```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": [...],
  "personaId": "uuid",
  "relationshipType": "peer" // 선택사항 - 대화 패턴 필터링
}
```

## 데이터베이스 스키마

### persona_profiles 테이블

```sql
CREATE TABLE persona_profiles (
  id UUID PRIMARY KEY,
  persona_name VARCHAR NOT NULL,
  mbti VARCHAR(4) NOT NULL,
  disc VARCHAR(4),
  enneagram VARCHAR(3),
  profile_embedding vector(1536), -- pgvector 타입
  ...
);

CREATE INDEX idx_persona_embedding ON persona_profiles
USING ivfflat (profile_embedding vector_cosine_ops)
WITH (lists = 100);
```

### conversation_patterns 테이블

```sql
CREATE TABLE conversation_patterns (
  id UUID PRIMARY KEY,
  mbti VARCHAR(4) NOT NULL,
  disc VARCHAR(4),
  enneagram VARCHAR(3),
  relationship_type VARCHAR(50) NOT NULL,
  pattern_category VARCHAR(100) NOT NULL,
  pattern_text TEXT NOT NULL,
  pattern_embedding vector(1536), -- pgvector 타입
  ...
);

CREATE INDEX idx_pattern_embedding ON conversation_patterns
USING ivfflat (pattern_embedding vector_cosine_ops)
WITH (lists = 100);
```

## 성능 고려사항

### 인덱스 타입: IVFFlat

- **Lists**: 100 (정확도와 속도 사이의 균형)
- **쿼리 시간**: 일반적인 데이터셋에서 ~10-50ms
- **트레이드오프**: 큰 속도 향상을 위한 약간의 정확도 손실
- **권장사항**: 100,000개 이상의 벡터인 경우 lists를 200-300으로 증가

### 임베딩 생성

- **API 호출**: 페르소나 생성당 1회 OpenAI API 호출
- **비용**: ~$0.00002 per 1K tokens (text-embedding-3-small)
- **지연시간**: ~100-300ms per 임베딩
- **배치 처리**: 대량 생성 시 `/api/embeddings` 사용

### 캐싱

현재는 임베딩을 필요 시 생성합니다. 다음 구현을 고려하세요:
- 자주 액세스하는 임베딩용 Redis 캐시
- 일반적인 쿼리에 대한 사전 계산된 임베딩
- 임베딩 생성용 백그라운드 작업

## 모니터링

### 추적할 주요 지표

1. **임베딩 생성 성공률**
   - `/api/embeddings`의 API 오류 모니터링
   - 실패한 임베딩 생성 추적

2. **벡터 검색 성능**
   - `search_similar_patterns`의 쿼리 지연시간
   - 캐시 적중률 (구현된 경우)

3. **검색 품질**
   - AI 응답에 대한 사용자 피드백
   - 유사도 점수 분포
   - 거짓 양성률

### 디버깅

채팅 API에서 상세 로깅 활성화:

```typescript
// /app/api/chat/route.ts에서
console.log('✅ 대화 패턴 컨텍스트 추가:', {
  patternsFound: similarPatterns.length,
  topSimilarity: similarPatterns[0]?.similarity,
  averageSimilarity: /* 평균 계산 */
});
```

## 향후 개선사항

1. **하이브리드 검색**: 벡터 검색과 키워드 필터링 결합
2. **멀티모달 임베딩**: 음성/이미지 페르소나 특성 지원
3. **동적 임계값**: 컨텍스트에 따라 유사도 임계값 조정
4. **패턴 학습**: 성공적인 대화에서 자동으로 패턴 추출
5. **A/B 테스팅**: 벡터 검색 사용 여부에 따른 응답 비교

## 문제 해결

### 오류: "pgvector extension not found"

```sql
-- Supabase SQL Editor에서 실행
CREATE EXTENSION IF NOT EXISTS vector;
```

### 오류: "function search_similar_patterns does not exist"

SQL 마이그레이션 파일 실행: `prisma/migrations/vector_search_functions.sql`

### 느린 벡터 검색

1. 인덱스 존재 확인:
```sql
SELECT indexname FROM pg_indexes
WHERE tablename IN ('persona_profiles', 'conversation_patterns');
```

2. 필요 시 인덱스 재구축:
```sql
REINDEX INDEX idx_persona_embedding;
REINDEX INDEX idx_pattern_embedding;
```

### 유사한 패턴을 찾을 수 없음

1. 데이터베이스에 패턴이 존재하는지 확인
2. 유사도 임계값 확인 (기본값: 0.7)
3. 더 많은 결과를 위해 임계값 낮추기 (최소 0.5 권장)
4. 패턴에 대한 임베딩이 생성되었는지 확인

## 참고 자료

- [pgvector 문서](https://github.com/pgvector/pgvector)
- [OpenAI 임베딩 가이드](https://platform.openai.com/docs/guides/embeddings)
- [Vercel AI SDK - embed](https://sdk.vercel.ai/docs/ai-sdk-core/embeddings)
- [Supabase 벡터 검색](https://supabase.com/docs/guides/ai/vector-embeddings)
