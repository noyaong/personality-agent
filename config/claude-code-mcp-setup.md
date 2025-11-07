# Claude Code 환경에서 Supabase MCP 설정

## 🎯 상황 이해

**문제**:
- Supabase 프로젝트는 이미 생성되어 있음 ✅
- 작업 환경이 분산되어 있음 (여러 기기/계정)
- Claude Code 세션마다 MCP 설정이 필요

**해결책**:
Claude Code는 **현재 실행 중인 Claude Desktop의 MCP 설정을 사용**합니다.

---

## 🔧 Claude Code에서 MCP 설정하는 방법

### 방법 1: Claude Desktop 설정 파일 직접 수정 (권장)

Claude Code가 실행되는 **현재 기기의 Claude Desktop 설정**을 수정해야 합니다.

#### Step 1: 설정 파일 위치 확인

```bash
# MacOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Windows
%APPDATA%\Claude\claude_desktop_config.json

# Linux
~/.config/Claude/claude_desktop_config.json
```

#### Step 2: 설정 파일 생성/수정

Claude Code에서 직접 실행:

```bash
# MacOS - 설정 파일 열기
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 또는 터미널 편집기 사용
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Step 3: Supabase MCP 추가

**새 파일인 경우**:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://YOUR_PROJECT_ID.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

**기존 설정이 있는 경우** (GitHub MCP 등):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://YOUR_PROJECT_ID.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

#### Step 4: Claude Desktop 재시작

```bash
# MacOS
# Cmd + Q로 Claude Desktop 종료 후 재시작

# 또는 터미널에서
osascript -e 'quit app "Claude"'
open -a Claude
```

---

### 방법 2: 프로젝트별 .env 파일 관리 (보조)

MCP는 Claude Desktop 레벨이지만, 프로젝트별로 환경 변수를 관리할 수 있습니다.

#### `.env.local` 생성

```bash
# 프로젝트 루트에 생성
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-...
EOF
```

#### `.gitignore` 업데이트

```bash
# .env 파일이 Git에 커밋되지 않도록
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
```

---

### 방법 3: 설정 동기화 스크립트 (여러 기기 사용 시)

여러 기기에서 작업하는 경우, 설정을 쉽게 복사할 수 있습니다.

#### `setup-mcp.sh` 스크립트 생성

```bash
#!/bin/bash
# setup-mcp.sh - Claude Desktop MCP 설정 자동화

CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Supabase 정보 입력
read -p "Supabase Project URL: " SUPABASE_URL
read -p "Supabase Service Role Key: " SUPABASE_KEY

# 설정 파일 백업
if [ -f "$CONFIG_FILE" ]; then
  cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
  echo "✅ 기존 설정 백업: $CONFIG_FILE.backup"
fi

# MCP 설정 작성
cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "$SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY": "$SUPABASE_KEY"
      }
    }
  }
}
EOF

echo "✅ MCP 설정 완료!"
echo "⚠️  Claude Desktop을 재시작해주세요."
```

#### 실행 방법

```bash
chmod +x setup-mcp.sh
./setup-mcp.sh
```

---

## 🔍 설정 확인

### 1. 설정 파일 확인

```bash
# MacOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 올바른 형식인지 JSON 검증
python3 -m json.tool ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**예상 출력**:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://xxxxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGci..."
      }
    }
  }
}
```

### 2. MCP 연결 테스트

Claude Code에서 실행:

```
Supabase MCP가 연결되어 있나요?
```

**성공 시 응답**:
```
✅ Supabase MCP 서버가 연결되어 있습니다.
프로젝트: https://xxxxx.supabase.co
```

### 3. 데이터베이스 접근 테스트

```
Supabase에서 현재 데이터베이스 이름을 확인해주세요:
SELECT current_database();
```

**성공 시 응답**:
```sql
current_database
------------------
postgres
```

---

## 🔄 여러 환경에서 작업하는 경우

### 시나리오: 집/회사/노트북 등 여러 기기

#### 옵션 A: 각 기기마다 설정 (권장)

각 기기의 Claude Desktop에 MCP 설정을 개별적으로 추가합니다.

**장점**:
- ✅ 환경 독립적
- ✅ 보안 키가 각 기기에만 저장
- ✅ 다른 기기 영향 없음

**단점**:
- ❌ 초기 설정 반복 필요

#### 옵션 B: 설정 파일 동기화 (비권장)

클라우드 스토리지를 통한 설정 파일 동기화

**⚠️ 보안 위험**: API 키가 클라우드에 노출됨!

```bash
# 예시 (권장하지 않음)
# Dropbox/Google Drive에 설정 저장
ln -s ~/Dropbox/claude-config.json \
  ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### 옵션 C: 프로젝트별 .env 파일 사용 (절충안)

