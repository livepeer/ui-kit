"use client";

import { cn } from "@/lib/utils";
import { faCog, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Channel, Membership, type Message, User } from "@pubnub/chat";
import { SendHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  type ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RotatingLines } from "react-loader-spinner";
import Modal from "react-modal";
import {
  deleteMessageAPI,
  restoreMessageAPI,
  setRestrictionsAPI,
} from "./api/moderation";
import Admin from "./components/admin";
import MessageComponent from "./components/message";
import ChatSignIn from "./components/sign-in";
import { ChatContext, type ChatType } from "./context/ChatContext";

export const Chat = ({ playbackId }: { playbackId: string }) => {
  const {
    chatInstance,
    userInstance,
    channelInstance,
    createPubnubChannel,
    createPubnubUser,
  } = useContext(ChatContext) as ChatType;

  const pathname = usePathname();

  const [isBroadcaster, setIsBroadcaster] = useState(false);
  const [username, setUsername] = useState<string | undefined>();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [storedUsers, setStoredUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(false);
  const [disconnectMessageStream, setDisconnectMessageStream] = useState<
    (() => void) | undefined
  >();
  const [disconnectPresenseStream, setDisconnectPresenseStream] = useState<
    (() => void) | undefined
  >();
  const [endTimetoken, setEndTimetoken] = useState<string | undefined>();
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

  // If we are currently fetching history
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(false);

  // Inside your component function
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatInstance) return;

    const isBroadcaster = pathname === "/";

    setLoading(isBroadcaster);

    // Determine if the user is the broadcaster based on the URL path
    setIsBroadcaster(isBroadcaster);

    if (isBroadcaster) {
      setUsername("Admin");
    }
  }, [chatInstance, pathname]);

  useEffect(() => {
    // Create or retrieve and instance of a Pubnub user object
    async function initUser() {
      if (!chatInstance || !username) return;
      await createPubnubUser(username);
    }
    initUser();
  }, [chatInstance, username, createPubnubUser]);

  useEffect(() => {
    // Create and instance of a PubNub channel
    async function initChannel() {
      if (!userInstance) return;
      await createPubnubChannel(playbackId);

      // Store the current user in the user cache
      const newStoredUsers = new Map(storedUsers);
      newStoredUsers.set(userInstance.id, userInstance);
    }

    initChannel();
  }, [playbackId, userInstance, storedUsers, createPubnubChannel]);

  useEffect(() => {
    // This will connect the message and presense stream
    async function initChat() {
      if (!channelInstance || !chatInstance) return;
      if (!loading) return;

      setLoading(false);

      // Join channel, able to listen to incoming messages
      await channelInstance.join((message: Message) => {
        // Cache the stored user if a new user has sent a message
        if (!storedUsers.has(message.userId)) {
          chatInstance?.getUser(message.userId).then((user) => {
            if (user != null) {
              setStoredUsers((users) => {
                const updatedUsers = new Map(users);
                updatedUsers.set(user.id, user);
                return updatedUsers;
              });
            }
          });
        }

        // Callback function that adds incoming messages to the chatMessages state
        setChatMessages((prevMessages) => [...prevMessages, message]);

        // Scroll the chat to the bottom if you receive a message
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        }, 200);
      });

      // Join presence stream to listen when people hav joined the channel
      const presenceStream = await channelInstance.streamPresence(
        (userIds: string[]) => {
          setPresenceCount(userIds.length);
        },
      );

      setDisconnectPresenseStream(() => presenceStream);

      // Listen for reporting, banning and muting events
      moderationListeners();
      // Fetch the history from the PubNub channel
      await fetchHistory(channelInstance);
      // Get the current restricted users in the channel if they are either muted or banned
      await getRestrictedUsers();

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }

    initChat();

    return () => {
      // This function will run when the component unmounts
      disconnectMessageStream?.(); // Disconnect the message stream on the channel
      disconnectPresenseStream?.(); // Disconnect the presense stream on the channel
    };
  }, [
    channelInstance,
    chatInstance,
    loading,
    storedUsers,
    disconnectMessageStream,
    disconnectPresenseStream,
  ]);

  /// Fetch history from the current channel
  /// Stroe all the current users in the stored users
  const fetchHistory = async (channel: Channel) => {
    if (!hasMore || fetchingHistory) return;
    setFetchingHistory(true);

    const history = await channel?.getHistory({
      count: 20,
      startTimetoken: endTimetoken,
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
        const userDetails = (await chatInstance?.getUser(userId)) ?? new User();
        // Update the cache as soon as user details are fetched
        return userDetails;
      });

      // Wait for all the user details to be fetched and cached
      Promise.all(fetchUserDetailsPromises).then((users: User[]) => {
        const newStoredUsers = new Map(storedUsers);
        for (const user of users) {
          newStoredUsers.set(user.id, user);
        }
        setStoredUsers(newStoredUsers);

        const messages = history.messages;
        const messages_length = messages.length;

        // Offset the scroll position depending on how many messages are loaded in
        const scroll_offset = messages_length * 10;

        // Offset the scroll position
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = scroll_offset;
        }

        // Update chat messages with enriched data
        setChatMessages((prevMessages) => [...messages, ...prevMessages]);

        // Set the timetoken for the next fetch
        setEndTimetoken(messages[0].timetoken);
      });
    }

    setFetchingHistory(false);
  };

  /// Get all the banned users in the current channel
  const getRestrictedUsers = async () => {
    if (!channelInstance) return;
    try {
      const { restrictions } = await channelInstance.getUsersRestrictions();
      // Add the list of banned users to state
      setBannedUsers(restrictions);
    } catch (error) {
      console.error(`Failed to get restricted users: ${error}`);
    }
  };

  /// Listen to moderation events such as:
  /// Users to report misbehaving users to admin
  /// Admins to mute misbehaving users on channels
  /// Admins to ban misbehaving users from accessing the channel
  const moderationListeners = () => {
    if (!chatInstance) return;

    // Start listening for report events
    if (isBroadcaster) {
      // Listen to moderation events reported by "users" to the admin
      chatInstance.listenForEvents({
        channel: "PUBNUB_INTERNAL_ADMIN_CHANNEL",
        type: "report",
        callback: async (event) => {
          const messageTimeToken: string | null =
            event.payload?.reportedMessageTimetoken ?? null;
          const userID: string = event.payload.reportedUserId;

          // If there is a message timetoken in the payload then a message was reported
          // If there was no message timetoken then we can assume a user is reported
          if (messageTimeToken) {
            setFlaggedMessages((prevFlaggedMessages) => [
              ...prevFlaggedMessages,
              messageTimeToken,
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
      // Start listening to any moderation events that might effect your the "user" access
      // This only applies to the current user to check if you have been banned or muted
      chatInstance.listenForEvents({
        channel: chatInstance.currentUser.id,
        type: "moderation",
        callback: async (event) => {
          if (event.payload.restriction === "muted") {
            setBanStatus(false);
            setMuteStatus(true);
          } else if (event.payload.restriction === "banned") {
            setBanStatus(true);
            setMuteStatus(true);
          } else if (event.payload.restriction === "lifted") {
            setBanStatus(false);
            setMuteStatus(false);
          }
        },
      });
    }
  };

  /// As a user you can report a message and the admin will receive this event when listening to the "PUBNUB_INTERNAL_ADMIN_CHANNEL" for moderation events
  const flagMessage = async (message: Message) => {
    if (isBroadcaster) {
      console.log("Admin cannot flag messages");
      return;
    }

    setFlaggedMessages([...flaggedMessages, message.timetoken]);

    // Report a message
    await message.report("Reported By User");
  };

  /// As a user you can report another user and the admin will receive this event when listening to the "PUBNUB_INTERNAL_ADMIN_CHANNEL" for moderation events
  const flagUser = async (userId: string) => {
    if (!chatInstance) return;
    if (isBroadcaster) {
      console.log("Admin cannot flag users");
      return;
    }

    setFlaggedUsers([...flaggedUsers, userId]);

    // Get User
    const user: User = (await chatInstance.getUser(userId)) ?? new User();

    // Report a user
    // await user.report("Reported By User");
  };

  /// As a admin you can mute another user. If you are the user that has been muted you will receive this event by listening to your userId as a channel
  const muteUser = async (userId: string, mute: boolean) => {
    if (!channelInstance || !chatInstance) return;

    if (!isBroadcaster) {
      console.log("Only an Admin can mute users");
      return;
    }

    // After successfully muting the user, add to the bannedUsers state
    // We will include the ban property as 'false' since we're muting, not banning
    setBannedUsers((prevUsers) => {
      const userExists = prevUsers.find((user) => user.userId === userId);

      if (userExists)
        return prevUsers.map((user) =>
          user.userId === userId ? { ...user, ban: false, mute: mute } : user,
        );

      return [...prevUsers, { ban: false, mute: mute, userId }];
    });

    // Get User
    const user: User = (await chatInstance.getUser(userId)) ?? new User();

    // Mute/un-mute a user
    try {
      await setRestrictionsAPI(channelInstance.id, userId, false, mute);
    } catch (error) {
      console.log("Error Muting User: ", error);
    }
  };

  /// As a admin you can ban another user. If you are the user that has been banned you will receive this event by listening to your userId as a channel
  const banUser = async (userId: string, ban: boolean) => {
    if (!chatInstance || !channelInstance) return;
    if (!isBroadcaster) {
      console.log("Only admin can ban users");
      return;
    }

    // Get current user's mute status
    const userRestrictions = bannedUsers.find((item) => item.userId === userId);
    const muteStatus = userRestrictions ? userRestrictions.mute : false;

    // After successfully banning the user, add to the bannedUsers state
    setBannedUsers((prevUsers) => {
      const userExists = prevUsers.find((user) => user.userId === userId);

      if (userExists)
        return prevUsers.map((user) =>
          user.userId === userId
            ? { ...user, ban: ban, mute: muteStatus }
            : user,
        );

      return [...prevUsers, { ban: ban, mute: muteStatus, userId }];
    });

    // Get User
    const user: User = (await chatInstance.getUser(userId)) ?? new User();

    // Ban/un-ban a user
    try {
      await setRestrictionsAPI(channelInstance.id, userId, ban, muteStatus);
    } catch (error) {
      console.log("Error Banning User: ", error);
    }
  };

  /// Handle changes to the chat input field
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  /// Handle the chat input field (Send Message)
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (channelInstance && inputMessage) {
      try {
        await channelInstance.sendText(inputMessage, {
          storeInHistory: true,
        });
      } catch (e) {
        console.log("Failed to send message: ", e);
      }
      setInputMessage("");
    }
  };

  /// Delete a Message
  const deleteMessage = async (newMessage: Message) => {
    // Update the local state for the deleted message
    // Use message.timetoken to locate the message in the list
    setChatMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.timetoken === newMessage.timetoken ? newMessage : message,
      ),
    );

    // Soft delete the message
    await deleteMessageAPI(newMessage.timetoken, newMessage.channelId);
  };

  /// Restore a Message
  const restoreMessage = async (newMessage: Message) => {
    // Update local state for restored message
    setChatMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.timetoken === newMessage.timetoken ? newMessage : message,
      ),
    );

    // Restore the deleted message
    await restoreMessageAPI(newMessage.timetoken, newMessage.channelId);
  };

  /// Handle the scroll of the chat
  const handleScroll = async (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    if (scrollTop === 0) {
      // Fetch more messages when scrolled to top
      if (channelInstance) {
        await fetchHistory(channelInstance);
      }
    }
  };

  // Function to handle name submission
  const handleNameSubmit = (name: string) => {
    if (name.length > 0) {
      setLoading(true);
      setUsername(name);
    }
  };

  // use the playback ID as a unique ID to set up the chat
  return (
    <div
      className={cn(
        "relative w-full h-screen max-h-96 md:max-h-full flex flex-col px-3 py-4 mx-auto justify-center bg-pubnub-dark/20 rounded-sm",
        loading && "animate-pulse",
      )}
    >
      {!isBroadcaster && !username ? (
        <ChatSignIn submit={handleNameSubmit} />
      ) : (
        <>
          {isUserBanned ? (
            <div className="flex justify-center items-center flex-col">
              <h2 className="text-2xl font-bold text-pubnub-white">
                You have been banned!
              </h2>
              <img
                src="/banned.png"
                alt="Description"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <div
              className={cn("h-full", isUserMuted ? "pb-[15px]" : "pb-[100px]")}
            >
              <span className="my-2 h-px w-full" />
              <div
                className="min-h-[250px] max-h-[250px] md:max-h-full flex-grow overflow-scroll overflow-y-auto my-2 space-y-2"
                onScroll={handleScroll}
                ref={chatContainerRef}
              >
                {fetchingHistory ? (
                  <div className="w-full h-20 flex justify-center items-center">
                    <RotatingLines width="40" strokeColor="grey" />
                  </div>
                ) : (
                  <div />
                )}
                {loading ? (
                  <div>
                    <div className="w-full h-10 animate-pulse bg-pubnub-dark/5 rounded-lg mt-2" />
                    <div className="w-full h-10 animate-pulse bg-pubnub-dark/5 rounded-lg mt-2" />
                    <div className="w-full h-10 animate-pulse bg-pubnub-dark/5 rounded-lg mt-2" />
                    <div className="w-full h-10 animate-pulse bg-pubnub-dark/5 rounded-lg mt-2" />
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
                        banUser={(userId) => banUser(userId, true)}
                        muteUser={(userId) => muteUser(userId, true)}
                        unBanUser={(userId) => banUser(userId, false)}
                        unMuteUser={(userId) => muteUser(userId, false)}
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
            <div className="absolute bottom-2 left-2 right-2 flex flex-col bg-black">
              <label className="sr-only" htmlFor="message">
                Send a message
              </label>
              <form onSubmit={handleFormSubmit} className="w-full relative">
                <input
                  name="message"
                  className="flex h-9 pr-8 w-full rounded-md border border-pubnub-white bg-pubnub-dark/20 px-3 py-1 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="w-full h-[50px] pl-2 pr-2 bg-pubnub-dark/20">
                <div className="flex flex-row items-center mt-[10px] justify-between">
                  <div className="">
                    <FontAwesomeIcon icon={faUser} size="sm" />
                    <span className="ml-[10px]">{presenceCount}</span>
                  </div>
                  {isBroadcaster ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faCog} size="sm" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={{
              // Customizable styles for overlay and content
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
              },
              content: {
                backgroundColor: "#161C2D",
                width: "50%",
                height: "auto",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                transform: "translate(-50%, -50%)",
                padding: "0px",
              },
            }}
            ariaHideApp={false}
          >
            <Admin
              bannedUsers={bannedUsers}
              flaggedUsers={flaggedUsers}
              flaggedMessages={flaggedMessages}
              storedUsers={storedUsers}
              chatMessages={chatMessages}
              setIsModalOpen={setIsModalOpen}
              deleteMessage={deleteMessage}
              restoreMessage={restoreMessage}
            />
          </Modal>
        </>
      )}
    </div>
  );
};
