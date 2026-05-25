import { ASSETS } from '../assets/assets';
import type { LaneId } from '../engine/chart';
import { LANE_IDS, LANE_META, type Judgement } from '../engine/judge';

interface TouchPadProps {
  activeLanes: LaneId[];
  lastJudgements: Partial<Record<LaneId, Judgement>>;
  onLaneDown: (lane: LaneId) => void;
  onLaneUp: (lane: LaneId) => void;
}

type PadStyle = React.CSSProperties & {
  '--pad-x': string;
  '--pad-y': string;
};

export function TouchPad({ activeLanes, lastJudgements, onLaneDown, onLaneUp }: TouchPadProps) {
  return (
    <div className="touch-layer">
      {LANE_IDS.map((lane) => {
        const meta = LANE_META[lane];
        const isActive = activeLanes.includes(lane);
        const image = meta.sound === 'slap' ? ASSETS.handSlapUpper : ASSETS.handBassFull;
        const style: PadStyle = {
          '--pad-x': `${meta.x}%`,
          '--pad-y': `${meta.y}%`
        };
        const judgement = lastJudgements[lane];
        return (
          <button
            key={lane}
            className={`touch-pad ${meta.sound} ${isActive ? 'active' : ''} ${lane.endsWith('_R') ? 'right' : 'left'}`}
            style={style}
            type="button"
            aria-label={meta.label}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              onLaneDown(lane);
            }}
            onPointerUp={(event) => {
              event.preventDefault();
              onLaneUp(lane);
            }}
            onPointerCancel={() => onLaneUp(lane)}
          >
            <span className="target-ring" />
            <img src={image.src} alt="" draggable="false" />
            <span className="texture-text">{meta.sound === 'slap' ? 'Slap' : 'Bass'}</span>
            {judgement ? <span className={`judgement-float ${judgement.toLowerCase()}`}>{judgement}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
