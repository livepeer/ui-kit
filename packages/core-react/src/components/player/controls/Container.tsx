import { AspectRatio, ThemeConfig } from 'livepeer/media';

export type ContainerProps = {
  aspectRatio: AspectRatio;
  children: React.ReactNode;
  theme?: ThemeConfig;
};
