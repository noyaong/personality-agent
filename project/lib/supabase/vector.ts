import { createClient as createServerClient } from '@supabase/supabase-js'

// Edge-compatible Supabase client
function getSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Store embedding vector for a persona profile
 * Uses raw SQL because Prisma doesn't support pgvector type
 */
export async function storePersonaEmbedding(
  personaId: string,
  embedding: number[]
): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.rpc('update_persona_embedding', {
    persona_id: personaId,
    embedding_vector: JSON.stringify(embedding),
  })

  if (error) {
    console.error('Failed to store persona embedding:', error)
    throw new Error('Failed to store persona embedding')
  }
}

/**
 * Store embedding vector for a conversation pattern
 * Uses raw SQL because Prisma doesn't support pgvector type
 */
export async function storePatternEmbedding(
  patternId: string,
  embedding: number[]
): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.rpc('update_pattern_embedding', {
    pattern_id: patternId,
    embedding_vector: JSON.stringify(embedding),
  })

  if (error) {
    console.error('Failed to store pattern embedding:', error)
    throw new Error('Failed to store pattern embedding')
  }
}

/**
 * Search for similar personas using vector similarity
 * Returns persona IDs ordered by similarity (most similar first)
 */
export async function searchSimilarPersonas(
  embedding: number[],
  limit: number = 10,
  threshold: number = 0.7
): Promise<Array<{ id: string; similarity: number }>> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc('search_similar_personas', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) {
    console.error('Failed to search similar personas:', error)
    throw new Error('Failed to search similar personas')
  }

  return data || []
}

/**
 * Search for similar conversation patterns using vector similarity
 * Returns pattern IDs ordered by similarity (most similar first)
 */
export async function searchSimilarPatterns(
  embedding: number[],
  mbti?: string,
  relationshipType?: string,
  limit: number = 10,
  threshold: number = 0.7
): Promise<Array<{ id: string; similarity: number; pattern_text: string }>> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc('search_similar_patterns', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: limit,
    mbti_filter: mbti || null,
    relationship_filter: relationshipType || null,
  })

  if (error) {
    console.error('Failed to search similar patterns:', error)
    throw new Error('Failed to search similar patterns')
  }

  return data || []
}
