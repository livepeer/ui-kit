import { LPMSProvider, LPMediaServer } from '../types';

export abstract class BaseLPMSProvider implements LPMSProvider {
  /** LPMS config */
  readonly _lpms: LPMediaServer;

  constructor(lpms: LPMediaServer) {
    this._lpms = lpms;
  }

  getLPMediaServer(): LPMediaServer {
    return this._lpms;
  }
}

export type LPMSProviderFn<TProvider extends LPMSProvider = BaseLPMSProvider> =
  () => {
    provider: TProvider;
  } | null;
