import { lpms } from '../constants';
import { BaseLPMSProvider, LPMSProviderFn } from './base';

export type StudioLPMSProviderConfig = {
  apiKey?: string;
};

export class StudioLPMSProvider extends BaseLPMSProvider {
  readonly _apiKey: string;

  constructor(apiKey: string) {
    super(lpms.studio);

    this._apiKey = apiKey;
  }
}

export function studioProvider({
  apiKey,
}: StudioLPMSProviderConfig = {}): LPMSProviderFn<StudioLPMSProvider> {
  return () => {
    if (!apiKey) return null;
    return {
      provider: new StudioLPMSProvider(apiKey),
    };
  };
}
