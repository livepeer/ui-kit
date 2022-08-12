/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
import { useRouter } from 'next/router';

const github = 'https://github.com/livepeer/livepeer.js';

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'Livepeer for JS',
} as const;

const EDIT_LINK_WITH_TRANSLATIONS = {
  'en-US': 'Question? Give us feedback →',
} as const;

// export default {
//   docsRepositoryBase: `${github}/tree/main/docs/pages`,
//   projectChatLink: 'https://discord.gg/livepeer', // Livepeer discord server,
//   logo: () => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const { locale } = useRouter();
//     return (
//       <>
//         <span className="mr-2 font-extrabold">livepeer.js</span>
//         <span className="text-gray-600 font-normal hidden md:inline">
//           {TITLE_WITH_TRANSLATIONS[locale || 'en-US']}
//         </span>
//       </>
//     );
//   },
//   github,
//   head: (
//     <>
//       <meta name="msapplication-TileColor" content="#ffffff" />
//       <meta name="theme-color" content="#ffffff" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <meta httpEquiv="Content-Language" content="en" />
//       <meta name="description" content="Nextra: the Next.js site builder" />
//       <meta name="og:description" content="Nextra: the Next.js site builder" />
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:image" content="https://nextra.vercel.app/og.png" />
//       <meta name="twitter:site:domain" content="nextra.vercel.app" />
//       <meta name="twitter:url" content="https://nextra.vercel.app" />
//       <meta name="og:title" content="Nextra: Next.js static site generator" />
//       <meta name="og:image" content="https://nextra.vercel.app/og.png" />
//       <meta name="apple-mobile-web-app-title" content="Nextra" />
//       <link
//         rel="apple-touch-icon"
//         sizes="180x180"
//         href="/apple-icon-180x180.png"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="192x192"
//         href="/android-icon-192x192.png"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="32x32"
//         href="/favicon-32x32.png"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="96x96"
//         href="/favicon-96x96.png"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="16x16"
//         href="/favicon-16x16.png"
//       />
//       <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
//     </>
//   ),
//   i18n: [{ locale: 'en-US', text: 'English' }],
//   search: true,
//   unstable_faviconGlyph: '✦',
//   prevLinks: true,
//   footer: true,
//   footerEditLink: `Edit this page on GitHub`,
//   footerText: `MIT ${new Date().getFullYear()} © Livepeer Inc.`,
//   nextThemes: {
//     defaultTheme: 'dark',
//   },
//   bannerKey: 'launch-1',
//   banner: "We've just launched livepeer.js - check out our docs!",
//   projectLink: github,
//   titleSuffix: ' – livepeer.js',
//   unstable_flexsearch: true,
// };

import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';

// const Logo = ({ height }: { height: number }) => (
//   <svg height={height} viewBox="0 0 291 69" fill="none">
//     <path
//       d="M0 36.53c.07 17.6 14.4 32.01 32.01 32.01a32.05 32.05 0 0032.01-32V32a13.2 13.2 0 0123.4-8.31h20.7A32.07 32.07 0 0077.2 0a32.05 32.05 0 00-32 32.01v4.52A13.2 13.2 0 0132 49.71a13.2 13.2 0 01-13.18-13.18 3.77 3.77 0 00-3.77-3.77H3.76A3.77 3.77 0 000 36.53zM122.49 68.54a32.14 32.14 0 01-30.89-23.7h20.67a13.16 13.16 0 0023.4-8.3V32A32.05 32.05 0 01167.68 0c17.43 0 31.64 14 32 31.33l.1 5.2a13.2 13.2 0 0023.4 8.31h20.7a32.07 32.07 0 01-30.91 23.7c-17.61 0-31.94-14.42-32.01-32l-.1-4.7v-.2a13.2 13.2 0 00-13.18-12.81 13.2 13.2 0 00-13.18 13.18v4.52a32.05 32.05 0 01-32.01 32.01zM247.94 23.7a13.16 13.16 0 0123.4 8.31 3.77 3.77 0 003.77 3.77h11.3a3.77 3.77 0 003.76-3.77A32.05 32.05 0 00258.16 0a32.07 32.07 0 00-30.92 23.7h20.7z"
//       fill="currentColor"
//     />
//   </svg>
// );

const config: DocsThemeConfig = {
  github,
  docsRepositoryBase: `${github}/tree/main/docs/pages`,
  titleSuffix() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter();
    return ` – livepeer.js (${locale})`;
  },
  projectChatLink: 'https://discord.gg/livepeer',
  search: true,
  floatTOC: true,
  defaultMenuCollapsed: true,
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
  // bannerKey: 'livepeerjs-1',
  // banner: "We've just launched livepeer.js - check out our docs!",
  footerText: `MIT ${new Date().getFullYear()} © Livepeer Inc.`,
  logo() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter();
    return (
      <>
        <span className="mr-2 font-extrabold hidden md:inline select-none">
          livepeer.js
        </span>
        <span className="text-gray-600 font-medium hidden md:inline">
          {
            TITLE_WITH_TRANSLATIONS[
              (locale as keyof typeof TITLE_WITH_TRANSLATIONS) ?? 'en-US'
            ]
          }
        </span>
      </>
    );
  },
  head() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    const description =
      config.meta.description ||
      'SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.';
    const image =
      config.meta.image ||
      'https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg';
    return (
      <>
        {/* Favicons, meta */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:image" content={image} />
        <meta name="og:title" content={`${config.title} – SWR`} />
        <meta name="og:image" content={image} />
        <meta name="apple-mobile-web-app-title" content="SWR" />
      </>
    );
  },
  sidebarSubtitle: ({ title }) => (
    <div className="flex items-center gap-2">
      {/* <Logo height={6} /> */}
      {title}
    </div>
  ),
  footerEditLink() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter();
    return (
      <>
        {
          EDIT_LINK_WITH_TRANSLATIONS[
            (locale as keyof typeof TITLE_WITH_TRANSLATIONS) ?? 'en-US'
          ]
        }
      </>
    );
  },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'es-ES', text: 'Español' },
    { locale: 'zh-CN', text: '简体中文' },
    { locale: 'ja', text: '日本語' },
    { locale: 'ko', text: '한국어' },
    { locale: 'ru', text: 'Русский' },
  ],
  gitTimestamp: 'Last updated on',
  unstable_faviconGlyph: '🟩',
  font: false,
};

export default config;
