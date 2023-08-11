'use client';

import { PlayerProps } from '@livepeer/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import PlayerPage from './PlayerPage';
import { fetchPlaybackInfo } from '../utils/client';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

interface CountdownPageProps extends PlayerProps<object, any> {
  countdown: number;
  id: string;
}
interface CountdownProps {
  total: number;
  completed: boolean;
}

const nycToLocalTimestamp = (timestamp: number): number => {
  return dayjs.tz(timestamp, 'America/New_York').local().valueOf();
};

const formattedDate = (timestamp: number): string => {
  return dayjs(timestamp).format('MMMM D, h:mm a');
};
const CountdownPage: React.FC<CountdownPageProps> = ({
  poster,
  countdown,
  id,
  src,
  playbackInfo,
  muted,
  autoPlay,
  loop,
  objectFit,
  lowLatency,
}) => {
  const [startingSoon, setStartingSoon] = useState(!countdown);
  const [isLive, setIsLive] = useState(false);

  const localCountdown = nycToLocalTimestamp(countdown);

  const onCountdownComplete = async () => {
    setStartingSoon(true);
    const interval = setInterval(async () => {
      if (document.hidden) return; // Do not proceed if the tab/window is not active
      try {
        const playbackData = await fetchPlaybackInfo(id);
        if (playbackData?.meta?.live) {
          setIsLive(true);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching playback info:', error);
      }
    }, 3000);
  };

  useEffect(() => {
    if (!countdown) {
      onCountdownComplete();
    }
  }, []);

  const countdownRenderer = ({
    total,
    completed,
  }: CountdownProps): string | null => {
    console.log(total);
    if (completed) {
      onCountdownComplete();
      return null;
    }

    return `Live ${dayjs.duration(total).humanize(true)}`;
  };

  return isLive ? (
    <PlayerPage
      src={src}
      playbackInfo={playbackInfo}
      muted={muted}
      autoPlay={autoPlay}
      loop={loop}
      objectFit={objectFit}
      lowLatency={lowLatency}
    />
  ) : (
    <CountdownBackdrop poster={poster as string}>
      <CountdownDisplay
        startingSoon={startingSoon}
        localCountdown={localCountdown}
        renderer={countdownRenderer}
      />
    </CountdownBackdrop>
  );
};

const CountdownBackdrop: React.FC<{
  poster: string | undefined;
  children: ReactNode;
}> = ({ poster, children }) => (
  <section
    style={{
      backgroundImage: `url(${poster})`,
      backgroundPosition: 'center',
      display: 'flex',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      position: 'relative',
    }}
  >
    {children}
  </section>
);

const CountdownDisplay: React.FC<{
  startingSoon: boolean;
  localCountdown: number;
  renderer: any;
}> = ({ startingSoon, localCountdown, renderer }) => (
  <div
    style={{
      background: 'rgba(1,1,1,0.5)',
      color: '#ffffff',
      bottom: '0',
      left: '0',
      position: 'absolute',
      margin: '20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: '1.2em',
      width: '17rem',
      borderRadius: '10px',
    }}
  >
    {clockIcon()}
    {!startingSoon ? (
      <div
        style={{
          marginLeft: '1em',
          marginTop: '1em',
        }}
      >
        <Countdown date={localCountdown} renderer={renderer} />
        <p style={{ marginTop: '0.2em' }}>{formattedDate(localCountdown)}</p>
      </div>
    ) : (
      <p style={{ marginLeft: '1em' }}>Starting soon!</p>
    )}
  </div>
);

const clockIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    style={{
      marginLeft: '1rem',
    }}
    height="2em"
    width="2em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
    <path d="M13 7h-2v6h6v-2h-4z"></path>
  </svg>
);

export default CountdownPage;
