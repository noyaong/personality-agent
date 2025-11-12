'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 color-bends-bg">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-3 animate-fade-in">
            Personality Agent
          </h1>
          <p className="text-gray-600 text-lg animate-slide-up">
            AI 페르소나와 함께하는 감정의 대화
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="border-none shadow-2xl animate-scale-in bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center gradient-text">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-base">
              이메일과 비밀번호를 입력하여 로그인하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 animate-slide-up">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  이메일
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    비밀번호
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold gradient-bg text-white hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    로그인 중...
                  </span>
                ) : '로그인'}
              </Button>
              <p className="text-center text-sm text-gray-600 pt-2">
                계정이 없으신가요?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  회원가입
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* 하단 설명 */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            MBTI, DiSC, 애니어그램 기반 심리 분석 서비스
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🔒 안전한 로그인</span>
            <span>•</span>
            <span>💬 AI 대화</span>
            <span>•</span>
            <span>🎭 맞춤 페르소나</span>
          </div>
        </div>
      </div>
    </div>
  )
}
