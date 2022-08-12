import { useLPMSProvider } from '@livepeer/react';
import * as React from 'react';

export const Connect = () => {
  const lpmsProvider = useLPMSProvider();

  return (
    <div>
      <div>{lpmsProvider.getLPMS().name}</div>
    </div>
  );
};
