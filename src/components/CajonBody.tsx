import type { ReactNode } from 'react';
import { ASSETS } from '../assets/assets';

interface CajonBodyProps {
  children: ReactNode;
  debugHitboxes: boolean;
}

export function CajonBody({ children, debugHitboxes }: CajonBodyProps) {
  return (
    <div className={debugHitboxes ? 'cajon-body debug-hitboxes' : 'cajon-body'}>
      <img className="cajon-body-art" src={ASSETS.cajonPhotoRef.src} alt="" aria-hidden="true" draggable="false" />
      <div className="cajon-front-panel">
        {children}
      </div>
    </div>
  );
}
