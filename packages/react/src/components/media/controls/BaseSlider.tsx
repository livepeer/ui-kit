import {
  BaseSliderProps,
  useBaseSlider,
} from '@livepeer/core-react/components';
import { CSS } from '@stitches/react';
import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';

import * as React from 'react';

import { useMediaController } from '../../../context';

const UPDATE_FREQUENCY_MS = 50;

const mediaControllerSelector = ({
  device,
}: MediaControllerState<HTMLMediaElement>) => ({
  device,
});

export type { BaseSliderProps };

export const BaseSlider: React.FC<BaseSliderProps> = (props) => {
  const { device } = useMediaController(mediaControllerSelector);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [sliderLocation, setSliderLocation] = React.useState({
    width: 0,
    left: 0,
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const boundingRect = ref.current?.getBoundingClientRect();

        setSliderLocation({
          width: boundingRect?.width ?? 0,
          left: boundingRect?.left ?? 0,
        });
      };

      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [isActive, setIsActive] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState(0);

  const {
    title,
    value,
    active,
    handle,
    sliderProps,
    sliderLeftTrackProps,
    sliderMiddleTrackProps,
    sliderRightTrackProps,
  } = useBaseSlider({
    isActive: isActive || device?.isMobile,
    sliderWidth: sliderLocation.width,
    defaultThumbIcon: <Thumb />,
    ...props,
  });

  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (isDragging) {
      const onMouseMove = async (e: MouseEvent) => {
        const shouldUpdate = Date.now() - lastUpdate > UPDATE_FREQUENCY_MS;

        await sliderProps.onUpdate(
          e.clientX - sliderLocation.left,
          shouldUpdate,
        );
        if (shouldUpdate) {
          setLastUpdate(Date.now());
        }
      };

      const onTouchMove = async (e: TouchEvent) => {
        const shouldUpdate = Date.now() - lastUpdate > UPDATE_FREQUENCY_MS;

        const clientX = e.touches?.item?.(0)?.clientX;
        if (clientX) {
          await sliderProps.onUpdate(
            clientX - sliderLocation.left,
            shouldUpdate,
          );
          if (shouldUpdate) {
            setLastUpdate(Date.now());
          }
        }
      };

      const onMouseUp = async (e: MouseEvent) => {
        setIsDragging(false);

        await sliderProps.onUpdate(e.clientX - sliderLocation.left, true);
        await props?.onDone?.();
      };

      const onTouchEnd = async (e: TouchEvent) => {
        setIsDragging(false);

        const clientX =
          e.touches?.item?.(0)?.clientX ?? e.changedTouches?.item?.(0)?.clientX;

        if (clientX) {
          await sliderProps.onUpdate(clientX - sliderLocation.left, true);
        }

        await props?.onDone?.();
      };

      document?.addEventListener('mousemove', onMouseMove);
      document?.addEventListener('mouseup', onMouseUp);

      document?.addEventListener('touchmove', onTouchMove);
      document?.addEventListener('touchend', onTouchEnd);
      // TODO handle mouse out

      return () => {
        document?.removeEventListener('mousemove', onMouseMove);
        document?.removeEventListener('mouseup', onMouseUp);
        document?.removeEventListener('touchmove', onTouchMove);
        document?.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [isDragging, sliderProps, props, sliderLocation, lastUpdate]);

  const onPointerDown = React.useCallback(
    async (e: React.MouseEvent) => {
      await sliderProps.onUpdate(e.clientX - sliderLocation.left);
      setIsDragging(true);
    },
    [sliderProps, sliderLocation],
  );

  const onMouseEnter = React.useCallback(async () => {
    setIsActive(true);
  }, [setIsActive]);

  const onMouseLeave = React.useCallback(async () => {
    setIsActive(false);
  }, [setIsActive]);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={title}
      aria-orientation="horizontal"
      className={styling.slider.container()}
    >
      {sliderLeftTrackProps.shown && (
        <div
          className={styling.slider.track.left({
            size: active ? 'active' : 'default',
            rounded: sliderLeftTrackProps.rounded,
            css: sliderLeftTrackProps.css,
          })}
        />
      )}

      {handle}

      {sliderMiddleTrackProps.shown && (
        <div
          className={styling.slider.track.middle({
            size: active ? 'active' : 'default',
            rounded: sliderMiddleTrackProps.rounded,
            css: sliderMiddleTrackProps.css,
          })}
        />
      )}

      {sliderRightTrackProps.shown && (
        <div
          className={styling.slider.track.right({
            size: active ? 'active' : 'default',
            rounded: sliderRightTrackProps.rounded,
            css: sliderRightTrackProps.css,
          })}
        />
      )}
    </div>
  );
};

const Thumb = ({ size, css }: { size?: 'active' | 'default'; css?: CSS }) => (
  <div className={styling.slider.thumb({ css, size })} />
);
