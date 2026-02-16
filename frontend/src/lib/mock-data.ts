import { Project } from "@/components/ProjectCard";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "luna-classic",
    name: "Terra Luna Classic",
    ticker: "LUNC",
    sourceChain: "Terra",
    status: "voting",
    votes: 8420,
    votesRequired: 10000,
    tvlLocked: "$2.4M",
    description:
      "Former top-10 blockchain that collapsed in May 2022. Billions in locked value across DeFi protocols await rescue migration to Solana.",
  },
  {
    id: "ftx-token",
    name: "FTX Token",
    ticker: "FTT",
    sourceChain: "Ethereum",
    status: "approved",
    votes: 15200,
    votesRequired: 10000,
    tvlLocked: "$890K",
    description:
      "Exchange token from the defunct FTX platform. Remaining holders seek utility through migration to Solana DeFi ecosystem.",
  },
  {
    id: "iron-finance",
    name: "Iron Finance",
    ticker: "TITAN",
    sourceChain: "Polygon",
    status: "nominated",
    votes: 1230,
    votesRequired: 10000,
    tvlLocked: "$120K",
    description:
      "Algorithmic stablecoin project that suffered a bank run in June 2021. Partial collateral recovery possible via migration.",
  },
  {
    id: "wonderland",
    name: "Wonderland",
    ticker: "TIME",
    sourceChain: "Avalanche",
    status: "migrating",
    votes: 12400,
    votesRequired: 10000,
    tvlLocked: "$3.1M",
    description:
      "OHM-fork protocol that saw its treasury mismanaged. Community-driven effort to migrate remaining value to Solana.",
  },
  {
    id: "olympus-dao",
    name: "OlympusDAO v1",
    ticker: "OHM",
    sourceChain: "Ethereum",
    status: "completed",
    votes: 18900,
    votesRequired: 10000,
    tvlLocked: "$5.8M",
    description:
      "Original rebase token that pioneered protocol-owned liquidity. Successfully migrated to Solana with full token mapping.",
  },
  {
    id: "tomb-finance",
    name: "Tomb Finance",
    ticker: "TOMB",
    sourceChain: "Fantom",
    status: "voting",
    votes: 4500,
    votesRequired: 10000,
    tvlLocked: "$340K",
    description:
      "Algorithmic token pegged to FTM. Protocol ceased operations. Migration preserves remaining holder balances.",
  },
];

export const PLATFORM_STATS = {
  projectsMigrated: 12,
  totalValueRescued: "$48.2M",
  activeVotes: 24,
  uniqueHolders: "18.4K",
};
