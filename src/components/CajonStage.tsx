import type { LaneId } from '../engine/chart';
import type { Judgement } from '../engine/judge';
import type { RuntimeVisibleNote } from '../engine/rhythmEngine';
import { CajonBody } from './CajonBody';
import { NoteView } from './NoteView';
import { TouchPad } from './TouchPad';

interface CajonStageProps {
  visibleNotes: RuntimeVisibleNote[];
  activeLanes: LaneId[];
  lastJudgements: Partial<Record<LaneId, Judgement>>;
  debugHitboxes: boolean;
  countdown: number | null;
  onLaneDown: (lane: LaneId) => void;
  onLaneUp: (lane: LaneId) => void;
}

export function CajonStage({
  visibleNotes,
  activeLanes,
  lastJudgements,
  debugHitboxes,
  countdown,
  onLaneDown,
  onLaneUp
}: CajonStageProps) {
  return (
    <section className="cajon-stage" aria-label="cajon stage">
      <CajonBody debugHitboxes={debugHitboxes}>
        <NoteView notes={visibleNotes} />
        <TouchPad
          activeLanes={activeLanes}
          lastJudgements={lastJudgements}
          onLaneDown={onLaneDown}
          onLaneUp={onLaneUp}
        />
        {countdown !== null ? <div className="count-in" aria-live="polite">{countdown}</div> : null}
      </CajonBody>
    </section>
  );
}
