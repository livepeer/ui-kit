import { useLivepeerProvider } from '@livepeer/react';

export const Connect = () => {
  const livepeerProvider = useLivepeerProvider();

  return (
    <div>
      <div>{livepeerProvider.getConfig().name}</div>
    </div>
  );
};
