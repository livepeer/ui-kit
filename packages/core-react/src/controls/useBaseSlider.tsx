import * as React from "react";

import { useMemoizedIcon } from "../hooks";

export type TrackCSS = {
  backgroundColor: string;
};

export type ThumbCSS = {
  backgroundColor: string;
};

export type BaseSliderProps = {
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

  /**
   * CSS applied to the left slider range.
   */
  leftCss: TrackCSS;

  /**
   * CSS applied to the middle slider range.
   */
  middleCss: TrackCSS;

  /**
   * CSS applied to the right slider range.
   */
  rightCss: TrackCSS;

  /**
   * CSS applied to the thumb.
   */
  thumbCss: ThumbCSS;
};

type BaseSliderCoreProps = {
  defaultThumbIcon: React.ReactElement;
  sliderWidth: number;
  isActive?: boolean;
} & BaseSliderProps;

export const useBaseSlider = (props: BaseSliderCoreProps) => {
  const [localX, setLocalX] = React.useState<number | null>(null);

  const {
    onChange,
    thumbIcon,
    defaultThumbIcon,
    sliderWidth,
    ariaName,
    isActive,
    leftCss,
    middleCss,
    rightCss,
    thumbCss,
  } = props;

  const isActiveOrDragging = isActive || localX !== null;

  const onUpdate = React.useCallback(
    async (locationX: number, isComplete?: boolean) => {
      if (sliderWidth) {
        const newValue = locationX / sliderWidth;
        const newBoundedValue = Math.min(Math.max(0, newValue), 1);

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

  const { value, middleValue } = React.useMemo(() => {
    const value =
      localX !== null ? localX : !Number.isNaN(props.value) ? props.value : 0;
    const middleValue =
      localX !== null
        ? 0
        : props.secondaryValue &&
            !Number.isNaN(props.value) &&
            !Number.isNaN(props.secondaryValue)
          ? props.secondaryValue - props.value
          : 0;

    return { value, middleValue: middleValue > 0 ? middleValue : 0 };
  }, [localX, props.value, props.secondaryValue]);

  const thumbProps = React.useMemo(
    () => ({
      css: {
        ...thumbCss,
        zIndex: 1,
      },
      size: isActiveOrDragging ? "active" : "default",
    }),
    [thumbCss, isActiveOrDragging],
  );

  const handle = useMemoizedIcon(
    thumbIcon,
    React.cloneElement(defaultThumbIcon, thumbProps),
  );

  const rightValue = React.useMemo(
    () => 1 - (value + middleValue),
    [value, middleValue],
  );

  const valueRounded = React.useMemo(() => Math.round(value * 100), [value]);

  return {
    title: `${valueRounded}% ${ariaName}`,
    value: valueRounded,
    active: isActiveOrDragging,
    handle,
    sliderProps: {
      onUpdate,
    },
    sliderLeftTrackProps: {
      shown: value > 0.001,
      rounded: value === 1 && !isActiveOrDragging ? "full" : "left",
      css: { ...leftCss, flex: value },
    },
    sliderMiddleTrackProps: {
      shown: (middleValue ?? 0) > 0,
      rounded:
        middleValue === 1
          ? !isActiveOrDragging
            ? "full"
            : "right"
          : value <= 0.001
            ? "left"
            : rightValue === 0
              ? "right"
              : "none",
      css: {
        ...middleCss,
        flex: middleValue,
      },
    },
    sliderRightTrackProps: {
      shown: (rightValue ?? 0) > 0,
      rounded: value <= 0.001 && !isActiveOrDragging ? "full" : "right",
      css: {
        ...rightCss,
        flex: rightValue,
      },
    },
  } as const;
};
