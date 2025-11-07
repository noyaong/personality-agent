# 환경 설정 가이드

## 🚀 Prerequisites

### 필수 소프트웨어
```bash
# Node.js 24 LTS
node --version  # v24.x.x

# pnpm (권장)
npm install -g pnpm
pnpm --version  # 9.x.x

# Git
git --version
```

---

## 📦 프로젝트 초기화

### 1. Next.js 16 프로젝트 생성

```bash
# Next.js 16 최신 버전으로 생성
npx create-next-app@16 persona-agent \
  --typescript \
  --tailwind \
  --app \
  --eslint

cd persona-agent

# pnpm으로 전환 (선택)
pnpm install
```

### 2. 핵심 패키지 설치

```bash
# Supabase 클라이언트
pnpm add @supabase/supabase-js @supabase/ssr

# AI/ML
pnpm add ai openai

# UI 컴포넌트
pnpm add lucide-react react-icons

# 유틸리티
pnpm add class-variance-authority clsx tailwind-merge

# 개발 도구
pnpm add -D @types/node typescript
```

### 3. shadcn/ui 초기화

```bash
# shadcn/ui 초기 설정
pnpm dlx shadcn@latest init

# 프롬프트에서 다음 선택:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
```

### 4. shadcn/ui 컴포넌트 설치

```bash
# 필수 컴포넌트 일괄 설치
pnpm dlx shadcn@latest add button card input select avatar badge dialog separator scroll-area textarea

# 추가 컴포넌트 (필요 시)
pnpm dlx shadcn@latest add dropdown-menu popover toast
```

---

## 🗄 Supabase 설정

### 1. Supabase 프로젝트 생성

1. https://app.supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `persona-agent`
   - Database Password: 안전한 비밀번호 생성
   - Region: 가까운 지역 선택 (e.g., Northeast Asia)

### 2. Database 설정

```sql
-- Supabase SQL Editor에서 실행
-- 📄 database/schema.sql 파일 전체 복사 후 실행
```

### 3. 소셜 로그인 설정

#### Google OAuth
```
1. Supabase Dashboard → Authentication → Providers
2. Google 활성화
3. Redirect URL 추가:
   - Development: http://localhost:3000/auth/callback
   - Production: https://yourdomain.com/auth/callback
```

#### GitHub OAuth
```
1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App 생성
3. Supabase에 Client ID/Secret 등록
```

### 4. API Keys 확인

```
Supabase Dashboard → Settings → API
- Project URL 복사
- anon public key 복사
- service_role key 복사 (주의: 서버 전용)
```

---

## 🔐 환경 변수 설정

### 1. `.env.local` 생성

```bash
# 프로젝트 루트에 .env.local 생성
touch .env.local
```

### 2. 환경 변수 입력

```bash
# ============================================================================
# Supabase
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (anon public key)

# 서버 전용 (절대 클라이언트 노출 금지)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role key)

# ============================================================================
# OpenAI
# ============================================================================
OPENAI_API_KEY=sk-...

# 모델 설정
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# ============================================================================
# Application
# ============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. `.env.example` 생성 (Git용)

```bash
# .env.example (비밀 정보 제거)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛠 Next.js 설정

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 실험적 기능
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true, // React Compiler
  },
  
  // 이미지 최적화
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google 아바타
      'avatars.githubusercontent.com', // GitHub 아바타
      'cdn.discordapp.com' // Discord 아바타
    ],
  },
  
  // 환경 변수 (선택)
  env: {
    NEXT_PUBLIC_APP_NAME: 'Persona Agent',
  },
}

module.exports = nextConfig
```

---

## 🎨 Tailwind CSS 설정

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // 다크 모드
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // shadcn/ui 색상 시스템
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 📁 프로젝트 구조 생성

```bash
# 디렉토리 생성
mkdir -p src/{app,components,lib,types}
mkdir -p src/app/{api,\(auth\),\(dashboard\)}
mkdir -p src/components/{ui,auth,chat,personas}
mkdir -p src/lib/{supabase,ai,personas,utils}

# TypeScript 설정 확인
cat tsconfig.json
```

---

## 🔧 개발 도구 설정

### ESLint 설정 (`.eslintrc.json`)

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Prettier 설정 (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 🚀 Vercel 배포 설정

### `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "framework": "nextjs",
  "nodeVersion": "24.x",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### Vercel 환경 변수 추가

```bash
# Vercel CLI로 환경 변수 추가
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
```

---

## 📊 Supabase 타입 생성

### Supabase CLI 설치

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login
```

### TypeScript 타입 자동 생성

```bash
# 타입 생성 명령어
supabase gen types typescript \
  --project-id [PROJECT_ID] \
  > src/lib/supabase/database.types.ts

# 또는 package.json에 스크립트 추가
# "types:supabase": "supabase gen types typescript --project-id [PROJECT_ID] > src/lib/supabase/database.types.ts"
```

---

## ✅ 설치 확인

### 1. 개발 서버 실행

```bash
pnpm dev
```

### 2. 브라우저 확인

```
http://localhost:3000
```

### 3. Supabase 연결 테스트

```typescript
// src/app/page.tsx (임시 테스트)
import { createClient } from '@/lib/supabase/client'

export default async function Home() {
  const supabase = createClient()
  const { data, error } = await supabase.from('profiles').select('*')
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

---

## 🆘 트러블슈팅

### Node.js 24 설치

```bash
# nvm 사용
nvm install 24
nvm use 24
```

### pnpm 캐시 문제

```bash
pnpm store prune
pnpm install --force
```

### Supabase 연결 오류

```bash
# 환경 변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL

# .env.local 파일 권한 확인
ls -la .env.local
```

### shadcn/ui 설치 오류

```bash
# components.json 재생성
rm components.json
pnpm dlx shadcn@latest init
```

---

## 📚 참고 자료

- **Next.js 16 Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **OpenAI API**: https://platform.openai.com/docs

---

**다음 단계**: `database/schema.sql`로 데이터베이스 구축