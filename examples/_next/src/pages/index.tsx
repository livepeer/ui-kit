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
    </>
  );
};

export default Page;
