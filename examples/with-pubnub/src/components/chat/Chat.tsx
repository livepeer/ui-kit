"use client";

import { initPubNub } from "@/lib/pubnub";
import { cn } from "@/lib/utils";
import {
  type Channel,
  type Message,
  type Chat as PubNubChat,
  User,
} from "@pubnub/chat";
import { SendHorizontal } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import MessageComponent from "./components/message";
import ChatSignIn from "./components/sign-in";

const adminUserId = "admin"; // predefined admin user id
const adminUserName = "Admin"; // replace with the actual admin name

export const Chat = ({ playbackId }: { playbackId: string }) => {
  const [isBroadcaster, setIsBroadcaster] = useState(false);
  const [username, setUsername] = useState("");
  const [userSubmitted, setUserSubmitted] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [storedUsers, setStoredUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [disconnect, setDisconnect] = useState<(() => void) | undefined>();
  const [presenceConnect, setPresenceConnect] = useState<
    (() => void) | undefined
  >();
  const [isInitFinished, setInitFinished] = useState(false);
  const [endTimetoken, setEndTimetoken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Add states for flagged messages and users
  const [flaggedMessages, setFlaggedMessages] = useState<string[]>([]);
  const [flaggedUsers, setFlaggedUsers] = useState<string[]>([]);

  // Add states for banned users and modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bannedUsers, setBannedUsers] = useState<
    Array<{ ban: boolean; mute: boolean; userId: string }>
  >([]);

  const [isUserMuted, setMuteStatus] = useState(false);
  const [isUserBanned, setBanStatus] = useState(false);

  const [presenceCount, setPresenceCount] = useState<number>(0);

  // Store the input's value for chat message.
  const [inputMessage, setInputMessage] = useState<string>("");
  const channelRef = useRef<Channel>();
  const chatRef = useRef<PubNubChat>();
  const userRef = useRef<User>();
  const initDoneRef = useRef(false);

  useEffect(() => {
    if (initDoneRef.current) {
      console.log("Initialization already done. Skipping...");
      return;
    }

    // Determine if the user is the broadcaster based on the URL path
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const broadcaster = path === "/"; // include your desired paths here

      setIsBroadcaster(broadcaster);
      if (broadcaster) {
        setUsername(adminUserName);
        setUserSubmitted(true);
      }
    }

    initDoneRef.current = true;
  }, []);

  useEffect(() => {
    async function initChat() {
      let chat: PubNubChat | undefined;
      try {
        chat = await initPubNub(
          window.location.pathname === "/"
            ? adminUserId
            : `user_${Math.floor(Math.random() * 1000)}_${Date.now()}`,
        );
        chatRef.current = chat;
      } catch (error) {
        console.log(`Failed to create PubNub Instance: ${error}`);
      }

      if (chatRef.current !== null && chatRef.current !== undefined) {
        // Create a user when Chat initializes, using the unique UUID
        try {
          const createdUser = await chatRef.current.currentUser.update({
            name: window.location.pathname === "/" ? adminUserName : username,
          });
          userRef.current = createdUser;
        } catch (error) {
          console.error(`Failed to create user: ${error}`);
        }
      }
      setInitFinished(true);
    }
    if (userSubmitted) {
      initChat();
    }
  }, [userSubmitted, username]);

  useEffect(() => {
    async function init() {
      let channel: Channel | null | undefined;
      if (isInitFinished) {
        try {
          channel = await chatRef.current?.getChannel(playbackId);
        } catch (error) {
          console.log(`Failed to GET channel: ${error}`);
        }
        if (channel !== null && channel !== undefined) {
          channelRef.current = channel;
          // channel can not be undefined here
          const { disconnect: disconnectFunc } = await (
            channel as Channel
          ).join((message: Message) => {
            // A simple callback function that adds incoming messages
            // to the chatMessages state
            (chatRef.current as PubNubChat)
              .getUser(message.userId)
              .then((user: User | null) => {
                setChatMessages((prevMessages) => [...prevMessages, message]);
              })
              .catch((err) => console.error(`Failed to get user: ${err}`));
          });

          const streamPresence = await (channel as Channel).streamPresence(
            (userIds: string[]) => {
              setPresenceCount(userIds.length);
            },
          );

          setDisconnect(() => disconnectFunc);
          setPresenceConnect(() => streamPresence);

          moderationListeners();
          await fetchHistory(channel);
          await getRestrictedUsers();
        } else {
          const newChannel = await (
            chatRef.current as PubNubChat
          ).createPublicConversation({
            channelId: playbackId,
            channelData: {
              name: `Group Chat - ${playbackId}`,
              description: "Group chat for stream viewers.",
            },
          });
          channelRef.current = newChannel;
        }
      } else {
        if (chatRef.current === null) console.log("[CHAT IS UNDEFINED]");
        if (userRef.current === null) console.log("[USER IS UNDEFINED]");
      }

      setLoading(false);
    }

    init();

    return () => {
      // runs when the component unmounts
      disconnect?.(); // leave channel, if the function exists
      presenceConnect?.();
    };
  }, [playbackId, disconnect, presenceConnect, isInitFinished]);

  const fetchHistory = async (channel: Channel) => {
    if (!hasMore) return;
    const histStart = endTimetoken;
    const history = await channel?.getHistory({
      startTimetoken: histStart ?? "",
      count: 30,
    });

    setHasMore(history.isMore);
    if (history.messages.length !== 0) {
      // Collect all unique user IDs from the messages
      const uniqueUserIds = Array.from(
        new Set(history.messages.map((message) => message.userId)),
      );

      // Prepare a list of user IDs for which user details need to be fetched
      const userIdsToFetch = uniqueUserIds.filter(
        (userId) => !storedUsers.has(userId),
      );

      // Fetch details only for users not already in the cache
      const fetchUserDetailsPromises = userIdsToFetch.map(async (userId) => {
        const userDetails = await chatRef.current?.getUser(userId);
        // Update the cache as soon as user details are fetched
        return userDetails ?? new User();
      });

      // Wait for all the user details to be fetched and cached
      Promise.all(fetchUserDetailsPromises).then((users: User[]) => {
        const newStoredUsers = new Map(storedUsers);
        for (const user of users) {
          newStoredUsers.set(user.id, user);
        }
        setStoredUsers(newStoredUsers);

        // Update chat messages with enriched data
        setChatMessages((prevMessages) => [
          ...prevMessages,
          ...history.messages,
        ]);

        // Set the timetoken for the next fetch
        setEndTimetoken(history.messages[0].timetoken);
      });
    }
  };

  const getRestrictedUsers = async () => {
    try {
      const { restrictions } = await (
        channelRef.current as Channel
      ).getUsersRestrictions();
      // store the list of users who are banned
      setBannedUsers(restrictions);
    } catch (error) {
      console.error(`Failed to get restricted users: ${error}`);
    }
  };

  const moderationListeners = () => {
    // Start listening for report events
    if (isBroadcaster) {
      (chatRef.current as PubNubChat)?.listenForEvents({
        channel: "PUBNUB_INTERNAL_ADMIN_CHANNEL",
        type: "report",
        callback: async (event) => {
          const messageTimeToken: string | null = event.payload
            ?.reportedMessageTimetoken
            ? event.payload?.reportedMessageTimetoken
            : null;
          const userID: string = event.payload.reportedUserId;

          if (messageTimeToken) {
            setFlaggedMessages((prevFlaggedMessages) => [
              ...prevFlaggedMessages,
              messageTimeToken ?? "",
            ]);
          } else {
            setFlaggedUsers((prevFlaggedUsers) => [
              ...prevFlaggedUsers,
              userID,
            ]);
          }
        },
      });
    } else {
      // Start listening for moderation events
      (chatRef.current as PubNubChat)?.listenForEvents({
        channel: (chatRef.current as PubNubChat).currentUser.id,
        type: "moderation",
        callback: async (event) => {
          if (event.payload.restriction === "muted") {
            setMuteStatus(true);
          } else if (event.payload.restriction === "banned") {
            setBanStatus(true);
          } else if (event.payload.restricted === "lifted") {
            setBanStatus(false);
            setMuteStatus(false);
          }
        },
      });
    }
  };

  const flagMessage = async (message: Message) => {
    if (isBroadcaster) {
      console.log("Admin cannot flag messages");
      return;
    }

    setFlaggedMessages([...flaggedMessages, message.timetoken]);

    await message.report("Reported By User");
  };

  const flagUser = async (userId: string) => {
    if (isBroadcaster) {
      console.log("Admin cannot flag users");
      return;
    }

    setFlaggedUsers([...flaggedUsers, userId]);

    // Get User
    const user: User =
      (await (chatRef.current as PubNubChat).getUser(userId)) ?? new User();

    await user.report("Reported By User");
  };

  const muteUser = async (userId: string) => {
    if (!isBroadcaster) {
      console.log("Only admin can handle flagged users");
      return;
    }

    // After successfully muting the user, add to the bannedUsers state
    // We will include the ban property as 'false' since we're muting, not banning
    setBannedUsers((prevUsers) => {
      const userExists = prevUsers.find((user) => user.userId === userId);

      if (userExists)
        return prevUsers.map((user) =>
          user.userId === userId ? { ...user, ban: false, mute: true } : user,
        );

      return [...prevUsers, { ban: false, mute: true, userId }];
    });

    // Get User
    const user: User =
      (await (chatRef.current as PubNubChat).getUser(userId)) ?? new User();

    // For mute
    try {
      await (channelRef.current as Channel)?.setRestrictions(user, {
        ban: false,
        mute: true,
        reason: "Banned by Admin",
      });
    } catch (e) {
      console.log("Error Muting User", e);
    }
  };

  const unMuteUser = async (userId: string) => {
    if (!isBroadcaster) {
      console.log("Only admin can handle flagged users");
      return;
    }

    // After successfully unmuting the user, update the bannedUsers state
    setBannedUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.userId === userId ? { ...user, mute: false } : user,
      );
      const filteredUsers = updatedUsers.filter(
        (user) => user.userId !== userId || user.mute || user.ban,
      );
      return filteredUsers;
    });

    // Get User
    const user: User =
      (await (chatRef.current as PubNubChat).getUser(userId)) ?? new User();

    try {
      // For unmute
      await (channelRef.current as Channel)?.setRestrictions(user, {
        ban: false,
        mute: false,
        reason: "Unmuted by Admin",
      });
    } catch (e) {
      console.log("Error Unmuting User", e);
    }
  };

  const banUser = async (userId: string) => {
    if (!isBroadcaster) {
      console.log("Only admin can handle flagged users");
      return;
    }

    // After successfully banning the user, add to the bannedUsers state
    setBannedUsers((prevUsers) => {
      const userExists = prevUsers.find((user) => user.userId === userId);

      if (userExists)
        return prevUsers.map((user) =>
          user.userId === userId ? { ...user, ban: true, mute: true } : user,
        );

      return [...prevUsers, { ban: true, mute: true, userId }];
    });

    // Get User
    const user: User =
      (await (chatRef.current as PubNubChat).getUser(userId)) ?? new User();

    // For ban
    try {
      await (channelRef.current as Channel)?.setRestrictions(user, {
        ban: true,
        mute: true,
        reason: "Banned by Admin",
      });
    } catch (e) {
      console.log("Error Banning User", e);
    }
  };

  const unBanUser = async (userId: string) => {
    if (!isBroadcaster) {
      console.log("Only admin can handle flagged users");
      return;
    }

    // After successfully unbanning the user, update the bannedUsers state
    setBannedUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.userId === userId ? { ...user, ban: false } : user,
      );
      return updatedUsers;
    });

    // Get current user's mute status
    const userRestrictions = bannedUsers.find((item) => item.userId === userId);
    const muteStatus = userRestrictions ? userRestrictions.mute : false;

    // Get User
    const user: User =
      (await (chatRef.current as PubNubChat).getUser(userId)) ?? new User();

    try {
      // For unban
      await (channelRef.current as Channel)?.setRestrictions(user, {
        ban: false,
        mute: muteStatus,
        reason: "Unbanned by Admin",
      });
    } catch (e) {
      console.log("Error Unbanning User", e);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (channelRef.current && inputMessage) {
      await channelRef.current.sendText(inputMessage, {
        storeInHistory: true,
      });
      setInputMessage("");
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    if (scrollTop === 0) {
      // Fetch more messages when scrolled to top
      if (channelRef.current !== null && channelRef.current !== undefined) {
        await fetchHistory(channelRef.current);
      }
    }
  };

  // Function to handle name submission
  const handleNameSubmit = (name: string) => {
    if (name.length > 0) {
      console.log("Ser username");
      setUsername(name);
      setUserSubmitted(true);
    }
  };

  // use the playback ID as a unique ID to set up the chat
  return (
    <div
      className={cn(
        "relative h-screen w-full flex flex-col px-3 py-4 mx-auto justify-between bg-white/10 rounded-sm",
        loading && "animate-pulse",
      )}
    >
      {!isBroadcaster && !userSubmitted ? (
        <ChatSignIn submit={handleNameSubmit} />
      ) : (
        <>
          {isBroadcaster && (
            <div className="flex flex-row">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Admin Dashboard
              </button>
            </div>
          )}
          <span>Users: {presenceCount}</span>
          {isUserBanned ? (
            <div>You have been banned</div>
          ) : (
            <div
              className={cn(
                "h-full",
                isBroadcaster ? "pb-[115px]" : "pb-[90px]",
              )}
            >
              <span className="text-sm font-semibold">Stream chat</span>
              <span className="my-2 h-px w-full bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
              <div
                className="min-h-[300px] max-h-[450px] md:max-h-full flex-grow overflow-scroll overflow-y-auto my-2 space-y-2"
                onScroll={handleScroll}
              >
                {loading ? (
                  <div>
                    <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
                    <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
                    <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
                    <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
                  </div>
                ) : (
                  chatMessages.map((message) => {
                    // Check if the user is banned or muted
                    const bannedUser = bannedUsers.find(
                      (user) => user.userId === message.userId,
                    );

                    // If the broadcaster is viewing, count how often this message has been flagged
                    const flagCount = isBroadcaster
                      ? flaggedMessages.filter((id) => id === message.timetoken)
                          .length
                      : 0;

                    // Check if a user or a message is already flagged
                    const isUserFlagged = flaggedUsers.includes(message.userId);
                    const isMessageFlagged = flaggedMessages.includes(
                      message.timetoken,
                    );

                    return (
                      <MessageComponent
                        key={message.timetoken + message.userId}
                        timetoken={message.timetoken}
                        userId={message.userId}
                        username={storedUsers.get(message.userId)?.name ?? ""}
                        message={message}
                        isUserFlagged={isUserFlagged}
                        isMessageFlagged={isMessageFlagged}
                        isBroadcaster={isBroadcaster}
                        bannedUser={bannedUser}
                        flagCount={flagCount}
                        banUser={banUser}
                        muteUser={muteUser}
                        unBanUser={unBanUser}
                        unMuteUser={unMuteUser}
                        flagMessage={flagMessage}
                        flagUser={flagUser}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
          {isUserMuted || isUserBanned ? (
            <div />
          ) : (
            <div className="absolute bottom-2 left-2 right-2">
              <label className="sr-only" htmlFor="message" />
              <form onSubmit={handleFormSubmit} className="w-full relative">
                <input
                  name="message"
                  className="flex h-9 pr-8 w-full rounded-md border border-white/30 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  value={inputMessage}
                  disabled={loading}
                  onChange={handleInputChange}
                />
                <div className="absolute bottom-0 right-2 top-0 flex w-5 items-center justify-center">
                  <button
                    className="hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-white/40 rounded-full p-1 transition"
                    type="submit"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              // Customizable styles
              overlay: {},
              content: {},
            }}
            ariaHideApp={false}
          >
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2
                id="restricted-users-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Restricted Users
              </h2>
              <div className="border-b border-gray-300 my-2" />
              {bannedUsers.map((user, index) => (
                <div
                  className="text-md font-medium text-gray-900"
                  key={user.userId}
                >
                  <p>{storedUsers.get(user.userId)?.name ?? ""}</p>
                  <p>Banned: {user.ban ? "Yes" : "No"}</p>
                  <p>Muted: {user.mute ? "Yes" : "No"}</p>
                  <div className="border-b border-gray-300 my-2" />
                </div>
              ))}
              <h2
                id="restricted-users-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Flagged Users
              </h2>
              <div className="border-b border-gray-300 my-2" />
              {Array.from(new Set(flaggedUsers))
                .sort(
                  (a, b) =>
                    flaggedUsers.filter((v) => v === b).length -
                    flaggedUsers.filter((v) => v === a).length,
                )
                .map((userId, index) => {
                  const user = bannedUsers.find(
                    (user) => user.userId === userId,
                  );
                  const flagCount = flaggedUsers.filter(
                    (id) => id === userId,
                  ).length;
                  return (
                    <div
                      className="text-md font-medium text-gray-900"
                      key={userId}
                    >
                      <p>
                        {storedUsers.get(userId)?.name ?? ""} (Flagged{" "}
                        {flagCount} times)
                      </p>
                      <p>Banned: {user?.ban ? "Yes" : "No"}</p>
                      <p>Muted: {user?.mute ? "Yes" : "No"}</p>
                      <div className="border-b border-gray-300 my-2" />
                    </div>
                  );
                })}
            </div>

            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2
                id="restricted-messages-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Flagged Messages
              </h2>
              <div className="border-b border-gray-300 my-2" />
              {Array.from(new Set(flaggedMessages))
                .sort(
                  (a, b) =>
                    flaggedMessages.filter((v) => v === b).length -
                    flaggedMessages.filter((v) => v === a).length,
                )
                .map((timetoken, index) => {
                  const message = chatMessages.find(
                    (message) => message.timetoken === timetoken,
                  );
                  const flagCount = flaggedMessages.filter(
                    (id) => id === timetoken,
                  ).length;
                  return (
                    message && (
                      <div
                        className="text-md font-medium text-gray-900"
                        key={timetoken}
                      >
                        <p>
                          {message.content.text} (Flagged {flagCount} times)
                        </p>
                        <div className="border-b border-gray-300 my-2" />
                      </div>
                    )
                  );
                })}
            </div>
            <div className="px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white ml-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-0 sm:mr-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
