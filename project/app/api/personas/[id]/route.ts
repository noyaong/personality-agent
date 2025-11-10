import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

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
    if (name !== undefined) updateData.personaName = name
    if (description !== undefined) updateData.personaDescription = description
    if (mbti !== undefined) updateData.mbti = mbti
    if (disc !== undefined) updateData.disc = disc
    if (enneagram !== undefined) {
      // Enneagram + Wing 결합 (예: "5" + "w6" = "5w6")
      updateData.enneagram = enneagramWing ? `${enneagram}w${enneagramWing}` : enneagram
      console.log('✅ Final enneagram value:', updateData.enneagram)
    }
    if (visibility !== undefined) updateData.visibility = visibility

    // 페르소나 업데이트
    const updatedPersona = await prisma.personaProfile.update({
      where: { id },
      data: updateData,
    })

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
