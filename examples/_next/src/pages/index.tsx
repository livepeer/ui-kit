import Link from 'next/link';

import { Asset, Connect, Stream } from '../components';

const Page = () => {
  return (
    <>
      <Connect />
      <hr />
      <Stream />
      <hr />
      <Asset />
      <hr />
      <Link href="/player">
        <a>Demo Player</a>
      </Link>
    </>
  );
};

export default Page;
