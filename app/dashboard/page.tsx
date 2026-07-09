import AppShell from '@/components/AppShell';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const { data: company } = await supabase.from('companies').select('*').eq('owner_id', user.id).maybeSingle();
  const { data: projects } = await supabase.from('projects').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5);
  const { data: subscription } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();

  return (
    <AppShell>
      <div className="page-title"><div><div className="eyebrow">Dashboard</div><h1>My Formwork</h1><p className="muted">Create branded estimates, variations, site diaries and snagging lists from your company profile and project data.</p></div><Link className="btn btn-hivis" href="/projects">Create / open project</Link></div>
      {!company && <div className="notice">First job: add your company logo and details so every estimate looks professional. <Link href="/settings/company" style={{textDecoration:'underline'}}>Set up company profile</Link></div>}
      <div className="cards">
        <div className="card"><div className="stat">COMPANY</div><h2>{company?.name || 'Not set up'}</h2><p className="muted">Logo, address, VAT, payment terms.</p></div>
        <div className="card"><div className="stat">PROJECTS</div><h2>{projects?.length || 0} recent</h2><p className="muted">Each project can hold estimates and future tools.</p></div>
        <div className="card"><div className="stat">ACCESS</div><h2>{subscription?.status || 'Trial / manual'}</h2><p className="muted">Stripe webhook will update this after payment.</p></div>
      </div>
      <div className="card">
        <h2>Recent projects</h2>
        {!projects?.length ? <p className="muted">No projects yet. Create your first estimate job.</p> : <div className="table-wrap"><table className="table"><thead><tr><th>Project</th><th>Client</th><th>Address</th><th></th></tr></thead><tbody>{projects.map((p:any)=><tr key={p.id}><td>{p.project_name}</td><td>{p.client_name}</td><td>{p.project_address}</td><td><Link className="btn btn-ghost" href={`/projects/${p.id}`}>Open job</Link></td></tr>)}</tbody></table></div>}
      </div>
    </AppShell>
  );
}
