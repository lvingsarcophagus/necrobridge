'use client';

import Link from 'next/link';
import { ProcessDiagram } from '@/components/docs/ProcessDiagram';

export default function DocsPage() {
  const sections = [
    { 
      title: 'Overview', 
      id: 'overview',
      content: 'NecroBridge is the definitive protocol resurrection platform on Solana. We provide trustless infrastructure for cross-chain token migrations, enabling abandoned protocols to be revived and redeployed through community governance. Every decision is made transparently, on-chain, with full community participation.',
      subsections: [
        {
          title: 'What is Protocol Resurrection?',
          content: 'Protocol resurrection is the process of reviving abandoned or legacy blockchain protocols by migrating their communities and assets to Solana. Many protocols become "dead" due to: (1) Teams moving to other projects, (2) Chains becoming obsolete (Terra Luna collapse, Cosmos downtime), (3) Economics no longer viable on original chain, (4) Community wanting a fresh start. NecroBridge enables communities to resurrect these protocols trustlessly, without requiring original team involvement, using Merkle proofs and Wormhole NTT technology.'
        },
        {
          title: 'Why Solana?',
          content: 'Solana offers irreplaceable advantages: (1) 400ms block times for rapid finality, (2) Sub-penny transaction costs ($0.00025 typical), (3) Vibrant DeFi ecosystem with Jupiter, Orca, Marinade, (4) High throughput enables complex governance on-chain, (5) Low-cost means even small holders can participate in voting. Crucially, low costs democratize governance—whales cannot dominate through transaction spam.'
        }
      ]
    },
    { 
      title: 'Why Governance is Necessary', 
      id: 'governance-necessity',
      content: 'Without governance, token resurrection becomes centralized, opaque, and subject to whales or insiders making unilateral decisions. Transparent, decentralized governance ensures community consensus.',
      subsections: [
        {
          title: 'The Problem Without Governance',
          content: 'Imagine a whale unilaterally decides to resurrect a scam token on Solana. Without governance: (1) They fund the migration alone, (2) They control all voting power, (3) They mint tokens for themselves, (4) Retail community never gets asked. This creates a "zombie token" controlled by one person. Traditional protocols rely on founder approval, but dead projects have no founders—or founders who never respond.'
        },
        {
          title: 'How Governance Fixes This',
          content: 'NecroBridge enforces decentralized governance: (1) Anyone can nominate a protocol, (2) Community members vote with proportional voting power (Quadratic voting prevents whale dominance), (3) Minimum 50 unique wallets + 80% approval required, (4) All votes recorded on-blockchain, (5) Transparent leaderboard shows who voted and how much power they used. This ensures: genuine community consensus, no single actor can unilaterally resurrect a token, and decisions are auditable forever.'
        },
        {
          title: 'Democratic Safeguards Built In',
          content: 'Our governance includes multiple safeguards: (1) Quadratic voting (sqrt of power) prevents whale dominance, (2) 50-wallet minimum ensures community (not just 1-2 people), (3) Block height snapshots prevent front-running, (4) On-chain verification ensures database matches smart contracts, (5) 80% threshold for approval prevents narrow majorities from forcing changes, (6) Emergency pause allows community to halt migrations if issues arise.'
        }
      ]
    },
    {
      title: 'Voting System Deep Dive',
      id: 'voting-system',
      content: 'NecroBridge uses Quadratic Voting: a mathematically elegant system where vote power = sqrt(token amount). This prevents whales from dominating while still rewarding larger holders.',
      subsections: [
        {
          title: 'How Quadratic Voting Works',
          content: 'Formula: Vote Power = sqrt(SOL Amount Staked)\n\nExample: Comparing a whale vs. 100 small holders\n- Whale with 10,000 SOL → 100 power\n- 100 people with 1 SOL each → 100 power (1.0 each)\n\nResult: EQUAL power. The whale cannot dominate.\n\nWhy this matters:\n(1) Prevents wealthy investors from buying governance\n(2) Encourages coalition-building (need community consensus)\n(3) Makes voting power additive (10 votes of 10 power = 1 vote of 100 power)\n(4) Still rewards larger holders (but not exponentially)\n(5) Proven by RadicalxChange to maximize fairness + incentive alignment'
        },
        {
          title: 'Minimum Wallet Threshold (50 Unique Wallets)',
          content: 'Approval requires BOTH: (1) ≥80% vote power approval, AND (2) ≥50 unique wallets voted\n\nWhy 50?\n- Prevents 1-2 whales from staking huge amounts and claiming consensus\n- Ensures genuine community involvement\n- Represents a viable DAO size (can make collective decisions)\n- Still small enough to achieve quorum in a reasonable time\n\nExample: A whale with 100,000 SOL could achieve 80% approval alone (316 power), but CANNOT achieve it without 50+ other people voting. This forces genuine community building.'
        },
        {
          title: 'Vote Tracking & Transparency',
          content: 'Every vote is recorded publicly:\n- Wallet address (pseudonymous)\n- SOL amount staked (transparent)\n- Direction (yes/no)\n- Timestamp\n- Merkle proof (verifiable on-chain)\n\nYou can see EXACTLY: Who voted, how much they voted, what they voted for, when they voted. Zero hidden votes. Zero backroom deals. This radical transparency is what decentralization means.'
        },
        {
          title: 'Why Quadratic is Better Than 1-Token = 1-Vote',
          content: 'Common voting: 1 token = 1 vote\n❌ Rich people dominate\n❌ Prevents fair governance\n❌ Encourages wealth concentration\n\nQuadratic voting: sqrt(tokens) = votes\n✓ Proportional rewards to holders\n✓ Prevents dominance by any single actor\n✓ Encourages smaller holders to participate\n✓ Mathematically optimal for collective decision-making\n✓ Used by DeFi protocols (Curve, Aave, etc.)\n\nEvery vote matters in Quadratic Voting. Even a 1-SOL voter helps move the needle if enough small holders band together.'
        }
      ]
    },
    {
      title: 'Path A vs Path B: Two Migration Routes',
      id: 'migration-paths',
      content: 'NecroBridge supports two fundamentally different resurrection paths, each with different legal, governance, and community implications. Understanding when to use each is critical.',
      subsections: [
        {
          title: 'Path A: "Sunrise Route" (Official Revival)',
          content: '🌅 OFFICIAL CHANNEL\n\nWHEN TO USE:\n- Original protocol team/founders are contactable and willing\n- You want to preserve original brand and governance\n- You want to minimize legal risk\n- Original team approves the resurrection\n\nHOW IT WORKS:\n1. Original team initiates Wormhole NTT setup\n2. Official contract address registered on Solana\n3. Community votes to confirm (for transparency)\n4. Tokens migrated to "canonical" Solana contract\n5. Governance migrates with tokens→original team controls DAO\n\nADVANTAGES:\n✓ Brand preserved ("ZombieToken" not "ZombieToken V2")\n✓ Original team retains governance (if they want)\n✓ Zero legal/trademark risk (original team approved)\n✓ Holders get "official" version (higher perceived value)\n✓ Original intellectual property maintained\n✓ Community recognizes as continuation\n\nDISADVANTAGES:\n✗ Requires original team coordination (slow)\n✗ Teams may be unresponsive (founders disappeared)\n✗ Team may impose restrictions on governance\n✗ Centralized if team controls DAO alone\n\nEXAMPLE:\nSUSHI token founders approve resurrection on Solana. SUSHI team works with NecroBridge to set up NTT. New Solana SUSHI contract is the "official" one. Original SUSHI holders claim tokens. SUSHI DAO governance moves to Solana.'
        },
        {
          title: 'Path B: "Community Hard Fork" (V2 Revival)',
          content: '⚡ COMMUNITY-LED CHANNEL\n\nWHEN TO USE:\n- Original team is unreachable/doesn\'t respond\n- Protocol founders have abandoned project\n- Community wants to take full ownership\n- You want zero dependency on original team\n- Project is "truly dead" (no team)\n\nHOW IT WORKS:\n1. Community nominates the protocol\n2. Community votes to approve resurrection (50+ wallets, 80%+ support)\n3. New smart contract deployed (NOT official)\n4. Contract branded "ZombieToken Community V2" or "ZombieToken Fork"\n5. Snapshot taken of original chain\n6. Holders migrate to V2 and get governance\n7. Community DAO controls everything\n\nADVANTAGES:\n✓ No team coordination needed (works for abandoned projects)\n✓ True community ownership (100%)\n✓ Can deploy immediately\n✓ Enables resurrection of truly dead projects\n✓ Community votes on all governance decisions\n✓ No founder veto power\n✓ Truly decentralized\n\nDISADVANTAGES:\n✗ NOT the "official" token (different contract)\n✗ Branding risk (must use "V2" or "Fork")\n✗ Legal risk if original team resurfaces and disputes\n✗ Lower perceived value (not canonical)\n✗ Trademark/IP concerns if not careful with naming\n✗ Community must self-govern (decentralization is harder)\n\nCRITICAL: Must include disclaimer in UI:\n"⚠️ This is NOT the official ZombieToken. This is a community-led revival (V2). The original team is not involved. If original founders return, they may dispute this fork."\n\nEXAMPLE:\nA popular DeFi protocol from Terra Luna collapse has no active team. Community nominates it for resurrection. Votes pass (50+ wallets, 85% approval). NecroBridge deploys new "Luna Community V2" contract on Solana. Original Luna holders claim LUNA-V2 tokens. Community DAO manages protocol.'
        },
        {
          title: 'Detailed Comparison Table',
          content: '\n┌─────────────────────────────────────┬──────────────────────────┬──────────────────────────┐\n│ Criteria                              │ Path A (Sunrise/Official) │ Path B (Community V2)     │\n├─────────────────────────────────────┼──────────────────────────┼──────────────────────────┤\n│ Team Involvement Required           │ ✓ YES (must approve)     │ ✗ NO                     │\n│ Brand Preserved                     │ ✓ YES (original name)    │ ✗ NO (must use V2/Fork)  │\n│ Governance Control                  │ ◐ Shared (team + comm)   │ ✓ 100% Community         │\n│ Legal Risk (Trademark)              │ ✓ MINIMAL (approved)     │ ⚠ MODERATE (disputes)    │\n│ IP Rights                           │ ✓ Original preserved     │ ✗ Forked/different       │\n│ Speed to Deploy                     │ ✗ SLOW (needs team)      │ ✓ FAST (community vote)  │\n│ Decentralization Level              │ ◐ Medium (dependent)     │ ✓ HIGH (autonomous)      │\n│ Market Perception                   │ ✓ "Official" (premium)   │ ◐ "Community" (risky)    │\n│ Best For                            │ Active team projects     │ Abandoned projects       │\n│ Claim Eligibility                   │ ✓ Original holders       │ ✓ Original holders       │\n└─────────────────────────────────────┴──────────────────────────┴──────────────────────────┘'
        },
        {
          title: 'Choosing Your Path: Decision Tree',
          content: 'START: Protocol you want to resurrect exists\n↓\nQ1: Can you contact the original team?\n├─ YES → Q2: Do they respond positively?\n│       ├─ YES → ✅ USE PATH A (Sunrise)\n│       │         They approve, you coordinate\n│       └─ NO → Q3: Do they respond but say NO?\n│               ├─ YES → ⚠️ BLOCKED (respect their wishes)\n│               └─ NO → Continue to Q3\n├─ NO → Can\'t reach team\nQ3: Is the project truly abandoned (no updates in 1+ year, no social presence)?\n├─ YES → ✅ USE PATH B (Community V2)\n│         Community can resurrect without permission\n└─ NO → Check if founders have stated they don\'t want resurrection\n        If they have → BLOCKED\n        If unclear → USE PATH B WITH EXTRA DISCLAIMER IN UI'
        },
        {
          title: 'What About Legal Disputes?',
          content: 'Path A: Minimal risk (team approved, they can\'t sue you)\nPath B: Moderate risk (if team resurfaces, they could claim trademark infringement)\n\nPath B Risk Mitigation:\n1. Always brand as "Community V2" or "Community Fork" in UI\n2. Include disclaimer: "This is NOT official. Original team not involved."\n3. Publish IPFS snapshot so community can verify fairness\n4. Lock governance multisig (team can\'t unilaterally change)\n5. If original team demands takedown, community can migrate to new contract\n\nIn practice: Very few projects go to court over a fork. The community resurrection is a GIFT to the original asset holders (they get revived value they thought was gone). Original founders rarely fight this because:\n- Can\'t trademark dead currency (not actively maintained)\n- "Community Fork" naming is legally defensible as fair use\n- Fighting costs money; cooperating costs nothing\n\nYet: Always disclose Path B status to users. Transparency = protection.'
        }
      ]
    },
    {
      title: 'Technical Architecture',
      id: 'technical',
      content: 'NecroBridge\'s technical foundation is built on proven Solana and cross-chain technologies, with additional security layers for governance and claim verification.',
      diagram: <ProcessDiagram />,
      subsections: [
        {
          title: 'Wormhole NTT Integration',
          content: 'Native Token Transfer (NTT) is a Wormhole primitive that bridges tokens between chains with: (1) Rate limiting (prevents massive flash attacks), (2) Governance controls (community votes on bridge parameters), (3) Automated token burning on source chain, (4) Atomic swaps (no stuck tokens). We use NTT as our canonical bridge layer, ensuring tokens are securely transferred with cryptographic verification.'
        },
        {
          title: 'On-Chain Governance (Via Solana Programs)',
          content: 'Smart contracts manage: (1) Nomination creation, (2) Vote tracking with quadratic voting calculation, (3) Merkle proof verification for claims, (4) DAO treasury management, (5) Emergency pause mechanism. All governed by Anchor programs deployed to devnet/mainnet. Every vote is immutable, on-chain, and auditable forever.'
        },
        {
          title: 'Snapshot & Merkle Proof System',
          content: 'Before migration: (1) We capture cryptographic hash of all token holders on source chain at a specific block height, (2) Generate Merkle tree from holdings (each holder = leaf), (3) Publish root hash on-chain, (4) Users claim with Merkle proofs (proving they were in the tree). Benefits: (a) No reliance on centralized database for claims, (b) Cryptographically verifiable (impossible to fake), (c) No re-validation needed (proof is immutable), (d) Can be audited on IPFS.'
        },
        {
          title: 'Frontend-to-On-Chain Sync Verification',
          content: 'Critical security layer: Before allowing any claim, we verify on-chain that: (1) Migration account exists and is active, (2) User hasn\'t already claimed, (3) Token vault has sufficient balance. Prevents frontend database (Firestore) from being a source of truth. On-chain smart contract is always authoritative.'
        },
        {
          title: 'DAO Liquidity Pool Reserve',
          content: 'To prevent "day 2 death" (token has no liquidity): (1) Each migration reserves 1-20% of new token supply in a DAO-controlled LP, (2) LP is deployed on Meteora Dynamic Vaults (auto-adjusts fees), (3) Community votes on LP parameters, (4) LP tokens locked in governance multisig (can\'t be withdrawn unilaterally), (5) Enables sustainable trading volume from day 1.'
        }
      ]
    },
    {
      title: 'Risk Mitigations',
      id: 'risk-mitigations',
      content: 'NecroBridge acknowledges and mitigates 5 critical risks that could enable attacks or governance failures.',
      subsections: [
        {
          title: 'Risk #1: Whale Hijacking (Governance Attack)',
          content: 'Risk: A whale with 10,000 SOL could fund a migration alone and control all voting.\n\nMitigation:\n✓ Quadratic Voting: 10,000 SOL = sqrt(10,000) = 100 power (not 10,000)\n✓ 50-Wallet Minimum: Can\'t approve without 50+ unique wallets voting\n✓ 80% Threshold: Needs supermajority consensus, not just bare majority\n✓ Result: Whale still has influence, but cannot dominate alone. Must build community.'
        },
        {
          title: 'Risk #2: Ghost Snapshot (Front-Running)',
          content: 'Risk: Users don\'t know WHEN the snapshot was taken. Someone could move tokens after snapshot, before claiming.\n\nMitigation:\n✓ Explicit Block Height: "Snapshot at Sepolia block #6,500,000, 2026-02-20 14:32 UTC"\n✓ IPFS Publication: Snapshot CSV published for public audit\n✓ Immutable Timestamp: Merkle root recorded on-chain with block height\n✓ UI Disclosure: "Only tokens at [BLOCK] are eligible"\n✓ Result: Completely transparent. Users know exact cutoff. Can\'t game the system.'
        },
        {
          title: 'Risk #3: Liquidity Fragmentation ("Day 2 Death")',
          content: 'Risk: Token resurrected with 1,000 holders, but zero liquidity pools. Token = worthless.\n\nMitigation:\n✓ DAO LP Reserve: 1-20% of token supply locked in governance-controlled LP\n✓ Meteora Integration: Dynamic vaults automatically manage spread/fees\n✓ 90-Day Lockup: LP tokens locked (can\'t be withdrawn immediately)\n✓ Community Voting: Can extend lockup or redirect LP treasury\n✓ Result: Guaranteed day-1 liquidity. Token is tradeable, not ghost asset.'
        },
        {
          title: 'Risk #4: Legal & IP Issues (Trademark Disputes)',
          content: 'Risk: Path B (community fork) could face legal challenge from original team.\n\nMitigation:\n✓ Clear Path A vs Path B Branding: Users see "Community V2" vs "Official"\n✓ Path B Disclaimer: "This is NOT official. Original team not involved."\n✓ Transparent Governance: Voting records show community consensus\n✓ IPFS Audit: Snapshot and governance stored immutably\n✓ Multisig DAO: Community controls funds (not one person)\n✓ Result: Defensible as community fork (fair use). Minimizes legal exposure.'
        },
        {
          title: 'Risk #5: Frontend-to-On-Chain Desync',
          content: 'Risk: Database says "Approved", but smart contract says "Pending". User clicks claim, gets error.\n\nMitigation:\n✓ On-Chain Verification: Before claim, verify migration account is active\n✓ User Claim PDA Check: Verify user hasn\'t already claimed\n✓ Token Vault Balance Check: Verify LP has funds\n✓ Solana = Source of Truth: Database only used for leaderboard\n✓ Clear Errors: User sees "Migration not finalized on-chain yet"\n✓ Result: No race conditions. User experience matches blockchain reality.'
        }
      ]
    },
    {
      title: 'Security & Transparency',
      id: 'security-transparency',
      content: 'NecroBridge is built on transparency. Every decision, vote, and transaction is auditable and immutable. We believe in "trust, but verify"—and we make verification the default.',
      subsections: [
        {
          title: 'On-Chain Auditability',
          content: 'Every critical operation is on-chain and immutable:\n- Vote submissions are recorded on Solana\n- Snapshots are hashed and stored\n- Migration initialization is tracked\n- Claim verification uses Merkle proofs\n- DAO treasury operations are transparent\n\nYou can explore all this data on Solana Explorer. Zero hidden operations. Zero backroom governance.'
        },
        {
          title: 'Smart Contract Audits',
          content: 'Our Anchor programs are designed for auditability:\n- Open-source code (GitHub)\n- Minimal, focused programs (easier to audit)\n- Use of proven Solana patterns\n- Input validation on all user-facing functions\n- Error codes for every failure case\n- Event emission for all critical state changes'
        },
        {
          title: 'Snapshot Transparency',
          content: 'Before any migration, we publish:\n- Block height of snapshot (specific, immutable)\n- Timestamp (when it was taken)\n- Merkle root (hash of all holders)\n- Top 100 holders (anonymized, with token amounts)\n- IPFS link to full CSV (anyone can download, verify)\n\nThis allows the community to:\n- Verify they were included\n- Audit for fairness\n- Detect any unusual distributions\n- Challenge snapshot before claims open'
        },
        {
          title: 'Vote Transparency',
          content: 'Every vote is public (wallet address pseudonymous):\n- Voting power recorded (SOL staked)\n- Direction recorded (yes/no)\n- Timestamp recorded\n- Block height recorded (for verification)\n\nVoting leaderboard shows:\n- Total votes per wallet\n- Historical voting patterns\n- Largest contributors to consensus\n- Real-time approval percentage\n\nThis allows community to see if governance is healthy or being gamed.'
        },
        {
          title: 'Emergency & Pause Mechanisms',
          content: 'If something goes wrong (exploit discovered, migrationfalters), community can:\n1. Emergency Pause: Multi-sig DAO can halt all migrations\n2. Governance Vote: Community can pause specific projects\n3. Recovery Protocol: Can restart migrations with lessons learned\n4. Snapshot Rollback: If hack discovered, can use earlier snapshot\n\nNo single person can trigger emergency pause. Requires DAO consensus. This prevents both (a) censorship (one actor blocking projects) and (b) theft (one actor stealing DAO funds).'
        }
      ]
    },
    {
      title: 'FAQs',
      id: 'faq',
      content: 'Transparent answers to questions about governance, resurrection logistics, and risk.',
      subsections: [
        {
          title: 'Why would a whale support governance if Quadratic Voting reduces their power?',
          content: 'Good question. Answer: Smart whales realize that governance legitimacy is MORE valuable than voting dominance. If voting is transparent and fair:\n(1) Community trusts the resurrection (higher token value)\n(2) Token has real utility (not just whale pump)\n(3) Protocol attracts developers/users (long-term growth)\n(4) DAO treasury grows (whale benefits)\n\nA whale controlling 50% of voting power in an illegitimate system gets 0 value if the token is abandoned. A whale with 10% in a legitimate system gets real returns.'
        },
        {
          title: 'What if I don\'t trust the snapshot (think it\'s unfair)?',
          content: 'You have several options:\n1. Download the IPFS CSV and verify your holdings yourself\n2. Verify the Merkle root on-chain\n3. If you find an error, contact us before claims open\n4. We can delay claims to investigate\n5. If snapshot is proven unfair, community votes to use an earlier snapshot\n6. Worst case: Don\'t claim, community forks with a fair snapshot\n\nThe key: Snapshots are auditable. You\'re not trusting us; you\'re verifying mathematically.'
        },
        {
          title: 'What happens if original team resurfaces after Path B resurrection?',
          content: 'You disclose this to holders immediately. Community votes on next steps:\n\nOption 1: Merge with Path A (original team\'s new official version)\n- V2 holders can swap to official at 1:1 ratio\n- Original team takes governance\n- Community fork can dissolve or continue as "classic" version\n\nOption 2: Continue Path B fork independently\n- V2 remains separate, branded "Legacy" or "Community\"\n- Holders keep their tokens\n- Original and Community versions coexist (like Bitcoin/Bitcoin Cash)\n\nEither way: Community votes. Not dictated. Transparency means both versions are valid.'
        },
        {
          title: 'Why do I need 50+ wallets instead of just 80% voting power?',
          content: 'Because voting power can be gamed:\n- Whale could create 10 fake wallets with 1 SOL each\n- If only voting power matters, whale\'s 8 power + 10 fake wallets (10 power) = "community consensus"\n- In reality: 1 person + 10 sockpuppets, not 11 people\n\nWith 50-wallet minimum:\n- Whale must find 40+ OTHER REAL PEOPLE\n- Can\'t create 40 accounts free on Solana (costs SOL)\n- Creates real cost to gaming the system\n- Ensures genuine community involvement\n\nThis is called \"Sybil resistance.\n'
        },
        {
          title: 'Can the NecroBridge team veto a community vote?',
          content: 'No. Here\'s why:\n\n(1) Smart contracts are deterministic. Once deployed, they execute the rules code specifies. If voting shows approval, smart contract approves. No human veto possible.\n\n(2) We don\'t control Solana. We deploy programs, but only governance can upgrade them.\n\n(3) If we tried to block a vote, community would:\n- Fork our code\n- Deploy new version\n- Move to competing platform (Marinade, Lido, etc.)\n\n(4) Transparency makes censorship impossible. If we block a vote, community sees it immediately on Solana Explorer.\n\nWe\'re tools, not gatekeepers. The blockchain is the gatekeeper.'
        },
        {
          title: 'What fees do I pay? Is this a rug?',
          content: 'Transparent fee structure:\n\nTransaction Fees: ~$0.00025 per claim (Solana\'s cost)\n\nPlatform Fee: 2% of LP reserves (optional DAO governance vote)\n- Funds development\n- Pays DAO multisig signers\n- Voted on by community (can be increased/decreased/removed)\n- Transparent: All fees go to published DAO treasury address\n\nNo hidden fees. No founder allocation. Tokens are only distributed to:\n(1) Original holders (via claims)\n(2) DAO treasury (voted on by community)\n(3) Zero to our team\n\nTo verify: Check Solana Explorer for DAO treasury address. See every transaction.'
        },
        {
          title: 'What if the Solana blockchain goes down?',
          content: 'Good contingency question. Solana has been up 99.7% of the past 5 years. But if it does go down:\n\n(1) Smart contracts pause (existing migration state frozen)\n(2) Blockchain doesn\'t re-org, so your tokens aren\'t lost\n(3) When Solana restarts, contracts resume\n(4) Claims can be processed after restoration\n\nIn EXTREME case (network never recovers):\n- Your original tokens on source chain still exist\n- You can claim via alternate on-source-chain governance\n- Community forks NecroBridge to alternative blockchain (Ethereum, Polygon, etc.)\n\nKey: Blockchain failure affects NecroBridge same as all Solana protocols. Your tokens are secure (decentralized).'
        },
        {
          title: 'Can I see the voting power breakdown / who voted?',
          content: 'Yes. On every project page:\n\n- Voted Yes: [X power from Y wallets]\n- Voted No: [X power from Y wallets]\n- Not Voted: [X power from Y wallets]\n\nDrilldown shows:\n- Each wallet address (pseudonymous)\n- Power contributed\n- Direction (yes/no)\n- Timestamp\n\nYou can see: "33 wallets with 1-5 power, 10 wallets with 5-20 power, 2 whales with 100+ power." This shows if consensus is genuine or whale-driven.\n\nFull details are on-chain, queryable from Solana RPC.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-white/20">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#0a0a0a',
        zIndex: 0
      }} />
      
      {/* Dynamic Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-6 tracking-tight">
              Documentation
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Complete, transparent guide to protocol resurrection, community governance, and trustless migration on Solana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Sidebar nav */}
            <aside className="md:col-span-3 sticky top-32 h-fit hidden md:block">
              <nav className="space-y-1">
                {sections.map(s => (
                  <a 
                    key={s.id} 
                    href={`#${s.id}`}
                    className="block px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="md:col-span-9 space-y-16">
              {sections.map(section => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="font-display text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/20" />
                    {section.title}
                  </h2>
                  <div className="rounded-2xl bg-black/5 p-4 backdrop-blur-sm transition-colors">
                    {section.content && (
                      <p className="text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                        {section.content}
                      </p>
                    )}
                    {section.items && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-text-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Diagram */}
                    {/* @ts-ignore */}
                    {section.diagram && (
                      <div className="mt-8 mb-8">
                        {/* @ts-ignore */}
                        {section.diagram}
                      </div>
                    )}

                    {/* Subsections */}
                    {section.subsections && (
                      <div className="mt-8 space-y-6 border-t border-white/5 pt-6">
                        {section.subsections.map((subsection, i) => (
                          <div key={i} className="space-y-3">
                            <h3 className="text-lg font-semibold text-text-primary">{subsection.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-mono text-xs md:text-sm">
                              {subsection.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}

              {/* Call to Action Card */}
              <div className="rounded-3xl bg-black/5 p-6 text-center mt-20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="font-display text-3xl font-bold text-text-primary mb-4 relative z-10">
                  Ready to Resurrect a Protocol?
                </h2>
                <p className="text-text-secondary mb-8 relative z-10 max-w-sm mx-auto">
                  Join the community-led resurrection movement. Nominate a dead protocol, vote on resurrections, and participate in decentralized governance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link 
                    href="/nominate"
                    className="px-8 py-3 rounded-full bg-text-primary text-surface font-semibold hover:scale-105 transition-transform"
                  >
                    Nominate Protocol
                  </Link>
                  <Link 
                    href="/projects"
                    className="px-8 py-3 rounded-full border border-white/10 text-text-primary font-semibold hover:bg-white/5 transition-colors"
                  >
                    Browse & Vote
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
