import { cn } from "@/lib/utils";
import { faBan, faFlag, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Message } from "@pubnub/chat";
import type React from "react";

interface FlaggedMessageCardProps {
  userId: string;
  name: string;
  ban: boolean;
  mute: boolean;
  flagCount: number;
  message: Message;
  deleteMessage: (messageToDelete: Message) => Promise<void>;
  restoreMessage: (messageToRestore: Message) => Promise<void>;
}

const FlaggedMessageCard: React.FC<FlaggedMessageCardProps> = ({
  userId,
  name,
  ban,
  mute,
  flagCount,
  message,
  deleteMessage,
  restoreMessage,
}) => {
  return (
    <div
      className={cn(
        "shadow overflow-hidden rounded-lg p-4 mb-2 flex justify-between items-center",
        message.deleted ? "bg-pubnub-dark-grey/20" : "pubnub-dark",
      )}
      key={userId}
    >
      <div>
        <p className="text-md text-pubnub-white font-medium text-gray-900 overflow-hidden whitespace-nowrap overflow-ellipsis">
          {name}
        </p>
        <p className="text-xs text-pubnub-light-grey">{message.content.text}</p>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex flex-row items-center min-w-[100px] justify-end">
          {ban && (
            <div className="tooltip" data-tip="Banned">
              <FontAwesomeIcon icon={faBan} className="text-pubnub-red ml-2" />
            </div>
          )}
          {mute && (
            <div className="tooltip" data-tip="Muted">
              <FontAwesomeIcon
                icon={faVolumeMute}
                className="text-pubnub-light-grey ml-2"
              />
            </div>
          )}
          {flagCount > 0 && (
            <div className="tooltip" data-tip={`Flagged ${flagCount} times`}>
              <FontAwesomeIcon
                icon={faFlag}
                className="text-pubnub-yellow ml-2"
              />
              <span className="text-pubnub-white ml-1">{flagCount}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            message.deleted ? restoreMessage(message) : deleteMessage(message)
          }
          className="h-8 pl-2 pr-2 border border-white/20 rounded-md text-white text-xs hover:bg-pubnub-dark transition-colors duration-150 ease-in-out mt-2"
          title="Report Message"
        >
          {message.deleted ? "Restore Message" : "Delete Message"}
        </button>
      </div>
    </div>
  );
};

export default FlaggedMessageCard;
