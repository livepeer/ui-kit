import { css } from './stitches';

export const iconButton = css('button', {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  padding: 0,

  paddingTop: '$iconPaddingTop',
  color: '$icon',
  '&:hover': {
    color: '$iconHover',
  },
});
