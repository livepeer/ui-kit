import { Signer } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';

import { Address } from '../types';
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
import {
  BondingManagerFactory,
  ControllerFactory,
  L1MigratorFactory,
  L2MigratorFactory,
  LivepeerTokenFactory,
  LivepeerTokenFaucetFactory,
  MerkleSnapshotFactory,
  MinterFactory,
  PollCreatorFactory,
  RoundsManagerFactory,
  ServiceRegistryFactory,
  TicketBrokerFactory,
} from './types';

type SignerOrNil = Signer | null | undefined;

type LivepeerChainIdOrNil = LivepeerChainId | undefined | null;
type L1LivepeerChainIdOrNil = L1LivepeerChainId | null | undefined;
type L2LivepeerChainIdOrNil = L2LivepeerChainId | null | undefined;
type TestnetLivepeerChainIdOrNil = TestnetLivepeerChainId | null | undefined;

const getL1ContractAddressForChain = <K extends keyof L1Address>(
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

const getL2ContractAddressForChain = <K extends keyof L2Address>(
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

export const getController = (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return chainId === allChainId.mainnet || chainId === allChainId.rinkeby
    ? ControllerFactory.connect(
        getL1ContractAddressForChain(chainId, 'Controller'),
        signer as Signer,
      )
    : ControllerFactory.connect(
        getL2ContractAddressForChain(chainId, 'Controller'),
        signer as Signer,
      );
};

export const getL1Migrator = (
  chainId: L1LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return L1MigratorFactory.connect(
    getL1ContractAddressForChain(chainId, 'L1Migrator'),
    signer as Signer,
  );
};

export const getL2Migrator = (
  chainId: L2LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return L2MigratorFactory.connect(
    getL2ContractAddressForChain(chainId, 'L2Migrator'),
    signer as Signer,
  );
};

export const getPollCreator = (
  chainId: L2LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return PollCreatorFactory.connect(
    getL2ContractAddressForChain(chainId, 'PollCreator'),
    signer as Signer,
  );
};

export const getContractAddressFromController = async (
  chainId: LivepeerChainIdOrNil,
  name:
    | Exclude<keyof L1Address | keyof L2Address, 'chainId'>
    | 'LivepeerTokenFaucet',
  signer: SignerOrNil,
): Promise<Address> => {
  const hash = keccak256(toUtf8Bytes(name));
  const controller = getController(chainId, signer);
  const address = await controller.getContract(hash);

  return address as Address;
};

export const getLivepeerToken = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return LivepeerTokenFactory.connect(
    await getContractAddressFromController(chainId, 'LivepeerToken', signer),
    signer as Signer,
  );
};

export const getLivepeerTokenFaucet = async (
  chainId: TestnetLivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  if (
    chainId !== allChainId.arbitrumRinkeby &&
    chainId !== allChainId.rinkeby
  ) {
    throw new IncorrectChainIdError();
  }

  return LivepeerTokenFaucetFactory.connect(
    await getContractAddressFromController(
      chainId,
      'LivepeerTokenFaucet',
      signer,
    ),
    signer as Signer,
  );
};

export const getBondingManager = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return BondingManagerFactory.connect(
    await getContractAddressFromController(chainId, 'BondingManager', signer),
    signer as Signer,
  );
};

export const getRoundsManager = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return RoundsManagerFactory.connect(
    await getContractAddressFromController(chainId, 'RoundsManager', signer),
    signer as Signer,
  );
};

export const getMinter = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return MinterFactory.connect(
    await getContractAddressFromController(chainId, 'Minter', signer),
    signer as Signer,
  );
};

export const getMerkleSnapshot = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return MerkleSnapshotFactory.connect(
    await getContractAddressFromController(chainId, 'MerkleSnapshot', signer),
    signer as Signer,
  );
};

export const getServiceRegistry = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return ServiceRegistryFactory.connect(
    await getContractAddressFromController(chainId, 'ServiceRegistry', signer),
    signer as Signer,
  );
};

export const getTicketBroker = async (
  chainId: LivepeerChainIdOrNil,
  signer: SignerOrNil,
) => {
  return TicketBrokerFactory.connect(
    await getContractAddressFromController(chainId, 'TicketBroker', signer),
    signer as Signer,
  );
};
