'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
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

        {/* 이메일 확인 카드 */}
        <Card className="border-2 border-primary/20 shadow-xl animate-scale-in backdrop-blur-xl bg-card/40">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📧</span>
            </div>
            <CardTitle className="text-2xl font-bold">
              이메일을 확인해주세요
            </CardTitle>
            <CardDescription>
              회원가입이 거의 완료되었습니다!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
              <p className="font-medium mb-2 text-primary">✨ 확인 이메일을 발송했습니다</p>
              <p className="text-sm text-muted-foreground">
                가입하신 이메일 주소로 확인 링크를 보냈습니다.
                이메일의 링크를 클릭하여 계정을 활성화해주세요.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">이메일이 도착하지 않았나요?</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>스팸 또는 프로모션 폴더를 확인해주세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>이메일 주소가 올바른지 확인해주세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>몇 분 후에 다시 시도해주세요</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                이메일 확인 후 로그인하여 페르소나 생성을 시작하세요
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <Button className="w-full h-11 gradient-bg hover:opacity-90 transition-opacity">
                로그인 페이지로 이동
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full h-11">
                회원가입 다시 하기
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* 지원 정보 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          문제가 지속되나요?{' '}
          <Link href="/support" className="text-primary underline hover:no-underline">
            지원 센터
          </Link>
          에 문의하세요
        </p>
      </div>
    </div>
  )
}
