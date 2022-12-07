import {
  StudioLivepeerProvider,
  studioProvider,
} from '@livepeer/core/providers/studio';
import { QueryClient } from '@tanstack/react-query';
import {
  Queries,
  RenderHookOptions,
  RenderOptions,
  render as defaultRender,
  renderHook as defaultRenderHookCore,
  queries,
  waitFor,
} from '@testing-library/react';
// import from @testing-library/react-hooks for React 17
import { renderHook as defaultRenderHook } from '@testing-library/react-hooks';

import * as React from 'react';

import { Client, createReactClient } from '../src/client';
import { LivepeerConfig } from '../src/context';

export const provider = studioProvider({
  apiKey: process.env.STUDIO_API_KEY ?? '',
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

type Props = { client?: Client<StudioLivepeerProvider> } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};
export function wrapper({
  client = createReactClient({
    provider,
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

export const render = <
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: React.ReactElement,
  options?: RenderOptions<Q, Container, BaseElement>,
) => defaultRender(ui, { wrapper, ...options });

export { act, cleanup, fireEvent, screen } from '@testing-library/react';
export { getSampleVideo } from '../../core/test';