MCP는 한 번만 설정하고, 프로젝트별로 `.env.local` 관리

```bash
# 각 프로젝트에 .env.local 생성
# Git에는 .env.example만 커밋

# .env.example (템플릿)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key

# .env.local (실제 값, .gitignore에 추가)
NEXT_PUBLIC_SUPABASE_URL=https://abcdef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-proj-...
```

---

## 📦 완전 자동화 스크립트

### `init-personality-project.sh`

```bash
#!/bin/bash
# init-personality-project.sh
# 새 환경에서 프로젝트 초기 설정 자동화

echo "🎯 Personality Agent 프로젝트 초기화"
echo ""

# 1. Git clone (이미 있으면 스킵)
if [ ! -d "personality" ]; then
  echo "📦 레포지토리 클론..."
  git clone https://github.com/YOUR_USERNAME/personality.git
  cd personality
else
  cd personality
  echo "✅ 프로젝트 디렉토리 존재"
fi

# 2. 환경 변수 설정
echo ""
echo "🔑 환경 변수 설정"
if [ ! -f ".env.local" ]; then
  read -p "Supabase URL: " SUPABASE_URL
  read -p "Supabase Anon Key: " ANON_KEY
  read -sp "Supabase Service Role Key: " SERVICE_KEY
  echo ""
  read -sp "OpenAI API Key: " OPENAI_KEY
  echo ""

  cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
OPENAI_API_KEY=$OPENAI_KEY
EOF

  echo "✅ .env.local 생성 완료"
else
  echo "✅ .env.local 이미 존재"
fi

# 3. Claude Desktop MCP 설정
echo ""
echo "🔧 Claude Desktop MCP 설정"
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  mkdir -p "$(dirname "$CONFIG_FILE")"

  cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "$SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY": "$SERVICE_KEY"
      }
    }
  }
}
EOF

  echo "✅ MCP 설정 완료"
  echo "⚠️  Claude Desktop을 재시작해주세요!"
else
  echo "⚠️  MCP 설정 파일이 이미 존재합니다."
  echo "   수동으로 Supabase MCP를 추가해주세요."
fi

# 4. 의존성 설치 (Next.js 프로젝트가 있는 경우)
if [ -f "package.json" ]; then
  echo ""
  echo "📦 npm 패키지 설치..."
  npm install
  echo "✅ 패키지 설치 완료"
fi

echo ""
echo "✨ 초기화 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. Claude Desktop 재시작"
echo "2. Claude Code에서 'Supabase MCP가 연결되어 있나요?' 확인"
echo "3. npm run dev로 개발 서버 시작"
```

#### 사용 방법

```bash
# 스크립트 다운로드
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/personality/main/scripts/init-personality-project.sh

# 실행 권한 부여
chmod +x init-personality-project.sh

# 실행
./init-personality-project.sh
```

---

## 🎯 실제 작업 플로우

### 새 기기에서 작업 시작할 때

```bash
# 1. 스크립트 실행
./init-personality-project.sh

# 2. Claude Desktop 재시작

# 3. Claude Code에서 확인
"Supabase MCP가 연결되어 있나요?"

# 4. 작업 시작!
```

---

## ✅ 현재 해야 할 작업

지금 바로 Claude Code에서 실행해보세요:

### 1단계: 설정 파일 확인

```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 2단계: 설정 파일이 없거나 Supabase MCP가 없다면

저에게 다음 정보를 알려주세요:
- Supabase Project URL (https://xxxxx.supabase.co)
- Supabase Service Role Key (Settings → API에서 복사)

제가 정확한 설정 파일 내용을 만들어드리겠습니다!

### 3단계: 설정 후 테스트

```
Supabase MCP가 연결되어 있나요?
```

---

**준비되셨으면 알려주세요! 함께 설정을 완료하고 schema.sql을 실행하겠습니다.** 🚀
