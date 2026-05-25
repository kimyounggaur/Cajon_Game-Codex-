# 카혼 리듬 게임 웹앱 업그레이드 마스터 프롬프트

너는 최고 수준의 게임 기획자, 모바일 UX 디자이너, 프론트엔드 아키텍트, Web Audio 엔지니어, 리듬게임 판정 로직 개발자다.  
현재 프로젝트는 “카혼 리듬 게임 프로토타입”이다. 첨부된 마크다운 요구사항과 이미지 소스를 기반으로, 단순 터치 사운드 앱이 아니라 모바일에서 바로 플레이 가능한 완성도 높은 카혼 리듬 게임 웹앱으로 업그레이드하라.

중요: 질문을 반복하지 말고, 저장소와 첨부 자산을 먼저 분석한 뒤 합리적인 기본값으로 구현하라. 막히는 부분이 있으면 최소한의 TODO와 graceful fallback을 넣고 앱이 실행되는 상태까지 완성하라.

---

## 0. 최종 목표

모바일 우선의 세로형 카혼 리듬 게임 웹앱을 만든다.

플레이어는 실제 카혼을 치듯이 화면 속 카혼 본체의 네 영역을 터치한다.

- Slap Left
- Slap Right
- Bass Left
- Bass Right

각 터치 영역은 실제 카혼 타법 위치에 맞게 배치한다.

- Slap L/R: 카혼 상단 왼쪽/오른쪽 모서리
- Bass L/R: 카혼 중앙 하단 쪽에 서로 가깝게 배치

게임 모드는 두 가지다.

1. **Instrument Mode**
   - 카혼을 자유롭게 연주하는 모드
   - Slap/Bass 영역 터치 시 즉시 소리 재생
   - 멀티터치 지원
   - 시각적·햅틱 피드백 제공

2. **Rhythm Game Mode**
   - 4개 레인에 노트가 등장
   - 노트가 각 타격 지점의 판정 타깃에 도달할 때 터치
   - Perfect / Great / Good / Bad / Miss 판정
   - 점수, 콤보, 정확도, 랭크, 별점 제공

앱은 모바일 브라우저에서 가로 스크롤 없이 한 화면에 안정적으로 보여야 한다.  
iPhone Safari, Android Chrome, 데스크톱 Chrome에서 모두 동작해야 한다.

---

## 1. 기술 스택

기존 프로젝트가 있으면 우선 분석하고 유지하라.  
기존 프로젝트가 없다면 다음 스택으로 새 프로젝트를 구성하라.

- Vite
- React
- TypeScript
- CSS Modules 또는 plain CSS with CSS variables
- Web Audio API
- localStorage
- PWA manifest
- Vitest for pure logic tests

불필요하게 무거운 게임 엔진은 사용하지 말라. Phaser, Pixi 같은 외부 엔진은 도입하지 않는다.  
노트 렌더링은 DOM + CSS transform 또는 Canvas 중 성능 좋은 방식을 선택하되, 초기 구현은 유지보수성을 위해 DOM + requestAnimationFrame + transform 기반으로 한다.  
판정 로직, 차트 파싱, 오디오 엔진은 React 컴포넌트와 분리된 순수 모듈로 작성한다.

---

## 2. 자산 정리 규칙

첨부 이미지들은 모두 프로젝트의 핵심 비주얼 자산이다. 절대 무시하지 말라.

먼저 `public/assets/original/` 또는 `src/assets/original/`에 원본 이미지를 보존한다.  
런타임에서 쓰기 쉬운 ASCII 파일명 사본을 만든다. 예시는 다음과 같다.

- `cajon-icon.png`
  - 원본 후보: `카혼 아이콘(크몽)[채색]배경삭제.png`
  - 용도: 앱 아이콘, 로딩 화면, 홈 화면

- `cajon-photo-ref.png`
  - 원본 후보: `Cajon(크몽)[실사].png`
  - 용도: 디자인 레퍼런스, 설정/도움말 화면

- `main-layout-ref.png`
  - 원본 후보: `카혼 게임 앱 메인화면.png`
  - 용도: 전체 카혼 표면 배치 레퍼런스

- `hand-bass-full.png`
  - 원본 후보: `카혼 탭핑 손부위(크몽)[베이스&슬랩&탭]01.png`
  - 용도: Bass 영역 아이콘 또는 히트 피드백

