export const IDL = {
  version: "0.1.0",
  name: "necro_migrate",
  instructions: [
    {
      name: "initializeMigration",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "migrationAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "sourceChain",
          type: "u16",
        },
        {
          name: "sourceAddress",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "snapshotRoot",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "totalSupply",
          type: "u64",
        },
      ],
    },
    {
      name: "claimTokens",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userClaim",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "migrationAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "merkleProof",
          type: {
            vec: {
              array: ["u8", 32],
            },
          },
        },
        {
          name: "leafIndex",
          type: "u32",
        },
      ],
    },
    {
      name: "finalizeMigration",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Migration",
      fields: [
        {
          name: "name",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "admin",
          type: "publicKey",
        },
        {
          name: "sourceChain",
          type: "u16",
        },
        {
          name: "sourceAddress",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "snapshotRoot",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "totalSupply",
          type: "u64",
        },
        {
          name: "migratedAmount",
          type: "u64",
        },
        {
          name: "isActive",
          type: "bool",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "UserClaim",
      fields: [
        {
          name: "user",
          type: "publicKey",
        },
        {
          name: "isClaimed",
          type: "bool",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidOperation",
      msg: "Invalid operation",
    },
    {
      code: 6001,
      name: "MigrationNotActive",
      msg: "Migration is not active",
    },
    {
      code: 6002,
      name: "InvalidAmount",
      msg: "Invalid amount",
    },
    {
      code: 6003,
      name: "AlreadyClaimed",
      msg: "User has already claimed",
    },
    {
      code: 6004,
      name: "InvalidMerkleProof",
      msg: "Invalid merkle proof",
    },
    {
      code: 6005,
      name: "Unauthorized",
      msg: "Unauthorized",
    },
  ],
};
