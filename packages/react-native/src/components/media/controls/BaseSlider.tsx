import {
  BaseSliderProps,
  useBaseSlider,
} from '@livepeer/core-react/components';
import * as React from 'react';
import { GestureResponderEvent, View } from 'react-native';

import {
  SliderContainer,
  SliderLeft,
  SliderMiddle,
  SliderRight,
  SliderThumb,
} from '../../styling';

export const BaseSlider = (props: BaseSliderProps) => {
  const ref = React.useRef<View | null>(null);

  const [sliderWidth, setSliderWidth] = React.useState(0);

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
    sliderWidth,
    defaultThumbIcon: <SliderThumb pointerEvents="none" />,
    ...props,
  });

  const onTouchStartOrMove = React.useCallback(
    async (e: GestureResponderEvent) => {
      await sliderProps?.onUpdate(e.nativeEvent.locationX);
    },
    [sliderProps],
  );

  const onTouchEnd = React.useCallback(
    async (e: GestureResponderEvent) => {
      await sliderProps?.onUpdate(e.nativeEvent.locationX, true);
    },
    [sliderProps],
  );

  return (
    <SliderContainer
      ref={ref}
      onTouchStart={onTouchStartOrMove}
      onTouchMove={onTouchStartOrMove}
      onTouchEnd={onTouchEnd}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      accessibilityLabel={title}
      accessibilityRole="progressbar"
      accessibilityHint="Changes the progress of the media"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: value,
      }}
    >
      {sliderLeftTrackProps.shown && (
        <SliderLeft
          pointerEvents="none"
          size={active ? 'active' : 'default'}
          rounded={sliderLeftTrackProps.rounded}
          css={sliderLeftTrackProps.css}
        />
      )}

      {handle}

      {sliderMiddleTrackProps.shown && (
        <SliderMiddle
          pointerEvents="none"
          size={active ? 'active' : 'default'}
          rounded={sliderMiddleTrackProps.rounded}
          css={sliderMiddleTrackProps.css}
        />
      )}

      {sliderRightTrackProps.shown && (
        <SliderRight
          pointerEvents="none"
          size={active ? 'active' : 'default'}
          rounded={sliderRightTrackProps.rounded}
          css={sliderRightTrackProps.css}
        />
      )}
    </SliderContainer>
  );
};
