import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { embed } from 'npm:ai@latest'
import { openai } from 'npm:@ai-sdk/openai@latest'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    // Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 페르소나 정보로부터 텍스트 생성
    const personaText = `
      Name: ${record.persona_name || 'Unknown'}
      Description: ${record.persona_description || 'No description'}
      MBTI: ${record.mbti || 'Unknown'}
      DiSC: ${record.disc || 'Unknown'}
      Enneagram: ${record.enneagram || 'Unknown'}
      Traits: ${JSON.stringify(record.traits || {})}
      Communication Style: ${JSON.stringify(record.communication_style || {})}
      Behavioral Patterns: ${JSON.stringify(record.behavioral_patterns || {})}
    `.trim()

    console.log('Generating embedding for persona:', record.id)
    console.log('Persona text:', personaText)

    // OpenAI API 키 확인
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Vercel AI SDK로 임베딩 생성
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: personaText,
    })

    console.log('Embedding generated, length:', embedding.length)

    // 임베딩을 데이터베이스에 저장
    const { error: updateError } = await supabase
      .from('persona_profiles')
      .update({ profile_embedding: embedding })
      .eq('id', record.id)

    if (updateError) {
      console.error('Error updating embedding:', updateError)
      throw updateError
    }

    console.log('Successfully updated embedding for persona:', record.id)

    return new Response(
      JSON.stringify({ success: true, personaId: record.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in generate-persona-embedding function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
