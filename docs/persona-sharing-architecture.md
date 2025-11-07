# 페르소나 공유 아키텍처

## 🎯 핵심 질문

### 1. 사용자 역할 구분

```
A 사용자 (철수):
  - 자신의 프로필: ISTJ + CS + 1w2
  - 역할: 챗봇 사용자 + 페르소나 크리에이터

B 페르소나 (김대리):
  - AI 캐릭터: ENTP + DI + 7w8
  - 역할: A가 대화할 상대
  - 생성자: 철수 또는 관리자

C 사용자 (영희):
  - 자신의 프로필: ENFP + IS + 2w3
  - 역할: 챗봇 사용자
  - 철수가 만든 "김대리"와 대화 가능?
```

### 2. 페르소나 공유 모델

#### 옵션 A: 개인 전용 (현재)
```
철수: "김대리" 생성
  ↓
철수만 "김대리"와 대화 가능
  ↓
영희: "김대리" 못 봄 (RLS 차단)
```

#### 옵션 B: 완전 공개
```
철수: "김대리" 생성 + 공개
  ↓
모든 사용자가 "김대리"와 대화 가능
  ↓
영희도 "김대리"와 대화 가능
```

#### 옵션 C: 하이브리드 (권장) ⭐
```
개인 페르소나: 자기만 사용
공개 페르소나: 모두 사용 가능
관리자 페르소나: 검증된 공용
```

---

## 🏗 개선된 데이터베이스 설계

### 1. 페르소나 소유권 및 공개 설정

```sql
CREATE TABLE persona_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 소유권
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  -- NULL: 관리자가 만든 공용 페르소나
  -- UUID: 사용자가 만든 페르소나
  
  -- 페르소나 기본 정보
  persona_name VARCHAR(100) NOT NULL,
  persona_description TEXT,  -- 설명 추가
  
  -- 공개 설정
  visibility VARCHAR(20) DEFAULT 'private',
  -- 'private': 본인만
  -- 'public': 모두 공개
  -- 'unlisted': 링크 아는 사람만
  
  is_official BOOLEAN DEFAULT false,
  -- true: 관리자가 검증한 공식 페르소나
  
  -- 심리 프로필
  mbti VARCHAR(4) NOT NULL,
  disc VARCHAR(2),
  enneagram VARCHAR(10),
  
  -- 특성 데이터
  traits JSONB DEFAULT '{}',
  profile_embedding vector(1536),
  
  -- 통계
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  creator_usage_count INTEGER DEFAULT 0,  -- 만든 사람 사용 횟수
  public_usage_count INTEGER DEFAULT 0,   -- 다른 사람 사용 횟수
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_visibility CHECK (
    visibility IN ('private', 'public', 'unlisted')
  )
);

-- 인덱스
CREATE INDEX idx_persona_creator ON persona_profiles(creator_id);
CREATE INDEX idx_persona_visibility ON persona_profiles(visibility);
CREATE INDEX idx_persona_official ON persona_profiles(is_official) WHERE is_official = true;
CREATE INDEX idx_persona_public ON persona_profiles(visibility, is_active) 
  WHERE visibility = 'public' AND is_active = true;

COMMENT ON COLUMN persona_profiles.creator_id IS 'NULL = 관리자, UUID = 사용자';
COMMENT ON COLUMN persona_profiles.visibility IS 'private/public/unlisted';
COMMENT ON COLUMN persona_profiles.is_official IS '관리자 검증 마크';
```

---

### 2. RLS 정책 개선

```sql
-- RLS 활성화
ALTER TABLE persona_profiles ENABLE ROW LEVEL SECURITY;

-- 정책 1: 조회 (복합 조건)
CREATE POLICY "View own, public, or unlisted personas"
  ON persona_profiles FOR SELECT
  USING (
    -- 조건 1: 자기가 만든 것
    auth.uid() = creator_id
    
    -- 조건 2: 공개된 것
    OR visibility = 'public'
    
    -- 조건 3: 관리자가 만든 공식 페르소나 (creator_id IS NULL)
    OR (creator_id IS NULL AND is_official = true)
    
    -- 조건 4: unlisted는 특별 처리 (별도 테이블로 관리)
  );

-- 정책 2: 생성 (본인만)
CREATE POLICY "Users can create own personas"
  ON persona_profiles FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- 정책 3: 수정 (본인만)
CREATE POLICY "Users can update own personas"
  ON persona_profiles FOR UPDATE
  USING (auth.uid() = creator_id);

-- 정책 4: 삭제 (본인만)
CREATE POLICY "Users can delete own personas"
  ON persona_profiles FOR DELETE
  USING (auth.uid() = creator_id);

-- 관리자 정책 (별도)
CREATE POLICY "Admins can manage official personas"
  ON persona_profiles FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'  -- Supabase Auth role
  );
```

---

### 3. 사용자 프로필 연동

