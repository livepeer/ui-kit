import {
  ClipButtonProps,
  useClipButton,
} from "@livepeer/core-react/components";
import { ClipLength, MediaControllerState, omit } from "@livepeer/core-web";
import { styling } from "@livepeer/core-web/media/browser/styling";

import { useMediaController } from "../../../../context";

const DefaultClipIcon = () => (
  <svg width="100%" height="100%" viewBox="-6 -6 36 36" focusable="false">
    <path
      fill="currentColor"
      d="M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z"
    ></path>
  </svg>
);

const mediaControllerSelector = ({
  live,
  requestClip,
  playbackId,
  clipStatus,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  live,
  requestClip,
  playbackId,
  clipStatus,
});

export type { ClipButtonProps, ClipLength };

export const ClipButton: React.FC<ClipButtonProps> = (props) => {
  const { live, requestClip, playbackId, clipStatus } = useMediaController(
    mediaControllerSelector,
  );

  const { buttonProps, title, isShown, status } = useClipButton({
    live,
    requestClip,
    playbackId,
    clipStatus,
    defaultIcon: <DefaultClipIcon />,
    ...props,
  });

  return isShown ? (
    <button
      style={{
        width: props.size,
        height: props.size,
      }}
      className={styling.iconButton.button()}
      title={title}
      aria-label={title}
      disabled={status === "loading"}
      onClick={buttonProps.onPress}
      {...omit(buttonProps, "onPress", "size")}
    />
  ) : (
    <></>
  );
};
