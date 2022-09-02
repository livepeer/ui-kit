import {
  GetPlaybackInfoArgs,
  LivepeerProvider,
  PlaybackInfo,
} from '../../types';
import { getLivepeerProvider } from '../providers';

export function getPlaybackInfo<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetPlaybackInfoArgs): Promise<PlaybackInfo> {
  const provider = getLivepeerProvider<TLivepeerProvider>();
  return provider.getPlaybackInfo(args);
}
