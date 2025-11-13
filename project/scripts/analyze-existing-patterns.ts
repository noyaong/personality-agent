/**
 * 기존 골든 패턴 분석 스크립트
 * 어떤 조합이 이미 있고, 무엇이 부족한지 파악
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function analyzeExistingPatterns() {
  console.log('📊 기존 골든 패턴 분석\n')

  try {
    // 모든 패턴 조회
    const { data: patterns, error } = await supabase
      .from('conversation_patterns')
      .select('mbti, disc, enneagram, relationship_type, pattern_category')
      .order('mbti')

    if (error || !patterns) {
      console.error('❌ 패턴 조회 실패:', error)
      return
    }

    console.log(`총 ${patterns.length}개 패턴\n`)

    // 1. MBTI별 개수
    const mbtiCount = patterns.reduce((acc: any, p) => {
      acc[p.mbti] = (acc[p.mbti] || 0) + 1
      return acc
    }, {})

    console.log('📈 MBTI별 분포:')
    Object.entries(mbtiCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .forEach(([mbti, count]) => {
        console.log(`  ${mbti}: ${count}개`)
      })

    // 2. 관계 타입별 개수
    const relCount = patterns.reduce((acc: any, p) => {
      acc[p.relationship_type] = (acc[p.relationship_type] || 0) + 1
      return acc
    }, {})

    console.log('\n👥 관계 타입별 분포:')
    Object.entries(relCount).forEach(([rel, count]) => {
      console.log(`  ${rel}: ${count}개`)
    })

    // 3. 카테고리별 개수
    const categoryCount = patterns.reduce((acc: any, p) => {
      acc[p.pattern_category] = (acc[p.pattern_category] || 0) + 1
      return acc
    }, {})

    console.log('\n📂 카테고리별 분포:')
    Object.entries(categoryCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}개`)
      })

    // 4. 고유 조합 (MBTI + DiSC + Enneagram)
    const combinations = new Set(
      patterns.map(p => `${p.mbti}+${p.disc}+${p.enneagram}`)
    )

    console.log(`\n🎯 고유 조합: ${combinations.size}개`)

    // 5. 조합별 패턴 개수
    const comboCount = patterns.reduce((acc: any, p) => {
      const key = `${p.mbti}+${p.disc}+${p.enneagram}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    console.log('\n📋 조합별 패턴 개수 (상위 10개):')
    Object.entries(comboCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([combo, count]) => {
        console.log(`  ${combo}: ${count}개`)
      })

    // 6. 부족한 MBTI 찾기
    const allMBTI = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
                     'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']

    const missingMBTI = allMBTI.filter(mbti => !mbtiCount[mbti])

    if (missingMBTI.length > 0) {
      console.log('\n⚠️  패턴이 없는 MBTI:')
      missingMBTI.forEach(mbti => console.log(`  - ${mbti}`))
    }

    // 7. 각 MBTI별로 부족한 관계 타입
    console.log('\n📊 MBTI별 관계 타입 커버리지:')
    allMBTI.forEach(mbti => {
      const mbtiPatterns = patterns.filter(p => p.mbti === mbti)
      const rels = new Set(mbtiPatterns.map(p => p.relationship_type))
      const missing = ['superior', 'peer', 'subordinate'].filter(r => !rels.has(r))

      if (mbtiPatterns.length > 0) {
        console.log(`  ${mbti}: ${rels.size}/3 (${missing.length > 0 ? `부족: ${missing.join(', ')}` : '완료'})`)
      }
    })

    // 8. 전체 조합 목록 저장 (다음 단계에서 사용)
    console.log('\n💾 기존 조합 목록을 파일로 저장...')
    const fs = await import('fs')
    const existingCombos = Array.from(combinations).sort()
    fs.writeFileSync(
      path.resolve(__dirname, '../data/existing-combinations.json'),
      JSON.stringify(existingCombos, null, 2)
    )
    console.log(`✅ ${existingCombos.length}개 조합 저장 완료`)

  } catch (error) {
    console.error('❌ 에러:', error)
  }
}

analyzeExistingPatterns()
