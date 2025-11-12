'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Message {
  content: string
  role: string
  created_at: string
}

interface Persona {
  id: string
  personaName: string
  mbti: string | null
  disc: string | null
  enneagram: string | null
}

interface Session {
  id: string
  persona: Persona | null
  relationship_type: string
  session_status: string
  started_at: string
  ended_at: string | null
  message_count: number
  total_tokens_used: number | null
  last_message: Message | null
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [statusFilter])

  useEffect(() => {
    // 검색 필터 적용
    const filtered = sessions.filter(session => {
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      const personaName = session.persona?.personaName?.toLowerCase() || ''
      const lastMessageContent = session.last_message?.content?.toLowerCase() || ''

      return personaName.includes(query) || lastMessageContent.includes(query)
    })

    setFilteredSessions(filtered)
  }, [searchQuery, sessions])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `/api/chat/history?status=${statusFilter}&limit=100`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }

      const data = await response.json()
      setSessions(data.sessions)
      setFilteredSessions(data.sessions)
    } catch (err: any) {
      console.error('Error fetching sessions:', err)
      setError(err.message || 'Failed to load chat history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!sessionToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/chat/history/${sessionToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete session')
      }

      // 로컬 상태 업데이트
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete))
      setDeleteDialogOpen(false)
      setSessionToDelete(null)
    } catch (err: any) {
      console.error('Error deleting session:', err)
      alert('세션 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  const confirmDelete = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">진행 중</Badge>
      case 'ended':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">종료</Badge>
      case 'archived':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">보관</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRelationshipEmoji = (type: string) => {
    switch (type) {
      case 'superior': return '👔'
      case 'peer': return '🤝'
      case 'subordinate': return '🎓'
      default: return '💬'
    }
  }

  return (
    <div className="min-h-screen color-bends-bg p-3 sm:p-6">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="glass sticky top-0 z-10 p-4 sm:p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold gradient-text mb-2">
                대화 기록
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                AI 페르소나와 나눈 대화를 확인하고 관리하세요
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              className="gradient-bg text-white hover:shadow-lg transition-all w-full sm:w-auto"
            >
              대시보드로
            </Button>
          </div>

          {/* 검색 */}
          <Input
            placeholder="페르소나 이름 또는 메시지 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
          />
        </div>

        {/* 탭 필터 */}
        <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">진행 중</TabsTrigger>
            <TabsTrigger value="ended">종료</TabsTrigger>
            <TabsTrigger value="archived">보관</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">대화 기록을 불러오는 중...</p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 세션 목록 */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">대화 기록이 없습니다.</p>
                  <Button
                    onClick={() => router.push('/personas')}
                    className="gradient-bg text-white hover:shadow-lg"
                  >
                    새 대화 시작하기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* 페르소나 아바타 */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                          {session.persona?.personaName?.charAt(0) || '?'}
                        </div>

                        {/* 세션 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-lg sm:text-xl truncate">
                              {session.persona?.personaName || '알 수 없는 페르소나'}
                            </CardTitle>
                            {getStatusBadge(session.session_status)}
                            <span className="text-xl sm:text-2xl">{getRelationshipEmoji(session.relationship_type)}</span>
                          </div>
                          <CardDescription className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                            {session.persona?.mbti && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded flex-shrink-0">
                                {session.persona.mbti}
                              </span>
                            )}
                            {session.persona?.disc && (
                              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded flex-shrink-0">
                                {session.persona.disc}
                              </span>
                            )}
                            <span className="text-gray-500 whitespace-nowrap">
                              {formatDate(session.started_at)}
                            </span>
                            <span className="text-gray-500 whitespace-nowrap">
                              • {session.message_count}개 메시지
                            </span>
                          </CardDescription>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/chat?personaId=${session.persona?.id}&sessionId=${session.id}`)
                          }}
                          className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-1 sm:flex-initial"
                        >
                          이어서 대화
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDelete(session.id)
                          }}
                          className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* 마지막 메시지 미리보기 */}
                  {session.last_message && (
                    <CardContent
                      onClick={() => router.push(`/chat?personaId=${session.persona?.id}&sessionId=${session.id}`)}
                    >
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <span className="font-semibold">
                            {session.last_message.role === 'user' ? '나' : session.persona?.personaName}:
                          </span>{' '}
                          {session.last_message.content}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>대화 세션 삭제</DialogTitle>
            <DialogDescription>
              이 대화 세션과 모든 메시지가 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              취소
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
