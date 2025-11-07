# 패턴 등록 및 관리 가이드

## 🔄 패턴 등록 워크플로우

### 문제: 임베딩 필수

```sql
-- ❌ 이렇게만 하면 안 됨
INSERT INTO conversation_patterns (mbti, pattern_text)
VALUES ('ISTJ', '피드백 패턴');

-- pattern_embedding이 NULL
-- → 벡터 검색 불가
-- → 페르소나 생성 시 활용 불가
```

**필수 작업:**
`pattern_text` → OpenAI API → `pattern_embedding` (1536차원 벡터)

---

## 💡 세 가지 등록 방법

### 방법 1: API를 통한 등록 (권장) ⭐

#### API 구현

```typescript
// src/app/api/admin/patterns/route.ts

import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/ai/openai'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  
  // 1. 인증 확인 (관리자만)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 2. 요청 데이터 파싱
  const body = await req.json()
  const {
    mbti,
    disc,
    enneagram,
    relationship_type,
    pattern_category,
    pattern_text,
    example_responses
  } = body
  
  // 3. 유효성 검증
  if (!mbti || !disc || !enneagram || !pattern_text) {
    return Response.json(
      { error: 'Missing required fields' }, 
      { status: 400 }
    )
  }
  
  try {
    // 4. 임베딩 자동 생성
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: pattern_text
    })
    
    const embedding = embeddingResponse.data[0].embedding
    
    // 5. DB 저장 (임베딩 포함)
    const { data: pattern, error } = await supabase
      .from('conversation_patterns')
      .insert({
        mbti,
        disc,
        enneagram,
        relationship_type,
        pattern_category,
        pattern_text,
        example_responses,
        pattern_embedding: embedding,
        quality_score: 1.0, // 수동 작성 = 최고 품질
        is_golden: true,
        specificity_level: 4, // 완전체
        created_by: 'admin'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // 6. 즉시 사용 가능!
    return Response.json({
      success: true,
      pattern,
      message: '✅ 패턴이 등록되었습니다. 즉시 사용 가능합니다.'
    })
    
  } catch (error) {
    console.error('Pattern creation error:', error)
    return Response.json(
      { error: 'Failed to create pattern' },
      { status: 500 }
    )
  }
}

// 임베딩 없는 패턴 조회
export async function GET(req: NextRequest) {
  const supabase = createClient()
  
  const { data: patterns } = await supabase
    .from('conversation_patterns')
    .select('id, mbti, disc, enneagram, pattern_text, created_at')
    .is('pattern_embedding', null)
    .order('created_at', { ascending: false })
  
  return Response.json({
    count: patterns?.length || 0,
    patterns: patterns || []
  })
}
```

#### 사용 예시

```bash
# cURL
curl -X POST https://your-domain.com/api/admin/patterns \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "mbti": "ISTJ",
    "disc": "CS",
    "enneagram": "1w2",
    "relationship_type": "superior",
    "pattern_category": "feedback",
    "pattern_text": "부하 직원의 실수에 대해 건설적 피드백을 제공하는 상황",
    "example_responses": [
      "이번 실수를 통해 배운 점이 있다면 무엇인가요?",
      "다음부터는 체크리스트를 활용해보는 것이 좋겠습니다.",
      "정확성을 높이기 위한 프로세스를 함께 만들어봅시다."
    ]
  }'

# 응답
{
  "success": true,
  "pattern": {
    "id": "uuid-here",
    "mbti": "ISTJ",
    ...
  },
  "message": "✅ 패턴이 등록되었습니다. 즉시 사용 가능합니다."
}
```

#### Admin UI (선택)

