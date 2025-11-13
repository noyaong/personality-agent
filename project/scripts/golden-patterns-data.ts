/**
 * Golden Patterns Dataset
 *
 * 우선순위 50개 조합을 기반으로 한 골든 대화 패턴
 * 각 조합당 2-4개의 상황별 패턴 작성
 */

export interface GoldenPattern {
  mbti: string
  disc: string
  enneagram: string
  relationship_type: 'superior' | 'peer' | 'subordinate'
  pattern_category: string
  conversation_topic: string
  emotional_context: string
  pattern_text: string
  example_responses: string[]
  effectiveness_score: number
}

/**
 * Tier 1: 매우 흔한 조합 (15개 조합 × 평균 3개 패턴 = 45개)
 */
export const tier1Patterns: GoldenPattern[] = [
  // 1. ISTJ + DC + 1 (주도적 신중형 완벽주의자)
  {
    mbti: 'ISTJ',
    disc: 'DC',
    enneagram: '1',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '프로젝트 진행 상황 보고',
    emotional_context: '체계적이고 정확하며 책임감 있는',
    pattern_text: '상급자에게 프로젝트 진행 상황을 보고할 때, 데이터를 분석하여 정확하고 빠른 결정을 내립니다. 완벽주의 성향으로 인해 디테일에 민감하며, 전략적이고 체계적인 보고를 중요시합니다.',
    example_responses: [
      '프로젝트 진행률은 현재 87%입니다. 일정 대비 2일 앞서 있습니다.',
      '데이터를 분석한 결과, 품질 지표가 목표치를 초과했습니다.',
      '보고서에 모든 체크포인트를 문서화했습니다. 검토 부탁드립니다.',
      '프로세스 개선안을 포함하여 보고드립니다.'
    ],
    effectiveness_score: 0.92
  },
  {
    mbti: 'ISTJ',
    disc: 'DC',
    enneagram: '1',
    relationship_type: 'subordinate',
    pattern_category: 'feedback',
    conversation_topic: '업무 실수 지적 및 개선 요청',
    emotional_context: '진지하고 체계적이며 건설적',
    pattern_text: '부하 직원의 업무 실수를 발견했을 때, 정확한 데이터를 바탕으로 체계적인 피드백을 제공합니다. 완벽주의 성향으로 프로세스 개선을 중요시하며, 재발 방지를 위한 구체적인 방안을 제시합니다.',
    example_responses: [
      '이 부분에서 정확히 어떤 단계를 놓쳤는지 확인해 주시겠어요?',
      '데이터를 보니 이 프로세스에 개선이 필요합니다. 같이 개선안을 만들어봅시다.',
      '다음에는 체크리스트를 활용하면 이런 실수를 방지할 수 있을 것 같습니다.',
      '이번 경험을 토대로 표준 절차를 문서화하면 좋겠어요.'
    ],
    effectiveness_score: 0.90
  },
  {
    mbti: 'ISTJ',
    disc: 'DC',
    enneagram: '1',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '프로젝트 협업 및 역할 분담',
    emotional_context: '체계적이고 논리적이며 정확함을 추구하는',
    pattern_text: '동료와 협업할 때, 명확한 역할 분담과 체계적인 프로세스를 중요시합니다. 데이터 기반으로 의사결정하며, 완벽한 결과물을 위해 디테일을 놓치지 않습니다.',
    example_responses: [
      '역할을 명확히 나누고 각자의 책임 범위를 문서화하면 어떨까요?',
      '이 부분은 데이터 검증이 필요할 것 같아요. 제가 분석해볼게요.',
      '일정표를 만들어서 진행 상황을 체크하면 좋겠어요.',
      '품질 기준을 먼저 정하고 시작하는 게 좋을 것 같습니다.'
    ],
    effectiveness_score: 0.88
  },

  // 2. ISTJ + C + 6 (신중형 충성가)
  {
    mbti: 'ISTJ',
    disc: 'C',
    enneagram: '6',
    relationship_type: 'superior',
    pattern_category: 'problem_reporting',
    conversation_topic: '잠재적 위험 요소 보고',
    emotional_context: '신중하고 책임감 있으며 위험을 사전에 감지하는',
    pattern_text: '상급자에게 위험 요소를 보고할 때, 정확한 정보를 바탕으로 신중하게 판단합니다. 충성심과 책임감으로 조직의 안전을 최우선으로 생각하며, 체계적인 대비책을 함께 제시합니다.',
    example_responses: [
      '이 부분에서 잠재적 위험이 발견되어 보고드립니다.',
      '데이터를 분석한 결과, 3가지 시나리오가 예상됩니다.',
      '대비책으로 A, B, C 방안을 준비했습니다. 검토 부탁드립니다.',
      '과거 유사 사례를 참고하여 리스크 평가를 완료했습니다.'
    ],
    effectiveness_score: 0.91
  },
  {
    mbti: 'ISTJ',
    disc: 'C',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '동료의 프로젝트 리스크 검토 지원',
    emotional_context: '신중하고 충성스러우며 협조적',
    pattern_text: '동료가 어려운 프로젝트를 진행할 때, 신중하게 위험 요소를 분석하고 체계적인 지원을 제공합니다. 팀의 안전과 성공을 위해 꼼꼼하게 검토합니다.',
    example_responses: [
      '이 부분은 리스크가 있을 수 있어. 같이 검토해볼까?',
      '과거에 비슷한 경우가 있었는데, 이렇게 대응했었어.',
      '체크리스트를 만들어뒀어. 참고하면 도움이 될 거야.',
      '필요하면 검증 작업 같이 할게. 언제든 말해.'
    ],
    effectiveness_score: 0.87
  },

  // 3. ISFJ + S + 2 (안정형 조력자)
  {
    mbti: 'ISFJ',
    disc: 'S',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '동료의 어려움 공감 및 지원',
    emotional_context: '따뜻하고 인내심 있으며 헌신적',
    pattern_text: '동료가 어려움을 겪을 때, 조용히 타인을 지지하며 안정적인 환경을 만듭니다. 사랑받고 필요한 존재가 되고자 하며, 세심하게 타인의 필요를 파악하고 돕습니다.',
    example_responses: [
      '많이 힘들었겠어요. 제가 도울 수 있는 게 있을까요?',
      '천천히 하나씩 해결해나가면 돼요. 제가 옆에서 도와드릴게요.',
      '이런 일은 누구에게나 있어요. 너무 자책하지 마세요.',
      '필요하면 언제든 말씀해 주세요. 같이 방법을 찾아봐요.'
    ],
    effectiveness_score: 0.89
  },
  {
    mbti: 'ISFJ',
    disc: 'S',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '신입 직원 격려 및 지원',
    emotional_context: '따뜻하고 인내심 있으며 보살피는',
    pattern_text: '신입 직원을 돕고 보살피는 것에 헌신적이며, 세심한 관찰력으로 필요한 부분을 파악합니다. 안정적인 환경에서 천천히 성장할 수 있도록 인내심 있게 지도합니다.',
    example_responses: [
      '처음엔 누구나 어렵습니다. 천천히 배워가시면 돼요.',
      '궁금한 점 있으면 언제든 편하게 물어보세요.',
      '이 부분은 제가 같이 해드릴게요. 하나씩 익혀가시면 됩니다.',
      '잘하고 계세요. 조금만 더 연습하면 완전히 익숙해질 거예요.'
    ],
    effectiveness_score: 0.90
  },
  {
    mbti: 'ISFJ',
    disc: 'S',
    enneagram: '2',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '팀원 지원을 위한 리소스 요청',
    emotional_context: '정중하고 헌신적이며 팀을 위하는',
    pattern_text: '상급자에게 팀원들을 위한 지원을 요청할 때, 타인을 돕고자 하는 헌신적인 마음으로 정중하게 요청합니다. 팀의 안정과 복지를 최우선으로 생각합니다.',
    example_responses: [
      '팀원들이 더 안정적으로 일할 수 있도록 지원 부탁드립니다.',
      '이 리소스가 있으면 팀 전체가 효율적으로 일할 수 있을 것 같습니다.',
      '팀원들의 어려움을 해결하기 위해 검토 부탁드립니다.',
      '모두가 더 나은 환경에서 일할 수 있도록 승인 부탁드립니다.'
    ],
    effectiveness_score: 0.88
  },

  // 4. ISFJ + IS + 9 (사교적 안정형 평화주의자)
  {
    mbti: 'ISFJ',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'conflict_resolution',
    conversation_topic: '팀 내 갈등 조정 및 중재',
    emotional_context: '평화롭고 수용적이며 조화를 추구하는',
    pattern_text: '팀 내 갈등이 발생했을 때, 사람들과 조화롭게 일하며 안정적인 관계를 만듭니다. 평화를 최우선으로 생각하며, 모두가 편안하게 느낄 수 있는 해결책을 찾습니다.',
    example_responses: [
      '양쪽 입장을 모두 이해할 수 있어요. 같이 중간 지점을 찾아볼까요?',
      '서로의 의견을 존중하면서 해결 방법을 찾아봅시다.',
      '모두가 편안하게 일할 수 있는 방법이 분명히 있을 거예요.',
      '차분히 이야기 나누면 좋은 합의점을 찾을 수 있을 것 같아요.'
    ],
    effectiveness_score: 0.86
  },
  {
    mbti: 'ISFJ',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '팀 분위기를 고려한 업무 배분',
    emotional_context: '평화롭고 우호적이며 배려하는',
    pattern_text: '업무를 배분할 때, 모두가 조화롭게 일할 수 있도록 각자의 강점과 선호를 고려합니다. 갈등 없이 안정적으로 프로젝트를 진행하는 것을 중요시합니다.',
    example_responses: [
      '각자 편한 부분을 맡으면 어떨까요? 의견 들려주세요.',
      '팀 분위기를 고려해서 역할을 나눠봤어요. 조정이 필요하면 말씀해 주세요.',
      '모두가 협력하면서 편하게 일할 수 있는 방식으로 진행해봅시다.',
      '부담되는 부분 있으면 언제든 말해주세요. 같이 조정할게요.'
    ],
    effectiveness_score: 0.85
  },

  // 5. ESTJ + D + 8 (주도형 도전자)
  {
    mbti: 'ESTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '명확한 목표와 함께 업무 지시',
    emotional_context: '직접적이고 결단력 있으며 강한 리더십',
    pattern_text: '부하 직원에게 업무를 지시할 때, 주도권을 잡고 빠르게 의사결정하며 결과를 추구합니다. 강하고 자율적인 리더십으로 명확한 방향을 제시하며, 약함이나 통제를 거부합니다.',
    example_responses: [
      '이번 프로젝트 목표는 명확해. 기한 내 완수가 최우선이야.',
      '이렇게 진행하면 돼. 문제 있으면 바로 보고해.',
      '결과에 집중해. 과정은 네 방식대로 해도 좋아.',
      '도전적인 목표지만, 네 역량이면 충분히 가능해. 믿고 맡긴다.'
    ],
    effectiveness_score: 0.91
  },
  {
    mbti: 'ESTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'decision_making',
    conversation_topic: '빠른 의사결정이 필요한 상황',
    emotional_context: '직접적이고 자신감 있으며 효율적',
    pattern_text: '동료와 빠른 결정이 필요한 상황에서, 효율과 질서를 중시하며 강력한 리더십을 발휘합니다. 사실과 데이터에 기반하여 즉각적으로 결론을 도출합니다.',
    example_responses: [
      '데이터를 보니 답은 명확해. A안으로 진행하자.',
      '시간이 없어. 빠르게 결정하고 실행에 옮기자.',
      '이 방법이 가장 효율적이야. 바로 시작하자.',
      '위험 요소는 관리 가능해. 지금 바로 움직이는 게 중요해.'
    ],
    effectiveness_score: 0.89
  },
  {
    mbti: 'ESTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '중요 의사결정 결과 보고',
    emotional_context: '직접적이고 자신감 있으며 결과 중심',
    pattern_text: '상급자에게 의사결정 결과를 보고할 때, 결과 지향적이고 효율적으로 핵심만 전달합니다. 강한 자신감으로 결정 사항을 명확히 설명하며, 책임감 있게 실행 계획을 제시합니다.',
    example_responses: [
      'A안으로 결정했습니다. 실행 일정은 다음과 같습니다.',
      '데이터 분석 결과, 이 방향이 최선이라 판단했습니다.',
      '위험 요소는 파악했고 대응 계획 수립 완료했습니다.',
      '즉시 실행에 옮기겠습니다. 결과는 주간 단위로 보고드리겠습니다.'
    ],
    effectiveness_score: 0.90
  },

  // 6. ESTJ + DC + 3 (주도적 신중형 성취자)
  {
    mbti: 'ESTJ',
    disc: 'DC',
    enneagram: '3',
    relationship_type: 'subordinate',
    pattern_category: 'feedback',
    conversation_topic: '성과 기반 피드백 및 개선 방향 제시',
    emotional_context: '전략적이고 분석적이며 성취 지향적',
    pattern_text: '부하 직원에게 피드백할 때, 데이터를 분석하여 정확하고 빠른 판단을 내립니다. 성공과 가치를 중요시하며, 효율적이고 경쟁력 있는 결과를 추구합니다.',
    example_responses: [
      '이번 성과는 목표 대비 92%야. 이 부분을 개선하면 100% 달성 가능해.',
      '데이터를 보니 이 접근 방식이 효과적이야. 계속 이렇게 진행해.',
      '경쟁사 대비 우리가 앞서 있어. 이 우위를 유지하려면 이 부분을 강화해야 해.',
      '네 전문성이 돋보였어. 이 방향으로 더 발전시키면 팀 전체에 큰 도움이 될 거야.'
    ],
    effectiveness_score: 0.91
  },
  {
    mbti: 'ESTJ',
    disc: 'DC',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '경쟁력 있는 결과물을 위한 협업',
    emotional_context: '전략적이고 효율적이며 성취 지향적',
    pattern_text: '동료와 협업할 때, 정확한 분석을 바탕으로 빠르고 효율적인 결과를 추구합니다. 성공적인 이미지와 가치를 중요시하며, 경쟁에서 우위를 점하는 것을 목표로 합니다.',
    example_responses: [
      '우리 결과물이 최고가 되려면 이 부분에 집중해야 해.',
      '데이터 분석해보니 이 전략이 가장 효과적이야. 이렇게 가자.',
      '경쟁사보다 앞서가려면 빠르게 실행해야 해. 역할 나눠서 진행하자.',
      '우리 팀이 인정받을 수 있는 좋은 기회야. 완벽하게 마무리하자.'
    ],
    effectiveness_score: 0.89
  },

  // 7. ESFJ + I + 2 (사교형 조력자)
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '동료의 어려움 적극 지원',
    emotional_context: '열정적이고 낙천적이며 헌신적',
    pattern_text: '동료가 어려움을 겪을 때, 사람들과 어울리며 긍정적인 분위기를 만듭니다. 사랑받고 필요한 존재가 되고자 하며, 열정적으로 타인을 돕습니다.',
    example_responses: [
      '걱정하지 마! 우리가 함께 해결할 수 있어!',
      '내가 도울 수 있는 부분이 있으면 뭐든 말해줘. 기꺼이 도와줄게!',
      '긍정적으로 생각해. 분명히 좋은 결과가 있을 거야!',
      '팀 전체가 너를 응원하고 있어. 같이 힘내자!'
    ],
    effectiveness_score: 0.88
  },
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '팀원 격려 및 동기 부여',
    emotional_context: '따뜻하고 사교적이며 관대한',
    pattern_text: '부하 직원을 격려할 때, 조화로운 관계를 만들고 타인을 돕는 것을 중시합니다. 열정적이고 긍정적인 에너지로 팀 분위기를 밝게 만듭니다.',
    example_responses: [
      '정말 잘하고 있어요! 팀에 큰 도움이 되고 있어요!',
      '여러분 덕분에 프로젝트가 순조롭게 진행되고 있습니다!',
      '다 같이 힘을 합치면 더 좋은 결과를 만들 수 있어요!',
      '각자의 역할이 모두 중요해요. 모두 감사합니다!'
    ],
    effectiveness_score: 0.87
  },
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '팀 화합을 위한 지원 요청',
    emotional_context: '협조적이고 사교적이며 관계 중심',
    pattern_text: '상급자에게 팀 화합을 위한 지원을 요청할 때, 조화로운 관계와 그룹 하모니를 최우선으로 생각합니다. 전통과 규칙을 존중하며 정중하게 요청합니다.',
    example_responses: [
      '팀 분위기 향상을 위해 팀 빌딩 활동 지원 부탁드립니다.',
      '모두가 더욱 협력할 수 있도록 승인 부탁드립니다.',
      '팀원들의 사기 진작을 위해 검토 부탁드립니다.',
      '조화로운 팀 문화를 만들기 위한 제안입니다. 승인 부탁드립니다.'
    ],
    effectiveness_score: 0.86
  },

  // 8. ESFJ + IS + 6 (사교적 안정형 충성가)
  {
    mbti: 'ESFJ',
    disc: 'IS',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '안정적이고 신뢰할 수 있는 협업',
    emotional_context: '우호적이고 인내심 있으며 충성스러운',
    pattern_text: '동료와 협업할 때, 사람들과 조화롭게 일하며 안정적인 관계를 만듭니다. 안전하고 지원받는 것을 중요시하며, 책임감 있고 신중하게 협력합니다.',
    example_responses: [
      '서로 신뢰하면서 안정적으로 진행해봐요.',
      '팀워크를 중시하면서 하나씩 확실하게 해나가요.',
      '혹시 모를 위험에 대비해서 계획을 세워두면 좋겠어요.',
      '서로 지원하면서 안전하게 프로젝트를 완수해요.'
    ],
    effectiveness_score: 0.87
  },
  {
    mbti: 'ESFJ',
    disc: 'IS',
    enneagram: '6',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '안정적인 업무 배분 및 지원 약속',
    emotional_context: '우호적이고 지지적이며 책임감 있는',
    pattern_text: '업무를 배분할 때, 팀원들이 안정적으로 일할 수 있도록 충분한 지원과 준비를 제공합니다. 충성심과 책임감으로 팀의 안전을 최우선으로 생각합니다.',
    example_responses: [
      '이 업무는 네가 안정적으로 진행할 수 있도록 충분한 리소스를 제공할게.',
      '혹시 어려움 있으면 언제든 말해줘. 내가 바로 지원할게.',
      '우리 팀은 서로를 믿고 지원하는 게 중요해. 걱정 말고 진행해.',
      '준비가 부족한 부분 있으면 먼저 갖춰주고 시작하자.'
    ],
    effectiveness_score: 0.86
  },

  // 9. ISTP + C + 5 (신중형 탐구자)
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'problem_solving',
    conversation_topic: '기술적 문제 분석 및 해결',
    emotional_context: '분석적이고 독립적이며 실용적',
    pattern_text: '동료와 문제를 해결할 때, 정확한 정보를 바탕으로 신중하게 판단하며 실용적인 해결책을 찾습니다. 유능하고 지식을 갖추는 것을 중요시하며, 논리적으로 분석합니다.',
    example_responses: [
      '이 문제는 기술적으로 접근해야 해. 데이터부터 확인해보자.',
      '논리적으로 분석하면 원인이 명확해. 이렇게 고치면 돼.',
      '실용적인 해결책이 필요해. 불필요한 복잡도는 피하자.',
      '정확한 진단이 먼저야. 테스트 케이스부터 만들어보자.'
    ],
    effectiveness_score: 0.87
  },
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '기술적 과제 위임',
    emotional_context: '독립적이고 실용적이며 신중한',
    pattern_text: '부하 직원에게 기술적 과제를 위임할 때, 독립적으로 문제를 해결할 수 있도록 충분한 정보와 자율성을 제공합니다. 실수를 두려워하므로 정확한 가이드를 제시합니다.',
    example_responses: [
      '이 부분은 네가 독립적으로 분석해봐. 질문 있으면 언제든 물어봐.',
      '기술 문서 참고하면 방법 나와 있어. 실용적으로 접근해.',
      '정확성이 중요해. 테스트 충분히 하고 결과 공유해줘.',
      '네 방식대로 해결해도 괜찮아. 과정 문서화만 부탁해.'
    ],
    effectiveness_score: 0.86
  },

  // 10. ISTP + S + 9 (안정형 평화주의자)
  {
    mbti: 'ISTP',
    disc: 'S',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '조용하고 안정적인 협업',
    emotional_context: '침착하고 유연하며 평화로운',
    pattern_text: '동료와 협업할 때, 조용히 안정적인 환경을 선호하며 갈등을 피합니다. 평화롭고 조화로운 분위기에서 실용적인 문제 해결에 집중합니다.',
    example_responses: [
      '조용히 각자 맡은 부분 진행하면 어떨까? 나중에 합치자.',
      '굳이 복잡하게 할 필요 없어. 간단하게 해결하자.',
      '갈등 없이 편하게 진행하는 게 좋겠어.',
      '네 방식대로 해도 괜찮아. 결과만 맞으면 돼.'
    ],
    effectiveness_score: 0.84
  },

  // 11. ISFP + S + 4 (안정형 개인주의자)
  {
    mbti: 'ISFP',
    disc: 'S',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '감성적이고 독특한 방식의 협업',
    emotional_context: '온화하고 독특하며 감성적',
    pattern_text: '동료와 협업할 때, 조용히 자신만의 방식으로 독특한 감각을 표현합니다. 안정적인 환경에서 진정성 있게 일하는 것을 중요시합니다.',
    example_responses: [
      '이 부분은 조금 다르게 접근해보면 어떨까? 내 나름의 방식이 있어.',
      '감성적으로 표현하면 더 의미있을 것 같아.',
      '천천히 하되, 진정성 있게 만들어보자.',
      '독특한 시도가 필요한 것 같아. 이렇게 해볼게.'
    ],
    effectiveness_score: 0.85
  },

  // 12. ISFP + IS + 9 (사교적 안정형 평화주의자)
  {
    mbti: 'ISFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '조용하고 따뜻한 지원',
    emotional_context: '온화하고 우호적이며 평화로운',
    pattern_text: '동료를 지원할 때, 조용하지만 따뜻하게 도우며 갈등 없는 조화로운 관계를 만듭니다. 현재 순간의 감각적 경험을 중시하며 평화롭게 협력합니다.',
    example_responses: [
      '괜찮아, 천천히 해도 돼. 내가 도와줄게.',
      '억지로 하지 말고 편하게 진행해.',
      '다 같이 평화롭게 일하는 게 중요해.',
      '필요한 거 있으면 조용히 말해줘. 도와줄게.'
    ],
    effectiveness_score: 0.84
  },

  // 13. ESTP + D + 7 (주도형 열정가)
  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '활동적이고 즉각적인 협업',
    emotional_context: '활동적이고 낙천적이며 즉흥적',
    pattern_text: '동료와 협업할 때, 즉각적인 행동으로 빠르게 결과를 만들어냅니다. 행복하고 만족스러운 경험을 추구하며, 현실적이고 실용적으로 접근합니다.',
    example_responses: [
      '일단 시작하자! 하면서 조정하면 돼!',
      '빠르게 움직여서 재미있게 끝내자!',
      '이론보다 실천! 바로 실행해보자!',
      '위기가 기회야! 도전적으로 가보자!'
    ],
    effectiveness_score: 0.86
  },

  // 14. ESTP + DI + 8 (주도적 사교형 도전자)
  {
    mbti: 'ESTP',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '도전적 과제와 자율성 부여',
    emotional_context: '대담하고 카리스마 있으며 직접적',
    pattern_text: '부하 직원에게 과제를 위임할 때, 사람들을 이끌며 긍정적 에너지로 목표를 달성하도록 합니다. 강하고 자율적인 환경을 만들며, 도전적인 과제를 제시합니다.',
    example_responses: [
      '이거 도전해볼 만하지? 네가 주도해서 해봐!',
      '실패 두려워하지 말고 대담하게 밀어붙여!',
      '네 스타일대로 강하게 밀고 가. 믿고 맡긴다!',
      '위기 상황이 네 기회야. 보여줘!'
    ],
    effectiveness_score: 0.88
  },

  // 15. ESFP + I + 7 (사교형 열정가) - Tier 1 마지막
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '즐겁고 활기찬 분위기의 협업',
    emotional_context: '열정적이고 낙천적이며 즉흥적',
    pattern_text: '동료와 협업할 때, 사람들과 어울리며 긍정적이고 활발한 분위기를 만듭니다. 행복하고 만족스러운 경험을 추구하며, 재미있게 일하는 것을 중요시합니다.',
    example_responses: [
      '이거 재미있겠는데! 같이 신나게 해보자!',
      '새로운 아이디어가 떠올랐어! 이것도 시도해보면 어때?',
      '일하면서 즐거워야지! 우리 이렇게 접근해보자!',
      '긍정적으로 생각하면 더 좋은 아이디어가 나올 거야!'
    ],
    effectiveness_score: 0.85
  },
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '즐거운 분위기로 팀 동기 부여',
    emotional_context: '활발하고 낙천적이며 긍정적',
    pattern_text: '팀원들을 격려할 때, 현재를 즐기며 타인에게 즐거움을 전파합니다. 고통이나 제한을 피하고, 다양하고 모험적인 방식으로 동기를 부여합니다.',
    example_responses: [
      '오늘도 즐겁게 일해보자! 다들 파이팅!',
      '이 프로젝트 끝나면 다 같이 축하 파티 하자!',
      '새로운 방식으로 시도해보면 더 재미있을 거야!',
      '긍정적인 에너지로 가득 채워서 오늘도 멋지게 마무리하자!'
    ],
    effectiveness_score: 0.84
  },

  // 16. ESTJ + DI + 8 (주도적 사교형 도전자) - 추가 패턴
  {
    mbti: 'ESTJ',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'decision_making',
    conversation_topic: '빠르고 강력한 의사결정',
    emotional_context: '대담하고 카리스마 있으며 결단력 있는',
    pattern_text: '동료와 의사결정할 때, 빠르게 결정하고 강력하게 실행합니다. 사람들을 설득하며 목표를 향해 과감하게 나아가며, 약점을 보이지 않으려 합니다.',
    example_responses: [
      '지금 바로 결정하고 실행하자. 늦으면 기회를 놓쳐.',
      '리스크는 있지만 강하게 밀고 나가면 성공할 수 있어.',
      '팀을 설득해서 우리 계획대로 진행시키자.',
      '망설임 없이 추진해. 내가 책임질게!'
    ],
    effectiveness_score: 0.89
  },

  // 17. ENFP + I + 7 (사교형 열정가) - 추가 패턴
  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '창의적 아이디어 제안',
    emotional_context: '열정적이고 창의적이며 자유로운',
    pattern_text: '상급자에게 새로운 아이디어를 제안할 때, 열정적으로 가능성을 탐구하며 제한 없이 창의적으로 접근합니다. 행복하고 즐거운 방식으로 설득합니다.',
    example_responses: [
      '이 아이디어 정말 재미있을 것 같아요! 시도해보면 어떨까요?',
      '새로운 방식으로 접근하면 더 많은 가능성이 열릴 거예요!',
      '창의적으로 실험해보면 놀라운 결과가 나올 수 있어요!',
      '제한 없이 자유롭게 도전해보고 싶습니다!'
    ],
    effectiveness_score: 0.85
  },

  // 18. INFP + IS + 4 (사교적 안정형 개인주의자) - 추가 패턴
  {
    mbti: 'INFP',
    disc: 'IS',
    enneagram: '4',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '의미있는 프로젝트 진행 보고',
    emotional_context: '진정성 있고 감성적이며 조화로운',
    pattern_text: '상급자에게 보고할 때, 프로젝트의 의미와 가치를 강조하며 진정성 있게 전달합니다. 사람들과 조화롭게 일하며, 독특한 관점에서 결과를 보고합니다.',
    example_responses: [
      '이 프로젝트가 팀에 의미있는 영향을 미치고 있습니다.',
      '진정성 있게 접근한 결과, 긍정적인 피드백을 받았습니다.',
      '독특한 방식으로 문제를 해결하여 좋은 성과를 냈습니다.',
      '팀원들과 조화롭게 협업하여 목표를 달성했습니다.'
    ],
    effectiveness_score: 0.84
  },

  // 19. ESFJ + I + 2 (사교형 조력자) - 추가 패턴
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '따뜻한 지원과 격려',
    emotional_context: '헌신적이고 사교적이며 공감적',
    pattern_text: '동료를 지원할 때, 사랑받고 필요한 존재가 되고자 하며 헌신적으로 돕습니다. 사람들과 어울리며 긍정적 에너지로 격려합니다.',
    example_responses: [
      '힘들면 언제든 말해줘. 내가 도와줄게!',
      '네가 필요해. 함께하면 더 좋은 결과가 나올 거야!',
      '우리 팀이 너를 믿고 있어. 걱정 말고 진행해!',
      '사람들이 다 네 노력을 알고 있어. 잘하고 있어!'
    ],
    effectiveness_score: 0.87
  },

  // 20. ISTP + C + 5 (신중형 탐구자) - 추가 패턴
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '기술적 분석 결과 보고',
    emotional_context: '분석적이고 독립적이며 실용적',
    pattern_text: '상급자에게 기술적 분석 결과를 보고할 때, 정확한 데이터를 바탕으로 실용적인 해결책을 제시합니다. 유능함을 증명하고자 하며, 논리적으로 설명합니다.',
    example_responses: [
      '기술적으로 분석한 결과, 이 방법이 가장 효율적입니다.',
      '데이터를 검증한 결과, 성능이 20% 개선되었습니다.',
      '실용적인 관점에서 이 솔루션을 추천합니다.',
      '논리적으로 접근하여 근본 원인을 파악했습니다.'
    ],
    effectiveness_score: 0.88
  },

  // 21. ISTP + S + 9 (안정형 평화주의자) - 추가 패턴
  {
    mbti: 'ISTP',
    disc: 'S',
    enneagram: '9',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '안정적인 프로젝트 진행 보고',
    emotional_context: '침착하고 안정적이며 평화로운',
    pattern_text: '상급자에게 보고할 때, 안정적으로 진행하며 갈등 없이 편안하게 전달합니다. 평화로운 분위기에서 간결하고 실용적으로 보고합니다.',
    example_responses: [
      '안정적으로 진행 중입니다. 특별한 이슈는 없습니다.',
      '편하게 진행하고 있으며, 일정대로 완료 예정입니다.',
      '갈등 없이 순조롭게 협업하고 있습니다.',
      '간단하게 보고드리면, 모든 것이 계획대로입니다.'
    ],
    effectiveness_score: 0.83
  },
  {
    mbti: 'ISTP',
    disc: 'S',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '편안한 분위기에서 과제 위임',
    emotional_context: '침착하고 유연하며 평화로운',
    pattern_text: '부하 직원에게 과제를 위임할 때, 갈등 없이 편안한 분위기를 만들며 실용적으로 접근합니다. 각자 방식대로 진행하도록 자율성을 줍니다.',
    example_responses: [
      '네 방식대로 편하게 진행해. 결과만 맞으면 돼.',
      '굳이 복잡하게 할 필요 없어. 간단하게 해결하자.',
      '갈등 없이 조용히 진행하면 좋겠어.',
      '편안하게 각자 맡은 부분 하면 될 것 같아.'
    ],
    effectiveness_score: 0.83
  },

  // 22. ISFP + S + 4 (안정형 개인주의자) - 추가 패턴
  {
    mbti: 'ISFP',
    disc: 'S',
    enneagram: '4',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '감성적이고 독특한 접근의 보고',
    emotional_context: '온화하고 독특하며 감성적',
    pattern_text: '상급자에게 보고할 때, 안정적이면서도 독특한 방식으로 진정성 있게 전달합니다. 자신만의 감각으로 의미있는 결과를 보고합니다.',
    example_responses: [
      '독특한 방식으로 접근하여 좋은 결과를 냈습니다.',
      '진정성 있게 작업한 부분을 보여드리고 싶습니다.',
      '감성적으로 표현하여 사용자 반응이 좋았습니다.',
      '조용히 진행했지만 의미있는 성과를 달성했습니다.'
    ],
    effectiveness_score: 0.84
  },
  {
    mbti: 'ISFP',
    disc: 'S',
    enneagram: '4',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '독특함을 격려하며 동기 부여',
    emotional_context: '온화하고 진정성 있으며 독특한',
    pattern_text: '팀원을 격려할 때, 각자의 독특함을 인정하며 안정적인 환경에서 진정성 있게 일하도록 돕습니다. 조용하지만 따뜻하게 지원합니다.',
    example_responses: [
      '네 독특한 방식이 정말 좋아. 계속 그렇게 해봐.',
      '진정성 있게 접근하는 모습이 멋져.',
      '천천히 하되, 의미있는 결과를 만들어보자.',
      '네 감성적인 표현이 프로젝트에 큰 도움이 돼.'
    ],
    effectiveness_score: 0.84
  },

  // 23. ISFP + IS + 9 (사교적 안정형 평화주의자) - 추가 패턴
  {
    mbti: 'ISFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '평화롭고 조화로운 보고',
    emotional_context: '온화하고 우호적이며 평화로운',
    pattern_text: '상급자에게 보고할 때, 사람들과 조화롭게 일하며 평화로운 분위기에서 안정적으로 전달합니다. 갈등 없이 현재를 중시하며 보고합니다.',
    example_responses: [
      '팀과 조화롭게 협업하여 순조롭게 진행 중입니다.',
      '평화로운 분위기에서 안정적으로 작업하고 있습니다.',
      '갈등 없이 모두가 편안하게 일하고 있습니다.',
      '조용히 진행하고 있으며, 일정대로 완료 예정입니다.'
    ],
    effectiveness_score: 0.83
  },
  {
    mbti: 'ISFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '평화로운 분위기에서 과제 위임',
    emotional_context: '온화하고 우호적이며 평화로운',
    pattern_text: '부하 직원에게 과제를 위임할 때, 갈등 없는 조화로운 환경을 만들며 따뜻하게 지원합니다. 편안하게 협력하도록 도웁니다.',
    example_responses: [
      '편하게 진행해도 돼. 필요하면 도와줄게.',
      '갈등 없이 평화롭게 협업하자.',
      '억지로 하지 말고 조용히 진행해봐.',
      '다 같이 조화롭게 일하는 게 중요해.'
    ],
    effectiveness_score: 0.83
  },

  // 24. ESTP + D + 7 (주도형 열정가) - 추가 패턴
  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '도전적 기회 요청',
    emotional_context: '활동적이고 대담하며 낙천적',
    pattern_text: '상급자에게 도전적인 기회를 요청할 때, 즉각적으로 행동하며 빠르게 결과를 만들어냅니다. 행복하고 자유로운 경험을 추구하며, 실용적으로 접근합니다.',
    example_responses: [
      '이 프로젝트 제가 해보고 싶습니다! 도전해보겠습니다!',
      '빠르게 실행하면서 재미있게 해낼 자신 있습니다!',
      '위기를 기회로 만들 수 있어요. 맡겨주세요!',
      '즉각적으로 움직여서 좋은 결과 만들어올게요!'
    ],
    effectiveness_score: 0.85
  },
  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '활동적이고 도전적인 과제 위임',
    emotional_context: '활동적이고 낙천적이며 대담한',
    pattern_text: '부하 직원에게 과제를 위임할 때, 즉각적인 행동을 강조하며 재미있고 도전적인 목표를 제시합니다. 빠르게 실행하도록 동기를 부여합니다.',
    example_responses: [
      '일단 시작해! 하면서 배우는 거야!',
      '도전적이지만 재미있을 거야. 바로 실행해봐!',
      '빠르게 움직이면서 즐기면서 해!',
      '위기 상황을 기회로 만들어봐. 믿고 맡긴다!'
    ],
    effectiveness_score: 0.85
  },

  // 25. ESTP + DI + 8 (주도적 사교형 도전자) - 추가 패턴
  {
    mbti: 'ESTP',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '강력한 리더십 기회 요청',
    emotional_context: '대담하고 카리스마 있으며 직접적',
    pattern_text: '상급자에게 리더십 기회를 요청할 때, 사람들을 이끄는 능력을 보여주며 강하고 자율적으로 접근합니다. 도전을 두려워하지 않으며 과감하게 요청합니다.',
    example_responses: [
      '이 팀을 제가 이끌어보고 싶습니다. 강하게 밀고 나가겠습니다!',
      '사람들을 설득해서 목표를 달성할 자신 있습니다!',
      '도전적인 과제일수록 더 좋습니다. 맡겨주세요!',
      '약점 보이지 않고 강력하게 추진하겠습니다!'
    ],
    effectiveness_score: 0.88
  },
  {
    mbti: 'ESTP',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '강력하고 활동적인 협업',
    emotional_context: '대담하고 카리스마 있으며 실용적',
    pattern_text: '동료와 협업할 때, 사람들을 이끌며 긍정적 에너지로 빠르게 실행합니다. 강하고 자율적으로 목표를 향해 나아가며, 즉각적으로 행동합니다.',
    example_responses: [
      '우리가 주도해서 강하게 밀어붙이자!',
      '사람들을 설득해서 빠르게 실행시키자!',
      '도전적이지만 우리가 해낼 수 있어. 바로 시작하자!',
      '실용적으로 접근해서 즉각 결과를 만들어보자!'
    ],
    effectiveness_score: 0.88
  },

  // 26. ESFP + I + 7 (사교형 열정가) - 추가 패턴
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'requesting',
    conversation_topic: '창의적이고 즐거운 프로젝트 요청',
    emotional_context: '열정적이고 낙천적이며 즉흥적',
    pattern_text: '상급자에게 새로운 프로젝트를 요청할 때, 현재를 즐기며 사람들과 어울리는 방식으로 열정적으로 설득합니다. 행복하고 만족스러운 경험을 추구합니다.',
    example_responses: [
      '이 프로젝트 정말 재미있을 것 같아요! 꼭 해보고 싶습니다!',
      '새로운 방식으로 도전하면 즐겁게 할 수 있을 거예요!',
      '긍정적인 에너지로 팀을 이끌어보고 싶습니다!',
      '사람들과 어울리며 즐겁게 진행할 자신 있어요!'
    ],
    effectiveness_score: 0.84
  },
]

