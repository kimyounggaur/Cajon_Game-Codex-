import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const normalRhythms = [
  createRhythmFromGrid({
    id: 'normal-shuffle-groove',
    title: '셔플 그루브',
    subtitle: '튀는 셔플 느낌',
    description: 'Ghost note와 Slap 위치를 살짝 밀어 셔플 느낌을 연습합니다.',
    bpm: 96,
    difficulty: 'normal',
    level: 6,
    style: 'shuffle',
    learningGoal: '튀는 셔플 느낌',
    recommendedFor: '중급 셔플 감각을 익히는 사용자',
    bars: [
      ['B', '-', 'g', '-', 'S', '-', '-', 'g', 'B', '-', 'g', '-', 'S', '-', '-', 'g'],
      ['B', '-', 'g', '-', 'S', '-', '-', 'g', 'B', '-', 'B', '-', 'S', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'normal-funk-syncopation',
    title: '펑크 싱코페이션',
    subtitle: '엇박 Bass와 Slap 대응',
    description: 'Bass와 Slap이 정박을 벗어나는 펑크 싱코페이션 리듬입니다.',
    bpm: 104,
    difficulty: 'normal',
    level: 7,
    style: 'funk',
    learningGoal: '엇박 Bass와 Slap 대응',
    recommendedFor: '싱코페이션을 연습하는 중급자',
    bars: [
      ['B', '-', '-', 'S', '-', 'B', '-', '-', 'S', '-', '-', 'B', '-', 'S', '-', '-'],
      ['B', '-', 'S', '-', '-', 'B', '-', 'S', '-', '-', 'B', '-', 'S', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'normal-latin-pop',
    title: '라틴 팝 카혼',
    subtitle: '교차 악센트',
    description: '라틴 팝 느낌의 Bass와 Slap 교차 악센트를 연습합니다.',
    bpm: 108,
    difficulty: 'normal',
    level: 7,
    style: 'latin',
    learningGoal: 'Bass와 Slap의 교차 악센트',
    recommendedFor: '라틴 느낌을 맛보고 싶은 중급자',
    bars: [
      ['B', '-', '-', 'S', 'B', '-', '-', 'S', '-', 'B', '-', '-', 'S', '-', 'B', '-'],
      ['B', '-', '-', 'S', 'B', '-', 'S', '-', '-', 'B', '-', 'S', 'B', '-', 'S', '-']
    ]
  })
];
