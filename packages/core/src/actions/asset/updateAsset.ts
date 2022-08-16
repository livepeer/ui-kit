import { Asset, LivepeerProvider, UpdateAssetArgs } from '../../types';

import { getLivepeerProvider } from '../providers';

export function updateAsset<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: UpdateAssetArgs): Promise<Asset> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.updateAsset(args);
}
