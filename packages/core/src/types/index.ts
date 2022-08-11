export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export type LPMediaServer = {
  /** Livepeer Media Server name */
  name: string;
  /** Base URL for the LPMS */
  baseUrl: string;
};

export interface LPMSProvider {
  getLPMediaServer(): LPMediaServer;
}
