export const L1MigratorABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_inbox',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bondingManagerAddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ticketBrokerAddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2MigratorAddr',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'seqNo',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'stake',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'delegatedStake',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'delegate',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct IMigrator.MigrateDelegatorParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'MigrateDelegatorInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'seqNo',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserve',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct IMigrator.MigrateSenderParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'MigrateSenderInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'seqNo',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256',
          },
          {
            internalType: 'uint256[]',
            name: 'unbondingLockIds',
            type: 'uint256[]',
          },
        ],
        indexed: false,
        internalType: 'struct IMigrator.MigrateUnbondingLocksParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'MigrateUnbondingLocksInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'seqNum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'TxToL2',
    type: 'event',
  },
  {
    inputs: [],
    name: 'bondingManagerAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
    ],
    name: 'getMigrateDelegatorParams',
    outputs: [
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'stake',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'delegatedStake',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'delegate',
            type: 'address',
          },
        ],
        internalType: 'struct IMigrator.MigrateDelegatorParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
    ],
    name: 'getMigrateSenderParams',
    outputs: [
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserve',
            type: 'uint256',
          },
        ],
        internalType: 'struct IMigrator.MigrateSenderParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '_unbondingLockIds',
        type: 'uint256[]',
      },
    ],
    name: 'getMigrateUnbondingLocksParams',
    outputs: [
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'l1Addr',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'l2Addr',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256',
          },
          {
            internalType: 'uint256[]',
            name: 'unbondingLockIds',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct IMigrator.MigrateUnbondingLocksParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'inbox',
    outputs: [
      {
        internalType: 'contract IInbox',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l2MigratorAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '_maxGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_gasPriceBid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxSubmissionCost',
        type: 'uint256',
      },
    ],
    name: 'migrateDelegator',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '_maxGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_gasPriceBid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxSubmissionCost',
        type: 'uint256',
      },
    ],
    name: 'migrateSender',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_l1Addr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_l2Addr',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '_unbondingLockIds',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '_sig',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '_maxGas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_gasPriceBid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxSubmissionCost',
        type: 'uint256',
      },
    ],
    name: 'migrateUnbondingLocks',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ticketBrokerAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
