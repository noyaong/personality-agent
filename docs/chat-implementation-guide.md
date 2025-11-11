# 채팅 시스템 구현 가이드

> 실시간 스트리밍 채팅 + 메시지 저장 + React 클로저 문제 해결

## 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [핵심 기술 스택](#핵심-기술-스택)
3. [React 클로저 문제와 해결](#react-클로저-문제와-해결)
4. [메시지 저장 아키텍처](#메시지-저장-아키텍처)
5. [스크롤 동작 최적화](#스크롤-동작-최적화)
6. [한글 입력(IME) 처리](#한글-입력ime-처리)
7. [트러블슈팅](#트러블슈팅)

---

## 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────┐
│                     Chat Page (Client)                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  useChat Hook (Vercel AI SDK)                      │  │
│  │  - messages: UIMessage[]                           │  │
│  │  - status: 'streaming' | 'awaiting-message'        │  │
│  │  - sendMessage()                                    │  │
│  │  - setMessages()                                    │  │
│  │  - onFinish callback                               │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                               │
│                           ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  sessionIdRef (useRef)                             │  │
│  │  - 클로저 문제 해결을 위한 가변 참조                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
                           │ HTTP POST
                           ▼
┌──────────────────────────────────────────────────────────┐
│              /api/chat (Server - Edge Runtime)            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  streamText (Vercel AI SDK)                        │  │
│  │  - model: openai('gpt-4o')                         │  │
│  │  - system: personaPrompt                           │  │
│  │  - messages: convertToModelMessages(messages)      │  │
│  │  - temperature: 0.7                                │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                               │
│                           ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  toUIMessageStreamResponse()                       │  │
│  │  - Server-Sent Events (SSE) 스트리밍               │  │
│  │  - Events: text-start, text-delta, finish          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
                           │ SSE Stream
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  onFinish Callback                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. result.message.parts에서 텍스트 추출           │  │
│  │  2. sessionIdRef.current로 sessionId 확인          │  │
│  │  3. POST /api/chat/messages로 DB 저장              │  │
│  │  4. inputRef.current?.focus() 입력창 포커스         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           │
                           │ HTTP POST
                           ▼
┌──────────────────────────────────────────────────────────┐
│         /api/chat/messages (Server - Node Runtime)        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Supabase Insert                                   │  │
│  │  - Table: chat_messages                            │  │
│  │  - Fields: session_id, role, content               │  │
│  │  - Auth: RLS 정책으로 세션 소유권 확인              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 핵심 기술 스택

### Frontend
- **Next.js 16**: App Router, React 19, Turbopack
- **Vercel AI SDK** (`@ai-sdk/react@2.0.92`):
  - `useChat` hook: 채팅 상태 관리
  - `DefaultChatTransport`: HTTP 통신
  - `UIMessage` 타입: `parts` 배열 기반 메시지 구조
- **React Hooks**:
  - `useState`: 컴포넌트 상태 관리
  - `useRef`: 클로저 문제 해결 + DOM 참조
  - `useEffect`: 스크롤 동작, 데이터 로딩

### Backend
- **Vercel AI SDK** (`ai@5.0.92`):
  - `streamText`: OpenAI 스트리밍 응답 생성
  - `convertToModelMessages`: UIMessage → ModelMessage 변환
  - `toUIMessageStreamResponse`: SSE 스트리밍 응답
- **OpenAI** (`@ai-sdk/openai@2.0.65`):
  - Model: `gpt-4o`
  - Streaming: Server-Sent Events
- **Supabase**:
  - PostgreSQL: 메시지 저장
  - Auth: RLS 정책으로 보안
  - Real-time: 향후 확장 가능

---

## React 클로저 문제와 해결

### 문제 상황

```typescript
// ❌ 잘못된 구현
const [sessionId, setSessionId] = useState<string | null>(null);

const chat = useChat({
  onFinish: async (result) => {
    // 🐛 sessionId는 useChat 초기화 시점의 값(null)을 참조
    if (sessionId && result.message.role === 'assistant') {
      await saveMessage(sessionId, result.message.content);
    }
  }
});

useEffect(() => {
  // 나중에 sessionId가 설정되어도
  setSessionId('actual-session-id');
  // onFinish 콜백은 여전히 null을 참조함
}, []);
```

### 문제 원인
1. `useChat` hook은 컴포넌트 마운트 시 **한 번만 초기화**됨
2. `onFinish` 콜백은 초기화 시점의 `sessionId` 값을 **클로저로 캡처**
3. 이후 `setSessionId`로 상태를 업데이트해도, 콜백은 **캡처된 값(null)을 계속 참조**

### 해결 방법: useRef 사용

```typescript
// ✅ 올바른 구현
const [sessionId, setSessionId] = useState<string | null>(null);
const sessionIdRef = useRef<string | null>(null); // 가변 참조 추가

const chat = useChat({
  onFinish: async (result) => {
    // ✅ sessionIdRef.current는 항상 최신 값을 참조
    if (sessionIdRef.current && result.message.role === 'assistant') {
      await saveMessage(sessionIdRef.current, result.message.content);
    }
  }
});

useEffect(() => {
  const loadSession = async () => {
    const newSessionId = await fetchSessionId();

    // 상태와 ref를 함께 업데이트
    setSessionId(newSessionId);
    sessionIdRef.current = newSessionId; // ✅ ref도 업데이트
  };

  loadSession();
}, []);
```

### 핵심 원리
- **`useState`**: React 리렌더링을 트리거하는 상태 (UI 표시용)
- **`useRef`**: 리렌더링 없이 값을 저장하는 가변 참조 (콜백 내부 참조용)
- **`useRef.current`**: 항상 최신 값을 가리키는 포인터 역할

### 실제 코드 위치
[project/app/(protected)/chat/page.tsx:27, 196, 52](../project/app/(protected)/chat/page.tsx#L27)

```typescript
// Line 27: ref 선언
const sessionIdRef = useRef<string | null>(null);

// Line 196: ref 업데이트
setSessionId(currentSessionId || null);
sessionIdRef.current = currentSessionId || null;

// Line 52: ref 사용
if (sessionIdRef.current && result.message.role === 'assistant') {
  // ...
}
```

---

## 메시지 저장 아키텍처

### UIMessage 구조

Vercel AI SDK의 UIMessage는 `parts` 배열 기반 구조:

```typescript
interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

interface MessagePart {
  type: 'text' | 'image' | 'tool-call' | 'tool-result';
  text?: string;      // type === 'text'일 때만
  // ... 기타 필드
}
```

### onFinish 콜백에서 메시지 추출

```typescript
onFinish: async (result) => {
  console.log('🚨 onFinish TRIGGERED!');

  if (sessionIdRef.current && result.message.role === 'assistant') {
    try {
      let content = '';

      // 1. parts 배열에서 텍스트 추출
      if (result.message.parts && Array.isArray(result.message.parts)) {
        const textParts = result.message.parts.filter((p: any) => p.type === 'text');

        if (textParts.length === 0) {
          console.warn('⚠️ No text parts found in assistant message');
          return;
        }

        // 2. 모든 text parts를 합침
        content = textParts.map((p: any) => p.text).join('');

        console.log('✅ Extracted text from parts:', {
          partsCount: textParts.length,
          contentLength: content.length,
        });
      } else {
        console.error('❌ No parts array in message');
        return;
      }

      // 3. 빈 내용 체크
      if (!content.trim()) {
        console.warn('⚠️ Empty assistant message, skipping save');
        return;
      }

      // 4. DB에 저장
      console.log('💾 Attempting to save assistant message to DB...');
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          role: 'assistant',
          content,
        }),
      });

      if (!response.ok) {
        console.error('❌ Failed to save assistant message');
      } else {
        console.log('✅ Assistant message saved successfully');
      }
    } catch (error) {
      console.error('❌ Exception while saving assistant message:', error);
    }
  }
}
```

### 사용자 메시지 저장

사용자 메시지는 `handleSubmit`에서 즉시 저장:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // IME 조합 중인지 확인
  if ((e.nativeEvent as any).isComposing) {
    return;
  }

  const form = e.currentTarget;
  const formData = new FormData(form);
  const userMessage = formData.get('message') as string;

  if (!userMessage?.trim() || chat.status === 'streaming') return;

  // 폼을 먼저 초기화 (비동기 작업 전에)
  form.reset();

  // 사용자 메시지 DB에 저장
  if (sessionId) {
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          role: 'user',
          content: userMessage,
        }),
      });
    } catch (error) {
      console.error('Failed to save user message:', error);
    }
  }

  // sendMessage로 메시지 전송
  await chat.sendMessage({
    text: userMessage,
  }, {
    body: { personaId },
  });
};
```

### 메시지 히스토리 로딩

```typescript
useEffect(() => {
  const loadPersonaAndSession = async () => {
    // ... persona 로딩

    // 세션의 기존 메시지 로드
    if (currentSessionId) {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });

      if (messages && messages.length > 0) {
        // UIMessage 형식으로 변환
        const uiMessages = messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          parts: [{ type: 'text' as const, text: msg.content }],
        })) as any[];

        // ✅ setMessages로 메시지 설정 (splice 사용 금지!)
        chat.setMessages(uiMessages);
      }
    }
  };

  loadPersonaAndSession();
}, [personaId, router]);
```

---

## 스크롤 동작 최적화

### 요구사항
- **스트리밍 중**: 새로운 텍스트가 추가될 때마다 즉시 스크롤 (끊김 없이)
- **스트리밍 완료 후**: 부드러운 스크롤 애니메이션

### 구현

```typescript
const scrollToBottom = (smooth = true) => {
  messagesEndRef.current?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'end'
  });
};

