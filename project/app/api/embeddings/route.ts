import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { generateEmbedding, createPersonaEmbeddingText } from '@/lib/embeddings'
import { storePersonaEmbedding } from '@/lib/supabase/vector'

/**
 * POST /api/embeddings
 * Generate and store embeddings for persona profiles
 * Body: { personaId?: string } - If provided, generates for specific persona. Otherwise, generates for all without embeddings.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { personaId } = body

    let personas

    if (personaId) {
      // Generate embedding for specific persona
      const persona = await prisma.personaProfile.findFirst({
        where: {
          id: personaId,
          creatorId: user.id,
        },
      })

      if (!persona) {
        return NextResponse.json(
          { error: 'Persona not found or not authorized' },
          { status: 404 }
        )
      }

      personas = [persona]
    } else {
      // Generate embeddings for all personas without embeddings
      // Note: We can't check for NULL embedding through Prisma, so we'll process all
      personas = await prisma.personaProfile.findMany({
        where: {
          creatorId: user.id,
          isActive: true,
        },
      })
    }

    const results = []

    for (const persona of personas) {
      try {
        // Create text representation
        const embeddingText = createPersonaEmbeddingText(persona)

        // Generate embedding
        const embedding = await generateEmbedding(embeddingText)

        // Store embedding
        await storePersonaEmbedding(persona.id, embedding)

        results.push({
          personaId: persona.id,
          personaName: persona.personaName,
          status: 'success',
        })
      } catch (error: any) {
        console.error(`Failed to generate embedding for persona ${persona.id}:`, error)
        results.push({
          personaId: persona.id,
          personaName: persona.personaName,
          status: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      message: 'Embedding generation completed',
      results,
      total: personas.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
    })
  } catch (error: any) {
    console.error('Failed to generate embeddings:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
