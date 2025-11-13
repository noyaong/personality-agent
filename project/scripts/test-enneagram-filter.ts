/**
 * 애니어그램 필터링 테스트
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

async function testEnneagramFilter() {
  console.log('🧪 애니어그램 필터링 테스트\n')

  const testQuery = "부하 직원이 실수했을 때 어떻게 피드백해야 하나요?"

  console.log(`쿼리: "${testQuery}"\n`)

  const embedding = await generateEmbedding(testQuery)

  // 테스트 케이스
  const testCases = [
    { enneagram: null, label: '필터 없음' },
    { enneagram: '5', label: 'Enneagram 5' },
    { enneagram: '6', label: 'Enneagram 6' },
    { enneagram: '1', label: 'Enneagram 1' },
  ]

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`테스트: ${testCase.label}`)
    console.log('='.repeat(60))

    const { data, error } = await supabase.rpc('search_similar_patterns', {
      query_embedding: JSON.stringify(embedding),
      match_threshold: 0.3,
      match_count: 5,
      mbti_filter: 'INTJ',
      relationship_filter: 'subordinate',
      enneagram_filter: testCase.enneagram,
    })

    if (error) {
      console.error('❌ 검색 실패:', error)
      continue
    }

    console.log(`\n📊 결과: ${data?.length || 0}개\n`)

    if (data && data.length > 0) {
      data.forEach((result: any, idx: number) => {
        console.log(`${idx + 1}. [${(result.similarity * 100).toFixed(1)}%] Enneagram ${result.enneagram}`)
        console.log(`   ${result.pattern_text.substring(0, 60)}...`)
      })
    } else {
      console.log('결과 없음')
    }

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n\n' + '='.repeat(60))
  console.log('✅ 테스트 완료')
}

testEnneagramFilter()
