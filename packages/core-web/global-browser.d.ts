/**
 * Browser Compatibility Types
 */
declare global {
  interface Window {
    readonly chrome: boolean;
    readonly safari: boolean;
    readonly WebKitMediaSource: typeof MediaSource | undefined;
    readonly WebKitSourceBuffer: typeof SourceBuffer | undefined;
    readonly webkitRTCPeerConnection: typeof RTCPeerConnection | undefined;
    readonly mozRTCPeerConnection: typeof RTCPeerConnection | undefined;
    readonly webkitRTCDataChannel: typeof RTCDataChannel | undefined;
    readonly mozRTCDataChannel: typeof RTCDataChannel | undefined;
  }

  type WebKitPresentationMode = "picture-in-picture" | "inline" | "fullscreen";

  interface Navigator {
    getUserMedia?: MediaDevices["getUserMedia"];
    webkitGetUserMedia?: MediaDevices["getUserMedia"];
    mozGetUserMedia?: MediaDevices["getUserMedia"];
    msGetUserMedia?: MediaDevices["getUserMedia"];

    // Adding mediaDevices with standardized and prefixed versions
    webkitMediaDevices?: MediaDevices;
    mozMediaDevices?: MediaDevices;
    msMediaDevices?: MediaDevices;

    // Adding getDisplayMedia for screen capture
    getDisplayMedia?: (
      constraints: MediaStreamConstraints,
    ) => Promise<MediaStream>;

    // WebRTC Interfaces
    RTCPeerConnection?: typeof RTCPeerConnection;
    webkitRTCPeerConnection?: typeof RTCPeerConnection;
    mozRTCPeerConnection?: typeof RTCPeerConnection;
    msRTCPeerConnection?: typeof RTCPeerConnection;

    RTCDataChannel?: typeof RTCDataChannel;
    webkitRTCDataChannel?: typeof RTCDataChannel;
    mozRTCDataChannel?: typeof RTCDataChannel;
    msRTCDataChannel?: typeof RTCDataChannel;
  }

  interface HTMLElement {
    /**
     * Enters fullscreen mode. Used in old Safari.
     */
    webkitRequestFullscreen?(): void;
    /**
     * Enters fullscreen mode. Used in old Safari.
     */
    webkitRequestFullScreen?(): void;
    /**
     * Enters fullscreen mode. Used in old Firefox.
     */
    mozRequestFullScreen?(): void;
    /**
     * Enters fullscreen mode. Used in old IE.
     */
    msRequestFullscreen?(): void;
    /**
     * Enters picture-in-picture mode
     */
    requestPictureInPicture?(): void;
  }

  interface HTMLVideoElement {
    /**
     * A Boolean value indicating whether the video is displaying in fullscreen mode.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1630493-webkitdisplayingfullscreen}
     */
    readonly webkitDisplayingFullscreen?: boolean;

    /**
     * A Boolean value indicating whether the video can be played in fullscreen mode.
     *
     * `true` if the device supports fullscreen mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen}
     */
    readonly webkitSupportsFullscreen?: boolean;

    /**
     * A Boolean value indicating whether wireless video playback is disabled.
     */
    readonly webkitWirelessVideoPlaybackDisabled?: boolean;

    /**
     * A property indicating the presentation mode.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode}
     */
    readonly webkitPresentationMode?: WebKitPresentationMode;

    /**
     * Enters fullscreen mode.
     *
     * This method throws an exception if the element is not allowed to enter fullscreen—that is,
     * if `webkitSupportsFullscreen` is false.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen}
     */
    webkitEnterFullscreen?(): void;

    /**
     * Exits fullscreen mode.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629468-webkitexitfullscreen}
     */
    webkitExitFullscreen?(): void;

    /**
     * A Boolean value indicating whether the video can be played in presentation mode.
     *
     * `true` if the device supports presentation mode; otherwise, `false`. This property is also
     * `false` if the meta data is `loaded` or the `loadedmetadata` event has not fired, and if
     * the files are audio-only.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1629816-webkitsupportspresentationmode}
     */
    webkitSupportsPresentationMode?(mode: WebKitPresentationMode): boolean;

    /**
     * Sets the presentation mode for video playback.
     *
     * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631224-webkitsetpresentationmode}
     */
    webkitSetPresentationMode?(mode: WebKitPresentationMode): Promise<void>;
  }

  interface Document {
    /** Exits fullscreen mode. Used in old Safari. */
    webkitExitFullscreen?(): void;
    /** Exits fullscreen mode. Used in old Firefox. */
    mozCancelFullScreen?(): void;
    /** Cancels fullscreen mode. Used in Safari. */
    webkitCancelFullScreen?(): void;
    /** Exits fullscreen mode. Used in old IE. */
    msExitFullscreen?(): void;

    /** If fullscreen is enabled. Used in Safari. */
    readonly webkitFullscreenEnabled?: boolean;
    /** If fullscreen is enabled. Used in old Firefox. */
    mozFullScreenEnabled?(): void;
    /** If fullscreen is enabled. Used in old IE. */
    msFullscreenEnabled?(): void;

    /** Current fullscreen element. Used in Safari. */
    readonly webkitFullscreenElement?: Element;
    /** Element that is fullscreen. Used in Safari. */
    webkitCurrentFullScreenElement?: Element;
    /** Element that is fullscreen. Used in old IE. */
    msFullscreenElement?(): void;
    /** Element that is fullscreen. Used in old Firefox. */
    mozFullScreenElement?(): void;
  }
}

export type {};
