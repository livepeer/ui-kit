import {
  L1Address,
  L1LivepeerChainId,
  L2Address,
  L2LivepeerChainId,
  LivepeerChainId,
  TestnetLivepeerChainId,
  allChainId,
  arbitrumOneAddress,
  arbitrumRinkebyAddress,
  mainnetAddress,
  rinkebyAddress,
} from './constants';
import { IncorrectChainIdError } from './errors';

export type LivepeerChainIdOrNil = LivepeerChainId | undefined | null;
export type L1LivepeerChainIdOrNil = L1LivepeerChainId | null | undefined;
export type L2LivepeerChainIdOrNil = L2LivepeerChainId | null | undefined;
export type TestnetLivepeerChainIdOrNil =
  | TestnetLivepeerChainId
  | null
  | undefined;

export const getL1ContractAddressForChain = <K extends keyof L1Address>(
  chainId: L1LivepeerChainIdOrNil,
  contractKey: K,
) => {
  if (chainId !== allChainId.mainnet && chainId !== allChainId.rinkeby) {
    throw new IncorrectChainIdError();
  }

  return chainId === allChainId.mainnet
    ? mainnetAddress[contractKey]
    : rinkebyAddress[contractKey];
};

export const getL2ContractAddressForChain = <K extends keyof L2Address>(
  chainId: LivepeerChainIdOrNil,
  contractKey: K,
) => {
  if (
    chainId !== allChainId.arbitrum &&
    chainId !== allChainId.arbitrumRinkeby
  ) {
    throw new IncorrectChainIdError();
  }

  return chainId === allChainId.arbitrum
    ? arbitrumOneAddress[contractKey]
    : arbitrumRinkebyAddress[contractKey];
};
