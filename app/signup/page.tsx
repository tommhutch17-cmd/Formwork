import Header from '@/components/Header';
import { signUp } from '@/app/login/actions';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <><Header /><section className="section grid-bg"><div className="wrap" style={{maxWidth:620}}>
      <div className="card">
        <div className="eyebrow">Start</div><h1 style={{fontSize:36, marginBottom:18}}>Create your Formwork account</h1>
        {params.error && <div className="notice danger">{params.error}</div>}
        <form action={signUp} className="form-grid">
          <div className="field full"><label>Your name</label><input name="fullName" required /></div>
          <div className="field full"><label>Email</label><input name="email" type="email" required /></div>
          <div className="field full"><label>Password</label><input name="password" type="password" minLength={6} required /></div>
          <button className="btn btn-primary full">Create account</button>
        </form>
        <div className="notice" style={{marginTop:18}}>After signup, go straight to Company Profile and upload the logo/details that appear on estimates. If you see a Supabase error, go to <a href="/local-setup" style={{textDecoration:'underline'}}>Local setup</a>.</div>
      </div>
    </div></section></>
  );
}
