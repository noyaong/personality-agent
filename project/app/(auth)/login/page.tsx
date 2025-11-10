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
    <div className="flex min-h-screen items-center justify-center p-4 animate-fade-in color-bends-bg">

      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Personality Agent
          </h1>
          <p className="text-muted-foreground">
            AI 페르소나와 함께하는 감정의 대화
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="border-2 border-primary/20 shadow-xl animate-scale-in backdrop-blur-xl bg-card/40">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              로그인
            </CardTitle>
            <CardDescription className="text-center">
              이메일과 비밀번호를 입력하여 로그인하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-slide-up">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
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
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    비밀번호
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
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
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium gradient-bg hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                계정이 없으신가요?{' '}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  회원가입
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* 하단 설명 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          MBTI, DiSC, 애니어그램 기반 심리 분석 서비스
        </p>
      </div>
    </div>
  )
}
