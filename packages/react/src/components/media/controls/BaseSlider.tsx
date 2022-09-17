import { styled } from '@stitches/react';

import * as React from 'react';

import { PropsOf, useMemoizedIcon } from '../../system';

const Range = styled('div', {
  display: 'flex',
  alignItems: 'center',
  minWidth: 80,
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

const PastTrack = styled(sharedTrack, {
  height: 30,
  borderTopLeftRadius: 2,
  borderBottomLeftRadius: 2,
});

const SecondaryTrack = styled(sharedTrack, {});

const FutureTrack = styled(sharedTrack, {
  borderTopRightRadius: 2,
  borderBottomRightRadius: 2,
});

const DefaultThumb = styled('div', {
  width: 10,
  height: 10,

  borderRadius: '100%',
  backgroundColor: 'white',
});

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

export const BaseSlider = (props: BaseSliderProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const [isActive, setIsActive] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const isActiveOrDragging = React.useMemo(
    () => isActive || isDragging,
    [isActive, isDragging],
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

  const _handle = useMemoizedIcon(props?.thumbIcon, <DefaultThumb />);

  const [value, secondaryValue] = React.useMemo(
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

  const futureValue = React.useMemo(
    () => 1 - (value + secondaryValue),
    [value, secondaryValue],
  );

  const pastCss = React.useMemo(
    () => ({
      flex: value,
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.8,
      height: isActiveOrDragging ? 5 : 3,
    }),
    [value, props?.rangeBackgroundColor, isActiveOrDragging],
  );
  const secondaryCss = React.useMemo(
    () => ({
      flex: secondaryValue,
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.45,
      height: isActiveOrDragging ? 5 : 3,
      ...(value === 0 && !isActiveOrDragging
        ? {
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }
        : {}),
      ...(futureValue === 0
        ? {
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
          }
        : {}),
    }),
    [
      value,
      futureValue,
      secondaryValue,
      props?.rangeBackgroundColor,
      isActiveOrDragging,
    ],
  );

  const futureCss = React.useMemo(
    () => ({
      flex: futureValue,
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.2,
      height: isActiveOrDragging ? 5 : 3,
    }),
    [futureValue, props?.rangeBackgroundColor, isActiveOrDragging],
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
    <Range
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
      css={{ touchAction: 'none' }}
    >
      {value > 0.001 && <PastTrack css={pastCss} />}

      {isActiveOrDragging && _handle}

      {(secondaryValue ?? 0) > 0 && <SecondaryTrack css={secondaryCss} />}

      {(futureValue ?? 0) > 0 && <FutureTrack css={futureCss} />}
    </Range>
  );
};
