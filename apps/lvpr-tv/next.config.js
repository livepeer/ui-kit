/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://vtuber.fun https://dev.vtuber.fun https://daydream.live https://*.livepeer.monster https://*.livepeer.org https://*.vercel.app http://localhost:3000",
          },
          {
            key: "X-Frame-Options",
            value:
              "ALLOW-FROM https://vtuber.fun https://dev.vtuber.fun https://daydream.live https://*.livepeer.monster https://*.livepeer.org https://*.vercel.app http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "https://vtuber.fun https://dev.vtuber.fun https://daydream.live https://*.livepeer.monster https://*.livepeer.org https://*.vercel.app http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
