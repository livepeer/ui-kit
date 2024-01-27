import { Src, getMediaSourceType } from "./src";

/**
 * Parses various types of playback information and converts them into an array of Src objects.
 *
 * This function is designed to handle multiple input types: `PlaybackInfo`, `Source`, `string[]`, and `string`.
 * It processes these inputs to extract or construct source objects and then transforms these into `Src` inputs.
 *
 * - `PlaybackInfo`: Extracts the 'source' array from its 'meta' property.
 * - `Source`: Directly uses the Source object.
 * - `string[]`: Assumes each string as a URL and creates an array of Source objects.
 * - `string`: Assumes the string is a URL and creates a single Source object.
 *
 * @param {PlaybackInfo | Source | string[] | string | null | undefined} playbackInfo - The playback information to be parsed.
 * It can be of type `PlaybackInfo`, `Source`, `string[]` of URLs, or a single URL.
 * @returns {Src[] | null} An array of `Src` derived from the provided playback information, or null if the input is invalid or empty.
 */
export const getSrc = (
  source: PlaybackInfo | Source | string[] | string | null | undefined,
): Src[] | null => {
  if (!source) {
    return null;
  }

  let sources: Omit<Source, "hrn" | "type">[] = [];

  if (typeof source === "string") {
    sources = [{ url: source }];
  } else if (Array.isArray(source)) {
    sources = source.map((url) => ({ url }));
  } else if ("url" in source && "type" in source && "hrn" in source) {
    sources = [source];
  } else if ("meta" in source && source.meta.source) {
    sources = source.meta.source;
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
 * Phase of the asset storage
 */
export enum Phase {
  Waiting = "waiting",
  Processing = "processing",
  Ready = "ready",
  Failed = "failed",
  Reverted = "reverted",
}
export interface Tasks {
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
export interface StorageStatus {
  /**
   * Phase of the asset storage
   */
  phase: Phase;
  /**
   * Current progress of the task updating the storage.
   */
  progress?: number;
  /**
   * Error message if the last storage changed failed.
   */
  errorMessage?: string;
  tasks: Tasks;
}

/**
 * Video Metadata EIP-712 primaryType
 */
export enum PrimaryType {
  VideoAttestation = "VideoAttestation",
}
export enum Name {
  VerifiableVideo = "Verifiable Video",
}
export enum Version {
  One = "1",
}
/**
 * Video Metadata EIP-712 domain
 */
export interface Domain {
  name: Name;
  version: Version;
}
export interface Attestations {
  role: string;
  address: string;
}
/**
 * Video Metadata EIP-712 message content
 */
export interface Message {
  video: string;
  attestations: Attestations[];
  signer: string;
  timestamp: number;
}
export enum SignatureType {
  Eip712 = "eip712",
  Flow = "flow",
}
export interface AttestationIpfs {
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
export interface AttestationStorage {
  ipfs?: AttestationIpfs;
  status?: StorageStatus;
}
export interface Attestation {
  id?: string;
  /**
   * Video Metadata EIP-712 primaryType
   */
  primaryType: PrimaryType;
  /**
   * Video Metadata EIP-712 domain
   */
  domain: Domain;
  /**
   * Video Metadata EIP-712 message content
   */
  message: Message;
  /**
   * Video Metadata EIP-712 message signature
   */
  signature: string;
  /**
   * Timestamp (in milliseconds) at which the object was created
   */
  createdAt?: number;
  signatureType?: SignatureType;
  storage?: AttestationStorage;
}

export enum TypeT {
  Public = "public",
  Jwt = "jwt",
  Webhook = "webhook",
}
/**
 * Whether the playback policy for a asset or stream is public or signed
 */
export interface PlaybackPolicy {
  type: TypeT;
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

export enum PlaybackInfoType {
  Live = "live",
  Vod = "vod",
  Recording = "recording",
}
export enum Hrn {
  HlsTs = "HLS (TS)",
  Mp4 = "MP4",
  WebRTCH264 = "WebRTC (H264)",
}
export enum PlaybackInfoSchemasType {
  Html5ApplicationVndAppleMpegurl = "html5/application/vnd.apple.mpegurl",
  Html5VideoMp4 = "html5/video/mp4",
  Html5VideoH264 = "html5/video/h264",
}
export interface Source {
  hrn: Hrn;
  type: PlaybackInfoSchemasType;
  url: string;
  size?: number;
  width?: number;
  height?: number;
  bitrate?: number;
}
export interface Meta {
  live?: number;
  /**
   * Whether the playback policy for a asset or stream is public or signed
   */
  playbackPolicy?: PlaybackPolicy;
  source: Source[];
  attestation?: Attestation;
}
export interface PlaybackInfo {
  type: PlaybackInfoType;
  meta: Meta;
}
