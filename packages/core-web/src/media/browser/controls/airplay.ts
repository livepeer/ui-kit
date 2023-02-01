export const requestAirPlay = (element: HTMLMediaElement) => {
  if (element) {
    element.webkitShowPlaybackTargetPicker();
  }
};
