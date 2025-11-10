'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

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
              <h1 className="text-xl font-bold gradient-text">Personality Agent</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Beta
              </Badge>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {/* 웰컴 섹션 */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            안녕하세요, <span className="gradient-text">{user?.user_metadata?.full_name || '사용자'}</span>님! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            오늘은 어떤 페르소나와 대화를 나눠볼까요?
          </p>
        </div>

        {/* 메인 기능 카드 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* 내 페르소나 */}
          <Card className="card-hover border-2 group cursor-pointer" onClick={() => router.push('/personas')}>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">🎭</span>
              </div>
              <CardTitle className="text-xl">내 페르소나</CardTitle>
              <CardDescription>
                생성한 페르소나를 관리하고 편집하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">관리하기</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </CardContent>
          </Card>

          {/* 대화 시작 */}
          <Card className="card-hover border-2 group cursor-pointer bg-gradient-to-br from-card to-primary/5" onClick={() => router.push('/chat')}>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <span className="text-2xl">💬</span>
              </div>
              <CardTitle className="text-xl">대화 시작</CardTitle>
              <CardDescription>
                페르소나와 실시간 대화를 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className="gradient-bg">인기</Badge>
                <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </CardContent>
          </Card>

          {/* 대화 기록 */}
          <Card className="card-hover border-2 group cursor-pointer" onClick={() => router.push('/history')}>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                <span className="text-2xl">📚</span>
              </div>
              <CardTitle className="text-xl">대화 기록</CardTitle>
              <CardDescription>
                이전 대화 내역을 확인하고 복습하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">기록 보기</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 및 정보 섹션 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 계정 정보 */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👤</span>
                계정 정보
              </CardTitle>
              <CardDescription>현재 계정 정보 및 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">이메일</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <Badge variant="outline">인증됨</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">가입일</p>
                  <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">사용자 ID</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {user?.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시작하기 가이드 */}
          <Card className="border-2 bg-gradient-to-br from-card to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🚀</span>
                시작하기
              </CardTitle>
              <CardDescription>Personality Agent 활용 가이드</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">페르소나 생성</p>
                  <p className="text-sm text-muted-foreground">
                    MBTI, DiSC, 애니어그램으로 나만의 페르소나 만들기
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">대화 시작</p>
                  <p className="text-sm text-muted-foreground">
                    AI 페르소나와 실시간으로 대화하며 감정 교류하기
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">대화 분석</p>
                  <p className="text-sm text-muted-foreground">
                    대화 기록을 통해 페르소나 이해도 높이기
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