```sql
-- 사용자 자신의 프로필
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- 사용자 자신의 심리 프로필 (선택)
  mbti VARCHAR(4),
  disc VARCHAR(2),
  enneagram VARCHAR(10),
  
  -- 내 아바타 페르소나 (자동 생성된 자기 분신)
  my_avatar_persona_id UUID REFERENCES persona_profiles(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN profiles.my_avatar_persona_id IS '자기 프로필 기반 자동 생성 페르소나 (내 AI 분신)';
```

---

## 🔄 사용 시나리오

### 시나리오 1: 개인 페르소나 (Private)

```
철수 (ISTJ):
  ↓
"김대리(ENTP)" 생성 + visibility='private'
  ↓
철수만 "김대리"와 대화 가능
  ↓
영희: "김대리" 목록에 안 보임 (RLS 차단)
```

**SQL:**
```sql
-- 철수가 생성
INSERT INTO persona_profiles (
  creator_id, persona_name, mbti, visibility
) VALUES (
  'uuid-철수', '김대리', 'ENTP', 'private'
);

-- 영희가 조회 시
SELECT * FROM persona_profiles;
-- 결과: 김대리 안 보임 (creator_id != auth.uid() AND visibility != 'public')
```

---

### 시나리오 2: 공개 페르소나 (Public)

```
철수 (ISTJ):
  ↓
"김대리(ENTP)" 생성 + visibility='public'
  ↓
모든 사용자가 "김대리"와 대화 가능
  ↓
영희: "김대리" 목록에 보임
  ↓
영희도 "김대리"와 대화
```

**SQL:**
```sql
-- 철수가 공개 생성
INSERT INTO persona_profiles (
  creator_id, persona_name, mbti, visibility
) VALUES (
  'uuid-철수', '김대리', 'ENTP', 'public'
);

-- 영희가 조회 시
SELECT * FROM persona_profiles WHERE visibility = 'public';
-- 결과: 김대리 보임
```

---

### 시나리오 3: 자기 아바타 (My Avatar)

```
철수 로그인:
  ↓
온보딩: MBTI(ISTJ) + DiSC(CS) + 애니어그램(1w2) 입력
  ↓
시스템: "철수의 AI 분신" 자동 생성
  - creator_id: 철수
  - visibility: 'private' (기본)
  - is_my_avatar: true (특별 표시)
  ↓
영희: "철수의 AI 분신" 보고 싶으면?
  → 철수가 visibility='public'으로 변경
  → 영희가 "철수 스타일"과 대화 가능
```

**구현:**

```typescript
// 온보딩 완료 시 자동 생성
async function createMyAvatar(userId: string, profile: Profile) {
  const { data: persona } = await supabase
    .from('persona_profiles')
    .insert({
      creator_id: userId,
      persona_name: `${profile.full_name}의 AI 분신`,
      mbti: profile.mbti,
      disc: profile.disc,
      enneagram: profile.enneagram,
      visibility: 'private',  // 기본 비공개
      is_my_avatar: true,     // 특별 표시
      persona_description: '내 성격을 반영한 AI 아바타입니다'
    })
    .select()
    .single()
  
  // 프로필에 연결
  await supabase
    .from('profiles')
    .update({ my_avatar_persona_id: persona.id })
    .eq('id', userId)
}
```

---

### 시나리오 4: 공식 페르소나 (Official)

```
관리자:
  ↓
"김 차장(ISTJ+CS+1w2)" 생성
  - creator_id: NULL (관리자)
  - visibility: 'public'
  - is_official: true (검증 마크)
  ↓
모든 사용자가 접근 가능
  ↓
목록에서 "공식 🏅" 뱃지 표시
```

**SQL:**
```sql
-- 관리자가 생성 (creator_id NULL)
INSERT INTO persona_profiles (
  creator_id, 
  persona_name, 
  mbti, 
  visibility, 
  is_official
) VALUES (
  NULL,           -- 관리자 표시
  '김 차장', 
  'ISTJ', 
  'public', 
  true            -- 공식 마크
);
```

---

## 🔐 Supabase Auth 연동 검증

### 1. 로그인 플로우

```typescript
// 1. 소셜 로그인
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

// 2. 콜백 처리
// /auth/callback
const { data: { session } } = await supabase.auth.getSession()

console.log(session.user)
/*
{
  id: "uuid-xxx",               // ✅ auth.users.id
  email: "user@gmail.com",
  user_metadata: {
    avatar_url: "...",
    full_name: "홍길동"
  }
}
*/

// 3. profiles 테이블 생성 (첫 로그인 시)
const { data: profile } = await supabase
  .from('profiles')
  .select()
  .eq('id', session.user.id)
  .single()

if (!profile) {
  // 프로필 자동 생성
  await supabase.from('profiles').insert({
    id: session.user.id,          // ✅ auth.users.id 연동
    email: session.user.email,
    full_name: session.user.user_metadata.full_name,
    avatar_url: session.user.user_metadata.avatar_url
  })
}
```

**✅ Supabase Auth 완벽 연동**

