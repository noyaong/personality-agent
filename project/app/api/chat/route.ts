import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import psychologyProfiles from '@/data/psychology-profiles.json';
import { generateEmbedding } from '@/lib/embeddings';
import { searchSimilarPatterns } from '@/lib/supabase/vector';

export const runtime = 'edge';

// 페르소나 기반 시스템 프롬프트 생성
function generatePersonaPrompt(persona: any): string {
  // 데이터베이스 필드명에 맞춰 수정 (mbti_type -> mbti, disc_type -> disc, enneagram_type -> enneagram)
  const mbtiType = persona.mbti || persona.mbti_type;
  const discType = persona.disc || persona.disc_type;
  const enneagramType = persona.enneagram || persona.enneagram_type;

  // Enneagram은 "5w6" 형식이므로 기본 타입만 추출 (첫 글자)
  const enneagramBase = enneagramType?.charAt(0);
  const enneagramWing = enneagramType?.includes('w') ? enneagramType.split('w')[1] : null;

  const mbtiProfile = psychologyProfiles.mbti[mbtiType as keyof typeof psychologyProfiles.mbti];
  const discProfile = psychologyProfiles.disc[discType as keyof typeof psychologyProfiles.disc];
  const enneagramProfile = psychologyProfiles.enneagram[enneagramBase as keyof typeof psychologyProfiles.enneagram];

  // persona_name 또는 name 필드 지원
  const personaName = persona.persona_name || persona.name;
  const personaDescription = persona.persona_description || persona.description;

  let prompt = `당신은 "${personaName}"이라는 페르소나로 대화하고 있습니다.\n\n`;

  // 페르소나 기본 정보
  if (personaDescription) {
    prompt += `## 페르소나 설명\n${personaDescription}\n\n`;
  }

  // MBTI 프로필
  if (mbtiProfile) {
    prompt += `## MBTI: ${mbtiType} - ${mbtiProfile.name}\n`;
    prompt += `${mbtiProfile.description}\n\n`;
    prompt += `### 주요 특성\n${mbtiProfile.traits.map((t: string) => `- ${t}`).join('\n')}\n\n`;
    prompt += `### 대화 스타일\n- ${mbtiProfile.communication}\n\n`;
    prompt += `### 의사결정 방식\n- ${mbtiProfile.decision}\n\n`;
    prompt += `### 정보 처리\n- ${mbtiProfile.information_processing}\n\n`;
  }

  // DiSC 프로필
  if (discProfile) {
    prompt += `## DiSC: ${discType} - ${discProfile.name}\n`;
    prompt += `${discProfile.behavior}\n\n`;
    prompt += `### 주요 특성\n${discProfile.traits.map((t: string) => `- ${t}`).join('\n')}\n\n`;
    prompt += `### 행동 패턴\n`;
    prompt += `- 페이스: ${discProfile.pace}\n`;
    prompt += `- 우선순위: ${discProfile.priority}\n`;
    prompt += `- 두려움: ${discProfile.fear}\n\n`;
  }

  // Enneagram 프로필
  if (enneagramProfile) {
    prompt += `## 에니어그램: 유형 ${enneagramBase} - ${enneagramProfile.name}\n`;
    prompt += `### 핵심 동기\n${enneagramProfile.core_motivation}\n\n`;
    prompt += `### 핵심 두려움\n${enneagramProfile.core_fear}\n\n`;
    prompt += `### 주요 특성\n${enneagramProfile.traits.map((t: string) => `- ${t}`).join('\n')}\n\n`;

    // Wing 정보
    if (enneagramWing && enneagramProfile.wings) {
      const wingKey = `${enneagramBase}w${enneagramWing}` as keyof typeof enneagramProfile.wings;
      const wingProfile = enneagramProfile.wings[wingKey] as any;
      if (wingProfile) {
        prompt += `### Wing: ${wingKey} - ${wingProfile.name}\n`;
        prompt += `${wingProfile.behavior}\n\n`;
        prompt += `특성: ${wingProfile.traits.join(', ')}\n\n`;
      }
    }
  }

  prompt += `## 대화 지침\n`;
  prompt += `1. 위의 심리 프로필에 맞는 대화 스타일을 유지하세요.\n`;
  prompt += `2. 페르소나의 특성과 두려움, 동기를 반영하여 자연스럽게 대화하세요.\n`;
  prompt += `3. 대화 톤과 의사결정 방식은 MBTI와 DiSC 프로필을 따르세요.\n`;
  prompt += `4. 감정 반응과 깊은 동기는 에니어그램 프로필을 반영하세요.\n`;
  prompt += `5. 자연스럽고 일관성 있는 인격체로 행동하세요.\n`;
  prompt += `6. 감정 표현이 풍부한 경우 적절한 이모지를 사용하여 대화를 더욱 생동감 있게 만드세요.\n`;

  return prompt;
}

