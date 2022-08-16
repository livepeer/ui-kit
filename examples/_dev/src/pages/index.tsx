import * as React from 'react';

import { Asset, Connect, Stream } from '../components';

const Page = () => {
  return (
    <>
      <Connect />
      <hr />
      <Stream />
      <hr />
      <Asset />
    </>
  );
};

export default Page;
