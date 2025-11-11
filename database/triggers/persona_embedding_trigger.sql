-- ============================================================================
-- Persona Profile Embedding Trigger
-- ============================================================================
-- 페르소나가 생성되거나 업데이트될 때 자동으로 Edge Function을 호출하여
-- embedding을 생성하는 트리거

-- 1. Edge Function 호출 함수 생성
CREATE OR REPLACE FUNCTION trigger_generate_persona_embedding()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  function_url text;
BEGIN
  -- Supabase Edge Function URL 구성
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/generate-persona-embedding';

  -- Edge Function 비동기 호출 (pg_net 사용)
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'record', row_to_json(NEW)
    )
  ) INTO request_id;

  -- 트리거는 원래 작업을 계속 진행
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 트리거 생성 (INSERT 및 UPDATE 시)
DROP TRIGGER IF EXISTS persona_profile_embedding_trigger ON persona_profiles;

CREATE TRIGGER persona_profile_embedding_trigger
  AFTER INSERT OR UPDATE OF persona_name, persona_description, mbti, disc, enneagram, traits, communication_style, behavioral_patterns
  ON persona_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_persona_embedding();

-- 3. 주석
COMMENT ON FUNCTION trigger_generate_persona_embedding() IS
  'Automatically generates embedding for persona profiles via Edge Function';

COMMENT ON TRIGGER persona_profile_embedding_trigger ON persona_profiles IS
  'Triggers embedding generation when persona profile is created or updated';

-- ============================================================================
-- 사용 방법
-- ============================================================================
-- 1. Supabase Dashboard에서 pg_net extension 활성화:
--    Database > Extensions > pg_net 검색 후 Enable
--
-- 2. Supabase 설정 저장 (한 번만 실행):
--    ALTER DATABASE postgres SET app.settings.supabase_url = 'https://tscptdhwdpedngkpmwlm.supabase.co';
--    ALTER DATABASE postgres SET app.settings.service_role_key = 'YOUR_SERVICE_ROLE_KEY';
--
-- 3. Edge Function 배포:
--    supabase functions deploy generate-persona-embedding
--
-- 4. 환경 변수 설정:
--    supabase secrets set OPENAI_API_KEY=your_openai_api_key
--
-- 5. 테스트:
--    새 페르소나를 생성하면 자동으로 embedding이 생성됩니다.
-- ============================================================================
