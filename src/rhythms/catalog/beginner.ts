import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const beginnerRhythms = [
  createRhythmFromGrid({
    id: 'beginner-basic-4beat',
    title: '기본 4비트 카혼',
    subtitle: 'Bass 1/3, Slap 2/4',
    description: '카혼 반주의 기본 골격인 4비트 둥짝을 두 마디 반복합니다.',
    bpm: 86,
    difficulty: 'beginner',
    level: 2,
    style: 'basic',
    learningGoal: 'Bass on 1/3, Slap on 2/4',
    recommendedFor: '기본 반주를 시작하는 초보',
    bars: [
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-'],
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'beginner-slow-pop-ballad',
    title: '느린 팝 발라드',
    subtitle: '느린 템포 정확도',
    description: '공간이 많은 발라드 패턴으로 느린 템포의 타이밍을 연습합니다.',
    bpm: 78,
    difficulty: 'beginner',
    level: 2,
    style: 'ballad',
    learningGoal: '느린 템포에서 정확도 유지',
    recommendedFor: '서두르지 않고 박자를 세고 싶은 초보',
    bars: [
      ['B', '-', '-', '-', '-', '-', '-', '-', 'S', '-', '-', '-', '-', '-', '-', '-'],
      ['B', '-', '-', '-', '-', '-', '-', '-', 'S', '-', '-', '-', '-', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'beginner-doong-jjak-variation',
    title: '둥짝 둥둥짝',
    subtitle: 'Bass 연속 타격 적응',
    description: '기본 둥짝에 Bass를 한 번 더 넣어 손 이동을 연습합니다.',
    bpm: 88,
    difficulty: 'beginner',
    level: 3,
    style: 'basic',
    learningGoal: 'Bass 연속 타격 적응',
    recommendedFor: '기본 4비트 다음 단계',
    bars: [
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', 'B', '-', 'S', '-', '-', '-'],
      ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', 'B', '-', 'S', '-', '-', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'beginner-kpop-basic',
    title: 'K-POP 기본 그루브 입문',
    subtitle: '쉬운 8비트 감각',
    description: '쉬운 K-POP 반주 느낌의 Bass 추가 패턴입니다.',
    bpm: 96,
    difficulty: 'beginner',
    level: 3,
    style: 'kpop',
    learningGoal: '쉬운 8비트 감각',
    recommendedFor: '조금 더 움직이는 기본 리듬을 원하는 초보',
    bars: [
      ['B', '-', '-', '-', 'S', '-', 'B', '-', 'B', '-', '-', '-', 'S', '-', '-', '-'],
      ['B', '-', '-', '-', 'S', '-', 'B', '-', 'B', '-', '-', '-', 'S', '-', 'S', '-']
    ]
  })
];
