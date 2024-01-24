import { ClipParams, InitialProps } from "./controller";
import { getPlaybackIdFromSourceUrl } from "./metrics-utils";
import {
  AudioTrackSelector,
  Src,
  VideoTrackSelector,
  getMediaSourceType,
} from "./src";

export const getFilteredNaN = (value: number | undefined | null) =>
  value && !Number.isNaN(value) && Number.isFinite(value) ? value : 0;

export const getBoundedSeek = (seek: number, duration: number | undefined) =>
  Math.min(
    Math.max(0, getFilteredNaN(seek)),
    // seek to near the end
    getFilteredNaN(duration) ? getFilteredNaN(duration) - 0.01 : 0,
  );

export const getBoundedRate = (rate: string | number) => {
  if (typeof rate === "number") {
    return Math.min(Math.max(0, getFilteredNaN(rate)), 20);
  }
  const match = String(rate).match(/(\d+(\.\d+)?)/);
  return match
    ? Math.min(Math.max(0, getFilteredNaN(parseFloat(match[0]))), 20)
    : 1;
};

export const getBoundedVolume = (volume: number) =>
  Math.min(Math.max(0, getFilteredNaN(volume)), 1);

export const generateRandomToken = () => {
  try {
    return Math.random().toString(16).substring(2);
  } catch (e) {
    //
  }

  return "none" as const;
};

export const getClipParams = ({
  requestedTime,
  clipLength,
  playbackOffsetMs,
}: {
  requestedTime: number | null;
  clipLength: number;
  playbackOffsetMs: number | null;
}): ClipParams => {
  const currentTime = requestedTime ?? Date.now();

  // we get the estimated time on the server that the user "clipped"
  // by subtracting the offset from the recorded clip time
  const estimatedServerClipTime = currentTime - (playbackOffsetMs ?? 0);
  const startTime = estimatedServerClipTime - clipLength * 1000;
  const endTime = estimatedServerClipTime;

  return {
    startTime,
    endTime,
  };
};

export const getProgressAria = ({
  progress,
  duration,
  live,
}: {
  progress: number | null | undefined;
  duration: number | null | undefined;
  live: boolean | null | undefined;
}) => {
  const progressParsed = getHoursMinutesSeconds(progress ?? null);
  const durationParsed = getHoursMinutesSeconds(duration ?? null);

  const progressText = `${
    progressParsed.hours ? `${progressParsed.hours} hours` : ""
  } ${progressParsed.minutes ? `${progressParsed.minutes} minutes` : ""} ${
    progressParsed.seconds ? `${progressParsed.seconds} seconds` : ""
  }` as const;
  const durationText = `${
    durationParsed.hours ? `${durationParsed.hours} hours` : ""
  } ${durationParsed.minutes ? `${durationParsed.minutes} minutes` : ""} ${
    durationParsed.seconds ? `${durationParsed.seconds} seconds` : ""
  }` as const;

  const progressDisplay = live
    ? (`Live ${progressText}` as const)
    : (`${progressText} of ${durationText}` as const);

  const formattedTimeDisplay = getFormattedHoursMinutesSeconds(
    progress ?? null,
  );

  const formattedDuration = getFormattedHoursMinutesSeconds(duration ?? null);

  const formattedTime = live
    ? formattedTimeDisplay
    : (`${formattedTimeDisplay} / ${formattedDuration}` as const);

  return {
    progress: progressDisplay,
    time: formattedTime,
  };
};

const SCREEN_WIDTH_MULTIPLIER = 2.5;

type SrcWithParentDelta = Src & {
  parentWidthDelta: number | null;
};