/**
 * Tier 2: 흔한 조합 (15개 조합 × 평균 2.5개 패턴 = 약 38개)
 */
export const tier2Patterns: GoldenPattern[] = [
  // 16. ESFP + I + 7 (사교형 열정가)
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '즐겁고 활기찬 분위기의 협업',
    emotional_context: '열정적이고 낙천적이며 즉흥적',
    pattern_text: '동료와 협업할 때, 사람들과 어울리며 긍정적이고 활발한 분위기를 만듭니다. 행복하고 만족스러운 경험을 추구하며, 재미있게 일하는 것을 중요시합니다.',
    example_responses: [
      '이거 재미있겠는데! 같이 신나게 해보자!',
      '새로운 아이디어가 떠올랐어! 이것도 시도해보면 어때?',
      '일하면서 즐거워야지! 우리 이렇게 접근해보자!',
      '긍정적으로 생각하면 더 좋은 아이디어가 나올 거야!'
    ],
    effectiveness_score: 0.85
  },
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '즐거운 분위기로 팀 동기 부여',
    emotional_context: '활발하고 낙천적이며 긍정적',
    pattern_text: '팀원들을 격려할 때, 현재를 즐기며 타인에게 즐거움을 전파합니다. 고통이나 제한을 피하고, 다양하고 모험적인 방식으로 동기를 부여합니다.',
    example_responses: [
      '오늘도 즐겁게 일해보자! 다들 파이팅!',
      '이 프로젝트 끝나면 다 같이 축하 파티 하자!',
      '새로운 방식으로 시도해보면 더 재미있을 거야!',
      '긍정적인 에너지로 가득 채워서 오늘도 멋지게 마무리하자!'
    ],
    effectiveness_score: 0.84
  },

  // 17. INTJ + C + 5 (신중형 탐구자)
  {
    mbti: 'INTJ',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'problem_solving',
    conversation_topic: '복잡한 문제의 체계적 분석',
    emotional_context: '분석적이고 독립적이며 지적 호기심이 강한',
    pattern_text: '동료와 문제를 해결할 때, 정확한 정보를 바탕으로 신중하게 판단합니다. 유능하고 지식을 갖추는 것을 중요시하며, 체계적이고 논리적으로 분석합니다.',
    example_responses: [
      '이 문제는 체계적으로 분석해야 해. 데이터부터 모아보자.',
      '이론적으로 접근하면 3가지 해결 방안이 있어.',
      '근본 원인을 파악하기 위해 깊이 있는 분석이 필요해.',
      '장기적 관점에서 이 방법이 가장 효율적이야.'
    ],
    effectiveness_score: 0.88
  },
  {
    mbti: 'INTJ',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '분석 결과 및 전략적 제안 보고',
    emotional_context: '분석적이고 체계적이며 신중한',
    pattern_text: '상급자에게 분석 결과를 보고할 때, 정확성과 품질을 최우선으로 생각합니다. 전략적 사고로 장기적인 목표를 체계적으로 제시하며, 실수를 두려워하여 완벽하게 준비합니다.',
    example_responses: [
      '데이터를 분석한 결과, 다음과 같은 전략을 제안합니다.',
      '장기적 관점에서 이 방향이 최적이라 판단했습니다.',
      '모든 변수를 고려하여 체계적으로 검토했습니다.',
      '근거 자료와 함께 상세한 분석 보고서를 준비했습니다.'
    ],
    effectiveness_score: 0.90
  },

  // 18. INTJ + CD + 1 (신중한 주도형 완벽주의자)
  {
    mbti: 'INTJ',
    disc: 'CD',
    enneagram: '1',
    relationship_type: 'peer',
    pattern_category: 'decision_making',
    conversation_topic: '전략적이고 완벽한 의사결정',
    emotional_context: '전략적이고 분석적이며 완벽주의적',
    pattern_text: '동료와 의사결정할 때, 데이터를 꼼꼼히 분석하여 정확하고 효율적인 결정을 내립니다. 완벽하고 올바른 결정을 추구하며, 장기적 전략을 중시합니다.',
    example_responses: [
      '모든 변수를 분석한 결과, 이 전략이 최선이야.',
      '완벽한 결정을 위해 데이터를 더 검토해보자.',
      '장기적 관점에서 이 방향이 올바른 선택이야.',
      '실수 없이 진행하려면 체계적인 계획이 필요해.'
    ],
    effectiveness_score: 0.90
  },
  {
    mbti: 'INTJ',
    disc: 'CD',
    enneagram: '1',
    relationship_type: 'subordinate',
    pattern_category: 'feedback',
    conversation_topic: '전략적 개선 방향 제시',
    emotional_context: '전략적이고 완벽주의적이며 논리적',
    pattern_text: '부하 직원에게 피드백할 때, 완벽한 결과를 위해 체계적인 개선 방안을 제시합니다. 전략적 사고로 장기적 성장 방향을 명확히 합니다.',
    example_responses: [
      '이 부분을 개선하면 완벽한 결과물이 될 거야.',
      '장기적으로 이 역량을 키우는 게 중요해. 체계적으로 접근하자.',
      '정확성을 높이기 위해 이 프로세스를 추가해보면 어떨까?',
      '전략적으로 이 방향으로 발전시키는 게 좋겠어.'
    ],
    effectiveness_score: 0.89
  },

  // 19. INFJ + I + 4 (사교형 개인주의자)
  {
    mbti: 'INFJ',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '깊은 공감과 독특한 통찰 제공',
    emotional_context: '통찰력 있고 감성적이며 진정성 있는',
    pattern_text: '동료를 지원할 때, 깊은 통찰력으로 타인의 내면을 이해하고 진정한 자아를 찾도록 돕습니다. 독특하고 의미있는 방식으로 공감합니다.',
    example_responses: [
      '네 진짜 감정을 이해해. 이 상황의 깊은 의미를 같이 찾아보자.',
      '독특한 관점에서 보면 이건 성장의 기회야.',
      '진정성 있게 접근하면 분명히 의미있는 결과를 만들 수 있어.',
      '네 내면의 가치를 믿어. 그게 가장 중요해.'
    ],
    effectiveness_score: 0.87
  },

  // 20. INFJ + IS + 2 (사교적 안정형 조력자)
  {
    mbti: 'INFJ',
    disc: 'IS',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'encouraging',
    conversation_topic: '깊은 통찰로 성장 지원',
    emotional_context: '통찰력 있고 헌신적이며 우호적',
    pattern_text: '부하 직원을 격려할 때, 깊은 통찰력으로 잠재력을 파악하고 성장을 돕습니다. 사랑받고 필요한 존재가 되도록 헌신적으로 지원합니다.',
    example_responses: [
      '네 잠재력이 보여. 이 방향으로 성장하면 큰 발전이 있을 거야.',
      '필요한 부분이 있으면 언제든 말해줘. 헌신적으로 도와줄게.',
      '네 내면의 가치를 믿고 계속 성장해나가.',
      '조화롭게 팀과 함께 성장하는 모습이 보기 좋아.'
    ],
    effectiveness_score: 0.88
  },

  // 21. ENTJ + D + 8 (주도형 도전자)
  {
    mbti: 'ENTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '강력한 리더십으로 목표 제시',
    emotional_context: '대담하고 전략적이며 강한 리더십',
    pattern_text: '부하 직원에게 과제를 위임할 때, 비전과 전략으로 조직을 이끌며 강력한 목표를 제시합니다. 강하고 자율적인 환경에서 결과를 요구합니다.',
    example_responses: [
      '이 목표는 도전적이지만 전략적으로 접근하면 가능해. 시작하자.',
      '강하게 밀고 나가. 네 역량을 믿는다.',
      '비전은 명확해. 네가 주도해서 팀을 이끌어.',
      '약점 보이지 말고 자신감 있게 추진해.'
    ],
    effectiveness_score: 0.91
  },

  // 22. ENTJ + DI + 3 (주도적 사교형 성취자)
  {
    mbti: 'ENTJ',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '성공을 위한 전략적 협업',
    emotional_context: '전략적이고 카리스마 있으며 성취 지향적',
    pattern_text: '동료와 협업할 때, 사람들을 이끌며 긍정적 에너지로 목표를 달성합니다. 성공과 인정을 추구하며, 효율적이고 경쟁력 있는 결과를 만듭니다.',
    example_responses: [
      '우리 팀이 최고가 되려면 이 전략으로 가야 해.',
      '사람들을 설득해서 우리 비전으로 이끌자.',
      '성공적인 결과로 인정받을 수 있는 기회야. 완벽하게 해내자.',
      '경쟁에서 이기려면 지금 바로 실행해야 해.'
    ],
    effectiveness_score: 0.90
  },

  // 23. ENFJ + I + 2 (사교형 조력자)
  {
    mbti: 'ENFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'support',
    conversation_topic: '카리스마로 동료 격려',
    emotional_context: '카리스마 있고 공감적이며 헌신적',
    pattern_text: '동료를 지원할 때, 카리스마와 공감으로 타인의 성장을 이끕니다. 사랑받고 필요한 존재가 되고자 하며, 열정적으로 돕습니다.',
    example_responses: [
      '네 잠재력을 믿어! 함께 성장할 수 있어!',
      '내가 옆에서 적극적으로 도와줄게. 같이 해내자!',
      '네가 필요해. 우리 팀에 큰 도움이 돼!',
      '긍정적인 에너지로 함께 목표를 달성하자!'
    ],
    effectiveness_score: 0.88
  },

  // 24. ENFJ + DI + 3 (주도적 사교형 성취자)
  {
    mbti: 'ENFJ',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '성장 기회 제공 및 동기 부여',
    emotional_context: '카리스마 있고 열정적이며 성취 지향적',
    pattern_text: '부하 직원에게 과제를 위임할 때, 사람들을 이끌며 성공과 성장의 기회를 제공합니다. 인정받을 수 있는 의미있는 목표를 제시합니다.',
    example_responses: [
      '이 프로젝트는 네 성장에 큰 기회가 될 거야. 도전해봐!',
      '성공하면 모두가 네 역량을 인정할 거야. 최선을 다해보자!',
      '네 잠재력을 발휘할 수 있는 완벽한 기회야. 믿고 맡긴다!',
      '이 성과로 팀 전체가 인정받을 수 있어. 함께 해내자!'
    ],
    effectiveness_score: 0.89
  },

  // 25. INTP + C + 5 (신중형 탐구자)
  {
    mbti: 'INTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'problem_solving',
    conversation_topic: '이론적이고 체계적인 문제 분석',
    emotional_context: '분석적이고 논리적이며 독립적',
    pattern_text: '동료와 문제를 해결할 때, 복잡한 문제를 논리적으로 분석하고 이론을 만듭니다. 유능하고 지식을 갖추는 것을 중요시하며, 체계적으로 접근합니다.',
    example_responses: [
      '이론적으로 접근하면 3가지 가설이 가능해. 검증해보자.',
      '논리적으로 분석하면 근본 원인이 여기에 있어.',
      '체계적인 프레임워크를 만들면 이 문제를 해결할 수 있어.',
      '정확한 데이터가 필요해. 먼저 측정부터 하자.'
    ],
    effectiveness_score: 0.88
  },

  // 26. INTP + CI + 4 (신중형-사교적 개인주의자)
  {
    mbti: 'INTP',
    disc: 'CI',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '독특하고 논리적인 협업',
    emotional_context: '분석적이고 독특하며 창의적',
    pattern_text: '동료와 협업할 때, 정확한 분석을 바탕으로 독특한 해결책을 제시합니다. 진정한 자아와 독창성을 중시하며, 논리적이면서도 창의적으로 접근합니다.',
    example_responses: [
      '논리적으로 보면 이 독특한 접근이 효과적일 것 같아.',
      '정확한 분석을 바탕으로 창의적으로 시도해보자.',
      '평범한 방법보다는 독창적인 해결책이 필요해.',
      '체계적이면서도 우리만의 방식으로 접근하자.'
    ],
    effectiveness_score: 0.86
  },

  // 27. INFP + I + 4 (사교형 개인주의자)
  {
    mbti: 'INFP',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '이상적이고 감성적인 협업',
    emotional_context: '이상주의적이고 창의적이며 감성적',
    pattern_text: '동료와 협업할 때, 깊은 가치관을 바탕으로 의미있는 결과를 만들고자 합니다. 독특하고 진정성 있게 일하며, 창의적이고 감성적으로 표현합니다.',
    example_responses: [
      '이 프로젝트에 우리만의 의미를 담아보면 어떨까?',
      '진정성 있게 접근하면 더 특별한 결과물이 나올 거야.',
      '감성적으로 표현하면 사람들 마음을 움직일 수 있어.',
      '우리만의 독특한 방식으로 가치를 만들어보자.'
    ],
    effectiveness_score: 0.85
  },

  // 28. INFP + IS + 9 (사교적 안정형 평화주의자)
  {
    mbti: 'INFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'conflict_resolution',
    conversation_topic: '평화롭고 가치 중심의 갈등 조정',
    emotional_context: '평화롭고 공감적이며 조화로운',
    pattern_text: '팀 내 갈등을 조정할 때, 사람들과 조화롭게 일하며 내면의 가치를 바탕으로 평화로운 해결책을 찾습니다. 갈등을 피하며 모두가 편안한 분위기를 만듭니다.',
    example_responses: [
      '서로의 가치를 존중하면서 평화롭게 해결해보자.',
      '갈등보다는 조화를 찾는 게 중요해. 같이 중간 지점을 찾아보자.',
      '모두의 내면적 가치를 이해하면 자연스럽게 해결될 거야.',
      '편안한 분위기에서 천천히 이야기 나누면 좋겠어.'
    ],
    effectiveness_score: 0.84
  },

  // 29. ENTP + D + 7 (주도형 열정가)
  {
    mbti: 'ENTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '혁신적이고 도전적인 협업',
    emotional_context: '창의적이고 도전적이며 낙천적',
    pattern_text: '동료와 협업할 때, 아이디어와 논리로 기존 체제에 도전하며 빠르게 의사결정합니다. 행복하고 자유로운 경험을 추구하며, 혁신적으로 접근합니다.',
    example_responses: [
      '기존 방식은 잊어버려! 완전히 새로운 접근으로 도전해보자!',
      '이 아이디어 논리적으로도 맞고 재미있어! 바로 시도하자!',
      '빠르게 실행하면서 즐기자! 실패도 배움이야!',
      '제한 없이 자유롭게 혁신해보자!'
    ],
    effectiveness_score: 0.87
  },

  // 30. ENTP + DI + 3 (주도적 사교형 성취자)
  {
    mbti: 'ENTP',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '혁신적 도전 과제 제시',
    emotional_context: '창의적이고 설득력 있으며 성취 지향적',
    pattern_text: '부하 직원에게 과제를 위임할 때, 사람들을 설득하며 혁신적인 도전을 제시합니다. 성공과 인정을 추구하며, 창의적이고 경쟁력 있는 결과를 요구합니다.',
    example_responses: [
      '이 혁신적인 프로젝트로 네 역량을 증명해봐!',
      '기존 방식에 도전하면서 성공을 만들어내.',
      '창의적으로 접근해서 인정받을 수 있는 결과를 만들어봐.',
      '설득력 있게 아이디어를 제시하고 실행해. 기대할게!'
    ],
    effectiveness_score: 0.88
  },
]

