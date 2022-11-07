import {
  CreateAssetArgs,
  CreateAssetSourceType,
  LivepeerProvider,
} from '../../types';

import { getLivepeerProvider } from '../providers';

export function createAsset<
  TSource extends CreateAssetSourceType,
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: CreateAssetArgs<TSource>) {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.createAsset<TSource>(args);
}
