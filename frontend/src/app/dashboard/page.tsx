'use client';

/**
 * Dashboard Page
 * Main entry point for NecroBridge features with tabs for different sections
 */

import { useState } from 'react';
import { MigrationDashboard } from '@/components/MigrationDashboard';
import { ClaimInterface } from '@/components/ClaimInterface';
import { GovernanceVoting } from '@/components/GovernanceVoting';

type TabType = 'migrate' | 'claim' | 'voting';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('migrate');

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px] opacity-30" />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Dashboard
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Manage your protocol migrations, claim tokens, and participate in governance.
          </p>
        </div>

        {/* Tab Navigation Section */}
        <div className="mb-12 flex justify-center sticky top-20 z-40 py-2">
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
            {[
              { id: 'migrate', label: '📋 Migrate', icon: '📋' },
              { id: 'claim', label: '💰 Claim', icon: '💰' },
              { id: 'voting', label: '🗳️ Vote', icon: '🗳️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-8 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-lg border border-white/10'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">
          {activeTab === 'migrate' && <MigrationDashboard />}
          {activeTab === 'claim' && <ClaimInterface />}
          {activeTab === 'voting' && <GovernanceVoting />}
        </div>
      </div>
    </div>
  );
}
