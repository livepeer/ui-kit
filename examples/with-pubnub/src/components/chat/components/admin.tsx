import type { Message, User } from "@pubnub/chat";
import type React from "react";
import type { SetStateAction } from "react";
import FlaggedMessageCard from "./cards/flagged-message-card";
import FlaggedUserCard from "./cards/flagged-user-card";
import RestrictedUserCard from "./cards/restricted-user-card";
import Dropdown from "./dropdown";

type AdminProps = {
  bannedUsers: {
    ban: boolean;
    mute: boolean;
    userId: string;
  }[];
  flaggedUsers: string[];
  flaggedMessages: string[];
  storedUsers: Map<string, User>;
  chatMessages: Message[];
  deleteMessage: (messageToDelete: Message) => Promise<void>;
  restoreMessage: (messageToRestore: Message) => Promise<void>;
  setIsModalOpen: (value: SetStateAction<boolean>) => void;
};

const Admin: React.FC<AdminProps> = ({
  bannedUsers,
  flaggedUsers,
  flaggedMessages,
  storedUsers,
  chatMessages,
  deleteMessage,
  restoreMessage,
  setIsModalOpen,
}) => {
  return (
    <div className="h-96 bg-pubnub-dark">
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <Dropdown title="Restricted Users">
          {bannedUsers.map((user) => {
            const userDetails = storedUsers.get(user.userId);

            return (
              <div key={user.userId}>
                {userDetails && (user.ban || user.mute) && (
                  <RestrictedUserCard
                    key={user.userId}
                    userId={user.userId}
                    name={userDetails.name ?? ""}
                    ban={user.ban}
                    mute={user.mute}
                  />
                )}
              </div>
            );
          })}
        </Dropdown>
        <Dropdown title="Flagged Users">
          {Array.from(new Set(flaggedUsers))
            .sort(
              (a, b) =>
                flaggedUsers.filter((v) => v === b).length -
                flaggedUsers.filter((v) => v === a).length,
            )
            .map((userId) => {
              const user = bannedUsers.find((user) => user.userId === userId);
              const flagCount = flaggedUsers.filter(
                (id) => id === userId,
              ).length;

              const userDetails = storedUsers.get(user?.userId ?? "");

              return (
                <div key={userId}>
                  {user && userDetails && (
                    <FlaggedUserCard
                      userId={user.userId}
                      name={userDetails.name ?? ""}
                      ban={user.ban}
                      mute={user.mute}
                      flagCount={flagCount}
                    />
                  )}
                </div>
              );
            })}
        </Dropdown>
        <Dropdown key="Flagged Messages" title="Flagged Messages">
          {Array.from(new Set(flaggedMessages))
            .sort(
              (a, b) =>
                flaggedMessages.filter((v) => v === b).length -
                flaggedMessages.filter((v) => v === a).length,
            )
            .map((timetoken) => {
              const message = chatMessages.find(
                (message) => message.timetoken === timetoken,
              );
              const flagCount = flaggedMessages.filter(
                (id) => id === timetoken,
              ).length;
              const user = bannedUsers.find(
                (user) => user.userId === message?.userId,
              );

              const userDetails = storedUsers.get(message?.userId ?? "");

              return (
                <div key={timetoken}>
                  {message && userDetails && (
                    <FlaggedMessageCard
                      userId={userDetails.id}
                      name={userDetails.name ?? ""}
                      ban={user?.ban ?? false}
                      mute={user?.mute ?? false}
                      flagCount={flagCount}
                      message={message}
                      deleteMessage={deleteMessage}
                      restoreMessage={restoreMessage}
                    />
                  )}
                </div>
              );
            })}
        </Dropdown>
      </div>
      <div className="px-4 py-4 px-6 flex flex-row-reverse">
        <button
          onClick={() => setIsModalOpen(false)}
          type="button"
          className="bg-pubnub-red w-8 inline-flex justify-center rounded-md shadow-sm px-4 py-2 ml-3 text-base font-medium text-pubnub-white hover:bg-pubnub-red/80 ml-0 mr-3 w-auto text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Admin;
