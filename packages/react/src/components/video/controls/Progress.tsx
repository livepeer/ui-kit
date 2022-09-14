import { styled } from '@stitches/react';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

import { PropsOf, useMemoizedIcon } from './system';

const Range = styled('div', {
  display: 'flex',
  alignItems: 'center',
  minWidth: 40,
  minHeight: 15,

  cursor: 'pointer',
  borderRadius: 0,

  height: '100%',
  width: '100%',
});

const sharedTrack = styled('div', {
  position: 'relative',
  backgroundColor: 'white',
});

const PastTrack = styled('div', {
  ...sharedTrack,
  borderTopLeftRadius: 2,
  borderBottomLeftRadius: 2,
});

const FutureTrack = styled('div', {
  ...sharedTrack,
  borderTopRightRadius: 2,
  borderBottomRightRadius: 2,
});

const DefaultThumb = styled('div', {
  width: 10,
  height: 10,

  // transform: 'translate(-5px, 0px)',

  borderRadius: '100%',
  backgroundColor: 'white',
  boxShadow: '1px 1px 1px transparent',
});

export type ProgressProps = Omit<
  PropsOf<'input'>,
  'children' | 'onChange' | 'color'
> & {
  /**
   * The icon to be used for the progress thumb.
   * @type React.ReactElement
   */
  thumbIcon?: React.ReactElement;

  /**
   * The color of the range background.
   * @type string
   */
  rangeBackgroundColor?: string;

  /**
   * The callback when the user seeks with the progress component.
   */
  onSeek?: (progress: number) => void;
};

const mediaControllerSelector = ({
  duration,
  progress,
  requestSeek,
  onPlay,
  onPause,
  playing,
}: MediaControllerState<HTMLMediaElement>) => ({
  duration,
  progress,
  requestSeek,
  onPlay,
  onPause,
  playing,
});

export const Progress = (props: ProgressProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const { duration, progress, requestSeek, onPlay, onPause, playing } =
    useMediaController(mediaControllerSelector);

  const [isActive, setIsActive] = React.useState(false);

  const [isDragging, setIsDragging] = React.useState<
    'playing' | 'paused' | 'none'
  >('none');

  const [min, max, value] = React.useMemo(
    () => [0, duration, progress] as const,
    [duration, progress],
  );

  const onSeekUpdate = React.useCallback(
    async (eventX: number) => {
      const bounding = ref.current?.getBoundingClientRect();

      if (bounding) {
        const newSeek =
          ((eventX - bounding.left) / bounding.width) * (max - min);

        await props?.onSeek?.(newSeek);
        requestSeek(newSeek);
      }
    },
    [min, max, requestSeek, props],
  );

  React.useEffect(() => {
    if (isDragging !== 'none') {
      const onMouseMove = async (e: MouseEvent) => {
        await onSeekUpdate(e.clientX);
      };

      const onMouseUp = async (e: MouseEvent) => {
        setIsDragging('none');

        await onSeekUpdate(e.clientX);
        if (isDragging === 'playing') {
          await onPlay();
        }
      };

      document?.addEventListener('mousemove', onMouseMove);
      document?.addEventListener('mouseup', onMouseUp);

      return () => {
        document?.removeEventListener('mousemove', onMouseMove);
        document?.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isDragging, onSeekUpdate, onPlay]);

  const _handle = useMemoizedIcon(props?.thumbIcon, <DefaultThumb />);

  const pastCss = React.useMemo(
    () => ({
      flex: value / (max - min),
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.8,
      height: isActive ? 5 : 3,
    }),
    [value, max, min, props?.rangeBackgroundColor, isActive],
  );
  const futureCss = React.useMemo(
    () => ({
      flex: 1 - value / (max - min),
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.2,
      height: isActive ? 5 : 3,
    }),
    [value, max, min, props?.rangeBackgroundColor, isActive],
  );

  const onPointerDown = React.useCallback(
    async (e: React.MouseEvent) => {
      setIsDragging(playing ? 'playing' : 'paused');

      await onSeekUpdate(e.clientX);
      onPause();
    },
    [onSeekUpdate, playing, onPause],
  );

  const onMouseEnter = React.useCallback(async () => {
    setIsActive(true);
  }, [setIsActive]);

  const onMouseLeave = React.useCallback(async () => {
    setIsActive(false);
  }, [setIsActive]);

  return (
    <Range
      ref={ref}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-orientation="horizontal"
    >
      <PastTrack css={pastCss} />

      {isActive && _handle}

      <FutureTrack css={futureCss} />
    </Range>
  );
};
