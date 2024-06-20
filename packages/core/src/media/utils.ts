import type { ClipParams, InitialProps } from "./controller";
import { getPlaybackIdFromSourceUrl } from "./metrics-utils";
import {
  type Src,
  type VideoQuality,
  type VideoTrackSelector,
  getMediaSourceType,
} from "./src";

export const DEFAULT_ASPECT_RATIO = 16 / 9;

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
    ? Math.min(Math.max(0, getFilteredNaN(Number.parseFloat(match[0]))), 20)
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
    progressParsed.hours ? `${progressParsed.hours} hours ` : ""
  }${progressParsed.minutes ? `${progressParsed.minutes} minutes ` : ""}${
    progressParsed.seconds ? `${progressParsed.seconds} seconds` : ""
  }` as const;
  const durationText = `${
    durationParsed.hours ? `${durationParsed.hours} hours ` : ""
  }${durationParsed.minutes ? `${durationParsed.minutes} minutes ` : ""}${
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

type SrcWithParentDelta = Src & {
  parentWidthDelta: number | null;
};

const sortSources = ({
  src,
  videoQuality,
  screenWidth,
  aspectRatio,
  lowLatency,
  hasRecentWebRTCTimeout,
}: {
  src: Src[] | string | null | undefined;
  videoQuality: VideoQuality;
  screenWidth: number | null;
  aspectRatio: number;
  lowLatency: InitialProps["lowLatency"];
  hasRecentWebRTCTimeout: boolean;
}) => {
  if (!src) {
    return null;
  }

  if (typeof src === "string") {
    const mediaSourceType = getMediaSourceType(src);
    return mediaSourceType ? [mediaSourceType] : null;
  }

  const filteredVideoSources = src
    .filter(
      (s) =>
        s.type === "audio" ||
        s.type === "hls" ||
        s.type === "webrtc" ||
        s.type === "video",
    )
    .filter((s) => {
      if (s.type === "hls" && lowLatency === "force") {
        return false;
      }
      if (
        s.type === "webrtc" &&
        (lowLatency === false || hasRecentWebRTCTimeout)
      ) {
        return false;
      }

      return true;
    });

  const videoQualityDimensions = calculateVideoQualityDimensions(
    videoQuality,
    aspectRatio,
  );

  const targetWidth = videoQualityDimensions?.width ?? screenWidth ?? 1280;

  const sourceWithParentDelta: SrcWithParentDelta[] =
    filteredVideoSources?.map((s) =>
      s.type === "hls" || s.type === "webrtc"
        ? { ...s, parentWidthDelta: null }
        : {
            ...s,
            parentWidthDelta:
              // first we check if the URL contains the video quality selector
              videoQuality &&
              videoQuality !== "auto" &&
              s?.src?.includes(videoQuality)
                ? 0
                : // otherwise use the width of the src
                  s?.width
                  ? Math.abs(targetWidth - s.width)
                  : // otherwise guess the width of the src based on the url
                    s?.src.includes("static360p") ||
                      s?.src.includes("low-bitrate")
                    ? Math.abs(targetWidth - 480)
                    : s?.src.includes("static720p")
                      ? Math.abs(targetWidth - 1280)
                      : s?.src.includes("static1080p")
                        ? Math.abs(targetWidth - 1920)
                        : s?.src.includes("static2160p")
                          ? Math.abs(targetWidth - 3840)
                          : null,
          },
    ) ?? [];

  const sortedSources = sourceWithParentDelta.sort((a, b) => {
    if (a.type === "video" && b.type === "video") {
      // we sort the sources by the delta between the video width and the
      // parent size (multiplied by a multiplier above)
      return b?.parentWidthDelta !== null && a?.parentWidthDelta !== null
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
  aspectRatio,
  playbackRate,
  isHlsSupported,
  jwt,
  sessionToken,
  source,
  videoQuality,
}: {
  accessKey: InitialProps["accessKey"];
  aspectRatio: InitialProps["aspectRatio"];
  playbackRate: InitialProps["playbackRate"];
  isHlsSupported: boolean;
  jwt: InitialProps["jwt"];
  sessionToken: string;
  source: Src | null;
  videoQuality: VideoQuality;
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
    if (playbackRate === "constant") {
      url.searchParams.append("constant", "true");
    }

    const videoTrackSelector = getVideoTrackSelectorForQuality(
      videoQuality,
      aspectRatio,
    );

    if (videoTrackSelector) {
      url.searchParams.append("video", videoTrackSelector);
    }
  }

  // override the url with the new URL
  const newSrc = {
    ...source,
    src: url.toString(),
  } as Src;

  const videoSourceIfHlsUnsupported =
    newSrc?.type === "hls" && !isHlsSupported
      ? ({
          ...newSrc,
          type: "video",
        } as const)
      : newSrc;

  return {
    currentSource: videoSourceIfHlsUnsupported,
    playbackId,
  } as const;
};

export const getNewSource = ({
  accessKey,
  aspectRatio,
  isHlsSupported,
  jwt,
  lowLatency,
  playbackRate,
  screenWidth,
  sessionToken,
  src,
  videoQuality,
  hasRecentWebRTCTimeout,
}: {
  accessKey: InitialProps["accessKey"] | undefined;
  aspectRatio: InitialProps["aspectRatio"] | undefined;
  isHlsSupported: boolean;
  jwt: InitialProps["jwt"] | undefined;
  lowLatency: InitialProps["lowLatency"];
  playbackRate: InitialProps["playbackRate"];
  screenWidth: number | null;
  sessionToken: string;
  src: Src[] | string | null | undefined;
  videoQuality: VideoQuality;
  hasRecentWebRTCTimeout: boolean;
}) => {
  const sortedSources = sortSources({
    src,
    screenWidth,
    videoQuality,
    aspectRatio: aspectRatio ?? DEFAULT_ASPECT_RATIO,
    lowLatency,
    hasRecentWebRTCTimeout,
  });

  const parsedSource = parseCurrentSourceAndPlaybackId({
    accessKey: accessKey ?? null,
    aspectRatio: aspectRatio ?? null,
    isHlsSupported: isHlsSupported,
    jwt: jwt ?? null,
    playbackRate,
    sessionToken: sessionToken,
    source: sortedSources?.[0] ?? null,
    videoQuality,
  });

  return {
    currentSource: parsedSource?.currentSource ?? null,
    playbackId: parsedSource?.playbackId ?? null,
    sortedSources,
  } as const;
};

export const getVideoTrackSelectorForQuality = (
  videoQuality: VideoQuality,
  aspectRatio: InitialProps["aspectRatio"],
): VideoTrackSelector | null => {
  if (videoQuality === "auto") {
    return null;
  }

  const videoQualityDimensions = calculateVideoQualityDimensions(
    videoQuality,
    aspectRatio,
  );

  if (videoQualityDimensions?.width && videoQualityDimensions?.height) {
    return `~${videoQualityDimensions.width}x${videoQualityDimensions.height}`;
  }

  return null;
};

export function calculateVideoQualityDimensions(
  videoQuality: VideoQuality,
  aspectRatio: InitialProps["aspectRatio"],
) {
  const height =
    videoQuality === "1080p"
      ? 1080
      : videoQuality === "720p"
        ? 720
        : videoQuality === "480p"
          ? 480
          : videoQuality === "360p"
            ? 360
            : videoQuality === "240p"
              ? 240
              : videoQuality === "144p"
                ? 144
                : null;

  return {
    width:
      height !== null ? Math.round(height * (aspectRatio ?? 16 / 9)) : null,
    height,
  };
}

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
