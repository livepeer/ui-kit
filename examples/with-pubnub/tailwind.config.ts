import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      colors: {
        "pubnub-dark": "#161C2D",
        "pubnub-red": "#EF3A43",
        "pubnub-faded-red": "#FDECED",
        "pubnub-dark-grey": "#475569",
        "pubnub-light-grey": "#94A3B7",
        "pubnub-yellow": "#FBBF24",
        "pubnub-white": "#F8FAFC",
      },
    },
  },
};
export default config;
