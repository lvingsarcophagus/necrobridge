'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useToast } from '@/lib/toast-context';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export function useVoteListener() {
  const { addToast } = useToast();
  const prevVotesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // Listen for changes in voteTallies
    const unsubscribe = onSnapshot(
      collection(db, 'voteTallies'),
      (snapshot: QuerySnapshot) => {
        snapshot.forEach((doc: DocumentSnapshot) => {
          const projectId = doc.id;
          const data = doc.data();
          const currentTotal = data?.total || 0;
          const prevTotal = prevVotesRef.current[projectId] || 0;

          // If this is a new vote (total increased)
          if (currentTotal > prevTotal && prevTotal > 0 && data) {
            const project = MOCK_PROJECTS.find(p => p.id === projectId);
            const voteDiff = currentTotal - prevTotal;
            const yesPercent = data.yes ? Math.round((data.yes / currentTotal) * 100) : 0;

            const message = `🎃 New vote: +${voteDiff.toFixed(2)} SOL for ${project?.name || projectId} (${yesPercent}% YES)`;
            addToast(message, 'vote', 6000);
          }

          // Update the ref with current value
          prevVotesRef.current[projectId] = currentTotal;
        });
      },
      (error) => {
        console.error('Error listening to votes:', error);
      }
    );

    return () => unsubscribe();
  }, [addToast]);
}
