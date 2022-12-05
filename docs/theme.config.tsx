/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
import { useRouter } from 'next/router';

const github = 'https://github.com/livepeer/livepeer.js';

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'Livepeer for JS',
} as const;

const EDIT_LINK_WITH_TRANSLATIONS = {
  'en-US': 'Questions? Give us feedback →',
} as const;

import { DocsThemeConfig, useConfig, useTheme } from 'nextra-theme-docs';

const Logo = ({ height }: { height: number }) => {
  const { theme } = useTheme();

  return (
    <svg width={height} height={height} viewBox="0 0 1024 1024" fill="none">
      <circle
        cx="512"
        cy="512"
        r="512"
        fill={theme === 'light' ? '#131418' : 'white'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M292 662L292 762L392 762L392 662L292 662ZM292 462L292 562L392 562L392 462L292 462ZM692 462L692 562L792.001 562L792.001 462L692 462ZM292 362L292 262L392 262L392 362L292 362ZM492 461.999L492 361.999L592 361.999L592 461.999L492 461.999ZM492 561.999L492 661.999L592 661.999L592 561.999L492 561.999Z"
        fill={theme === 'light' ? 'white' : '#131418'}
      />
    </svg>
  );
};

const config: DocsThemeConfig = {
  docsRepositoryBase: `${github}/tree/main/docs/pages`,
  chat: {
    link: 'https://discord.gg/livepeer',
  },
  toc: {
    float: true,
  },
  project: {
    link: github,
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
  primaryHue: {
    dark: 162,
    light: 212,
  },
  banner: {
    key: 'livepeerjs-launch',
    text: (
      <div className="flex justify-center items-center gap-2">
        We've just launched - check out our docs! 📗
      </div>
    ),
  },
  footer: {
    text: `MIT ${new Date().getFullYear()} © Livepeer Inc.`,
  },
  logo() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter();
    return (
      <div className="flex items-center gap-2">
        <Logo height={25} />
        <span
          className="font-extrabold hidden md:inline select-none"
          title={
            'livepeer.js: ' +
            TITLE_WITH_TRANSLATIONS[
              (locale as keyof typeof TITLE_WITH_TRANSLATIONS) ?? 'en-US'
            ]
          }
        >
          livepeer.js
        </span>
      </div>
    );
  },
  getNextSeoProps() {
    return {
      titleTemplate: `%s - livepeer.js`,
    };
  },
  head() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();
    const title = config?.frontMatter?.title || 'Build with Livepeer';
    const description =
      config?.frontMatter?.description ||
      'livepeer.js makes building with Livepeer effortless.';
    const image = config?.frontMatter?.image || '/og.png';
    const folder = theme === 'light' ? '/light' : '/dark';

    return (
      <>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${folder}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${folder}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${folder}/favicon-16x16.png`}
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
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#00a300" />
        <link rel="manifest" href={`${folder}/site.webmanifest`} />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@livepeer" />
        <meta name="twitter:image" content={image} />
        <meta name="og:title" content={`${title} – livepeer.js`} />
        <meta name="og:image" content={image} />
        <meta name="apple-mobile-web-app-title" content="livepeer.js" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YNF68V1ND1"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YNF68V1ND1');
          `}
        </script>
      </>
    );
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title, type }) =>
      type === 'separator' ? (
        <div className="flex items-center gap-2">
          <Logo height={10} />
          {title}
        </div>
      ) : (
        <>{title}</>
      ),
  },
  editLink: {
    text() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { locale } = useRouter();
      return (
        <>
          {
            EDIT_LINK_WITH_TRANSLATIONS[
              (locale as keyof typeof EDIT_LINK_WITH_TRANSLATIONS) ?? 'en-US'
            ]
          }
        </>
      );
    },
  },
  i18n: [{ locale: 'en-US', text: 'English' }],
  gitTimestamp: ({ timestamp }) => (
    <>Last updated on {timestamp.toLocaleDateString()}</>
  ),
};

export default config;
