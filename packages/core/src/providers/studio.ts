import { dms } from '../constants';
import { BaseDmsProvider, DmsProviderFn } from './base';

export type StudioDmsProviderConfig = {
  apiKey?: string;
};

export class StudioDmsProvider extends BaseDmsProvider {
  readonly _apiKey: string;

  constructor(apiKey: string) {
    super(dms.studio);

    this._apiKey = apiKey;
  }
}

export function studioProvider({
  apiKey,
}: StudioDmsProviderConfig = {}): DmsProviderFn<StudioDmsProvider> {
  return () => {
    if (!apiKey) return null;
    return {
      provider: () => {
        return new StudioDmsProvider(apiKey);
      },
    };
  };
}
