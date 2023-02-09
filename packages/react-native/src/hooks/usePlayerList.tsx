import { MirrorSizeArray } from '@livepeer/core-react';
import { useCallback, useMemo, useState } from 'react';
import { ViewToken, ViewabilityConfig } from 'react-native';

import { PlayerProps } from '../components';

export type UsePlayerListOptions<
  TSourceArray extends ReadonlyArray<TSource>,
  TSource extends object,
> = {
  data: TSourceArray;

  itemVisibleMinimumViewTime?: number;
  itemVisiblePercentThreshold?: number;

  itemPreload?: number;
  initialNumToRender?: number;
};

type UsePlayerListReturn<
  TSourceArray extends ReadonlyArray<TSource>,
  TSource extends object,
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
    initialNumToRender: number;
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
  TSourceArray extends ReadonlyArray<TSource>,
  TSource extends object,
>({
  data,
  itemVisibleMinimumViewTime = 100,
  itemVisiblePercentThreshold = 80,
  itemPreload = 3,
  initialNumToRender = 3,
}: UsePlayerListOptions<TSourceArray, TSource>): UsePlayerListReturn<
  TSourceArray,
  TSource
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
      })) as UsePlayerListReturn<TSourceArray, TSource>['listProps']['data'],
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
      initialNumToRender,
    },
  } as const;
}
