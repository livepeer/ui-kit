import { MirrorSizeArray } from '@livepeer/core-react';
import { useCallback, useMemo, useState } from 'react';
import { ViewToken, ViewabilityConfig } from 'react-native';

import { PlayerProps } from '../components';

export type UsePlayerListOptions<
  TSource extends object,
  TSourceArray extends ReadonlyArray<TSource> = ReadonlyArray<TSource>,
> = {
  data: TSourceArray;

  itemVisibleMinimumViewTime?: number;
  itemVisiblePercentThreshold?: number;

  itemPreload?: number;
  initialNumToRender?: number;
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

    onViewableItemsChanged: (info: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => void;

    viewabilityConfig: ViewabilityConfig;
  };
};

type PlayerListOverriddenProps = {
  _isCurrentlyShown: PlayerProps['_isCurrentlyShown'];
  priority: PlayerProps['priority'];
};

type IndexStatus = {
  viewable: boolean;
  shouldPreload: boolean;
};

export function usePlayerList<
  TSource extends object,
  TSourceArray extends ReadonlyArray<TSource> = ReadonlyArray<TSource>,
>({
  data,
  itemVisibleMinimumViewTime = 100,
  itemVisiblePercentThreshold = 60,
  itemPreload = 3,
}: UsePlayerListOptions<TSource, TSourceArray>): UsePlayerListReturn<
  TSource,
  TSourceArray
> {
  const [indices, setIndices] = useState<IndexStatus[]>([]);

  const onViewableItemsChanged = useCallback(
    (params: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      if (params?.viewableItems) {
        const newIndices = data.map((_d, index) => ({
          viewable: params.viewableItems.some(
            (viewableItem) => viewableItem.index === index,
          ),
          shouldPreload: params.viewableItems.some(
            (viewableItem) =>
              Math.abs(
                (viewableItem.index ?? Number.MAX_SAFE_INTEGER) - index,
              ) <= itemPreload,
          ),
        }));

        setIndices(newIndices);
      }
    },
    [data, itemPreload],
  );

  const dataMerged = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        playerProps: {
          priority: Boolean(indices?.[index]?.shouldPreload),
          _isCurrentlyShown: Boolean(indices?.[index]?.viewable),
        },
      })) as UsePlayerListReturn<TSource, TSourceArray>['listProps']['data'],
    [data, indices],
  );

  const viewabilityConfig: ViewabilityConfig = useMemo(
    () => ({
      minimumViewTime: itemVisibleMinimumViewTime,
      itemVisiblePercentThreshold: itemVisiblePercentThreshold,
    }),
    [itemVisibleMinimumViewTime, itemVisiblePercentThreshold],
  );

  return {
    listProps: {
      onViewableItemsChanged,
      viewabilityConfig,
      data: dataMerged,
    },
  } as const;
}
