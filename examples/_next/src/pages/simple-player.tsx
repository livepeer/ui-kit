import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      <Player
        autoPlay
        muted
        playbackInfo={{
          type: 'vod',
          meta: {
            live: true,
            source: [
              // {
              //   hrn: 'MP4',
              //   type: 'html5/video/mp4',
              //   url: 'https://lp-playback.com/hls/8e286985zu6rdtwx/720p0.mp4',
              //   size: 41817335,
              //   width: 1280,
              //   height: 720,
              //   bitrate: 1311747,
              // },
              {
                hrn: 'HLS (TS)',
                type: 'html5/application/vnd.apple.mpegurl',
                url: 'https://lp-playback.com/hls/8e286985zu6rdtwx/index.m3u8',
              },
              {
                hrn: 'WebRTC (VP8)',
                type: 'html5/video/vp8',
                url: 'https://patchy.ddvtech.com/mist/webrtc/bunny',
              },
            ],
          },
        }}
        loop
      />
    </>
  );
};

export default Page;
