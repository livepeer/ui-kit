import { LPMSProvider, UpdateAssetArgs } from '../../types';

import { getLPMSProvider } from '../providers';

export function updateAsset<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: UpdateAssetArgs,
): Promise<void> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.updateAsset(args);
}
