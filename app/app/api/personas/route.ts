import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

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

    // 필수 필드 검증
    if (!name || !mbti || !disc || !enneagram) {
      return NextResponse.json(
        { error: 'Missing required fields: name, mbti, disc, enneagram' },
        { status: 400 }
      )
    }

    // Prisma로 페르소나 생성
    const persona = await prisma.personaProfile.create({
      data: {
        creatorId: user.id,
        personaName: name,
        personaDescription: description || null,
        mbti: mbti,
        disc: disc,
        enneagram: enneagram,
        visibility: visibility || 'private',
        isOfficial: false,
        creatorUsageCount: 0,
        publicUsageCount: 0,
      },
    })

    return NextResponse.json({ persona }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating persona:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
