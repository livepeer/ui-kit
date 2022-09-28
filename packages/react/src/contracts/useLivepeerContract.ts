import { BaseContract, Signer } from 'ethers';
import {
  L1LivepeerChainId,
  L1Migrator,
  L2LivepeerChainId,
  L2Migrator,
  LivepeerChainId,
  LivepeerTokenFaucet,
  PollCreator,
  TestnetLivepeerChainId,
  getBondingManager,
  getController,
  getL1Migrator,
  getL2Migrator,
  getLivepeerToken,
  getLivepeerTokenFaucet,
  getMerkleSnapshot,
  getMinter,
  getPollCreator,
  getRoundsManager,
  getServiceRegistry,
  getTicketBroker,
} from 'livepeer/contracts';

import { useNetwork, useSigner } from 'wagmi';

import { QueryClientContext } from '../context';
import { useInternalQuery } from '../utils';

function useContract<
  TContract extends BaseContract,
  TChainId extends LivepeerChainId,
>(
  getContract: (
    chainId?: TChainId,
    signer?: Signer | null,
  ) => Promise<TContract> | TContract,
) {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [chain?.id, getContract],
    queryFn: async () => getContract(chain?.id as TChainId, signer),
    enabled: Boolean(chain?.id && signer && getContract),
    networkMode: 'always',
    cacheTime: 0,
  });
}

export function useBondingManager() {
  return useContract(getBondingManager);
}
export function useController() {
  return useContract(getController);
}
export function useL1Migrator() {
  return useContract<L1Migrator, L1LivepeerChainId>(getL1Migrator);
}
export function useL2Migrator() {
  return useContract<L2Migrator, L2LivepeerChainId>(getL2Migrator);
}
export function useLivepeerToken() {
  return useContract(getLivepeerToken);
}
export function useLivepeerTokenFaucet() {
  return useContract<LivepeerTokenFaucet, TestnetLivepeerChainId>(
    getLivepeerTokenFaucet,
  );
}
export function useMerkleSnapshot() {
  return useContract(getMerkleSnapshot);
}
export function useMinter() {
  return useContract(getMinter);
}
export function usePollCreator() {
  return useContract<PollCreator, L2LivepeerChainId>(getPollCreator);
}
export function useRoundsManager() {
  return useContract(getRoundsManager);
}
export function useServiceRegistry() {
  return useContract(getServiceRegistry);
}
export function useTicketBroker() {
  return useContract(getTicketBroker);
}
