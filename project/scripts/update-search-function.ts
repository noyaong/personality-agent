/**
 * search_similar_patterns 함수 업데이트
 * relationship_type, mbti 등 추가 필드 반환
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function updateSearchFunction() {
  console.log('🔧 search_similar_patterns 함수 업데이트\n')

  const sqlPath = path.resolve(__dirname, '../prisma/migrations/vector_search_functions.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  try {
    // Execute the SQL to recreate the function
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql })

    if (error) {
      console.error('❌ 함수 업데이트 실패:', error)
      console.log('\n수동으로 Supabase SQL Editor에서 실행하세요.')
      console.log(`파일 위치: ${sqlPath}\n`)
      return
    }

    console.log('✅ 함수 업데이트 완료!\n')

  } catch (e: any) {
    console.error('❌ 에러:', e.message)
    console.log('\n⚠️  Supabase에 직접 SQL을 실행해야 합니다.')
    console.log(`\n파일 위치: ${sqlPath}`)
    console.log('\n1. Supabase Dashboard → SQL Editor 열기')
    console.log('2. 위 파일의 내용을 복사하여 붙여넣기')
    console.log('3. Run 버튼 클릭\n')
  }
}

updateSearchFunction()
