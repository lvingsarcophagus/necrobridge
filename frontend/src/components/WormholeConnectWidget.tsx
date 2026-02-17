'use client';

import { useEffect } from 'react';

interface WormholeConnectWidgetProps {
  sourceChain: string;
  sourceToken: string;
}

export function WormholeConnectWidget({ sourceChain, sourceToken }: WormholeConnectWidgetProps) {
  useEffect(() => {
    // Load Wormhole Connect script
    const script = document.createElement('script');
    script.src = 'https://wormhole.com/connect/v1/index.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full rounded-xl border border-accent/20 bg-white/5 overflow-hidden">
      <div className="p-4 border-b border-accent/10 bg-gradient-to-r from-accent/10 to-transparent">
        <h3 className="font-display text-lg font-semibold text-accent">🌉 Register on Sunrise</h3>
        <p className="text-sm text-text-secondary mt-1">Create a canonical SPL token on Solana via Wormhole NTT</p>
      </div>
      
      <div className="p-6">
        <div id="wormhole-connect" className="w-full">
          {/* Wormhole Connect widget will be injected here */}
        </div>
        
        {/* Fallback UI and instructions */}
        <div className="space-y-4 text-sm text-text-secondary">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="font-semibold text-text-primary mb-2">📋 Steps to Register:</p>
            <ol className="space-y-2 list-decimal list-inside text-xs">
              <li>Select your source chain ({sourceChain})</li>
              <li>Enter token contract: {sourceToken.slice(0, 10)}...</li>
              <li>Authorize Wormhole NTT</li>
              <li>Canonical SPL token minted in ~24 hours</li>
              <li>Community can begin claiming</li>
            </ol>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-3 border border-accent/20 text-xs">
            <p>💡 <strong>Tip:</strong> You only need to complete this once. After NTT registration, token holders can immediately begin claiming their resurrected tokens on Solana.</p>
          </div>

          <a
            href="https://sunrisebridge.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 font-semibold transition-all text-center border border-accent/30"
          >
            Open Sunrise Bridge ↗
          </a>
        </div>
      </div>
    </div>
  );
}
