import Header from '@/components/Header';

export default function LocalSetupPage() {
  return (
    <><Header /><section className="section grid-bg"><div className="wrap" style={{maxWidth:760}}>
      <div className="card">
        <div className="eyebrow">Local setup</div>
        <h1 style={{fontSize:36, marginBottom:16}}>You got the app running. Next is Supabase.</h1>
        <p className="muted">The public website works without Supabase. Login, company logo upload, projects and saved estimates need Supabase connected.</p>
        <ol className="setup-list">
          <li>Create a free Supabase project.</li>
          <li>Copy the Project URL and anon public key.</li>
          <li>Create a file called <code>.env.local</code> inside the <code>formwork-app</code> folder.</li>
          <li>Paste your keys into it, save, then stop and restart <code>npm.cmd run dev</code>.</li>
        </ol>
        <pre className="code-block">NEXT_PUBLIC_SUPABASE_URL=paste-your-supabase-url-here{`\n`}NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-supabase-anon-key-here</pre>
      </div>
    </div></section></>
  );
}
