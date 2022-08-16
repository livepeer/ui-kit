import { Asset, GetAssetArgs, LivepeerProvider } from '../../types';

import { getLivepeerProvider } from '../providers';

export function getAsset<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetAssetArgs): Promise<Asset> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.getAsset(args);
}
