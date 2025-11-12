import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/chat/history/[sessionId]
 * 특정 세션의 상세 정보 및 메시지 조회
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
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

    const { sessionId } = await context.params

    // 세션 조회 (본인 확인)
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      include: {
        personaProfile: {
          select: {
            id: true,
            personaName: true,
            mbti: true,
            disc: true,
            enneagram: true,
            personaDescription: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      session: {
        id: session.id,
        persona: session.personaProfile,
        relationship_type: session.relationshipType,
        session_status: session.sessionStatus,
        started_at: session.startedAt,
        ended_at: session.endedAt,
        message_count: session.messageCount,
        total_tokens_used: session.totalTokensUsed,
        messages: session.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          created_at: msg.createdAt,
          tokens_used: msg.tokensUsed,
        })),
      },
    })
  } catch (error: any) {
    console.error('Failed to fetch session:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/history/[sessionId]
 * 세션 삭제 (메시지도 CASCADE로 함께 삭제됨)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
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

    const { sessionId } = await context.params

    // 본인 세션 확인
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      )
    }

    // 세션 삭제 (메시지도 CASCADE로 함께 삭제됨)
    await prisma.chatSession.delete({
      where: {
        id: sessionId,
      },
    })

    return NextResponse.json({
      message: 'Session deleted successfully',
    })
  } catch (error: any) {
    console.error('Failed to delete session:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/chat/history/[sessionId]
 * 세션 상태 업데이트 (active -> ended/archived)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
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

    const { sessionId } = await context.params
    const body = await request.json()
    const { session_status } = body

    if (!session_status || !['active', 'ended', 'archived'].includes(session_status)) {
      return NextResponse.json(
        { error: 'Invalid session_status' },
        { status: 400 }
      )
    }

    // 본인 세션 확인
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or not authorized' },
        { status: 404 }
      )
    }

    // 세션 상태 업데이트
    const updatedSession = await prisma.chatSession.update({
      where: {
        id: sessionId,
      },
      data: {
        sessionStatus: session_status,
        endedAt: session_status === 'ended' || session_status === 'archived'
          ? new Date()
          : session.endedAt,
      },
    })

    return NextResponse.json({
      session: updatedSession,
    })
  } catch (error: any) {
    console.error('Failed to update session:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