// 유사한 대화 패턴을 찾아서 컨텍스트에 추가
async function enrichWithConversationPatterns(
  userMessage: string,
  persona: any,
  relationshipType?: string,
  supabase?: any,
  chatSessionId?: string
): Promise<string> {
  try {
    // 사용자 메시지의 임베딩 생성
    const embedding = await generateEmbedding(userMessage);

    // 유사한 대화 패턴 검색
    const similarPatterns = await searchSimilarPatterns(
      embedding,
      persona.mbti,
      relationshipType,
      3, // 상위 3개 패턴
      0.15, // 15% 이상 유사도 (짧은 사용자 메시지와 구조화된 패턴 간의 자연스러운 차이 고려)
      persona.enneagram // 애니어그램 필터 추가
    );

    if (similarPatterns.length === 0) {
      return '';
    }

    // 패턴 사용 추적 (비동기로 실행, 실패해도 대화는 계속)
    if (supabase) {
      Promise.all(
        similarPatterns.map(async (pattern) => {
          try {
            const { error } = await supabase.rpc('increment_pattern_usage', {
              p_pattern_id: pattern.id,
              p_similarity_score: pattern.similarity,
              p_user_message: userMessage,
              p_chat_session_id: chatSessionId || null,
              p_relationship_type: relationshipType || null
            });

            if (error) {
              console.error('Failed to track pattern usage:', error);
            } else {
              console.log('✅ Pattern usage tracked:', pattern.id);
            }
          } catch (error) {
            console.error('Exception tracking pattern usage:', error);
          }
        })
      ).catch(err => console.error('Failed to track some patterns:', err));
    }

    // 패턴 정보를 텍스트로 변환
    let patternsContext = '\n\n## 참고: 유사한 대화 패턴\n';
    patternsContext += '아래는 비슷한 상황에서 효과적이었던 대화 패턴입니다. 자연스럽게 참고하세요:\n\n';

    similarPatterns.forEach((pattern, index) => {
      patternsContext += `${index + 1}. ${pattern.pattern_text}\n`;
      patternsContext += `   (유사도: ${(pattern.similarity * 100).toFixed(1)}%)\n\n`;
    });

    return patternsContext;
  } catch (error) {
    console.error('Error enriching with conversation patterns:', error);
    return ''; // 실패해도 대화는 계속 진행
  }
}

export async function POST(req: Request) {
  try {
    const { messages, personaId, relationshipType }: { messages: UIMessage[]; personaId: string; relationshipType?: string } = await req.json();

    console.log('📨 Received request:', { personaId, messagesCount: messages?.length, relationshipType });
    console.log('📨 Messages:', JSON.stringify(messages, null, 2));

    if (!personaId) {
      return new Response('Persona ID is required', { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Messages array is required', { status: 400 });
    }

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // 현재 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 페르소나 정보 조회
    const { data: persona, error: personaError } = await supabase
      .from('persona_profiles')
      .select('*')
      .eq('id', personaId)
      .single();

    if (personaError || !persona) {
      return new Response('Persona not found', { status: 404 });
    }

    // 페르소나에 접근 권한 확인 (본인, 공개, 공식)
    const canAccess =
      persona.creator_id === user.id ||
      persona.visibility === 'public' ||
      persona.is_official;

    if (!canAccess) {
      return new Response('Access denied', { status: 403 });
    }

    // 시스템 프롬프트 생성
    let systemPrompt = generatePersonaPrompt(persona);

    // 마지막 사용자 메시지 가져오기
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();

    // 벡터 검색으로 유사한 대화 패턴 찾아서 컨텍스트 추가
    if (lastUserMessage) {
      // UIMessage를 모델 메시지로 변환하여 content 추출
      const modelMsg = convertToModelMessages([lastUserMessage])[0];
      const messageContent = modelMsg?.content;

      if (messageContent) {
        const contentString = typeof messageContent === 'string'
          ? messageContent
          : JSON.stringify(messageContent);

        const patternsContext = await enrichWithConversationPatterns(
          contentString,
          persona,
          relationshipType,
          supabase,
          undefined // chatSessionId는 선택사항
        );

        if (patternsContext) {
          systemPrompt += patternsContext;
          console.log('✅ Added conversation patterns context to system prompt');
        }
      }
    }

    // UIMessage 배열을 모델 메시지 형식으로 변환
    const modelMessages = convertToModelMessages(messages);

    // Vercel AI SDK로 스트리밍 응답 생성
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.7,
    });

    // useChat hook과 호환되는 UI Message Stream 반환
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
