export interface AppAsset {
  src: string;
  alt: string;
  fallback: string;
}

const fromBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const ASSETS = {
  cajonIcon: {
    src: fromBase('assets/cajon-icon.png'),
    alt: 'Cajon Rhythm icon',
    fallback: 'CR'
  },
  cajonPhotoRef: {
    src: fromBase('assets/cajon-photo-ref.png'),
    alt: 'Cajon reference',
    fallback: 'Cajon'
  },
  mainLayoutRef: {
    src: fromBase('assets/main-layout-ref.png'),
    alt: 'Cajon layout reference',
    fallback: 'Layout'
  },
  handBassFull: {
    src: fromBase('assets/hand-bass-full.png'),
    alt: 'Bass hand',
    fallback: 'Bass'
  },
  handSlapUpper: {
    src: fromBase('assets/hand-slap-upper.png'),
    alt: 'Slap hand',
    fallback: 'Slap'
  },
  handTapTip: {
    src: fromBase('assets/hand-tap-tip.png'),
    alt: 'Tap hand',
    fallback: 'Tap'
  },
  poseGuide: {
    src: fromBase('assets/pose-guide.png'),
    alt: 'Cajon pose guide',
    fallback: 'Guide'
  }
} satisfies Record<string, AppAsset>;

export const AUDIO_PATHS = {
  slap: fromBase('audio/slap.mp3'),
  bass: fromBase('audio/bass.mp3')
} as const;
