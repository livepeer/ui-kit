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

    // TODO update this test
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="c-gEBiRk"
          tabindex="0"
        >
          <video
            aria-label="video-player"
            data-controller-initialized="true"
            role="video"
            src="https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8"
            width="30"
          />
          <div
            class="c-zLwcn"
          />
          <div
            class="c-gfHZqj c-gfHZqj-iPJLV-css"
          />
          <div
            class="c-epsmjl c-epsmjl-iPJLV-css"
          >
            <div
              class="c-fNlupO"
            >
              <div
                aria-orientation="horizontal"
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow="NaN"
                class="c-fIGUYZ"
                secondaryvalue="NaN"
                value="NaN"
              >
                <div
                  class="c-byenwU c-eywRub c-byenwU-ieLaWzt-css"
                />
                <div
                  class="c-byenwU c-eAcrKl c-byenwU-idhWGUv-css"
                />
              </div>
            </div>
            <div
              class="c-cSwjHS"
            >
              <div
                class="c-cSwjHS c-lbNOYO"
              >
                <button
                  aria-label="play"
                  class="c-hddTKm"
                >
                  <svg
                    fill="none"
                    height="42"
                    viewBox="0 0 36 36"
                    width="42"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <div
                  class="c-iIOWzi"
                >
                  <button
                    aria-label="mute"
                    class="c-hddTKm"
                  >
                    <svg
                      height="42"
                      viewBox="0 0 36 36"
                      width="42"
                    >
                      <path
                        d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <div
                    aria-orientation="horizontal"
                    aria-valuemax="100"
                    aria-valuemin="0"
                    aria-valuenow="100"
                    class="c-fIGUYZ"
                    value="1"
                  >
                    <div
                      class="c-byenwU c-eywRub c-byenwU-ieGpUkf-css"
                    />
                    <div
                      class="c-byenwU c-eAcrKl c-byenwU-ielZvhQ-css"
                    />
                  </div>
                </div>
                <span
                  aria-label="playback time"
                  class="c-gfWJPK"
                >
                  0:00 / 0:00
                </span>
              </div>
              <div
                class="c-cSwjHS c-lbNOYO"
              >
                <button
                  aria-label="enter fullscreen"
                  class="c-hddTKm"
                >
                  <svg
                    fill="none"
                    height="42"
                    viewBox="0 0 36 36"
                    width="42"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"
                      fill="currentColor"
                    />
                    <path
                      d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"
                      fill="currentColor"
                    />
                    <path
                      d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"
                      fill="currentColor"
                    />
                    <path
                      d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
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
