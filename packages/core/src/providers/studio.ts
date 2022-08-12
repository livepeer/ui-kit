import { lpms } from '../constants';
import { BaseLPMSProvider, LPMSProviderFn } from './base';

export type StudioLPMSProviderConfig = {
  apiKey: string | null | undefined;
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
}: StudioLPMSProviderConfig): LPMSProviderFn<StudioLPMSProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLPMSProvider(apiKey);
}
