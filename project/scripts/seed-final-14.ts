/**
 * 최종 14개 패턴 시딩 (109 + 14 = 123)
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/embeddings'
import { final14Patterns } from './final-14-patterns'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedFinal14() {
  console.log('🎯 최종 14개 패턴 시딩 (109 → 123)\n')

  let successCount = 0
  let failCount = 0

  for (const pattern of final14Patterns) {
    try {
      console.log(`${pattern.mbti}+${pattern.disc}+${pattern.enneagram}+${pattern.relationship_type}`)

      const embeddingText = `
MBTI: ${pattern.mbti}
DISC: ${pattern.disc}
Enneagram: ${pattern.enneagram}
Relationship: ${pattern.relationship_type}
Category: ${pattern.pattern_category}
Pattern: ${pattern.pattern_text}
      `.trim()

      const embedding = await generateEmbedding(embeddingText)
      const { data, error } = await supabase
        .from('conversation_patterns')
        .insert(pattern)
        .select()
        .single()

      if (!error) {
        await supabase.rpc('update_pattern_embedding', {
          pattern_id: data.id,
          embedding_vector: JSON.stringify(embedding)
        })
        successCount++
        console.log('✓')
      } else {
        console.error('❌', error.message)
        failCount++
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (e: any) {
      console.error('❌', e.message)
      failCount++
    }
  }

  const { count } = await supabase
    .from('conversation_patterns')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ 완료!`)
  console.log(`   성공: ${successCount}개`)
  console.log(`   실패: ${failCount}개`)
  console.log(`   총 패턴: ${count}개\n`)

  if (count === 123) {
    console.log('🎉🎉🎉 123개 목표 달성! 🎉🎉🎉\n')
  } else {
    console.log(`📊 목표 123개와 차이: ${(count || 0) - 123}개\n`)
  }
}

seedFinal14()
