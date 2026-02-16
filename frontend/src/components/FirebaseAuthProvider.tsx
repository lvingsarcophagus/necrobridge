'use client';

import React from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, error } = useFirebaseAuth();

  if (error) {
    console.error('Firebase Auth Error:', error);
  }

  // Log auth state for debugging
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('[Firebase] User authenticated successfully');
    }
  }, [isAuthenticated]);

  // Continue rendering children regardless of auth state
  // The auth is initialized in background
  return <>{children}</>;
}
