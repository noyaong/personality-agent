'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.fullName)
      router.push('/auth/verify-email')
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.')
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
            당신만의 페르소나를 만들어보세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <Card className="border-2 border-primary/20 shadow-xl animate-scale-in backdrop-blur-xl bg-card/40">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              회원가입
            </CardTitle>
            <CardDescription className="text-center">
              새 계정을 만들어 페르소나 시뮬레이션을 시작하세요
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
                <Label htmlFor="fullName" className="text-sm font-medium">
                  이름
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="홍길동"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="h-11"
                />
              </div>
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
                <Label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  최소 6자 이상 입력해주세요
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  비밀번호 확인
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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
                {loading ? '가입 중...' : '회원가입'}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  로그인
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* 하단 설명 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          가입과 동시에{' '}
          <Link href="/terms" className="underline hover:text-primary">
            이용약관
          </Link>
          {' '}및{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            개인정보처리방침
          </Link>
          에 동의합니다
        </p>
      </div>
    </div>
  )
}
