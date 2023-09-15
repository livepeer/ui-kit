export type ObjectFit = 'cover' | 'contain';

export type PlaybackError = {
  type: 'offline' | 'access-control' | 'fallback' | 'unknown';
  message: string;
};
