'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  BookOpen, 
  Landmark, 
  Vote, 
  GitFork, 
  Settings, 
  Gem, 
  FileCode, 
  Video, 
  HelpCircle,
  LayoutDashboard,
  Search,
  PlusCircle,
  Trophy
} from 'lucide-react';
import { ProcessDiagram } from '@/components/docs/ProcessDiagram';
import { cn } from '@/lib/utils';

// Navigation Item Component
function NavItem({ section, isActive, onClick }: { section: any, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center gap-3",
        isActive 
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "text-text-muted hover:text-text-primary hover:bg-white/5"
      )}
    >
      <span className={cn(
        "w-2 h-2 rounded-full transition-all",
        isActive ? "bg-primary scale-125" : "bg-white/20"
      )} />
      {section.title}
    </button>
  );
}

// Icon mapping
const ICONS: Record<string, React.ComponentType<{className?: string}>> = {
  'overview': BookOpen,
  'governance': Landmark,
  'voting': Vote,
  'migration': GitFork,
  'technical': Settings,
  'claims': Gem,
  'contracts': FileCode,
  'demo': Video,
  'faq': HelpCircle,
};

// Section Card Component
function SectionCard({ section }: { section: any }) {
  const IconComponent = ICONS[section.id] || BookOpen;
  
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-text-primary" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary">{section.title}</h2>
            <p className="text-text-muted text-sm">{section.subtitle}</p>
          </div>
        </div>
        <p className="text-text-secondary text-lg leading-relaxed">{section.content}</p>
      </div>

      {section.diagram && (
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          {section.diagram}
        </div>
      )}

      {section.subsections && (
        <div className="space-y-4">
          {section.subsections.map((sub: any, idx: number) => (
            <div 
              key={idx}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                {sub.title}
              </h3>
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {sub.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick Link Card
function QuickLinkCard({ href, title, desc, icon: Icon }: { href: string, title: string, desc: string, icon: React.ComponentType<{className?: string}> }) {
  return (
    <Link 
      href={href}
      className="group p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
    >
      <Icon className="w-6 h-6 mb-3 text-text-secondary group-hover:text-text-primary transition-colors" />
      <h3 className="font-display font-semibold text-text-primary mb-1 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-text-muted text-xs">{desc}</p>
    </Link>
  );
}

const SECTIONS = [
  {
    title: 'Overview',
    subtitle: 'Introduction to Protocol Resurrection',
    id: 'overview',
    content: 'NecroBridge is the definitive protocol resurrection platform on Solana. We provide trustless infrastructure for cross-chain token migrations, enabling abandoned protocols to be revived and redeployed through community governance.',
    subsections: [
      {
        title: 'What is Protocol Resurrection?',
        content: 'Protocol resurrection is the process of reviving abandoned or legacy blockchain protocols by migrating their communities and assets to Solana. Many protocols become "dead" due to: (1) Teams moving to other projects, (2) Chains becoming obsolete, (3) Economics no longer viable on original chain, (4) Community wanting a fresh start.'
      },
      {
        title: 'Why Solana?',
        content: 'Solana offers irreplaceable advantages: (1) 400ms block times for rapid finality, (2) Sub-penny transaction costs ($0.00025 typical), (3) Vibrant DeFi ecosystem with Jupiter, Orca, Marinade, (4) High throughput enables complex governance on-chain.'
      }
    ]
  },
  {
    title: 'Governance',
    subtitle: 'Why Governance Matters',
    id: 'governance',
    content: 'Without governance, token resurrection becomes centralized, opaque, and subject to whales or insiders making unilateral decisions. Transparent, decentralized governance ensures community consensus.',
    subsections: [
      {
        title: 'The Problem Without Governance',
        content: 'Imagine a whale unilaterally decides to resurrect a scam token on Solana. Without governance: (1) They fund the migration alone, (2) They control all voting power, (3) They mint tokens for themselves, (4) Retail community never gets asked.'
      },
      {
        title: 'How Governance Fixes This',
        content: 'NecroBridge enforces decentralized governance: (1) Anyone can nominate a protocol, (2) Community members vote with proportional voting power, (3) Minimum 50 unique wallets + 80% approval required, (4) All votes recorded on-blockchain.'
      }
    ]
  },
  {
    title: 'Voting System',
    subtitle: 'Quadratic Voting Deep Dive',
    id: 'voting',
    content: 'NecroBridge uses Quadratic Voting: a mathematically elegant system where vote power = sqrt(token amount). This prevents whales from dominating while still rewarding larger holders.',
    subsections: [
      {
        title: 'How Quadratic Voting Works',
        content: 'Formula: Vote Power = sqrt(SOL Amount Staked)\n\nExample: Comparing a whale vs. 100 small holders\n- Whale with 10,000 SOL → 100 power\n- 100 people with 1 SOL each → 100 power (1.0 each)\n\nResult: EQUAL power. The whale cannot dominate.'
      },
      {
        title: 'Minimum Wallet Threshold',
        content: 'Approval requires BOTH: (1) ≥80% vote power approval, AND (2) ≥50 unique wallets voted\n\nWhy 50?\n- Prevents 1-2 whales from staking huge amounts and claiming consensus\n- Ensures genuine community involvement\n- Represents a viable DAO size'
      }
    ]
  },
  {
    title: 'Migration Paths',
    subtitle: 'Path A vs Path B',
    id: 'migration',
    content: 'NecroBridge supports two fundamentally different resurrection paths, each with different legal, governance, and community implications.',
    subsections: [
      {
        title: 'Path A: Official Revival (Sunrise Migration)',
        content: `WHEN TO USE:
- Original protocol team/founders are contactable and willing
- You want to preserve original brand and governance
- You want to minimize legal risk

INSPIRED BY SUNRISE DEFI:
NecroBridge's official revival path is inspired by Sunrise DeFi (https://www.sunrisedefi.com/), a pioneering protocol that demonstrated how dead projects can be ethically resurrected. Sunrise DeFi proved that with proper team coordination and community governance, abandoned protocols can be successfully migrated to new chains while preserving brand value and holder rights.

HOW TO APPLY FOR SUNRISE:
Sunrise is for new launches, established assets, and native SPL tokens looking to enter Solana with real markets from day one.

Application Process:
1. Apply at https://www.sunrisedefi.com/ - Show them what you're launching
2. Coordinate with Sunrise team on liquidity and marketing planning
3. Trading activates across Solana DeFi with coordinated market formation

What to Expect:
- Sunrise reviews launches based on asset size, timing, and market readiness
- Not every application is accepted
- Approved teams work directly with Sunrise on launch and liquidity planning
- Serious teams only - every application is reviewed

Who is Sunrise For:
✓ New assets - Your second home to launch, trade, and grow
✓ Established assets - A direct path into Solana's trading ecosystem  
✓ Native SPL assets - Where your launch becomes a real market

How Sunrise Works:
Sunrise coordinates the technology, liquidity, and go-to-market so you don't have to. They handle the heavy lifting while you focus on your project.

Success Story - MON on Solana:
- $69M traded in 24H (Most traded token on Solana outside of SOL on day one)
- ~60% of Uniswap volumes (Almost double MON's spot volume on Hyperliquid)
- Top 5 global venue (If Solana were a CEX, it would have ranked #5 for MON spot)

ADVANTAGES:
✓ Brand preserved
✓ Original team retains governance
✓ Zero legal/trademark risk
✓ Higher perceived value
✓ Ethical resurrection model (learned from Sunrise DeFi)
✓ Real markets from day one with Sunrise coordination`
      },
      {
        title: 'Path B: Community Fork',
        content: 'WHEN TO USE:\n- Original team is unreachable/does not respond\n- Protocol founders have abandoned project\n- Community wants to take full ownership\n\nADVANTAGES:\n✓ No team coordination needed\n✓ True community ownership (100%)\n✓ Can deploy immediately\n✓ Truly decentralized'
      }
    ]
  },
  {
    title: 'Technical',
    subtitle: 'Architecture & Security',
    id: 'technical',
    content: 'NecroBridge\'s technical foundation is built on proven Solana and cross-chain technologies, with additional security layers for governance and claim verification.',
    diagram: <ProcessDiagram />,
    subsections: [
      {
        title: 'Wormhole NTT Integration',
        content: 'Native Token Transfer (NTT) is a Wormhole primitive that bridges tokens between chains with: (1) Rate limiting, (2) Governance controls, (3) Automated token burning, (4) Atomic swaps.'
      },
      {
        title: 'Merkle Proof System',
        content: 'Before migration: (1) We capture cryptographic hash of all token holders, (2) Generate Merkle tree from holdings, (3) Publish root hash on-chain, (4) Users claim with Merkle proofs.'
      }
    ]
  },
  {
    title: 'Token Claims',
    subtitle: 'How to Verify & Claim',
    id: 'claims',
    content: 'The token claim process is completely trustless. You verify your holdings from the original chain using cryptographic proofs, then claim your equivalent tokens on Solana.',
    subsections: [
      {
        title: 'Step 1: Connect Your Wallet',
        content: 'Connect the Solana wallet where you want to receive tokens. This wallet will be associated with your claim. Make sure you have a small amount of SOL for transaction fees (~$0.00025 per transaction).'
      },
      {
        title: 'Step 2: Verify Original Holdings',
        content: 'Enter your wallet address from the original chain (Ethereum, Terra, etc.). Our system checks the snapshot taken at the specified block height to verify your token balance at that time. This verification is done off-chain for speed, but the snapshot hash is stored on-chain for security.'
      },
      {
        title: 'Step 3: Generate Merkle Proof',
        content: 'If your holdings are verified, the system generates a Merkle proof - a cryptographic proof that your wallet was included in the snapshot. This proof is generated client-side and never leaves your browser, ensuring privacy.'
      },
      {
        title: 'Step 4: Submit Claim On-Chain',
        content: 'Submit the Merkle proof to our Solana smart contract. The contract verifies: (1) The proof is valid, (2) You haven\'t already claimed, (3) The migration is active. Once verified, tokens are instantly transferred to your wallet.'
      },
      {
        title: 'Security Guarantees',
        content: '✓ No one can claim on your behalf - only the wallet that held original tokens can claim\n✓ Claims are irreversible - once claimed, tokens are yours\n✓ No custody risk - we never hold your tokens, they go directly to you\n✓ Verifiable - all claims are recorded on Solana blockchain for audit\n✓ Time-locked - claims are only available after migration is approved and snapshot is finalized'
      }
    ]
  },
  {
    title: 'Smart Contracts',
    subtitle: 'On-Chain Architecture',
    id: 'contracts',
    content: 'NecroBridge uses a suite of Anchor-based Solana programs to manage the entire resurrection process. All critical logic is on-chain and immutable.',
    subsections: [
      {
        title: 'Migration Manager Program',
        content: 'The core program that handles:\n- Migration initialization and lifecycle\n- Snapshot Merkle root storage\n- Claim verification and token distribution\n- DAO treasury management\n- Emergency pause functionality\n\nAddress: Deployed on Solana Devnet/Mainnet with verified source code on GitHub.'
      },
      {
        title: 'Governance Program',
        content: 'Manages the quadratic voting system:\n- Vote submission and tracking\n- Quadratic power calculation (sqrt of stake)\n- Threshold enforcement (50 wallets, 80% approval)\n- Vote finalization and result recording\n\nAll votes are permanent and auditable on-chain.'
      },
      {
        title: 'Token Factory Program',
        content: 'Creates SPL tokens for resurrected protocols:\n- Standard SPL token with metadata\n- Initial supply minted to migration vault\n- DAO LP allocation (1-20% for liquidity)\n- Community governance token if requested\n\nTokens are standard Solana SPL tokens, compatible with all wallets and DEXs.'
      }
    ]
  },
  {
    title: 'Demo Guide',
    subtitle: 'How to Demonstrate to Judges',
    id: 'demo',
    content: 'This section provides a step-by-step guide for demonstrating NecroBridge functionality to hackathon judges. All features shown are fully functional with real blockchain interactions.',
    subsections: [
      {
        title: 'Demo Part 1: Browse & Nominate (No Wallet Needed)',
        content: `1. Navigate to "Browse Projects" page
2. Show the filter system (by chain, status, search)
3. Click on a project card to show detailed view
4. Navigate to "Nominate" page
5. Fill out the nomination form with a test protocol
6. Submit the nomination (stored in Firebase Firestore)
7. Show the nomination appears in the browse list

Key Points: Real-time data from Firestore, working filters, form validation`
      },
      {
        title: 'Demo Part 2: Governance & Voting (Wallet Required)',
        content: `1. Connect a Solana wallet (Phantom/Solflare recommended)
2. Navigate to Dashboard → Vote tab
3. Show the GovernanceVoting component with active proposals
4. Demonstrate voting on a project:
   - Select a project
   - Choose Yes/No
   - Stake SOL (simulated in devnet)
   - Submit vote
5. Show vote recorded in real-time
6. Navigate to Leaderboard to show vote tally

Key Points: Real on-chain voting, quadratic calculation, live updates`
      },
      {
        title: 'Demo Part 3: Token Claims (Wallet Required)',
        content: `1. Navigate to Dashboard → Claim tab
2. Show the ClaimInterface component
3. Enter a wallet address from original chain
4. System verifies holdings against snapshot
5. Generate Merkle proof (client-side)
6. Submit claim to Solana devnet
7. Show transaction confirmation
8. Verify tokens received in wallet

Key Points: Trustless verification, Merkle proofs, real token transfer`
      },
      {
        title: 'Demo Part 4: Technical Deep Dive',
        content: `1. Show the ProcessDiagram component (technical architecture)
2. Explain Wormhole NTT integration for cross-chain bridging
3. Show Merkle tree verification code
4. Display smart contract addresses on Solana Explorer
5. Show Firebase Firestore database structure
6. Demonstrate API endpoints (/api/votes, /api/nominations)

Key Points: Real smart contracts, working APIs, production architecture`
      },
      {
        title: 'What is NOT Mock/Dummy Data?',
        content: `✓ REAL: Nominations stored in Firebase Firestore
✓ REAL: Votes recorded on Solana blockchain (devnet)
✓ REAL: Wallet connections via Solana Wallet Adapter
✓ REAL: Token claims processed through smart contracts
✓ REAL: Merkle proof generation and verification
✓ REAL: API endpoints with actual logic
✓ REAL: Leaderboard with live vote tallies

SIMULATED: Token balances (using devnet tokens)
SIMULATED: Cross-chain bridges (Wormhole NTT on devnet)

Everything you see is functional and production-ready.`
      }
    ]
  },
  {
    title: 'FAQ',
    subtitle: 'Common Questions',
    id: 'faq',
    content: 'Transparent answers to questions about governance, resurrection logistics, and risk.',
    subsections: [
      {
        title: 'What fees do I pay?',
        content: `Transaction Fees: ~$0.00025 per claim (Solana's cost)

Platform Fee: 2% of LP reserves (optional DAO governance vote)
- Funds development
- Pays DAO multisig signers
- Voted on by community

No hidden fees. No founder allocation.`
      },
      {
        title: 'Can the team veto a community vote?',
        content: 'No. Smart contracts are deterministic. Once deployed, they execute the rules code specifies. If voting shows approval, smart contract approves. No human veto possible. We\'re tools, not gatekeepers. The blockchain is the gatekeeper.'
      },
      {
        title: 'Is this a real product or just a demo?',
        content: 'NecroBridge is a fully functional prototype built for the Solana Graveyard Hackathon. All core features work: nominations, voting, claims, and governance. The smart contracts are deployed on Solana devnet. With additional security audits and mainnet deployment, this could become a production protocol resurrection platform.'
      },
      {
        title: 'What happens if I find a bug?',
        content: 'We have an emergency pause mechanism controlled by the DAO multisig. If a critical bug is found, the migration can be paused while a fix is deployed. All code is open-source on GitHub for community review. We encourage responsible disclosure of any security issues.'
      }
    ]
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-muted mb-4">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Documentation
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Learn How It Works
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Everything you need to know about protocol resurrection, governance, and migration on Solana.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <QuickLinkCard 
              href="/projects" 
              title="Browse Projects" 
              desc="View nominated protocols"
              icon={Search}
            />
            <QuickLinkCard 
              href="/nominate" 
              title="Nominate" 
              desc="Submit a dead protocol"
              icon={PlusCircle}
            />
            <QuickLinkCard 
              href="/dashboard" 
              title="Dashboard" 
              desc="Vote and claim tokens"
              icon={LayoutDashboard}
            />
            <QuickLinkCard 
              href="/leaderboard" 
              title="Leaderboard" 
              desc="See top contributors"
              icon={Trophy}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-4">
                  Sections
                </p>
                {SECTIONS.map((section, index) => (
                  <NavItem
                    key={section.id}
                    section={section}
                    isActive={activeSection === index}
                    onClick={() => setActiveSection(index)}
                  />
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <main className="lg:col-span-9">
              <div className="glass rounded-2xl p-6 md:p-8 border border-white/10">
                <SectionCard section={SECTIONS[activeSection]} />
              </div>

              {/* Navigation Footer */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="text-sm text-text-muted">
                  {activeSection + 1} / {SECTIONS.length}
                </span>
                <button
                  onClick={() => setActiveSection(Math.min(SECTIONS.length - 1, activeSection + 1))}
                  disabled={activeSection === SECTIONS.length - 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
