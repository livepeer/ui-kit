import { styling } from 'livepeer';
import * as React from 'react';

export type PosterProps = {
  title?: string;
  content: string | React.ReactNode;
};

export const Poster = React.forwardRef<HTMLImageElement, PosterProps>(
  (props, ref) => {
    const { content, title } = props;

    return typeof content === 'string' ? (
      <img
        className={styling.media.poster()}
        aria-label={title}
        alt={title}
        ref={ref}
        src={content}
      />
    ) : React.isValidElement(content) ? (
      React.cloneElement(content as React.ReactElement, {
        className: styling.media.poster(),
      })
    ) : (
      <></>
    );
  },
);
