import { ClientConfig, LivepeerProvider, PlaybackInfo } from 'livepeer';

import { prefetchPlaybackInfo } from '../../hooks';
import { PrefetchQueryOptions } from '../../utils';

import { PlayerProps } from './Player';

export async function prefetchPlayer<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
>(
  props: Partial<PlayerProps> & PrefetchQueryOptions,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'>,
) {
  return prefetchPlaybackInfo<TLivepeerProvider, TData>(
    {
      playbackId: props?.playbackId ?? undefined,
      clearClient: props.clearClient,
    },
    config,
  );
}
