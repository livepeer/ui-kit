export type ObjectFit = 'cover' | 'contain';

export type ControlsError = {
  type: 'offline' | 'access-control' | 'fallback' | 'unknown';
  message: string;
};
