import { LANE_META } from '../engine/judge';
import type { RuntimeVisibleNote } from '../engine/rhythmEngine';

interface NoteViewProps {
  notes: RuntimeVisibleNote[];
}

type NoteStyle = React.CSSProperties & {
  '--note-x': string;
  '--note-y': string;
  '--note-progress': number;
};

export function NoteView({ notes }: NoteViewProps) {
  return (
    <div className="note-layer" aria-hidden="true">
      {notes.map((note) => {
        const lane = LANE_META[note.lane];
        const style: NoteStyle = {
          '--note-x': `${note.x}%`,
          '--note-y': `${note.y}%`,
          '--note-progress': note.progress
        };
        return (
          <span key={note.id} className={`note-anchor ${lane.sound}`} style={style}>
            <span className="note-chip">{lane.label}</span>
          </span>
        );
      })}
    </div>
  );
}
