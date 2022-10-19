import { isClient } from '../browser';

const methodsList = [
  // Modern Browsers
  {
    // request picture in picture
    requestPictureInPicture: 'requestPictureInPicture',
    // exit picture in picture
    exitPictureInPicture: 'exitPictureInPicture',
    // picture in picture element
    pictureInPictureElement: 'pictureInPictureElement',
    // picture in picture enabled
    pictureInPictureEnabled: 'pictureInPictureEnabled',
  },
] as const;

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

export const addPictureInPictureEventListener = (
  callback: EventListenerOrEventListenerObject,
) => {
  const { methods } = getPictureInPictureMethods();

  if (methods) {
    document.addEventListener(methods.exitPictureInPicture, callback, false);

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
    document.removeEventListener(methods.exitPictureInPicture, callback, false);

    return true;
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
export const isCurrentlyPictureInPicture = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods, element } = getPictureInPictureMethods(inputElement);

  if (methods) {
    return document[methods.pictureInPictureElement] === element;
  }

  return false;
};

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
