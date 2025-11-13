/**
 * 추가 72개 골든 패턴 시딩 스크립트
 * 기존 51개 + 72개 = 총 123개 완성
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/embeddings'
import { additionalPatterns } from './additional-patterns-data'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedAdditionalPatterns() {
  console.log('🌱 추가 골든 패턴 시딩 시작\n')
  console.log(`총 ${additionalPatterns.length}개 패턴을 추가합니다.\n`)

  let successCount = 0
  let failCount = 0
  const errors: any[] = []

  for (let i = 0; i < additionalPatterns.length; i++) {
    const pattern = additionalPatterns[i]
    const progress = `[${i + 1}/${additionalPatterns.length}]`

    try {
      console.log(`${progress} ${pattern.mbti}+${pattern.disc}+${pattern.enneagram} / ${pattern.relationship_type}`)
      console.log(`   카테고리: ${pattern.pattern_category}`)

      // 1. 패턴 텍스트로 임베딩 생성
      const embeddingText = `
MBTI: ${pattern.mbti}
DISC: ${pattern.disc}
Enneagram: ${pattern.enneagram}
Relationship: ${pattern.relationship_type}
Category: ${pattern.pattern_category}
Topic: ${pattern.conversation_topic}
Context: ${pattern.emotional_context}
Pattern: ${pattern.pattern_text}
      `.trim()

      const embedding = await generateEmbedding(embeddingText)
      console.log(`   ✓ 임베딩 생성 완료 (${embedding.length}차원)`)

      // 2. DB에 패턴 저장
      const { data, error } = await supabase
        .from('conversation_patterns')
        .insert({
          mbti: pattern.mbti,
          disc: pattern.disc,
          enneagram: pattern.enneagram,
          relationship_type: pattern.relationship_type,
          pattern_category: pattern.pattern_category,
          conversation_topic: pattern.conversation_topic,
          emotional_context: pattern.emotional_context,
          pattern_text: pattern.pattern_text,
          example_responses: pattern.example_responses,
          effectiveness_score: pattern.effectiveness_score,
          usage_frequency: 0,
        })
        .select()
        .single()

      if (error) {
        console.error(`   ❌ 패턴 저장 실패:`, error.message)
        failCount++
        errors.push({ pattern, error: error.message })
        continue
      }

      console.log(`   ✓ 패턴 저장 완료 (ID: ${data.id})`)

      // 3. 임베딩 저장 (RPC 함수 사용)
      const { error: embeddingError } = await supabase.rpc('update_pattern_embedding', {
        pattern_id: data.id,
        embedding_vector: JSON.stringify(embedding)
      })

      if (embeddingError) {
        console.error(`   ❌ 임베딩 저장 실패:`, embeddingError.message)
        failCount++
        errors.push({ pattern, error: embeddingError.message })
      } else {
        console.log(`   ✓ 임베딩 저장 완료`)
        successCount++
      }

      // Rate limiting (OpenAI API: 500 RPM, 150,000 TPM)
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error: any) {
      console.error(`   ❌ 에러:`, error.message)
      failCount++
      errors.push({ pattern, error: error.message })
    }

    console.log()
  }

  console.log('\n' + '='.repeat(80))
  console.log(`\n✅ 시딩 완료!`)
  console.log(`   성공: ${successCount}개`)
  console.log(`   실패: ${failCount}개`)

  if (errors.length > 0) {
    console.log(`\n⚠️  에러 발생한 패턴:`)
    errors.forEach(({ pattern, error }) => {
      console.log(`   - ${pattern.mbti}+${pattern.disc}+${pattern.enneagram}: ${error}`)
    })
  }

  // 전체 패턴 개수 확인
  const { count } = await supabase
    .from('conversation_patterns')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 전체 골든 패턴: ${count}개`)

  if (count === 123) {
    console.log('🎉 목표 달성! 123개 골든 패턴 완성!')
  }
}

seedAdditionalPatterns()