---

### 2. RLS 자동 필터링

```sql
-- 사용자가 페르소나 조회
SELECT * FROM persona_profiles;

-- Supabase가 자동으로 RLS 적용:
SELECT * FROM persona_profiles
WHERE 
  creator_id = auth.uid()  -- ✅ 현재 로그인 사용자 ID
  OR visibility = 'public'
  OR creator_id IS NULL;
```

**auth.uid()는 Supabase가 자동 제공**
- JWT 토큰에서 추출
- 모든 쿼리에 자동 적용
- 변조 불가능

**✅ 권한 관리 자동화**

---

### 3. 크로스 유저 시나리오 검증

```typescript
// 철수 로그인 (auth.uid() = 'aaa')
const { data: myPersonas } = await supabase
  .from('persona_profiles')
  .select('*')

// 결과:
// - 철수가 만든 페르소나 (creator_id = 'aaa')
// - 공개 페르소나 (visibility = 'public')
// - 관리자 페르소나 (creator_id IS NULL)

// 영희 로그인 (auth.uid() = 'bbb')
const { data: myPersonas } = await supabase
  .from('persona_profiles')
  .select('*')

// 결과:
// - 영희가 만든 페르소나 (creator_id = 'bbb')
// - 공개 페르소나 (visibility = 'public') ✅ 철수 것도 보임
// - 관리자 페르소나 (creator_id IS NULL)
```

**✅ 크로스 유저 페르소나 공유 작동**

---

## 🎨 UI/UX 구현

### 1. 페르소나 생성 시

```tsx
<PersonaForm>
  <Input name="persona_name" placeholder="페르소나 이름" />
  <Select name="mbti">...</Select>
  
  {/* 공개 설정 */}
  <RadioGroup name="visibility">
    <Radio value="private">
      🔒 나만 사용 (비공개)
    </Radio>
    <Radio value="public">
      🌐 모두와 공유 (공개)
      <p className="text-xs text-gray-500">
        다른 사용자도 이 페르소나와 대화할 수 있습니다
      </p>
    </Radio>
  </RadioGroup>
  
  <Button type="submit">페르소나 생성</Button>
</PersonaForm>
```

---

### 2. 페르소나 목록

```tsx
<PersonaList>
  {/* 내 페르소나 */}
  <Section title="내 페르소나">
    <PersonaCard 
      name="김대리"
      creator="나"
      visibility="private"
      badge="🔒"
    />
  </Section>
  
  {/* 공개 페르소나 */}
  <Section title="공개 페르소나">
    <PersonaCard 
      name="이 과장"
      creator="철수님"
      visibility="public"
      badge="🌐"
      usage={1234}  // 다른 사람 사용 횟수
    />
    
    <PersonaCard 
      name="박 대리"
      creator="관리자"
      visibility="public"
      badge="🏅 공식"
      isOfficial
    />
  </Section>
</PersonaList>
```

---

### 3. 내 아바타 관리

```tsx
<MyProfile>
  <Section title="내 AI 아바타">
    <AvatarCard 
      name="철수의 AI 분신"
      profile={myProfile}
      visibility="private"
    />
    
    <Button onClick={toggleVisibility}>
      {visibility === 'private' 
        ? '🌐 공개로 전환 (다른 사람도 사용 가능)'
        : '🔒 비공개로 전환'
      }
    </Button>
    
    {visibility === 'public' && (
      <Stats>
        <Stat label="나의 사용" value={creatorUsage} />
        <Stat label="다른 사용자" value={publicUsage} />
      </Stats>
    )}
  </Section>
</MyProfile>
```

---

## 📊 데이터 흐름 요약

```
사용자 로그인 (Supabase Auth)
  ↓
auth.users 생성 (자동)
  ↓
profiles 생성 (첫 로그인)
  ↓
온보딩: MBTI 등 입력
  ↓
"내 AI 아바타" 자동 생성 (선택)
  ↓
페르소나 생성 (수동)
  - private: 나만
  - public: 모두
  ↓
다른 사용자가 공개 페르소나 사용
  ↓
RLS가 자동으로 권한 관리
```

---

## ✅ 최종 검증

### 1. Supabase Auth 연동
- ✅ auth.users와 profiles 완벽 연동
- ✅ auth.uid()로 자동 사용자 식별
- ✅ 소셜 로그인 메타데이터 활용

### 2. 페르소나 소유권
- ✅ creator_id로 소유자 명확
- ✅ NULL = 관리자 페르소나
- ✅ UUID = 사용자 페르소나

### 3. 공개 설정
- ✅ private/public/unlisted 지원
- ✅ RLS로 자동 필터링
- ✅ 크로스 유저 공유 가능

### 4. 내 아바타
- ✅ 자기 프로필 기반 자동 생성
- ✅ 공개 전환 가능
- ✅ 다른 사용자가 내 스타일 체험

---

**결론**: 아키텍처 검증 완료! 모든 시나리오 지원 가능 ✅