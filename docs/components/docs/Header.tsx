import { useRouter } from 'next/router';

import { LogoType } from '../core';

const TITLE_WITH_TRANSLATIONS: Record<string, string> = {
  'en-US': 'livepeer.js',
};

export function Header() {
  const { locale, defaultLocale = 'en-US' } = useRouter();
  const resolvedLocale = locale || defaultLocale;
  const title = TITLE_WITH_TRANSLATIONS[resolvedLocale];

  return (
    <header className="mb-10 flex flex-col items-center">
      <div className="flex content-center mt-8 mb-2 w-auto h-24 md:h-36">
        <LogoType />
      </div>

      <h1 className="text-center font-bold text-3xl mb-8 md:!text-4xl">
        {title}
      </h1>

      <div className="flex flex-wrap gap-2 justify-center max-w-[28rem] min-h-[3rem]">
        <a
          aria-label="Version"
          href="https://www.npmjs.com/package/livepeer"
          className="h-5"
        >
          <img
            alt=""
            src="https://img.shields.io/npm/v/livepeer?colorA=2B323B&colorB=1e2329&style=flat&label=Version"
          />
        </a>

        <a
          aria-label="License"
          href="https://www.npmjs.com/package/livepeer"
          className="h-5"
        >
          <img
            alt=""
            src="https://img.shields.io/github/license/livepeer/livepeer.js?colorA=2B323B&colorB=1e2329&style=flat&label=License"
          />
        </a>

        <a
          aria-label="Downloads"
          href="https://www.npmjs.com/package/livepeer"
          className="h-5"
        >
          <img
            alt=""
            src="https://img.shields.io/npm/dm/livepeer?colorA=2B323B&colorB=1e2329&style=flat&label=Downloads"
          />
        </a>

        <a
          aria-label="Stars"
          href="https://github.com/livepeer/livepeer.js"
          className="h-5"
        >
          <img
            alt=""
            src="https://img.shields.io/github/stars/livepeer/livepeer.js?colorA=2B323B&colorB=1e2329&style=flat&label=Stars"
          />
        </a>
      </div>
    </header>
  );
}
