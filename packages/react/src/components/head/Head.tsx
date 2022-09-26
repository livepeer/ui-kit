import { getMediaSourceType } from 'livepeer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

type HeadProps = {
  children: React.ReactNode;
};

const Head = (props: HeadProps) => {
  if (typeof window === 'undefined') {
    console.warn(
      'If you are rendering content using SSR, you cannot interact with the document head directly.',
    );

    return <></>;
  }

  return ReactDOM.createPortal(props.children, document.head);
};

export type Props = {
  href: string;
  ssr?: boolean;
};

export const Preload = ({ href, ssr }: Props) => {
  const sourceTyped = getMediaSourceType(href);

  if (!sourceTyped?.mime) {
    return <></>;
  }

  const PreloadTags = (
    <link
      rel="preload"
      href={href}
      as={
        sourceTyped.type === 'video'
          ? 'video'
          : sourceTyped.type === 'audio'
          ? 'audio'
          : ''
      }
      type={sourceTyped.mime}
    />
  );

  if (typeof window === 'undefined') {
    if (!ssr) {
      console.warn(
        'If you are rendering content using SSR, you cannot render preloaded tags without using a component like next/head. See: https://livepeerjs.org/react/Player',
      );
    }

    return <>{PreloadTags}</>;
  }

  return <Head>{PreloadTags}</Head>;
};
