export interface AppAsset {
  src: string;
  alt: string;
  fallback: string;
}

export const ASSETS = {
  cajonIcon: {
    src: '/assets/cajon-icon.png',
    alt: 'Cajon Rhythm icon',
    fallback: 'CR'
  },
  cajonPhotoRef: {
    src: '/assets/cajon-photo-ref.png',
    alt: 'Cajon reference',
    fallback: 'Cajon'
  },
  mainLayoutRef: {
    src: '/assets/main-layout-ref.png',
    alt: 'Cajon layout reference',
    fallback: 'Layout'
  },
  handBassFull: {
    src: '/assets/hand-bass-full.png',
    alt: 'Bass hand',
    fallback: 'Bass'
  },
  handSlapUpper: {
    src: '/assets/hand-slap-upper.png',
    alt: 'Slap hand',
    fallback: 'Slap'
  },
  handTapTip: {
    src: '/assets/hand-tap-tip.png',
    alt: 'Tap hand',
    fallback: 'Tap'
  },
  poseGuide: {
    src: '/assets/pose-guide.png',
    alt: 'Cajon pose guide',
    fallback: 'Guide'
  }
} satisfies Record<string, AppAsset>;

export const AUDIO_PATHS = {
  slap: '/audio/slap.mp3',
  bass: '/audio/bass.mp3'
} as const;
