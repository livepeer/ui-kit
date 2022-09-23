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
        <span>
          <div
            class="c-juZXli c-juZXli-djNDqV-size-default"
            tabindex="0"
          >
            <video
              aria-label="Video player"
              class="c-PJLV c-PJLV-iXcqjl-size-default"
              data-controller-initialized="true"
              height="100%"
              playsinline=""
              role="video"
              webkit-playsinline="true"
              width="100%"
            >
              Your browser doesn't support the HTML5 &lt;code&gt;video&lt;/code&gt; tag, or the video format.
            </video>
            <div
              class="c-PJLV c-iSNkqM c-PJLV-hiRmpy-display-shown"
            >
              <div
                class="c-kxrkoX"
              />
            </div>
          </div>
        </span>
      </div>
    `);
  });

  describe('playbackId', () => {
    it('constructs src', async () => {
      const { container } = render(<Player playbackId={playbackId} />);

      expect(container).toMatchInlineSnapshot(`
        <div>
          <span>
            <div
              class="c-juZXli c-juZXli-djNDqV-size-default"
              tabindex="0"
            >
              Your audio or video format could not be identified. Please retry with another source.
              <div
                class="c-PJLV c-iSNkqM c-PJLV-hiRmpy-display-shown"
              >
                <div
                  class="c-kxrkoX"
                />
              </div>
            </div>
          </span>
        </div>
      `);
    });
  });
});
