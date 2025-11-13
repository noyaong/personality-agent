/**
 * 벡터 검색 품질 테스트 스크립트
 * 다양한 threshold와 limit 파라미터로 검색 품질 확인
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '../lib/embeddings'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 테스트 쿼리들
const testQueries = [
  {
    query: "부하 직원이 실수했을 때 어떻게 피드백해야 하나요?",
    expectedMbti: "ISTJ",
    expectedCategory: "feedback",
    expectedRelationship: "subordinate"
  },
  {
    query: "동료와 의견이 충돌할 때 어떻게 해결하면 좋을까요?",
    expectedCategory: "conflict",
    expectedRelationship: "peer"
  },
  {
    query: "상급자에게 프로젝트 진행 상황을 보고하려고 합니다",
    expectedCategory: "reporting",
    expectedRelationship: "superior"
  },
  {
    query: "팀원들과 협업하면서 어려운 점이 있어요",
    expectedCategory: "collaboration",
    expectedRelationship: "peer"
  },
  {
    query: "중요한 결정을 내려야 하는데 도움이 필요합니다",
    expectedCategory: "decision_making"
  }
]

// 다양한 파라미터 조합
const parameterSets = [
  { threshold: 0.5, limit: 3, desc: "낮은 threshold, 적은 결과" },
  { threshold: 0.6, limit: 5, desc: "중간 threshold, 중간 결과" },
  { threshold: 0.7, limit: 5, desc: "현재 설정 (기본)" },
  { threshold: 0.75, limit: 3, desc: "높은 threshold, 적은 결과" },
  { threshold: 0.8, limit: 10, desc: "매우 높은 threshold, 많은 결과" },
]

async function searchSimilarPatterns(
  embedding: number[],
  threshold: number,
  limit: number,
  mbti?: string,
  relationshipType?: string
) {
  const { data, error } = await supabase.rpc('search_similar_patterns', {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: limit,
    mbti_filter: mbti || null,
    relationship_filter: relationshipType || null,
  })

  if (error) {
    console.error('검색 실패:', error)
    return []
  }

  return data || []
}

async function testVectorSearch() {
  console.log('🧪 벡터 검색 품질 테스트 시작\n')
  console.log('=' . repeat(80))

  for (const testCase of testQueries) {
    console.log(`\n\n📝 테스트 쿼리: "${testCase.query}"`)
    console.log(`   기대값: ${testCase.expectedCategory || 'any'} / ${testCase.expectedRelationship || 'any'}`)
    console.log('-'.repeat(80))

    // 임베딩 생성
    const embedding = await generateEmbedding(testCase.query)
    console.log(`✅ 임베딩 생성 완료 (${embedding.length}차원)\n`)

    // 각 파라미터 조합으로 테스트
    for (const params of parameterSets) {
      console.log(`\n🔍 파라미터: ${params.desc}`)
      console.log(`   threshold: ${params.threshold}, limit: ${params.limit}`)

      const results = await searchSimilarPatterns(
        embedding,
        params.threshold,
        params.limit,
        testCase.expectedMbti,
        testCase.expectedRelationship
      )

      console.log(`   결과: ${results.length}개 패턴 발견`)

      if (results.length === 0) {
        console.log('   ⚠️  검색 결과 없음')
      } else {
        results.forEach((result: any, idx: number) => {
          const similarity = (result.similarity * 100).toFixed(1)
          const preview = result.pattern_text.substring(0, 60).replace(/\n/g, ' ')
          console.log(`   ${idx + 1}. [유사도: ${similarity}%] ${preview}...`)
        })

        // 품질 평가
        const avgSimilarity = results.reduce((sum: number, r: any) => sum + r.similarity, 0) / results.length
        console.log(`   📊 평균 유사도: ${(avgSimilarity * 100).toFixed(1)}%`)

        if (avgSimilarity >= 0.8) {
          console.log('   ✅ 우수한 검색 품질')
        } else if (avgSimilarity >= 0.7) {
          console.log('   ✓ 양호한 검색 품질')
        } else if (avgSimilarity >= 0.6) {
          console.log('   ⚠️  보통 검색 품질')
        } else {
          console.log('   ❌ 낮은 검색 품질')
        }
      }
    }

    console.log('\n' + '='.repeat(80))

    // Rate limiting (OpenAI API)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n\n🎉 테스트 완료!')
  console.log('\n💡 권장사항:')
  console.log('   - threshold: 0.7 이상 (너무 낮으면 관련 없는 패턴 포함)')
  console.log('   - limit: 3-5개 (너무 많으면 프롬프트가 길어짐)')
  console.log('   - 필터링: MBTI나 관계 타입으로 좁히면 더 정확함')
}

// 추가: 특정 패턴의 임베딩 품질 확인
async function checkEmbeddingQuality() {
  console.log('\n\n🔬 임베딩 품질 확인')
  console.log('=' . repeat(80))

  const { data: samples, error } = await supabase
    .from('conversation_patterns')
    .select('id, mbti, disc, enneagram, relationship_type, pattern_category, pattern_text')
    .limit(5)

  if (error || !samples) {
    console.error('샘플 조회 실패:', error)
    return
  }

  for (const sample of samples) {
    console.log(`\n패턴: ${sample.mbti}+${sample.disc}+${sample.enneagram} / ${sample.relationship_type}`)
    console.log(`카테고리: ${sample.pattern_category}`)

    // 자기 자신과의 유사도 확인 (1.0에 가까워야 함)
    const embedding = await generateEmbedding(sample.pattern_text)
    const results = await searchSimilarPatterns(embedding, 0.5, 1)

    if (results.length > 0 && results[0].id === sample.id) {
      console.log(`✅ 자기 유사도: ${(results[0].similarity * 100).toFixed(2)}%`)
    } else {
      console.log(`⚠️  자기 검색 실패`)
    }

    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

async function main() {
  try {
    await testVectorSearch()
    await checkEmbeddingQuality()
  } catch (error) {
    console.error('❌ 테스트 실패:', error)
    process.exit(1)
  }
}

main()
