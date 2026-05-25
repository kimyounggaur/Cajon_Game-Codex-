import { useState } from 'react';
import { ASSETS } from '../assets/assets';

const STEPS = [
  {
    title: 'Slap',
    body: '상단 모서리를 치면 Slap 소리가 납니다.',
    image: ASSETS.handSlapUpper.src
  },
  {
    title: 'Bass',
    body: '중앙을 치면 Bass 소리가 납니다.',
    image: ASSETS.handBassFull.src
  },
  {
    title: 'Timing',
    body: '떨어지는 노트가 손 위치에 닿을 때 터치하세요.',
    image: ASSETS.mainLayoutRef.src
  },
  {
    title: 'Score',
    body: 'Perfect에 가까울수록 점수와 콤보가 올라갑니다.',
    image: ASSETS.poseGuide.src
  },
  {
    title: 'Practice',
    body: '이제 첫 박자: 둥-짝을 연습합니다.',
    image: ASSETS.cajonIcon.src
  }
];

interface TutorialOverlayProps {
  onClose: () => void;
  onPractice: () => void;
}

export function TutorialOverlay({ onClose, onPractice }: TutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="tutorial-panel" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">
              {stepIndex + 1}/{STEPS.length}
            </p>
            <h2 id="tutorial-title">{step.title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="tutorial-visual">
          <img src={step.image} alt="" />
        </div>
        <p className="tutorial-copy">{step.body}</p>

        <div className="modal-actions">
          <button
            type="button"
            onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
            disabled={stepIndex === 0}
          >
            이전
          </button>
          {isLast ? (
            <button type="button" className="primary-action" onClick={onPractice}>
              연습 시작
            </button>
          ) : (
            <button
              type="button"
              className="primary-action"
              onClick={() => setStepIndex((value) => Math.min(STEPS.length - 1, value + 1))}
            >
              다음
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
