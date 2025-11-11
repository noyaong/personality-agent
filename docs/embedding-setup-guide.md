# Persona Embedding 자동 생성 설정 가이드

## 개요

페르소나가 생성되거나 업데이트될 때 자동으로 벡터 임베딩(embedding)을 생성하는 시스템입니다.

### 아키텍처

```
페르소나 생성/수정
    ↓
Database Trigger 발동
    ↓
Supabase Edge Function 호출
    ↓
Vercel AI SDK (OpenAI text-embedding-3-small)
    ↓
embedding → persona_profiles.profile_embedding
```

## 사전 요구사항

1. **Supabase CLI 설치**
   ```bash
   npm install -g supabase
   ```

2. **Supabase 로그인**
   ```bash
   supabase login
   ```

3. **프로젝트 링크**
   ```bash
   cd /Users/jsnoh/workspace/personality
   supabase link --project-ref tscptdhwdpedngkpmwlm
   ```

## 1단계: pg_net Extension 활성화

Supabase Dashboard에서:
1. `Database` → `Extensions` 이동
2. "pg_net" 검색
3. `Enable` 클릭

또는 SQL Editor에서:
```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## 2단계: Edge Function 배포

```bash
cd /Users/jsnoh/workspace/personality
supabase functions deploy generate-persona-embedding
```

## 3단계: 환경 변수 설정

OpenAI API 키를 Edge Function에 설정:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

확인:
```bash
supabase secrets list
```

## 4단계: Database 설정

Supabase SQL Editor에서 실행:

```sql
-- 1. Supabase URL 설정
ALTER DATABASE postgres
SET app.settings.supabase_url = 'https://tscptdhwdpedngkpmwlm.supabase.co';

-- 2. Service Role Key 설정 (Supabase Dashboard > Settings > API에서 확인)
ALTER DATABASE postgres
SET app.settings.service_role_key = 'YOUR_SERVICE_ROLE_KEY_HERE';
```

## 5단계: Trigger 생성

[database/triggers/persona_embedding_trigger.sql](../database/triggers/persona_embedding_trigger.sql) 파일의 내용을 Supabase SQL Editor에서 실행:

```bash
# 또는 파일로 직접 실행
supabase db push
```

## 6단계: 테스트

### 방법 1: 새 페르소나 생성
웹 앱에서 새 페르소나를 생성하면 자동으로 embedding이 생성됩니다.

### 방법 2: 기존 페르소나 업데이트
```sql
UPDATE persona_profiles
SET persona_description = persona_description || ' '
WHERE id = 'YOUR_PERSONA_ID';
```

### 방법 3: Edge Function 로그 확인
```bash
supabase functions logs generate-persona-embedding
```

### 방법 4: Embedding 확인
```sql
SELECT
  id,
  persona_name,
  profile_embedding IS NOT NULL as has_embedding,
  array_length(profile_embedding::float[], 1) as embedding_dimensions
FROM persona_profiles;
```

결과 예시:
```
id                                   | persona_name | has_embedding | embedding_dimensions
------------------------------------|-------------|---------------|--------------------
23f52f3f-6788-4cbb-96da-820e41216571 | Test Person | true          | 1536
```

## 트러블슈팅

### 문제: Embedding이 생성되지 않음

1. **pg_net extension 확인**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

2. **Edge Function 배포 확인**
   ```bash
   supabase functions list
   ```

3. **환경 변수 확인**
   ```bash
   supabase secrets list
   ```

4. **트리거 확인**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'persona_profile_embedding_trigger';
   ```

5. **Edge Function 로그 확인**
   ```bash
   supabase functions logs generate-persona-embedding --tail
   ```

### 문제: OpenAI API 에러

Edge Function 로그에서 에러 확인:
```bash
supabase functions logs generate-persona-embedding
```

일반적인 원인:
- OpenAI API 키가 잘못됨
- OpenAI API 할당량 초과
- 네트워크 연결 문제

## 수동 Embedding 생성 (필요시)

기존 페르소나에 대해 수동으로 embedding을 생성하려면:

```sql
-- 모든 페르소나 업데이트 (트리거 발동)
UPDATE persona_profiles
SET updated_at = CURRENT_TIMESTAMP
WHERE profile_embedding IS NULL;
```

## 벡터 검색 예시

Embedding이 생성된 후 유사도 검색:

```sql
-- 특정 페르소나와 유사한 다른 페르소나 찾기
SELECT
  p2.id,
  p2.persona_name,
  p2.mbti,
  p2.disc,
  1 - (p1.profile_embedding <=> p2.profile_embedding) as similarity
FROM persona_profiles p1
CROSS JOIN persona_profiles p2
WHERE p1.id = 'YOUR_PERSONA_ID'
  AND p2.id != p1.id
  AND p1.profile_embedding IS NOT NULL
  AND p2.profile_embedding IS NOT NULL
ORDER BY similarity DESC
LIMIT 10;
```

## 비용 고려사항

- **OpenAI text-embedding-3-small**: $0.00002 / 1K tokens
- 평균 페르소나 텍스트: ~500 tokens
- 예상 비용: 페르소나당 $0.00001 (0.001원)

## 참고 자료

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [pg_net Extension](https://supabase.com/docs/guides/database/extensions/pg_net)
- [Vercel AI SDK - embed](https://sdk.vercel.ai/docs/reference/ai-sdk-core/embed)
- [pgvector](https://github.com/pgvector/pgvector)
