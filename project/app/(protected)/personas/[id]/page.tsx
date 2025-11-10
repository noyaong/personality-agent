'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Persona {
  id: string
  personaName: string
  personaDescription: string | null
  mbti: string
  disc: string | null
  enneagram: string | null
  visibility: string
  isOfficial: boolean
  creatorId: string | null
  creatorUsageCount: number
  publicUsageCount: number
  createdAt: string
  updatedAt: string
}

export default function PersonaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false)
  const [changingVisibility, setChangingVisibility] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const personaId = params.id as string

  useEffect(() => {
    fetchPersona()
  }, [personaId])

  const fetchPersona = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/personas/${personaId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch persona')
      }

      setPersona(data.persona)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/personas/${personaId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete persona')
      }

      // 삭제 성공 - 페르소나 목록으로 이동
      router.push('/personas')
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`)
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleVisibilityChange = async (newVisibility: string) => {
    try {
      setChangingVisibility(true)
      const response = await fetch(`/api/personas/${personaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility: newVisibility,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update visibility')
      }

      // 성공 시 persona 상태 업데이트
      setPersona(data.persona)
      setShowVisibilityDialog(false)
    } catch (err: any) {
      alert(`공개 설정 변경 실패: ${err.message}`)
    } finally {
      setChangingVisibility(false)
    }
  }

  const handleDuplicate = async () => {
    if (!persona) return

    try {
      setDuplicating(true)

      // Enneagram에서 기본 타입과 wing 분리 (예: "5w6" -> "5", "6")
      const enneagramMatch = persona.enneagram?.match(/^(\d+)w?(\d+)?$/)
      const enneagramBase = enneagramMatch ? enneagramMatch[1] : persona.enneagram || ''
      const enneagramWing = enneagramMatch?.[2] || ''

      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${persona.personaName} (복사본)`,
          description: persona.personaDescription,
          mbti: persona.mbti,
          disc: persona.disc,
          enneagram: enneagramBase,
          enneagramWing: enneagramWing,
          visibility: 'private', // 복제된 페르소나는 기본적으로 비공개
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to duplicate persona')
      }

      // 성공 시 새로 생성된 페르소나로 이동
      router.push(`/personas/${data.persona.id}`)
    } catch (err: any) {
      alert(`페르소나 복제 실패: ${err.message}`)
      setDuplicating(false)
    }
  }

  const isOwner = persona && persona.creatorId === user?.id

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              <Button variant="ghost" onClick={() => router.push('/personas')}>
                ← 페르소나 목록
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-2 border-destructive/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-destructive">오류 발생</h3>
              <p className="text-muted-foreground mb-6">{error || '페르소나를 찾을 수 없습니다'}</p>
              <Button onClick={() => router.push('/personas')}>페르소나 목록으로</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 헤더 */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/personas')}>
              ← 페르소나 목록
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDuplicate}
                disabled={duplicating}
              >
                {duplicating ? '복제 중...' : '📋 복제'}
              </Button>
              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/personas/${personaId}/edit`)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    삭제
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* 기본 정보 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-2xl">{persona.personaName}</CardTitle>
                <div className="flex gap-2">
                  {persona.isOfficial && <Badge className="gradient-bg">공식</Badge>}
                  <Badge
                    variant="outline"
                    className={isOwner ? 'cursor-pointer hover:bg-accent' : ''}
                    onClick={isOwner ? () => setShowVisibilityDialog(true) : undefined}
                  >
                    {persona.visibility === 'private' && '🔒 비공개'}
                    {persona.visibility === 'unlisted' && '🔗 링크 공유'}
                    {persona.visibility === 'public' && '🌍 공개'}
                  </Badge>
                </div>
              </div>
              {persona.personaDescription && (
                <CardDescription className="text-base">
                  {persona.personaDescription}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 심리 프로필 */}
              <div>
                <h3 className="text-sm font-semibold mb-3">심리 프로필</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    MBTI: {persona.mbti}
                  </Badge>
                  {persona.disc && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      DiSC: {persona.disc}
                    </Badge>
                  )}
                  {persona.enneagram && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      Enneagram: {persona.enneagram}
                    </Badge>
                  )}
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">총 대화 횟수</p>
                  <p className="text-2xl font-bold">
                    {persona.creatorUsageCount + persona.publicUsageCount}회
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">생성일</p>
                  <p className="text-lg">
                    {new Date(persona.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              {/* 대화 시작 버튼 */}
              <Button
                className="w-full gradient-bg text-lg py-6"
                onClick={() => router.push(`/chat?persona=${persona.id}`)}
              >
                💬 이 페르소나와 대화 시작하기
              </Button>
            </CardContent>
          </Card>

          {/* 설명 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>이 페르소나는...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">MBTI: {persona.mbti}</h4>
                <p className="text-sm text-muted-foreground">
                  {getMBTIDescription(persona.mbti)}
                </p>
              </div>
              {persona.disc && (
                <div>
                  <h4 className="font-semibold mb-2">DiSC: {persona.disc}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getDiSCDescription(persona.disc)}
                  </p>
                </div>
              )}
              {persona.enneagram && (
                <div>
                  <h4 className="font-semibold mb-2">Enneagram: {persona.enneagram}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getEnneagramDescription(persona.enneagram)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 공개 설정 변경 다이얼로그 */}
      <Dialog open={showVisibilityDialog} onOpenChange={setShowVisibilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공개 설정 변경</DialogTitle>
            <DialogDescription>
              &quot;{persona.personaName}&quot; 페르소나의 공개 설정을 변경하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <button
              onClick={() => handleVisibilityChange('private')}
              disabled={changingVisibility || persona.visibility === 'private'}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                persona.visibility === 'private'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${changingVisibility ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div className="flex-1">
                  <div className="font-medium">비공개</div>
                  <div className="text-sm text-muted-foreground">나만 사용할 수 있습니다</div>
                </div>
                {persona.visibility === 'private' && (
                  <Badge variant="default">현재 설정</Badge>
                )}
              </div>
            </button>

            <button
              onClick={() => handleVisibilityChange('unlisted')}
              disabled={changingVisibility || persona.visibility === 'unlisted'}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                persona.visibility === 'unlisted'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${changingVisibility ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div className="flex-1">
                  <div className="font-medium">링크 공유</div>
                  <div className="text-sm text-muted-foreground">
                    링크를 아는 사람만 사용할 수 있습니다
                  </div>
                </div>
                {persona.visibility === 'unlisted' && (
                  <Badge variant="default">현재 설정</Badge>
                )}
              </div>
            </button>

            <button
              onClick={() => handleVisibilityChange('public')}
              disabled={changingVisibility || persona.visibility === 'public'}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                persona.visibility === 'public'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${changingVisibility ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <div className="flex-1">
                  <div className="font-medium">공개</div>
                  <div className="text-sm text-muted-foreground">
                    모든 사용자가 사용할 수 있습니다
                  </div>
                </div>
                {persona.visibility === 'public' && (
                  <Badge variant="default">현재 설정</Badge>
                )}
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVisibilityDialog(false)}
              disabled={changingVisibility}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>페르소나 삭제</DialogTitle>
            <DialogDescription>
              정말로 &quot;{persona.personaName}&quot; 페르소나를 삭제하시겠습니까?
              <br />
              <span className="text-destructive font-semibold">
                이 작업은 되돌릴 수 없으며, 관련된 모든 대화 기록도 함께 삭제됩니다.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 헬퍼 함수들
function getMBTIDescription(mbti: string): string {
  const descriptions: Record<string, string> = {
    INTJ: '전략가형 - 독창적이고 논리적인 사고를 가진 전략가',
    INTP: '논리술사형 - 지식에 대한 끝없는 탐구심을 가진 혁신가',
    ENTJ: '통솔자형 - 대담하고 상상력이 풍부한 강력한 리더',
    ENTP: '변론가형 - 지적 도전을 즐기는 영리한 사색가',
    INFJ: '옹호자형 - 이상주의적이고 원칙주의적인 사람',
    INFP: '중재자형 - 이상주의적이고 친절한 사람',
    ENFJ: '선도자형 - 카리스마 넘치고 영향력 있는 리더',
    ENFP: '활동가형 - 열정적이고 창의적인 사교가',
    ISTJ: '현실주의자형 - 신뢰할 수 있고 실용적인 사람',
    ISFJ: '수호자형 - 헌신적이고 따뜻한 보호자',
    ESTJ: '경영자형 - 탁월한 관리 능력을 지닌 사람',
    ESFJ: '집정관형 - 사교적이고 협조적인 사람',
    ISTP: '장인형 - 대담하고 실용적인 실험가',
    ISFP: '모험가형 - 유연하고 매력적인 예술가',
    ESTP: '사업가형 - 영리하고 활동적인 모험가',
    ESFP: '연예인형 - 즉흥적이고 열정적인 사람',
  }
  return descriptions[mbti] || 'MBTI 유형에 대한 설명'
}

function getDiSCDescription(disc: string): string {
  const descriptions: Record<string, string> = {
    D: '주도형 - 결과 지향적이고 도전을 즐기는 리더십 스타일',
    I: '사교형 - 열정적이고 낙관적인 관계 중심 스타일',
    S: '안정형 - 협조적이고 신뢰할 수 있는 지원자 스타일',
    C: '신중형 - 정확성과 품질을 중시하는 분석적 스타일',
    DI: '영향력 있는 리더 - 목표 달성과 사람 관계를 모두 중시',
    DS: '활동적 리더 - 결과와 팀워크를 균형있게 추구',
    DC: '도전적 완벽주의자 - 높은 기준과 강력한 추진력',
    ID: '열정적 행동가 - 사람들을 이끌며 빠르게 실행',
    IS: '친근한 중재자 - 따뜻하고 협조적인 관계 구축',
    IC: '설득력 있는 조언자 - 분석과 설득을 겸비',
    SI: '지지하는 협력자 - 안정적이고 긍정적인 팀워크',
    SD: '참을성 있는 실행자 - 꾸준함과 목표 달성을 병행',
    SC: '신중한 지원자 - 정확하고 세심한 업무 처리',
    CD: '독립적 완벽주의자 - 높은 기준과 자율성 추구',
    CI: '체계적 소통가 - 논리와 설득력을 겸비',
    CS: '체계적 조력자 - 정확하고 협조적인 지원',
  }
  return descriptions[disc.toUpperCase()] || 'DiSC 유형에 대한 설명'
}

function getEnneagramDescription(enneagram: string): string {
  const descriptions: Record<string, string> = {
    '1': '개혁가 - 원칙적이고 이상주의적',
    '2': '조력가 - 관대하고 배려심 많음',
    '3': '성취자 - 성공 지향적이고 실용적',
    '4': '예술가 - 감성적이고 창의적',
    '5': '사색가 - 지적이고 독립적',
    '6': '충성가 - 책임감 있고 신뢰할 수 있음',
    '7': '열정가 - 자유분방하고 낙관적',
    '8': '도전가 - 자신감 있고 강력한',
    '9': '평화주의자 - 수용적이고 조화로운',
  }
  const type = enneagram.replace(/w\d/, '')
  return descriptions[type] || 'Enneagram 유형에 대한 설명'
}
