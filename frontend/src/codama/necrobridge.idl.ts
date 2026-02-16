// Codama IDL Definition for NecroBridge Program
// Generates typed client from this single source of truth

export const NecrobridgeIdl = {
  version: "0.1.0",
  name: "necro_migrate",
  accounts: [
    {
      name: "Migration",
      docs: ["Represents a live protocol migration"],
      fields: [
        { name: "name", type: "string" },
        { name: "sourceChain", type: "u16" },
        { name: "sourceAddress", type: "string" },
        { name: "splMint", type: "publicKey" },
        { name: "snapshotRoot", type: "bytes32" },
        { name: "totalSupply", type: "u64" },
        { name: "claimedAmount", type: "u64" },
        { name: "isPaused", type: "bool" },
        { name: "admin", type: "publicKey" },
        { name: "governance", type: "publicKey" },
        { name: "createdAt", type: "i64" },
        { name: "bump", type: "u8" },
      ],
    },
    {
      name: "UserClaim",
      docs: ["Tracks which users have already claimed"],
      fields: [
        { name: "user", type: "publicKey" },
        { name: "migration", type: "publicKey" },
        { name: "amountClaimed", type: "u64" },
        { name: "timestamp", type: "i64" },
        { name: "bump", type: "u8" },
      ],
    },
    {
      name: "Governance",
      docs: ["Governance structure for voting"],
      fields: [
        { name: "migration", type: "publicKey" },
        { name: "totalVotes", type: "u64" },
        { name: "votesCast", type: "u64" },
        { name: "proposalCount", type: "u64" },
        { name: "isActive", type: "bool" },
        { name: "bump", type: "u8" },
      ],
    },
  ],
  instructions: [
    {
      name: "InitializeMigration",
      args: [
        { name: "name", type: "string" },
        { name: "sourceChain", type: "u16" },
        { name: "sourceAddress", type: "string" },
        { name: "snapshotRoot", type: "bytes32" },
        { name: "totalSupply", type: "u64" },
      ],
    },
    {
      name: "ClaimTokens",
      args: [
        { name: "amount", type: "u64" },
        { name: "merkleProof", type: "vec<[u8; 32]>" },
      ],
    },
    {
      name: "InitializeGovernance",
      args: [{ name: "totalVotes", type: "u64" }],
    },
    {
      name: "Vote",
      args: [
        { name: "proposalId", type: "u64" },
        { name: "voteWeight", type: "u64" },
      ],
    },
  ],
  errors: [
    { code: 0, name: "InvalidVAA", msg: "Invalid Wormhole VAA" },
    { code: 1, name: "ExceedsClaim", msg: "Claimed amount exceeds allocated" },
    { code: 2, name: "InvalidMerkleProof", msg: "Merkle proof verification failed" },
    { code: 3, name: "AlreadyClaimed", msg: "User has already claimed" },
  ],
};
