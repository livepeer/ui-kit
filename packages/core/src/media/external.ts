import { getMediaSourceType, type Src } from "./src";

type InternalParsedSrc = {
  url: string;
  size?: number;
  width?: number;
  height?: number;
  bitrate?: number;
};

/**
 * Parses various types of playback information and converts them into an array of Src objects.
 *
 * This function is designed to handle multiple input types: Livepeer playback info, Cloudflare stream data, Mux URLs, `string[]`, and `string`.
 * It processes these inputs to extract or construct source objects and then transforms these into `Src` inputs.
 *
 * These include the video playback information, as well as supporting data like thumbnails and VTT files, which can be used by the Player.
 *
 * The input types and their processing are as follows:
 * - `LivepeerPlaybackInfo`: Extracts the 'source' array from its 'meta' property.
 * - `LivepeerSource` or `LivepeerSource[]`: Uses the source object(s) directly.
 * - `CloudflareStreamData`: Retrieves the stream data and constructs Source objects.
 * - `CloudflareUrlData`: Uses the URL data to create a Source object.
 * - `string[]`: Assumes each string as a URL and creates an array of Source objects.
 * - `string`: Assumes the string is a URL and creates a single Source object.
 *
 * @param {LivepeerPlaybackInfo | LivepeerSource | LivepeerSource[] | CloudflareStreamData | CloudflareUrlData | string[] | string | null | undefined} source - The playback information to be parsed.
 * It can be of type `LivepeerPlaybackInfo`, `LivepeerSource`, `LivepeerSource[]`, `CloudflareStreamData`, `CloudflareUrlData`, `string[]` of URLs, or a single URL.
 * @returns {Src[] | null} An array of `Src` objects derived from the provided playback information, or null if the input is invalid or empty.
 *
 * Each `Src` object may contain the following properties:
 * - `url`: The URL of the media source.
 * - `size`: The size of the media file (optional).
 * - `width`: The width of the media (optional).
 * - `height`: The height of the media (optional).
 * - `bitrate`: The bitrate of the media (optional).
 */
export const getSrc = (
  source:
    | LivepeerPlaybackInfo
    | LivepeerSource
    | LivepeerSource[]
    | CloudflareStreamData
    | CloudflareUrlData
    | string[]
    | string
    | null
    | undefined,
): Src[] | null => {
  if (!source) {
    return null;
  }

  let sources: InternalParsedSrc[] = [];

  if (typeof source === "string") {
    sources = [{ url: source }];
  } else if (Array.isArray(source)) {
    sources = source.map((s) =>
      typeof s === "string"
        ? { url: s }
        : (s as LivepeerSource)?.url
          ? { ...(s as InternalParsedSrc) }
          : { url: s as unknown as string },
    );
  } else if (typeof source === "object") {
    if ("url" in source && typeof source.url === "string") {
      sources = [source as { url: string }];
    } else if (
      "meta" in source &&
      typeof source.meta === "object" &&
      source.meta &&
      "source" in source.meta &&
      Array.isArray(source.meta.source) &&
      // biome-ignore lint/correctness/noUnsafeOptionalChaining: allow unsafe check
      "url" in source?.meta?.source?.[0]
    ) {
      sources = source.meta.source as { url: string }[];
    } else if (
      "webRTCPlayback" in source &&
      typeof source.webRTCPlayback === "object" &&
      source.webRTCPlayback &&
      "url" in source.webRTCPlayback &&
      typeof source.webRTCPlayback.url === "string"
    ) {
      sources = [{ url: source.webRTCPlayback.url }];
    }
  }

  // Process sources to get Src[]
  const result = sources
    .map((s) =>
      getMediaSourceType(s.url, {
        sizing:
          s.height && s.width
            ? {
                width: s.width,
                height: s.height,
              }
            : undefined,
      }),
    )
    .filter((source) => source?.src)
    // biome-ignore lint/style/noNonNullAssertion: filtered above
    .map((source) => source!);

  return result.length > 0 ? result : null;
};

/**
 * Parses various types of ingest information and converts them into a WHIP URL.
 *
 * This function is designed to handle multiple input types: strings (assumed to be stream keys or URLs), Cloudflare stream data, Cloudflare URL data, or Livepeer stream data. It processes these inputs to either return the URL directly, construct a WHIP URL using the provided base URL, or extract the URL from object data.
 *
 * - If the input is a valid URL (starting with http/https), it returns the URL directly.
 * - If the input is a string not starting with http/https, it treats the string as a stream key and constructs a WHIP URL using the provided base URL from opts.
 * - For object inputs (`CloudflareStreamData`, `CloudflareUrlData`, or `LivepeerStream`), it attempts to extract the URL from the `url`, `webRTC.url`, or `streamKey` properties.
 *
 * @param {string | LivepeerStream | CloudflareStreamData | CloudflareUrlData | null | undefined} ingest - The ingest information to be parsed. It can be a stream key, URL, Cloudflare stream data, Cloudflare URL data, or Livepeer stream data.
 * @param {Object} [opts] - Optional parameters.
 * @param {string | null | undefined} [opts.baseUrl] - The base URL used to construct a WHIP URL when a stream key is provided. Defaults to "https://playback.livepeer.studio/webrtc".
 * @returns {string | null} A WHIP URL derived from the provided ingest information, or null if the input is invalid, empty, or the necessary information to construct a WHIP URL is not provided.
 */
