import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const hardRhythms = [
  createRhythmFromGrid({
    id: 'hard-fast-8beat-fill',
    title: '빠른 8비트 필인',
    subtitle: '빠른 마지막 마디 필인',
    description: '빠른 8비트 리듬 뒤에 촘촘한 필인을 붙이는 패턴입니다.',
    bpm: 124,
    difficulty: 'hard',
    level: 8,
    style: 'fill',
    learningGoal: '빠른 마지막 마디 필인',
    recommendedFor: '빠른 손 전환을 연습하는 사용자',
    bars: [
      ['B', '-', 'g', '-', 'S', '-', 'g', '-', 'B', '-', 'g', '-', 'S', '-', 'g', '-'],
      ['B', '-', 'S', '-', 'B', '-', 'S', '-', 'B', 'S', 'B', 'S', 'B', 'S', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'hard-rock-drive',
    title: '록 드라이브',
    subtitle: '빠른 템포 손 교대',
    description: '빠른 Bass 반복과 강한 Slap으로 드라이브감을 만드는 록 패턴입니다.',
    bpm: 132,
    difficulty: 'hard',
    level: 9,
    style: 'rock',
    learningGoal: '빠른 템포에서 손 교대 유지',
    recommendedFor: '록 리듬에 익숙한 중상급자',
    bars: [
      ['B', '-', 'B', '-', 'X', '-', 'B', '-', 'B', '-', 'B', '-', 'X', '-', 'S', '-'],
      ['B', '-', 'B', '-', 'X', '-', 'B', '-', 'B', 'S', 'B', 'S', 'X', '-', 'S', '-']
    ]
  }),
  createRhythmFromGrid({
    id: 'hard-latin-hand-to-hand',
    title: '라틴 핸드 투 핸드',
    subtitle: '좌우 손 교차와 엇박',
    description: '좌우 손을 명시적으로 교차하며 라틴 엇박을 연습합니다.',
    bpm: 116,
    difficulty: 'hard',
    level: 9,
    style: 'latin',
    learningGoal: '좌우 손 교차와 엇박',
    recommendedFor: '손 순서를 정확히 분리하고 싶은 사용자',
    bars: [
      ['BL', '-', 'SR', '-', 'BR', 'SL', '-', 'SR', 'BL', '-', 'SR', '-', 'BR', '-', 'SL', '-'],
      ['BR', '-', 'SL', '-', 'BL', 'SR', '-', 'SL', 'BR', '-', 'SL', 'SR', 'BL', '-', 'SR', '-']
    ]
  })
];
