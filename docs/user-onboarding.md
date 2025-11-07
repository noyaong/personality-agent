# 사용자 온보딩 플로우

## 🎯 심리 프로필 입력 전략

### 현실적인 사용자 인식

```
MBTI:        85%+ 알고 있음 ⭐⭐⭐⭐⭐ (필수)
DiSC:        20-30% (기업 교육)  ⭐⭐   (선택)
애니어그램:   10-15% (관심자)    ⭐     (선택)
```

**결정:**
- **MBTI만 필수**, 나머지는 선택
- 나중에 언제든 추가 가능
- 입력할수록 더 정교한 페르소나

---

## 🚀 온보딩 플로우

### Step 1: 소셜 로그인

```tsx
// 화면: /login

Google, GitHub, Discord 중 선택
→ OAuth 인증
→ profiles 테이블 자동 생성
→ Step 2로 이동
```

### Step 2: MBTI 입력 (필수)

```tsx
// 화면: /onboarding/mbti

┌────────────────────────────────────┐
│  환영합니다! 🎉                     │
│                                    │
│  AI 페르소나와 대화하기 위해        │
│  MBTI를 알려주세요                  │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  MBTI 선택                    │ │
│  │  [ISTJ ▼]                    │ │
│  └──────────────────────────────┘ │
│                                    │
│  ❓ MBTI를 모르시나요?             │
│  → [무료 테스트 받기]               │
│                                    │
│  [다음]                            │
└────────────────────────────────────┘
```

**구현:**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

