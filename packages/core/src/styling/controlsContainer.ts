import { keyframes } from '@stitches/core';

import { isMobile } from '../media/browser';

import { loading } from './loading';
import { css } from './stitches';

const hidden = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const shown = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const sharedContainer = css('div', {
  variants: {
    display: {
      shown: {
        opacity: 1,
        animation: !isMobile() ? `${shown} 0.2s` : undefined,
      },
      hidden: {
        opacity: 0,
        animation: !isMobile() ? `${hidden} 0.2s` : undefined,
      },
    },
  },
  defaultVariants: {
    display: 'shown',
  },
});

const background = css(sharedContainer, {
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  height: '100%',
});

const gradient = css(sharedContainer, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 233,
  marginBottom: -1,
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  backgroundImage:
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADpCAYAAADlAl1mAAAAAXNSR0IArs4c6QAAAexJREFUOE9V0ftrzXEcx/H3x+43l9lmGGaz65ld2YUZG2YYKUlJUpKSpNZSkpSkJClJSVKSkj9Sj8/3nJ12fnie5/v9en/en+/3nIjik6rfNOU6YwfJqNGp0ctWGylSLavTqzNe72S9YYgGaYOysYJodKxJ2uSeZseaC4uUWpQt0lbWWlhEtFnVZv1O5RbSLkHGbifKiBR7XJnR7kS7dG+BSNlSh7TDvZ02d5rL6DLXxfYZriCiW69bbz+rIKUDyoyDW+hxB0RPpJQOCTIOb8cRZUavB+r1QCyOVpD6WJ97s/Wb67f5GINsMaA3YG6QDbIh7zZUWEQaNjesHHHRiB7EqLlRx0qsZKQkHdMb0zturopx5bhgwqoJJaRJNmnBlGBKj8W0YNq+GTbjFzrBqjipzJh1bNYxFnNsjs1bMF9YpFhgC3qnCkQkiNMMYlGwqDzDyoiIJc+35O85a66MFHFOmbHsjmVnM1Y884rgvLKClC4oIS5ux6pg1ZZLgow1v9pa2SIus4wrBVKkbFedhVhn67Zku2bBdcENr3CT3ZLe9oJ32F12T3DfCz7QewiP9B7b8kT5VPmMbVi6yZ7DCwtemnvFXrvoDXtr7p3gPXxQfhR8suqz8gv7Kv3mZb5Lf+j91PvFfsMf+Av//gMAXDGpZ05jKQAAAABJRU5ErkJggg==")',
});

const topContainer = css(sharedContainer, {
  top: 0,

  marginTop: '$controlsTopMarginY',
  marginBottom: '$controlsTopMarginY',
  marginLeft: '$controlsTopMarginX',
  marginRight: '$controlsTopMarginX',

  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'absolute',

  left: 0,
  right: 0,
});

const bottomContainer = css(sharedContainer, {
  justifyContent: 'center',
  bottom: 0,

  marginTop: '$controlsBottomMarginY',
  marginBottom: '$controlsBottomMarginY',
  marginLeft: '$controlsBottomMarginX',
  marginRight: '$controlsBottomMarginX',

  display: 'inline-flex',
  alignItems: 'center',

  position: 'absolute',
  flexDirection: 'column',
  left: 0,
  right: 0,
});

const spaceBetweenContainer = css('div', {
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const right = css(spaceBetweenContainer, { width: 'auto' });

const left = css(spaceBetweenContainer, {
  width: 'auto',
});

const loadingText = css(sharedContainer, {
  top: 0,
  userSelect: 'none',
  color: '$icon',

  marginTop: '$controlsTopMarginY',
  marginBottom: '$controlsTopMarginY',
  marginLeft: '$controlsTopMarginX',
  marginRight: '$controlsTopMarginX',

  display: 'inline-flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  position: 'absolute',

  fontSize: '$timeFontSizeSm',

  '@md': {
    fontSize: '$timeFontSizeMd',
  },
  '@lg': {
    fontSize: '$timeFontSize',
  },

  left: 0,
  right: 0,
  bottom: 0,
});

export const controlsContainer = {
  background,
  gradient,
  loading,
  loadingText,

  top: {
    container: topContainer,
  },
  bottom: {
    container: bottomContainer,
    middle: {
      container: spaceBetweenContainer,
    },
    lower: {
      container: spaceBetweenContainer,
      left,
      right,
    },
  },
};
