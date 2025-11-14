'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personaId = searchParams.get('personaId');

  const [persona, setPersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<'superior' | 'peer' | 'subordinate'>('peer');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // sessionId를 ref로도 저장 (클로저 문제 해결)
  const sessionIdRef = useRef<string | null>(null);

  // useChat hook으로 대화 관리 - DefaultChatTransport 사용
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: async (result) => {
      console.log('🚨🚨🚨 onFinish TRIGGERED! 🚨🚨🚨');
      console.log('🔔 onFinish called:', {
        role: result.message.role,
        messageId: result.message.id,
        hasParts: !!result.message.parts,
        partsCount: result.message.parts?.length,
        messageStructure: JSON.stringify(result.message, null, 2),
      });

      console.log('🔍 Session check:', {
        hasSessionId: !!sessionIdRef.current,
        sessionId: sessionIdRef.current,
        isAssistant: result.message.role === 'assistant',
        willSave: sessionIdRef.current && result.message.role === 'assistant',
      });

      // AI 응답이 완료되면 DB에 저장
      if (sessionIdRef.current && result.message.role === 'assistant') {
        try {
          let content = '';

          // parts 배열에서 텍스트 추출
          if (result.message.parts && Array.isArray(result.message.parts)) {
            const textParts = result.message.parts.filter((p: any) => p.type === 'text');

            if (textParts.length === 0) {
              console.warn('⚠️ No text parts found in assistant message');
              console.warn('Parts structure:', result.message.parts);
              return;
            }

            content = textParts.map((p: any) => p.text).join('');
            console.log('✅ Extracted text from parts:', {
              partsCount: textParts.length,
              contentLength: content.length,
              contentPreview: content.substring(0, 100) + '...',
            });
          } else {
            console.error('❌ No parts array in message:', result.message);
            return;
          }

          // 빈 내용이면 저장하지 않음
          if (!content.trim()) {
            console.warn('⚠️ Empty assistant message, skipping save');
            return;
          }

          console.log('💾 Attempting to save assistant message to DB...', {
            sessionId: sessionIdRef.current,
            contentLength: content.length,
          });

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
            const errorText = await response.text();
            console.error('❌ Failed to save assistant message:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText,
            });
          } else {
            const savedData = await response.json();
            console.log('✅ Assistant message saved successfully:', savedData);
          }
        } catch (error) {
          console.error('❌ Exception while saving assistant message:', error);
        }
      }

      // 응답 완료 후 입력창에 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

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

  useEffect(() => {
    if (!personaId) {
      router.push('/personas');
      return;
    }

    const loadPersonaAndSession = async () => {
      try {
        const supabase = createClient();

        // 0. 사용자 정보 가져오기
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error('Authentication error:', authError);
          router.push('/login');
          return;
        }

        // 1. 페르소나 정보 로드
        const { data: personaData, error: personaError } = await supabase
          .from('persona_profiles')
          .select('*')
          .eq('id', personaId)
          .single();

        if (personaError || !personaData) {
          console.error('Failed to load persona:', personaError);
          router.push('/personas');
          return;
        }

        setPersona(personaData);

        // 2. 기존 세션 조회 또는 생성
        const { data: sessions } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('persona_profile_id', personaId)
          .eq('session_status', 'active')
          .order('started_at', { ascending: false })
          .limit(1);

        let currentSessionId = sessions?.[0]?.id;

        // 세션이 없으면 새로 생성
        if (!currentSessionId) {
          const { data: newSession, error: sessionError } = await supabase
            .from('chat_sessions')
            .insert({
              user_id: user.id,
              persona_profile_id: personaId,
              relationship_type: relationshipType,
              session_status: 'active',
            })
            .select()
            .single();

          if (sessionError) {
            console.error('Failed to create session:', sessionError);
          } else {
            currentSessionId = newSession.id;
          }
        } else {
          // 기존 세션의 relationship_type 가져오기
          const existingSession = sessions?.[0];
          if (existingSession?.relationship_type) {
            setRelationshipType(existingSession.relationship_type as 'superior' | 'peer' | 'subordinate');
          }
        }

        setSessionId(currentSessionId || null);
        sessionIdRef.current = currentSessionId || null;

        // 3. 세션의 기존 메시지 로드
        if (currentSessionId) {
          setMessagesLoading(true);

          const { data: messages } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', currentSessionId)
            .order('created_at', { ascending: true });

          if (messages && messages.length > 0) {
            // UIMessage 형식으로 변환 (타입 단언 사용)
            const uiMessages = messages.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              parts: [{ type: 'text' as const, text: msg.content }],
            })) as any[];

            // useChat의 setMessages로 메시지 설정
            chat.setMessages(uiMessages);

            // 메시지 로드 후 스크롤 (약간의 딜레이 후)
            setTimeout(() => {
              scrollToBottom(false);
            }, 100);
          }

          setMessagesLoading(false);
        }
      } catch (err) {
        console.error('Error loading persona and session:', err);
        router.push('/personas');
      } finally {
        setLoading(false);
      }
    };

    loadPersonaAndSession();
  }, [personaId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // IME 조합 중인지 확인 (한글, 일본어, 중국어 입력 중)
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

    // sendMessage로 메시지 전송 (text 형식 사용)
    await chat.sendMessage({
      text: userMessage,
    }, {
      body: { personaId, relationshipType },
    });
  };

  if (loading || !persona) {
    return (
      <div className="min-h-screen color-bends-bg flex items-center justify-center">
        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">
            {loading ? '페르소나 정보를 불러오는 중...' : '페르소나를 찾을 수 없습니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen color-bends-bg py-6">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
      {/* 페르소나 헤더 */}
      <Card className="p-6 mb-6 shadow-md bg-white/90 border-2 animate-fade-in">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shadow-sm">
            <AvatarFallback className="text-2xl gradient-bg text-white">
              {(persona.persona_name || persona.name)?.charAt(0) || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold gradient-text">{persona.persona_name || persona.name}</h1>
              {persona.is_official && <Badge className="gradient-bg text-white shadow-sm">공식</Badge>}
            </div>
            {persona.persona_description && (
              <p className="text-muted-foreground mb-3">
                {persona.persona_description}
              </p>
            )}
            <div className="flex gap-2 mb-3">
              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">{persona.mbti}</Badge>
              <Badge variant="outline" className="bg-cyan-50 border-cyan-200 text-cyan-700">{persona.disc}</Badge>
              <Badge variant="outline" className="bg-pink-50 border-pink-200 text-pink-700">유형 {persona.enneagram}</Badge>
            </div>

            {/* 관계 타입 선택 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">대화 관계:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={relationshipType === 'superior' ? 'default' : 'outline'}
                  onClick={() => setRelationshipType('superior')}
                  className={relationshipType === 'superior' ? 'gradient-bg text-white' : ''}
                  disabled={!!sessionId && chat.messages.length > 0}
                >
                  상급자
                </Button>
                <Button
                  size="sm"
                  variant={relationshipType === 'peer' ? 'default' : 'outline'}
                  onClick={() => setRelationshipType('peer')}
                  className={relationshipType === 'peer' ? 'gradient-bg text-white' : ''}
                  disabled={!!sessionId && chat.messages.length > 0}
                >
                  동료
                </Button>
                <Button
                  size="sm"
                  variant={relationshipType === 'subordinate' ? 'default' : 'outline'}
                  onClick={() => setRelationshipType('subordinate')}
                  className={relationshipType === 'subordinate' ? 'gradient-bg text-white' : ''}
                  disabled={!!sessionId && chat.messages.length > 0}
                >
                  하급자
                </Button>
              </div>
              {sessionId && chat.messages.length > 0 && (
                <span className="text-xs text-muted-foreground">(대화 중에는 변경 불가)</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 대화 영역 */}
      <div className="bg-white/90 border-2 rounded-lg shadow-md flex flex-col h-[600px] animate-slide-up">
        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messagesLoading ? (
            // 메시지 로딩 중 스켈레톤
            <div className="space-y-4 animate-fade-in">
              {/* AI 메시지 스켈레톤 */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted-foreground/20 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              {/* 사용자 메시지 스켈레톤 */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg p-4 bg-primary/10">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-12 bg-primary/30 rounded animate-pulse" />
                      <div className="h-4 w-full bg-primary/30 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-primary/30 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              {/* AI 메시지 스켈레톤 */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted-foreground/20 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-4 w-5/6 bg-muted-foreground/20 rounded animate-pulse" />
                      <div className="h-4 w-4/5 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : chat.messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg mb-2">{persona.persona_name || persona.name}와 대화를 시작해보세요!</p>
              <p className="text-sm">
                이 페르소나는 {persona.mbti}, {persona.disc} 성향을 가지고 있습니다.
              </p>
            </div>
          ) : null}

          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  message.role === 'user'
                    ? 'gradient-bg text-white'
                    : 'bg-white border border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 shadow-sm">
                      <AvatarFallback className="text-xs gradient-bg text-white">
                        {(persona.persona_name || persona.name)?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <p className={`text-xs font-semibold mb-1.5 ${
                      message.role === 'user' ? 'text-white/90' : 'text-muted-foreground'
                    }`}>
                      {message.role === 'user' ? '나' : (persona.persona_name || persona.name)}
                    </p>
                    <p className={`whitespace-pre-wrap leading-relaxed ${
                      message.role === 'user' ? 'text-white' : 'text-foreground'
                    }`}>
                      {message.parts
                        .filter((part) => part.type === 'text')
                        .map((part) => part.text)
                        .join('')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {chat.status === 'streaming' && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[80%] rounded-2xl p-4 bg-white border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shadow-sm">
                    <AvatarFallback className="text-xs gradient-bg text-white">
                      {(persona.persona_name || persona.name)?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chat.error && (
            <div className="text-center text-destructive p-4">
              <p>오류가 발생했습니다: {chat.error.message}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력 폼 */}
        <div className="border-t border-border bg-gradient-to-r from-purple-50/30 to-cyan-50/30 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              ref={inputRef}
              name="message"
              placeholder="메시지를 입력하세요..."
              disabled={chat.status === 'streaming'}
              className="flex-1 bg-white shadow-sm border-2 focus:border-primary/50"
            />
            <Button
              type="submit"
              disabled={chat.status === 'streaming'}
              className="gradient-bg text-white shadow-md hover:shadow-lg transition-all"
            >
              전송
            </Button>
          </form>
        </div>
      </div>

      {/* 돌아가기 버튼 */}
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push('/personas')}
          className="bg-white/90 shadow-sm hover:shadow-md transition-all border-2"
        >
          ← 페르소나 목록으로
        </Button>
      </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">페이지를 불러오는 중...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
