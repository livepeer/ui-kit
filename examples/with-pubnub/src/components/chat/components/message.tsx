import type { Message } from "@pubnub/chat";
import type React from "react";
import { useState } from "react";

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
  const [onHover, setOnHover] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div
        key={timetoken}
        className="flex flex-col rounded-lg px-3 py-2 border border-white/20 text-white group/item hover:bg-neutral-900 cursor-pointer"
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
        onClick={() => setSelected(!selected)}
        onKeyPress={(event) => {
          // Check if the Enter key or Space key was pressed
          if (event.key === "Enter" || event.key === " ") {
            setSelected(!selected);
          }
        }}
      >
        <div className="flex justify-between">
          <span className="text-xs font-medium">{username}</span>
          {!onHover && (
            <div className="p-2">
              <div className="w-4 h-4" />
            </div>
          )}
          {onHover && (
            <div>
              <span className="block p-2">
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    selected ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Message Arrow</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                    aria-label="message-arrow"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
        <span className="text-sm">{message.content.text}</span>
        {isBroadcaster && flagCount > 0 && (
          <span className="text-xs font-light">{`Flagged ${flagCount} time(s)`}</span>
        )}
      </div>
      {selected && (
        <div className="h-16 w-full border-l border-white/20 bg-neutral-900">
          {isBroadcaster && (
            <div className="flex flex-row items-center justify-start space-x-4 p-4">
              {bannedUser?.ban ? (
                <button
                  type="button"
                  onClick={() => unBanUser(userId)}
                  className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
                  title="Unban User"
                >
                  Unban
                </button>
              ) : (
                <>
                  {bannedUser?.mute ? (
                    <button
                      type="button"
                      onClick={() => unMuteUser(userId)}
                      className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
                      title="Unmute User"
                    >
                      Unmute
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => muteUser(userId)}
                      className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
                      title="Mute User"
                    >
                      Mute
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => banUser(userId)}
                    className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
                    title="Ban User"
                  >
                    Ban
                  </button>
                </>
              )}
            </div>
          )}
          {!isBroadcaster && (
            <div className="flex flex-row items-center justify-start space-x-4 p-4">
              {isMessageFlagged ? (
                <span>Message has been reported</span>
              ) : (
                <button
                  type="button"
                  onClick={() => flagMessage(message)}
                  className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
                  title="Report Message"
                >
                  Report Message
                </button>
              )}
              {isUserFlagged ? (
                <span>User has been reported</span>
              ) : (
                <button
                  type="button"
                  onClick={() => flagUser(userId)}
                  className="h-8 pl-4 pr-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition-colors duration-150 ease-in-out"
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
