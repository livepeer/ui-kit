// import { loading } from './loading';
import { Image, View } from 'react-native';

import { styled } from './stitches';

const SharedContainer = styled(View, {
  variants: {
    display: {
      shown: {
        opacity: 1,
        // animation: !isMobile() ? `${shown} 0.2s` : undefined,
      },
      hidden: {
        opacity: 0,
        // animation: !isMobile() ? `${hidden} 0.2s` : undefined,
      },
    },
  },
  defaultVariants: {
    display: 'shown',
  },
});

export const Background = styled(SharedContainer, {
  position: 'absolute',
  // display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  height: '100%',
});

export const Gradient = styled(SharedContainer, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
});

export const GradientImage = styled(Image, {
  width: '100%',
  height: '100%',
});

export const TopContainer = styled(SharedContainer, {
  top: 0,

  marginTop: '$controlsTopMarginY',
  marginBottom: '$controlsTopMarginY',
  marginLeft: '$controlsTopMarginX',
  marginRight: '$controlsTopMarginX',

  // display: 'inline-flex',

  justifyContent: 'space-between',
  position: 'absolute',

  left: 0,
  right: 0,
});

export const BottomContainer = styled(SharedContainer, {
  justifyContent: 'center',
  bottom: 0,

  marginTop: '$controlsBottomMarginY',
  marginBottom: '$controlsBottomMarginY',
  marginLeft: '$controlsBottomMarginX',
  marginRight: '$controlsBottomMarginX',

  // display: 'inline-flex',
  alignItems: 'center',

  position: 'absolute',
  flexDirection: 'column',
  left: 0,
  right: 0,
});

export const SpaceBetweenContainer = styled(View, {
  width: '100%',
  flexDirection: 'row',
  // display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const Right = styled(SpaceBetweenContainer, { width: 'auto' });

export const Left = styled(SpaceBetweenContainer, {
  width: 'auto',
});

export const LoadingText = styled(SharedContainer, {
  top: 0,
  userSelect: 'none',
  color: '$icon',

  marginTop: '$controlsTopMarginY',
  marginBottom: '$controlsTopMarginY',
  marginLeft: '$controlsTopMarginX',
  marginRight: '$controlsTopMarginX',

  // display: 'inline-flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  position: 'absolute',

  // fontSize: '$timeFontSizeSm',

  // '@md': {
  //   fontSize: '$timeFontSizeMd',
  // },
  // '@lg': {
  //   fontSize: '$timeFontSize',
  // },

  left: 0,
  right: 0,
  bottom: 0,
});

// export const controlsContainer = {
//   background,
//   gradient,
//   // loading,
//   loadingText,

//   top: {
//     container: topContainer,
//   },
//   bottom: {
//     container: bottomContainer,
//     middle: {
//       container: spaceBetweenContainer,
//     },
//     lower: {
//       container: spaceBetweenContainer,
//       left,
//       right,
//     },
//   },
// };
