import AppShell from '@/components/AppShell';
import SiteDiary from '@/components/SiteDiary';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function SiteDiaryPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  if (error || !project) return <AppShell><div className="notice danger">Project not found.</div></AppShell>;
  const { data: rows } = await supabase.from('site_diary_entries').select('*').eq('project_id', projectId).eq('owner_id', user.id).order('diary_date', { ascending:false });
  return <AppShell><div className="page-title"><div><div className="eyebrow">DIA-03</div><h1>{project.project_name} — site diary</h1><p className="muted">Client: {project.client_name} · <Link href={`/projects/${projectId}`} style={{textDecoration:'underline'}}>back to project</Link></p></div></div><SiteDiary projectId={projectId} rows={rows || []} /></AppShell>;
}
