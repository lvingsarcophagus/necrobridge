'use client';

import Link from 'next/link';
import { ProcessDiagram } from '@/components/docs/ProcessDiagram';

export default function DocsPage() {
  const sections = [
    { 
      title: 'Overview', 
      id: 'overview',
      content: 'NecroBridge is the definitive protocol resurrection platform on Solana. We provide the infrastructure for cross-chain token migrations, community governance, and trustless asset claims for protocols seeking a new life on the fastest blockchain.',
      subsections: [
        {
          title: 'What is Protocol Resurrection?',
          content: 'Protocol resurrection is the process of reviving abandoned or legacy blockchain protocols by migrating their communities and assets to a more active blockchain ecosystem. NecroBridge specializes in facilitating these migrations to Solana, taking advantage of its speed, scalability, and low transaction costs.'
        },
        {
          title: 'Why Solana?',
          content: 'Solana offers several advantages for resurrected protocols: 400ms block times for rapid transaction finalization, minimal transaction costs (typically under $0.01), and a vibrant ecosystem of developers and users. These characteristics make it ideal for revived protocols that need active communities and cost-effective operations.'
        }
      ]
    },
    { 
      title: 'Getting Started', 
      id: 'getting-started',
      content: 'To begin your journey with NecroBridge, follow these simple steps to connect and start exploring or nominating protocols for resurrection.',
      subsections: [
        {
          title: 'Step 1: Connect Your Wallet',
          content: 'Click the wallet button in the top-right corner and select your preferred Solana wallet provider. Supported wallets include Phantom, Solflare, Magic Eden Mobile, and others. Once connected, you\'ll have access to all NecroBridge features.'
        },
        {
          title: 'Step 2: Browse Existing Projects',
          content: 'Navigate to the "Browse Projects" section to explore protocols currently undergoing resurrection. Review each project\'s details, community support, and migration progress.'
        },
        {
          title: 'Step 3: Nominate or Vote',
          content: 'You can nominate a new protocol for resurrection or vote on existing nominations. All decisions are made through our democratic governance system, ensuring community consensus.'
        },
        {
          title: 'Step 4: Begin Migration',
          content: 'Once a protocol receives community approval, your tokens can be migrated to their new Solana-based home using our trustless migration mechanism powered by Wormhole NTT technology.'
        }
      ]
    },
    { 
      title: 'Core Features', 
      id: 'features',
      items: [
        'Trustless Token Migration (Wormhole NTT)',
        'Governance-led Decision Making',
        'Incentivized Nomination System',
        'Cross-chain Asset Snapshots'
      ],
      subsections: [
        {
          title: 'Trustless Token Migration',
          content: 'Powered by Wormhole\'s Native Token Transfer (NTT) protocol, our migration system ensures tokens are securely transferred with cryptographic guarantees. No centralized entity controls your assets during migration—the process is fully transparent and auditable.'
        },
        {
          title: 'Governance-led Decision Making',
          content: 'Every major decision on NecroBridge is made by the community. Token holders vote on which protocols to resurrect, migration parameters, and platform upgrades. Voting is weighted by token ownership, ensuring fair representation.'
        },
        {
          title: 'Incentivized Nomination System',
          content: 'Nominators are rewarded for successful protocol resurrections. This creates positive incentives for identifying valuable protocols worth reviving and encourages quality nominations.'
        },
        {
          title: 'Cross-chain Asset Snapshots',
          content: 'Our system captures cryptographic snapshots of assets across multiple chains, ensuring accurate representation and fair distribution when protocols are resurrected on Solana.'
        }
      ]
    },
    {
      title: 'Technical Architecture',
      id: 'technical',
      content: 'NecroBridge\'s technical foundation is built on proven Solana and cross-chain technologies.',
      diagram: <ProcessDiagram />,
      subsections: [
        {
          title: 'Wormhole NTT Integration',
          content: 'We utilize Wormhole\'s Native Token Transfer (NTT) protocol, which provides secure, efficient cross-chain token transfers. NTT includes automatic rate limiting and governance-controlled token burning, adding security layers to our migrations.'
        },
        {
          title: 'On-chain Governance',
          content: 'Smart contracts on Solana manage all governance decisions, votes, and token distributions. All transactions are transparent and immutable, providing complete auditability.'
        },
        {
          title: 'Snapshot Mechanism',
          content: 'Before migration, we take cryptographic snapshots of token holders and their balances across all supported chains. This ensures fair and accurate distribution on the Solana network.'
        }
      ]
    },
    {
      title: 'Security & Audits',
      id: 'security',
      content: 'Security is paramount at NecroBridge. We employ a multi-layered security approach to protect user assets and protocol integrity.',
      subsections: [
        {
          title: 'Audited Contracts',
          content: 'All our smart contracts, including the governance and migration modules, undergo rigorous audits by top-tier security firms. We maintain a public repository of all audit reports.'
        },
        {
          title: 'Bug Bounty Program',
          content: 'We operate an active bug bounty program to incentivize white-hat hackers to identify and report potential vulnerabilities. Rewards are paid out for valid disclosures based on severity.'
        },
        {
          title: 'Emergency Pause',
          content: 'In the unlikely event of a security breach, the protocol features a governance-controlled emergency pause mechanism that can halt all sensitive operations to prevent asset loss.'
        }
      ]
    },
    {
      title: 'Frequently Asked Questions',
      id: 'faq',
      content: 'Find answers to common questions about NecroBridge and protocol resurrection.',
      subsections: [
        {
          title: 'Is my data safe during migration?',
          content: 'Yes. All migrations use Wormhole\'s audited NTT protocol with cryptographic verification. Your assets are never held by a centralized entity, and all transactions are on-chain and transparent.'
        },
        {
          title: 'What tokens are supported?',
          content: 'NecroBridge supports any token that can be integrated with Wormhole\'s infrastructure. This includes tokens from Ethereum, Binance Smart Chain, Polygon, and other major chains.'
        },
        {
          title: 'How does the voting system work?',
          content: 'Voting power is proportional to token holdings. Each nomination and migration proposal requires community consensus through a time-weighted voting mechanism.'
        },
        {
          title: 'Are there migration fees?',
          content: 'Transaction fees are minimal due to Solana\'s low-cost infrastructure. A small platform fee may apply to fund governance and development, set by community vote.'
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
              Everything you need to know about resurrecting protocols and migrating assets to Solana.
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
                      <p className="text-text-secondary leading-relaxed mb-4">
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
                            <p className="text-sm text-text-secondary leading-relaxed">{subsection.content}</p>
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
                  Ready to Start?
                </h2>
                <p className="text-text-secondary mb-8 relative z-10 max-w-sm mx-auto">
                  Join the forefront of protocol resurrection and help build the future of Solana.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link 
                    href="/dashboard"
                    className="px-8 py-3 rounded-full bg-text-primary text-surface font-semibold hover:scale-105 transition-transform"
                  >
                    Launch Dashboard
                  </Link>
                  <Link 
                    href="/projects"
                    className="px-8 py-3 rounded-full border border-white/10 text-text-primary font-semibold hover:bg-white/5 transition-colors"
                  >
                    Browse Projects
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
