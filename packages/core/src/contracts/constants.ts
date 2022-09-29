import { Address } from '../types';

export const l1ChainId = {
  rinkeby: 4,
  mainnet: 1,
  // goerli: 5,
} as const;

export const l2ChainId = {
  arbitrum: 42_161,
  arbitrumRinkeby: 421_611,
  // arbitrumGoerli: 421_613,
} as const;

export const testnetChainId = {
  rinkeby: 4,
  arbitrumRinkeby: 421_611,
  // goerli: 5,
  // arbitrumGoerli: 421_613,
} as const;

export const mainnetChainId = {
  mainnet: 1,
  arbitrum: 42_161,
} as const;

export const allChainId = {
  ...mainnetChainId,
  ...testnetChainId,
} as const;

export type TestnetLivepeerChain = keyof typeof testnetChainId;
export type TestnetLivepeerChainId =
  typeof testnetChainId[TestnetLivepeerChain];

export type MainnetLivepeerChain = keyof typeof mainnetChainId;
export type MainnetLivepeerChainId =
  typeof mainnetChainId[MainnetLivepeerChain];

export type L1LivepeerChain = keyof typeof l1ChainId;
export type L1LivepeerChainId = typeof l1ChainId[L1LivepeerChain];

export type L2LivepeerChain = keyof typeof l2ChainId;
export type L2LivepeerChainId = typeof l2ChainId[L2LivepeerChain];

export type LivepeerChain = keyof typeof allChainId;
export type LivepeerChainId = typeof allChainId[LivepeerChain];

export type LivepeerAddressMetadata = {
  chainId: LivepeerChainId;
};

export type LivepeerAddress = {
  BondingManager: Address;
  Controller: Address;
  LivepeerToken: Address;
  Minter: Address;
  PollCreator: Address;
  RoundsManager: Address;
  ServiceRegistry: Address;
  TicketBroker: Address;
};

type TestnetAddress =
  | {
      chainId: TestnetLivepeerChainId;
      LivepeerTokenFaucet: Address;
    }
  | {
      chainId: MainnetLivepeerChainId;
    };

export type L2Address = LivepeerAddress &
  LivepeerAddressMetadata &
  TestnetAddress & {
    chainId: L2LivepeerChainId;

    L2LPTDataCache: Address;
    L2LPTGateway: Address;
    L2Migrator: Address;
    MerkleSnapshot: Address;
  };

export type L1Address = LivepeerAddress &
  LivepeerAddressMetadata &
  TestnetAddress & {
    chainId: L1LivepeerChainId;

    BridgeMinter: Address;
    L1Escrow: Address;
    L1LPTDataCache: Address;
    L1LPTGateway: Address;
    L1Migrator: Address;
    MerkleSnapshot: Address;
  };

export const arbitrumOneAddress: L2Address = {
  chainId: allChainId.arbitrum,

  BondingManager: '0x35Bcf3c30594191d53231E4FF333E8A770453e40',
  Controller: '0xD8E8328501E9645d16Cf49539efC04f734606ee4',
  L2LPTDataCache: '0xd78b6bD09cd28A83cFb21aFa0DA95c685A6bb0B1',
  L2LPTGateway: '0x6D2457a4ad276000A615295f7A80F79E48CcD318',
  L2Migrator: '0x148D5b6B4df9530c7C76A810bd1Cdf69EC4c2085',
  LivepeerToken: '0x289ba1701C2F088cf0faf8B3705246331cB8A839',
  MerkleSnapshot: '0x10736ffaCe687658F88a46D042631d182C7757f7',
  Minter: '0xc20DE37170B45774e6CD3d2304017fc962f27252',
  PollCreator: '0x8bb50806D60c492c0004DAD5D9627DAA2d9732E6',
  RoundsManager: '0xdd6f56DcC28D3F5f27084381fE8Df634985cc39f',
  ServiceRegistry: '0xC92d3A360b8f9e083bA64DE15d95Cf8180897431',
  TicketBroker: '0xa8bB618B1520E284046F3dFc448851A1Ff26e41B',
} as const;

