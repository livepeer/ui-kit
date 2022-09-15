import { styled } from '@stitches/react';

import * as React from 'react';

import { PropsOf, useMemoizedIcon } from './system';

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
  borderTopLeftRadius: 3,
  borderBottomLeftRadius: 3,
});

const SecondaryTrack = styled(sharedTrack, {});

const FutureTrack = styled(sharedTrack, {
  borderTopRightRadius: 3,
  borderBottomRightRadius: 3,
});

const DefaultThumb = styled('div', {
  width: 10,
  height: 10,

  borderRadius: '100%',
  backgroundColor: 'white',
});

export type SliderProps = Omit<
  PropsOf<'div'>,
  'children' | 'onChange' | 'color'
> & {
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

export const Slider = (props: SliderProps) => {
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

      const onMouseUp = async (e: MouseEvent) => {
        setIsDragging(false);

        await onUpdate(e.clientX);
        await props?.onDone?.();
      };

      document?.addEventListener('mousemove', onMouseMove);
      document?.addEventListener('mouseup', onMouseUp);
      // TODO handle mouse out

      return () => {
        document?.removeEventListener('mousemove', onMouseMove);
        document?.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isDragging, onUpdate, props]);

  const _handle = useMemoizedIcon(props?.thumbIcon, <DefaultThumb />);

  const [value, secondaryValue] = React.useMemo(
    () => [
      props.value,
      props.secondaryValue ? props.secondaryValue - props.value : 0,
    ],
    [props.value, props.secondaryValue],
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
    }),
    [secondaryValue, props?.rangeBackgroundColor, isActiveOrDragging],
  );

  const futureCss = React.useMemo(
    () => ({
      flex: 1 - (value + secondaryValue),
      backgroundColor: props?.rangeBackgroundColor ?? '#00A55F',
      opacity: 0.2,
      height: isActiveOrDragging ? 5 : 3,
    }),
    [value, secondaryValue, props?.rangeBackgroundColor, isActiveOrDragging],
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

  return (
    <Range
      {...props}
      ref={ref}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(props.value * 100)}
      aria-orientation="horizontal"
    >
      <PastTrack css={pastCss} />

      {isActiveOrDragging && _handle}

      {props.secondaryValue && <SecondaryTrack css={secondaryCss} />}

      <FutureTrack css={futureCss} />
    </Range>
  );
};
