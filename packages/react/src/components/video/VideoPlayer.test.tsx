import { describe, expect, it } from 'vitest';

import { fireEvent, render, screen } from '../../../test';
import { VideoPlayer } from './VideoPlayer';

const src =
  'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8';
const playbackId = 'abcde6mykgkvtxav';

describe('VideoPlayer', () => {
  it('mounts', () => {
    const { container } = render(
      <VideoPlayer autoPlay={false} width={30} src={src} />,
    );

    fireEvent.click(screen.getByRole('video'));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <video
          aria-label="video-player"
          controls=""
          role="video"
          src="https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8"
          width="30"
        />
      </div>
    `);
  });

  describe('playbackId', () => {
    it('constructs src', async () => {
      const { container } = render(<VideoPlayer playbackId={playbackId} />);

      expect(container).toMatchInlineSnapshot('<div />');
    });
  });
});
