/**
 * 패턴 추적 테스트 스크립트
 *
 * 실제 대화 시뮬레이션을 통해 패턴 추적이 작동하는지 확인
 */

import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '../lib/embeddings';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 환경 변수 로드
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPatternTracking() {
  console.log('🧪 패턴 추적 테스트 시작\n');
  console.log('='.repeat(80));

  // 테스트 메시지
  const testMessage = '프로젝트 진행 상황을 보고드립니다';
  const testMbti = 'INTJ';
  const testRelationship = 'superior';

  console.log('\n📝 테스트 설정:');
  console.log(`  메시지: "${testMessage}"`);
  console.log(`  MBTI: ${testMbti}`);
  console.log(`  관계: ${testRelationship}`);

  try {
    // 1. 임베딩 생성
    console.log('\n🔄 Step 1: 임베딩 생성 중...');
    const embedding = await generateEmbedding(testMessage);
    console.log(`✅ 임베딩 생성 완료 (${embedding.length} 차원)`);

    // 2. 유사 패턴 검색
    console.log('\n🔍 Step 2: 유사 패턴 검색 중...');

    const { data: patterns, error: searchError } = await supabase.rpc('search_similar_patterns', {
      query_embedding: JSON.stringify(embedding),
      match_threshold: 0.15,
      match_count: 3,
      mbti_filter: testMbti,
      relationship_filter: testRelationship,
      enneagram_filter: null,
    });

    if (searchError) {
      console.error('❌ 검색 실패:', searchError);
      return;
    }

    console.log(`✅ ${patterns.length}개 패턴 발견`);

    if (patterns.length === 0) {
      console.log('\n⚠️  검색된 패턴이 없습니다.');
      console.log('   - threshold를 낮춰보거나');
      console.log('   - MBTI/관계 조합의 패턴이 존재하는지 확인하세요');
      return;
    }

    console.log('\n검색된 패턴:');
    patterns.forEach((pattern, index) => {
      console.log(`  ${index + 1}. [${pattern.mbti}/${pattern.relationship_type}] ${pattern.pattern_category}`);
      console.log(`     유사도: ${(pattern.similarity * 100).toFixed(1)}%`);
      console.log(`     현재 사용 횟수: ${pattern.usage_frequency || 0}회`);
    });

    // 3. 패턴 사용 추적
    console.log('\n📊 Step 3: 패턴 사용 추적 중...');

    for (const pattern of patterns) {
      const { error } = await supabase.rpc('increment_pattern_usage', {
        p_pattern_id: pattern.id,
        p_similarity_score: pattern.similarity,
        p_user_message: testMessage,
        p_chat_session_id: null,
        p_relationship_type: testRelationship
      });

      if (error) {
        console.error(`  ❌ 패턴 ${pattern.id} 추적 실패:`, error);
      } else {
        console.log(`  ✅ 패턴 ${pattern.id} 추적 성공`);
      }
    }

    // 4. 결과 확인
    console.log('\n🔎 Step 4: 추적 결과 확인 중...');

    const { data: updatedPatterns } = await supabase
      .from('conversation_patterns')
      .select('id, usage_frequency')
      .in('id', patterns.map(p => p.id));

    console.log('\n업데이트된 사용 횟수:');
    updatedPatterns?.forEach(p => {
      const original = patterns.find(pat => pat.id === p.id);
      console.log(`  패턴 ${p.id.substring(0, 8)}...: ${original?.usage_frequency || 0} → ${p.usage_frequency}회`);
    });

    // 5. 로그 확인
    const { data: logs } = await supabase
      .from('pattern_usage_logs')
      .select('*')
      .in('pattern_id', patterns.map(p => p.id))
      .order('created_at', { ascending: false })
      .limit(3);

    console.log('\n📝 최근 로그 기록:');
    logs?.forEach(log => {
      console.log(`  - 패턴: ${log.pattern_id.substring(0, 8)}...`);
      console.log(`    유사도: ${(log.similarity_score * 100).toFixed(1)}%`);
      console.log(`    메시지: "${log.user_message}"`);
      console.log(`    시간: ${new Date(log.created_at).toLocaleString('ko-KR')}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ 테스트 완료!\n');

  } catch (error) {
    console.error('\n❌ 테스트 실패:', error);
    process.exit(1);
  }
}

testPatternTracking()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
