import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

/**
 * Generate embedding vector for text using OpenAI's text-embedding-3-small model
 * Returns a 1536-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: text,
    })

    return embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    )

    return embeddings
  } catch (error) {
    console.error('Failed to generate embeddings:', error)
    throw new Error('Failed to generate embeddings')
  }
}

/**
 * Create a text representation of a persona profile for embedding
 * Combines all relevant fields into a single searchable string
 */
export function createPersonaEmbeddingText(persona: {
  personaName: string
  personaDescription?: string | null
  mbti: string
  disc?: string | null
  enneagram?: string | null
  traits?: any
  communicationStyle?: any
  behavioralPatterns?: any
}): string {
  const parts: string[] = [
    `Name: ${persona.personaName}`,
    `MBTI: ${persona.mbti}`,
  ]

  if (persona.personaDescription) {
    parts.push(`Description: ${persona.personaDescription}`)
  }

  if (persona.disc) {
    parts.push(`DISC: ${persona.disc}`)
  }

  if (persona.enneagram) {
    parts.push(`Enneagram: ${persona.enneagram}`)
  }

  if (persona.traits) {
    try {
      const traitsStr = typeof persona.traits === 'string'
        ? persona.traits
        : JSON.stringify(persona.traits)
      parts.push(`Traits: ${traitsStr}`)
    } catch {
      // Skip if traits can't be stringified
    }
  }

  if (persona.communicationStyle) {
    try {
      const styleStr = typeof persona.communicationStyle === 'string'
        ? persona.communicationStyle
        : JSON.stringify(persona.communicationStyle)
      parts.push(`Communication Style: ${styleStr}`)
    } catch {
      // Skip if communicationStyle can't be stringified
    }
  }

  if (persona.behavioralPatterns) {
    try {
      const patternsStr = typeof persona.behavioralPatterns === 'string'
        ? persona.behavioralPatterns
        : JSON.stringify(persona.behavioralPatterns)
      parts.push(`Behavioral Patterns: ${patternsStr}`)
    } catch {
      // Skip if behavioralPatterns can't be stringified
    }
  }

  return parts.join('. ')
}

/**
 * Create a text representation of a conversation pattern for embedding
 */
export function createPatternEmbeddingText(pattern: {
  mbti: string
  disc?: string | null
  enneagram?: string | null
  relationshipType: string
  patternCategory: string
  conversationTopic?: string | null
  emotionalContext?: string | null
  patternText: string
}): string {
  const parts: string[] = [
    `MBTI: ${pattern.mbti}`,
    `Relationship: ${pattern.relationshipType}`,
    `Category: ${pattern.patternCategory}`,
    `Pattern: ${pattern.patternText}`,
  ]

  if (pattern.disc) {
    parts.push(`DISC: ${pattern.disc}`)
  }

  if (pattern.enneagram) {
    parts.push(`Enneagram: ${pattern.enneagram}`)
  }

  if (pattern.conversationTopic) {
    parts.push(`Topic: ${pattern.conversationTopic}`)
  }

  if (pattern.emotionalContext) {
    parts.push(`Context: ${pattern.emotionalContext}`)
  }

  return parts.join('. ')
}
