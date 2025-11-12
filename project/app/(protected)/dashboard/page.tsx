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
      <div className="flex min-h-screen items-center justify-center color-bends-bg">
        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen color-bends-bg animate-fade-in">
      {/* 헤더 */}
      <header className="border-b glass sticky top-0 z-10 shadow-sm">
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up relative z-10">
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
          <Card className="card-hover border-2 group cursor-pointer shadow-sm hover:shadow-lg bg-white/90" onClick={() => router.push('/personas')}>
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎭</span>
              </div>
              <CardTitle className="text-xl">내 페르소나</CardTitle>
              <CardDescription>
                생성한 페르소나를 관리하고 편집하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">관리하기</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform text-lg">→</span>
              </div>
            </CardContent>
          </Card>

          {/* 대화 시작 */}
          <Card className="card-hover border-2 group cursor-pointer shadow-sm hover:shadow-lg bg-gradient-to-br from-white/90 to-accent/10" onClick={() => router.push('/chat')}>
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <CardTitle className="text-xl">대화 시작</CardTitle>
              <CardDescription>
                페르소나와 실시간 대화를 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className="gradient-bg text-white shadow-md">인기</Badge>
                <span className="text-accent group-hover:translate-x-1 transition-transform text-lg">→</span>
              </div>
            </CardContent>
          </Card>

          {/* 대화 기록 */}
          <Card className="card-hover border-2 group cursor-pointer shadow-sm hover:shadow-lg bg-white/90" onClick={() => router.push('/history')}>
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📚</span>
              </div>
              <CardTitle className="text-xl">대화 기록</CardTitle>
              <CardDescription>
                이전 대화 내역을 확인하고 복습하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">기록 보기</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform text-lg">→</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 및 정보 섹션 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 계정 정보 */}
          <Card className="border-2 shadow-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">👤</span>
                계정 정보
              </CardTitle>
              <CardDescription>현재 계정 정보 및 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-100 transition-all">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">이메일</p>
                  <p className="font-semibold text-sm">{user?.email}</p>
                </div>
                <Badge variant="outline" className="bg-white shadow-sm">인증됨</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-cyan-100/50 hover:from-cyan-100 hover:to-cyan-100 transition-all">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">가입일</p>
                  <p className="font-semibold text-sm">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-100 transition-all">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">사용자 ID</p>
                  <p className="font-mono text-xs text-muted-foreground font-semibold">
                    {user?.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시작하기 가이드 */}
          <Card className="border-2 shadow-sm bg-gradient-to-br from-white/90 to-indigo-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">🚀</span>
                시작하기
              </CardTitle>
              <CardDescription>Personality Agent 활용 가이드</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/30 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-md">
                  1
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm">페르소나 생성</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    MBTI, DiSC, 애니어그램으로 나만의 페르소나 만들기
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-100/30 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-md">
                  2
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm">대화 시작</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AI 페르소나와 실시간으로 대화하며 감정 교류하기
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100/30 transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-md">
                  3
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm">대화 분석</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
