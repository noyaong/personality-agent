/**
 * 패턴 사용 통계 확인 스크립트
 *
 * 골든 패턴의 활용도를 분석합니다:
 * - 사용 빈도 높은 패턴
 * - 사용 빈도 낮은 패턴
 * - MBTI/관계별 사용 통계
 */

import { createClient } from '@supabase/supabase-js';
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

interface UsageStats {
  id: string;
  mbti: string;
  disc: string;
  enneagram: string;
  relationship_type: string;
  pattern_category: string;
  usage_frequency: number;
  effectiveness_score: number;
  log_count: number;
  avg_similarity: number;
  last_used_at: string | null;
}

async function checkUsageStats() {
  console.log('📊 패턴 사용 통계 확인\n');
  console.log('='.repeat(80));

  // 전체 통계
  const { data: allStats, error: statsError } = await supabase
    .from('pattern_usage_stats')
    .select('*')
    .order('usage_frequency', { ascending: false });

  if (statsError) {
    console.error('❌ Error fetching stats:', statsError);
    return;
  }

  const stats = allStats as UsageStats[];
  const totalPatterns = stats.length;
  const usedPatterns = stats.filter(s => s.usage_frequency > 0).length;
  const totalUsage = stats.reduce((sum, s) => sum + s.usage_frequency, 0);
  const avgUsage = totalUsage / totalPatterns;

  console.log('\n📈 전체 통계');
  console.log('-'.repeat(80));
  console.log(`전체 패턴 수: ${totalPatterns}개`);
  console.log(`사용된 패턴: ${usedPatterns}개 (${((usedPatterns / totalPatterns) * 100).toFixed(1)}%)`);
  console.log(`총 사용 횟수: ${totalUsage}회`);
  console.log(`평균 사용 횟수: ${avgUsage.toFixed(2)}회`);

  // 상위 10개 패턴
  console.log('\n🔥 가장 많이 사용된 패턴 (Top 10)');
  console.log('-'.repeat(80));
  stats.slice(0, 10).forEach((pattern, index) => {
    if (pattern.usage_frequency > 0) {
      console.log(`${index + 1}. [${pattern.mbti}/${pattern.relationship_type}] ${pattern.pattern_category}`);
      console.log(`   사용 횟수: ${pattern.usage_frequency}회`);
      console.log(`   평균 유사도: ${pattern.avg_similarity ? (pattern.avg_similarity * 100).toFixed(1) : 'N/A'}%`);
      console.log(`   효과 점수: ${pattern.effectiveness_score}`);
      console.log('');
    }
  });

  // 하위 10개 패턴
  const unusedPatterns = stats.filter(s => s.usage_frequency === 0);
  console.log('\n❄️  미사용 패턴');
  console.log('-'.repeat(80));
  console.log(`미사용 패턴 수: ${unusedPatterns.length}개`);
  if (unusedPatterns.length > 0) {
    console.log('\n미사용 패턴 목록:');
    unusedPatterns.slice(0, 10).forEach((pattern, index) => {
      console.log(`${index + 1}. [${pattern.mbti}/${pattern.relationship_type}] ${pattern.pattern_category}`);
    });
    if (unusedPatterns.length > 10) {
      console.log(`... 외 ${unusedPatterns.length - 10}개`);
    }
  }

  // MBTI별 통계
  console.log('\n📊 MBTI별 사용 통계');
  console.log('-'.repeat(80));
  const mbtiStats = stats.reduce((acc, pattern) => {
    if (!acc[pattern.mbti]) {
      acc[pattern.mbti] = {
        total: 0,
        used: 0,
        usage: 0
      };
    }
    acc[pattern.mbti].total++;
    if (pattern.usage_frequency > 0) {
      acc[pattern.mbti].used++;
    }
    acc[pattern.mbti].usage += pattern.usage_frequency;
    return acc;
  }, {} as Record<string, { total: number; used: number; usage: number }>);

  Object.entries(mbtiStats)
    .sort(([, a], [, b]) => b.usage - a.usage)
    .forEach(([mbti, stat]) => {
      const usageRate = (stat.used / stat.total) * 100;
      console.log(`${mbti}: ${stat.usage}회 (패턴 ${stat.used}/${stat.total}, ${usageRate.toFixed(0)}%)`);
    });

  // 관계별 통계
  console.log('\n📊 관계 타입별 사용 통계');
  console.log('-'.repeat(80));
  const relationStats = stats.reduce((acc, pattern) => {
    if (!acc[pattern.relationship_type]) {
      acc[pattern.relationship_type] = {
        total: 0,
        used: 0,
        usage: 0
      };
    }
    acc[pattern.relationship_type].total++;
    if (pattern.usage_frequency > 0) {
      acc[pattern.relationship_type].used++;
    }
    acc[pattern.relationship_type].usage += pattern.usage_frequency;
    return acc;
  }, {} as Record<string, { total: number; used: number; usage: number }>);

  Object.entries(relationStats)
    .sort(([, a], [, b]) => b.usage - a.usage)
    .forEach(([relation, stat]) => {
      const usageRate = (stat.used / stat.total) * 100;
      console.log(`${relation}: ${stat.usage}회 (패턴 ${stat.used}/${stat.total}, ${usageRate.toFixed(0)}%)`);
    });

  // 카테고리별 통계
  console.log('\n📊 카테고리별 사용 통계');
  console.log('-'.repeat(80));
  const categoryStats = stats.reduce((acc, pattern) => {
    if (!acc[pattern.pattern_category]) {
      acc[pattern.pattern_category] = {
        total: 0,
        usage: 0
      };
    }
    acc[pattern.pattern_category].total++;
    acc[pattern.pattern_category].usage += pattern.usage_frequency;
    return acc;
  }, {} as Record<string, { total: number; usage: number }>);

  Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.usage - a.usage)
    .slice(0, 10)
    .forEach(([category, stat]) => {
      console.log(`${category}: ${stat.usage}회 (${stat.total}개 패턴)`);
    });

  console.log('\n' + '='.repeat(80));
  console.log('✅ 통계 확인 완료!\n');
}

checkUsageStats()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
