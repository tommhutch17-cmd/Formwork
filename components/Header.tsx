import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { signOut } from '@/app/login/actions';

export default async function Header() {
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  }

  return (
    <header>
      <div className="wrap nav">
        <Link href="/" className="logo">FORMWORK <span className="code">FW/01</span></Link>
        <nav className="nav-links">
          <Link href="/#register">Tools</Link>
          <Link href="/pricing">Pricing</Link>
          {user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Log in</Link>}
        </nav>
        <div className="actions">
          {user ? (
            <form action={signOut}><button className="btn btn-ghost">Sign out</button></form>
          ) : (
            <Link href="/signup" className="btn btn-hivis">Start free</Link>
          )}
        </div>
      </div>
    </header>
  );
}
