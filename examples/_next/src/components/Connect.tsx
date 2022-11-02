import { useLivepeerProvider } from '@livepeer/react';
import { useRoundsManager } from '@livepeer/react/contracts';
import { ConnectKitButton } from 'connectkit';
import { useEffect, useState } from 'react';

export const Connect = () => {
  const livepeerProvider = useLivepeerProvider();
  const { data: roundsManager } = useRoundsManager();
  const [currentRound, setCurrentRound] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const response = await roundsManager?.currentRound();

      if (response) setCurrentRound(response.toNumber());
    })();
  }, [roundsManager]);

  return (
    <div>
      <ConnectKitButton />
      <div>{livepeerProvider.getConfig().name}</div>
      <div>Current round: {currentRound}</div>
    </div>
  );
};
