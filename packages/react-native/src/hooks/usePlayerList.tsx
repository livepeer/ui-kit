import { MirrorSizeArray } from '@livepeer/core-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ViewToken,
  ViewabilityConfig,
  ViewabilityConfigCallbackPairs,
} from 'react-native';

import { PlayerProps } from '../components';

export type UsePlayerListOptions<
  TSource extends object,
  TSourceArray extends ReadonlyArray<TSource> = ReadonlyArray<TSource>,
> = {
  data: TSourceArray;
  itemPreload?: number;

  itemVisibleMinimumViewTime?: number | null;
  itemVisiblePercentThreshold?: number | null;
  itemVisibleViewAreaCoveragePercentThreshold?: number | null;
  itemVisibleWaitForInteraction?: boolean | null;
};

export type UsePlayerListReturn<
  TSource extends object,
  TSourceArray extends ReadonlyArray<TSource> = ReadonlyArray<TSource>,
> = {
  listProps: {
    data: MirrorSizeArray<
      TSourceArray,
      TSourceArray[number] & {
        playerProps: PlayerListOverriddenProps;
      }
    >;

    viewabilityConfigCallbackPairs: ViewabilityConfigCallbackPairs;
  };
};

type PlayerListOverriddenProps = {
  _isCurrentlyShown: PlayerProps<object, any>['_isCurrentlyShown'];
  priority: PlayerProps<object, any>['priority'];
};

type IndexStatus = {
  viewableIndices: number[];
};

export function usePlayerList<
  TSource extends object,
  TSourceArray extends ReadonlyArray<TSource> = ReadonlyArray<TSource>,
>({
  data,
  itemPreload = 3,

  itemVisibleMinimumViewTime = 100,
  itemVisiblePercentThreshold = 60,
  itemVisibleWaitForInteraction,
  itemVisibleViewAreaCoveragePercentThreshold,
}: UsePlayerListOptions<TSource, TSourceArray>): UsePlayerListReturn<
  TSource,
  TSourceArray
> {
  const [indices, setIndices] = useState<IndexStatus>({ viewableIndices: [] });

  const onViewableItemsChanged = useCallback(
    (params: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      if (params?.viewableItems) {
        const viewableIndices = params.viewableItems
          .map((viewableItem) => viewableItem.index)
          .filter((i) => i !== null)
          .map((i) => i!);

        setIndices({ viewableIndices });
      }
    },
    [],
  );

  const viewabilityConfig: ViewabilityConfig = useMemo(
    () => ({
      minimumViewTime: itemVisibleMinimumViewTime ?? undefined,
      itemVisiblePercentThreshold: itemVisiblePercentThreshold ?? undefined,
      viewAreaCoveragePercentThreshold:
        itemVisibleViewAreaCoveragePercentThreshold ?? undefined,
      waitForInteraction: itemVisibleWaitForInteraction ?? undefined,
    }),
    // we don't trigger re-render for deps since this is thrown into a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged, viewabilityConfig },
  ]);

  const dataMerged = useMemo(
    () =>
      data.map((item, index) => {
        const isViewable = indices.viewableIndices.some(
          (viewableIndex) => viewableIndex === index,
        );

        const isWithinPreloadOfViewableItem = indices.viewableIndices.some(
          (viewableIndex) => Math.abs(viewableIndex - index) <= itemPreload,
        );

        return {
          ...item,
          playerProps: {
            priority: isWithinPreloadOfViewableItem,
            _isCurrentlyShown: isViewable,
          },
        };
      }) as UsePlayerListReturn<TSource, TSourceArray>['listProps']['data'],
    [data, indices, itemPreload],
  );

  return {
    listProps: {
      viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current,
      data: dataMerged,
    },
  } as const;
}
