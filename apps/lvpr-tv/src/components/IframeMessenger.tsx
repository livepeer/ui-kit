"use client";

import { useEffect } from "react";
interface PlayerError {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: number;
}

function isAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    const port = url.port;

    if (
      hostname === "daydream.live" ||
      hostname === "vtuber.fun" ||
      hostname === "dev.vtuber.fun" ||
      (hostname === "localhost" && port === "3000")
    ) {
      return true;
    }

    if (
      hostname.endsWith(".livepeer.monster") ||
      hostname.endsWith(".livepeer.org") ||
      hostname.endsWith(".vercel.app")
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function isInIframe(): boolean {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function IframeMessenger() {
  useEffect(() => {
    if (!isInIframe()) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      //console.log("Received message from parent:", event.data);
    };

    const sendReady = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "lvpr-player-ready",
            timestamp: Date.now(),
          },
          "*",
        );
      }
    };

    const handlePlayerError = (error: ErrorEvent | PromiseRejectionEvent) => {
      if (window.parent && window.parent !== window) {
        const playerError: PlayerError = {
          message: "message" in error ? error.message : "Unknown error",
          timestamp: Date.now(),
        };

        if ("filename" in error) {
          playerError.details = {
            filename: error.filename,
            lineno: error.lineno,
            colno: error.colno,
          };
        }

        if ("reason" in error) {
          playerError.message =
            error.reason?.message || "Unhandled promise rejection";
          playerError.details = error.reason;
        }

        window.parent.postMessage(
          {
            type: "lvpr-player-error",
            error: playerError,
          },
          "*",
        );
      }
    };

    const handlePlayerEvent = (event: CustomEvent) => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "lvpr-player-event",
            eventType: event.type,
            data: event.detail,
            timestamp: Date.now(),
          },
          "*",
        );
      }
    };

    window.addEventListener("message", handleMessage);

    window.addEventListener("error", handlePlayerError);

    window.addEventListener("unhandledrejection", handlePlayerError);

    window.addEventListener(
      "lvpr-player-error",
      handlePlayerEvent as EventListener,
    );
    window.addEventListener(
      "lvpr-player-offline",
      handlePlayerEvent as EventListener,
    );
    window.addEventListener(
      "lvpr-player-access-control",
      handlePlayerEvent as EventListener,
    );

    sendReady();

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("error", handlePlayerError);
      window.removeEventListener("unhandledrejection", handlePlayerError);
      window.removeEventListener(
        "lvpr-player-error",
        handlePlayerEvent as EventListener,
      );
      window.removeEventListener(
        "lvpr-player-offline",
        handlePlayerEvent as EventListener,
      );
      window.removeEventListener(
        "lvpr-player-access-control",
        handlePlayerEvent as EventListener,
      );
    };
  }, []);

  return null;
}
