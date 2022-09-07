import { QueryClient } from '@tanstack/react-query';
import {
  Queries,
  RenderHookOptions,
  RenderOptions,
  render as defaultRender,
  renderHook as defaultRenderHook,
  queries,
  waitFor,
} from '@testing-library/react';
import {
  StudioLivepeerProvider,
  studioProvider,
} from 'livepeer/providers/studio';

import * as React from 'react';

import { LivepeerConfig } from '../src';
import { Client, createReactClient } from '../src/client';

// set up React globally for tests
global.React = React;

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

type Props = { client?: Client<StudioLivepeerProvider> } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};
export function wrapper({
  client = createReactClient({
    provider: studioProvider({
      apiKey: process.env.STUDIO_API_KEY,
    }),
    queryClient,
  }),
  ...rest
}: Props = {}) {
  return <LivepeerConfig client={client} {...rest} />;
}

export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }:
    | RenderHookOptions<TProps & { client?: Client<StudioLivepeerProvider> }>
    | undefined = {},
) {
  const options: RenderHookOptions<
    TProps & { client?: Client<StudioLivepeerProvider> }
  > = {
    ...(wrapper_
      ? { wrapper: wrapper_ }
      : {
          wrapper: (props) => wrapper({ ...props, ...options_?.initialProps }),
        }),
    ...options_,
  };

  queryClient.clear();

  const utils = defaultRenderHook<TResult, TProps>(hook, options);
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  };
}

export const render = <
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: React.ReactElement,
  options?: RenderOptions<Q, Container, BaseElement>,
) => defaultRender(ui, { wrapper, ...options });

export { act, cleanup, fireEvent, screen } from '@testing-library/react';
export { getSampleVideo, getSigners } from '../../core/test';