export const sortSources = (
  src: Src[] | string | null | undefined,
  parentWidth: number | null,
) => {
  if (!src) {
    return null;
  }

  if (typeof src === "string") {
    const mediaSourceType = getMediaSourceType(src);
    return mediaSourceType ? [mediaSourceType] : null;
  }

  const filteredVideoSources = src.filter(
    (s) => s.type !== "vtt" && s.type !== "image",
  );

  const parentWidthWithDefault =
    (parentWidth ?? 1280) * SCREEN_WIDTH_MULTIPLIER;

  const sourceWithParentDelta: SrcWithParentDelta[] =
    filteredVideoSources?.map((s) =>
      s.type === "hls" || s.type === "webrtc"
        ? { ...s, parentWidthDelta: null }
        : {
            ...s,
            parentWidthDelta: s?.width
              ? Math.abs(parentWidthWithDefault - s.width)
              : s?.src.includes("static360p") || s?.src.includes("low-bitrate")
                ? Math.abs(parentWidthWithDefault - 480)
                : s?.src.includes("static720p")
                  ? Math.abs(parentWidthWithDefault - 1280)
                  : s?.src.includes("static1080p")
                    ? Math.abs(parentWidthWithDefault - 1920)
                    : s?.src.includes("static2160p")
                      ? Math.abs(parentWidthWithDefault - 3840)
                      : null,
          },
    ) ?? [];

  const sortedSources = sourceWithParentDelta.sort((a, b) => {
    if (a.type === "video" && b.type === "video") {
      // we sort the sources by the delta between the video width and the
      // parent size (multiplied by a multiplier above)
      return b?.parentWidthDelta && a?.parentWidthDelta
        ? a.parentWidthDelta - b.parentWidthDelta
        : 1;
    }
    if (a.type === "video" && (b.type === "hls" || b.type === "webrtc")) {
      // if the type is an MP4, we prefer that to HLS/WebRTC due to better caching/less overhead
      return -1;
    }
    if (a.type === "webrtc" && b.type === "hls") {
      // if there is a webrtc source, we prefer that to HLS
      return -1;
    }

    return 1;
  });

  return sortedSources;
};

export const parseCurrentSourceAndPlaybackId = ({
  accessKey,
  audioTrackSelector,
  constant,
  jwt,
  sessionToken,
  source,
  videoTrackSelector,
}: {
  accessKey: InitialProps["accessKey"];
  audioTrackSelector: AudioTrackSelector | undefined;
  constant: boolean | undefined;
  jwt: InitialProps["jwt"];
  sessionToken: string;
  source: Src | null;
  videoTrackSelector: VideoTrackSelector | undefined;
}) => {
  if (!source) {
    return null;
  }

  const playbackId = getPlaybackIdFromSourceUrl(source.src);

  const url = new URL(source.src);

  // append the tkn to the query params
  if (sessionToken) {
    url.searchParams.append("tkn", sessionToken);
  }

  // we use headers for HLS and WebRTC for auth
  if (source.type !== "webrtc" && source.type !== "hls") {
    // append the JWT to the query params
    if (jwt) {
      url.searchParams.append("jwt", jwt);
    }
    // or append the access key to the query params
    else if (accessKey) {
      url.searchParams.append("accessKey", accessKey);
    }
  }

  // for webrtc, we append specific parameters to control the config
  if (source.type === "webrtc") {
    if (constant) {
      url.searchParams.append("constant", "true");
    }

    if (audioTrackSelector) {
      url.searchParams.append("audio", audioTrackSelector);
    }

    if (videoTrackSelector) {
      url.searchParams.append("video", videoTrackSelector);
    }
  }

  // override the url with the new URL
  const newSrc = {
    ...source,
    src: url.toString(),
  } as Src;

  return {
    currentSource: newSrc,
    playbackId,
  } as const;
};

export const getFormattedHoursMinutesSeconds = (
  valueInSeconds: number | undefined | null,
) => {
  const hoursMinutesSeconds = getHoursMinutesSeconds(valueInSeconds);
  if (
    hoursMinutesSeconds.seconds ||
    hoursMinutesSeconds.minutes ||
    hoursMinutesSeconds.hours
  ) {
    if (hoursMinutesSeconds.hours > 0) {
      return `${hoursMinutesSeconds.hours}:${hoursMinutesSeconds.minutes
        .toString()
        .padStart(2, "0")}:${hoursMinutesSeconds.seconds < 10 ? "0" : ""}${
        hoursMinutesSeconds.seconds
      }` as const;
    }

    return `${hoursMinutesSeconds.minutes}:${hoursMinutesSeconds.seconds
      .toString()
      .padStart(2, "0")}` as const;
  }

  return "0:00" as const;
};

export const getHoursMinutesSeconds = (
  valueInSeconds: number | undefined | null,
) => {
  if (
    valueInSeconds !== undefined &&
    valueInSeconds !== null &&
    !Number.isNaN(valueInSeconds) &&
    Number.isFinite(valueInSeconds)
  ) {
    const roundedValue = Math.round(valueInSeconds);

    const hours = Math.floor(roundedValue / 3600);
    const seconds = Math.floor(roundedValue % 60);

    if (hours > 0) {
      const minutes = Math.floor((roundedValue % 3600) / 60);

      return {
        hours,
        minutes,
        seconds,
      } as const;
    }

    const minutes = Math.floor(roundedValue / 60);

    return {
      hours: 0,
      minutes,
      seconds,
    } as const;
  }

  return {
    hours: 0,
    minutes: 0,
    seconds: 0,
  } as const;
};
