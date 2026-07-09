import AppShell from '@/components/AppShell';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function ProjectHomePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  if (error || !project) return <AppShell><div className="notice danger">Project not found.</div></AppShell>;
  const cards = [
    { code:'EST-01', title:'Estimate Generator', desc:'Create the branded quote with labour, material, plant, markup and VAT.', href:`/projects/${projectId}/estimate` },
    { code:'VAR-02', title:'Variation Tracker', desc:'Record extra works, values and approval status.', href:`/projects/${projectId}/variations` },
    { code:'DIA-03', title:'Site Diary', desc:'Daily records of labour, weather, deliveries, delays and instructions.', href:`/projects/${projectId}/site-diary` },
    { code:'SNG-04', title:'Snagging List', desc:'Track defects by location, trade, priority and status.', href:`/projects/${projectId}/snags` }
  ];
  return <AppShell>
    <div className="page-title"><div><div className="eyebrow">Project</div><h1>{project.project_name}</h1><p className="muted">Client: {project.client_name} · <Link href="/projects" style={{textDecoration:'underline'}}>back to projects</Link></p></div></div>
    <div className="cards">
      {cards.map(card => <Link className="card" key={card.code} href={card.href}><div className="stat">{card.code}</div><h2>{card.title}</h2><p className="muted">{card.desc}</p><span className="btn btn-ghost">Open tool</span></Link>)}
    </div>
  </AppShell>;
}
