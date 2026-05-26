# Cajon Rhythm

## 실행
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
```

## 테스트
```bash
npm run test
```

## 오디오 파일
```txt
public/audio/slap.mp3
public/audio/bass.mp3
```

파일이 없거나 디코딩에 실패하면 Web Audio fallback synth가 작동합니다.

## 이미지 자산
원본은 `public/assets/original/`에 보존되어 있고, 런타임은 ASCII alias를 사용합니다.

```txt
public/assets/cajon-icon.png
public/assets/cajon-photo-ref.png
public/assets/main-layout-ref.png
public/assets/hand-bass-full.png
public/assets/hand-slap-upper.png
public/assets/hand-tap-tip.png
public/assets/pose-guide.png
```

## 차트 추가
`src/charts/` 안에 `Chart` 객체를 추가하고 `src/charts/index.ts`의 `CHARTS` 목록에 등록하세요.

## 리듬 선택 기능

홈 화면의 `리듬 선택`에서 난이도별 카혼 리듬을 고를 수 있습니다.

난이도:

- 튜토리얼
- 입문
- 쉬움
- 보통
- 어려움
- 전문가

각 리듬은 BPM, 박자, 스타일, 학습 목표, 최고 기록을 표시합니다. 리듬 상세 화면에서는 미니 패턴, 미리듣기, 연습 루프, 게임 시작을 사용할 수 있습니다.

## 리듬 추가 방법

`src/rhythms/catalog/`에 새 rhythm definition을 추가합니다.

```ts
createRhythmFromGrid({
  id: 'my-new-rhythm',
  title: '나의 새 리듬',
  bpm: 100,
  difficulty: 'easy',
  level: 4,
  style: 'pop',
  timeSignature: '4/4',
  subdivision: 16,
  bars: [
    ['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-'],
  ],
});
```

Token:

- `BL`: Bass Left
- `BR`: Bass Right
- `SL`: Slap Left
- `SR`: Slap Right
- `B`: Bass 자동 좌우 교대
- `S`: Slap 자동 좌우 교대
- `X`: Accent Slap
- `g`: Ghost note
- `-`: Rest

## 키보드 조작
```txt
A: Slap L
S: Bass L
K: Bass R
L: Slap R
```

## 모바일 팁
첫 시작 버튼을 눌러 오디오를 활성화하세요. iOS Safari에서는 사용자 제스처 이후에만 소리가 재생됩니다.
