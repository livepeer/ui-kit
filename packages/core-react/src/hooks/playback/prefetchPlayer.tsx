import { LivepeerProvider, PlaybackInfo } from '@livepeer/core';
import { ClientConfig } from '@livepeer/core/client';
import { ReactNode } from 'react';

import { prefetchPlaybackInfo } from './usePlaybackInfo';
import { PlayerProps } from '../../components';
import { PrefetchQueryOptions } from '../../utils';

export async function prefetchPlayer<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
  TPlaybackPolicyObject extends object = object,
>(
  props: Partial<
    PlayerProps<HTMLMediaElement, ReactNode | string, TPlaybackPolicyObject>
  > &
    PrefetchQueryOptions,
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
