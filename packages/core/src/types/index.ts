export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export type Dms = { name: string; url: string };

export interface DmsProvider {
  getDms(): Dms;
}
