import * as React from 'react';

export const useIsElementShown = (target: Element | undefined | null) => {
  const [isCurrentlyShown, setIsCurrentlyShown] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && target) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) =>
          setIsCurrentlyShown(Boolean(entry?.isIntersecting)),
        );

        observer.observe(target);

        return () => {
          observer.disconnect();
        };
      } else {
        // we default to currently shown on Opera and other browsers that don't support IntersectionObserver
        setIsCurrentlyShown(true);
      }
    }
  }, [target]);

  return isCurrentlyShown;
};
