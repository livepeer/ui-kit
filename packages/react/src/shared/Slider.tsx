"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

type SliderProps = SliderPrimitive.SliderProps;
const Root = SliderPrimitive.Root;
type TrackProps = SliderPrimitive.SliderTrackProps;
const Track = SliderPrimitive.Track;
type RangeProps = SliderPrimitive.SliderRangeProps;
const Range = SliderPrimitive.Range;
type ThumbProps = SliderPrimitive.SliderThumbProps;
const Thumb = SliderPrimitive.Thumb;

export { Range, Root, Thumb, Track };
export type { RangeProps, SliderProps, ThumbProps, TrackProps };
