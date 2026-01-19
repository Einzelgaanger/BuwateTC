/**
 * Test Supabase connection and authentication
 * This utility helps verify that Supabase is properly configured
 */

import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  const results = {
    connection: false,
    auth: false,
    database: false,
    error: null as string | null,
  };

  try {
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      results.error = 'Supabase client is not initialized';
      return results;
    }

    // Test 2: Test database connection (try to query user_roles)
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);

      if (error) {
        if (error.message.includes('relation "user_roles" does not exist')) {
          results.error = 'Database migration not run. Please run the migration SQL in Supabase.';
        } else {
          results.error = `Database error: ${error.message}`;
        }
      } else {
        results.database = true;
      }
    } catch (err) {
      results.error = `Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }

    // Test 3: Test authentication service
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // If we get here without error, auth service is working
      results.auth = true;
    } catch (err) {
      results.error = `Auth service error: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }

    // Overall connection status
    results.connection = results.database && results.auth;

    return results;
  } catch (err) {
    results.error = `Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
    return results;
  }
}

export async function checkEnvironmentVariables() {
  const issues: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    issues.push('VITE_SUPABASE_URL is missing or not configured');
  }

  if (!supabaseKey || supabaseKey.includes('your-anon-key')) {
    issues.push('VITE_SUPABASE_PUBLISHABLE_KEY is missing or not configured');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
