import { useTimeDisplay } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';

import { useMediaController } from '../../../context';

const mediaControllerSelector = ({
  duration,
  progress,
  live,
}: MediaControllerState<HTMLMediaElement>) => ({
  duration,
  progress,
  live,
});

export const TimeDisplay: React.FC = () => {
  const { duration, progress, live } = useMediaController(
    mediaControllerSelector,
  );

  const { title, live: isLive } = useTimeDisplay({
    duration,
    progress,
    live,
  });

  return (
    <>
      <span className={styling.time.text()} aria-label={'Playback time'}>
        {title}
      </span>
      {isLive && (
        <div className={styling.time.container()}>
          <div className={styling.time.liveIndicator()} />
          <span
            className={styling.time.text()}
            aria-label={'Live streaming media'}
          >
            LIVE
          </span>
        </div>
      )}
    </>
  );
};
