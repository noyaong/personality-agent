-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop ALL existing variants of these functions (to avoid conflicts)
-- We use CASCADE to drop any dependent objects
DROP FUNCTION IF EXISTS update_persona_embedding CASCADE;
DROP FUNCTION IF EXISTS update_pattern_embedding CASCADE;
DROP FUNCTION IF EXISTS search_similar_personas CASCADE;
DROP FUNCTION IF EXISTS search_similar_patterns CASCADE;

-- Function to update persona profile embedding
CREATE FUNCTION update_persona_embedding(
  persona_id UUID,
  embedding_vector TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE persona_profiles
  SET profile_embedding = embedding_vector::vector(1536)
  WHERE id = persona_id;
END;
$$;

-- Function to update conversation pattern embedding
CREATE FUNCTION update_pattern_embedding(
  pattern_id UUID,
  embedding_vector TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE conversation_patterns
  SET pattern_embedding = embedding_vector::vector(1536)
  WHERE id = pattern_id;
END;
$$;

-- Function to search similar personas using cosine similarity
CREATE FUNCTION search_similar_personas(
  query_embedding TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    persona_profiles.id,
    1 - (persona_profiles.profile_embedding <=> query_embedding::vector(1536)) AS similarity
  FROM persona_profiles
  WHERE
    persona_profiles.profile_embedding IS NOT NULL
    AND persona_profiles.is_active = true
    AND 1 - (persona_profiles.profile_embedding <=> query_embedding::vector(1536)) >= match_threshold
  ORDER BY persona_profiles.profile_embedding <=> query_embedding::vector(1536)
  LIMIT match_count;
END;
$$;

-- Function to search similar conversation patterns
CREATE FUNCTION search_similar_patterns(
  query_embedding TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  mbti_filter VARCHAR(4) DEFAULT NULL,
  relationship_filter VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  similarity FLOAT,
  pattern_text TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    conversation_patterns.id,
    1 - (conversation_patterns.pattern_embedding <=> query_embedding::vector(1536)) AS similarity,
    conversation_patterns.pattern_text
  FROM conversation_patterns
  WHERE
    conversation_patterns.pattern_embedding IS NOT NULL
    AND 1 - (conversation_patterns.pattern_embedding <=> query_embedding::vector(1536)) >= match_threshold
    AND (mbti_filter IS NULL OR conversation_patterns.mbti = mbti_filter)
    AND (relationship_filter IS NULL OR conversation_patterns.relationship_type = relationship_filter)
  ORDER BY conversation_patterns.pattern_embedding <=> query_embedding::vector(1536)
  LIMIT match_count;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_persona_embedding ON persona_profiles
USING ivfflat (profile_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_pattern_embedding ON conversation_patterns
USING ivfflat (pattern_embedding vector_cosine_ops)
WITH (lists = 100);

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_persona_embedding TO authenticated;
GRANT EXECUTE ON FUNCTION update_pattern_embedding TO authenticated;
GRANT EXECUTE ON FUNCTION search_similar_personas TO authenticated;
GRANT EXECUTE ON FUNCTION search_similar_patterns TO authenticated;