- `hand-slap-upper.png`
  - 원본 후보: `카혼 탭핑 손부위(크몽)[베이스&슬랩&탭]02.png`
  - 용도: Slap 영역 아이콘

- `hand-tap-tip.png`
  - 원본 후보: `카혼 탭핑 손부위(크몽)[베이스&슬랩&탭]03.png`
  - 용도: Tap/ghost/tutorial 보조 아이콘

- `pose-*.png`
  - 원본 후보: `카혼 게임 앱 Source02-*.png`, `카혼 게임 앱 Source03-*.png`
  - 용도: 튜토리얼, hit feedback, 도움말 애니메이션, 배경 레퍼런스

한글/공백/괄호가 포함된 원본명은 보존하되, 코드에서는 ASCII alias를 사용한다.  
이미지 크기가 큰 경우에는 빌드 시 또는 수동으로 WebP/PNG 최적화 버전을 만들어 사용한다.  
단, 원본 파일은 삭제하지 말라.

---

## 3. 프로젝트 구조

다음 구조를 목표로 구현하라.

```txt
src/
  App.tsx
  main.tsx

  assets/
    assets.ts

  components/
    AppShell.tsx
    HomeScreen.tsx
    GameScreen.tsx
    CajonStage.tsx
    CajonBody.tsx
    TouchPad.tsx
    NoteView.tsx
    HUD.tsx
    ResultModal.tsx
    SettingsPanel.tsx
    TutorialOverlay.tsx

  engine/
    audioEngine.ts
    rhythmEngine.ts
    judge.ts
    chart.ts
    scheduler.ts
    input.ts
    storage.ts
    haptics.ts

  charts/
    tutorial.chart.ts
    beginner.chart.ts
    groove8.chart.ts
    fillChallenge.chart.ts

  styles/
    tokens.css
    global.css

  tests/
    judge.test.ts
    rhythmEngine.test.ts
````

앱이 작아도 이 구조를 지켜라.
게임 로직은 컴포넌트 안에 몰아넣지 말고 `engine/`으로 분리한다.

---

## 4. 화면 설계

### 4.1 전체 레이아웃

모바일 세로 화면 기준으로 설계한다.

* 배경: 따뜻한 어두운 회색 또는 아주 연한 회색 배경
* 중앙: 실제 카혼처럼 세로로 긴 직사각형 본체
* 카혼 본체 비율: 약 `1 : 1.5` 또는 `1 : 1.55`
* 본체 최대 너비: `min(92vw, 430px)`
* 본체 높이: aspect-ratio로 자동 계산
* 모서리: 약간 둥글게
* 표면색: 기존 요구사항의 `#F0F0F0`을 기본으로 하되, 아주 미세한 나무/종이 질감 추가
* 테두리: 검은 라인 아트 스타일
* 나사, 측면 손잡이, 받침대 등은 첨부 이미지 스타일을 참고해 CSS pseudo-element 또는 SVG/HTML 요소로 표현

CSS 예시 방향:

```css
.cajonBody {
  position: relative;
  width: min(92vw, 430px);
  aspect-ratio: 1 / 1.55;
  background:
    radial-gradient(circle at 20% 15%, rgba(255,255,255,.55), transparent 22%),
    linear-gradient(135deg, rgba(0,0,0,.025) 25%, transparent 25% 50%, rgba(0,0,0,.025) 50% 75%, transparent 75%),
    #F0F0F0;
  background-size: auto, 16px 16px, auto;
  border: 3px solid #111;
  border-radius: 18px;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}
```

실제 구현에서는 CSS 변수를 사용하라.

---

## 5. 터치 영역 설계

터치 영역은 시각적으로는 이미지 아이콘 중심이고, 실제 hitbox는 충분히 커야 한다.

### 5.1 Lane 정의

고정 enum을 사용한다.

```ts
export type LaneId = 'SLAP_L' | 'SLAP_R' | 'BASS_L' | 'BASS_R';

export type HitType = 'slap' | 'bass';

export const LANE_META = {
  SLAP_L: { label: 'Slap L', sound: 'slap', x: 18, y: 13, pan: -0.35 },
  SLAP_R: { label: 'Slap R', sound: 'slap', x: 82, y: 13, pan: 0.35 },
  BASS_L: { label: 'Bass L', sound: 'bass', x: 43, y: 53, pan: -0.15 },
  BASS_R: { label: 'Bass R', sound: 'bass', x: 57, y: 53, pan: 0.15 },
} as const;
```

