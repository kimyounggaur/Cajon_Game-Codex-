interface RhythmUnlockBadgeProps {
  locked: boolean;
  message: string | null;
}

export function RhythmUnlockBadge({ locked, message }: RhythmUnlockBadgeProps) {
  if (!locked) return null;
  return (
    <span className="rhythm-unlock-badge" aria-label={message ?? '잠긴 리듬'}>
      잠김
    </span>
  );
}