// 메시지가 추가될 때마다 스크롤
useEffect(() => {
  // 스트리밍 중이거나 메시지가 있을 때 스크롤
  if (chat.messages.length > 0) {
    const isStreaming = chat.status === 'streaming';
    scrollToBottom(!isStreaming); // 스트리밍 중에는 즉시, 완료 후에는 부드럽게
  }
}, [chat.messages.length, chat.status]);
```

### 핵심 포인트
1. **의존성**: `chat.messages.length`와 `chat.status` 모두 감지
2. **스트리밍 중** (`status === 'streaming'`): `smooth: false` → 즉시 스크롤
3. **완료 후** (`status === 'awaiting-message'`): `smooth: true` → 부드러운 애니메이션
4. **스크롤 타겟**: 빈 `<div ref={messagesEndRef} />` 요소를 메시지 리스트 끝에 배치

### 실제 코드 위치
[project/app/(protected)/chat/page.tsx:124-138, 390](../project/app/(protected)/chat/page.tsx#L124-L138)

---

## 한글 입력(IME) 처리

### 문제 상황
- 한글, 일본어, 중국어는 **IME(Input Method Editor)**를 사용
- IME는 여러 키 입력을 **조합**하여 하나의 문자를 만듦
- 조합 중에 Enter 키를 누르면 **두 번 이벤트가 발생**:
  1. IME 조합 완료 이벤트 (조합 중인 텍스트를 확정)
  2. Form submit 이벤트

### 해결 방법

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // ✅ IME 조합 중인지 확인 (한글, 일본어, 중국어 입력 중)
  if ((e.nativeEvent as any).isComposing) {
    return; // 조합 중이면 전송하지 않음
  }

  // ... 나머지 전송 로직
};
```

