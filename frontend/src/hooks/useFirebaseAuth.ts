'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export function useFirebaseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Already authenticated
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        // Not authenticated, sign in anonymously
        try {
          await signInAnonymously(auth);
          setIsAuthenticated(true);
          setError(null);
        } catch (err) {
          console.error('Failed to sign in anonymously:', err);
          setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, loading, error };
}
