import type React from "react";
import { type ChangeEvent, useState } from "react";

type ChatSignInProps = {
  submit: (name: string) => void;
};

const ChatSignIn: React.FC<ChatSignInProps> = ({ submit }) => {
  const [username, setUsername] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-pubnub-dark/20 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-white">
              Join the Chat!
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your username
                </label>
                {/** biome-ignore lint/nursery/useUniqueElementIds: ignored using `--suppress` */}
                <input
                  type="username"
                  name="username"
                  id="username"
                  className="sm:text-sm rounded-lg block w-full p-2.5 bg-pubnub-dark border-gray-600 placeholder-gray-400 text-white"
                  placeholder="username"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    {/** biome-ignore lint/nursery/useUniqueElementIds: ignored using `--suppress` */}
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-pubnub-light-grey focus:ring-3 focus:ring-primary-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-10 bg-pubnub-red hover:bg-pubnub-red/80 rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => submit(username)}
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Enter a username to join the chat!
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSignIn;
