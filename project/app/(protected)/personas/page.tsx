'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

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
}

export default function PersonasPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPersonas()
  }, [])

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/personas')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch personas')
      }

      setPersonas(data.personas)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 검색 필터 함수
  const filterPersonas = (personaList: Persona[]) => {
    if (!searchQuery.trim()) return personaList

    const query = searchQuery.toLowerCase()
    return personaList.filter(
      (p) =>
        p.personaName.toLowerCase().includes(query) ||
        p.personaDescription?.toLowerCase().includes(query) ||
        p.mbti.toLowerCase().includes(query) ||
        p.disc?.toLowerCase().includes(query) ||
        p.enneagram?.toLowerCase().includes(query)
    )
  }

  const myPersonas = filterPersonas(personas.filter((p) => p.creatorId === user?.id))
  const publicPersonas = filterPersonas(personas.filter((p) => p.visibility === 'public' && p.creatorId !== user?.id))
  const officialPersonas = filterPersonas(personas.filter((p) => p.isOfficial))

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 animate-fade-in">
      {/* 헤더 */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                ← 대시보드
              </Button>
              <h1 className="text-xl font-bold gradient-text">페르소나 관리</h1>
            </div>
            <Button onClick={() => router.push('/personas/new')} className="gradient-bg">
              + 새 페르소나
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* 검색 바 */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="페르소나 이름, 설명, MBTI, DiSC, Enneagram으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-2xl"
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              &quot;{searchQuery}&quot; 검색 결과: {myPersonas.length + publicPersonas.length + officialPersonas.length}개
            </p>
          )}
        </div>

        <Tabs defaultValue="my" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my">
              내 페르소나 ({myPersonas.length})
            </TabsTrigger>
            <TabsTrigger value="public">
              공개 페르소나 ({publicPersonas.length})
            </TabsTrigger>
            <TabsTrigger value="official">
              공식 페르소나 ({officialPersonas.length})
            </TabsTrigger>
          </TabsList>

          {/* 내 페르소나 */}
          <TabsContent value="my" className="space-y-4">
            {myPersonas.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-xl font-bold mb-2">아직 페르소나가 없습니다</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    첫 번째 페르소나를 만들어 AI와 대화를 시작해보세요
                  </p>
                  <Button onClick={() => router.push('/personas/new')} className="gradient-bg">
                    + 첫 페르소나 만들기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myPersonas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 공개 페르소나 */}
          <TabsContent value="public" className="space-y-4">
            {publicPersonas.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold mb-2">공개 페르소나가 없습니다</h3>
                  <p className="text-muted-foreground text-center">
                    아직 다른 사용자가 공개한 페르소나가 없습니다
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {publicPersonas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 공식 페르소나 */}
          <TabsContent value="official" className="space-y-4">
            {officialPersonas.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold mb-2">공식 페르소나가 없습니다</h3>
                  <p className="text-muted-foreground text-center">
                    관리자가 검증한 공식 페르소나가 아직 없습니다
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {officialPersonas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function PersonaCard({ persona }: { persona: Persona }) {
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭이 아닌 경우에만 상세 페이지로 이동
    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
      router.push(`/personas/${persona.id}`)
    }
  }

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/chat?personaId=${persona.id}`)
  }

  return (
    <Card className="card-hover border-2 group cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{persona.personaName}</CardTitle>
          {persona.isOfficial && (
            <Badge className="gradient-bg">공식</Badge>
          )}
        </div>
        {persona.personaDescription && (
          <CardDescription className="line-clamp-2">
            {persona.personaDescription}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{persona.mbti}</Badge>
          {persona.disc && <Badge variant="secondary">{persona.disc}</Badge>}
          {persona.enneagram && <Badge variant="secondary">{persona.enneagram}</Badge>}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-4">
            <span>💬 {persona.creatorUsageCount + persona.publicUsageCount}회</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {persona.visibility === 'private' && '비공개'}
            {persona.visibility === 'unlisted' && '링크 공유'}
            {persona.visibility === 'public' && '공개'}
          </Badge>
        </div>

        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={handleChatClick}
        >
          💬 대화 시작
        </Button>
      </CardContent>
    </Card>
  )
}