`x`, `y`는 카혼 본체 내부의 percentage 좌표다.

### 5.2 Slap 영역

* 위치: 왼쪽 상단 모서리, 오른쪽 상단 모서리
* 형태: 작은 정사각형 패드
* 크기: `clamp(64px, 18vw, 92px)`
* 시각 아이콘: `hand-slap-upper.png`
* 좌우 아이콘은 필요 시 `scaleX(-1)`로 미러링
* 패드 중심에는 질감 있는 `Slap` 텍스트 또는 작은 라벨 표시
* 터치 시:

  * 패드가 0.94 scale로 눌림
  * 아이콘이 살짝 진해짐
  * 타격 위치에서 짧은 ripple 발생
  * 판정 결과가 있으면 `PERFECT`, `GREAT` 등 텍스트가 떠오름

### 5.3 Bass 영역

* 위치: 카혼 중앙 하단 쪽
* Bass L/R은 서로 가깝게 중앙으로 모음
* 형태: 정사각형 패드
* 크기: `clamp(82px, 24vw, 118px)`
* 시각 아이콘: `hand-bass-full.png`
* 중앙 그룹 라벨: `Bass`
* 터치 시:

  * 더 묵직한 scale-down 피드백
  * 짧은 저역 파동 효과
  * 가능하면 `navigator.vibrate(8)` 사용

### 5.4 터치 이벤트

마우스/터치 분기를 따로 만들지 말고 Pointer Events를 사용한다.

* `pointerdown`에서 즉시 입력 처리
* `pointerup`, `pointercancel`에서 active 해제
* `touch-action: none`
* `user-select: none`
* 멀티터치 허용
* 같은 lane 연속 입력 최소 간격: 35~45ms
* 터치 시작 시점의 `performance.now()`를 기록해 판정에 사용
* iOS Safari 더블탭 확대 방지

데스크톱 테스트용 키보드 매핑도 제공한다.

* `A`: Slap L
* `S`: Bass L
* `K`: Bass R
* `L`: Slap R

---

## 6. 오디오 엔진

### 6.1 원칙

HTML `<audio>` 태그를 직접 반복 재생하지 말라.
타격음은 Web Audio API로 구현한다.

* 앱 시작 버튼을 누르는 순간 `AudioContext` 생성 또는 resume
* `slap.mp3`, `bass.mp3`를 fetch
* `decodeAudioData`로 AudioBuffer 캐싱
* 타격 시마다 새 `AudioBufferSourceNode` 생성
* GainNode, StereoPannerNode를 연결해 볼륨과 좌우 위치 조절
* 같은 소리가 빠르게 겹쳐도 끊기지 않아야 함

### 6.2 파일

기본 파일명은 다음을 사용한다.

```txt
public/audio/slap.mp3
public/audio/bass.mp3
```

오디오 파일이 없을 경우 앱이 깨지면 안 된다.
다음 fallback을 구현한다.

* `slap.mp3` 없음: 짧은 bandpass noise + click 합성음
* `bass.mp3` 없음: 짧은 sine/triangle 저음 + noise transient 합성음
* 콘솔과 UI 설정 패널에 “sample fallback active” 표시

### 6.3 AudioEngine API

다음 인터페이스를 구현한다.

```ts
export type SoundName = 'slap' | 'bass' | 'miss' | 'ui';

export interface PlayOptions {
  velocity?: number;   // 0~1
  pan?: number;        // -1~1
  detuneCents?: number;
  when?: number;       // audioContext.currentTime 기준
}

export class AudioEngine {
  init(): Promise<void>;
  unlock(): Promise<void>;
  preload(): Promise<void>;
  play(name: SoundName, options?: PlayOptions): void;
  playLane(lane: LaneId, judgement?: Judgement): void;
  setMasterVolume(value: number): void;
  setSfxVolume(value: number): void;
  getCurrentTimeMs(): number;
}
```

### 6.4 자연스러운 카혼 타격감

같은 sample을 반복해도 기계적으로 들리지 않도록 다음을 적용한다.

