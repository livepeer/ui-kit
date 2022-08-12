import { Signer } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';

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
} from '../../constants';

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
} from '../../types';

const getL1ContractAddressForChain = <K extends keyof L1Address>(
  chainId: L1LivepeerChainId,
  contractKey: K,
) =>
  chainId === allChainId.mainnet
    ? mainnetAddress[contractKey]
    : rinkebyAddress[contractKey];

const getL2ContractAddressForChain = <K extends keyof L2Address>(
  chainId: LivepeerChainId,
  contractKey: K,
) =>
  chainId === allChainId.arbitrum
    ? arbitrumOneAddress[contractKey]
    : arbitrumRinkebyAddress[contractKey];

export const getController = (chainId: LivepeerChainId, signer: Signer) => {
  return chainId === 1 || chainId === 4
    ? ControllerFactory.connect(
        getL1ContractAddressForChain(chainId, 'Controller'),
        signer,
      )
    : ControllerFactory.connect(
        getL2ContractAddressForChain(chainId, 'Controller'),
        signer,
      );
};

export const getL1Migrator = (chainId: L1LivepeerChainId, signer: Signer) => {
  return L1MigratorFactory.connect(
    getL1ContractAddressForChain(chainId, 'L1Migrator'),
    signer,
  );
};

export const getL2Migrator = (chainId: L2LivepeerChainId, signer: Signer) => {
  return L2MigratorFactory.connect(
    getL2ContractAddressForChain(chainId, 'L2Migrator'),
    signer,
  );
};

export const getPollCreator = (chainId: L2LivepeerChainId, signer: Signer) => {
  return PollCreatorFactory.connect(
    getL2ContractAddressForChain(chainId, 'PollCreator'),
    signer,
  );
};

export const getContractAddressFromController = async (
  chainId: LivepeerChainId,
  name:
    | Exclude<keyof L1Address | keyof L2Address, 'chainId'>
    | 'LivepeerTokenFaucet',
  signer: Signer,
) => {
  const hash = keccak256(toUtf8Bytes(name));
  const controller = getController(chainId, signer);
  const address = await controller.getContract(hash);

  return address;
};

export const getLivepeerToken = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return LivepeerTokenFactory.connect(
    await getContractAddressFromController(chainId, 'LivepeerToken', signer),
    signer,
  );
};

export const getLivepeerTokenFaucet = async (
  chainId: TestnetLivepeerChainId,
  signer: Signer,
) => {
  return LivepeerTokenFaucetFactory.connect(
    await getContractAddressFromController(
      chainId,
      'LivepeerTokenFaucet',
      signer,
    ),
    signer,
  );
};

export const getBondingManager = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return BondingManagerFactory.connect(
    await getContractAddressFromController(chainId, 'BondingManager', signer),
    signer,
  );
};

export const getRoundsManager = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return RoundsManagerFactory.connect(
    await getContractAddressFromController(chainId, 'RoundsManager', signer),
    signer,
  );
};

export const getMinter = async (chainId: LivepeerChainId, signer: Signer) => {
  return MinterFactory.connect(
    await getContractAddressFromController(chainId, 'Minter', signer),
    signer,
  );
};

export const getMerkleSnapshot = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return MerkleSnapshotFactory.connect(
    await getContractAddressFromController(chainId, 'MerkleSnapshot', signer),
    signer,
  );
};

export const getServiceRegistry = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return ServiceRegistryFactory.connect(
    await getContractAddressFromController(chainId, 'ServiceRegistry', signer),
    signer,
  );
};

export const getTicketBroker = async (
  chainId: LivepeerChainId,
  signer: Signer,
) => {
  return TicketBrokerFactory.connect(
    await getContractAddressFromController(chainId, 'TicketBroker', signer),
    signer,
  );
};
