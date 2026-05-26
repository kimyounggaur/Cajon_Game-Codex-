import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const expertRhythms = [
  createRhythmFromGrid({
    id: 'expert-syncopation-challenge',
    title: '전문가 싱코페이션 챌린지',
    subtitle: '고밀도 엇박 대응',
    description: '빠른 BPM에서 Bass와 Slap이 촘촘하게 교차하는 전문가 패턴입니다.',
    bpm: 138,
    difficulty: 'expert',
    level: 11,
    style: 'funk',
    learningGoal: '고밀도 노트와 엇박 대응',
    recommendedFor: '높은 밀도의 펑크 리듬을 연습하는 고급자',
    bars: [
      ['B', '-', 'S', 'B', '-', 'S', '-', 'B', 'S', '-', 'B', '-', 'S', 'B', 'S', '-'],
      ['B', 'S', '-', 'B', 'S', '-', 'B', '-', 'S', 'B', '-', 'S', 'B', 'S', 'B', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'expert-flamenco-12pulse',
    title: '플라멩코 12펄스',
    subtitle: '12/8 악센트 감각',
    description: '12/8 흐름에서 강한 Slap과 Bass를 교차하는 고급 패턴입니다.',
    bpm: 126,
    difficulty: 'expert',
    level: 11,
    style: 'flamenco',
    timeSignature: '12/8',
    subdivision: 12,
    learningGoal: '12박 악센트 감각',
    recommendedFor: '복합 박자를 탐색하는 고급자',
    bars: [
      ['X', '-', 'B', 'S', '-', 'B', 'X', '-', 'B', 'S', 'B', '-'],
      ['B', 'S', '-', 'X', 'B', '-', 'S', 'B', '-', 'X', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'expert-speed-fill-burst',
    title: '스피드 필인 버스트',
    subtitle: '빠른 연속 필인',
    description: '마지막 구간에 빠른 Bass/Slap 왕복 필인을 몰아치는 패턴입니다.',
    bpm: 146,
    difficulty: 'expert',
    level: 12,
    style: 'fill',
    learningGoal: '빠른 BPM에서 연속 필인 유지',
    recommendedFor: '챌린지 패턴에 도전하는 고급자',
    bars: [
      ['B', '-', 'S', '-', 'B', '-', 'S', '-', 'B', 'S', 'B', 'S', 'B', 'S', 'B', 'S'],
      ['BL', 'SR', 'BR', 'SL', 'BL', 'SR', 'BR', 'SL', 'B', 'S', 'B', 'S', 'X', 'S', 'B', '-']
    ]
  })
];
