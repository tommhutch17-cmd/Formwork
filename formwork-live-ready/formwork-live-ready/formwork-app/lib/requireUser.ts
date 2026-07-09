import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { isSupabaseConfigured, supabaseSetupMessage } from './supabase/config';

export async function requireUser() {
  if (!isSupabaseConfigured()) redirect('/login?error=' + encodeURIComponent(supabaseSetupMessage));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, user };
}
