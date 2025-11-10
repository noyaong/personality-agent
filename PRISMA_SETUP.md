# Prisma + Supabase 연결 설정 가이드

> 완료 날짜: 2025-11-10
> Prisma 버전: 6.19.0
> 프로젝트: Personality Agent

## 개요

이 문서는 Prisma ORM과 Supabase PostgreSQL을 연결하는 전체 과정을 설명합니다.

## 핵심 개념

### 하이브리드 DB 접근 전략

```
일반 CRUD   → Prisma (타입 안전성, RLS 우회)
RLS 필요    → Supabase Client (보안)
벡터 검색   → Supabase Client (pgvector)
```

### Prisma 전용 사용자

Supabase에서 Prisma를 사용하려면 **별도의 데이터베이스 사용자**를 생성해야 합니다:

```sql
CREATE USER prisma WITH PASSWORD 'your_password' BYPASSRLS CREATEDB;
```

**왜 필요한가?**
- Prisma는 RLS를 우회하고 직접 데이터베이스에 접근
- `BYPASSRLS` 권한으로 Row Level Security를 무시
- 일반적인 CRUD 작업에 사용

## 설정 단계

### 1. Prisma 설치

```bash
cd app
npm install prisma @prisma/client
```

### 2. Prisma 사용자 생성

Supabase SQL Editor 또는 MCP를 통해 실행:

```sql
-- Prisma 전용 사용자 생성
CREATE USER prisma WITH PASSWORD 'm16a1192176!' BYPASSRLS CREATEDB;

-- 스키마 사용 권한
GRANT USAGE ON SCHEMA public TO prisma;

-- 모든 테이블에 대한 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO prisma;

-- 시퀀스 권한
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO prisma;

-- 향후 생성될 테이블에 대한 기본 권한
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO prisma;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO prisma;
```

### 3. Connection Pooling 이해

Supabase는 3가지 연결 방식을 제공합니다:

| 연결 방식 | 포트 | IPv4/IPv6 | 용도 |
|-----------|------|-----------|------|
| **Direct Connection** | 5432 | IPv6 only | 로컬 개발 불가 |
| **Transaction Pooler** | 6543 | IPv4 ✅ | 앱 쿼리 (권장) |
| **Session Pooler** | 5432 | IPv4 ✅ | 마이그레이션 |

### 4. 환경 변수 설정

`app/.env.local` 파일:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tscptdhwdpedngkpmwlm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Prisma Database URL
# Transaction Pooler (IPv4) - for app queries with prisma user (bypassrls)
DATABASE_URL="postgresql://prisma.tscptdhwdpedngkpmwlm:m16a1192176%21@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session Pooler (IPv4) - for migrations
DIRECT_URL="postgresql://prisma.tscptdhwdpedngkpmwlm:m16a1192176%21@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# OpenAI API (for AI chat functionality)
# OPENAI_API_KEY=your_openai_api_key_here
```

**중요 사항:**
- 사용자 형식: `prisma.PROJECT_REF` (예: `prisma.tscptdhwdpedngkpmwlm`)
- 비밀번호 URL 인코딩: `!` → `%21`
- Region: 프로젝트 리전 확인 (예: `aws-1-ap-southeast-1`)
- Pool Size: 기본 15

### 5. Prisma 스키마 작성

`app/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Profile {
  id        String   @id @db.Uuid
  email     String?
  fullName  String?  @map("full_name")
  // ... 나머지 필드

  @@map("profiles")
}

// ... 다른 모델들
```

**주의사항:**
- `@map()`: snake_case 컬럼명 매핑
- `@@map()`: 테이블명 매핑
- `@db.Uuid`: UUID 타입 명시
- `@db.VarChar(n)`: 문자열 길이 제한

### 6. Prisma Config 설정

`app/prisma.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### 7. Prisma Client 생성

```bash
cd app
cp .env.local .env  # Prisma는 .env 파일을 읽음
npx prisma generate
```

### 8. Prisma Client 사용

`app/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### 9. 연결 테스트

```typescript
import { prisma } from '@/lib/prisma'

async function test() {
  // 연결 테스트
  const result = await prisma.$queryRaw`SELECT current_user, current_database()`
  console.log(result)

  // 데이터 조회
  const profiles = await prisma.profile.findMany()
  console.log(profiles)
}
```

## 문제 해결

### 1. "Tenant or user not found"

**원인**: 잘못된 URL 형식 또는 리전
**해결**:
- 사용자 형식 확인: `prisma.PROJECT_REF`
- 리전 확인: Supabase Dashboard > Settings > Database
- IPv4 지원 Pooler 사용 (6543 또는 5432)

### 2. "There is no user 'prisma'"

**원인**: prisma 사용자가 생성되지 않음
**해결**:
```sql
CREATE USER prisma WITH PASSWORD 'your_password' BYPASSRLS CREATEDB;
```

### 3. "permission denied for table profiles"

**원인**: prisma 사용자 권한 부족
**해결**:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO prisma;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO prisma;
```

### 4. "Client initialization error"

**원인**: Prisma Client가 생성되지 않음
**해결**:
```bash
npx prisma generate
```

### 5. Connection Hangs

**원인**: 잘못된 포트 또는 IPv6 연결 시도
**해결**:
- Direct Connection (db.xxx:5432) 사용 금지
- Transaction Pooler (6543) 또는 Session Pooler (5432) 사용

## 검증 체크리스트

- [x] Prisma 패키지 설치
- [x] `prisma` 사용자 생성 (BYPASSRLS)
- [x] 테이블 권한 부여
- [x] `.env.local` 환경 변수 설정
- [x] `prisma/schema.prisma` 작성
- [x] `prisma.config.ts` 설정
- [x] `npx prisma generate` 실행
- [x] 연결 테스트 성공
- [x] 데이터 조회 성공

## 참고 자료

- [Supabase + Prisma 공식 가이드](https://supabase.com/docs/guides/database/prisma)
- [Prisma Supabase 연결](https://www.prisma.io/docs/orm/overview/databases/supabase)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

## 최종 상태

```
✅ prisma 사용자 생성됨
✅ Connection Pooling 설정 완료
✅ 권한 설정 완료
✅ Prisma Client 생성됨
✅ 연결 테스트 성공
✅ 데이터 조회 가능

현재 상태: profiles=0, persona_profiles=0 (정상)
```

---

**설정 완료일**: 2025-11-10
**담당자**: Claude Code
**다음 단계**: Phase 3 - 페르소나 시스템 구현
