import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const easyRhythms = [
  createRhythmFromGrid({
    id: 'easy-pop-8beat',
    title: '8비트 팝 그루브',
    subtitle: 'Ghost note가 들어간 팝 패턴',
    description: 'Bass와 Slap 사이에 약한 ghost note를 넣어 8비트 흐름을 만듭니다.',
    bpm: 104,
    difficulty: 'easy',
    level: 4,
    style: 'pop',
    learningGoal: '8비트 기본 리듬',
    recommendedFor: '팝 반주를 시작하는 사용자',
    bars: [
      ['B', '-', 'g', '-', 'S', '-', 'g', '-', 'B', '-', 'g', '-', 'S', '-', 'g', '-'],
      ['B', '-', 'g', '-', 'S', '-', 'g', '-', 'B', '-', 'g', '-', 'S', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'easy-rock-straight',
    title: '록 카혼 스트레이트',
    subtitle: '강한 2/4 Slap',
    description: '2박과 4박의 강한 Slap 악센트로 록 반주의 기본을 연습합니다.',
    bpm: 112,
    difficulty: 'easy',
    level: 4,
    style: 'rock',
    learningGoal: '강한 2/4 Slap 악센트',
    recommendedFor: '스트레이트한 록 느낌을 원하는 사용자',
    bars: [
      ['B', '-', '-', '-', 'X', '-', '-', '-', 'B', '-', 'B', '-', 'X', '-', '-', '-'],
      ['B', '-', '-', '-', 'X', '-', '-', '-', 'B', '-', 'B', '-', 'X', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'easy-six-eight-ballad',
    title: '6/8 발라드',
    subtitle: '흐르는 6/8 박자',
    description: '6/8 발라드의 큰 박과 Slap 위치를 천천히 익힙니다.',
    bpm: 72,
    difficulty: 'easy',
    level: 5,
    style: 'ballad',
    timeSignature: '6/8',
    subdivision: 12,
    learningGoal: '6/8 박자감 익히기',
    recommendedFor: '발라드 반주를 연습하는 사용자',
    bars: [
      ['B', '-', '-', 'S', '-', '-', 'B', '-', '-', 'S', '-', '-'],
      ['B', '-', '-', 'S', '-', '-', 'B', '-', '-', 'S', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'easy-fill-basic',
    title: '쉬운 필인 맛보기',
    subtitle: '마지막 박자 필인 연결',
    description: '기본 리듬 끝에 쉬운 필인을 넣어 다음 마디로 연결합니다.',
    bpm: 100,
    difficulty: 'easy',
    level: 5,
    style: 'fill',
    learningGoal: '마지막 박자 필인 연결',
    recommendedFor: '간단한 필인을 넣어보고 싶은 사용자',
    bars: [
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-'],
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', 'S', '-', 'B', '-', 'S', '-']
    ]
  })
];
