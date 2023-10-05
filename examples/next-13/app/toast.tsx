import { keyframes, styled } from '@livepeer/design-system';
import * as Toast from '@radix-ui/react-toast';

const VIEWPORT_Y_PADDING = 50;
const VIEWPORT_X_PADDING = 15;

export const ToastProvider = Toast.Provider;

export const ToastViewport = styled(Toast.Viewport, {
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: VIEWPORT_Y_PADDING,
  paddingRight: VIEWPORT_X_PADDING,
  gap: 10,
  width: 320,
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
  outline: 'none',
});

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_X_PADDING}px))` },
  to: { transform: 'translateX(0)' },
});

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_X_PADDING}px))` },
});

export const ToastRoot = styled(Toast.Root, {
  backgroundColor: '$gray12',
  borderRadius: 6,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  padding: 15,
  display: 'grid',
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: 'auto max-content',
  columnGap: 15,
  alignItems: 'center',

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} 100ms ease-in`,
  },
  '&[data-swipe="move"]': {
    transform: 'translateX(var(--radix-toast-swipe-move-x))',
  },
  '&[data-swipe="cancel"]': {
    transform: 'translateX(0)',
    transition: 'transform 200ms ease-out',
  },
  '&[data-swipe="end"]': {
    animation: `${swipeOut} 100ms ease-out`,
  },
});

export const ToastTitle = styled(Toast.Title, {
  gridArea: 'title',
  marginBottom: 5,
  fontWeight: 500,
  color: '$gray1',
  fontSize: 15,
});

export const ToastDescription = styled(Toast.Description, {
  gridArea: 'description',
  margin: 0,
  color: '$gray1',
  fontSize: 13,
  lineHeight: 1.3,
});

export const ToastAction = styled(Toast.Action, {
  gridArea: 'action',
});
