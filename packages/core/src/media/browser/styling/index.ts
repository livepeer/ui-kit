import { iconButton } from './button';
import { container } from './container';
import { controlsContainer } from './controlsContainer';
import { media } from './media';
import { slider } from './slider';
import { time } from './time';
import { title } from './title';
import { volume } from './volume';

export const styling = {
  container,
  controlsContainer,
  iconButton,
  media,
  slider,
  time,
  title,
  volume,
};

export type { AspectRatio } from './container';
export { createPlayerTheme, defaultTheme, getCssText } from './stitches';
export type { ThemeConfig } from './stitches';
