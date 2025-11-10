'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import psychologyProfilesData from '@/data/psychology-profiles.json'

const psychologyProfiles = psychologyProfilesData as {
  mbti: Record<string, {
    name: string
    traits: string[]
    description: string
    communication: string
    decision: string
    information_processing: string
    stress_response: string
  }>
  disc: Record<string, {
    name: string
    traits: string[]
    behavior: string
    pace?: string
    priority?: string
    fear?: string
    combination?: string[]
  }>
  enneagram: Record<string, {
    name: string
    core_motivation: string
    core_fear: string
    traits: string[]
    wings: Record<string, {
      name: string
      traits: string[]
      behavior: string
    }>
  }>
}

interface FormData {
  name: string
  description: string
  mbti: string
  disc: string
  enneagram: string
  enneagramWing: string
  visibility: 'private' | 'public' | 'unlisted'
}

export default function NewPersonaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    mbti: '',
    disc: '',
    enneagram: '',
    enneagramWing: '',
    visibility: 'private',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mbtiTypes = Object.keys(psychologyProfiles.mbti)
  const discTypes = Object.keys(psychologyProfiles.disc)
  const enneagramTypes = Object.keys(psychologyProfiles.enneagram)

  const handleSubmit = async () => {
    if (!formData.name || !formData.mbti || !formData.disc || !formData.enneagram) {
      setError('모든 필수 항목을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 디버깅 로그
      console.log('🚀 Sending persona data:', {
        enneagram: formData.enneagram,
        enneagramWing: formData.enneagramWing,
      })

      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          mbti: formData.mbti,
          disc: formData.disc,
          enneagram: formData.enneagram,
          enneagramWing: formData.enneagramWing,
          visibility: formData.visibility,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '페르소나 생성에 실패했습니다.')
      }

      // 성공 시 페르소나 목록으로 이동
      router.push('/personas')
    } catch (err: any) {
      setError(err.message || '페르소나 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-xl font-bold gradient-text">새 페르소나 만들기</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step {step}/4</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-slide-up">
            {error}
          </div>
        )}

        <Card className="border-2">
          <CardHeader>
            <CardTitle>페르소나 프로필 설정</CardTitle>
            <CardDescription>
              AI와 대화할 페르소나의 심리 프로필을 설정해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={`step${step}`} onValueChange={(v) => setStep(Number(v.replace('step', '')))}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step1">기본 정보</TabsTrigger>
                <TabsTrigger value="step2" disabled={!formData.name}>MBTI</TabsTrigger>
                <TabsTrigger value="step3" disabled={!formData.mbti}>DiSC</TabsTrigger>
                <TabsTrigger value="step4" disabled={!formData.disc}>애니어그램</TabsTrigger>
              </TabsList>

              {/* Step 1: 기본 정보 */}
              <TabsContent value="step1" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">페르소나 이름 *</Label>
                  <Input
                    id="name"
                    placeholder="예: 따뜻한 친구, 엄격한 멘토"
                    defaultValue={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">페르소나 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="이 페르소나의 특징을 자유롭게 설명해주세요..."
                    rows={4}
                    defaultValue={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>공개 설정</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'private', label: '비공개', desc: '나만 사용' },
                      { value: 'unlisted', label: '링크 공유', desc: '링크를 아는 사람만' },
                      { value: 'public', label: '공개', desc: '모두에게 공개' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, visibility: option.value as FormData['visibility'] })}
                        className={`p-4 rounded-lg border-2 text-left ${
                          formData.visibility === option.value
                            ? 'persona-btn-selected'
                            : 'persona-btn'
                        }`}
                      >
                        <div className="font-medium mb-1">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.name}
                  className="w-full"
                >
                  다음: MBTI 선택
                </Button>
              </TabsContent>

              {/* Step 2: MBTI */}
              <TabsContent value="step2" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg">MBTI 유형 선택 *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      페르소나의 성격 유형을 선택해주세요
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {mbtiTypes.map((type) => {
                      const profile = psychologyProfiles.mbti[type]
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, mbti: type })}
                          className={`p-4 rounded-lg border-2 text-left hover:scale-105 ${
                            formData.mbti === type
                              ? 'persona-btn-selected'
                              : 'persona-btn'
                          }`}
                        >
                          <div className="font-bold text-lg mb-1">{type}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {profile.name}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {formData.mbti && psychologyProfiles.mbti[formData.mbti] && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <h3 className="font-bold text-lg mb-2">
                          {psychologyProfiles.mbti[formData.mbti].name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {psychologyProfiles.mbti[formData.mbti].description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {psychologyProfiles.mbti[formData.mbti].traits.map((trait: string) => (
                            <Badge key={trait} variant="secondary">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    이전
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.mbti}
                    className="flex-1"
                  >
                    다음: DiSC 선택
                  </Button>
                </div>
              </TabsContent>

              {/* Step 3: DiSC */}
              <TabsContent value="step3" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg">DiSC 유형 선택 *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      페르소나의 행동 스타일을 선택해주세요
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {discTypes.map((type) => {
                      const profile = psychologyProfiles.disc[type]
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, disc: type })}
                          className={`p-4 rounded-lg border-2 text-left hover:scale-105 ${
                            formData.disc === type
                              ? 'persona-btn-selected'
                              : 'persona-btn'
                          }`}
                        >
                          <div className="font-bold text-lg mb-1">{type}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {profile.name}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {formData.disc && psychologyProfiles.disc[formData.disc] && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <h3 className="font-bold text-lg mb-2">
                          {psychologyProfiles.disc[formData.disc].name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {psychologyProfiles.disc[formData.disc].behavior}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {psychologyProfiles.disc[formData.disc].traits.map((trait: string) => (
                            <Badge key={trait} variant="secondary">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    이전
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!formData.disc}
                    className="flex-1"
                  >
                    다음: 애니어그램 선택
                  </Button>
                </div>
              </TabsContent>

              {/* Step 4: 애니어그램 */}
              <TabsContent value="step4" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg">애니어그램 유형 선택 *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      페르소나의 핵심 동기를 선택해주세요
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {enneagramTypes.map((type) => {
                      const profile = psychologyProfiles.enneagram[type]
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, enneagram: type, enneagramWing: '' })}
                          className={`p-4 rounded-lg border-2 text-center hover:scale-105 ${
                            formData.enneagram === type
                              ? 'persona-btn-selected'
                              : 'persona-btn'
                          }`}
                        >
                          <div className="font-bold text-2xl mb-1">{type}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {profile.name}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {formData.enneagram && psychologyProfiles.enneagram[formData.enneagram] && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            유형 {formData.enneagram}: {psychologyProfiles.enneagram[formData.enneagram].name}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">핵심 동기:</span>{' '}
                              {psychologyProfiles.enneagram[formData.enneagram].core_motivation}
                            </p>
                            <p>
                              <span className="font-medium">핵심 두려움:</span>{' '}
                              {psychologyProfiles.enneagram[formData.enneagram].core_fear}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {psychologyProfiles.enneagram[formData.enneagram].traits.map((trait: string) => (
                              <Badge key={trait} variant="secondary">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Wing 선택 */}
                        <div className="space-y-2">
                          <Label>날개 유형 (선택사항)</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(psychologyProfiles.enneagram[formData.enneagram].wings).map(
                              ([wingKey, wing]) => {
                                // wingKey에서 wing 숫자만 추출 (예: "5w6" -> "6")
                                const wingNumber = wingKey.split('w')[1]
                                return (
                                  <button
                                    key={wingKey}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, enneagramWing: wingNumber })}
                                    className={`p-3 rounded-lg border-2 text-left ${
                                      formData.enneagramWing === wingNumber
                                        ? 'persona-btn-selected'
                                        : 'persona-btn'
                                    }`}
                                  >
                                    <div className="font-medium text-sm mb-1">{wingKey}</div>
                                    <div className="text-xs text-muted-foreground">{wing.name}</div>
                                  </button>
                                )
                              }
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    이전
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.enneagram || loading}
                    className="flex-1 gradient-bg"
                  >
                    {loading ? '생성 중...' : '페르소나 생성'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 요약 카드 */}
        {formData.name && (
          <Card className="mt-6 border-2 bg-gradient-to-br from-card to-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">선택한 프로필 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">이름</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              {formData.mbti && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">MBTI</span>
                  <Badge>{formData.mbti}</Badge>
                </div>
              )}
              {formData.disc && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">DiSC</span>
                  <Badge>{formData.disc}</Badge>
                </div>
              )}
              {formData.enneagram && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">애니어그램</span>
                  <Badge>
                    {formData.enneagram}
                    {formData.enneagramWing && ` ${formData.enneagramWing}`}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">공개 설정</span>
                <Badge variant="outline">
                  {formData.visibility === 'private' && '비공개'}
                  {formData.visibility === 'unlisted' && '링크 공유'}
                  {formData.visibility === 'public' && '공개'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
