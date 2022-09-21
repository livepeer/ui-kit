import { loading } from './loading';
import { css } from './stitches';

const sharedContainer = css('div', {
  variants: {
    visibility: {
      hidden: {
        display: 'none',
      },
      shown: {},
    },
  },
  defaultVariants: {
    visibility: 'shown',
  },
});

const background = css('div', {
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

const container = css(sharedContainer, {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,

  marginTop: '$controlsMarginY',
  marginBottom: '$controlsMarginY',
  marginLeft: '$controlsMarginX',
  marginRight: '$controlsMarginX',
});

const upperContainer = css('div', {
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const lowerContainer = css(upperContainer, {});

const right = css(lowerContainer, { width: 'auto' });

const left = css(lowerContainer, {
  width: 'auto',
});

export const controlsContainer = {
  background,
  gradient,
  loading,

  bottom: {
    container,
    upper: {
      container: upperContainer,
    },
    lower: {
      container: lowerContainer,
      left,
      right,
    },
  },
};
