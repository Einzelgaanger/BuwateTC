import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'member' | 'admin' | 'coach' | null;

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
      );

      // Create the query promise
      const queryPromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      // Race between query and timeout
      const result = await Promise.race([queryPromise, timeoutPromise]);
      const { data, error } = result as { data: any; error: any };

      if (error) {
        // If it's a "not found" error, default to member
        if (error.code === 'PGRST116') {
          console.log('User role not found, defaulting to member');
          setRole('member');
        } else {
          console.error('Error fetching role:', error);
          // For any other error, default to member
          setRole('member');
        }
      } else if (data) {
        setRole((data.role as UserRole) || 'member');
      } else {
        // No data and no error - default to member
        setRole('member');
      }
    } catch (error: any) {
      console.error('Error or timeout fetching user role:', error);
      // Default to member if there's any error (timeout, RLS issue, etc.)
      setRole('member');
    } finally {
      setLoading(false);
    }
  };

  return { user, role, loading };
}
