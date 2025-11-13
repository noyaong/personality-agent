/**
 * 최종 검증 스크립트
 * 123개 골든 패턴 품질 및 분포 확인
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/embeddings'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function finalVerification() {
  console.log('🔍 최종 검증 시작\n')

  try {
    // 1. 전체 패턴 조회
    const { data: patterns, error } = await supabase
      .from('conversation_patterns')
      .select('id, mbti, disc, enneagram, relationship_type, pattern_category, effectiveness_score')
      .order('mbti')

    if (error || !patterns) {
      console.error('❌ 패턴 조회 실패:', error)
      return
    }

    console.log(`📊 총 패턴 개수: ${patterns.length}개`)

    if (patterns.length === 123) {
      console.log('✅ 목표 123개 달성!\n')
    } else {
      console.log(`⚠️  목표 123개와 차이: ${patterns.length - 123}개\n`)
    }

    // 2. 고유 조합 확인
    const uniqueCombos = new Set(
      patterns.map(p => `${p.mbti}+${p.disc}+${p.enneagram}+${p.relationship_type}`)
    )

    console.log(`🎯 고유 조합: ${uniqueCombos.size}개`)

    if (uniqueCombos.size === patterns.length) {
      console.log('✅ 중복 없음\n')
    } else {
      console.log(`⚠️  중복 ${patterns.length - uniqueCombos.size}개 발견\n`)
    }

    // 3. MBTI별 분포
    const mbtiCount = patterns.reduce((acc: any, p) => {
      acc[p.mbti] = (acc[p.mbti] || 0) + 1
      return acc
    }, {})

    console.log('📈 MBTI별 분포:')
    const allMBTI = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
                     'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']

    allMBTI.forEach(mbti => {
      const count = mbtiCount[mbti] || 0
      const bar = '■'.repeat(count)
      const status = count >= 7 ? '✓' : '⚠️'
      console.log(`  ${status} ${mbti}: ${count}개 ${bar}`)
    })

    const avgMBTI = patterns.length / 16
    console.log(`\n평균: ${avgMBTI.toFixed(1)}개/MBTI`)

    // 4. 관계 타입별 분포
    const relCount = patterns.reduce((acc: any, p) => {
      acc[p.relationship_type] = (acc[p.relationship_type] || 0) + 1
      return acc
    }, {})

    console.log('\n👥 관계 타입별 분포:')
    Object.entries(relCount).forEach(([rel, count]) => {
      const percentage = ((count as number) / patterns.length * 100).toFixed(1)
      console.log(`  ${rel}: ${count}개 (${percentage}%)`)
    })

    // 5. 각 MBTI별 관계 타입 커버리지
    console.log('\n📊 MBTI별 관계 타입 커버리지:')
    allMBTI.forEach(mbti => {
      const mbtiPatterns = patterns.filter(p => p.mbti === mbti)
      const rels = new Set(mbtiPatterns.map(p => p.relationship_type))

      const hasAll = rels.size === 3
      const status = hasAll ? '✅' : '⚠️'
      const relList = Array.from(rels).join(', ')

      console.log(`  ${status} ${mbti}: ${rels.size}/3 (${relList})`)
    })

    // 6. Effectiveness Score 분석
    const scores = patterns.map(p => p.effectiveness_score || 0)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)

    console.log('\n📈 Effectiveness Score:')
    console.log(`  평균: ${avgScore.toFixed(3)}`)
    console.log(`  최소: ${minScore.toFixed(3)}`)
    console.log(`  최대: ${maxScore.toFixed(3)}`)

    const goodScores = scores.filter(s => s >= 0.8).length
    const percentage = (goodScores / scores.length * 100).toFixed(1)
    console.log(`  0.8 이상: ${goodScores}개 (${percentage}%)`)

    // 7. 벡터 검색 품질 테스트
    console.log('\n\n🧪 벡터 검색 품질 테스트\n')

    // 샘플 쿼리 테스트
    const testQueries = [
      { query: "부하 직원에게 피드백할 때", expected_rel: "subordinate" },
      { query: "동료와 협업할 때", expected_rel: "peer" },
      { query: "상사에게 보고할 때", expected_rel: "superior" }
    ]

    for (const test of testQueries) {
      const embedding = await generateEmbedding(test.query)

      const { data: results, error: searchError } = await supabase.rpc('search_similar_patterns', {
        query_embedding: JSON.stringify(embedding),
        match_threshold: 0.3,
        match_count: 3,
        mbti_filter: null,
        relationship_filter: null
      })

      if (searchError || !results || results.length === 0) {
        console.log(`❌ "${test.query}": 검색 실패 또는 결과 없음`)
      } else {
        const topResult = results[0]
        const similarity = (topResult.similarity * 100).toFixed(1)
        const relMatch = topResult.relationship_type === test.expected_rel ? '✅' : '⚠️'

        console.log(`${relMatch} "${test.query}"`)
        console.log(`   → ${topResult.relationship_type} (${similarity}% 유사도)`)
        console.log(`   → ${topResult.pattern_text.substring(0, 60)}...`)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // 8. 최종 결론
    console.log('\n\n' + '='.repeat(80))
    console.log('\n✅ 최종 검증 완료!\n')

    const allChecks = [
      patterns.length === 123,
      uniqueCombos.size === patterns.length,
      avgScore >= 0.8,
      Object.values(relCount).every(c => c as number >= 10)
    ]

    const passedChecks = allChecks.filter(Boolean).length

    console.log(`통과한 검증 항목: ${passedChecks}/${allChecks.length}`)

    if (passedChecks === allChecks.length) {
      console.log('\n🎉🎉🎉 모든 검증 통과! 골든 패턴 시스템 완료! 🎉🎉🎉\n')
    } else {
      console.log('\n⚠️  일부 검증 항목이 통과하지 못했습니다.\n')
    }

  } catch (error) {
    console.error('❌ 에러:', error)
  }
}

finalVerification()