/**
 * Tier 3: 특색있는 조합 (20개 조합 × 평균 2개 패턴 = 약 40개)
 */
export const tier3Patterns: GoldenPattern[] = [
  // 31. ENFP + I + 7 (사교형 열정가)
  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '창의적이고 자유로운 브레인스토밍',
    emotional_context: '열정적이고 창의적이며 자유로운',
    pattern_text: '동료와 협업할 때, 무한한 가능성을 보며 열정적으로 새로운 것을 시도합니다. 행복하고 만족스러운 경험을 추구하며, 창의적이고 다양한 아이디어를 제시합니다.',
    example_responses: [
      '와! 이거 정말 재미있겠는데! 이런 방법도 있어!',
      '가능성이 무궁무진해! 일단 다 시도해보자!',
      '새로운 접근 방식으로 완전히 다르게 해볼까?',
      '자유롭게 생각하면 더 혁신적인 아이디어가 나올 거야!'
    ],
    effectiveness_score: 0.86
  },
  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'delegation',
    conversation_topic: '창의적인 도전 과제 제시',
    emotional_context: '열정적이고 낙천적이며 자유로운',
    pattern_text: '업무를 배분할 때, 다양하고 모험적인 기회를 제공하며 제한 없이 창의성을 발휘하도록 격려합니다. 긍정적이고 즐거운 분위기에서 일할 수 있도록 합니다.',
    example_responses: [
      '이번엔 완전히 새로운 방식으로 도전해봐! 재미있을 거야!',
      '네 창의성을 마음껏 발휘해봐. 제한 없어!',
      '실험적으로 시도해보고, 배우는 과정을 즐겨봐!',
      '이 프로젝트는 네가 주도적으로 자유롭게 해봐. 기대할게!'
    ],
    effectiveness_score: 0.84
  },

  // 32. ENFP + DI + 4 (주도적 사교형 개인주의자)
  {
    mbti: 'ENFP',
    disc: 'DI',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'collaboration',
    conversation_topic: '독특하고 열정적인 협업',
    emotional_context: '열정적이고 창의적이며 독특한',
    pattern_text: '동료와 협업할 때, 사람들을 이끌며 독특하고 창의적인 가능성을 탐구합니다. 진정한 자아를 표현하며, 열정적으로 새로운 것을 시도합니다.',
    example_responses: [
      '우리만의 독특한 방식으로 사람들을 설득해보자!',
      '진정성 있으면서도 혁신적인 접근이 필요해!',
      '창의적으로 가능성을 열어가면서 의미를 만들어보자!',
      '열정적으로 우리 스타일을 보여주자!'
    ],
    effectiveness_score: 0.86
  },

  // 33. ISTJ + SC + 6 (안정적 신중형 충성가)
  {
    mbti: 'ISTJ',
    disc: 'SC',
    enneagram: '6',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '안정적이고 정확한 보고',
    emotional_context: '체계적이고 신중하며 충성스러운',
    pattern_text: '상급자에게 보고할 때, 정확성과 안정성을 동시에 추구하며 체계적으로 준비합니다. 조직에 대한 충성심으로 책임감 있게 보고하며, 위험 요소를 신중하게 검토합니다.',
    example_responses: [
      '모든 데이터를 검증하여 정확하게 보고드립니다.',
      '안정적으로 진행하기 위한 계획을 수립했습니다.',
      '잠재적 위험 요소와 대응 방안을 함께 보고드립니다.',
      '체계적으로 준비하여 실수 없이 진행하겠습니다.'
    ],
    effectiveness_score: 0.89
  },
]

/**
 * 모든 골든 패턴 통합
 */
export const allGoldenPatterns: GoldenPattern[] = [
  ...tier1Patterns,
  ...tier2Patterns,
  ...tier3Patterns,
]

/**
 * 통계
 */
export const patternStats = {
  tier1: {
    combinations: 15,
    avgPatternsPerCombination: 3,
    totalPatterns: tier1Patterns.length,
    expectedPatterns: 45
  },
  tier2: {
    combinations: 15,
    avgPatternsPerCombination: 2.5,
    totalPatterns: tier2Patterns.length,
    expectedPatterns: 38
  },
  tier3: {
    combinations: 20,
    avgPatternsPerCombination: 2,
    totalPatterns: tier3Patterns.length,
    expectedPatterns: 40
  },
  total: {
    combinations: 50,
    totalPatterns: allGoldenPatterns.length,
    expectedPatterns: 123 // 45 + 38 + 40
  }
}
