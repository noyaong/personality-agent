/**
 * 벡터 검색 디버깅 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '../lib/embeddings';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVectorSearch() {
  const testMessage = '프로젝트 진행 상황을 보고드립니다';

  console.log('🔍 벡터 검색 디버깅\n');
  console.log('테스트 메시지:', testMessage);

  // 1. 임베딩 생성
  const embedding = await generateEmbedding(testMessage);
  console.log('\n✅ 임베딩 생성 완료');

  // 2. threshold 0으로 모든 INTJ superior 패턴의 유사도 확인
  const { data, error } = await supabase.rpc('search_similar_patterns', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: 0, // 모든 결과 보기
    match_count: 10,
    mbti_filter: 'INTJ',
    relationship_filter: 'superior',
    enneagram_filter: null,
  });

  if (error) {
    console.error('❌ RPC 에러:', error);
    return;
  }

  console.log(`\n📊 검색 결과 (총 ${data?.length || 0}개):`);

  if (!data || data.length === 0) {
    console.log('⚠️  결과 없음 - RPC 함수 또는 필터에 문제가 있을 수 있습니다');

    // 직접 SQL로 확인
    const { data: direct } = await supabase
      .from('conversation_patterns')
      .select('*')
      .eq('mbti', 'INTJ')
      .eq('relationship_type', 'superior');

    console.log(`\n직접 조회 결과: ${direct?.length || 0}개`);
    direct?.forEach(p => {
      console.log(`  - ${p.pattern_category}: ${p.pattern_embedding ? 'O' : 'X'} (임베딩)`);
    });
  } else {
    data.forEach((result: any, idx: number) => {
      console.log(`\n${idx + 1}. ${result.pattern_category}`);
      console.log(`   유사도: ${(result.similarity * 100).toFixed(2)}%`);
      console.log(`   패턴: ${result.pattern_text.substring(0, 50)}...`);
    });
  }
}

debugVectorSearch()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
