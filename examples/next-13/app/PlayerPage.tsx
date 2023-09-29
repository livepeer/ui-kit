'use client';

import { Button } from '@livepeer/design-system';
import { Asset, Player, PlayerProps } from '@livepeer/react';
import * as Popover from '@radix-ui/react-popover';

import mux from 'mux-embed';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from './toast';

function isIframe() {
  try {
    return window.self !== window.top;
  } catch {
    // do nothing here
  }
  try {
    return window.self !== window.parent;
  } catch {
    // do nothing here
  }
  // default to true as this is only used to set a transparent background
  return true;
}

const controls = {
  defaultVolume: 0.7,
};

export default (props: PlayerProps<object, any>) => {
  const [open, setOpen] = useState(false);
  const [clipPlaybackId, setClipPlaybackId] = useState<string | null>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!isIframe()) {
      document.body.style.backgroundColor = 'black';
    }
  }, []);

  const onClipCreated = useCallback((asset: Asset) => {
    setOpen(false);
    window?.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setClipPlaybackId(asset.playbackId ?? null);
      setOpen(true);
    }, 100);
  }, []);

  const theme = useMemo(
    () => ({
      radii: {
        containerBorderRadius: '0px',
      },
    }),
    [],
  );

  const mediaElementRef = useCallback((element: HTMLMediaElement) => {
    mux.monitor(element, {
      debug: false,
      data: {
        env_key: '8oj27fenun6v4ffvrgn6ehc7m',
        player_name: 'Livepeer.TV Player v2',
        player_env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
      },
    });
  }, []);

  return (
    <ToastProvider swipeDirection="right">
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Player
          {...props}
          src={props?.src}
          showPipButton
          priority
          theme={theme}
          clipLength={30}
          onClipCreated={onClipCreated}
          controls={controls}
          mediaElementRef={mediaElementRef}
        />
      </div>
      {props?.playbackInfo?.meta?.attestation && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              userSelect: 'none',
            }}
          >
            <Popover.Root>
              <Popover.Trigger asChild>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  style={{
                    backgroundColor: 'hsl(0, 0%, 11.0%)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: 8,
                    outline: 0,
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      userSelect: 'none',
                      fontFamily: 'Helvetica',
                      minWidth: 200,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8em',
                        fontWeight: 400,
                        marginBottom: 10,
                      }}
                    >
                      ATTESTATIONS
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        gap: 4,
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.8em',
                            fontWeight: 400,
                            color: 'rgb(153, 162, 158)',
                          }}
                        >
                          Date:
                        </span>
                        <span
                          style={{
                            fontSize: '0.8em',
                            fontWeight: 600,
                          }}
                        >
                          {new Date(
                            props?.playbackInfo?.meta?.attestation.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {props?.playbackInfo?.meta?.attestation.message.attestations.map(
                        (attestation) => (
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.8em',
                                fontWeight: 400,
                                color: 'rgb(153, 162, 158)',
                              }}
                            >
                              {attestation.role === 'creator'
                                ? 'Creator'
                                : attestation.role}
                              :
                            </span>
                            <span
                              style={{
                                fontSize: '0.8em',
                                fontWeight: 600,
                              }}
                            >
                              {shortenAddress(attestation.address)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <Popover.Arrow style={{ fill: '#232323' }} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      )}
      <ToastRoot open={open} onOpenChange={setOpen}>
        <ToastTitle>Livestream clipped</ToastTitle>
        <ToastDescription>Your clip has been created.</ToastDescription>
        <ToastAction asChild altText="Open clip in new tab">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/?v=${clipPlaybackId}`}
          >
            <Button size="1">Open in new tab</Button>
          </a>
        </ToastAction>
      </ToastRoot>
      <ToastViewport />
    </ToastProvider>
  );
};

function shortenAddress(address: string, front = 6, back = 4) {
  if (!address) {
    return '';
  }

  return `${address.slice(0, front + 2)}...${address.slice(-back)}`;
}
