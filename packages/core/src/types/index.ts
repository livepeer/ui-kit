export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export type LPMS = {
  /** Livepeer Media Server name */
  name: string;
  /** Base URL for the LPMS */
  baseUrl: string;
};

export interface LPMSProvider {
  getLPMS(): LPMS;
}

export {
  ArbRetryableTx__factory as ArbRetryableTxFactory,
  Inbox__factory as InboxFactory,
  L1BondingManager__factory as L1BondingManagerFactory,
  L1Migrator__factory as L1MigratorFactory,
  L2LPTGateway__factory as L2LPTGatewayFactory,
  L2Migrator__factory as L2MigratorFactory,
  NodeInterface__factory as NodeInterfaceFactory,
  BondingManager__factory as BondingManagerFactory,
  Controller__factory as ControllerFactory,
  LivepeerToken__factory as LivepeerTokenFactory,
  LivepeerTokenFaucet__factory as LivepeerTokenFaucetFactory,
  MerkleSnapshot__factory as MerkleSnapshotFactory,
  Minter__factory as MinterFactory,
  Poll__factory as PollFactory,
  PollCreator__factory as PollCreatorFactory,
  RoundsManager__factory as RoundsManagerFactory,
  ServiceRegistry__factory as ServiceRegistryFactory,
  TicketBroker__factory as TicketBrokerFactory,
} from './typechain';
export type {
  ArbRetryableTx,
  Inbox,
  L1BondingManager,
  L1Migrator,
  L2LPTGateway,
  L2Migrator,
  NodeInterface,
  BondingManager,
  Controller,
  LivepeerToken,
  LivepeerTokenFaucet,
  MerkleSnapshot,
  Minter,
  Poll,
  PollCreator,
  RoundsManager,
  ServiceRegistry,
  TicketBroker,
} from './typechain';
