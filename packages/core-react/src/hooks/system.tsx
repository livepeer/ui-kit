import * as React from 'react';

export const useConditionalIcon = (
  conditional: boolean,
  truthyIcon: React.ReactNode | null | undefined,
  truthyDefaultIcon: React.ReactNode,
  falsyIcon: React.ReactNode | null | undefined,
  falsyDefaultIcon: React.ReactNode,
) => {
  const element = React.useMemo(
    () =>
      conditional
        ? truthyIcon ?? truthyDefaultIcon
        : falsyIcon ?? falsyDefaultIcon,
    [conditional, truthyIcon, truthyDefaultIcon, falsyIcon, falsyDefaultIcon],
  );

  return React.useMemo(
    () => (React.isValidElement(element) ? React.cloneElement(element) : null),
    [element],
  );
};

export const useMemoizedIcon = (
  icon: React.ReactNode | null | undefined,
  defaultIcon: React.ReactNode,
) => {
  return React.useMemo(
    () =>
      icon && React.isValidElement(icon)
        ? React.cloneElement(icon)
        : defaultIcon,
    [icon, defaultIcon],
  );
};
