import { TitleProps } from '@livepeer/core-react/components';
import { styling } from '@livepeer/core-web/media/browser/styling';
import * as React from 'react';

export type { TitleProps };

export const Title: React.FC<TitleProps> = (props) => {
  const { content } = props;

  return (
    <span className={styling.title()} aria-label={'Title'}>
      {content}
    </span>
  );
};
