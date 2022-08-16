import { Box, keyframes } from '@livepeer/design-system';

const rotate = keyframes({
  '100%': { transform: 'rotate(360deg)' },
});

export const Spinner = ({ css = {}, speed = '1s' }) => (
  <Box
    css={{
      color: '$gray4',
      border: '3px solid',
      borderColor: '$blue7',
      borderRadius: '50%',
      borderTopColor: 'inherit',
      width: 26,
      height: 26,
      maxWidth: 26,
      maxHeight: 26,
      animation: `${rotate} ${speed} linear`,
      animationIterationCount: 'infinite',
      ...css,
    }}
  />
);
