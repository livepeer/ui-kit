export const noPropagate =
  <
    E extends {
      stopPropagation(): void;
    },
  >(
    // biome-ignore lint/suspicious/noExplicitAny: any
    cb: (...args: any) => any,
  ) =>
  (event: E) => {
    event.stopPropagation();

    return cb();
  };
