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
      <Link href="/player">Demo Player</Link>
    </>
  );
};

export default Page;
