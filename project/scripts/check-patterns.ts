/**
 * 골든 패턴 확인 스크립트
 * DB에 저장된 conversation_patterns 확인
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// .env.local 로드
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkPatterns() {
  console.log('🔍 골든 패턴 확인 중...\n')

  try {
    // 전체 패턴 개수
    const { count, error: countError } = await supabase
      .from('conversation_patterns')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ 패턴 개수 조회 실패:', countError)
      return
    }

    console.log(`📊 총 패턴 개수: ${count}개\n`)

    // MBTI별 분포
    const { data: mbtiData, error: mbtiError } = await supabase
      .from('conversation_patterns')
      .select('mbti')

    if (!mbtiError && mbtiData) {
      const mbtiCounts = mbtiData.reduce((acc: any, row: any) => {
        acc[row.mbti] = (acc[row.mbti] || 0) + 1
        return acc
      }, {})

      console.log('📈 MBTI별 분포:')
      Object.entries(mbtiCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .forEach(([mbti, count]) => {
          console.log(`  ${mbti}: ${count}개`)
        })
      console.log()
    }

    // 관계 타입별 분포
    const { data: relData, error: relError } = await supabase
      .from('conversation_patterns')
      .select('relationship_type')

    if (!relError && relData) {
      const relCounts = relData.reduce((acc: any, row: any) => {
        acc[row.relationship_type] = (acc[row.relationship_type] || 0) + 1
        return acc
      }, {})

      console.log('👥 관계 타입별 분포:')
      Object.entries(relCounts).forEach(([rel, count]) => {
        console.log(`  ${rel}: ${count}개`)
      })
      console.log()
    }

    // 임베딩 생성 여부 확인
    const { data: embeddingData, error: embError } = await supabase
      .from('conversation_patterns')
      .select('id, pattern_embedding')
      .limit(5)

    if (!embError && embeddingData) {
      const withEmbedding = embeddingData.filter((row: any) => row.pattern_embedding !== null).length
      console.log(`🧬 임베딩 생성 상태: ${withEmbedding}/${embeddingData.length} (샘플)`)

      if (withEmbedding === 0) {
        console.log('⚠️  경고: 임베딩이 생성되지 않았습니다!')
      }
      console.log()
    }

    // 샘플 패턴 출력
    const { data: samples, error: sampleError } = await supabase
      .from('conversation_patterns')
      .select('mbti, disc, enneagram, relationship_type, pattern_category, pattern_text')
      .limit(3)

    if (!sampleError && samples) {
      console.log('📋 샘플 패턴 (3개):')
      samples.forEach((pattern: any, idx: number) => {
        console.log(`\n${idx + 1}. [${pattern.mbti}+${pattern.disc}+${pattern.enneagram}] ${pattern.relationship_type}`)
        console.log(`   카테고리: ${pattern.pattern_category}`)
        console.log(`   내용: ${pattern.pattern_text.substring(0, 100)}...`)
      })
    }

    console.log('\n✅ 확인 완료!')

  } catch (error) {
    console.error('❌ 에러 발생:', error)
  }
}

checkPatterns()
