export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'paste-your-supabase-url-here' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'paste-your-supabase-anon-key-here'
  );
}

export const supabaseSetupMessage = 'Supabase is not connected yet. Add your Supabase URL and anon key in .env.local, then restart npm.cmd run dev.';
