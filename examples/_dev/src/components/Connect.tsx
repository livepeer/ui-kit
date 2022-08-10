import * as React from 'react';
import { useAccount, useConnect } from 'wagmi';

export const Connect = () => {
  const { connector, isReconnecting } = useAccount();
  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect();

  return (
    <div>
      <div>
        {connectors.map((x) => (
          <button
            disabled={!x.ready || isReconnecting || connector?.id === x.id}
            key={x.name}
            onClick={() => connect({ connector: x })}
          >
            {isLoading && x.id === pendingConnector?.id && '…'}
          </button>
        ))}
      </div>

      <div>{error && error.message}</div>
    </div>
  );
};
