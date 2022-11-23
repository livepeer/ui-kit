import { View } from 'react-native';

import { styled } from './stitches';

export const Loading = styled(View, {
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',

  '&:after': {
    content: ' ',
    display: 'block',
    width: '$loading',
    height: '$loading',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '50%',
    borderWidth: '$loadingWidth',
    borderStyle: 'solid',
    borderColor: '$accent transparent $accent transparent',
    // animation: `${rotate} 1.4s ease-in-out infinite`,
  },
});
