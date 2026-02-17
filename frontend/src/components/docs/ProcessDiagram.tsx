export function ProcessDiagram() {
  return (
    <div className="w-full aspect-[16/9] bg-white/5 rounded-xl border border-white/10 p-8 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 800 400" className="w-full h-full text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" fillOpacity="0.5" />
          </marker>
        </defs>

        {/* Legacy Chain */}
        <g transform="translate(50, 100)">
          <rect x="0" y="0" width="180" height="200" rx="12" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.2" />
          <text x="90" y="30" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">Legacy Chain</text>
          <circle cx="90" cy="100" r="40" fill="currentColor" fillOpacity="0.1" />
          <text x="90" y="105" textAnchor="middle" fill="currentColor" fontSize="12" opacity="0.7">Legacy Token</text>
        </g>

        {/* Arrow 1 */}
        <line x1="240" y1="200" x2="300" y2="200" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="270" y="190" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.6">Snapshot</text>

        {/* NecroBridge Core */}
        <g transform="translate(310, 50)">
          <rect x="0" y="0" width="180" height="300" rx="16" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="5,5" />
          <text x="90" y="30" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold">NecroBridge</text>
          
          {/* Components */}
          <rect x="20" y="60" width="140" height="60" rx="8" fill="currentColor" fillOpacity="0.1" />
          <text x="90" y="95" textAnchor="middle" fill="currentColor" fontSize="12">Governance</text>
          
          <rect x="20" y="140" width="140" height="60" rx="8" fill="currentColor" fillOpacity="0.1" />
          <text x="90" y="175" textAnchor="middle" fill="currentColor" fontSize="12">Wormhole NTT</text>
          
          <rect x="20" y="220" width="140" height="60" rx="8" fill="currentColor" fillOpacity="0.1" />
          <text x="90" y="255" textAnchor="middle" fill="currentColor" fontSize="12">Mint Authority</text>
        </g>

        {/* Arrow 2 */}
        <line x1="500" y1="200" x2="560" y2="200" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="530" y="190" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.6">Migrate</text>

        {/* Solana Chain */}
        <g transform="translate(570, 100)">
          <rect x="0" y="0" width="180" height="200" rx="12" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.2" />
          <text x="90" y="30" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">Solana</text>
          <circle cx="90" cy="100" r="40" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.8" />
          <text x="90" y="105" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="bold">Resurrected</text>
          <text x="90" y="120" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="bold">Token</text>
        </g>

      </svg>
    </div>
  );
}