* velocity에 따라 gain 변화
* hit마다 detune ±15~35 cents random
* Slap은 더 빠른 attack, 짧은 decay
* Bass는 약간 더 긴 decay
* L/R에 따라 stereo pan 적용
* Perfect 판정 시 아주 짧은 고역 click을 살짝 추가해도 좋음
* Miss 사운드는 과하지 않게 아주 짧은 muted tick

---

## 7. 리듬 게임 엔진

### 7.1 시간 기준

게임 시간은 `performance.now()`와 `AudioContext.currentTime` 중 하나를 기준으로 일관되게 사용하라.
추천 방식:

* 사운드/음악이 있는 경우: `AudioContext.currentTime` 기준
* 현재 프로토타입처럼 배경음악 없이 타격음 중심이면: `performance.now()` 기준
* 추후 음악 동기화를 위해 `GameClock` 추상화 작성

```ts
export interface GameClock {
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  nowMs(): number;
}
```

### 7.2 Chart 포맷

차트는 TypeScript 객체와 JSON 모두 지원할 수 있게 설계한다.

```ts
export interface Chart {
  id: string;
  title: string;
  artist?: string;
  bpm: number;
  offsetMs: number;
  durationMs: number;
  difficulty: 'tutorial' | 'easy' | 'normal' | 'hard';
  notes: ChartNote[];
}

export interface ChartNote {
  id: string;
  timeMs: number;
  lane: LaneId;
  type?: 'tap';
}
```

예시 차트를 최소 4개 만든다.

1. `tutorial`

   * 제목: `첫 박자: 둥-짝`
   * BPM: 80
   * 패턴: Bass, Slap, Bass, Slap
   * 목적: 터치 위치 익히기

2. `beginner`

   * 제목: `기본 4비트`
   * BPM: 92
   * 패턴: Bass on 1/3, Slap on 2/4

3. `groove8`

   * 제목: `8비트 카혼 그루브`
   * BPM: 108
   * 패턴: Bass와 Slap 교차, 양손 번갈아 사용

4. `fillChallenge`

   * 제목: `필인 챌린지`
   * BPM: 118
   * 패턴: 마지막 마디에 빠른 Slap/Bass 조합

### 7.3 노트 이동

일반 리듬 게임처럼 단순 하단 판정선이 아니라, 실제 카혼 타격 지점으로 노트가 떨어지게 만든다.

각 lane은 `LANE_META`의 target x/y를 가진다.
노트는 화면 상단 `y = -12%`에서 시작해 해당 lane의 target y까지 내려온다.

```ts
const NOTE_TRAVEL_MS = 1400;

progress = clamp(1 - (note.timeMs - nowMs) / NOTE_TRAVEL_MS, 0, 1);
x = laneMeta.x;
y = lerp(-12, laneMeta.y, easeOutLinear(progress));
```

각 lane의 target 위치에는 판정 타깃 링을 표시한다.

* Slap row: 상단 좌/우 타깃 링
* Bass row: 중앙 하단 좌/우 타깃 링

사용자가 “판정선”을 명확히 인지하도록 다음 중 하나를 구현한다.

* 각 타격 지점에 glowing target ring
* Slap row와 Bass row에 얇은 horizontal guide line
* 노트가 target ring에 닿는 순간 pulse

### 7.4 판정 로직

다음 판정창을 기본값으로 사용한다.

```ts
export const JUDGE_WINDOWS = {
  PERFECT: 45,
  GREAT: 80,
  GOOD: 120,
  BAD: 160,
} as const;
```

판정 알고리즘:

1. 입력 lane에서 아직 판정되지 않은 note 중 가장 가까운 note를 찾는다.
2. `deltaMs = inputTimeMs - note.timeMs`
3. `abs(deltaMs)`가 160ms 이내면 판정 처리
4. 가장 좋은 window부터 체크
5. window 밖이면 빈 터치로 처리하되, 과도한 페널티는 주지 않음
6. note.timeMs + 170ms가 지나면 Miss 처리
7. Miss는 combo를 끊음
8. Perfect/Great/Good/Bad는 combo를 유지하되 Bad는 점수 낮게

판정 결과 타입:

```ts
export type Judgement = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD' | 'MISS';

export interface HitResult {
  judgement: Judgement;
  deltaMs: number;
  scoreDelta: number;
  comboAfter: number;
}
```

### 7.5 점수

기본 점수:

