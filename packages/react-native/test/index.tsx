import { studioProvider } from '@livepeer/core-react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook as defaultRenderHook } from '@testing-library/react-hooks';
import {
  RenderHookOptions,
  RenderOptions,
  render as defaultRender,
  renderHook as defaultRenderHookCore,
  waitFor,
} from '@testing-library/react-native';

import * as React from 'react';

import { LivepeerConfig } from '../src';
import { createReactClient } from '../src/client';

// set up React globally for tests
global.React = React;

export const provider = studioProvider({
  apiKey: process.env.STUDIO_API_KEY,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent vitest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
});

type Props = {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};
export function wrapper({ ...rest }: Props = {}) {
  return (
    <LivepeerConfig
      client={createReactClient({
        provider,
        queryClient,
      })}
      {...rest}
    />
  );
}

export function renderHook<TResult, TProps extends Props>(
  hook: (props: TProps) => TResult,
  _options?: Pick<RenderHookOptions<TProps>, 'wrapper'>,
) {
  const options = {
    ...(_options?.wrapper
      ? { wrapper: _options?.wrapper }
      : {
          wrapper: (props: TProps) => wrapper({ ...props }),
        }),
  } as RenderHookOptions<TProps>;

  queryClient.clear();

  // typecast for old React 17 version to new React 18
  const utils = (defaultRenderHook as typeof defaultRenderHookCore)<
    TResult,
    TProps
  >(hook, options);
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  };
}

export const render = (ui: React.ReactElement, options?: RenderOptions) =>
  defaultRender(ui, { wrapper, ...options });

export { act, cleanup, fireEvent, screen } from '@testing-library/react-native';
export { getSampleVideo, getSigners } from 'livepeer/test';
