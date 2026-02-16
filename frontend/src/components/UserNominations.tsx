'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

interface UserNomination {
  id: string;
  projectName: string;
  ticker: string;
  sourceChain: string;
  createdAt: string;
}

function NominationRow({ nomination }: { nomination: UserNomination }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition-all duration-300 group border border-transparent hover:border-white/20">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-white group-hover:text-white transition-colors truncate">
            {nomination.projectName}
          </p>
          <span className="font-mono text-xs text-text-muted">${nomination.ticker}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-text-muted">{nomination.sourceChain}</span>
          <span className="text-xs text-text-muted">•</span>
          <span className="text-xs text-text-muted">{new Date(nomination.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400`}>
        Nominated
      </span>
    </div>
  );
}

export function UserNominations() {
  const [nominations, setNominations] = useState<UserNomination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for user's nominations
    const q = query(collection(db, 'nominations'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const nomList: UserNomination[] = [];
        snapshot.forEach((doc: DocumentSnapshot) => {
          const data = doc.data();
          nomList.push({
            id: doc.id,
            projectName: data?.projectName || 'Unknown',
            ticker: data?.ticker || 'N/A',
            sourceChain: data?.sourceChain || 'Unknown',
            createdAt: data?.createdAt || new Date().toISOString(),
          });
        });
        
        setNominations(nomList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        setLoading(false);
      },
      (error: Error) => {
        console.error('Error loading nominations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-white/10 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {nominations.length > 0 ? (
        <div className="divide-y divide-white/10 relative z-10">
          {nominations.map((nom) => (
            <NominationRow key={nom.id} nomination={nom} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted py-6 text-center relative z-10">
          No nominations yet.{' '}
          <Link href="/nominate" className="text-white hover:text-white/80">
            Nominate a project
          </Link>
        </p>
      )}
    </>
  );
}
