'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, supabaseSetupMessage } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/login?error=' + encodeURIComponent(supabaseSetupMessage));
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/login?error=' + encodeURIComponent(error.message));
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) redirect('/signup?error=' + encodeURIComponent(supabaseSetupMessage));
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const fullName = String(formData.get('fullName') || '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) redirect('/signup?error=' + encodeURIComponent(error.message));
  redirect('/dashboard');
}

export async function signOut() {
  if (!isSupabaseConfigured()) redirect('/');
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
