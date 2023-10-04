import { Asset, CreateClipArgs, LivepeerProvider } from '../../types';
import { getLivepeerProvider } from '../providers';

export function createClip<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: CreateClipArgs): Promise<Asset> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.createClip(args);
}