export const getIngest = (
  ingest:
    | string
    | LivepeerStream
    | CloudflareStreamData
    | CloudflareUrlData
    | null
    | undefined,
  opts: { baseUrl?: string | null | undefined } = {
    baseUrl: "https://playback.livepeer.studio/webrtc",
  },
): string | null => {
  if (!ingest) {
    return null;
  }

  if (typeof ingest === "string" && ingest) {
    if (/^https?:\/\//i.test(ingest)) {
      return ingest;
    }

    // we assume a stream key has been passed here
    if (opts.baseUrl) {
      return `${opts.baseUrl}/${ingest}`;
    }

    return null;
  }

  if (typeof ingest === "object") {
    if ("url" in ingest && typeof ingest.url === "string" && ingest.url) {
      return ingest.url;
    }

    if (
      "streamKey" in ingest &&
      typeof ingest.streamKey === "string" &&
      ingest.streamKey
    ) {
      if (opts.baseUrl) {
        return `${opts.baseUrl}/${ingest.streamKey}`;
      }
    }

    if (
      "webRTC" in ingest &&
      typeof ingest.webRTC === "object" &&
      ingest.webRTC &&
      "url" in ingest.webRTC &&
      typeof ingest.webRTC.url === "string" &&
      typeof ingest.webRTC.url
    ) {
      return ingest.webRTC.url;
    }

    return null;
  }

  return null;
};

/**
 * Phase of the asset storage
 */
export enum LivepeerPhase {
  Waiting = "waiting",
  Processing = "processing",
  Ready = "ready",
  Failed = "failed",
  Reverted = "reverted",
}
export interface LivepeerTasks {
  /**
   * ID of any currently running task that is exporting this
   *
   * @remarks
   * asset to IPFS.
   *
   */
  pending?: string;
  /**
   * ID of the last task to run successfully, that created
   *
   * @remarks
   * the currently saved data.
   *
   */
  last?: string;
  /**
   * ID of the last task to fail execution.
   */
  failed?: string;
}
export interface LivepeerStorageStatus {
  /**
   * Phase of the asset storage
   */
  phase?: LivepeerPhase;
  /**
   * Current progress of the task updating the storage.
   */
  progress?: number;
  /**
   * Error message if the last storage changed failed.
   */
  errorMessage?: string;
  tasks?: LivepeerTasks;
}

/**
 * Video Metadata EIP-712 primaryType
 */
export enum LivepeerPrimaryType {
  VideoAttestation = "VideoAttestation",
}
export enum LivepeerName {
  VerifiableVideo = "Verifiable Video",
}
export enum LivepeerVersion {
  One = "1",
}
/**
 * Video Metadata EIP-712 domain
 */
export interface LivepeerDomain {
  name?: LivepeerName;
  version?: LivepeerVersion;
}
export interface LivepeerAttestations {
  role?: string;
  address?: string;
}
/**
 * Video Metadata EIP-712 message content
 */
export interface LivepeerMessage {
  video?: string;
  attestations?: LivepeerAttestations[];
  signer?: string;
  timestamp?: number;
}
export enum LivepeerSignatureType {
  Eip712 = "eip712",
  Flow = "flow",
}
export interface LivepeerAttestationIpfs {
  /**
   * CID of the file on IPFS
   */
  cid?: string;
  /**
   * URL with IPFS scheme for the file
   */
  url?: string;
  /**
   * URL to access file via HTTP through an IPFS gateway
   */
  gatewayUrl?: string;
  /**
   * Timestamp (in milliseconds) at which IPFS export task was updated
   *
   * @remarks
   *
   */
  updatedAt?: number;
}
export interface LivepeerAttestationStorage {
  ipfs?: LivepeerAttestationIpfs;
  status?: LivepeerStorageStatus;
}
export interface LivepeerAttestation {
  id?: string;
  /**
   * Video Metadata EIP-712 primaryType
   */
  primaryType?: LivepeerPrimaryType;
  /**
   * Video Metadata EIP-712 domain
   */
  domain?: LivepeerDomain;
  /**
   * Video Metadata EIP-712 message content
   */
  message?: LivepeerMessage;
  /**
   * Video Metadata EIP-712 message signature
   */
  signature?: string;
  /**
   * Timestamp (in milliseconds) at which the object was created
   */
  createdAt?: number;
  signatureType?: LivepeerSignatureType;
  storage?: LivepeerAttestationStorage;
}

export enum LivepeerTypeT {
  Public = "public",
  Jwt = "jwt",
  Webhook = "webhook",
}
/**
 * Whether the playback policy for a asset or stream is public or signed
 */
export interface LivepeerPlaybackPolicy {
  type?: LivepeerTypeT;
  /**
   * ID of the webhook to use for playback policy
   */
  webhookId?: string;
  /**
   * User-defined webhook context
   */
  // biome-ignore lint/suspicious/noExplicitAny: any allowed
  webhookContext?: Record<string, any>;
}

export enum LivepeerPlaybackInfoType {
  Live = "live",
  Vod = "vod",
  Recording = "recording",
}
export interface LivepeerSource {
  hrn?: string;
  type?: string;
  url?: string;
  size?: number;
  width?: number;
  height?: number;
  bitrate?: number;
}
export interface LivepeerMeta {
  live?: number;
  /**
   * Whether the playback policy for a asset or stream is public or signed
   */
  playbackPolicy?: LivepeerPlaybackPolicy;
  source?: LivepeerSource[];
  attestation?: LivepeerAttestation;
}
export interface LivepeerPlaybackInfo {
  type?: LivepeerPlaybackInfoType;
  meta?: LivepeerMeta;
}

export interface LivepeerStream {
  streamKey?: string;
}

export type CloudflareStreamData = {
  webRTC?: CloudflareUrlData;
  webRTCPlayback?: CloudflareUrlData;
};

export type CloudflareUrlData = {
  url?: string;
};
