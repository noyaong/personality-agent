-- ============================================================================
-- 패턴 사용 추적 함수 및 로깅 테이블
-- Created: 2025-11-14
-- ============================================================================

-- 패턴 사용 로그 테이블
CREATE TABLE IF NOT EXISTS pattern_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 연결 정보
  chat_session_id UUID,
  pattern_id UUID NOT NULL REFERENCES conversation_patterns(id) ON DELETE CASCADE,

  -- 패턴 사용 정보
  similarity_score FLOAT NOT NULL,
  user_message TEXT NOT NULL,
  relationship_type VARCHAR(20),

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 인덱스
  CONSTRAINT valid_similarity CHECK (similarity_score BETWEEN 0 AND 1)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pattern_usage_logs_pattern_id ON pattern_usage_logs(pattern_id);
CREATE INDEX IF NOT EXISTS idx_pattern_usage_logs_session_id ON pattern_usage_logs(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_pattern_usage_logs_created_at ON pattern_usage_logs(created_at DESC);

-- 코멘트
COMMENT ON TABLE pattern_usage_logs IS '대화 패턴 사용 로그 - 패턴 활용도 추적';
COMMENT ON COLUMN pattern_usage_logs.similarity_score IS '사용자 메시지와의 유사도 (0-1)';
COMMENT ON COLUMN pattern_usage_logs.user_message IS '사용자가 입력한 메시지';

-- ============================================================================
-- 패턴 사용 카운트 증가 함수
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_pattern_usage(
  p_pattern_id UUID,
  p_similarity_score FLOAT DEFAULT NULL,
  p_user_message TEXT DEFAULT NULL,
  p_chat_session_id UUID DEFAULT NULL,
  p_relationship_type VARCHAR(20) DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- usage_frequency 증가
  UPDATE conversation_patterns
  SET usage_frequency = usage_frequency + 1
  WHERE id = p_pattern_id;

  -- 로그 기록 (선택적)
  IF p_similarity_score IS NOT NULL AND p_user_message IS NOT NULL THEN
    INSERT INTO pattern_usage_logs (
      pattern_id,
      chat_session_id,
      similarity_score,
      user_message,
      relationship_type
    ) VALUES (
      p_pattern_id,
      p_chat_session_id,
      p_similarity_score,
      p_user_message,
      p_relationship_type
    );
  END IF;
END;
$$;

COMMENT ON FUNCTION increment_pattern_usage IS '패턴 사용 시 usage_frequency 증가 및 로그 기록';

-- ============================================================================
-- 패턴 사용 통계 뷰
-- ============================================================================

CREATE OR REPLACE VIEW pattern_usage_stats AS
SELECT
  cp.id,
  cp.mbti,
  cp.disc,
  cp.enneagram,
  cp.relationship_type,
  cp.pattern_category,
  cp.usage_frequency,
  cp.effectiveness_score,
  COUNT(pul.id) as log_count,
  AVG(pul.similarity_score) as avg_similarity,
  MAX(pul.created_at) as last_used_at
FROM conversation_patterns cp
LEFT JOIN pattern_usage_logs pul ON cp.id = pul.pattern_id
GROUP BY cp.id;

COMMENT ON VIEW pattern_usage_stats IS '패턴별 사용 통계 집계';

-- ============================================================================
-- RLS 정책 (pattern_usage_logs)
-- ============================================================================

-- RLS 활성화
ALTER TABLE pattern_usage_logs ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자는 자신의 세션 로그 조회 가능
CREATE POLICY "Users can view their own session logs"
  ON pattern_usage_logs
  FOR SELECT
  USING (
    chat_session_id IS NULL OR
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = pattern_usage_logs.chat_session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
