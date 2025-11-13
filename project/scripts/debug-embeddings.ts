/**
 * 임베딩 디버깅 스크립트
 * 저장된 임베딩 데이터 확인
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debugEmbeddings() {
  console.log('🔍 임베딩 디버깅 시작\n')

  // 1. 임베딩 데이터 조회
  const { data: patterns, error } = await supabase
    .from('conversation_patterns')
    .select('id, mbti, pattern_embedding')
    .limit(3)

  if (error) {
    console.error('❌ 조회 실패:', error)
    return
  }

  console.log(`✅ ${patterns?.length}개 패턴 조회 성공\n`)

  patterns?.forEach((pattern, idx) => {
    console.log(`패턴 ${idx + 1}: ${pattern.mbti} (${pattern.id})`)

    if (pattern.pattern_embedding) {
      const embedding = pattern.pattern_embedding
      console.log(`  타입: ${typeof embedding}`)
      console.log(`  값 확인: ${Array.isArray(embedding) ? '배열' : typeof embedding}`)

      if (Array.isArray(embedding)) {
        console.log(`  길이: ${embedding.length}`)
        console.log(`  샘플: [${embedding.slice(0, 5).join(', ')}...]`)
      } else if (typeof embedding === 'string') {
        console.log(`  문자열 길이: ${embedding.length}`)
        console.log(`  샘플: ${embedding.substring(0, 100)}...`)
      } else {
        console.log(`  내용:`, embedding)
      }
    } else {
      console.log(`  ⚠️  임베딩 없음`)
    }
    console.log()
  })

  // 2. 직접 SQL로 확인
  console.log('\n📊 직접 SQL 쿼리 실행\n')

  const { data: sqlResult, error: sqlError } = await supabase
    .rpc('exec_sql', {
      query: `
        SELECT
          id,
          mbti,
          pattern_embedding IS NOT NULL as has_embedding,
          pg_typeof(pattern_embedding) as embedding_type,
          array_length(pattern_embedding::vector, 1) as dimension
        FROM conversation_patterns
        LIMIT 5;
      `
    })
    .catch(() => {
      // exec_sql 함수가 없을 수 있으므로 fallback
      return { data: null, error: 'exec_sql not available' }
    })

  if (sqlResult) {
    console.log('SQL 결과:', sqlResult)
  } else {
    console.log('⚠️  직접 SQL 실행 불가 (exec_sql 함수 없음)')
  }

  // 3. 벡터 검색 함수 직접 테스트
  console.log('\n\n🧪 벡터 검색 함수 직접 테스트\n')

  // 임의의 1536차원 벡터 생성
  const testVector = Array(1536).fill(0).map(() => Math.random() * 2 - 1)

  const { data: searchResult, error: searchError } = await supabase.rpc('search_similar_patterns', {
    query_embedding: JSON.stringify(testVector),
    match_threshold: 0.0, // 매우 낮은 threshold로 테스트
    match_count: 5,
    mbti_filter: null,
    relationship_filter: null
  })

  if (searchError) {
    console.error('❌ 검색 실패:', searchError)
  } else {
    console.log(`✅ 검색 성공: ${searchResult?.length || 0}개 결과`)
    searchResult?.forEach((r: any, idx: number) => {
      console.log(`  ${idx + 1}. 유사도: ${(r.similarity * 100).toFixed(2)}%`)
    })
  }

  // 4. 특정 패턴의 임베딩 확인 및 재검색
  if (patterns && patterns[0]) {
    console.log('\n\n🔬 특정 패턴으로 재검색 테스트\n')
    const firstPattern = patterns[0]

    if (firstPattern.pattern_embedding) {
      // 저장된 임베딩으로 다시 검색
      const embedding = firstPattern.pattern_embedding

      const { data: selfSearch, error: selfError } = await supabase.rpc('search_similar_patterns', {
        query_embedding: JSON.stringify(embedding),
        match_threshold: 0.0,
        match_count: 5,
        mbti_filter: null,
        relationship_filter: null
      })

      if (selfError) {
        console.error('❌ 자기 검색 실패:', selfError)
      } else {
        console.log(`✅ 자기 검색 결과: ${selfSearch?.length || 0}개`)
        selfSearch?.forEach((r: any, idx: number) => {
          const isSelf = r.id === firstPattern.id
          console.log(`  ${idx + 1}. ${isSelf ? '👉 [자기 자신]' : ''} 유사도: ${(r.similarity * 100).toFixed(2)}%`)
        })
      }
    }
  }
}

debugEmbeddings()
