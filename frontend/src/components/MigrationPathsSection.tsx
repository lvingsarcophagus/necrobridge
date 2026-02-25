/**
 * Migration Paths Component - Death Star Theme
 * 
 * SECURITY & COMPLIANCE:
 * Clearly distinguishes between:
 * - Path A: "Official Revival" (Original Issuers)
 * - Path B: "Community Fork" (Community-Led V2)
 */

export function MigrationPathsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Star field effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Death Star glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-muted mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Migration Paths
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Two Paths to Resurrection
          </h2>
          <p className="text-text-secondary text-lg">
            Choose your revival strategy. Official team coordination or community-led fork.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Path A: Official Revival */}
          <div className="glass rounded-xl p-6 sm:p-8 border border-success/30 relative overflow-hidden group hover:border-success/50 transition-all duration-500">
            {/* Accent glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-success/10 rounded-full blur-3xl -z-10 group-hover:bg-success/20 transition-all duration-500" />
            
            {/* Death Star decoration */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="1" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M2 12h20" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-success/20">
                <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">Path A: Official Revival</h3>
                <p className="text-sm text-success mt-1">Team-Approved Migration (Sunrise Model)</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-success/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">Original Team Involved</p>
                  <p className="text-xs text-text-secondary">Founding team approves and coordinates migration</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-success/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">Canonical Token</p>
                  <p className="text-xs text-text-secondary">Maintains original brand, IP, and governance rights</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-success/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">Zero Legal Risk</p>
                  <p className="text-xs text-text-secondary">No trademark or counterfeiting concerns</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2 text-xs text-text-muted">
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Best for projects with active founding teams</span>
              </div>
              <a 
                href="https://www.sunrisedefi.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mb-4 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                Inspired by Sunrise DeFi →
              </a>
              <button className="w-full px-4 py-3 rounded-xl bg-success/20 border border-success/40 text-success hover:bg-success/30 font-semibold transition-all flex items-center justify-center gap-2 group/btn">
                <span>Initialize Official Revival</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Path B: Community Fork */}
          <div className="glass rounded-xl p-6 sm:p-8 border border-warning/30 relative overflow-hidden group hover:border-warning/50 transition-all duration-500">
            {/* Accent glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-warning/10 rounded-full blur-3xl -z-10 group-hover:bg-warning/20 transition-all duration-500" />
            
            {/* Death Star decoration */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="1" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M2 12h20" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-warning/20">
                <svg className="w-7 h-7 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">Path B: Community Fork</h3>
                <p className="text-sm text-warning mt-1">Decentralized Revival</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-warning/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">Community Governance</p>
                  <p className="text-xs text-text-secondary">No original team required; fully decentralized</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-warning/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">V2 Branding Required</p>
                  <p className="text-xs text-text-secondary">Clear "Community Fork" designation in token name</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-warning/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">100% Community Owned</p>
                  <p className="text-xs text-text-secondary">Full control by token holders via DAO</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4 text-xs text-text-muted">
                <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Best for abandoned projects with unreachable teams</span>
              </div>
              <button className="w-full px-4 py-3 rounded-xl bg-warning/20 border border-warning/40 text-warning hover:bg-warning/30 font-semibold transition-all flex items-center justify-center gap-2 group/btn">
                <span>Start Community Fork</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="glass rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Criteria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-success">Path A (Official)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-warning">Path B (Fork)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Team Involvement</td>
                  <td className="px-6 py-4 text-sm text-success">Required</td>
                  <td className="px-6 py-4 text-sm text-warning">Not Required</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Brand/IP Rights</td>
                  <td className="px-6 py-4 text-sm text-success">Preserved</td>
                  <td className="px-6 py-4 text-sm text-warning">V2/Fork Naming</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Legal Risk</td>
                  <td className="px-6 py-4 text-sm text-success">Minimal</td>
                  <td className="px-6 py-4 text-sm text-warning">Low (with proper branding)</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Community Ownership</td>
                  <td className="px-6 py-4 text-sm text-success">Shared</td>
                  <td className="px-6 py-4 text-sm text-warning">100%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">Claim Eligibility</td>
                  <td className="px-6 py-4 text-sm text-success">Original Holders</td>
                  <td className="px-6 py-4 text-sm text-warning">Original Holders</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-5 rounded-xl bg-warning/5 border border-warning/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-warning font-semibold mb-1">Path B Disclaimer</p>
              <p className="text-xs text-text-secondary">
                Community-led revivals (V2) are not affiliated with original projects. Always use clear 
                "V2" or "Community Fork" naming to minimize legal exposure and ensure transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
