import { describe, expect, it } from 'vitest';

import { MockedVideoElement } from '../../../test';

import { reportVideoMetrics } from './metrics';

const tenMsWait = async () => await new Promise((r) => setTimeout(r, 10));

describe('reportVideoMetrics', () => {
  it('registers listeners', () => {
    const element = new MockedVideoElement();

    const { metrics } = reportVideoMetrics(
      element,
      'wss://livepeer.fun/json+1234.js',
    );

    expect(metrics).toBeTruthy;
    expect(element.setAttribute).toHaveBeenCalledOnce();
    expect(
      element.addEventListener.mock.calls.map((e) => e?.[0]),
    ).toMatchInlineSnapshot(
      `
      [
        "waiting",
        "stalled",
        "playing",
        "pause",
        "playing",
        "pause",
        "playing",
        "waiting",
        "stalled",
        "error",
        "loadstart",
        "play",
        "playing",
        "loadeddata",
        "pause",
        "abort",
        "emptied",
        "ended",
        "seeking",
        "seeked",
        "ratechange",
      ]
    `,
    );
  });

  describe('reports', () => {
    it('should initialize to base state', async () => {
      const element = new MockedVideoElement();

      const { metrics, websocket } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      websocket?.onopen?.(new Event('open'));

      await tenMsWait();

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.firstPlayback).eq(0);
    });

    it('should update time unpaused and first playback', async () => {
      const element = new MockedVideoElement();

      const { metrics, websocket } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      websocket?.onopen?.(new Event('open'));

      element.dispatchEvent(new Event('playing'));

      await tenMsWait();

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.firstPlayback).greaterThan(0);
      expect(metricsSnapshot?.current?.timeUnpaused).greaterThan(0);
    });

    it('should update time waiting and waiting count', async () => {
      const element = new MockedVideoElement();

      const { metrics } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      element.dispatchEvent(new Event('waiting'));

      await tenMsWait();

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.timeWaiting).greaterThan(0);
      expect(metricsSnapshot?.current?.nWaiting).eq(1);
      expect(metricsSnapshot?.current?.timeUnpaused).eq(0);
      expect(metricsSnapshot?.current?.firstPlayback).eq(0);
    });

    it('should update time stalled and stalled count', async () => {
      const element = new MockedVideoElement();

      const { metrics, websocket } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      websocket?.onopen?.(new Event('open'));

      expect(element.dispatchEvent.mock.calls).toMatchInlineSnapshot('[]');

      element.dispatchEvent(new Event('stalled'));

      await tenMsWait();

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.timeStalled).greaterThan(0);
      expect(metricsSnapshot?.current?.nStalled).eq(1);
      expect(metricsSnapshot?.current?.timeUnpaused).eq(0);
      expect(metricsSnapshot?.current?.firstPlayback).eq(0);
    });
  });
});
