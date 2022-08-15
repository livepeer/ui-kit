import { Asset, CreateAssetArgs, LPMSProvider } from '../../types';

import { getLPMSProvider } from '../providers';

export function createAsset<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: CreateAssetArgs,
): Promise<Asset> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.createAsset(args);
}
