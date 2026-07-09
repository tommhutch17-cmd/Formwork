import Header from '@/components/Header';
import Link from 'next/link';
import { signIn } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <><Header /><section className="section grid-bg"><div className="wrap" style={{maxWidth:560}}>
      <div className="card">
        <div className="eyebrow">Account</div><h1 style={{fontSize:36, marginBottom:18}}>Log in</h1>
        {params.error && <div className="notice danger">{params.error}</div>}
        <form action={signIn} className="form-grid">
          <div className="field full"><label>Email</label><input name="email" type="email" required /></div>
          <div className="field full"><label>Password</label><input name="password" type="password" required /></div>
          <button className="btn btn-primary full">Log in</button>
        </form>
        <p className="muted">No account? <Link href="/signup" style={{textDecoration:'underline'}}>Create one</Link>.</p>
      </div>
    </div></section></>
  );
}
