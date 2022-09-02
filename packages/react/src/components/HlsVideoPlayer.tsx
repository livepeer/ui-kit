import { HlsVideoConfig, createNewHls, isHlsSupported } from 'livepeer';
import { RefObject, VideoHTMLAttributes, useEffect } from 'react';

export interface GenericHlsVideoPlayerProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'autoPlay'> {
  playerRef: RefObject<HTMLVideoElement>;
  hlsConfig?: HlsVideoConfig;
  autoplay?: boolean;
  controls?: boolean;
  width?: string | number;
}

export interface HlsVideoPlayerProps extends GenericHlsVideoPlayerProps {
  src: string;
}

export function HlsVideoPlayer({
  hlsConfig,
  playerRef,
  src,
  autoplay = true,
  controls = true,
  width = '100%',
  ...props
}: HlsVideoPlayerProps) {
  useEffect(() => {
    if (
      playerRef.current &&
      typeof window !== 'undefined' &&
      isHlsSupported()
    ) {
      const { destroy } = createNewHls(src, playerRef.current, {
        autoplay,
        ...hlsConfig,
      });

      console.log(JSON.stringify(playerRef.current.src));

      return () => {
        destroy();
      };
    }
  }, [autoplay, hlsConfig, playerRef, src]);

  // if Media Source is supported, use HLS.js to play video
  if (typeof window !== 'undefined' && isHlsSupported())
    return (
      <video ref={playerRef} controls={controls} width={width} {...props} />
    );

  // fallback to using a regular video player if HLS is supported by default in the user's browser
  return (
    <video
      ref={playerRef}
      src={src}
      autoPlay={autoplay}
      controls={controls}
      width={width}
      {...props}
    />
  );
}
