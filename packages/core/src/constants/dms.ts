import { Dms } from '../types';

export type DmsName = 'studio';

export const studio: Dms = {
  name: 'Livepeer Studio',
  url: 'https://livepeer.studio',
} as const;

export const dms: Record<DmsName, Dms> = {
  studio,
} as const;

export const allDms = [studio] as const;
