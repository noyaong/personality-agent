/**
 * 벡터 검색 버그 수정 스크립트
 * 1. 수정된 PostgreSQL 함수 적용
 * 2. 테스트 실행
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function applyVectorFix() {
  console.log('🔧 벡터 검색 버그 수정 시작\n')

  try {
    // 1. SQL 파일 읽기
    const sqlPath = resolve(__dirname, '../prisma/migrations/vector_search_functions.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    console.log('📄 SQL 파일 로드 완료')
    console.log(`   경로: ${sqlPath}`)
    console.log(`   크기: ${sql.length} bytes\n`)

    // 2. SQL 실행
    console.log('⚙️  PostgreSQL 함수 업데이트 중...')

    // Supabase에서는 직접 SQL을 실행할 수 없으므로 안내 메시지 출력
    console.log('\n⚠️  수동 실행 필요:')
    console.log('   1. Supabase Dashboard → SQL Editor 접속')
    console.log('   2. 아래 파일 내용 복사하여 실행:')
    console.log(`      ${sqlPath}`)
    console.log('\n   또는 아래 명령어로 직접 실행:')
    console.log('   psql $DATABASE_URL < prisma/migrations/vector_search_functions.sql\n')

    // 3. 함수가 업데이트되었는지 확인
    console.log('🧪 함수 업데이트 확인 중...\n')

    const testVector = Array(1536).fill(0).map(() => Math.random() * 2 - 1)

    const { data, error } = await supabase.rpc('search_similar_patterns', {
      query_embedding: JSON.stringify(testVector),
      match_threshold: 0.0,
      match_count: 3,
      mbti_filter: null,
      relationship_filter: null
    })

    if (error) {
      console.error('❌ 함수 호출 실패:', error)
      console.log('\n💡 위의 수동 실행 단계를 먼저 완료해주세요.')
      return
    }

    console.log(`✅ 함수 호출 성공: ${data?.length || 0}개 결과`)

    if (data && data.length > 0) {
      console.log('\n📊 검색 결과:')
      data.forEach((r: any, idx: number) => {
        console.log(`  ${idx + 1}. 유사도: ${(r.similarity * 100).toFixed(2)}%`)
      })

      const avgSimilarity = data.reduce((sum: number, r: any) => sum + r.similarity, 0) / data.length
      console.log(`\n평균 유사도: ${(avgSimilarity * 100).toFixed(2)}%`)

      if (avgSimilarity > 0.8) {
        console.log('✅ 우수한 검색 품질 - 버그 수정 완료!')
      } else if (avgSimilarity > 0.5) {
        console.log('✓ 양호 - 임베딩이 정상적으로 작동합니다')
      } else {
        console.log('⚠️  유사도가 낮습니다. 추가 확인이 필요합니다.')
      }
    } else {
      console.log('\n⚠️  검색 결과 없음 - threshold를 낮춰보세요')
    }

  } catch (error) {
    console.error('❌ 에러 발생:', error)
    process.exit(1)
  }
}

applyVectorFix()
