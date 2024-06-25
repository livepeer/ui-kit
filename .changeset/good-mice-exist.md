---
"@livepeer/core-react": minor
"@livepeer/core-web": minor
"@livepeer/react": minor
"@livepeer/core": minor
---

**Feature:**: added metrics event reporting with POST requests, using `sendBeacon` for end-of-session metrics.

```tsx
export type HeartbeatEvent = {
  // The properties below are sent on every heartbeat.

  /** The event type. */
  type: "heartbeat";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The number of errors that have occurred since last heartbeat. */
  errors: number;

  /** The number of times the current playback has stalled, since last heartbeat. */
  stalled_count: number;
  /** The *total* number of times the current playback has waited, since last heartbeat. */
  waiting_count: number;

  /** The time the playback has spent in an errored state, in ms, since last heartbeat. */
  time_errored_ms: number;
  /** The time the playback has spent stalled, in ms, since last heartbeat. */
  time_stalled_ms: number;
  /** The time the playback has spent playing, in ms, since last heartbeat. */
  time_playing_ms: number;
  /** The time the playback has spent waiting, in ms, since last heartbeat. */
  time_waiting_ms: number;

  // The properties below are only sent once.

  /** The state of autoplay of the video. */
  autoplay_status?: "autoplay" | "none";

  /** The time from when the metrics were added to play, in milliseconds. */
  mount_to_play_ms?: number;
  /** The time from when the metrics were added to the first frame, in milliseconds. */
  mount_to_first_frame_ms?: number;
  /** The time from the first play event to the first frame, in milliseconds. Also called TTFF. */
  play_to_first_frame_ms?: number;

  /** The duration of the video, in milliseconds. */
  duration_ms?: number;
  /** The offset of the live video head compared to the server time, in milliseconds. */
  offset_ms?: number;

  // The properties below are only sent when they change.

  /** The height of the player element, in px. */
  player_height_px?: number;
  /** The width of the player element, in px. */
  player_width_px?: number;
  /** The height of the source video, in px. */
  video_height_px?: number;
  /** The width of the source video, in px. */
  video_width_px?: number;
  /** The height of the window, in px. */
  window_height_px?: number;
  /** The width of the window, in px. */
  window_width_px?: number;
};

export type ErrorEvent = {
  /** The event type. */
  type: "error";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The raw event error message. */
  error_message: string;
  /** The category of the error. */
  category:
    | "offline"
    | "access-control"
    | "fallback"
    | "permissions"
    | "unknown";
};

export type HtmlEvent = {
  /** The event type. */
  type:
    | "play"
    | "pause"
    | "enter-fullscreen"
    | "exit-fullscreen"
    | "enter-pip"
    | "exit-pip"
    | "can-play"
    | "ended"
    | "first-frame";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
};

export type RateChangeEvent = {
  /** The event type. */
  type: "rate";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The playback rate. */
  payload: PlaybackRate;
};

export type SeekEvent = {
  /** The event type. */
  type: "seek";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The seek timestamp. */
  payload: number;
};

export type VideoQualityEvent = {
  /** The event type. */
  type: "video-quality";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The video playback quality enum. */
  payload: VideoQuality;
};

export type PlaybackEvent =
  | HeartbeatEvent
  | ErrorEvent
  | HtmlEvent
  | RateChangeEvent
  | SeekEvent
  | VideoQualityEvent;

export type SessionData = {
  session_id: string;
  playback_id: string;
  protocol?: MimeType;
  page_url: string;
  source_url: string;
  player: `${"audio" | "hls" | "video" | "webrtc" | "unknown"}-${string}`;
  user_agent?: string;
  uid?: string;
  events: PlaybackEvent[];
  live: boolean;
};
```
