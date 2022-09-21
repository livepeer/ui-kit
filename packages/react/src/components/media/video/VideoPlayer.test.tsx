import { describe, expect, it } from 'vitest';

import { fireEvent, render, screen } from '../../../../test';
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

    // TODO update this test
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            class="c-jrULJJ c-jrULJJ-ikWNLQK-css"
            tabindex="0"
          >
            <video
              aria-label="video-player"
              data-controller-initialized="true"
              playsinline=""
              role="video"
              src="https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8"
              webkit-playsinline="true"
              width="100%"
            />
            <div
              class="c-iSNkqM"
            >
              <div
                class="c-fquDPQ"
              >
                <div />
              </div>
            </div>
          </div>
        </div>
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
