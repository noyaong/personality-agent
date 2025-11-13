/**
 * 마지막 6개 패턴 시딩
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/embeddings'
import { final6Patterns } from './final-6-patterns'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedFinal6() {
  console.log('🎯 마지막 6개 패턴 시딩\n')

  let successCount = 0

  for (const pattern of final6Patterns) {
    try {
      console.log(`${pattern.mbti}+${pattern.disc}+${pattern.enneagram}`)

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
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (e) {
      console.error('❌', e)
    }
  }

  const { count } = await supabase
    .from('conversation_patterns')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ 완료! 총 ${count}개`)
  if (count === 123) console.log('🎉 123개 목표 달성!')
}

seedFinal6()
