import { Asset, LPMSProvider, UpdateAssetArgs } from '../../types';

import { getLPMSProvider } from '../providers';

export function updateAsset<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: UpdateAssetArgs,
): Promise<Asset> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.updateAsset(args);
}
