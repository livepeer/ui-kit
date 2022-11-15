import { LivepeerProvider, PlaybackInfo } from 'livepeer';
import { ClientConfig } from 'livepeer/client';

import { PlayerProps } from '../../components';
import { PrefetchQueryOptions } from '../../utils';
import { prefetchPlaybackInfo } from './usePlaybackInfo';

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
