import { ActivityIndicator } from 'react-native';

import { styled } from './stitches';

export const Loading = styled(ActivityIndicator, {
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});
