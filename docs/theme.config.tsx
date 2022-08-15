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
  projectLink: github,
  docsRepositoryBase: `${github}/tree/main/docs/pages`,
  titleSuffix() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const { locale } = useRouter();
    return ` – livepeer.js`;
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
      'livepeer.js is a library to make building with Livepeer easy. It provides a core vanilla JS library to easily connect to a Livepeer Media Server (e.g. Livepeer Studio), as well as React-specific hooks with a similar API to provide memoization and DOM management.';
    return (
      <>
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
        <meta name="twitter:site" content="@livepeer" />
        {/* <meta name="twitter:image" content={image} /> */}
        <meta name="og:title" content={`${config.title} – livepeer.js`} />
        {/* <meta name="og:image" content={image} /> */}
        <meta name="apple-mobile-web-app-title" content="livepeer.js" />
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