```tsx
// src/app/admin/patterns/new/page.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function NewPatternPage() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      mbti: formData.get('mbti'),
      disc: formData.get('disc'),
      enneagram: formData.get('enneagram'),
      relationship_type: formData.get('relationship'),
      pattern_category: formData.get('category'),
      pattern_text: formData.get('pattern_text'),
      example_responses: formData.get('examples')?.toString().split('\n').filter(Boolean)
    }
    
    try {
      const res = await fetch('/api/admin/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await res.json()
      
      if (result.success) {
        toast.success('패턴이 등록되었습니다!')
        e.currentTarget.reset()
      } else {
        toast.error('등록 실패: ' + result.error)
      }
    } catch (error) {
      toast.error('오류 발생')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">새 패턴 등록</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <Input name="mbti" placeholder="MBTI (예: ISTJ)" required />
        <Input name="disc" placeholder="DiSC (예: CS)" required />
        <Input name="enneagram" placeholder="애니어그램 (예: 1w2)" required />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <select name="relationship" required className="border p-2 rounded">
          <option value="">관계 선택</option>
          <option value="superior">상급자</option>
          <option value="peer">동료</option>
          <option value="subordinate">하급자</option>
        </select>
        
        <select name="category" required className="border p-2 rounded">
          <option value="">카테고리 선택</option>
          <option value="greeting">인사</option>
          <option value="feedback">피드백</option>
          <option value="conflict">갈등</option>
          <option value="celebration">축하</option>
          <option value="stress_response">스트레스</option>
        </select>
      </div>
      
      <Textarea 
        name="pattern_text" 
        placeholder="패턴 설명 (예: 부하 직원의 실수에 대해...)"
        required
        rows={3}
      />
      
      <Textarea 
        name="examples" 
        placeholder="예시 응답들 (한 줄에 하나씩)"
        required
        rows={5}
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? '등록 중...' : '패턴 등록'}
      </Button>
    </form>
  )
}
```

---

### 방법 2: 백그라운드 워커 (대량 처리)

#### Vercel Cron 설정

```typescript
// src/app/api/cron/process-embeddings/route.ts

import { createClient } from '@supabase/supabase-js'
import { openai } from '@/lib/ai/openai'

export async function GET(req: Request) {
  // Vercel Cron Secret으로 보안
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 서비스 키 사용
  )
  
  console.log('🔄 임베딩 생성 작업 시작...')
  
  // 1. 임베딩 없는 패턴 조회
  const { data: patterns, error } = await supabase
    .from('conversation_patterns')
    .select('id, pattern_text')
    .is('pattern_embedding', null)
    .limit(100) // 한 번에 100개
  
  if (error || !patterns || patterns.length === 0) {
    return Response.json({ 
      message: '처리할 패턴 없음',
      processed: 0
    })
  }
  
  console.log(`📝 ${patterns.length}개 패턴 처리 중...`)
  
  let processed = 0
  let failed = 0
  
  // 2. 배치 처리
  for (const pattern of patterns) {
    try {
      // 임베딩 생성
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: pattern.pattern_text
      })
      
      const embedding = response.data[0].embedding
      
      // DB 업데이트
      const { error: updateError } = await supabase
        .from('conversation_patterns')
        .update({ 
          pattern_embedding: embedding,
          updated_at: new Date().toISOString()
        })
        .eq('id', pattern.id)
      
      if (updateError) throw updateError
      
      processed++
      console.log(`✅ ${pattern.id} 완료 (${processed}/${patterns.length})`)
      
      // Rate limiting 방지 (OpenAI: 3000 RPM)
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      failed++
      console.error(`❌ ${pattern.id} 실패:`, error)
    }
  }
  
  console.log(`🎉 완료: ${processed}개 성공, ${failed}개 실패`)
  
  return Response.json({
    success: true,
    processed,
    failed,
    total: patterns.length
  })
}
```

#### Vercel Cron 등록

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/process-embeddings",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**스케줄 설명:**
- `0 */6 * * *`: 6시간마다 실행
- `0 0 * * *`: 매일 자정
- `*/30 * * * *`: 30분마다

#### 수동 실행 (테스트)

