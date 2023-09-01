export type ObjectFit = 'cover' | 'contain';

export type ControlsError = {
  type: 'offline' | 'access-control' | 'b-frames' | 'unknown';
  message: string;
};
