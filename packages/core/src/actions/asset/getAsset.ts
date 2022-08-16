import { Asset, GetAssetArgs, LPMSProvider } from '../../types';

import { getLPMSProvider } from '../providers';

export function getAsset<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: GetAssetArgs,
): Promise<Asset> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.getAsset(args);
}