export const mainnetAddress: L1Address = {
  chainId: allChainId.mainnet,

  BondingManager: '0x511bc4556d823ae99630ae8de28b9b80df90ea2e',
  BridgeMinter: '0x8dDDB96CF36AC8860f1DE5C7c4698fd499FAB405',
  Controller: '0xf96d54e490317c557a967abfa5d6e33006be69b3',
  L1Escrow: '0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A',
  L1LPTDataCache: '0x1d24838b35A9c138Ac157A852e19e948aD6323D7',
  L1LPTGateway: '0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676',
  L1Migrator: '0x21146B872D3A95d2cF9afeD03eE5a783DaE9A89A',
  LivepeerToken: '0x58b6a8a3302369daec383334672404ee733ab239',
  MerkleSnapshot: '0x24ebEd82c681f435E944BEEbFAEEAaE443D08438',
  Minter: '0x505F8c2ee81f1C6fa0D88e918eF0491222E05818',
  PollCreator: '0xBf824EDb6b94D9B52d972d5B25bCc19b4e6E3F3C',
  RoundsManager: '0x3984fc4ceeef1739135476f625d36d6c35c40dc3',
  ServiceRegistry: '0x406a112f3218b988c66778fd72fc8467f2601366',
  TicketBroker: '0x5b1ce829384eebfa30286f12d1e7a695ca45f5d2',
} as const;

export const arbitrumRinkebyAddress: L2Address = {
  chainId: allChainId.arbitrumRinkeby,

  BondingManager: '0xe42229d764F673EB3FB8B9a56016C2a4DA45ffd7',
  Controller: '0x9ceC649179e2C7Ab91688271bcD09fb707b3E574',
  L2LPTDataCache: '0xd348394B6Fa2F698eC6A26352390663047735388',
  L2LPTGateway: '0x7e0ba3791B23D0D577Cf8D09C4FDd5821222208C',
  L2Migrator: '0xe2f931931B8E04a01c99a2DeBA44A9FF782F688a',
  LivepeerToken: '0x743b8469e5f54cD765F1954604cD4dfA67b64bF6',
  LivepeerTokenFaucet: '0xb59253931a679D506F6DC5d58F0D680d9c708e26',
  MerkleSnapshot: '0x4756766C61e0755db5963Ab3505280Ddf1B36cD8',
  Minter: '0xE5bE54705D41DAaA33A043aa51dE472ED637C3d9',
  PollCreator: '0x7e3305D48489e43B7fBf318D575D5dF654EE175c',
  RoundsManager: '0x3BEc08BA9D8A5b44F5C5E38F654b3efE73555d58',
  ServiceRegistry: '0x22BEc4A040f9F3491F510E7BfbbbBEf347dbb8bf',
  TicketBroker: '0xD218f6eA99907C2EDB889A151DF326aCd0F70D88',
} as const;

export const rinkebyAddress: L1Address = {
  chainId: allChainId.rinkeby,

  BondingManager: '0xC40df4db2f99e7e235780A93B192F1a934f0c45b',
  BridgeMinter: '0x527416c2AE642e3e1b24C1d10816551183885BBA',
  Controller: '0x9a9827455911a858E55f07911904fACC0D66027E',
  L1Escrow: '0x192683D5Cb514da2081C543f6887EeaFD76EC64a',
  L1LPTDataCache: '0xD218f6eA99907C2EDB889A151DF326aCd0F70D88',
  L1LPTGateway: '0x831C51Cd8A38C3E42D98Acd77F06BF537D29800e',
  L1Migrator: '0x4756766C61e0755db5963Ab3505280Ddf1B36cD8',
  LivepeerToken: '0xEf5F154eb0261CB0331a28BC0fB60CA73E716617',
  LivepeerTokenFaucet: '0xdeD94096FcB94CC44862E8c84a0cF8aa2e8aE8dA',
  MerkleSnapshot: '0xC83978D78D2B089253f4FF9f1fE3768a6ca36578',
  Minter: '0x187E962A5a1CD2cE2D133e80182A82f0eBd29Ef5',
  PollCreator: '0x6749dFa7990Aa27E0B82dCD735C8100BC711AeE7',
  RoundsManager: '0x6c2A6B5cFDB30DAC34BD54af06611267e66fB07F',
  ServiceRegistry: '0xE9C2d88ffcCe434000aFAc366Db840b8E55459E5',
  TicketBroker: '0x242f1361CCdaAe8CCdf8539DE183Cb518856254f',
} as const;
