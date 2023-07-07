import { keyframes } from '@stitches/core';

import { css } from './stitches';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const overlay = css('div', {
  backgroundColor: 'hsla(0, 0%, 0%, 0.439)',
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const content = css('div', {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',

  backgroundColor: 'white',
  color: 'black',
  borderRadius: 6,
  display: 'inline-flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '350px',
  maxWidth: '85%',
  maxHeight: '85vh',
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': { outline: 'none' },
});

const title = css('span', {
  margin: 0,
  fontWeight: 600,
  color: 'black',
  fontSize: 20,
  marginBottom: 12,
});

const close = css('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 20,
  width: 20,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 10,
  right: 10,
  cursor: 'pointer',
});

const selectGroup = css('div', {
  display: 'inline-flex',
  flexDirection: 'column',
  gap: 8,
});

const selectTrigger = css('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  gap: 5,
  backgroundColor: 'white',
  color: 'black',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'black',
  boxShadow: `0 2px 10px hsla(0, 0%, 0%, 0.141)`,
  '&:hover': { backgroundColor: 'hsl(294, 5.5%, 95.3%)' },
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-placeholder]': { color: 'hsl(0, 0%, 9.0%)' },
});

const selectLabel = css('span', {
  fontSize: 16,
  fontWeight: 600,
});

const selectIcon = css('span', {});

const selectContent = css('div', {
  overflow: 'hidden',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 6,

  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'black',

  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
});

const selectViewport = css('div', {
  padding: 5,
});

const selectItem = css('div', {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',

  fontSize: 13,
  lineHeight: 1,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '10px 35px 10px 30px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: '#fafafa',
  },
});

const selectItemIndicator = css('div', {
  position: 'absolute',
  left: 4,
  width: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const settings = {
  overlay,
  content,
  title,
  close,

  select: {
    content: selectContent,
    group: selectGroup,
    label: selectLabel,
    icon: selectIcon,
    item: selectItem,
    itemIndicator: selectItemIndicator,
    trigger: selectTrigger,
    viewport: selectViewport,
  },
};
