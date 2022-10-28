import { Asset, CreateAssetArgs, LivepeerProvider } from '../../types';

import { getLivepeerProvider } from '../providers';

export function createAsset<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: CreateAssetArgs): Promise<PromiseSettledResult<Asset>[]> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.createAsset(args);
}
