/**
 * 중복 패턴 제거 스크립트
 * 각 조합에서 가장 최신 것만 남기고 나머지 삭제
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function removeDuplicates() {
  console.log('🧹 중복 패턴 제거 시작\n')

  try {
    // 모든 패턴 조회
    const { data: patterns, error } = await supabase
      .from('conversation_patterns')
      .select('id, mbti, disc, enneagram, relationship_type, pattern_category, created_at')
      .order('created_at', { ascending: true })

    if (error || !patterns) {
      console.error('❌ 패턴 조회 실패:', error)
      return
    }

    console.log(`📊 총 ${patterns.length}개 패턴\n`)

    // 조합별로 그룹화
    const comboMap = new Map<string, any[]>()

    patterns.forEach(pattern => {
      const key = `${pattern.mbti}+${pattern.disc}+${pattern.enneagram}+${pattern.relationship_type}`
      if (!comboMap.has(key)) {
        comboMap.set(key, [])
      }
      comboMap.get(key)!.push(pattern)
    })

    // 중복이 있는 조합만 필터
    const duplicates = Array.from(comboMap.entries())
      .filter(([_, patterns]) => patterns.length > 1)

    console.log(`⚠️  중복 조합: ${duplicates.length}개\n`)

    if (duplicates.length === 0) {
      console.log('✅ 중복이 없습니다.')
      return
    }

    // 삭제할 ID 수집 (각 조합에서 가장 최신 것만 남기고 나머지 삭제)
    const idsToDelete: string[] = []

    duplicates.forEach(([combo, patterns]) => {
      // created_at 기준 정렬 (최신이 마지막)
      const sorted = patterns.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      // 마지막 것(최신)을 제외하고 모두 삭제 대상
      const toDelete = sorted.slice(0, -1)
      toDelete.forEach(p => idsToDelete.push(p.id))

      console.log(`${combo}: ${patterns.length}개 → 1개 (${toDelete.length}개 삭제)`)
    })

    console.log(`\n총 삭제 대상: ${idsToDelete.length}개\n`)

    // 확인
    console.log('⚠️  정말 삭제하시겠습니까? (Y/N)')
    console.log('   (스크립트를 수동으로 실행하는 경우 확인이 필요합니다.)\n')

    // 자동 삭제 (배치 처리)
    let deletedCount = 0
    const batchSize = 50

    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize)

      const { error: deleteError } = await supabase
        .from('conversation_patterns')
        .delete()
        .in('id', batch)

      if (deleteError) {
        console.error(`❌ 삭제 실패 (배치 ${Math.floor(i / batchSize) + 1}):`, deleteError)
      } else {
        deletedCount += batch.length
        console.log(`✓ ${deletedCount}/${idsToDelete.length} 삭제됨`)
      }
    }

    // 최종 확인
    const { count } = await supabase
      .from('conversation_patterns')
      .select('*', { count: 'exact', head: true })

    console.log(`\n✅ 완료!`)
    console.log(`   삭제: ${deletedCount}개`)
    console.log(`   남은 패턴: ${count}개\n`)

    // 고유 조합 재확인
    const { data: remaining } = await supabase
      .from('conversation_patterns')
      .select('mbti, disc, enneagram, relationship_type')

    if (remaining) {
      const uniqueCombos = new Set(
        remaining.map(p => `${p.mbti}+${p.disc}+${p.enneagram}+${p.relationship_type}`)
      )
      console.log(`🎯 고유 조합: ${uniqueCombos.size}개`)

      if (count === uniqueCombos.size) {
        console.log('🎉 중복이 모두 제거되었습니다!')
      }
    }

  } catch (error) {
    console.error('❌ 에러:', error)
  }
}

removeDuplicates()
