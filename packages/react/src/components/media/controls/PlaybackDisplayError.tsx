import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import OfflineStreamImage from './images/OfflineStreamImage';
import PrivateStreamImage from './images/PrivateStreamImage';

export const OfflineStreamError: React.FC = () => (
  <div className={styling.controlsContainer.error.background()}>
    <OfflineStreamImage />
    <div className={styling.controlsContainer.error.title()}>
      Stream is offline
    </div>
    <div className={styling.controlsContainer.error.text()}>
      Playback will start automatically once stream has started.
    </div>
  </div>
);

export const PrivateStreamError: React.FC = () => (
  <div className={styling.controlsContainer.error.background()}>
    <PrivateStreamImage />
    <div className={styling.controlsContainer.error.title()}>
      Stream is private
    </div>
    <div className={styling.controlsContainer.error.text()}>
      It looks like you don't have permission to view this content.
    </div>
  </div>
);
