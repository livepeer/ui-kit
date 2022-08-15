import fetch from 'cross-fetch';

import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  LPMS,
  LPMSProvider,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../types';

export type FetchOptions<P = object> = RequestInit & {
  json?: P;
};

export abstract class BaseLPMSProvider implements LPMSProvider {
  /** LPMS config */
  readonly _lpms: LPMS;
  /** Data fetching library */
  readonly _fetch: typeof fetch;

  constructor(lpms: LPMS) {
    this._fetch = fetch;

    this._lpms = lpms;
  }

  getLPMS(): LPMS {
    return this._lpms;
  }

  async _get<T>(
    url:
      | '/stream'
      | `/stream/${string}`
      | `/session/${string}`
      | `/stream/${string}/sessions`
      | '/asset'
      | `/asset/${string}`,
    options?: FetchOptions<never>,
  ): Promise<T> {
    const response = await this._fetch(`${this._lpms.baseUrl}${url}`, {
      method: 'GET',
      ...options,
    });

    return response.json() as Promise<T>;
  }

  async _create<T, P>(
    url: '/stream' | '/asset/request-upload',
    options?: FetchOptions<P>,
  ): Promise<T> {
    const response = await this._fetch(`${this._lpms.baseUrl}${url}`, {
      method: 'POST',
      ...options,
      ...(options?.json ? { body: JSON.stringify(options.json) } : {}),
      headers: {
        ...(options?.json ? { 'content-type': 'application/json' } : {}),
        ...options?.headers,
      },
    });

    return response.json() as Promise<T>;
  }

  async _update<P>(
    url: `/stream/${string}` | `/asset/${string}`,
    options?: FetchOptions<P>,
  ): Promise<void> {
    const response = await this._fetch(`${this._lpms.baseUrl}${url}`, {
      method: 'PATCH',
      ...options,
      ...(options?.json ? { body: JSON.stringify(options.json) } : {}),
      headers: {
        ...(options?.json ? { 'content-type': 'application/json' } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error('Provider failed to update object');
    }
  }

  abstract createStream(args: CreateStreamArgs): Promise<Stream>;
  abstract updateStream(args: UpdateStreamArgs): Promise<void>;
  abstract getStream(args: GetStreamArgs): Promise<Stream>;
  abstract getStreamSession(args: GetStreamSessionArgs): Promise<StreamSession>;
  abstract getStreamSessions(
    args: GetStreamSessionsArgs,
  ): Promise<StreamSession[]>;
  abstract createAsset(args: CreateAssetArgs): Promise<Asset>;
  abstract getAsset(args: GetAssetArgs): Promise<Asset>;
  abstract updateAsset(args: UpdateAssetArgs): Promise<void>;
}

export type LPMSProviderFn<TProvider extends LPMSProvider = BaseLPMSProvider> =
  () => TProvider;
