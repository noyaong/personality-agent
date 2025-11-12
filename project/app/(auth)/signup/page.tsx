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
    <div className="flex min-h-screen items-center justify-center p-4 color-bends-bg">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-3 animate-fade-in">
            Personality Agent
          </h1>
          <p className="text-gray-600 text-lg animate-slide-up">
            당신만의 페르소나를 만들어보세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <Card className="border-none shadow-2xl animate-scale-in bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center gradient-text">
              회원가입
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-base">
              새 계정을 만들어 페르소나 시뮬레이션을 시작하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 animate-slide-up">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
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
                  className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
                />
              </div>
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
                  className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
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
                  className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
                />
                <p className="text-xs text-gray-500">
                  최소 6자 이상 입력해주세요
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
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
                  className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/80"
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
                    가입 중...
                  </span>
                ) : '회원가입'}
              </Button>
              <p className="text-center text-sm text-gray-600 pt-2">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  로그인
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* 하단 설명 */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-600">
            가입과 동시에{' '}
            <Link href="/terms" className="text-primary underline hover:text-primary/80">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="/privacy" className="text-primary underline hover:text-primary/80">
              개인정보처리방침
            </Link>
            에 동의합니다
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🎭 무료 서비스</span>
            <span>•</span>
            <span>💡 즉시 시작</span>
            <span>•</span>
            <span>🔐 안전한 보관</span>
          </div>
        </div>
      </div>
    </div>
  )
}
