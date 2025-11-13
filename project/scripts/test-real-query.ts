/**
 * 실제 사용자 쿼리로 벡터 검색 테스트
 * threshold 없이 상위 결과 확인
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

async function testRealQuery() {
  console.log('🔍 실제 쿼리 벡터 검색 테스트\n')

  const testQueries = [
    "부하 직원이 실수했을 때 어떻게 피드백해야 하나요?",
    "동료와 협업할 때 좋은 방법이 뭐가 있을까요?",
    "상사에게 보고할 때 주의할 점은?",
  ]

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📝 쿼리: "${query}"`)
    console.log('='.repeat(80))

    // 임베딩 생성
    const embedding = await generateEmbedding(query)
    console.log(`✅ 임베딩 생성 완료 (${embedding.length}차원)\n`)

    // threshold 0.0으로 상위 10개 조회
    const { data, error } = await supabase.rpc('search_similar_patterns', {
      query_embedding: JSON.stringify(embedding),
      match_threshold: 0.0, // threshold 없음
      match_count: 10,
      mbti_filter: null,
      relationship_filter: null
    })

    if (error) {
      console.error('❌ 검색 실패:', error)
      continue
    }

    console.log(`📊 결과: ${data?.length || 0}개\n`)

    if (data && data.length > 0) {
      data.forEach((result: any, idx: number) => {
        const similarity = (result.similarity * 100).toFixed(2)
        const preview = result.pattern_text.substring(0, 80).replace(/\n/g, ' ')
        console.log(`${idx + 1}. [${similarity}%] ${preview}...`)
      })

      const avgSimilarity = data.reduce((sum: number, r: any) => sum + r.similarity, 0) / data.length
      const maxSimilarity = Math.max(...data.map((r: any) => r.similarity))

      console.log(`\n📈 통계:`)
      console.log(`   최대 유사도: ${(maxSimilarity * 100).toFixed(2)}%`)
      console.log(`   평균 유사도: ${(avgSimilarity * 100).toFixed(2)}%`)

      // 권장 threshold
      if (maxSimilarity >= 0.7) {
        console.log(`\n💡 권장 threshold: 0.6-0.7 (높은 품질)`)
      } else if (maxSimilarity >= 0.5) {
        console.log(`\n💡 권장 threshold: 0.4-0.5 (중간 품질)`)
      } else {
        console.log(`\n⚠️  권장 threshold: 0.3-0.4 (낮은 유사도, 더 많은 패턴 필요)`)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n\n' + '='.repeat(80))
  console.log('✅ 테스트 완료\n')
}

testRealQuery()
