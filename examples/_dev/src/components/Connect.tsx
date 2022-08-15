import { useLPMSProvider, useRoundsManager } from '@livepeer/react';
import { ConnectKitButton } from 'connectkit';
import { useEffect, useState } from 'react';

export const Connect = () => {
  const lpmsProvider = useLPMSProvider();
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
      <div>{lpmsProvider.getLPMS().name}</div>
      <div>Current round: {currentRound}</div>
    </div>
  );
};
