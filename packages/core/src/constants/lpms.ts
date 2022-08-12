import { LPMS } from '../types';

// TODO
export const defaultStudioApiKey = '12345';

export type LPMSName = 'studio';

export const studio: LPMS = {
  name: 'Livepeer Studio',
  baseUrl: 'https://livepeer.studio',
} as const;

export const lpms: Record<LPMSName, LPMS> = {
  studio,
} as const;

export const allLPMS = [studio] as const;

export const defaultLPMS = [studio] as const;
