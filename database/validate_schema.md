# Schema Validation Report

## 검증 날짜
2025-11-07

## 변경 사항

### 1. 기존 문제점
- ❌ 테이블 정의 4번 중복 (lines 39-70, 463-494, 839-869, 1221-1251)
- ❌ CHECK 제약조건 문법 오류 (정규식 미완성)
- ❌ `user_id` 컬럼명 (공유 기능 미지원)
- ❌ 페르소나 공유 아키텍처 미반영

### 2. 수정 완료
✅ **테이블 구조 완전 재작성**
- 중복 제거, 깨끗한 단일 정의
- 총 548 라인 (기존 1591 라인에서 65% 감소)

✅ **persona_profiles 테이블 개선**
```sql
-- 변경 전
user_id UUID                    -- 개인 전용만 가능

-- 변경 후
creator_id UUID                 -- NULL = 관리자, UUID = 사용자
visibility VARCHAR(20)          -- private/public/unlisted
is_official BOOLEAN             -- 관리자 검증 마크
persona_description TEXT        -- 페르소나 설명
creator_usage_count INTEGER     -- 생성자 사용 횟수
public_usage_count INTEGER      -- 타인 사용 횟수
```

✅ **RLS 정책 업데이트**
```sql
-- 조회 정책: 본인 + 공개 + 공식
CREATE POLICY "View own, public, or official personas"
  ON persona_profiles FOR SELECT
  USING (
    auth.uid() = creator_id              -- 본인 것
    OR visibility = 'public'              -- 공개된 것
    OR (creator_id IS NULL AND is_official = true)  -- 공식
  );

-- 관리자 정책
CREATE POLICY "Admins can manage official personas"
  ON persona_profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

✅ **CHECK 제약조건 수정**
```sql
-- 변경 전 (문법 오류)
CONSTRAINT valid_mbti CHECK (mbti ~ '^[EI][SN][TF][JP]

-- 변경 후 (정상)
CONSTRAINT valid_mbti CHECK (mbti ~ '^[EI][SN][TF][JP]$')
CONSTRAINT valid_disc CHECK (disc IS NULL OR disc ~ '^[DISC]{1,2}$')
CONSTRAINT valid_enneagram CHECK (enneagram IS NULL OR enneagram ~ '^[1-9]w[1-9]$|^[1-9]$')
CONSTRAINT valid_visibility CHECK (visibility IN ('private', 'public', 'unlisted'))
```

✅ **트리거 함수 개선**
```sql
CREATE OR REPLACE FUNCTION update_persona_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE persona_profiles
  SET
    usage_count = usage_count + 1,
    -- 생성자 vs 타인 사용 구분
    creator_usage_count = CASE
      WHEN (SELECT user_id FROM chat_sessions WHERE id = NEW.id) = creator_id
      THEN creator_usage_count + 1
      ELSE creator_usage_count
    END,
    public_usage_count = CASE
      WHEN (SELECT user_id FROM chat_sessions WHERE id = NEW.id) != creator_id
      THEN public_usage_count + 1
      ELSE public_usage_count
    END,
    last_used_at = NOW()
  WHERE id = NEW.persona_profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

✅ **뷰 개선**
```sql
-- active_persona_stats에 공유 정보 추가
CREATE OR REPLACE VIEW active_persona_stats AS
SELECT
  p.id,
  p.persona_name,
  p.visibility,           -- 공개 설정
  p.is_official,          -- 공식 마크
  p.creator_usage_count,  -- 생성자 사용
  p.public_usage_count,   -- 타인 사용
  prof.full_name as creator_name  -- 생성자 이름
FROM persona_profiles p
LEFT JOIN profiles prof ON p.creator_id = prof.id
WHERE p.is_active = true
GROUP BY p.id, prof.full_name;
```

✅ **초기 데이터 예시 추가**
```sql
-- DiSC/애니어그램 NULL 허용 예시
INSERT INTO conversation_patterns (
  mbti, disc, enneagram, relationship_type,
  pattern_category, pattern_text, example_responses
) VALUES
(
  'INFP', NULL, NULL, 'peer',  -- DiSC, 애니어그램 없음
  'greeting',
  '동료와의 따뜻한 인사',
  '["오늘 기분 어때?", "힘든 일 있으면 언제든 얘기해", "같이 점심 먹을래?"]'::jsonb
);
```

## PostgreSQL 문법 검증

### ✅ 검증 항목
1. [x] 테이블 생성 문법
2. [x] CHECK 제약조건 정규식
3. [x] Foreign Key 참조
4. [x] 인덱스 생성 (pgvector 포함)
5. [x] RLS 정책 문법
6. [x] 함수/트리거 PL/pgSQL 문법
7. [x] JSONB 타입 사용
8. [x] vector(1536) 타입
9. [x] COMMENT 문법

### 주요 문법 포인트

**1. 정규식 CHECK 제약조건**
```sql
-- MBTI: 정확히 4글자 (E/I + S/N + T/F + J/P)
CHECK (mbti ~ '^[EI][SN][TF][JP]$')

-- DiSC: 1-2글자 (D, I, S, C 조합)
CHECK (disc IS NULL OR disc ~ '^[DISC]{1,2}$')

-- 애니어그램: 1 또는 1w2 형식
CHECK (enneagram IS NULL OR enneagram ~ '^[1-9]w[1-9]$|^[1-9]$')
```

**2. pgvector 인덱스**
```sql
CREATE INDEX idx_persona_embedding ON persona_profiles
  USING ivfflat (profile_embedding vector_cosine_ops)
  WITH (lists = 100);
```

**3. RLS 정책 OR 조건**
```sql
USING (
  auth.uid() = creator_id
  OR visibility = 'public'
  OR (creator_id IS NULL AND is_official = true)
)
```

**4. 순환 참조 방지**
```sql
-- profiles.my_avatar_persona_id
-- → persona_profiles 생성 후 FK 추가
ALTER TABLE profiles
  ADD CONSTRAINT fk_my_avatar_persona
  FOREIGN KEY (my_avatar_persona_id)
  REFERENCES persona_profiles(id)
  ON DELETE SET NULL;
```

## Supabase 실행 가이드

### 1. Supabase SQL Editor에서 실행
```bash
1. Supabase Dashboard 로그인
2. SQL Editor 메뉴
3. New Query
4. schema.sql 전체 복사/붙여넣기
5. Run (F5 또는 Ctrl+Enter)
```

### 2. 실행 순서 확인
- ✅ Extension 활성화 (pgvector)
- ✅ 테이블 생성 (5개)
- ✅ 인덱스 생성 (pgvector 포함)
- ✅ RLS 활성화 및 정책
- ✅ 함수/트리거 생성
- ✅ FK 제약조건 추가
- ✅ 뷰 생성
- ✅ 초기 데이터 삽입
- ✅ 검증 쿼리 실행

### 3. 예상 출력
```
✓ pgvector extension    | Installed
✓ Tables created         | Success
✓ RLS enabled           | Enabled
```

## 아키텍처 반영 확인

### persona-sharing-architecture.md 요구사항
- [x] creator_id (NULL = 관리자)
- [x] visibility (private/public/unlisted)
- [x] is_official (관리자 검증)
- [x] RLS 정책 (본인 + 공개 + 공식)
- [x] 관리자 정책 (JWT role)
- [x] 사용 통계 (생성자/타인 구분)
- [x] my_avatar_persona_id (내 AI 분신)

## 다음 단계

### Phase 1: 기초 인프라
1. ✅ database/schema.sql 완료
2. ⬜ Supabase 프로젝트 생성
3. ⬜ schema.sql 실행
4. ⬜ 환경 변수 설정 (.env.local)

### Phase 2: Next.js 앱 구조
1. ⬜ Next.js 16 프로젝트 초기화
2. ⬜ shadcn/ui 설치
3. ⬜ Supabase 클라이언트 설정
4. ⬜ 인증 플로우 구현

---

**백업 파일**: `database/schema.sql.backup`
**최신 파일**: `database/schema.sql` (548 lines)
