/**
 * 패턴 개수 검증 스크립트
 * 중복 여부, 실제 고유 조합 개수 확인
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyPatternCount() {
  console.log('🔍 패턴 개수 검증\n')

  try {
    // 전체 패턴 조회
    const { data: patterns, error } = await supabase
      .from('conversation_patterns')
      .select('id, mbti, disc, enneagram, relationship_type, pattern_category, created_at')
      .order('created_at', { ascending: true })

    if (error || !patterns) {
      console.error('❌ 패턴 조회 실패:', error)
      return
    }

    console.log(`📊 총 패턴 개수: ${patterns.length}개\n`)

    // 고유 조합 (mbti+disc+enneagram+relationship_type)
    const uniqueCombos = new Map<string, any[]>()

    patterns.forEach(pattern => {
      const key = `${pattern.mbti}+${pattern.disc}+${pattern.enneagram}+${pattern.relationship_type}`
      if (!uniqueCombos.has(key)) {
        uniqueCombos.set(key, [])
      }
      uniqueCombos.get(key)!.push(pattern)
    })

    console.log(`🎯 고유 조합 개수: ${uniqueCombos.size}개\n`)

    // 중복 조합 찾기
    const duplicates = Array.from(uniqueCombos.entries())
      .filter(([_, patterns]) => patterns.length > 1)
      .sort((a, b) => b[1].length - a[1].length)

    if (duplicates.length > 0) {
      console.log(`⚠️  중복된 조합: ${duplicates.length}개\n`)

      let totalDuplicates = 0
      duplicates.forEach(([combo, patterns]) => {
        console.log(`${combo}: ${patterns.length}개`)
        totalDuplicates += patterns.length - 1 // 첫 번째는 제외
      })

      console.log(`\n중복으로 인한 초과 패턴: ${totalDuplicates}개`)
      console.log(`실제 고유 패턴: ${patterns.length - totalDuplicates}개\n`)

      // 중복 상세 정보
      console.log('\n📋 중복 패턴 상세:')
      duplicates.slice(0, 10).forEach(([combo, patterns]) => {
        console.log(`\n${combo}:`)
        patterns.forEach(p => {
          const date = new Date(p.created_at).toISOString().split('T')[0]
          console.log(`  - ID ${p.id} (${date}) [${p.pattern_category}]`)
        })
      })

      if (duplicates.length > 10) {
        console.log(`\n... 외 ${duplicates.length - 10}개 조합`)
      }
    } else {
      console.log('✅ 중복 없음\n')
    }

    // MBTI별 분포
    const mbtiCount = patterns.reduce((acc: any, p) => {
      acc[p.mbti] = (acc[p.mbti] || 0) + 1
      return acc
    }, {})

    console.log('\n📈 MBTI별 분포:')
    Object.entries(mbtiCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .forEach(([mbti, count]) => {
        console.log(`  ${mbti}: ${count}개`)
      })

    // 관계 타입별 분포
    const relCount = patterns.reduce((acc: any, p) => {
      acc[p.relationship_type] = (acc[p.relationship_type] || 0) + 1
      return acc
    }, {})

    console.log('\n👥 관계 타입별 분포:')
    Object.entries(relCount).forEach(([rel, count]) => {
      console.log(`  ${rel}: ${count}개`)
    })

    // 기대값 vs 실제값
    console.log('\n📊 기대값 분석:')
    console.log(`  기대 총 개수: 123개`)
    console.log(`  실제 총 개수: ${patterns.length}개`)
    console.log(`  차이: ${patterns.length - 123}개 (${patterns.length > 123 ? '+' : ''}${((patterns.length - 123) / 123 * 100).toFixed(1)}%)`)

    // 타임스탬프 분석
    const createdDates = patterns.map(p => new Date(p.created_at).toISOString().split('T')[0])
    const dateCount = createdDates.reduce((acc: any, date) => {
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    console.log('\n📅 날짜별 생성 개수:')
    Object.entries(dateCount)
      .sort((a: any, b: any) => a[0].localeCompare(b[0]))
      .forEach(([date, count]) => {
        console.log(`  ${date}: ${count}개`)
      })

  } catch (error) {
    console.error('❌ 에러:', error)
  }
}

verifyPatternCount()