### 동작 원리
1. 사용자가 한글 입력 중 (예: "ㅎ" + "ㅏ" + "ㄴ" → "한")
2. Enter 키 누름
3. `isComposing === true`: 조합 완료 이벤트 → **무시**
4. `isComposing === false`: 실제 submit 이벤트 → **전송**

### 실제 코드 위치
[project/app/(protected)/chat/page.tsx:232-235](../project/app/(protected)/chat/page.tsx#L232-L235)

---

## 트러블슈팅

### 1. Assistant 메시지가 저장되지 않음

**증상**:
- User 메시지는 저장됨
- Assistant 메시지는 화면에 표시되지만 DB에 저장 안 됨
- 페이지 새로고침 시 Assistant 메시지만 사라짐

**원인**:
- React 클로저 문제로 `onFinish` 콜백이 `null` sessionId를 참조

**해결**:
```typescript
const sessionIdRef = useRef<string | null>(null);

// ref 업데이트
setSessionId(newSessionId);
sessionIdRef.current = newSessionId;

// onFinish에서 ref 사용
if (sessionIdRef.current && result.message.role === 'assistant') {
  // ...
}
```

**디버깅 팁**:
```typescript
console.log('🔍 Session check:', {
  hasSessionId: !!sessionIdRef.current,
  sessionId: sessionIdRef.current,
  isAssistant: result.message.role === 'assistant',
  willSave: sessionIdRef.current && result.message.role === 'assistant',
});
```

### 2. 메시지 히스토리가 로딩되지 않음

**증상**:
- 페이지 재진입 시 메시지가 보이지 않음
- 콘솔에 에러는 없음

**원인**:
- `chat.messages.splice()` 사용 시 React 상태 업데이트 감지 안 됨

**해결**:
```typescript
// ❌ 잘못된 방법
chat.messages.splice(0, chat.messages.length, ...uiMessages);

// ✅ 올바른 방법
chat.setMessages(uiMessages);
```

### 3. 한글 입력 시 중복 전송

**증상**:
- 한글 입력 후 Enter 누르면 메시지가 두 번 전송됨

**원인**:
- IME 조합 완료 이벤트와 submit 이벤트가 모두 발생

**해결**:
```typescript
if ((e.nativeEvent as any).isComposing) {
  return;
}
```

### 4. 스크롤이 부자연스러움

**증상**:
- 스트리밍 중 스크롤이 끊기거나 튐
- 완료 후 갑자기 스크롤됨

**원인**:
- 스트리밍 중과 완료 후에 같은 스크롤 동작 사용

**해결**:
```typescript
const isStreaming = chat.status === 'streaming';
scrollToBottom(!isStreaming); // 스트리밍 중에는 즉시, 완료 후에는 부드럽게
```

### 5. Input 포커스가 안 됨

**증상**:
- 메시지 전송 후 입력창에 포커스가 돌아오지 않음

**원인**:
- Input 컴포넌트를 참조할 ref가 없음

**해결**:
```typescript
const inputRef = useRef<HTMLInputElement>(null);

<Input
  ref={inputRef}
  // ...
/>

// onFinish에서
setTimeout(() => {
  inputRef.current?.focus();
}, 100);
```

---

## 참고 자료

### Vercel AI SDK
- [useChat Hook 공식 문서](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)
- [Streaming 가이드](https://sdk.vercel.ai/docs/guides/streaming)
- [UIMessage 타입](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/types#uimessage)

### React Hooks
- [useRef 공식 문서](https://react.dev/reference/react/useRef)
- [Closures in React](https://react.dev/learn/state-as-a-snapshot#closures)

### IME 처리
- [MDN: CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)
- [Handling IME in React](https://github.com/facebook/react/issues/3926)

---

**마지막 업데이트**: 2025-11-11
**작성자**: Claude Code
**관련 파일**:
- [project/app/(protected)/chat/page.tsx](../project/app/(protected)/chat/page.tsx)
- [project/app/api/chat/route.ts](../project/app/api/chat/route.ts)
- [project/app/api/chat/messages/route.ts](../project/app/api/chat/messages/route.ts)
