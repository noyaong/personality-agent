import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/chat/history
 * 사용자의 채팅 세션 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'all' // active, ended, archived, all
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 세션 조회 조건
    const whereClause: any = {
      userId: user.id,
    }

    if (status !== 'all') {
      whereClause.sessionStatus = status
    }

    // 세션 목록 조회 (페르소나 정보 포함)
    const sessions = await prisma.chatSession.findMany({
      where: whereClause,
      include: {
        personaProfile: {
          select: {
            id: true,
            personaName: true,
            mbti: true,
            disc: true,
            enneagram: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            content: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // 전체 세션 개수
    const totalCount = await prisma.chatSession.count({
      where: whereClause,
    })

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        persona: session.personaProfile,
        relationship_type: session.relationshipType,
        session_status: session.sessionStatus,
        started_at: session.startedAt,
        ended_at: session.endedAt,
        message_count: session.messageCount,
        total_tokens_used: session.totalTokensUsed,
        last_message: session.messages[0] || null,
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + sessions.length < totalCount,
      },
    })
  } catch (error: any) {
    console.error('Failed to fetch chat history:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
