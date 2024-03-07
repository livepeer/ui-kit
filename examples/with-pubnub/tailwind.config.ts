import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("tailwindcss-animate")],
};
export default config;
