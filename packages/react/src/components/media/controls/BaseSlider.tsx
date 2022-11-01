'use client'; // client component browser directive (React RFC-0227)

import { MediaControllerState } from 'livepeer/media/controls';
import { styling } from 'livepeer/styling';

import * as React from 'react';

import { PropsOf, useMemoizedIcon } from '../../system';
import { useMediaController } from '../context';

export type BaseSliderProps = Omit<
  PropsOf<'div'>,
  'children' | 'onChange' | 'color'
> & {
  /**
   * The name of the slider (volume, time range, etc)
   * @type string
   */
  ariaName: string;

  /**
   * The icon or element to be used for the slider thumb.
   * @type React.ReactElement
   */
  thumbIcon?: React.ReactElement;

  /**
   * The color of the range background.
   * @type string
   */
  rangeBackgroundColor?: string;

  /**
   * The slider value from 0 to 1.
   */
  value: number;

  /**
   * The secondary slider value from 0 to 1.
   */
  secondaryValue?: number;

  /**
   * The callback when the user interacts with the slider. Returns a number from 0 to 1.
   */
  onChange: (value: number) => void;

  /**
   * The callback when the user is done interacting with the slider.
   */
  onDone?: () => void;
};

const mediaControllerSelector = ({
  device,
}: MediaControllerState<HTMLMediaElement>) => ({
  device,
});

export const BaseSlider = (props: BaseSliderProps) => {
  const { device } = useMediaController(mediaControllerSelector);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [isActive, setIsActive] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const isActiveOrDragging = React.useMemo(
    () => device?.isMobile || isActive || isDragging,
    [device?.isMobile, isActive, isDragging],
  );

  const onUpdate = React.useCallback(
    async (eventX: number) => {
      const bounding = ref.current?.getBoundingClientRect();

      if (bounding) {
        const newValue = (eventX - bounding.left) / bounding.width;
        const newBoundedValue = Math.min(Math.max(0, newValue), 1);

        await props?.onChange?.(newBoundedValue);
      }
    },
    [props],
  );

  React.useEffect(() => {
    if (isDragging) {
      const onMouseMove = async (e: MouseEvent) => {
        await onUpdate(e.clientX);
      };

      const onTouchMove = async (e: TouchEvent) => {
        const clientX = e.touches?.item?.(0)?.clientX;
        if (clientX) {
          await onUpdate(clientX);
        }
      };

      const onMouseUp = async (e: MouseEvent) => {
        setIsDragging(false);

        await onUpdate(e.clientX);
        await props?.onDone?.();
      };

      const onTouchEnd = async (e: TouchEvent) => {
        setIsDragging(false);
        const clientX = e.touches?.item?.(0)?.clientX;
        if (clientX) {
          await onUpdate(clientX);
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
  }, [isDragging, onUpdate, props]);

  const _handle = useMemoizedIcon(
    props?.thumbIcon,
    <div className={styling.slider.thumb()} />,
  );

  const [value, middleValue] = React.useMemo(
    () => [
      !isNaN(props.value) ? props.value : 0,
      props.secondaryValue &&
      !isNaN(props.value) &&
      !isNaN(props.secondaryValue)
        ? props.secondaryValue - props.value
        : 0,
    ],
    [props.value, props.secondaryValue],
  );

  const rightValue = React.useMemo(
    () => 1 - (value + middleValue),
    [value, middleValue],
  );

  const onPointerDown = React.useCallback(
    async (e: React.MouseEvent) => {
      await onUpdate(e.clientX);
      setIsDragging(true);
    },
    [onUpdate],
  );

  const onMouseEnter = React.useCallback(async () => {
    setIsActive(true);
  }, [setIsActive]);

  const onMouseLeave = React.useCallback(async () => {
    setIsActive(false);
  }, [setIsActive]);

  const valueRounded = React.useMemo(() => Math.round(value * 100), [value]);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valueRounded}
      aria-valuetext={`${valueRounded}% ${props.ariaName}`}
      aria-orientation="horizontal"
      className={styling.slider.container()}
    >
      {value > 0.001 && (
        <div
          className={styling.slider.track.left({
            size: isActiveOrDragging ? 'active' : 'default',
            rounded: value === 1 && !isActiveOrDragging ? 'full' : 'left',
            css: { flex: value },
          })}
        />
      )}

      {isActiveOrDragging && _handle}

      {(middleValue ?? 0) > 0 && (
        <div
          className={styling.slider.track.middle({
            size: isActiveOrDragging ? 'active' : 'default',
            rounded:
              middleValue === 1
                ? !isActiveOrDragging
                  ? 'full'
                  : 'right'
                : value <= 0.001
                ? 'left'
                : rightValue === 0
                ? 'right'
                : 'none',
            css: { flex: middleValue },
          })}
        />
      )}

      {(rightValue ?? 0) > 0 && (
        <div
          className={styling.slider.track.right({
            size: isActiveOrDragging ? 'active' : 'default',
            rounded: value <= 0.001 && !isActiveOrDragging ? 'full' : 'right',
            css: { flex: rightValue },
          })}
        />
      )}
    </div>
  );
};
