/**
 * 모든 패턴의 임베딩을 재생성하는 스크립트
 * 기존 임베딩을 삭제하고 새로 생성
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

async function regenerateAllEmbeddings() {
  console.log('🔄 모든 패턴의 임베딩 재생성 시작\n')

  try {
    // 1. 모든 패턴 조회
    const { data: patterns, error: fetchError } = await supabase
      .from('conversation_patterns')
      .select('id, mbti, disc, enneagram, relationship_type, pattern_category, conversation_topic, emotional_context, pattern_text')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('❌ 패턴 조회 실패:', fetchError)
      return
    }

    if (!patterns || patterns.length === 0) {
      console.log('⚠️  패턴이 없습니다.')
      return
    }

    console.log(`📊 총 ${patterns.length}개 패턴 발견\n`)

    // 2. 각 패턴의 임베딩 재생성
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const progress = `[${i + 1}/${patterns.length}]`

      try {
        console.log(`${progress} ${pattern.mbti}+${pattern.disc}+${pattern.enneagram} / ${pattern.relationship_type}`)

        // 임베딩 텍스트 생성
        const embeddingText = `
MBTI: ${pattern.mbti}
DISC: ${pattern.disc}
Enneagram: ${pattern.enneagram}
Relationship: ${pattern.relationship_type}
Category: ${pattern.pattern_category}
Topic: ${pattern.conversation_topic || ''}
Context: ${pattern.emotional_context || ''}
Pattern: ${pattern.pattern_text}
        `.trim()

        // 임베딩 생성
        const embedding = await generateEmbedding(embeddingText)
        console.log(`  ✓ 임베딩 생성 완료 (${embedding.length}차원)`)

        // DB 업데이트 (RPC 함수 사용)
        const { error: updateError } = await supabase.rpc('update_pattern_embedding', {
          pattern_id: pattern.id,
          embedding_vector: JSON.stringify(embedding)
        })

        if (updateError) {
          console.error(`  ❌ 저장 실패:`, updateError.message)
          failCount++
        } else {
          console.log(`  ✓ 저장 완료`)
          successCount++
        }

        // Rate limiting (OpenAI API)
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error: any) {
        console.error(`  ❌ 에러:`, error.message)
        failCount++
      }

      console.log()
    }

    console.log('\n' + '='.repeat(80))
    console.log(`\n✅ 재생성 완료!`)
    console.log(`   성공: ${successCount}개`)
    console.log(`   실패: ${failCount}개`)

    // 3. 검증 테스트
    if (successCount > 0) {
      console.log('\n\n🧪 검증 테스트 중...\n')

      const testPattern = patterns[0]
      const testEmbeddingText = `
MBTI: ${testPattern.mbti}
DISC: ${testPattern.disc}
Enneagram: ${testPattern.enneagram}
Relationship: ${testPattern.relationship_type}
Category: ${testPattern.pattern_category}
Pattern: ${testPattern.pattern_text}
      `.trim()

      const testEmbedding = await generateEmbedding(testEmbeddingText)

      const { data: searchResult, error: searchError } = await supabase.rpc('search_similar_patterns', {
        query_embedding: JSON.stringify(testEmbedding),
        match_threshold: 0.5,
        match_count: 5,
        mbti_filter: null,
        relationship_filter: null
      })

      if (searchError) {
        console.error('❌ 검색 실패:', searchError)
      } else {
        console.log(`✅ 검색 성공: ${searchResult?.length || 0}개 결과`)

        if (searchResult && searchResult.length > 0) {
          const topResult = searchResult[0]
          const isSelf = topResult.id === testPattern.id

          console.log(`\n최고 유사도: ${(topResult.similarity * 100).toFixed(2)}%`)
          console.log(`자기 자신? ${isSelf ? '✅ 예' : '❌ 아니오'}`)

          if (topResult.similarity >= 0.95 && isSelf) {
            console.log('\n🎉 완벽합니다! 벡터 검색이 정상 작동합니다.')
          } else if (topResult.similarity >= 0.8) {
            console.log('\n✓ 양호합니다. 벡터 검색이 작동합니다.')
          } else {
            console.log('\n⚠️  유사도가 낮습니다. 추가 확인이 필요합니다.')
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ 에러 발생:', error)
    process.exit(1)
  }
}

regenerateAllEmbeddings()
