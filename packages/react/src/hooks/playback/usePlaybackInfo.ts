import {
  GetPlaybackInfoArgs,
  LivepeerProvider,
  PlaybackInfo,
  getPlaybackInfo,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function usePlaybackInfo<TLivepeerProvider extends LivepeerProvider>(
  args: Partial<GetPlaybackInfoArgs> &
    Partial<UseInternalQueryOptions<PlaybackInfo>>,
) {
  const livepeerProvider = useLivepeerProvider<LivepeerProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getPlaybackInfo', args, livepeerProvider }],
    queryFn: async () =>
      getPlaybackInfo<TLivepeerProvider>(args as GetPlaybackInfoArgs),
    enabled: Boolean(args),
  });
}
