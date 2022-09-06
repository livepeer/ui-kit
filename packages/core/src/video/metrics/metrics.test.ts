import { describe, expect, it, vi } from 'vitest';

import { reportVideoMetrics } from './metrics';

const WebSocketMock = vi.fn(() => ({
  onopen: vi.fn(),
  onclose: vi.fn(),
  send: vi.fn(),
}));

vi.stubGlobal('WebSocket', WebSocketMock);

class CustomVideoElement {
  clientHeight = 343;
  clientWidth = 232;
  events: { [key: string]: (() => void)[] } = {};

  addEventListener = vi.fn((event: string, callback: () => void) => {
    console.log(event);
    console.log(this.events);

    this.events[event] = [...(this.events[event] ?? []), callback];
  });
  dispatchEvent = vi.fn((e: Event) => {
    if (this.events[e.type])
      for (const callback of this.events[e.type]) {
        callback?.();
      }
  });

  async play() {
    return;
  }
  currentTime() {
    return Date.now();
  }
  getAttribute() {
    return 'false';
  }
  setAttribute() {
    return true;
  }
}

const element = new CustomVideoElement();

describe('reportVideoMetrics', () => {
  it('listens', () => {
    const setAttributeSpy = vi
      .spyOn(element, 'setAttribute')
      .mockImplementation(() => true);
    const eventListenerSpy = vi
      .spyOn(element, 'addEventListener')
      .mockImplementation(() => true);

    const { metrics } = reportVideoMetrics(
      element,
      'wss://livepeer.fun/json+1234.js',
    );

    expect(metrics).toBeTruthy;
    expect(setAttributeSpy).toHaveBeenCalledOnce();
    expect(eventListenerSpy.mock.calls).toMatchInlineSnapshot(
      `
      [
        [
          "waiting",
          [Function],
        ],
        [
          "stalled",
          [Function],
        ],
        [
          "playing",
          [Function],
        ],
        [
          "pause",
          [Function],
        ],
        [
          "playing",
          [Function],
        ],
        [
          "pause",
          [Function],
        ],
        [
          "playing",
          [Function],
        ],
        [
          "waiting",
          [Function],
        ],
        [
          "stalled",
          [Function],
        ],
        [
          "error",
          [Function],
        ],
        [
          "loadstart",
          [Function],
        ],
        [
          "play",
          [Function],
        ],
        [
          "playing",
          [Function],
        ],
        [
          "loadeddata",
          [Function],
        ],
        [
          "pause",
          [Function],
        ],
        [
          "abort",
          [Function],
        ],
        [
          "emptied",
          [Function],
        ],
        [
          "ended",
          [Function],
        ],
        [
          "seeking",
          [Function],
        ],
        [
          "seeked",
          [Function],
        ],
        [
          "ratechange",
          [Function],
        ],
      ]
    `,
    );
  });

  it('listens', async () => {
    const { metrics, websocket } = reportVideoMetrics(
      element,
      'wss://livepeer.fun/json+1234.js',
    );

    websocket?.onopen?.(new Event('open'));

    element.addEventListener('playing', () => {
      console.log('trieiieie');
    });

    expect(element.dispatchEvent.mock.calls).toMatchInlineSnapshot('[]');

    element.dispatchEvent(new Event('playing'));

    await new Promise((r) => setTimeout(r, 2000));

    element.dispatchEvent(new Event('pause'));

    await new Promise((r) => setTimeout(r, 2000));

    expect(metrics?.getMetrics()).toMatchInlineSnapshot(
      `
      {
        "current": {
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 343,
          "playerWidth": 232,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "videoHeight": null,
          "videoWidth": null,
        },
        "previous": {
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 343,
          "playerWidth": 232,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "videoHeight": null,
          "videoWidth": null,
        },
      }
    `,
    );
  });
});
