import type { ReactNode } from 'react';

interface CajonBodyProps {
  children: ReactNode;
  debugHitboxes: boolean;
}

export function CajonBody({ children, debugHitboxes }: CajonBodyProps) {
  return (
    <div className={debugHitboxes ? 'cajon-body debug-hitboxes' : 'cajon-body'}>
      <span className="cajon-screw screw-tl" />
      <span className="cajon-screw screw-tr" />
      <span className="cajon-screw screw-bl" />
      <span className="cajon-screw screw-br" />
      <span className="cajon-soundhole" />
      <span className="cajon-foot foot-left" />
      <span className="cajon-foot foot-right" />
      {children}
    </div>
  );
}
