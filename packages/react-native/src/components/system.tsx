import * as React from 'react';

/**
 * As prop
 */
export type As<Props = any> = React.ElementType<Props>;

/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};

export {
  useConditionalIcon,
  useMemoizedIcon,
} from '@livepeer/core-react/hooks';
