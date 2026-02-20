/**
 * Migration Paths Component
 * 
 * SECURITY & COMPLIANCE:
 * Clearly distinguishes between:
 * - Path A: "Sunrise Route" (Official, Original Issuers)
 * - Path B: "Community Fork" (Community-Led V2)
 * 
 * This addresses the "Legal & IP Zombie Issues" risk by providing
 * clear branding so users understand whether they're claiming
 * the "canonical" token or a community-generated V2 fork.
 */

export function MigrationPathsSection() {
  return (
    <section className="py-20 bg-surface-dark relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Two Legal Paths to Resurrection
          </h2>
          <p className="text-text-secondary text-lg">
            NecroBridge supports both official revivals and community-led forks.
            Know which path you're taking.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Path A: Sunrise */}
          <div className="glass-light rounded-xl p-6 sm:p-8 border border-success/20 relative overflow-hidden group">
            {/* Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-2xl -z-10 group-hover:bg-success/20 transition-all" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">Path A: Sunrise Route</h3>
                <p className="text-sm text-text-secondary mt-1">Official Protocol Revival</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-success text-lg leading-none mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-text-primary">Original Issuers Involved</p>
                  <p className="text-sm text-text-secondary">Founding team or official governance approves migration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success text-lg leading-none mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-text-primary">Canonical Contract</p>
                  <p className="text-sm text-text-secondary">Token maintains original brand, intellectual property, and governance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success text-lg leading-none mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-text-primary">Zero IP Legal Risk</p>
                  <p className="text-sm text-text-secondary">No trademark or counterfeiting concerns</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border">
              <p className="text-sm text-text-secondary mb-4">🎯 <strong>Best For:</strong> Projects with active, responsive founding teams</p>
              <button className="w-full px-4 py-2 rounded-lg bg-success/20 border border-success/40 text-success hover:bg-success/30 font-semibold transition-all">
                Initialize Sunrise Revival
              </button>
            </div>
          </div>

          {/* Path B: Community Fork */}
          <div className="glass-light rounded-xl p-6 sm:p-8 border border-warning/20 relative overflow-hidden group">
            {/* Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-2xl -z-10 group-hover:bg-warning/20 transition-all" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">Path B: Community Hard Fork</h3>
                <p className="text-sm text-text-secondary mt-1">Trustless Community Revival (V2)</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-warning text-lg leading-none mt-0.5">⚡</span>
                <div>
                  <p className="font-semibold text-text-primary">Community-Led Governance</p>
                  <p className="text-sm text-text-secondary">No original team involvement required; decentralized revival</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-warning text-lg leading-none mt-0.5">⚡</span>
                <div>
                  <p className="font-semibold text-text-primary">New Contract (V2 Branding)</p>
                  <p className="text-sm text-text-secondary">Must use clear V2, fork, or community designation in token name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-warning text-lg leading-none mt-0.5">⚡</span>
                <div>
                  <p className="font-semibold text-text-primary">Clear Disclaimer Required</p>
                  <p className="text-sm text-text-secondary">UI must clearly state this is a community revival, not official</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border">
              <p className="text-sm text-text-secondary mb-4">🎯 <strong>Best For:</strong> Abandoned projects with unreachable teams</p>
              <button className="w-full px-4 py-2 rounded-lg bg-warning/20 border border-warning/40 text-warning hover:bg-warning/30 font-semibold transition-all">
                Start Community Fork
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="glass-light rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-lighter">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Criteria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-success">Path A (Sunrise)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-warning">Path B (V2)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-border hover:bg-surface-lighter/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Team Involvement</td>
                  <td className="px-6 py-4 text-sm text-success">✓ Required</td>
                  <td className="px-6 py-4 text-sm text-warning">✗ Not Required</td>
                </tr>
                <tr className="border-b border-surface-border hover:bg-surface-lighter/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Brand/IP</td>
                  <td className="px-6 py-4 text-sm text-success">✓ Preserved</td>
                  <td className="px-6 py-4 text-sm text-warning">✗ Must be V2/Fork</td>
                </tr>
                <tr className="border-b border-surface-border hover:bg-surface-lighter/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Legal Risk</td>
                  <td className="px-6 py-4 text-sm text-success">✓ Minimal</td>
                  <td className="px-6 py-4 text-sm text-warning">⚠ Moderate (if trademark holder disputes)</td>
                </tr>
                <tr className="border-b border-surface-border hover:bg-surface-lighter/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Community Ownership</td>
                  <td className="px-6 py-4 text-sm text-success">◐ Shared</td>
                  <td className="px-6 py-4 text-sm text-warning">✓ 100%</td>
                </tr>
                <tr className="hover:bg-surface-lighter/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Claim Eligibility</td>
                  <td className="px-6 py-4 text-sm text-success">✓ Holders of original</td>
                  <td className="px-6 py-4 text-sm text-warning">✓ Holders of original</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-danger/5 border border-danger/20">
          <p className="text-sm text-danger">
            <strong>⚠️ Path B Disclaimer:</strong> Community-led revivals (V2) are not affiliated with original projects. 
            If original founders resurface, they may challenge the fork's right to use the original brand name. 
            Always use clear "V2" or "Community Fork" naming to minimize legal exposure.
          </p>
        </div>
      </div>
    </section>
  );
}
