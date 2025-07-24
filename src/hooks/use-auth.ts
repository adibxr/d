'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, auth } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to get user authentication state.",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  return { user, loading };
}