```ts
PERFECT = 1000
GREAT   = 700
GOOD    = 350
BAD     = 100
MISS    = 0
```

콤보 보너스:

```ts
comboMultiplier = 1 + Math.min(combo, 100) * 0.002
finalDelta = Math.round(baseScore * comboMultiplier)
```

정확도:

```ts
accuracy = weightedJudgementScore / maxPossibleScore
PERFECT = 1.0
GREAT = 0.8
GOOD = 0.5
BAD = 0.2
MISS = 0
```

랭크:

* S+: 98% 이상
* S: 95% 이상
* A: 90% 이상
* B: 80% 이상
* C: 70% 이상
* D: 그 미만

별점:

* 3 stars: 95% 이상
* 2 stars: 85% 이상
* 1 star: 70% 이상

---

## 8. 게임 화면 UI

### 8.1 HomeScreen

구성:

* 앱 로고: `cajon-icon.png`
* 제목: `Cajon Rhythm`
* 부제: `손끝으로 치는 카혼 리듬 게임`
* 버튼:

  * `연주 모드`
  * `리듬 게임 시작`
  * `튜토리얼`
  * `설정`

처음 시작 시 반드시 오디오 unlock을 수행한다.

```ts
onStartClick = async () => {
  await audioEngine.unlock();
  await audioEngine.preload();
  navigateToGame();
}
```

### 8.2 GameScreen

구성:

* 상단 HUD:

  * Score
  * Combo
  * Accuracy
  * Song title
  * Pause button

* 중앙:

  * CajonStage
  * Note layer
  * TouchPad layer
  * Hit feedback layer

* 하단:

  * 현재 모드 표시
  * 설정/보정 버튼

### 8.3 ResultModal

곡 종료 후 표시:

* Score
* Max Combo
* Accuracy
* Rank
* Stars
* Perfect/Great/Good/Bad/Miss count
* 다시하기
* 곡 선택
* 연주 모드

결과는 localStorage에 저장한다.

```ts
localStorage key:
cajon-rhythm:bestScores:v1
```

---

## 9. 비주얼 스타일

전체 스타일은 첨부 이미지의 손그림 라인아트 감성을 살린다.

핵심 키워드:

* 손그림
* 카혼 악기
* 모바일 리듬 게임
* 반응성 빠른 터치
* 과하지 않은 귀여움
* 깔끔한 UX
* 라인아트 + 은은한 질감

### 9.1 색상 토큰

```css
:root {
  --bg: #ECECEC;
  --panel: #F0F0F0;
  --ink: #111111;
  --muted: #777777;

  --slap: #6AA9FF;
  --slap-soft: rgba(106, 169, 255, .18);

  --bass: #D9A441;
  --bass-soft: rgba(217, 164, 65, .18);

  --perfect: #5AE6B8;
  --great: #8DD8FF;
  --good: #FFD166;
  --bad: #FF9F6E;
  --miss: #B0B0B0;
}
```

### 9.2 노트 디자인

Slap note:

* 작고 날카로운 느낌
* 손가락/상단 손 이미지 느낌
* 색상: slap 계열
* 모양: 둥근 사각형 또는 작은 손바닥 아이콘

Bass note:

* 더 묵직한 느낌
* full palm 이미지 느낌
* 색상: bass 계열
* 모양: 더 넓은 둥근 사각형 또는 원형 pulse

노트에는 lane label을 아주 작게 넣어도 좋다.

### 9.3 텍스트 질감

`Slap`, `Bass` 텍스트는 단순 글자가 아니라 첨부 이미지처럼 질감 있게 표현한다.

CSS 예시:

```css
.textureText {
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  background:
    repeating-linear-gradient(
      -8deg,
      rgba(0,0,0,.55) 0 2px,
      rgba(0,0,0,.25) 2px 4px,
      transparent 4px 6px
    );
  -webkit-background-clip: text;
  background-clip: text;
  opacity: .75;
}
```

---

## 10. 애니메이션과 피드백

### 10.1 터치 피드백

터치 순간 즉시 실행:

* scale down
* ripple
* 손 이미지 opacity/contrast 변화
* hit flash
* haptic vibration

판정 결과가 있는 경우:

