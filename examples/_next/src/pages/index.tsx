import Link from 'next/link';

import { Asset, Stream } from '../components';

const Page = () => {
  return (
    <>
      {/* <Connect />
      <hr /> */}
      <Stream />
      <hr />
      <Asset />
      <hr />
      <Link href="/player">Demo Upload & Player</Link>
      <br />
      <Link href="/simple-player">Simple Player</Link>
      <br />
      <Link href="/iframe-player">iFrame Player</Link>
      <br />
      <Link href="/inline-player">Inline Player</Link>
    </>
  );
};

export default Page;
