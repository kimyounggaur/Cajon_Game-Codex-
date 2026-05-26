interface RhythmPreviewPlayerProps {
  disabled?: boolean;
  onPreview: () => void | Promise<void>;
}

export function RhythmPreviewPlayer({ disabled, onPreview }: RhythmPreviewPlayerProps) {
  return (
    <button
      className="rhythm-preview-button"
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        void onPreview();
      }}
    >
      미리듣기
    </button>
  );
}
