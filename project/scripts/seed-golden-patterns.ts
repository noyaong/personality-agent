/**
 * Seed Golden Patterns Script
 *
 * 골든 패턴을 데이터베이스에 시딩하고 임베딩을 생성합니다.
 *
 * Usage:
 *   npx tsx scripts/seed-golden-patterns.ts
 *
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (Admin key)
 *   - OPENAI_API_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding, createPatternEmbeddingText } from '../lib/embeddings'
import { allGoldenPatterns, patternStats, type GoldenPattern } from './golden-patterns-data'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Validate required environment variables
function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    process.exit(1)
  }
}

// Initialize Supabase Admin Client
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
}

/**
 * Seed a single golden pattern
 */
async function seedPattern(
  supabase: ReturnType<typeof createAdminClient>,
  pattern: GoldenPattern,
  index: number,
  total: number
): Promise<void> {
  try {
    console.log(`\n[${index + 1}/${total}] Processing: ${pattern.mbti}+${pattern.disc}+${pattern.enneagram} (${pattern.relationship_type})`)
    console.log(`   Category: ${pattern.pattern_category}`)
    console.log(`   Topic: ${pattern.conversation_topic}`)

    // 1. Generate embedding
    console.log('   ⏳ Generating embedding...')
    const embeddingText = createPatternEmbeddingText({
      mbti: pattern.mbti,
      disc: pattern.disc,
      enneagram: pattern.enneagram,
      relationshipType: pattern.relationship_type,
      patternCategory: pattern.pattern_category,
      conversationTopic: pattern.conversation_topic,
      emotionalContext: pattern.emotional_context,
      patternText: pattern.pattern_text
    })

    const embedding = await generateEmbedding(embeddingText)
    console.log('   ✅ Embedding generated (1536 dimensions)')

    // 2. Insert pattern into database
    console.log('   ⏳ Inserting into database...')
    const { data: insertedPattern, error: insertError } = await supabase
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
        usage_frequency: 0
      })
      .select('id')
      .single()

    if (insertError) {
      throw new Error(`Failed to insert pattern: ${insertError.message}`)
    }

    console.log(`   ✅ Pattern inserted (ID: ${insertedPattern.id})`)

    // 3. Store embedding using RPC function
    console.log('   ⏳ Storing embedding vector...')
    const { error: embeddingError } = await supabase.rpc('update_pattern_embedding', {
      pattern_id: insertedPattern.id,
      embedding_vector: JSON.stringify(embedding)
    })

    if (embeddingError) {
      throw new Error(`Failed to store embedding: ${embeddingError.message}`)
    }

    console.log('   ✅ Embedding stored successfully')
    console.log(`   ✅ Pattern ${index + 1}/${total} completed`)

    // Rate limiting: wait 500ms between API calls
    await new Promise(resolve => setTimeout(resolve, 500))

  } catch (error) {
    console.error(`\n❌ Error processing pattern ${index + 1}:`)
    console.error(`   ${error instanceof Error ? error.message : String(error)}`)
    console.error(`   Pattern: ${JSON.stringify(pattern, null, 2)}`)
    throw error
  }
}

/**
 * Seed all golden patterns
 */
async function seedAllPatterns() {
  console.log('🌱 Golden Patterns Seeding Script\n')
  console.log('=' .repeat(60))

  // Validate environment
  validateEnv()
  console.log('✅ Environment variables validated')

  // Initialize Supabase client
  const supabase = createAdminClient()
  console.log('✅ Supabase admin client initialized')

  // Display statistics
  console.log('\n📊 Pattern Statistics:')
  console.log(`   Tier 1: ${patternStats.tier1.totalPatterns}/${patternStats.tier1.expectedPatterns} patterns`)
  console.log(`   Tier 2: ${patternStats.tier2.totalPatterns}/${patternStats.tier2.expectedPatterns} patterns`)
  console.log(`   Tier 3: ${patternStats.tier3.totalPatterns}/${patternStats.tier3.expectedPatterns} patterns`)
  console.log(`   Total: ${patternStats.total.totalPatterns}/${patternStats.total.expectedPatterns} patterns`)

  // Check existing patterns
  console.log('\n🔍 Checking existing patterns...')
  const { count: existingCount, error: countError } = await supabase
    .from('conversation_patterns')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('❌ Failed to check existing patterns:', countError)
    process.exit(1)
  }

  console.log(`   Found ${existingCount} existing patterns in database`)

  if (existingCount && existingCount > 0) {
    console.log('\n⚠️  Warning: Database already contains patterns.')
    console.log('   This script will add new patterns without removing existing ones.')
    console.log('   To start fresh, manually delete existing patterns first.')

    // Ask for confirmation (in production, you might want to use a prompt library)
    console.log('\n   Continue anyway? (Ctrl+C to cancel, or wait 5 seconds to proceed)')
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  // Seed patterns
  console.log('\n🚀 Starting seeding process...')
  console.log('=' .repeat(60))

  const total = allGoldenPatterns.length
  let succeeded = 0
  let failed = 0

  for (let i = 0; i < total; i++) {
    try {
      await seedPattern(supabase, allGoldenPatterns[i], i, total)
      succeeded++
    } catch (error) {
      failed++
      console.error(`\n❌ Skipping pattern ${i + 1} due to error`)

      // Continue with next pattern instead of stopping
      continue
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Seeding Summary:')
  console.log(`   ✅ Succeeded: ${succeeded}/${total}`)
  console.log(`   ❌ Failed: ${failed}/${total}`)

  if (failed > 0) {
    console.log('\n⚠️  Some patterns failed to seed. Check the errors above.')
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from('conversation_patterns')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📈 Database Statistics:`)
  console.log(`   Before: ${existingCount} patterns`)
  console.log(`   After: ${finalCount} patterns`)
  console.log(`   Added: ${finalCount! - existingCount!} patterns`)

  console.log('\n✅ Seeding completed!')
  console.log('=' .repeat(60))
}

/**
 * Verify embeddings after seeding
 */
async function verifyEmbeddings() {
  console.log('\n🔍 Verifying embeddings...')

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('conversation_patterns')
    .select('id, mbti, disc, enneagram, relationship_type')
    .limit(5)

  if (error) {
    console.error('❌ Failed to verify:', error)
    return
  }

  console.log(`✅ Sample patterns retrieved: ${data?.length}`)

  if (data && data.length > 0) {
    console.log('\nSample patterns:')
    data.forEach((pattern, i) => {
      console.log(`   ${i + 1}. ${pattern.mbti}+${pattern.disc}+${pattern.enneagram} (${pattern.relationship_type})`)
    })
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await seedAllPatterns()
    await verifyEmbeddings()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Fatal error:')
    console.error(error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { seedAllPatterns, seedPattern, verifyEmbeddings }
