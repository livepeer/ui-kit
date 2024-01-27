import { isClient } from "../utils";

export const isPictureInPictureSupported = (
  element?: HTMLMediaElement | null,
) => {
  if (typeof document === "undefined") {
    return true;
  }

  const videoElement = element ?? document.createElement("video");

  const { apiType } = getPictureInPictureMode(videoElement);

  return Boolean(apiType);
};

export const isCurrentlyPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { apiType, element } = getPictureInPictureMode(inputElement);

  if (apiType === "w3c") {
    return Boolean(document?.pictureInPictureElement);
  }
  if (apiType === "webkit") {
    return element?.webkitPresentationMode === "picture-in-picture";
  }

  return false;
};

export const enterPictureInPicture = async (
  inputElement?: HTMLMediaElement | null,
) => {
  const { apiType, element } = getPictureInPictureMode(inputElement);

  try {
    if (apiType === "w3c") {
      await element?.requestPictureInPicture?.();
    } else if (apiType === "webkit") {
      await element?.webkitSetPresentationMode?.("picture-in-picture");
    }
  } catch (e) {
    console.warn(e);
  }

  return null;
};

export const exitPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { apiType, element } = getPictureInPictureMode(inputElement);

  if (apiType === "w3c") {
    return document?.exitPictureInPicture?.() ?? null;
  }
  if (apiType === "webkit") {
    return element?.webkitSetPresentationMode?.("inline") ?? null;
  }

  return null;
};

export const addEnterPictureInPictureEventListener = (
  inputElement: HTMLMediaElement | null,
  callback: EventListener,
) => {
  const { apiType, element } = getPictureInPictureMode(inputElement);

  if (apiType === "w3c" && element) {
    element.addEventListener("enterpictureinpicture", callback, false);

    return () => {
      element.removeEventListener("enterpictureinpicture", callback, false);
    };
  }

  if (apiType === "webkit" && element) {
    const callbackComposed = (e: Event) => {
      if (element?.webkitPresentationMode === "picture-in-picture") {
        callback?.(e);
      }
    };

    document.addEventListener(
      "webkitpresentationmodechanged",
      callbackComposed,
      false,
    );

    return () => {
      document.removeEventListener(
        "webkitpresentationmodechanged",
        callbackComposed,
        false,
      );
    };
  }

  return null;
};

export const addExitPictureInPictureEventListener = (
  inputElement: HTMLMediaElement | null,
  callback: EventListener,
) => {
  const { apiType, element } = getPictureInPictureMode(inputElement);

  if (apiType === "w3c" && element) {
    element.addEventListener("leavepictureinpicture", callback, false);

    return () => {
      element.removeEventListener("leavepictureinpicture", callback, false);
    };
  }

  if (apiType === "webkit" && element) {
    const callbackComposed = (e: Event) => {
      if (element?.webkitPresentationMode === "inline") {
        callback?.(e);
      }
    };

    document.addEventListener(
      "webkitpresentationmodechanged",
      callbackComposed,
      false,
    );

    return () => {
      document.removeEventListener(
        "webkitpresentationmodechanged",
        callbackComposed,
        false,
      );
    };
  }

  return null;
};

const getPictureInPictureMode = (element?: HTMLMediaElement | null) => {
  if (isClient() && element instanceof HTMLVideoElement) {
    // we disable the next line since we handle missing Safari versions in the next statement
    if (document?.pictureInPictureEnabled) {
      return { apiType: "w3c", element } as const;
    }

    // fallback to trying webkit
    if (element?.webkitSupportsPresentationMode?.("picture-in-picture")) {
      return { apiType: "webkit", element } as const;
    }
  }

  return { apiType: null };
};
