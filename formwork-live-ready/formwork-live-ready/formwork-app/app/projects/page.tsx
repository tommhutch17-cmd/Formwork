import AppShell from '@/components/AppShell';
import { requireUser } from '@/lib/requireUser';
import { createProject } from './actions';
import Link from 'next/link';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: company } = await supabase.from('companies').select('*').eq('owner_id', user.id).maybeSingle();
  const { data: projects } = await supabase.from('projects').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });

  return (
    <AppShell>
      <div className="page-title"><div><div className="eyebrow">Projects</div><h1>Jobs and estimates</h1><p className="muted">Each project stores the client details and estimate rows.</p></div></div>
      {!company && <div className="notice">Set up <Link href="/settings/company" style={{textDecoration:'underline'}}>Company Profile</Link> first so paperwork can be branded.</div>}
      {params.error && <div className="notice danger">{params.error}</div>}
      <div className="card">
        <h2>Create new project</h2>
        <form action={createProject} className="form-grid">
          <div className="field"><label>Project name</label><input name="project_name" placeholder="Kitchen reinstatement" required /></div>
          <div className="field"><label>Client name</label><input name="client_name" placeholder="Mrs Smith" required /></div>
          <div className="field full"><label>Project address</label><textarea name="project_address" /></div>
          <div className="field"><label>Client email</label><input name="client_email" type="email" /></div>
          <div className="field"><label>Client address</label><input name="client_address" /></div>
          <button className="btn btn-primary full" disabled={!company}>Create estimate job</button>
        </form>
      </div>
      <div className="card"><h2>Existing projects</h2>
        {!projects?.length ? <p className="muted">No projects yet.</p> : <div className="table-wrap"><table className="table"><thead><tr><th>Project</th><th>Client</th><th>Status</th><th></th></tr></thead><tbody>{projects.map((p:any)=><tr key={p.id}><td>{p.project_name}</td><td>{p.client_name}</td><td><span className="pill">{p.status}</span></td><td><Link className="btn btn-ghost" href={`/projects/${p.id}`}>Open job</Link></td></tr>)}</tbody></table></div>}
      </div>
    </AppShell>
  );
}
