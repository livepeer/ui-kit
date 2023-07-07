export type ObjectFit = 'cover' | 'contain';

export type ControlsError = {
  type: 'offline' | 'access-control' | 'unknown';
  message: string;
};
