import { vi } from 'vitest';

export const MockedWebSocket = vi.fn(() => ({
  onopen: vi.fn(),
  onclose: vi.fn(),
  send: vi.fn(),
}));

vi.stubGlobal('WebSocket', MockedWebSocket);

export const waitForWebsocketOpen = async (_websocket: WebSocket | null) =>
  new Promise<void>((resolve, _reject) => {
    resolve();
  });

export class MockedVideoElement extends HTMLVideoElement {
  listeners: { [key: string]: EventListenerOrEventListenerObject[] } = {};

  constructor() {
    // Always call super first in constructor
    super();
  }

  load = vi.fn(() => {
    return true;
  });

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
