import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import psychologyProfiles from '@/data/psychology-profiles.json'
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

// 페르소나 정보로부터 임베딩 생성
async function generatePersonaEmbedding(personaData: {
  personaName: string
  personaDescription: string | null
  mbti: string
  disc: string
  enneagram: string
  traits: any
  communicationStyle: any
  behavioralPatterns: any
}): Promise<number[] | null> {
  try {
    // 페르소나 정보를 텍스트로 변환
    const personaText = `
      Name: ${personaData.personaName}
      Description: ${personaData.personaDescription || 'No description'}
      MBTI: ${personaData.mbti}
      DiSC: ${personaData.disc}
      Enneagram: ${personaData.enneagram}
      Traits: ${JSON.stringify(personaData.traits)}
      Communication Style: ${JSON.stringify(personaData.communicationStyle)}
      Behavioral Patterns: ${JSON.stringify(personaData.behavioralPatterns)}
    `.trim()

    console.log('🔮 Generating embedding for persona:', personaData.personaName)

    // Vercel AI SDK로 임베딩 생성
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: personaText,
    })

    console.log('✅ Embedding generated, length:', embedding.length)
    return embedding
  } catch (error) {
    console.error('❌ Error generating embedding:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prisma로 페르소나 목록 조회
    const personas = await prisma.personaProfile.findMany({
      where: {
        OR: [
          { creatorId: user.id }, // 내가 만든 페르소나
          { visibility: 'public' }, // 공개 페르소나
          { isOfficial: true }, // 공식 페르소나
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ personas })
  } catch (error: any) {
    console.error('Error fetching personas:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, mbti, disc, enneagram, enneagramWing, visibility } = body

    // 디버깅 로그
    console.log('📝 Creating persona with:', { name, enneagram, enneagramWing })

    // 필수 필드 검증
    if (!name || !mbti || !disc || !enneagram) {
      return NextResponse.json(
        { error: 'Missing required fields: name, mbti, disc, enneagram' },
        { status: 400 }
      )
    }

    // Enneagram + Wing 결합 (예: "5" + "w6" = "5w6")
    const enneagramFull = enneagramWing ? `${enneagram}w${enneagramWing}` : enneagram
    console.log('✅ Final enneagram value:', enneagramFull)

    // 심리 프로필 데이터 가져오기
    const mbtiProfile = psychologyProfiles.mbti[mbti as keyof typeof psychologyProfiles.mbti]
    const discProfile = psychologyProfiles.disc[disc as keyof typeof psychologyProfiles.disc]
    const enneagramProfile = psychologyProfiles.enneagram[enneagram as keyof typeof psychologyProfiles.enneagram]

    // traits, communication_style, behavioral_patterns 생성
    const traits = {
      mbti: mbtiProfile?.traits || [],
      disc: discProfile?.traits || [],
      enneagram: enneagramProfile?.traits || [],
    }

    const communicationStyle = {
      mbti: mbtiProfile?.communication || '',
      disc: discProfile?.behavior || '',
      pace: discProfile?.pace || '',
    }

    const behavioralPatterns = {
      decision: mbtiProfile?.decision || '',
      information_processing: mbtiProfile?.information_processing || '',
      priority: discProfile?.priority || '',
      fear: discProfile?.fear || '',
      core_motivation: enneagramProfile?.core_motivation || '',
      core_fear: enneagramProfile?.core_fear || '',
    }

    // Prisma로 페르소나 생성
    const persona = await prisma.personaProfile.create({
      data: {
        creatorId: user.id,
        personaName: name,
        personaDescription: description || null,
        mbti: mbti,
        disc: disc,
        enneagram: enneagramFull,
        traits: traits as any,
        communicationStyle: communicationStyle as any,
        behavioralPatterns: behavioralPatterns as any,
        visibility: visibility || 'private',
        isOfficial: false,
        creatorUsageCount: 0,
        publicUsageCount: 0,
      },
    })

    // 임베딩 생성 및 저장 (Supabase 클라이언트 사용 - vector 타입은 Prisma에서 지원 안 함)
    const personaData = {
      personaName: name,
      personaDescription: description || null,
      mbti,
      disc,
      enneagram: enneagramFull,
      traits,
      communicationStyle,
      behavioralPatterns,
    }

    const embedding = await generatePersonaEmbedding(personaData)

    if (embedding) {
      // Supabase 클라이언트로 embedding 업데이트
      // pgvector는 배열을 직접 받지만, TypeScript 타입 때문에 as any 사용
      const { error: embeddingError } = await supabase
        .from('persona_profiles')
        .update({ profile_embedding: embedding } as any)
        .eq('id', persona.id)

      if (embeddingError) {
        console.error('❌ Error saving embedding:', embeddingError)
      } else {
        console.log('✅ Embedding saved successfully for persona:', persona.id)
      }
    }

    return NextResponse.json({ persona }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating persona:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
