import { describe, expect, it } from 'vitest';

import { fireEvent, render, screen } from '../../../test';
import { Player } from './Player';

const src =
  'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8';
const playbackId = 'abcde6mykgkvtxav';

describe('Player', () => {
  it('mounts', () => {
    const { container } = render(<Player autoPlay={false} src={src} />);

    fireEvent.click(screen.getByRole('video'));

    // TODO update this test
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          style="display: block;"
        >
          <div
            class="c-hQKyni c-hQKyni-qWFEN-size-default"
            tabindex="0"
          >
            <video
              aria-label="video-player"
              class="c-PJLV c-PJLV-hXGYIh-size-default"
              data-controller-initialized="true"
              height="100%"
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
                class="c-kxrkoX"
              />
            </div>
          </div>
        </div>
      </div>
    `);
  });

  describe('playbackId', () => {
    it('constructs src', async () => {
      const { container } = render(<Player playbackId={playbackId} />);

      expect(container).toMatchInlineSnapshot('<div />');
    });
  });
});