```bash
# 로컬에서 테스트
curl http://localhost:3000/api/cron/process-embeddings \
  -H "Authorization: Bearer ${CRON_SECRET}"

# Vercel에서 수동 실행
curl https://your-domain.com/api/cron/process-embeddings \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

---

### 방법 3: CLI 스크립트 (개발/관리용)

```typescript
// scripts/generate-embeddings.ts

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function main() {
  console.log('🔄 임베딩 생성 시작...\n')
  
  // 임베딩 없는 패턴 조회
  const { data: patterns, error } = await supabase
    .from('conversation_patterns')
    .select('id, pattern_text')
    .is('pattern_embedding', null)
  
  if (error) {
    console.error('❌ 조회 실패:', error)
    process.exit(1)
  }
  
  if (!patterns || patterns.length === 0) {
    console.log('✅ 처리할 패턴이 없습니다.')
    return
  }
  
  console.log(`📝 ${patterns.length}개 패턴 처리 중...\n`)
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    
    try {
      // 임베딩 생성
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: pattern.pattern_text
      })
      
      const embedding = response.data[0].embedding
      
      // 업데이트
      const { error: updateError } = await supabase
        .from('conversation_patterns')
        .update({ pattern_embedding: embedding })
        .eq('id', pattern.id)
      
      if (updateError) throw updateError
      
      console.log(`✅ [${i + 1}/${patterns.length}] ${pattern.id} 완료`)
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ [${i + 1}/${patterns.length}] ${pattern.id} 실패:`, error)
    }
  }
  
  console.log('\n🎉 모든 임베딩 생성 완료!')
}

main()
```

**package.json에 스크립트 추가:**

```json
{
  "scripts": {
    "embeddings:generate": "tsx scripts/generate-embeddings.ts",
    "embeddings:check": "tsx scripts/check-embeddings.ts"
  }
}
```

**실행:**

```bash
# 임베딩 생성
pnpm embeddings:generate

# 상태 확인
pnpm embeddings:check
```

---

## 🎯 사용 시나리오별 권장 방법

### 시나리오 1: 소량 추가 (1-10개)
**방법:** API (방법 1)
```
Admin UI → API 호출 → 즉시 사용 가능
```

### 시나리오 2: 초기 시딩 (100-1000개)
**방법:** SQL + 백그라운드 워커 (방법 2)
```
SQL 파일 실행 → Cron이 6시간 내 처리 → 자동 완료
```

### 시나리오 3: 개발/테스트
**방법:** CLI 스크립트 (방법 3)
```
SQL 삽입 → pnpm embeddings:generate → 즉시 확인
```

---

## 📊 모니터링

### 임베딩 상태 확인 쿼리

```sql
-- 전체 패턴 수
SELECT COUNT(*) as total FROM conversation_patterns;

-- 임베딩 있는 패턴 수
SELECT COUNT(*) as with_embedding 
FROM conversation_patterns 
WHERE pattern_embedding IS NOT NULL;

-- 임베딩 없는 패턴 수
SELECT COUNT(*) as without_embedding 
FROM conversation_patterns 
WHERE pattern_embedding IS NULL;

-- 완료율
SELECT 
  COUNT(*) as total,
  COUNT(pattern_embedding) as completed,
  ROUND(COUNT(pattern_embedding) * 100.0 / COUNT(*), 2) as completion_rate
FROM conversation_patterns;
```

### 대시보드 (선택)

```tsx
// src/app/admin/patterns/page.tsx

export default async function PatternsAdminPage() {
  const supabase = createClient()
  
  const { data: stats } = await supabase
    .from('conversation_patterns')
    .select('pattern_embedding', { count: 'exact' })
  
  const total = stats?.length || 0
  const completed = stats?.filter(s => s.pattern_embedding).length || 0
  const pending = total - completed
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">패턴 관리</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>전체 패턴</CardHeader>
          <CardContent className="text-3xl font-bold">{total}</CardContent>
        </Card>
        <Card>
          <CardHeader>처리 완료</CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {completed}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>처리 대기</CardHeader>
          <CardContent className="text-3xl font-bold text-orange-600">
            {pending}
          </CardContent>
        </Card>
      </div>
      
      <Button asChild>
        <Link href="/admin/patterns/new">새 패턴 추가</Link>
      </Button>
    </div>
  )
}
```

---

## ✅ 권장 설정

### 프로덕션 환경

```typescript
// 1. API 항상 활성화 (즉시 등록용)
// 2. Cron 6시간 주기 (안전망)
// 3. 모니터링 대시보드

// 결과:
// - 수동 추가: 즉시 사용
// - 대량 시딩: 6시간 내 자동 처리
// - 혹시 누락: Cron이 자동 복구
```

### 개발 환경

```typescript
// 1. CLI 스크립트 사용
// 2. 즉시 테스트 가능
// 3. 로컬에서 완전 제어

// 실행:
pnpm embeddings:generate
```

---

**결론**: API 기반 자동화 (방법 1) + Cron 안전망 (방법 2) 조합 권장!