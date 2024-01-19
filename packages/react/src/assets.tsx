import React from "react";

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path d="M320-200v-560l440 280-440 280Z" fill="currentColor" />
  </svg>
);

export const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"
      fill="currentColor"
    />
  </svg>
);

export const EnterFullscreenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
      fill="currentColor"
    />
  </svg>
);

export const ExitFullscreenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"
    />
  </svg>
);

export const PictureInPictureIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z"
    />
  </svg>
);
