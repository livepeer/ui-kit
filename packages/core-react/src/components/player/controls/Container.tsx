import { AspectRatio, ThemeConfig } from '@livepeer/core/media';

export type ContainerProps = {
  aspectRatio: AspectRatio;
  children: React.ReactNode;
  theme?: ThemeConfig;
};
