import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import psychologyProfiles from '@/data/psychology-profiles.json';

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

export async function POST(req: Request) {
  try {
    const { messages, personaId }: { messages: UIMessage[]; personaId: string } = await req.json();

    console.log('📨 Received request:', { personaId, messagesCount: messages?.length });
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
    const systemPrompt = generatePersonaPrompt(persona);

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
