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

## 키보드 조작
```txt
A: Slap L
S: Bass L
K: Bass R
L: Slap R
```

## 모바일 팁
첫 시작 버튼을 눌러 오디오를 활성화하세요. iOS Safari에서는 사용자 제스처 이후에만 소리가 재생됩니다.