* `PERFECT`: 밝은 ring + 위로 떠오르는 텍스트
* `GREAT`: ring + 작은 sparkle
* `GOOD`: 약한 ring
* `BAD`: 둔한 회색 pulse
* `MISS`: target ring 흔들림

### 10.2 노트 애니메이션

requestAnimationFrame으로 매 프레임 업데이트한다.

주의:

* `top/left`를 계속 바꾸지 말고 `transform: translate3d(...)` 사용
* note DOM은 가능하면 object pooling
* 한 화면에 존재하는 note만 렌더링
* note가 판정 완료되면 fade-out 후 제거

### 10.3 접근성

* `prefers-reduced-motion` 감지 시 particle/ripple 최소화
* 모든 버튼에 aria-label
* 키보드 플레이 가능
* 색상만으로 lane을 구분하지 말고 label/icon도 함께 사용

---

## 11. 설정 기능

SettingsPanel을 구현한다.

필수 설정:

* Master volume
* SFX volume
* Hit sound variation on/off
* Haptic feedback on/off
* Visual effects: low / medium / high
* Timing calibration: -150ms ~ +150ms
* Debug hitbox overlay on/off

설정 저장:

```ts
localStorage key:
cajon-rhythm:settings:v1
```

### 11.1 타이밍 보정

보정값은 판정 계산에 적용한다.

```ts
effectiveInputTime = rawInputTime + calibrationMs
```

UI에서 slider로 조정 가능하게 하라.
추후 확장 가능하도록 “8박 탭 보정” 함수도 구조만 만들어둔다.

---

## 12. 튜토리얼

첫 실행 시 간단한 튜토리얼을 제공한다.

튜토리얼 단계:

1. “상단 모서리를 치면 Slap 소리가 납니다.”

   * Slap L/R target pulse
2. “중앙을 치면 Bass 소리가 납니다.”

   * Bass L/R target pulse
3. “떨어지는 노트가 손 위치에 닿을 때 터치하세요.”
4. “Perfect에 가까울수록 점수와 콤보가 올라갑니다.”
5. “이제 첫 박자: 둥-짝을 연습합니다.”

튜토리얼에는 첨부된 손 이미지와 pose 이미지를 적극 활용하라.

---

## 13. 리듬 콘텐츠

최소 4개 차트를 구현한다.
차트는 사람이 읽기 쉽게 작성한다.

예시 generator를 만들어도 된다.

```ts
function note(bar: number, beat: number, lane: LaneId): ChartNote {
  const timeMs = ((bar * 4 + beat) * 60_000) / bpm;
  return { id: `${bar}-${beat}-${lane}`, timeMs, lane };
}
```

튜토리얼 차트 예시:

```ts
export const tutorialChart: Chart = {
  id: 'tutorial',
  title: '첫 박자: 둥-짝',
  bpm: 80,
  offsetMs: 0,
  durationMs: 16000,
  difficulty: 'tutorial',
  notes: [
    { id: 'n1', timeMs: 1000, lane: 'BASS_L' },
    { id: 'n2', timeMs: 1750, lane: 'SLAP_R' },
    { id: 'n3', timeMs: 2500, lane: 'BASS_R' },
    { id: 'n4', timeMs: 3250, lane: 'SLAP_L' },
  ],
};
```

실제 구현에서는 곡 시작 전 count-in 4박을 보여준다.

---

## 14. 상태 관리

초기에는 외부 상태관리 라이브러리를 쓰지 말고 React state + reducer로 충분히 구현한다.
게임 루프와 판정 상태는 `RhythmEngine` 인스턴스가 관리하고, React는 snapshot을 구독한다.

예시:

```ts
export interface GameSnapshot {
  mode: 'idle' | 'countIn' | 'playing' | 'paused' | 'finished';
  nowMs: number;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  visibleNotes: RuntimeNote[];
  lastJudgements: FloatingJudgement[];
}
```

`RhythmEngine`은 다음 메서드를 제공한다.

```ts
class RhythmEngine {
  loadChart(chart: Chart): void;
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  tick(nowMs: number): GameSnapshot;
  hit(lane: LaneId, inputTimeMs: number): HitResult | null;
}
```

---

## 15. QA와 테스트

반드시 순수 로직 테스트를 작성한다.

### 15.1 judge.test.ts

테스트 케이스:

