import {
  faBan,
  faEllipsisH,
  faExclamationTriangle,
  faFlag,
  faUserTimes,
  faVolumeMute,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Message } from "@pubnub/chat";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Define a type for the component's props
type MessageComponentProps = {
  timetoken: string;
  username: string;
  userId: string;
  message: Message;
  isUserFlagged: boolean;
  isMessageFlagged: boolean;
  isBroadcaster: boolean;
  flagCount: number;
  bannedUser:
    | {
        ban: boolean;
        mute: boolean;
        userId: string;
      }
    | undefined;
  banUser: (userId: string) => Promise<void>;
  unBanUser: (userId: string) => Promise<void>;
  unMuteUser: (userId: string) => Promise<void>;
  muteUser: (userId: string) => Promise<void>;
  flagUser: (userId: string) => Promise<void>;
  flagMessage: (message: Message) => Promise<void>;
};

// MessageComponent accepts props for title and content
const MessageComponent: React.FC<MessageComponentProps> = ({
  timetoken,
  username,
  userId,
  message,
  isUserFlagged,
  isMessageFlagged,
  isBroadcaster,
  flagCount,
  bannedUser,
  banUser,
  unBanUser,
  unMuteUser,
  muteUser,
  flagMessage,
  flagUser,
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div
        key={timetoken}
        className="flex flex-col rounded-lg px-3 py-2 border border-pubnub-white text-white group/item"
      >
        <div className="flex justify-between">
          <span className="text-xs font-medium">{username}</span>
          {isBroadcaster ? (
            <div className="flex flex-row">
              {isBroadcaster && flagCount > 0 && (
                <div className="flex flex-row items-center mr-2">
                  <span className="text-sm text-pubnub-white">{flagCount}</span>
                  <FontAwesomeIcon
                    icon={faFlag}
                    className="text-pubnub-yellow ml-1"
                  />
                </div>
              )}
              {!bannedUser?.ban && (
                <button
                  type="button"
                  className="flex shadow items-center justify-center bg-pubnub-dark text-pubnub-white p-2 rounded-sm mr-[5px] cursor-pointer"
                  onClick={() =>
                    bannedUser?.mute ? unMuteUser(userId) : muteUser(userId)
                  }
                >
                  {bannedUser?.mute ? (
                    <FontAwesomeIcon
                      icon={faVolumeMute}
                      className="h-4 w-4 text-pubnub-light-grey"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faVolumeOff}
                      className="h-4 w-4 text-pubnub-white"
                    />
                  )}
                </button>
              )}
              <button
                type="button"
                className="flex shadow items-center justify-center bg-pubnub-dark text-pubnub-white p-2 rounded-sm cursor-pointer"
                onClick={() =>
                  bannedUser?.ban ? unBanUser(userId) : banUser(userId)
                }
              >
                <FontAwesomeIcon
                  icon={faBan}
                  className={cn(
                    "h-4 w-4",
                    bannedUser?.ban ? "text-pubnub-red" : "text-pubnub-white",
                  )}
                />
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center">
              {isMessageFlagged && (
                <div className="p-2 justify-center">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className={cn("h-4 w-4 text-pubnub-yellow")}
                  />
                </div>
              )}
              {isUserFlagged && (
                <div className="p-2 justify-center">
                  <FontAwesomeIcon
                    icon={faUserTimes}
                    className={cn("h-4 w-4 text-pubnub-red")}
                  />
                </div>
              )}
              {!isMessageFlagged && !isUserFlagged && (
                <button
                  type="button"
                  className="flex shadow items-center justify-center bg-pubnub-dark text-pubnub-white p-2 rounded-sm cursor-pointer h-8"
                  onClick={() => {
                    setSelected(!selected);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisH}
                    className="h-4 w-4 text-pubnub-white"
                  />
                </button>
              )}
            </div>
          )}
        </div>
        {message.deleted ? (
          <div className="italic text-gray-500 text-sm">
            This message has been deleted.
          </div>
        ) : (
          <span className="text-sm">{message.content.text}</span>
        )}
      </div>
      {selected && !(isMessageFlagged && isUserFlagged) && (
        <div className="h-16 w-full border-l border-pubnub-white bg-pubnub-dark/20">
          {!isBroadcaster && (
            <div className="flex flex-row items-center justify-start space-x-4 p-4">
              {!isMessageFlagged && (
                <button
                  type="button"
                  onClick={() => flagMessage(message)}
                  className="h-8 pl-2 pr-2 border border-white/20 rounded-md text-white text-xs hover:bg-pubnub-dark transition-colors duration-150 ease-in-out"
                  title="Report Message"
                >
                  Report Message
                </button>
              )}
              {!isUserFlagged && (
                <button
                  type="button"
                  onClick={() => flagUser(userId)}
                  className="h-8 pl-2 pr-2 border border-white/20 rounded-md text-xs text-white hover:bg-pubnub-dark transition-colors duration-150 ease-in-out"
                  title="Report User"
                >
                  Report User
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
