import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import OfflineStreamImage from './images/OfflineStreamImage';
import PrivateStreamImage from './images/PrivateStreamImage';

export type OfflineStreamErrorProps = {
  isBroadcast: boolean;
};

export const OfflineStreamError = ({
  isBroadcast,
}: OfflineStreamErrorProps) => (
  <div className={styling.controlsContainer.error.background()}>
    <OfflineStreamImage />
    <div className={styling.controlsContainer.error.title()}>
      {isBroadcast ? 'Stream key invalid' : 'Stream is offline'}
    </div>
    <div className={styling.controlsContainer.error.text()}>
      {isBroadcast
        ? 'The provided stream key could not be found. Please check it and try again.'
        : 'Playback will start automatically once the stream has started.'}
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

export type GenericErrorProps = {
  isBroadcast: boolean;
};

export const GenericError = ({ isBroadcast }: GenericErrorProps) => (
  <div className={styling.controlsContainer.error.background()}>
    <OfflineStreamImage />
    <div className={styling.controlsContainer.error.title()}>
      {isBroadcast ? 'Broadcast failed' : 'Playback failed'}
    </div>
    <div className={styling.controlsContainer.error.text()}>
      {isBroadcast
        ? 'There was an error with broadcasting - please try again later.'
        : `There was an error with playback - please wait while we are retrying in the background.`}
    </div>
  </div>
);