* delta 0ms → PERFECT
* delta 44ms → PERFECT
* delta 46ms → GREAT
* delta 81ms → GOOD
* delta 121ms → BAD
* delta 161ms → null 또는 miss window 밖
* 이미 판정된 note는 다시 판정되지 않음
* 같은 lane에서 가장 가까운 note가 선택됨
* 다른 lane note는 선택되지 않음

### 15.2 rhythmEngine.test.ts

테스트 케이스:

* chart load 후 notes 정렬
* start 후 now 증가
* hit 성공 시 score/combo 증가
* miss 시 combo reset
* 곡 종료 시 finished 상태

### 15.3 수동 테스트 체크리스트

다음 조건을 만족해야 한다.

* `npm install` 성공
* `npm run dev` 실행
* `npm run build` 성공
* `npm run test` 성공
* 모바일 390x844 화면에서 가로 스크롤 없음
* 네 터치 영역 모두 터치 가능
* 두 손가락 동시 입력 가능
* Slap L/R은 slap.mp3 또는 fallback slap 사운드
* Bass L/R은 bass.mp3 또는 fallback bass 사운드
* 판정 텍스트 표시
* score/combo/accuracy 업데이트
* 결과 화면 표시
* 설정 저장/복원
* 오디오 unlock 전후 오류 없음
* Safari에서 첫 터치 후 소리 재생 가능

---

## 16. PWA

기본 PWA를 구성한다.

* `manifest.webmanifest`
* 앱 이름: `Cajon Rhythm`
* short name: `Cajon`
* theme color: `#F0F0F0`
* background color: `#ECECEC`
* icon: `cajon-icon.png` 기반
* 모바일 홈 화면 추가 가능

Service Worker는 복잡하게 만들지 말고, Vite 환경에서 안전하게 적용 가능한 수준으로 구현한다.
오디오와 이미지 asset은 캐싱하되, 개발 중 캐시 때문에 최신 코드가 안 보이는 문제가 생기지 않게 주의하라.

---

## 17. 성능 기준

목표:

* 60fps에 가깝게 유지
* 입력 후 시각 피드백 즉시 표시
* 사운드 재생 체감 지연 최소화
* 큰 이미지로 인한 초기 로딩 지연 방지

구현 규칙:

* 큰 PNG 원본을 그대로 화면에 여러 번 렌더링하지 말라
* note 이동은 transform 사용
* requestAnimationFrame 루프는 playing 상태에서만 실행
* React state 업데이트를 매 프레임 과도하게 하지 말라
* visibleNotes만 렌더링
* 이미지에는 width/height 지정
* pointerdown 핸들러는 가볍게 유지
* console spam 금지

---

## 18. 개발 단계

아래 순서대로 진행하라. 각 단계 완료 후 빌드/테스트 가능한 상태를 유지하라.

### Phase 1 — 프로젝트 분석과 자산 정리

1. 현재 파일 구조 확인
2. 기존 코드가 있으면 기능과 문제점 요약
3. 첨부 이미지들을 assets 폴더로 정리
4. ASCII alias 생성
5. `assets.ts` 작성
6. `slap.mp3`, `bass.mp3` 존재 여부 확인
7. 없으면 fallback synth 구현 계획 확정

완료 기준:

* 앱에서 `cajon-icon.png`, hand 이미지들을 import 가능
* 원본 파일 보존
* 깨진 import 없음

### Phase 2 — 기본 앱 셸과 화면 흐름

1. HomeScreen 구현
2. GameScreen 구현
3. SettingsPanel skeleton 구현
4. ResultModal skeleton 구현
5. 라우팅은 단순 state로 처리

완료 기준:

* 홈 → 연주 모드 → 홈 이동 가능
* 홈 → 리듬 게임 → 결과 화면 흐름 가능

### Phase 3 — 카혼 본체와 터치 패드

1. CajonBody 구현
2. Slap/Bass pad 좌표 배치
3. 손 이미지 아이콘 적용
4. 텍스처 텍스트 적용
5. Active/ripple 피드백 구현
6. 키보드 입력 매핑

완료 기준:

* 네 영역 터치/키보드 입력 시 시각 피드백
* 모바일 화면에서 배치 안정적
* debug hitbox overlay 작동

### Phase 4 — AudioEngine

1. AudioContext unlock 구현
2. slap/bass preload 구현
3. AudioBuffer 재생 구현
4. fallback synth 구현
5. gain/pan/detune variation 구현
6. 설정 볼륨 연동

