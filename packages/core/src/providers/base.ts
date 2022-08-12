import { LPMS, LPMSProvider } from '../types';

export abstract class BaseLPMSProvider implements LPMSProvider {
  /** LPMS config */
  readonly _lpms: LPMS;

  constructor(lpms: LPMS) {
    this._lpms = lpms;
  }

  getLPMS(): LPMS {
    return this._lpms;
  }
}

export type LPMSProviderFn<TProvider extends LPMSProvider = BaseLPMSProvider> =
  { provider: TProvider };
