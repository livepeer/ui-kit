import { useMemoizedIcon } from '@livepeer/core-react/hooks';
import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';

import {
  SliderContainer,
  SliderLeft,
  SliderMiddle,
  SliderRight,
  SliderThumb,
} from '../../styling';
import { PropsOf } from '../../system';

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
  const ref = React.useRef<View | null>(null);

  const [localX, setLocalX] = React.useState<number | null>(null);

  const [sliderWidth, setSliderWidth] = React.useState(0);

  const { onChange, thumbIcon } = props;

  const isActiveOrDragging = localX !== null;

  const onUpdate = React.useCallback(
    async (locationX: number, isComplete?: boolean) => {
      if (sliderWidth) {
        const newValue = (locationX - 0) / sliderWidth;
        const newBoundedValue = Math.min(Math.max(0, newValue), 1);

        console.log({ newBoundedValue });

        if (isComplete) {
          await onChange?.(newBoundedValue);
          setLocalX(null);
        } else {
          setLocalX(newBoundedValue);
        }
      }
    },
    [onChange, sliderWidth],
  );

  const _handle = useMemoizedIcon(
    thumbIcon,
    <SliderThumb
      size={isActiveOrDragging ? 'active' : 'default'}
      pointerEvents="none"
    />,
  );

  const [value, middleValue] = React.useMemo(
    () => [
      localX !== null ? localX : !isNaN(props.value) ? props.value : 0,
      localX !== null
        ? 0
        : props.secondaryValue &&
          !isNaN(props.value) &&
          !isNaN(props.secondaryValue)
        ? props.secondaryValue - props.value
        : 0,
    ],
    [localX, props.value, props.secondaryValue],
  );

  const rightValue = React.useMemo(
    () => 1 - (value + middleValue),
    [value, middleValue],
  );

  const onTouchStart = React.useCallback(
    async (e: GestureResponderEvent) => {
      await onUpdate(e.nativeEvent.locationX);
      // setIsDragging(true);
    },
    [onUpdate],
  );

  const onTouchMove = React.useCallback(
    async (e: GestureResponderEvent) => {
      // setLocalX(e.nativeEvent.locationX);
      await onUpdate(e.nativeEvent.locationX);
    },
    [onUpdate],
  );

  const onTouchEnd = React.useCallback(
    async (e: GestureResponderEvent) => {
      await onUpdate(e.nativeEvent.locationX, true);
    },
    [onUpdate],
  );

  // const onMouseEnter = React.useCallback(async () => {
  //   setIsActive(true);
  // }, [setIsActive]);

  // const onMouseLeave = React.useCallback(async () => {
  //   setIsActive(false);
  // }, [setIsActive]);

  const valueRounded = React.useMemo(() => Math.round(value * 100), [value]);

  return (
    <SliderContainer
      ref={ref}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      accessibilityLabel={`${valueRounded}% ${props.ariaName}`}
      accessibilityRole="progressbar"
      accessibilityHint="Changes the progress of the media"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: valueRounded,
      }}
    >
      {value > 0.001 && (
        <SliderLeft
          pointerEvents="none"
          size={isActiveOrDragging ? 'active' : 'default'}
          rounded={value === 1 && !isActiveOrDragging ? 'full' : 'left'}
          css={{ flex: value }}
        />
      )}

      {_handle}

      {(middleValue ?? 0) > 0 && (
        <SliderMiddle
          pointerEvents="none"
          size={isActiveOrDragging ? 'active' : 'default'}
          rounded={
            middleValue === 1
              ? !isActiveOrDragging
                ? 'full'
                : 'right'
              : value <= 0.001
              ? 'left'
              : rightValue === 0
              ? 'right'
              : 'none'
          }
          css={{ flex: middleValue }}
        />
      )}

      {(rightValue ?? 0) > 0 && (
        <SliderRight
          pointerEvents="none"
          size={isActiveOrDragging ? 'active' : 'default'}
          rounded={value <= 0.001 && !isActiveOrDragging ? 'full' : 'right'}
          css={{ flex: rightValue }}
        />
      )}
    </SliderContainer>
  );
};
