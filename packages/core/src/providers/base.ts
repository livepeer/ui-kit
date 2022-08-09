import { Dms, DmsProvider } from '../types';

export abstract class BaseDmsProvider implements DmsProvider {
  /** DMS config */
  readonly _dms: Dms;

  constructor(dms: Dms) {
    this._dms = dms;
  }

  getDms(): Dms {
    return this._dms;
  }
}

export type DmsProviderFn<TProvider extends DmsProvider = BaseDmsProvider> =
  () => {
    provider: () => TProvider;
  } | null;
