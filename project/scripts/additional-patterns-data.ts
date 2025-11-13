/**
 * 추가 골든 패턴 데이터 (72개)
 * 기존 51개에 이어서 총 123개 완성
 *
 * 우선순위:
 * 1. Superior 관계 보강 (현재 7개 → 목표 30개)
 * 2. 부족한 MBTI의 subordinate 추가
 * 3. 다양한 카테고리 확장
 */

export const additionalPatterns = [
  // ===== INFJ (Superior 추가) =====
  {
    mbti: 'INFJ',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'superior',
    pattern_category: 'inspiring',
    conversation_topic: '상급자에게 팀의 비전과 방향성 제시',
    emotional_context: '통찰력 있고 감성적이며 영감을 주는',
    pattern_text: '상급자에게 팀의 비전을 제시할 때, 사람들에게 영감을 주며 깊은 의미를 전달합니다. 독특하고 진정성 있게 소통하며, 장기적인 영향력을 중시합니다.',
    example_responses: [
      '저희 팀이 추구하는 가치는 단순히 목표 달성을 넘어, 모두에게 의미 있는 변화를 만드는 것입니다.',
      '이 프로젝트를 통해 우리는 조직 문화를 더 인간적으로 만들 수 있습니다.',
      '팀원 한 명 한 명의 성장이 모여 우리의 큰 비전이 실현됩니다.'
    ],
    effectiveness_score: 0.88
  },

  // ===== ISTP (Superior 추가) =====
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'superior',
    pattern_category: 'reporting',
    conversation_topic: '기술적 문제 해결 결과 보고',
    emotional_context: '간결하고 논리적이며 실용적인',
    pattern_text: '상급자에게 기술적 문제 해결 결과를 보고할 때, 정확한 분석과 독립적 해결 방식을 강조합니다. 실수를 최소화하며, 실용적이고 효율적인 접근을 중시합니다.',
    example_responses: [
      '문제의 근본 원인을 분석한 결과, 세 가지 해결책이 가능합니다.',
      '각 방법의 효율성을 데이터로 비교해보았습니다.',
      '가장 실용적인 방법으로 이미 구현을 완료했습니다.'
    ],
    effectiveness_score: 0.85
  },

  // ===== ISFP (Superior + Subordinate 추가) =====
  {
    mbti: 'ISFP',
    disc: 'S',
    enneagram: '4',
    relationship_type: 'superior',
    pattern_category: 'presenting',
    conversation_topic: '창의적 아이디어 제안',
    emotional_context: '감성적이고 예술적이며 조화로운',
    pattern_text: '상급자에게 창의적 아이디어를 제안할 때, 감성적이고 독특한 가치를 표현합니다. 안정적이고 조화로운 분위기에서 진정성 있게 소통합니다.',
    example_responses: [
      '이 아이디어는 우리의 독특한 정체성을 잘 표현할 수 있습니다.',
      '실용적이면서도 아름다운 경험을 만들 수 있을 것 같습니다.',
      '팀의 조화를 유지하면서도 새로운 시도를 해보고 싶습니다.'
    ],
    effectiveness_score: 0.82
  },

  {
    mbti: 'ISFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'guiding',
    conversation_topic: '부하 직원에게 유연한 가이드 제공',
    emotional_context: '평화롭고 지지적이며 존중하는',
    pattern_text: '부하 직원을 지도할 때, 사람들과 조화롭게 일하며 평화로운 분위기를 만듭니다. 안정적이고 지원적인 환경에서 각자의 방식을 존중합니다.',
    example_responses: [
      '당신의 방식대로 해도 괜찮아요. 편한 대로 진행해보세요.',
      '어려운 점이 있으면 언제든 편하게 이야기해주세요.',
      '모두가 만족할 수 있는 방법을 함께 찾아봅시다.'
    ],
    effectiveness_score: 0.83
  },

  // ===== INFP (Superior + Subordinate 추가) =====
  {
    mbti: 'INFP',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'superior',
    pattern_category: 'advocating',
    conversation_topic: '팀원의 복지와 가치 옹호',
    emotional_context: '이상주의적이고 감성적이며 진정성 있는',
    pattern_text: '상급자에게 팀원의 복지를 제안할 때, 깊은 가치관을 바탕으로 진정성 있게 소통합니다. 사람들에게 영감을 주며, 독특하고 의미 있는 변화를 추구합니다.',
    example_responses: [
      '팀원들이 진정으로 행복할 수 있는 환경을 만들면 더 큰 성과를 낼 수 있습니다.',
      '우리의 가치관을 실천하는 것이 중요하다고 생각합니다.',
      '한 사람 한 사람의 목소리에 귀 기울이는 것이 조직의 본질입니다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'INFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'mentoring',
    conversation_topic: '부하 직원의 내적 동기 발견 지원',
    emotional_context: '지지적이고 이해심 깊으며 평화로운',
    pattern_text: '부하 직원을 멘토링할 때, 조화롭고 지원적인 분위기에서 각자의 진정한 목소리를 찾도록 돕습니다. 안정적이며 평화로운 대화를 중시합니다.',
    example_responses: [
      '당신이 진짜로 원하는 것이 무엇인지 천천히 생각해봐요.',
      '압박 없이, 편안하게 자신의 속도로 성장하면 됩니다.',
      '당신의 독특한 방식이 팀에 큰 가치가 됩니다.'
    ],
    effectiveness_score: 0.84
  },

  // ===== INTP (Superior + Subordinate 추가) =====
  {
    mbti: 'INTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'superior',
    pattern_category: 'analysis',
    conversation_topic: '복잡한 시스템 분석 결과 보고',
    emotional_context: '논리적이고 분석적이며 신중한',
    pattern_text: '상급자에게 분석 결과를 보고할 때, 정확한 논리와 깊은 분석으로 시스템을 이해시킵니다. 실수를 최소화하며, 전략적 사고를 중시합니다.',
    example_responses: [
      '이 시스템의 근본 구조를 분석한 결과, 세 가지 개선 가능성이 보입니다.',
      '각 옵션의 논리적 타당성을 검증했습니다.',
      '장기적 관점에서 가장 안정적인 접근은 이것입니다.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'INTP',
    disc: 'CI',
    enneagram: '4',
    relationship_type: 'subordinate',
    pattern_category: 'teaching',
    conversation_topic: '부하 직원에게 복잡한 개념 설명',
    emotional_context: '논리적이지만 창의적이며 독특한',
    pattern_text: '부하 직원을 가르칠 때, 정확한 분석과 독특한 관점을 결합합니다. 혁신적으로 사고하며, 진정성 있게 지식을 공유합니다.',
    example_responses: [
      '이 개념을 이해하려면 먼저 기본 원리부터 살펴봐야 합니다.',
      '다른 사람들은 이렇게 생각하지만, 나는 이런 독특한 접근을 제안합니다.',
      '논리적으로 따져보면 이렇고, 창의적으로는 이런 가능성도 있습니다.'
    ],
    effectiveness_score: 0.84
  },

  // ===== ESTP (Superior 추가) =====
  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'quick_decision',
    conversation_topic: '긴급 상황에서 빠른 의사결정 보고',
    emotional_context: '역동적이고 빠르며 자신감 있는',
    pattern_text: '상급자에게 긴급 결정을 보고할 때, 주도권을 잡고 즉각적으로 행동합니다. 행복하고 활기찬 분위기를 만들며, 실용적으로 결과를 추구합니다.',
    example_responses: [
      '상황이 급박해서 즉시 결정했습니다. 결과는 성공적입니다.',
      '현장에서 바로 실행 가능한 방법으로 처리했습니다.',
      '리스크는 있었지만, 기회를 놓치지 않았습니다.'
    ],
    effectiveness_score: 0.85
  },

  // ===== ESFP (Superior 추가) =====
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'celebrating',
    conversation_topic: '팀 성과 축하 및 보고',
    emotional_context: '활기차고 긍정적이며 열정적인',
    pattern_text: '상급자에게 팀 성과를 보고할 때, 사람들과 어울리며 긍정적인 에너지를 전달합니다. 행복하고 만족스러운 경험을 만들며, 즐겁게 결과를 공유합니다.',
    example_responses: [
      '팀원들이 정말 열심히 해서 멋진 결과를 만들었습니다!',
      '과정 자체가 즐거웠고, 모두가 만족하는 결과입니다.',
      '이 성공을 함께 축하하고 싶습니다!'
    ],
    effectiveness_score: 0.86
  },

  // ===== ENFP (Superior 추가) =====
  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'innovating',
    conversation_topic: '혁신적 프로젝트 제안',
    emotional_context: '열정적이고 창의적이며 영감을 주는',
    pattern_text: '상급자에게 혁신 프로젝트를 제안할 때, 사람들에게 영감을 주며 새로운 가능성을 탐구합니다. 행복하고 활기찬 분위기에서 창의적으로 소통합니다.',
    example_responses: [
      '이 아이디어는 우리에게 완전히 새로운 기회를 열어줄 것입니다!',
      '상상해보세요. 이것이 성공하면 업계 전체가 바뀝니다.',
      '팀원들도 모두 흥미진진해하고 있습니다!'
    ],
    effectiveness_score: 0.88
  },

  // ===== ENTP (Superior 추가) =====
  {
    mbti: 'ENTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'superior',
    pattern_category: 'challenging',
    conversation_topic: '기존 시스템의 문제 제기',
    emotional_context: '도전적이고 논리적이며 혁신적인',
    pattern_text: '상급자에게 시스템 개선을 제안할 때, 주도적으로 논리적 근거를 제시하며 혁신적으로 도전합니다. 행복하고 자유로운 분위기에서 창의적으로 논쟁합니다.',
    example_responses: [
      '현재 시스템에는 논리적으로 이런 맹점이 있습니다.',
      '더 효율적인 방법이 분명히 있을 것입니다. 함께 찾아봅시다.',
      '이 문제를 해결하면 우리가 업계를 선도할 수 있습니다.'
    ],
    effectiveness_score: 0.87
  },

  // ===== ENFJ (Superior 추가) =====
  {
    mbti: 'ENFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'superior',
    pattern_category: 'team_building',
    conversation_topic: '팀 문화 개선 제안',
    emotional_context: '카리스마 있고 지지적이며 영감을 주는',
    pattern_text: '상급자에게 팀 문화 개선을 제안할 때, 사람들에게 영감을 주며 조직의 성장을 이끕니다. 타인을 돕고 필요한 리더가 되고자 하며, 조화롭게 소통합니다.',
    example_responses: [
      '우리 팀이 더 강하게 뭉칠 수 있는 방법을 생각해봤습니다.',
      '한 명 한 명이 자신의 가치를 느낄 수 있는 문화를 만들고 싶습니다.',
      '리더로서 이런 변화를 만들어가고 싶습니다.'
    ],
    effectiveness_score: 0.89
  },

  // ===== ENTJ (Superior 추가) =====
  {
    mbti: 'ENTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'superior',
    pattern_category: 'strategic',
    conversation_topic: '조직 전략 제시',
    emotional_context: '강력하고 전략적이며 자신감 있는',
    pattern_text: '상급자에게 전략을 제시할 때, 비전으로 조직을 이끌며 주도적으로 의사결정합니다. 강하고 자율적인 리더십으로 장기적 목표를 제시합니다.',
    example_responses: [
      '우리의 목표는 명확합니다. 3년 내 시장 점유율 1위입니다.',
      '이 전략으로 경쟁사를 압도할 수 있습니다.',
      '빠르게 결단하고 실행으로 옮겨야 합니다.'
    ],
    effectiveness_score: 0.90
  },

  // ===== 다양한 카테고리 보강 (Tier 2) =====

  // ISTJ - 다양한 상황
  {
    mbti: 'ISTJ',
    disc: 'C',
    enneagram: '6',
    relationship_type: 'subordinate',
    pattern_category: 'risk_management',
    conversation_topic: '부하 직원에게 리스크 관리 지시',
    emotional_context: '체계적이고 신중하며 책임감 있는',
    pattern_text: '부하 직원에게 리스크 관리를 지시할 때, 정확한 정보를 바탕으로 체계적인 절차를 강조합니다. 안전과 충성심을 중시하며, 신중하게 위험을 분석합니다.',
    example_responses: [
      '모든 위험 요소를 체크리스트로 관리해주세요.',
      '문제가 발생하기 전에 예방하는 것이 중요합니다.',
      '조직의 안전을 위해 철저한 검증이 필요합니다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ISTJ',
    disc: 'SC',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'quality_control',
    conversation_topic: '동료와 품질 관리 논의',
    emotional_context: '꼼꼼하고 안정적이며 신중한',
    pattern_text: '동료와 품질 관리를 논의할 때, 안정적이고 조화로운 환경에서 체계적으로 접근합니다. 정확성과 안전을 모두 중시하며, 신중하게 검토합니다.',
    example_responses: [
      '기존의 검증된 방법을 따르면서 품질을 유지합시다.',
      '서로 체크하면서 실수를 최소화할 수 있습니다.',
      '안전하고 확실한 방법으로 진행하는 게 좋겠습니다.'
    ],
    effectiveness_score: 0.85
  },

  // ISFJ - 새로운 관계 및 카테고리
  {
    mbti: 'ISFJ',
    disc: 'S',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'caring',
    conversation_topic: '부하 직원의 복지 챙기기',
    emotional_context: '따뜻하고 돌보는 듯하며 지지적인',
    pattern_text: '부하 직원을 돌볼 때, 안정적이고 조화로운 환경을 만듭니다. 타인을 돕는 것을 중요하게 생각하며, 충성심과 책임감으로 지원합니다.',
    example_responses: [
      '편안하게 일할 수 있도록 필요한 것이 있으면 말해주세요.',
      '당신의 건강과 안녕이 가장 중요합니다.',
      '우리 팀은 서로 돕는 가족 같은 분위기입니다.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'ISFJ',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'mediating',
    conversation_topic: '부하 직원 간 갈등 조정',
    emotional_context: '평화롭고 조화로우며 중립적인',
    pattern_text: '부하 직원 간 갈등을 조정할 때, 조화롭고 안정적인 분위기에서 모두의 의견을 경청합니다. 평화를 중시하며, 안전하게 갈등을 해결합니다.',
    example_responses: [
      '양쪽의 입장을 모두 이해합니다. 함께 해결책을 찾아봅시다.',
      '갈등 없이 조화롭게 일할 수 있는 방법이 있을 거예요.',
      '서로를 존중하면서 평화롭게 협력합시다.'
    ],
    effectiveness_score: 0.84
  },

  // ESTJ - 추가 상황
  {
    mbti: 'ESTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'subordinate',
    pattern_category: 'accountability',
    conversation_topic: '부하 직원의 책임 명확화',
    emotional_context: '강력하고 직접적이며 명확한',
    pattern_text: '부하 직원의 책임을 명확히 할 때, 주도권을 잡고 빠르게 기준을 설정합니다. 강하고 자율적인 환경에서 명확한 책임을 요구하며, 결과를 중시합니다.',
    example_responses: [
      '당신의 역할과 책임은 명확합니다. 기대하는 결과를 알고 있죠?',
      '강한 리더십으로 팀을 이끌어주길 바랍니다.',
      '결과에 대해 책임지는 자세가 필요합니다.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'ESTJ',
    disc: 'DC',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'competing',
    conversation_topic: '동료와 건설적 경쟁',
    emotional_context: '경쟁적이지만 전략적이며 목표 지향적인',
    pattern_text: '동료와 경쟁할 때, 데이터를 분석하여 정확하고 빠른 성과를 추구합니다. 성공과 가치를 중시하며, 효율적이고 전략적으로 접근합니다.',
    example_responses: [
      '데이터를 보니 우리가 더 효율적인 방법을 찾았습니다.',
      '목표를 달성하기 위해 서로 자극이 되는 게 좋습니다.',
      '건설적인 경쟁으로 둘 다 성장할 수 있습니다.'
    ],
    effectiveness_score: 0.85
  },

  // ESFJ - 추가 패턴
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'appreciating',
    conversation_topic: '부하 직원의 노력 인정',
    emotional_context: '따뜻하고 격려하는 듯하며 감사하는',
    pattern_text: '부하 직원의 노력을 인정할 때, 사람들과 어울리며 진심으로 감사를 표현합니다. 타인을 돕는 것을 중요하게 생각하며, 필요한 존재가 되고자 합니다.',
    example_responses: [
      '당신의 노력 덕분에 팀이 성공할 수 있었습니다. 정말 감사합니다.',
      '당신이 있어서 우리 팀이 더 강해졌어요.',
      '이렇게 헌신적으로 일해주셔서 큰 도움이 됩니다.'
    ],
    effectiveness_score: 0.88
  },

  {
    mbti: 'ESFJ',
    disc: 'IS',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'harmonizing',
    conversation_topic: '동료와 조화로운 관계 유지',
    emotional_context: '조화롭고 지지적이며 안정적인',
    pattern_text: '동료와 조화를 유지할 때, 사람들과 안정적으로 일하며 서로를 지원합니다. 안전과 충성심을 중시하며, 신중하고 책임감 있게 협력합니다.',
    example_responses: [
      '우리 모두가 편안하게 일할 수 있는 방법을 찾아봐요.',
      '서로 의지하면서 안정적으로 진행합시다.',
      '팀의 조화가 가장 중요하니까 함께 신중하게 결정해요.'
    ],
    effectiveness_score: 0.84
  },

  // ISTP - 더 다양한 상황
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'troubleshooting',
    conversation_topic: '동료와 기술적 문제 해결',
    emotional_context: '침착하고 분석적이며 실용적인',
    pattern_text: '동료와 기술 문제를 해결할 때, 정확한 분석으로 독립적으로 접근합니다. 실수를 최소화하며, 실용적이고 논리적으로 해결합니다.',
    example_responses: [
      '문제를 세부적으로 분석해보니 이 부분이 원인입니다.',
      '각자 독립적으로 검증한 후 결과를 공유합시다.',
      '가장 효율적인 해결책은 이것입니다.'
    ],
    effectiveness_score: 0.85
  },

  {
    mbti: 'ISTP',
    disc: 'S',
    enneagram: '9',
    relationship_type: 'subordinate',
    pattern_category: 'guiding',
    conversation_topic: '부하 직원에게 실용적 가이드 제공',
    emotional_context: '차분하고 실용적이며 유연한',
    pattern_text: '부하 직원을 지도할 때, 조용히 안정적인 환경을 만들며 실용적으로 접근합니다. 평화롭고 독립적인 분위기에서 각자의 방식을 존중합니다.',
    example_responses: [
      '이 방법이 가장 실용적이에요. 한번 시도해보세요.',
      '압박 없이 자신의 속도로 해결하면 됩니다.',
      '문제가 생기면 조용히 알려주세요. 함께 풀어봅시다.'
    ],
    effectiveness_score: 0.82
  },

  // ESTP - 추가 패턴
  {
    mbti: 'ESTP',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'negotiating',
    conversation_topic: '동료와 빠른 협상',
    emotional_context: '역동적이고 설득력 있으며 대담한',
    pattern_text: '동료와 협상할 때, 사람들을 이끌며 주도적으로 빠르게 합의를 도출합니다. 강하고 활기찬 분위기에서 실용적으로 결과를 만듭니다.',
    example_responses: [
      '빠르게 결정합시다. 둘 다 이득이 되는 방법이 있습니다.',
      '현장에서 바로 실행 가능한 합의를 만들어봐요.',
      '리스크가 있어도 기회를 잡는 게 중요합니다.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'energizing',
    conversation_topic: '부하 직원에게 활력 불어넣기',
    emotional_context: '활기차고 자극적이며 즉흥적인',
    pattern_text: '부하 직원에게 활력을 불어넣을 때, 즉각적으로 행동하며 행복하고 활기찬 분위기를 만듭니다. 실용적이고 재미있게 일하는 것을 중시합니다.',
    example_responses: [
      '지금 당장 시작해봐요! 생각보다 재미있을 거예요.',
      '실행하면서 배우는 게 가장 빠릅니다.',
      '에너지를 높여서 빠르게 결과를 만들어봅시다!'
    ],
    effectiveness_score: 0.85
  },

  // ESFP - 추가 패턴
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'motivating',
    conversation_topic: '부하 직원 동기 부여',
    emotional_context: '열정적이고 긍정적이며 즐거운',
    pattern_text: '부하 직원을 동기부여할 때, 사람들과 어울리며 긍정적이고 활발한 분위기를 만듭니다. 행복하고 만족스러운 경험을 중시하며, 즐겁게 일합니다.',
    example_responses: [
      '이 프로젝트 정말 재미있을 거예요! 함께 즐기면서 해봐요!',
      '당신의 활기찬 에너지가 팀에 큰 힘이 됩니다.',
      '즐겁게 일하면 결과도 더 좋아집니다!'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ESFP',
    disc: 'IS',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'socializing',
    conversation_topic: '동료와 사교적 관계 형성',
    emotional_context: '따뜻하고 사교적이며 지지적인',
    pattern_text: '동료와 관계를 형성할 때, 사람들과 조화롭게 어울리며 안정적인 유대감을 만듭니다. 서로 돕고 지원하는 것을 중요하게 생각합니다.',
    example_responses: [
      '우리 함께 점심 먹으면서 편하게 이야기해요!',
      '당신이 필요한 게 있으면 언제든 도와드릴게요.',
      '팀이 가족 같은 분위기면 일도 더 즐겁잖아요!'
    ],
    effectiveness_score: 0.85
  },

  // INTJ - 추가 패턴
  {
    mbti: 'INTJ',
    disc: 'C',
    enneagram: '5',
    relationship_type: 'subordinate',
    pattern_category: 'strategic_planning',
    conversation_topic: '부하 직원에게 장기 전략 지시',
    emotional_context: '전략적이고 분석적이며 독립적인',
    pattern_text: '부하 직원에게 전략을 지시할 때, 정확한 분석을 바탕으로 독립적으로 실행하도록 합니다. 완벽한 계획을 중시하며, 실수를 최소화합니다.',
    example_responses: [
      '장기적 관점에서 이 전략이 최적입니다.',
      '각 단계를 정확히 분석하여 실행하세요.',
      '독립적으로 판단하되, 완벽한 결과를 만들어주세요.'
    ],
    effectiveness_score: 0.88
  },

  {
    mbti: 'INTJ',
    disc: 'CD',
    enneagram: '1',
    relationship_type: 'superior',
    pattern_category: 'system_improvement',
    conversation_topic: '상급자에게 시스템 개선안 제시',
    emotional_context: '전략적이고 완벽주의적이며 혁신적인',
    pattern_text: '상급자에게 시스템 개선을 제안할 때, 데이터 분석으로 정확하고 빠른 전략을 제시합니다. 완벽주의로 디테일을 놓치지 않으며, 장기적 비전을 중시합니다.',
    example_responses: [
      '현 시스템의 비효율을 정확히 분석한 결과입니다.',
      '이 개선안으로 장기적으로 30% 효율 증가가 가능합니다.',
      '완벽한 실행을 위해 단계별 계획을 수립했습니다.'
    ],
    effectiveness_score: 0.90
  },

  // INFJ - 추가 패턴
  {
    mbti: 'INFJ',
    disc: 'IS',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'deep_connection',
    conversation_topic: '동료와 깊은 유대감 형성',
    emotional_context: '통찰력 있고 지지적이며 진심 어린',
    pattern_text: '동료와 깊은 관계를 형성할 때, 사람들과 조화롭게 일하며 진정성 있는 유대를 만듭니다. 타인을 돕고 의미 있는 연결을 중시합니다.',
    example_responses: [
      '당신의 진짜 목표와 꿈이 무엇인지 궁금해요.',
      '서로를 진심으로 이해하면 더 좋은 팀이 될 수 있습니다.',
      '당신에게 필요한 게 있다면 언제든 도와드릴게요.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'INFJ',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'subordinate',
    pattern_category: 'inspiring_growth',
    conversation_topic: '부하 직원의 성장 독려',
    emotional_context: '영감을 주며 독특하고 진정성 있는',
    pattern_text: '부하 직원의 성장을 독려할 때, 사람들에게 영감을 주며 독특한 가능성을 발견하도록 돕습니다. 진정성과 의미를 중시합니다.',
    example_responses: [
      '당신 안에 독특한 재능이 있어요. 함께 발견해봐요.',
      '성장은 단순히 스킬이 아니라 진정한 자아를 찾는 여정입니다.',
      '당신의 독특한 관점이 팀에 큰 가치가 됩니다.'
    ],
    effectiveness_score: 0.88
  },

  // ENTJ - 추가 패턴
  {
    mbti: 'ENTJ',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'leading_initiative',
    conversation_topic: '동료와 함께 이니셔티브 주도',
    emotional_context: '카리스마 있고 전략적이며 경쟁적인',
    pattern_text: '동료와 이니셔티브를 주도할 때, 사람들을 이끌며 전략적으로 비전을 제시합니다. 성공과 성과를 추구하며, 효율적으로 목표를 달성합니다.',
    example_responses: [
      '우리가 함께 주도하면 이 프로젝트를 성공시킬 수 있습니다.',
      '빠르게 움직여서 경쟁자를 앞서나가야 합니다.',
      '우리의 리더십으로 조직 전체를 변화시킵시다.'
    ],
    effectiveness_score: 0.89
  },

  {
    mbti: 'ENTJ',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'subordinate',
    pattern_category: 'demanding_excellence',
    conversation_topic: '부하 직원에게 높은 기준 요구',
    emotional_context: '강력하고 요구적이며 자율적인',
    pattern_text: '부하 직원에게 높은 기준을 요구할 때, 주도권을 잡고 빠르게 결과를 추구합니다. 강한 리더십으로 명확한 목표를 제시하며, 약함을 용납하지 않습니다.',
    example_responses: [
      '최고의 결과를 기대합니다. 타협은 없습니다.',
      '빠르게 실행하고, 결과로 증명하세요.',
      '리더는 항상 최전선에 서야 합니다.'
    ],
    effectiveness_score: 0.87
  },

  // ENFJ - 추가 패턴
  {
    mbti: 'ENFJ',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'inspiring_collaboration',
    conversation_topic: '동료와 영감을 주는 협업',
    emotional_context: '카리스마 있고 열정적이며 목표 지향적인',
    pattern_text: '동료와 협업할 때, 사람들을 이끌며 영감을 주고 성공을 추구합니다. 주도적으로 비전을 제시하며, 효율적으로 성과를 만듭니다.',
    example_responses: [
      '우리가 함께하면 놀라운 결과를 만들 수 있습니다!',
      '팀의 잠재력을 최대한 발휘해봅시다.',
      '성공적인 협업으로 모두가 빛나게 만들어요!'
    ],
    effectiveness_score: 0.89
  },

  {
    mbti: 'ENFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'subordinate',
    pattern_category: 'developing_talent',
    conversation_topic: '부하 직원의 재능 개발',
    emotional_context: '지지적이고 격려하는 듯하며 헌신적인',
    pattern_text: '부하 직원의 재능을 개발할 때, 사람들에게 영감을 주며 각자의 잠재력을 발견하도록 돕습니다. 타인을 돕고 필요한 리더가 되고자 합니다.',
    example_responses: [
      '당신 안에 숨은 재능을 함께 발견해봐요.',
      '당신이 성장하는 것을 보는 게 저에게 큰 기쁨입니다.',
      '당신의 성공이 곧 우리 팀의 성공입니다.'
    ],
    effectiveness_score: 0.88
  },

  // ENTP - 추가 패턴
  {
    mbti: 'ENTP',
    disc: 'DI',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'brainstorming',
    conversation_topic: '동료와 창의적 브레인스토밍',
    emotional_context: '혁신적이고 열정적이며 경쟁적인',
    pattern_text: '동료와 브레인스토밍할 때, 사람들을 이끌며 혁신적인 아이디어를 탐구합니다. 주도적으로 가능성을 제시하며, 성공과 성과를 추구합니다.',
    example_responses: [
      '이 아이디어를 더 발전시키면 대박날 것 같은데요?',
      '기존 방식을 완전히 뒤집어봅시다. 더 재미있을 거예요!',
      '우리가 먼저 시도하면 시장을 선도할 수 있습니다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ENTP',
    disc: 'D',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'challenging_thinking',
    conversation_topic: '부하 직원의 사고 확장',
    emotional_context: '도전적이고 자극적이며 자유로운',
    pattern_text: '부하 직원의 사고를 확장할 때, 주도적으로 논리적 질문을 던지며 혁신적으로 도전합니다. 행복하고 자유로운 분위기에서 창의적으로 토론합니다.',
    example_responses: [
      '왜 그렇게 생각하는지 논리적으로 설명해보세요.',
      '기존 가정을 의심해보면 어떨까요?',
      '더 재미있고 혁신적인 방법이 분명히 있을 거예요!'
    ],
    effectiveness_score: 0.86
  },

  // ENFP - 추가 패턴
  {
    mbti: 'ENFP',
    disc: 'DI',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'creative_collaboration',
    conversation_topic: '동료와 창의적 협업',
    emotional_context: '열정적이고 독특하며 영감을 주는',
    pattern_text: '동료와 창의적으로 협업할 때, 사람들을 이끌며 독특한 가능성을 탐구합니다. 진정성과 혁신을 모두 추구하며, 열정적으로 표현합니다.',
    example_responses: [
      '우리의 독특한 시각으로 완전히 새로운 걸 만들어봐요!',
      '상상력을 마음껏 발휘하면 놀라운 결과가 나올 거예요!',
      '진정성 있고 의미 있는 작품을 함께 만들어봅시다!'
    ],
    effectiveness_score: 0.88
  },

  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '7',
    relationship_type: 'subordinate',
    pattern_category: 'exploring_possibilities',
    conversation_topic: '부하 직원과 함께 새로운 가능성 탐구',
    emotional_context: '열정적이고 호기심 많으며 격려하는',
    pattern_text: '부하 직원과 가능성을 탐구할 때, 사람들에게 영감을 주며 행복하고 활기찬 분위기를 만듭니다. 새로운 경험을 즐기며, 재미있게 탐험합니다.',
    example_responses: [
      '이거 시도해봐요! 엄청 재미있을 것 같아요!',
      '실패해도 괜찮아요. 배우는 게 더 중요하니까!',
      '새로운 가능성을 찾는 여정 자체가 즐거워요!'
    ],
    effectiveness_score: 0.87
  },

  // ===== 추가 Tier 2 & 3 패턴 (다양한 조합) =====

  // ISTJ - 새로운 조합
  {
    mbti: 'ISTJ',
    disc: 'C',
    enneagram: '1',
    relationship_type: 'peer',
    pattern_category: 'process_improvement',
    conversation_topic: '동료와 프로세스 개선',
    emotional_context: '체계적이고 완벽주의적이며 신중한',
    pattern_text: '동료와 프로세스를 개선할 때, 정확한 데이터로 체계적으로 접근합니다. 완벽한 시스템을 추구하며, 디테일을 놓치지 않습니다.',
    example_responses: [
      '기존 프로세스의 문제점을 정확히 분석했습니다.',
      '단계별로 완벽하게 개선해나갑시다.',
      '체계적인 접근으로 실수를 제거할 수 있습니다.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'ISTJ',
    disc: 'S',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'reliable_partnership',
    conversation_topic: '동료와 신뢰할 수 있는 파트너십',
    emotional_context: '안정적이고 충실하며 신뢰할 수 있는',
    pattern_text: '동료와 파트너십을 형성할 때, 안정적이고 조화롭게 일하며 서로를 신뢰합니다. 충성심과 책임감으로 장기적 관계를 만듭니다.',
    example_responses: [
      '서로 의지하면서 안정적으로 함께 일합시다.',
      '약속은 반드시 지키며 신뢰를 쌓아가요.',
      '장기적으로 함께할 수 있는 파트너가 되고 싶습니다.'
    ],
    effectiveness_score: 0.85
  },

  // ISFJ - 새로운 조합
  {
    mbti: 'ISFJ',
    disc: 'S',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'dependable_support',
    conversation_topic: '동료에게 의지할 수 있는 지원',
    emotional_context: '안정적이고 신뢰할 수 있으며 신중한',
    pattern_text: '동료를 지원할 때, 안정적이고 조화롭게 일하며 안전을 중시합니다. 충성심과 책임감으로 신중하게 돕습니다.',
    example_responses: [
      '필요할 때 언제든 도와드릴게요. 안심하세요.',
      '서로 의지하면서 안전하게 진행합시다.',
      '신중하게 검토하면서 함께 해결해나가요.'
    ],
    effectiveness_score: 0.84
  },

  {
    mbti: 'ISFJ',
    disc: 'IS',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'nurturing',
    conversation_topic: '동료를 돌보고 지원',
    emotional_context: '따뜻하고 돌보는 듯하며 지지적인',
    pattern_text: '동료를 돌볼 때, 사람들과 조화롭게 일하며 안정적인 유대감을 만듭니다. 타인을 돕는 것을 중요하게 생각하며, 진심으로 지원합니다.',
    example_responses: [
      '힘들어 보이네요. 제가 도울 수 있는 게 있을까요?',
      '당신의 안녕이 중요합니다. 편안하게 쉬세요.',
      '우리는 서로를 돕는 가족 같은 팀이에요.'
    ],
    effectiveness_score: 0.85
  },

  // ESTJ - 새로운 조합
  {
    mbti: 'ESTJ',
    disc: 'DC',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'decisive_action',
    conversation_topic: '동료와 신속한 의사결정',
    emotional_context: '강력하고 빠르며 전략적인',
    pattern_text: '동료와 빠르게 결정할 때, 데이터를 분석하여 주도적으로 행동합니다. 강한 리더십과 정확한 판단으로 즉각 실행합니다.',
    example_responses: [
      '데이터가 명확하니 지금 바로 결정합시다.',
      '빠른 실행이 경쟁 우위를 만듭니다.',
      '주도권을 잡고 강력하게 밀어붙입시다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ESTJ',
    disc: 'D',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'achieving_goals',
    conversation_topic: '동료와 목표 달성',
    emotional_context: '결과 지향적이고 효율적이며 경쟁적인',
    pattern_text: '동료와 목표를 달성할 때, 주도적으로 효율을 추구하며 결과를 중시합니다. 성공과 성과를 위해 빠르게 실행합니다.',
    example_responses: [
      '목표는 명확합니다. 빠르게 달성합시다.',
      '효율적인 방법으로 최고의 결과를 만들어요.',
      '성공을 위해 집중하고 실행하는 게 중요합니다.'
    ],
    effectiveness_score: 0.86
  },

  // ESFJ - 새로운 조합
  {
    mbti: 'ESFJ',
    disc: 'I',
    enneagram: '6',
    relationship_type: 'peer',
    pattern_category: 'team_cohesion',
    conversation_topic: '동료와 팀 결속력 강화',
    emotional_context: '조화롭고 지지적이며 안정적인',
    pattern_text: '동료와 팀 결속을 강화할 때, 사람들과 어울리며 안정적인 관계를 만듭니다. 안전과 충성심을 중시하며, 조화롭게 협력합니다.',
    example_responses: [
      '우리 팀이 더 가까워질 수 있는 활동을 해봐요.',
      '서로를 신뢰하면서 안정적으로 일합시다.',
      '팀의 조화가 가장 중요하니까 함께 노력해요.'
    ],
    effectiveness_score: 0.85
  },

  {
    mbti: 'ESFJ',
    disc: 'IS',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'friendly_support',
    conversation_topic: '동료에게 우호적 지원',
    emotional_context: '따뜻하고 우호적이며 돌보는 듯한',
    pattern_text: '동료를 지원할 때, 사람들과 조화롭게 일하며 진심으로 도움을 줍니다. 타인을 돕고 필요한 존재가 되고자 하며, 안정적으로 관계를 만듭니다.',
    example_responses: [
      '언제든 도움이 필요하면 말해주세요. 기꺼이 돕겠습니다.',
      '당신을 위해 제가 할 수 있는 일이 있다면 행복합니다.',
      '서로 돕는 우정이 일을 더 즐겁게 만들어요.'
    ],
    effectiveness_score: 0.84
  },

  // ISTP - 새로운 조합
  {
    mbti: 'ISTP',
    disc: 'C',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'calm_problem_solving',
    conversation_topic: '동료와 침착한 문제 해결',
    emotional_context: '침착하고 분석적이며 평화로운',
    pattern_text: '동료와 문제를 해결할 때, 정확하게 분석하면서도 평화롭게 접근합니다. 갈등 없이 독립적으로 실용적인 해결책을 찾습니다.',
    example_responses: [
      '침착하게 문제를 분석해봅시다.',
      '각자 독립적으로 접근하면서 필요할 때 공유해요.',
      '갈등 없이 조용히 해결하는 게 가장 효율적입니다.'
    ],
    effectiveness_score: 0.83
  },

  {
    mbti: 'ISTP',
    disc: 'S',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'technical_exchange',
    conversation_topic: '동료와 기술 지식 교환',
    emotional_context: '실용적이고 지적이며 독립적인',
    pattern_text: '동료와 지식을 교환할 때, 안정적이고 조용한 환경에서 정확한 정보를 나눕니다. 독립적으로 학습하며, 실용적으로 활용합니다.',
    example_responses: [
      '이 기술의 핵심 원리는 이렇습니다.',
      '각자 연구한 후 결과를 공유하는 게 효율적일 것 같아요.',
      '실용적으로 바로 적용할 수 있는 방법을 찾아봤습니다.'
    ],
    effectiveness_score: 0.84
  },

  // ESTP - 새로운 조합
  {
    mbti: 'ESTP',
    disc: 'D',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'bold_execution',
    conversation_topic: '동료와 대담한 실행',
    emotional_context: '대담하고 빠르며 강한',
    pattern_text: '동료와 대담하게 실행할 때, 주도적으로 빠르게 결정하며 강한 의지로 추진합니다. 리스크를 감수하며, 약함을 용납하지 않습니다.',
    example_responses: [
      '지금 바로 실행합시다. 기회는 지나가지 않습니다.',
      '대담하게 도전하는 게 성공의 열쇠입니다.',
      '빠르고 강하게 밀어붙여서 결과를 만들어요.'
    ],
    effectiveness_score: 0.86
  },

  {
    mbti: 'ESTP',
    disc: 'DI',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'fun_collaboration',
    conversation_topic: '동료와 즐거운 협업',
    emotional_context: '활기차고 재미있으며 역동적인',
    pattern_text: '동료와 협업할 때, 사람들을 이끌며 행복하고 활기찬 분위기를 만듭니다. 즉각적으로 실행하며, 재미있게 일합니다.',
    example_responses: [
      '이거 재미있게 만들어봐요! 즐기면서 하는 게 최고예요!',
      '빠르게 실행하면서 에너지를 높여봅시다!',
      '재미있으면 결과도 더 좋아집니다!'
    ],
    effectiveness_score: 0.85
  },

  // ESFP - 새로운 조합
  {
    mbti: 'ESFP',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'cheerful_helping',
    conversation_topic: '동료에게 밝은 에너지로 도움',
    emotional_context: '밝고 따뜻하며 활기찬',
    pattern_text: '동료를 도울 때, 사람들과 어울리며 긍정적이고 활발한 분위기를 만듭니다. 타인을 돕는 것을 즐기며, 행복한 경험을 중시합니다.',
    example_responses: [
      '제가 도와드릴게요! 함께하면 더 즐거워요!',
      '당신을 돕는 게 저에게도 기쁨이에요!',
      '밝은 에너지로 함께 해결해봐요!'
    ],
    effectiveness_score: 0.85
  },

  {
    mbti: 'ESFP',
    disc: 'IS',
    enneagram: '9',
    relationship_type: 'peer',
    pattern_category: 'peaceful_enjoyment',
    conversation_topic: '동료와 평화롭게 즐기며 일하기',
    emotional_context: '평화롭고 즐거우며 조화로운',
    pattern_text: '동료와 일할 때, 사람들과 조화롭게 어울리며 평화롭고 즐거운 분위기를 만듭니다. 갈등 없이 행복하게 협력합니다.',
    example_responses: [
      '편안하게 즐기면서 일해요. 압박은 필요 없어요!',
      '모두가 만족하고 행복한 방법을 찾아봐요.',
      '조화롭고 즐거운 분위기가 최고입니다!'
    ],
    effectiveness_score: 0.83
  },

  // INTJ - 새로운 조합
  {
    mbti: 'INTJ',
    disc: 'C',
    enneagram: '1',
    relationship_type: 'peer',
    pattern_category: 'perfectionist_planning',
    conversation_topic: '동료와 완벽한 계획 수립',
    emotional_context: '전략적이고 완벽주의적이며 분석적인',
    pattern_text: '동료와 계획을 수립할 때, 정확한 분석으로 완벽한 전략을 만듭니다. 디테일을 놓치지 않으며, 장기적 비전을 중시합니다.',
    example_responses: [
      '모든 변수를 고려한 완벽한 계획을 만들어봅시다.',
      '실수 가능성을 제거하기 위해 철저히 검토해야 합니다.',
      '장기적으로 최적의 전략은 이것입니다.'
    ],
    effectiveness_score: 0.88
  },

  {
    mbti: 'INTJ',
    disc: 'CD',
    enneagram: '5',
    relationship_type: 'peer',
    pattern_category: 'deep_analysis',
    conversation_topic: '동료와 깊은 분석',
    emotional_context: '분석적이고 전략적이며 독립적인',
    pattern_text: '동료와 깊이 분석할 때, 정확한 데이터로 전략적으로 접근합니다. 독립적으로 사고하며, 완벽한 이해를 추구합니다.',
    example_responses: [
      '이 문제의 근본 구조를 깊이 분석해야 합니다.',
      '각자 독립적으로 연구한 후 통합합시다.',
      '전략적 관점에서 장기적 함의를 고려해야 합니다.'
    ],
    effectiveness_score: 0.87
  },

  // INFJ - 새로운 조합
  {
    mbti: 'INFJ',
    disc: 'I',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'meaningful_support',
    conversation_topic: '동료에게 의미 있는 지원',
    emotional_context: '통찰력 있고 지지적이며 진심 어린',
    pattern_text: '동료를 지원할 때, 사람들에게 영감을 주며 깊은 의미로 돕습니다. 타인을 돕고 진정성 있는 관계를 만드는 것을 중시합니다.',
    example_responses: [
      '당신에게 진짜로 필요한 것이 무엇인지 이해하고 싶어요.',
      '의미 있는 방식으로 도움을 드리고 싶습니다.',
      '당신의 성장과 행복이 저에게 중요합니다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'INFJ',
    disc: 'IS',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'authentic_connection',
    conversation_topic: '동료와 진정성 있는 연결',
    emotional_context: '진정성 있고 독특하며 깊은',
    pattern_text: '동료와 연결될 때, 조화롭게 일하며 독특하고 진정성 있는 관계를 만듭니다. 깊은 이해와 의미를 추구합니다.',
    example_responses: [
      '진정한 자아로 서로를 이해하면 더 깊은 관계가 됩니다.',
      '독특한 관점들이 모여 아름다운 결과를 만듭니다.',
      '표면적이 아닌 진심 어린 대화를 나누고 싶어요.'
    ],
    effectiveness_score: 0.86
  },

  // ENTJ - 새로운 조합
  {
    mbti: 'ENTJ',
    disc: 'DI',
    enneagram: '8',
    relationship_type: 'peer',
    pattern_category: 'powerful_leadership',
    conversation_topic: '동료와 강력한 리더십 발휘',
    emotional_context: '강력하고 카리스마 있으며 주도적인',
    pattern_text: '동료와 함께 리더십을 발휘할 때, 사람들을 이끌며 주도적으로 비전을 실현합니다. 강하고 자율적으로 목표를 달성하며, 약함을 용납하지 않습니다.',
    example_responses: [
      '우리가 함께 주도하면 조직 전체를 변화시킬 수 있습니다.',
      '강력한 리더십으로 빠르게 실행합시다.',
      '최고를 목표로 하며, 타협은 없습니다.'
    ],
    effectiveness_score: 0.90
  },

  {
    mbti: 'ENTJ',
    disc: 'D',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'competitive_excellence',
    conversation_topic: '동료와 경쟁적 우수성 추구',
    emotional_context: '경쟁적이고 효율적이며 야심찬',
    pattern_text: '동료와 경쟁하며 우수성을 추구할 때, 주도적으로 빠르게 결과를 만듭니다. 성공과 효율을 중시하며, 최고를 목표로 합니다.',
    example_responses: [
      '빠르게 실행해서 경쟁자를 압도합시다.',
      '효율적으로 최고의 성과를 만들어요.',
      '우리의 성공이 업계 기준이 되게 만듭시다.'
    ],
    effectiveness_score: 0.88
  },

  // ENFJ - 새로운 조합
  {
    mbti: 'ENFJ',
    disc: 'I',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'charismatic_motivation',
    conversation_topic: '동료에게 카리스마로 동기 부여',
    emotional_context: '카리스마 있고 열정적이며 영감을 주는',
    pattern_text: '동료에게 동기를 부여할 때, 사람들에게 영감을 주며 성공을 추구합니다. 열정적으로 소통하며, 효율적으로 목표를 달성합니다.',
    example_responses: [
      '당신의 잠재력은 무한합니다! 함께 성공을 만들어요!',
      '우리의 열정으로 놀라운 성과를 낼 수 있습니다!',
      '당신이 빛나는 모습을 보고 싶습니다!'
    ],
    effectiveness_score: 0.88
  },

  {
    mbti: 'ENFJ',
    disc: 'DI',
    enneagram: '2',
    relationship_type: 'peer',
    pattern_category: 'empowering_partnership',
    conversation_topic: '동료를 힘있게 만드는 파트너십',
    emotional_context: '지지적이고 카리스마 있으며 헌신적인',
    pattern_text: '동료와 파트너십을 형성할 때, 사람들을 이끌며 각자를 힘있게 만듭니다. 타인을 돕고 함께 성장하는 것을 중시합니다.',
    example_responses: [
      '당신의 성공이 저에게도 기쁨입니다. 함께 성장해요!',
      '우리가 서로를 응원하면 더 강해질 수 있습니다!',
      '당신의 리더십을 지원하고 싶습니다!'
    ],
    effectiveness_score: 0.87
  },

  // ENTP - 새로운 조합
  {
    mbti: 'ENTP',
    disc: 'D',
    enneagram: '3',
    relationship_type: 'peer',
    pattern_category: 'innovative_competition',
    conversation_topic: '동료와 혁신적 경쟁',
    emotional_context: '혁신적이고 경쟁적이며 논리적인',
    pattern_text: '동료와 경쟁하며 혁신할 때, 주도적으로 논리적 근거를 제시하며 창의적으로 도전합니다. 성공과 혁신을 모두 추구합니다.',
    example_responses: [
      '논리적으로 보면 우리의 방법이 더 혁신적입니다.',
      '경쟁을 통해 서로 자극하면서 혁신을 만들어요.',
      '빠르게 실행해서 시장을 선도합시다.'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ENTP',
    disc: 'DI',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'adventurous_exploration',
    conversation_topic: '동료와 모험적 탐험',
    emotional_context: '모험적이고 열정적이며 자유로운',
    pattern_text: '동료와 탐험할 때, 사람들을 이끌며 행복하고 자유로운 분위기에서 혁신적으로 도전합니다. 새로운 가능성을 즐기며, 창의적으로 실험합니다.',
    example_responses: [
      '이거 완전 새로운 시도인데, 엄청 재미있을 것 같아요!',
      '실패해도 괜찮아요. 배우는 게 더 가치 있으니까!',
      '자유롭게 상상력을 발휘해서 혁신을 만들어봐요!'
    ],
    effectiveness_score: 0.86
  },

  // ENFP - 새로운 조합
  {
    mbti: 'ENFP',
    disc: 'I',
    enneagram: '4',
    relationship_type: 'peer',
    pattern_category: 'authentic_creativity',
    conversation_topic: '동료와 진정성 있는 창의성',
    emotional_context: '열정적이고 진정성 있으며 독특한',
    pattern_text: '동료와 창의적으로 협업할 때, 사람들에게 영감을 주며 독특하고 진정성 있는 작품을 만듭니다. 깊은 의미와 개성을 중시합니다.',
    example_responses: [
      '우리의 독특한 정체성을 표현하는 작품을 만들어봐요!',
      '진정성 있는 창의성이 가장 아름답습니다!',
      '열정을 담아 의미 있는 결과를 함께 만들어요!'
    ],
    effectiveness_score: 0.87
  },

  {
    mbti: 'ENFP',
    disc: 'DI',
    enneagram: '7',
    relationship_type: 'peer',
    pattern_category: 'enthusiastic_innovation',
    conversation_topic: '동료와 열정적 혁신',
    emotional_context: '열정적이고 혁신적이며 활기찬',
    pattern_text: '동료와 혁신할 때, 사람들을 이끌며 행복하고 활기찬 분위기에서 새로운 가능성을 탐구합니다. 즐겁게 도전하며, 창의적으로 실험합니다.',
    example_responses: [
      '이 아이디어 정말 혁신적이에요! 함께 실현해봐요!',
      '열정을 담아 완전히 새로운 것을 만들어봅시다!',
      '재미있게 도전하면서 혁신을 이뤄내요!'
    ],
    effectiveness_score: 0.88
  },

]
