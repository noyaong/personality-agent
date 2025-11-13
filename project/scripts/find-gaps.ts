/**
 * 부족한 조합 찾기 스크립트
 * 109개 현재, 123개 목표 = 14개 부족
 */

import { createClient } from '@supabase/supabase-js'
import { final6Patterns } from './final-6-patterns'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function findMissingCombinations() {
  console.log('🔍 부족한 조합 찾기\n')

  try {
    // 현재 패턴 조회
    const { data: patterns, error } = await supabase
      .from('conversation_patterns')
      .select('mbti, disc, enneagram, relationship_type')

    if (error || !patterns) {
      console.error('❌ 패턴 조회 실패:', error)
      return
    }

    console.log(`📊 현재: ${patterns.length}개`)
    console.log(`🎯 목표: 123개`)
    console.log(`⚠️  부족: ${123 - patterns.length}개\n`)

    // 기존 조합
    const existingCombos = new Set(
      patterns.map(p => `${p.mbti}+${p.disc}+${p.enneagram}+${p.relationship_type}`)
    )

    // final-6-patterns에서 추가될 조합 확인
    console.log('📋 final-6-patterns.ts에 정의된 조합:')
    const final6Combos = final6Patterns.map(p =>
      `${p.mbti}+${p.disc}+${p.enneagram}+${p.relationship_type}`
    )

    final6Combos.forEach((combo, idx) => {
      const exists = existingCombos.has(combo)
      console.log(`  ${idx + 1}. ${combo} ${exists ? '(이미 있음)' : '(새로운 조합)'}`)
    })

    const newFromFinal6 = final6Combos.filter(c => !existingCombos.has(c))
    console.log(`\n✨ final-6에서 새로 추가될 조합: ${newFromFinal6.length}개\n`)

    // 예상 총 개수
    const expectedAfterFinal6 = patterns.length + newFromFinal6.length
    console.log(`📈 final-6 시딩 후 예상: ${expectedAfterFinal6}개`)
    console.log(`📊 123개 목표와 차이: ${123 - expectedAfterFinal6}개\n`)

    if (expectedAfterFinal6 < 123) {
      console.log(`⚠️  ${123 - expectedAfterFinal6}개 더 필요합니다.\n`)

      // MBTI별 현황 분석
      const mbtiCount = patterns.reduce((acc: any, p) => {
        acc[p.mbti] = (acc[p.mbti] || 0) + 1
        return acc
      }, {})

      console.log('📈 MBTI별 현황 (부족한 순):')
      const allMBTI = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
                       'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']

      const mbtiWithCount = allMBTI.map(mbti => ({
        mbti,
        count: mbtiCount[mbti] || 0
      })).sort((a, b) => a.count - b.count)

      mbtiWithCount.forEach(({ mbti, count }) => {
        const bar = '■'.repeat(count)
        console.log(`  ${mbti}: ${count}개 ${bar}`)
      })

      // 관계 타입별 현황
      const relCount = patterns.reduce((acc: any, p) => {
        acc[p.relationship_type] = (acc[p.relationship_type] || 0) + 1
        return acc
      }, {})

      console.log('\n👥 관계 타입별 현황:')
      Object.entries(relCount).forEach(([rel, count]) => {
        console.log(`  ${rel}: ${count}개`)
      })

      // 부족한 MBTI에 필요한 패턴 제안
      const lackingMBTI = mbtiWithCount.filter(m => m.count < 8).slice(0, 5)
      console.log('\n💡 추가 패턴 제안 (부족한 MBTI):')
      lackingMBTI.forEach(({ mbti, count }) => {
        console.log(`  ${mbti} (현재 ${count}개) - ${8 - count}개 더 필요`)
      })

    } else if (expectedAfterFinal6 === 123) {
      console.log('✅ final-6 시딩 후 정확히 123개가 됩니다!')
    } else {
      console.log(`⚠️  final-6 시딩 후 ${expectedAfterFinal6 - 123}개 초과됩니다.`)
    }

  } catch (error) {
    console.error('❌ 에러:', error)
  }
}

findMissingCombinations()
