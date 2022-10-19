import { isClient } from '../browser';

const methodsList = [
  // Modern Browsers
  {
    // request picture in picture
    requestPictureInPicture: 'requestPictureInPicture',
    // exit picture in picture
    exitPictureInPicture: 'exitPictureInPicture',
    // enter picture in picture - listener
    enterPictureInPicture: 'enterpictureinpicture',
    // leave picture in picture - listener
    leavePictureInPicture: 'leavepictureinpicture',
    // picture in picture element
    pictureInPictureElement: 'pictureInPictureElement',
    // picture in picture enabled
    pictureInPictureEnabled: 'pictureInPictureEnabled',
  },
] as const;

export const isPictureInPictureSupported = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods, element } = getPictureInPictureMethods(inputElement);

  if (methods) {
    return (
      document[methods.pictureInPictureEnabled] &&
      element?.disablePictureInPicture === false
    );
  }

  return false;
};

export const isCurrentlyPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods, element } = getPictureInPictureMethods(inputElement);

  if (methods) {
    return document[methods.pictureInPictureElement] === element;
  }

  return false;
};

export const enterPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods, element } = getPictureInPictureMethods(inputElement);
  if (methods) {
    const returnPromise = element?.[methods.requestPictureInPicture]?.();

    if (returnPromise instanceof Promise) {
      return returnPromise;
    }
  }

  return false;
};

export const exitPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods } = getPictureInPictureMethods(inputElement);

  if (methods) {
    const returnPromise = document[methods.exitPictureInPicture]?.();

    if (returnPromise instanceof Promise) {
      return returnPromise;
    }
  }

  return false;
};

export const addPictureInPictureEventListener = (
  callback: EventListenerOrEventListenerObject,
) => {
  const { methods } = getPictureInPictureMethods();

  if (methods) {
    document.addEventListener(methods.enterPictureInPicture, callback, false);

    return () => {
      removePictureInPictureEventListeners(callback);
    };
  }

  return null;
};

const removePictureInPictureEventListeners = (
  callback: EventListenerOrEventListenerObject,
) => {
  const { methods } = getPictureInPictureMethods();

  if (methods) {
    // Remove the listener for the picture in picture event (that we used on addPictureInPictureEventListener)
    document.removeEventListener(
      methods.enterPictureInPicture,
      callback,
      false,
    );

    return true;
  }

  return false;
};

const getPictureInPictureMethods = (element?: HTMLMediaElement | null) => {
  if (isClient()) {
    for (const methods of methodsList) {
      const exitPictureInPictureMethod = methods.exitPictureInPicture;

      if (exitPictureInPictureMethod in document) {
        return { methods, element: element as HTMLVideoElement };
      }
    }
  }

  return { methods: null };
};