export default function MBTIOnboarding() {
  const [mbti, setMbti] = useState('')
  const router = useRouter()
  const supabase = createClient()
  
  async function handleSubmit() {
    if (!mbti) return
    
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase
      .from('profiles')
      .update({ mbti })
      .eq('id', user.id)
    
    router.push('/onboarding/optional')
  }
  
  return (
    <div className="max-w-md mx-auto mt-20 p-8">
      <h1 className="text-3xl font-bold mb-2">환영합니다! 🎉</h1>
      <p className="text-gray-600 mb-8">
        AI 페르소나와 대화하기 위해<br/>
        MBTI를 알려주세요
      </p>
      
      <Select value={mbti} onValueChange={setMbti}>
        <option value="">MBTI 선택</option>
        {MBTI_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </Select>
      
      <div className="mt-4 text-sm text-gray-500">
        ❓ MBTI를 모르시나요?{' '}
        <a 
          href="https://www.16personalities.com/ko" 
          target="_blank"
          className="text-blue-600 underline"
        >
          무료 테스트 받기
        </a>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={!mbti}
        className="w-full mt-8"
      >
        다음
      </Button>
    </div>
  )
}
```

---

### Step 3: DiSC & 애니어그램 (선택)

```tsx
// 화면: /onboarding/optional

┌────────────────────────────────────┐
│  더 정교한 페르소나를 원하시나요?   │
│                                    │
│  ✨ DiSC를 아시나요?                │
│  □ 예, 알고 있습니다               │
│  ☑ 아니요, 건너뛰기                │
│                                    │
│  [예] 선택 시:                     │
│  ┌──────────────────────────────┐ │
│  │  DiSC 선택                    │ │
│  │  [D ▼] (주 스타일)            │ │
│  │  [I ▼] (부 스타일, 선택)      │ │
│  └──────────────────────────────┘ │
│                                    │
│  ✨ 애니어그램을 아시나요?          │
│  □ 예, 알고 있습니다               │
│  ☑ 아니요, 건너뛰기                │
│                                    │
│  [예] 선택 시:                     │
│  ┌──────────────────────────────┐ │
│  │  [5 ▼] 타입                   │ │
│  │  [w6 ▼] 날개                  │ │
│  └──────────────────────────────┘ │
│                                    │
│  💡 나중에 프로필에서 추가 가능     │
│                                    │
│  [건너뛰기]  [저장하고 시작]       │
└────────────────────────────────────┘
```

**구현:**

```tsx
'use client'

export default function OptionalOnboarding() {
  const [knowsDisc, setKnowsDisc] = useState(false)
  const [knowsEnneagram, setKnowsEnneagram] = useState(false)
  const [disc, setDisc] = useState('')
  const [enneagram, setEnneagram] = useState('')
  
  async function handleSubmit() {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase
      .from('profiles')
      .update({
        disc: knowsDisc ? disc : null,
        enneagram: knowsEnneagram ? enneagram : null
      })
      .eq('id', user.id)
    
    router.push('/dashboard')
  }
  
  return (
    <div className="max-w-md mx-auto mt-20 p-8">
      <h2 className="text-2xl font-bold mb-2">
        더 정교한 페르소나를 원하시나요?
      </h2>
      <p className="text-gray-600 mb-8">
        선택사항이며, 나중에 추가할 수 있습니다
      </p>
      
      {/* DiSC 섹션 */}
      <div className="mb-6">
        <label className="flex items-center space-x-2 mb-2">
          <input 
            type="checkbox"
            checked={knowsDisc}
            onChange={(e) => setKnowsDisc(e.target.checked)}
          />
          <span>✨ DiSC를 알고 있습니다</span>
        </label>
        
        {knowsDisc && (
          <div className="ml-6 space-y-2">
            <Select value={disc} onValueChange={setDisc}>
              <option value="">DiSC 선택</option>
              <option value="D">D (주도형)</option>
              <option value="I">I (사교형)</option>
              <option value="S">S (안정형)</option>
              <option value="C">C (신중형)</option>
            </Select>
            
            <p className="text-xs text-gray-500">
              💡 정확한 DiSC는 공식 테스트가 필요합니다
            </p>
          </div>
        )}
      </div>
      
      {/* 애니어그램 섹션 */}
      <div className="mb-8">
        <label className="flex items-center space-x-2 mb-2">
          <input 
            type="checkbox"
            checked={knowsEnneagram}
            onChange={(e) => setKnowsEnneagram(e.target.checked)}
          />
          <span>✨ 애니어그램을 알고 있습니다</span>
        </label>
        
        {knowsEnneagram && (
          <div className="ml-6">
            <Select value={enneagram} onValueChange={setEnneagram}>
              <option value="">애니어그램 선택</option>
              <option value="1w9">1w9 (평화로운 완벽주의자)</option>
              <option value="1w2">1w2 (옹호하는 완벽주의자)</option>
              {/* ... 18가지 */}
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex-1"
        >
          건너뛰기
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1"
        >
          저장하고 시작
        </Button>
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        💡 나중에 프로필에서 추가할 수 있습니다
      </p>
    </div>
  )
}
```

---

## 🎨 페르소나 생성 플로우

### MBTI만 입력한 경우

```tsx
// 페르소나 생성 폼

┌────────────────────────────────────┐
│  새 페르소나 만들기                 │
│                                    │
│  이름: [___________]               │
│                                    │
│  MBTI: [ISTJ ▼] (필수)            │
│                                    │
│  DiSC: [선택 ▼] (선택)            │
│  💡 입력하면 더 정교한 페르소나     │
│                                    │
│  애니어그램: [선택 ▼] (선택)       │
│  💡 입력하면 더 깊이있는 대화       │
│                                    │
│  ─────────────────────────────────│
│                                    │
│  예상 특성:                        │
│  • 책임감 있는                     │
│  • 체계적인                        │
│  • 신뢰할 수 있는                  │
│                                    │
│  ⚠️ DiSC와 애니어그램을 추가하면   │
│     더 정확한 특성을 생성합니다     │
│                                    │
│  [취소]  [페르소나 생성]           │
└────────────────────────────────────┘
```

**구현:**

```tsx
export default function PersonaForm() {
  const [name, setName] = useState('')
  const [mbti, setMbti] = useState('')
  const [disc, setDisc] = useState<string | null>(null)
  const [enneagram, setEnneagram] = useState<string | null>(null)
  
  // 실시간 특성 미리보기
  const traits = useMemo(() => {
    return generateTraitsPreview(mbti, disc, enneagram)
  }, [mbti, disc, enneagram])
  
  async function handleCreate() {
    const response = await fetch('/api/personas', {
      method: 'POST',
      body: JSON.stringify({
        persona_name: name,
        mbti,
        disc,           // NULL 가능
        enneagram,      // NULL 가능
      })
    })
    
    // 성공 시 대시보드로
    router.push('/dashboard')
  }
  
  return (
    <form>
      <Input 
        placeholder="페르소나 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <Select value={mbti} onValueChange={setMbti} required>
        <option value="">MBTI 선택 (필수)</option>
        {/* 16가지 */}
      </Select>
      
      <Select 
        value={disc || ''} 
        onValueChange={(v) => setDisc(v || null)}
      >
        <option value="">DiSC 선택 (선택)</option>
        <option value="D">D (주도형)</option>
        {/* ... */}
      </Select>
      
      {!disc && (
        <p className="text-sm text-amber-600">
          💡 DiSC를 입력하면 더 정교한 행동 패턴
        </p>
      )}
      
      <Select 
        value={enneagram || ''} 
        onValueChange={(v) => setEnneagram(v || null)}
      >
        <option value="">애니어그램 선택 (선택)</option>
        {/* 18가지 */}
      </Select>
      
      {!enneagram && (
        <p className="text-sm text-amber-600">
          💡 애니어그램을 입력하면 더 깊이있는 동기 이해
        </p>
      )}
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">예상 특성:</h3>
        <ul className="space-y-1">
          {traits.map(trait => (
            <li key={trait}>• {trait}</li>
          ))}
        </ul>
        
        {(!disc || !enneagram) && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ DiSC와 애니어그램을 추가하면 더 정확한 특성 생성
          </p>
        )}
      </div>
      
      <Button onClick={handleCreate} disabled={!mbti}>
        페르소나 생성
      </Button>
    </form>
  )
}
```

---

## 🔄 프로필 업데이트 (나중에 추가)

### 프로필 페이지

```tsx
// /profile

┌────────────────────────────────────┐
│  내 프로필                          │
│                                    │
│  MBTI: ISTJ                        │
│  [수정]                            │
│                                    │
│  DiSC: 미입력                      │
│  [추가하기] ← 클릭 시 입력 폼      │
│                                    │
│  애니어그램: 미입력                 │
│  [추가하기] ← 클릭 시 입력 폼      │
│                                    │
│  💡 DiSC와 애니어그램을 추가하면    │
│     더 정교한 페르소나를 만들 수     │
│     있습니다                        │
└────────────────────────────────────┘
```

---

## 📊 데이터 현황 안내

### 대시보드에서 안내

```tsx
// 사용자가 MBTI만 입력한 경우

┌────────────────────────────────────┐
│  페르소나 3개                       │
│                                    │
│  💡 프로필 완성도: 33%              │
│                                    │
│  DiSC와 애니어그램을 추가하면       │
│  더 정교한 페르소나를 만들 수       │
│  있습니다                           │
│                                    │
│  [프로필 완성하기]                  │
└────────────────────────────────────┘
```

---

## ✅ 요약

### 필수 vs 선택

| 항목 | profiles (사용자) | persona_profiles (AI) |
|------|------------------|-----------------------|
| **MBTI** | 선택 (권장) | **필수** ✅ |
| **DiSC** | 선택 | 선택 (더 정교) |
| **애니어그램** | 선택 | 선택 (더 깊이) |

### 진입 장벽 최소화

```
Level 1: MBTI만 → 기본 페르소나 가능 ✅
Level 2: MBTI + DiSC → 더 정교한 행동 패턴
Level 3: MBTI + DiSC + 애니어그램 → 완전체
```

### 계층적 폴백 자동 지원

```typescript
// 사용자가 MBTI만 입력해도
// 시스템이 알아서 최선의 패턴 찾기

ISTJ만 → Level 1 패턴 활용
ISTJ + DiSC → Level 2 패턴 활용  
ISTJ + DiSC + 애니어그램 → Level 4 완전체
```

---

**핵심**: MBTI만 알아도 바로 시작 가능, 점진적으로 개선! 🚀