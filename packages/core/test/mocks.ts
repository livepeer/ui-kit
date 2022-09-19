import { vi } from 'vitest';

import { default as NodeWebSocket } from 'ws';

vi.stubGlobal('WebSocket', NodeWebSocket);

export const MockedWebSocket = NodeWebSocket;

export const waitForWebsocketOpen = async (websocket: WebSocket | null) =>
  new Promise<void>((resolve, reject) => {
    websocket
      ? websocket.addEventListener('open', () => {
          resolve();
        })
      : reject();
  });

export class MockedVideoElement extends HTMLVideoElement {
  listeners: { [key: string]: EventListenerOrEventListenerObject[] } = {};

  constructor() {
    // Always call super first in constructor
    super();
  }

  addEventListener = vi.fn(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      this.listeners[event] = [...(this.listeners[event] ?? []), listener];
    },
  );
  removeEventListener = vi.fn(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      this.listeners[event] =
        this.listeners[event]?.filter((l) => l !== listener) ?? [];
    },
  );
  dispatchEvent = vi.fn((e: Event) => {
    if (this.listeners[e.type]) {
      for (const listener of this.listeners[e.type] ?? []) {
        if (typeof listener === 'function') {
          listener?.(e);
        } else {
          listener?.handleEvent(e);
        }
      }
    }

    return true;
  });

  getAttribute = vi.fn(() => {
    return 'false';
  });
  setAttribute = vi.fn(() => {
    return true;
  });
}

// register the custom element
customElements.define('mocked-video', MockedVideoElement, {
  extends: 'video',
});
