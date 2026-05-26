import { createRhythmFromGrid } from '../rhythmPatternDsl';

export const tutorialRhythms = [
  createRhythmFromGrid({
    id: 'tutorial-doong-jjak',
    title: '첫 박자: 둥-짝',
    subtitle: 'Bass와 Slap 위치 익히기',
    description: '가장 기본적인 Bass, Slap 교대 패턴으로 카혼의 중심 감각을 익힙니다.',
    bpm: 72,
    difficulty: 'tutorial',
    level: 1,
    style: 'basic',
    learningGoal: 'Bass와 Slap 위치 익히기',
    recommendedFor: '카혼을 처음 만지는 사용자',
    bars: [['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-']]
  }),
  createRhythmFromGrid({
    id: 'tutorial-left-right',
    title: '왼손 오른손 위치 익히기',
    subtitle: '네 타격 영역을 순서대로 확인',
    description: 'Slap L/R, Bass L/R를 차례로 눌러 손 위치를 익히는 리듬입니다.',
    bpm: 76,
    difficulty: 'tutorial',
    level: 1,
    style: 'practice',
    learningGoal: '좌우 손과 네 타격 영역 연결하기',
    recommendedFor: '터치 위치를 먼저 익히고 싶은 사용자',
    bars: [['BL', '-', '-', '-', 'SL', '-', '-', '-', 'BR', '-', '-', '-', 'SR', '-', '-', '-']]
  }),
  createRhythmFromGrid({
    id: 'tutorial-count-four',
    title: '4박 카운트 연습',
    subtitle: '일정한 박자 유지',
    description: 'Bass 네 번, Slap 네 번을 일정하게 반복하며 박자 감각을 만듭니다.',
    bpm: 80,
    difficulty: 'tutorial',
    level: 1,
    style: 'practice',
    learningGoal: '일정한 4박 유지',
    recommendedFor: '메트로놈처럼 정확하게 치고 싶은 사용자',
    bars: [
      ['B', '-', '-', '-', 'B', '-', '-', '-', 'B', '-', '-', '-', 'B', '-', '-', '-'],
      ['S', '-', '-', '-', 'S', '-', '-', '-', 'S', '-', '-', '-', 'S', '-', '-', '-']
    ]
  })
];
