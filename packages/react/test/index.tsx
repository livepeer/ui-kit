import {
  Queries,
  RenderOptions,
  render as defaultRender,
  queries,
} from "@testing-library/react";
// import from @testing-library/react-hooks for React 17

import * as React from "react";

export const render = <
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: React.ReactElement,
  options?: RenderOptions<Q, Container, BaseElement>,
) => defaultRender(ui, { ...options });

export { act, cleanup, fireEvent, screen } from "@testing-library/react";
export { getSampleVideo } from "../../core/test";