완료 기준:

* Slap 터치 시 slap sound
* Bass 터치 시 bass sound
* 빠른 연타/동시 입력에도 소리 끊김 없음
* 오디오 파일 없어도 앱 실행 가능

### Phase 5 — 리듬 엔진

1. Chart 타입 구현
2. Judge 함수 구현
3. RhythmEngine 구현
4. visible note 계산
5. miss 처리
6. score/combo/accuracy 계산

완료 기준:

* 테스트 통과
* 노트가 target으로 이동
* 타이밍에 맞게 터치하면 판정 발생
* 놓치면 Miss 발생

### Phase 6 — 게임 콘텐츠

1. tutorial chart
2. beginner chart
3. groove8 chart
4. fillChallenge chart
5. 곡 선택 UI
6. count-in UI

완료 기준:

* 최소 4개 차트 선택 가능
* 각 차트 시작/종료 가능
* 결과 저장 가능

### Phase 7 — 튜토리얼과 UX polish

1. 첫 실행 튜토리얼
2. target pulse 안내
3. judgement floating text 개선
4. result modal polish
5. haptic feedback
6. reduced motion 대응

완료 기준:

* 처음 사용자가 어디를 눌러야 하는지 이해 가능
* 타격감이 명확함

### Phase 8 — PWA, QA, 마무리

1. manifest 구성
2. icon 연결
3. localStorage migration-safe key 사용
4. build/test 실행
5. 모바일 수동 테스트
6. README 작성

완료 기준:

* `npm run build` 성공
* `npm run test` 성공
* README에 실행법, 오디오 파일 위치, 차트 추가법 설명

---

## 19. README 작성

README에는 다음을 포함하라.

```md
# Cajon Rhythm

## 실행
npm install
npm run dev

## 빌드
npm run build

## 테스트
npm run test

## 오디오 파일
public/audio/slap.mp3
public/audio/bass.mp3

파일이 없으면 fallback synth가 작동합니다.

## 차트 추가
src/charts/ 안에 Chart 객체를 추가하고 chart list에 등록하세요.

## 키보드 조작
A: Slap L
S: Bass L
K: Bass R
L: Slap R

## 모바일 팁
첫 시작 버튼을 눌러 오디오를 활성화하세요.
```

---

## 20. 구현 시 절대 하지 말 것

* 첨부 이미지 무시 금지
* 단순 버튼 4개만 만들고 끝내지 말 것
* HTML audio 태그 반복 재생으로만 구현하지 말 것
* 게임 로직을 React 컴포넌트 내부에 난잡하게 몰아넣지 말 것
* 모바일에서 스크롤/줌/선택이 발생하게 두지 말 것
* 노트 렌더링을 setInterval만으로 대충 처리하지 말 것
* 빌드가 깨진 상태로 종료하지 말 것
* 오디오 파일이 없다고 앱 전체가 실패하게 하지 말 것

---

## 21. 최종 산출물

최종적으로 다음을 제공하라.

1. 동작하는 모바일 우선 카혼 리듬 게임 웹앱
2. 연주 모드
3. 리듬 게임 모드
4. Slap/Bass 4영역 터치 입력
5. Web Audio 기반 타격음
6. 노트 낙하/판정/점수/콤보/결과 화면
7. 첨부 이미지 기반 카혼 비주얼
8. 설정/타이밍 보정/localStorage 저장
9. 최소 4개 차트
10. 테스트 코드
11. README

구현 후 마지막 응답에는 다음을 정리하라.

* 변경한 주요 파일
* 실행 방법
* 테스트 결과
* 오디오 파일을 넣어야 하는 위치
* 추가 개선 제안 3개 이하

````

추가로, 코드 에이전트가 중간에 너무 크게 벌리거나 멈추면 아래 짧은 후속 프롬프트를 붙이면 됩니다.

```markdown
지금까지 만든 구조를 유지하되, 범위를 줄여서 반드시 실행 가능한 MVP로 마무리해줘. 우선순위는 1) 모바일 카혼 UI, 2) 네 영역 터치 사운드, 3) 노트 판정, 4) 점수/콤보, 5) 빌드 성공이야. 미완성 고급 기능은 TODO로 남기고, 깨진 import와 타입 오류를 모두 해결해줘.
