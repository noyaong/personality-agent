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

// GET /api/personas/[id] - 페르소나 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const persona = await prisma.personaProfile.findUnique({
      where: { id },
    })

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    // 접근 권한 확인
    const canAccess =
      persona.creatorId === user.id ||
      persona.visibility === 'public' ||
      persona.isOfficial

    if (!canAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ persona })
  } catch (error: any) {
    console.error('Error fetching persona:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/personas/[id] - 페르소나 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 기존 페르소나 확인
    const existingPersona = await prisma.personaProfile.findUnique({
      where: { id },
    })

    if (!existingPersona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    // 권한 확인 (본인만 수정 가능)
    if (existingPersona.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own personas' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, mbti, disc, enneagram, enneagramWing, visibility } = body

    // 디버깅 로그
    console.log('📝 Updating persona with:', { name, enneagram, enneagramWing })

    // 업데이트 데이터 준비
    const updateData: any = {}
    let shouldRegenerateEmbedding = false

    if (name !== undefined) {
      updateData.personaName = name
      shouldRegenerateEmbedding = true
    }
    if (description !== undefined) {
      updateData.personaDescription = description
      shouldRegenerateEmbedding = true
    }
    if (mbti !== undefined) {
      updateData.mbti = mbti
      shouldRegenerateEmbedding = true
    }
    if (disc !== undefined) {
      updateData.disc = disc
      shouldRegenerateEmbedding = true
    }
    if (enneagram !== undefined) {
      // Enneagram + Wing 결합 (예: "5" + "w6" = "5w6")
      updateData.enneagram = enneagramWing ? `${enneagram}w${enneagramWing}` : enneagram
      console.log('✅ Final enneagram value:', updateData.enneagram)
      shouldRegenerateEmbedding = true
    }
    if (visibility !== undefined) updateData.visibility = visibility

    // 심리 프로필이 변경된 경우 traits, communication_style, behavioral_patterns 재생성
    if (mbti !== undefined || disc !== undefined || enneagram !== undefined) {
      const finalMbti = mbti || existingPersona.mbti
      const finalDisc = disc || existingPersona.disc
      const finalEnneagram = updateData.enneagram || existingPersona.enneagram
      const enneagramBase = finalEnneagram?.charAt(0)

      const mbtiProfile = psychologyProfiles.mbti[finalMbti as keyof typeof psychologyProfiles.mbti]
      const discProfile = psychologyProfiles.disc[finalDisc as keyof typeof psychologyProfiles.disc]
      const enneagramProfile = psychologyProfiles.enneagram[enneagramBase as keyof typeof psychologyProfiles.enneagram]

      updateData.traits = {
        mbti: mbtiProfile?.traits || [],
        disc: discProfile?.traits || [],
        enneagram: enneagramProfile?.traits || [],
      }

      updateData.communicationStyle = {
        mbti: mbtiProfile?.communication || '',
        disc: discProfile?.behavior || '',
        pace: discProfile?.pace || '',
      }

      updateData.behavioralPatterns = {
        decision: mbtiProfile?.decision || '',
        information_processing: mbtiProfile?.information_processing || '',
        priority: discProfile?.priority || '',
        fear: discProfile?.fear || '',
        core_motivation: enneagramProfile?.core_motivation || '',
        core_fear: enneagramProfile?.core_fear || '',
      }
    }

    // 페르소나 업데이트
    const updatedPersona = await prisma.personaProfile.update({
      where: { id },
      data: updateData,
    })

    // 임베딩 재생성 (중요한 필드가 변경된 경우)
    if (shouldRegenerateEmbedding) {
      const personaData = {
        personaName: updatedPersona.personaName,
        personaDescription: updatedPersona.personaDescription,
        mbti: updatedPersona.mbti,
        disc: updatedPersona.disc || 'D',
        enneagram: updatedPersona.enneagram || '1',
        traits: updatedPersona.traits,
        communicationStyle: updatedPersona.communicationStyle,
        behavioralPatterns: updatedPersona.behavioralPatterns,
      }

      const embedding = await generatePersonaEmbedding(personaData)

      if (embedding) {
        // Supabase 클라이언트로 embedding 업데이트
        const { error: embeddingError } = await supabase
          .from('persona_profiles')
          .update({ profile_embedding: embedding } as any)
          .eq('id', updatedPersona.id)

        if (embeddingError) {
          console.error('❌ Error saving embedding:', embeddingError)
        } else {
          console.log('✅ Embedding updated successfully for persona:', updatedPersona.id)
        }
      }
    }

    return NextResponse.json({ persona: updatedPersona })
  } catch (error: any) {
    console.error('Error updating persona:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/personas/[id] - 페르소나 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 기존 페르소나 확인
    const existingPersona = await prisma.personaProfile.findUnique({
      where: { id },
    })

    if (!existingPersona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 })
    }

    // 권한 확인 (본인만 삭제 가능)
    if (existingPersona.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own personas' },
        { status: 403 }
      )
    }

    // 페르소나 삭제 (관련 chat_sessions, chat_messages도 CASCADE로 자동 삭제됨)
    await prisma.personaProfile.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Persona deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting persona:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
